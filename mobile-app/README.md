## App móvel KMR

App React Native (Expo) com telas para motoristas e parceiros do plano.

- **Motorista**: acompanha contratos, envia geo, acompanha status (DriverDashboard).
- **Parceiro**: confirma início/fim, registra integridade (PartnerChecklist).
- **Integrações**: `api` usa `http://localhost:4000` por padrão.

### Execução local

1. Instale dependências: `npm install`.
2. Inicie o backend para garantir a API.
3. Rode `npm run start` por dentro de `mobile-app/`.
4. Use Expo Go para testar nos dispositivos ou emuladores.

Você pode estender este template com módulos de geofencing e pontos (Firebase/FCM) conforme o plano.
