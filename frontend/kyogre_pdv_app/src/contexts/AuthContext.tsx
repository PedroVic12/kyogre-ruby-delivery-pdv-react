import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  id: number;
  email: string;
  senha: string;
  nome?: string;
  tabela?: string;
  storage?: string;
  [key: string]: any;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isAuthLoading: boolean;
  login: (email: string, senha: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAuthLoading, setIsAuthLoading] = useState(true); // controle de loading da sessão

  useEffect(() => {
    const session = localStorage.getItem('usuarios');
    if (session) {
      const userSession = JSON.parse(session);
      setUser(userSession);
      setIsAuthenticated(true);
      console.log('[AUTH CONTEXT] Sessão restaurada:', userSession);
    }
    setIsAuthLoading(false);
  }, []);

  const login = async (email: string, senha: string): Promise<boolean> => {
    try {
      const response = await fetch("https://raichu-server.up.railway.app/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, senha }),
      });

      console.log("Tentando logar como:", email);

      if (response.ok) {
        const userData = await response.json();

        const userToStore: User = {
          ...userData,
          email: userData.email || email,
          tabela: userData.tabela || 'default_table',
          storage: userData.storage || 'default_bucket',
          nome: userData.user || 'Usuário',
        };

        setUser(userToStore);
        setIsAuthenticated(true);
        console.log("[AUTH CONTEXT] Login efetuado e salvo no Storage:", userToStore);
        localStorage.setItem("usuarios", JSON.stringify(userToStore));

        return true;
      } else {
        console.warn("[AUTH CONTEXT] Login falhou - usuário ou senha inválidos");
        return false;
      }
    } catch (error) {
      console.error("[AUTH CONTEXT] Erro no login:", error);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem("usuarios");
    console.log("[AUTH CONTEXT] Logout realizado com sucesso");
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, isAuthLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth precisa estar dentro de AuthProvider");
  return context;
};
