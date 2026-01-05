#!/usr/bin/env bash
set -euo pipefail

# script para inicializar backend, dashboard e app mobile em sequência.
# Também abre os navegadores com as URLs principais para facilitar os testes.

readonly ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
readonly BACKEND_DIR="$ROOT_DIR/backend"
readonly DASHBOARD_DIR="$ROOT_DIR/dashboard"
readonly MOBILE_DIR="$ROOT_DIR/mobile-app"
readonly LOG_PATH="$ROOT_DIR/.cursor/debug.log"
readonly FALLBACK_LOG="/tmp/start-workspace-debug.log"

: > "$FALLBACK_LOG"

log_debug() {
  local hypothesisId=$1
  local location=$2
  local message=$3
  local data=$4
  #region agent log
  local payload
  payload=$(python3 - <<PY
import json, time
payload = {
    "sessionId": "debug-session",
    "runId": "pre-fix",
    "hypothesisId": "$hypothesisId",
    "location": "$location",
    "message": "$message",
    "data": $data,
    "timestamp": int(time.time() * 1000)
}
print(json.dumps(payload))
PY
  )
  #endregion
  if [[ -w "$LOG_PATH" ]]; then
    printf '%s\n' "$payload" >> "$LOG_PATH"
  fi
  printf '%s\n' "$payload" >> "$FALLBACK_LOG"
}

open_browser() {
  local url=$1
  local status=1
  local method=""

  if command -v open >/dev/null 2>&1; then
    if open "$url" >/dev/null 2>&1; then
      status=0
      method="open"
    fi
  fi

  if [[ $status -ne 0 ]] && command -v xdg-open >/dev/null 2>&1; then
    if xdg-open "$url" >/dev/null 2>&1; then
      status=0
      method="xdg-open"
    fi
  fi

  if [[ $status -ne 0 ]] && command -v python3 >/dev/null 2>&1; then
    if PYTHON_OPENER_URL="$url" python3 - <<PY >/dev/null 2>&1; then
import os, sys, webbrowser
url = os.environ["PYTHON_OPENER_URL"]
if not webbrowser.open(url):
    sys.exit(1)
PY
      status=0
      method="python3"
    fi
  fi

  log_debug "H3" "scripts/start-workspace.sh:open_browser" "open attempt" "{\"url\":\"$url\",\"method\":\"$method\",\"status\":$status}"
  return $status
}

open_urls() {
  local url
  for url in "$@"; do
    if ! open_browser "$url"; then
      echo "Não foi possível abrir $url automaticamente."
    fi
  done
}

declare -a PIDS=()

print_header() {
  echo
  printf '=== %s ===\n' "$*"
}

ensure_env_file() {
  local env_exists=0
  if [[ -f "$BACKEND_DIR/.env" ]]; then
    env_exists=1
  fi
  log_debug "H1" "scripts/start-workspace.sh:ensure_env_file" "checking .env" "{\"env_exists\":$env_exists}"
  if [[ ! -f "$BACKEND_DIR/.env" ]]; then
    print_header "✔ .env ausente"
    cp "$BACKEND_DIR/env.example" "$BACKEND_DIR/.env"
    echo "Copiado env.example → backend/.env. Atualize-o antes de subir em produção."
    log_debug "H1" "scripts/start-workspace.sh:ensure_env_file" "copied env.example" "{\"env_exists\":0}"
  fi
}

install_dependencies() {
  if [[ "${SKIP_INSTALL:-}" != "1" ]]; then
    print_header "Instalando dependências"
    npm --prefix "$BACKEND_DIR" install
    npm --prefix "$DASHBOARD_DIR" install
    npm --prefix "$MOBILE_DIR" install
  else
    print_header "Pulando instalação (SKIP_INSTALL=1)"
  fi
}

start_service() {
  local name=$1
  local dir=$2
  shift 2

  print_header "Iniciando $name"
  (
    cd "$dir"
    exec "$@"
  ) &

  local pid=$!
  log_debug "H2" "scripts/start-workspace.sh:start_service" "service started" "{\"name\":\"$name\",\"dir\":\"$dir\",\"command\":\"$*\"}"
  PIDS+=("$pid")
  echo "$name rodando com PID $pid"
  log_debug "H2" "scripts/start-workspace.sh:start_service" "pid recorded" "{\"name\":\"$name\",\"pid\":$pid}"
}

stop_services() {
  print_header "Encerrando serviços"
  for pid in "${PIDS[@]}"; do
    if kill -0 "$pid" >/dev/null 2>&1; then
      kill "$pid"
      wait "$pid"
    fi
  done
}

trap stop_services EXIT

port_in_use() {
  local port=$1
  lsof -i:"$port" >/dev/null 2>&1
}

ensure_env_file
install_dependencies

if port_in_use 4000; then
  print_header "Backend (porta 4000) já está rodando"
else
  start_service "Backend (API)" "$BACKEND_DIR" npm run dev
  sleep 2
fi

if port_in_use 4173; then
  print_header "Dashboard (porta 4173) já está rodando"
else
  start_service "Dashboard (Vite)" "$DASHBOARD_DIR" npm run dev
  sleep 1
fi

if port_in_use 8081 || port_in_use 19000; then
  print_header "App mobile (Expo) já está rodando"
else
  start_service "App mobile (Expo)" "$MOBILE_DIR" npm run start
  sleep 3
fi

print_header "Abrindo navegadores"
log_debug "H3" "scripts/start-workspace.sh:open_urls" "opening browsers" "{\"urls\":[\"http://localhost:4173\",\"http://localhost:19002\",\"http://localhost:4000/dashboard/overview\"]}"
open_urls "http://localhost:4173" "http://localhost:19002" "http://localhost:4000/dashboard/overview"

print_header "Aguardando encerramento manual (⇧⏎ para parar)"
wait
