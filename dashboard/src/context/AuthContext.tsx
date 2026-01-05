import { createContext, PropsWithChildren, useContext, useEffect, useMemo, useState } from "react";
import api from "../services/api";

export type Area = "motorista" | "anunciante" | "parceiro";

type SessionResponse = {
  area: Area;
  profile: Record<string, unknown>;
  token: string;
  expiresIn: number;
};

type StoredSession = SessionResponse & {
  expiresAt: number;
};

type AuthState = StoredSession | null;

type RegisterPayload =
  | ({ area: "motorista" } & { nome: string; documento: string; veiculo: string })
  | ({ area: "anunciante" } & { nome: string; email: string })
  | ({ area: "parceiro" } & {
      nome: string;
      documento: string;
      telefone: string;
      tipoServico?: string;
    });

type AuthContextValue = {
  area: Area | null;
  profile: Record<string, unknown> | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
  login: (area: Area, identifier: string) => Promise<void>;
  register: (payload: RegisterPayload) => Promise<void>;
  logout: () => void;
  isSessionValid: (area?: Area) => boolean;
};

const STORAGE_KEY = "kmr-auth-session";

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const buildStoredSession = (payload: SessionResponse): StoredSession => ({
  ...payload,
  expiresAt: Date.now() + payload.expiresIn * 1000,
});

const hydrateSession = (): AuthState => {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    return null;
  }

  try {
    const parsed: StoredSession = JSON.parse(raw);
    if (parsed.expiresAt > Date.now()) {
      return parsed;
    }
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    localStorage.removeItem(STORAGE_KEY);
  }

  return null;
};

export const AuthProvider = ({ children }: PropsWithChildren) => {
  const [session, setSession] = useState<AuthState>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const cached = hydrateSession();
    setSession(cached);
  }, []);

  const persistSession = (payload: SessionResponse) => {
    const stored = buildStoredSession(payload);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(stored));
    setSession(stored);
  };

  const clearSession = () => {
    localStorage.removeItem(STORAGE_KEY);
    setSession(null);
  };

  const login = async (area: Area, identifier: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.post<SessionResponse>("/auth/login", { area, identifier });
      persistSession(response.data);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Não foi possível fazer login";
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const register = async (payload: RegisterPayload) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.post<SessionResponse>("/auth/register", payload);
      persistSession(response.data);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Não foi possível se cadastrar";
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    clearSession();
  };

  const isSessionValid = (area?: Area) => {
    if (!session) {
      return false;
    }
    if (session.expiresAt <= Date.now()) {
      clearSession();
      return false;
    }
    if (area && session.area !== area) {
      return false;
    }
    return true;
  };

  const value = useMemo<AuthContextValue>(
    () => ({
      area: session?.area ?? null,
      profile: session?.profile ?? null,
      token: session?.token ?? null,
      isAuthenticated: isSessionValid(),
      loading,
      error,
      login,
      register,
      logout,
      isSessionValid,
    }),
    [session, loading, error, isSessionValid],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth precisa ser usado dentro do AuthProvider");
  }
  return context;
};
