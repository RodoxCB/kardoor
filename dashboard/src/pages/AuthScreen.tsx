import { FormEvent, useEffect, useMemo, useState } from "react";
import { Link, useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { useAuth, type Area } from "../context/AuthContext";

const areaOptions: Array<{ value: Area; title: string; description: string }> = [
  {
    value: "motorista",
    title: "Motorista",
    description: "Agende adesivações, registre rodagem e gerencie pontos.",
  },
  {
    value: "anunciante",
    title: "Anunciante",
    description: "Crie campanhas, confirme pagamentos e acompanhe métricas.",
  },
  {
    value: "parceiro",
    title: "Parceiro / Adesivador",
    description: "Receba solicitações, confirme check-ins e mantenha o histórico.",
  },
];

const registerFields: Record<
  Area,
  Array<{ name: string; label: string; placeholder?: string; type?: "text" | "email" | "tel" }>
> = {
  motorista: [
    { name: "nome", label: "Nome completo" },
    { name: "documento", label: "CPF ou CNPJ" },
    { name: "veiculo", label: "Veículo (modelo, placa)" },
  ],
  anunciante: [
    { name: "nome", label: "Nome ou empresa" },
    { name: "email", label: "Email corporativo", type: "email" },
  ],
  parceiro: [
    { name: "nome", label: "Nome completo ou empresa" },
    { name: "documento", label: "CPF ou CNPJ" },
    { name: "telefone", label: "Telefone / WhatsApp", type: "tel" },
    { name: "tipoServico", label: "Tipo de serviço", placeholder: "Posto, adesivador, lava-rápido..." },
  ],
};

const emptyForm = {
  nome: "",
  documento: "",
  veiculo: "",
  email: "",
  telefone: "",
  tipoServico: "",
};

const isAreaValue = (value: string | null): value is Area =>
  value === "motorista" || value === "anunciante" || value === "parceiro";

const AuthScreen = () => {
  const { login, register, loading, error, isAuthenticated, area: authArea } = useAuth();
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [mode, setMode] = useState<"login" | "register">("login");
  const [selectedArea, setSelectedArea] = useState<Area>("motorista");
  const [identifier, setIdentifier] = useState("");
  const [formData, setFormData] = useState(emptyForm);
  const [success, setSuccess] = useState<string | null>(null);

  const targetPath = useMemo(() => {
    const state = location.state as { from?: string } | null;
    return state?.from ?? undefined;
  }, [location.state]);

  useEffect(() => {
    const areaFromQuery = searchParams.get("area");
    if (isAreaValue(areaFromQuery)) {
      setSelectedArea(areaFromQuery);
    }
  }, [searchParams]);

  useEffect(() => {
    if (isAuthenticated && authArea === selectedArea) {
      const destination = targetPath ?? `/${selectedArea}`;
      navigate(destination, { replace: true });
    }
  }, [isAuthenticated, authArea, selectedArea, navigate, targetPath]);

  useEffect(() => {
    setIdentifier("");
    setFormData(emptyForm);
    setSuccess(null);
  }, [selectedArea, mode]);

  const handleAreaChange = (area: Area) => {
    setSelectedArea(area);
  };

  const handleFormField = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleLogin = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSuccess(null);
    try {
      await login(selectedArea, identifier);
      setSuccess("Bem-vindo de volta!");
    } catch {
      // Erros são exibidos pelo contexto
    }
  };

  const handleRegister = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSuccess(null);
    const payload =
      selectedArea === "motorista"
        ? {
            area: "motorista" as const,
            nome: formData.nome,
            documento: formData.documento,
            veiculo: formData.veiculo,
          }
        : selectedArea === "anunciante"
        ? {
            area: "anunciante" as const,
            nome: formData.nome,
            email: formData.email,
          }
        : {
            area: "parceiro" as const,
            nome: formData.nome,
            documento: formData.documento,
            telefone: formData.telefone,
            tipoServico: formData.tipoServico,
          };

    try {
      await register(payload);
      setSuccess("Cadastro criado! Estamos te redirecionando.");
    } catch {
      // mensagem exibida pelo contexto
    }
  };

  const identifierLabel = selectedArea === "anunciante" ? "Email" : "CPF ou CNPJ";
  const identifierPlaceholder =
    selectedArea === "anunciante" ? "voce@empresa.com" : "Digite seu documento";

  return (
    <main className="page-container auth-screen">
      <section className="auth-card">
        <header>
          <p className="eyebrow">Área segura</p>
          <h1>Faça login ou cadastre-se</h1>
          <p>
            Acessar os painéis de Motorista, Anunciante e Parceiro exige autenticação.
            Escolha a área, selecione o modo e prossiga.
          </p>
        </header>

        <div className="auth-area-selector">
          {areaOptions.map((option) => (
            <button
              key={option.value}
              type="button"
              className={`area-pill ${selectedArea === option.value ? "active" : ""}`}
              onClick={() => handleAreaChange(option.value)}
            >
              <strong>{option.title}</strong>
              <span>{option.description}</span>
            </button>
          ))}
        </div>

        <div className="auth-mode-tabs">
          <button
            type="button"
            className={mode === "login" ? "active" : ""}
            onClick={() => setMode("login")}
          >
            Login
          </button>
          <button
            type="button"
            className={mode === "register" ? "active" : ""}
            onClick={() => setMode("register")}
          >
            Cadastro
          </button>
        </div>

        {mode === "login" ? (
          <form className="auth-form" onSubmit={handleLogin}>
            <label>
              {identifierLabel}
              <input
                type={selectedArea === "anunciante" ? "email" : "text"}
                value={identifier}
                onChange={(event) => setIdentifier(event.target.value)}
                placeholder={identifierPlaceholder}
                required
                disabled={loading}
              />
            </label>
            <button type="submit" className="primary" disabled={loading}>
              {loading ? "Entrando..." : "Entrar"}
            </button>
          </form>
        ) : (
          <form className="auth-form" onSubmit={handleRegister}>
            {registerFields[selectedArea].map((field) => (
              <label key={field.name}>
                {field.label}
                <input
                  type={field.type ?? "text"}
                  value={formData[field.name as keyof typeof formData]}
                  onChange={(event) => handleFormField(field.name, event.target.value)}
                  placeholder={field.placeholder}
                  required
                  disabled={loading}
                />
              </label>
            ))}
            <button type="submit" className="primary" disabled={loading}>
              {loading ? "Cadastrando..." : "Criar conta"}
            </button>
          </form>
        )}

        {error && <p className="auth-error">{error}</p>}
        {success && <p className="auth-success">{success}</p>}

        <footer className="auth-footer">
          <p>Precisa de ajuda? Visite o <Link to="/">painel inicial</Link> ou fale com o time.</p>
        </footer>
      </section>
    </main>
  );
};

export default AuthScreen;
