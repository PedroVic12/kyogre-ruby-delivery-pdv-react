import axios from 'axios';
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
  token: string | null; // Adicione esta linha
  //fetchSecure: (endpoint: string) => Promise<any>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAuthLoading, setIsAuthLoading] = useState(true); // controle de loading da sessão
  const [token, setToken] = useState<string | null>(null);


  useEffect(() => {
    const session = localStorage.getItem('usuarios');
    if (session) {
      const userSession = JSON.parse(session);
      setUser(userSession);
      setIsAuthenticated(true);
      setToken(userSession.access_token || null); // Tenta pegar o token da sessão restaurada
      console.log('[AUTH CONTEXT] Sessão restaurada:', userSession);
    }
    setIsAuthLoading(false);
  }, []);

  const fetchSecureGet = async (endpoint: string) => {
    try {
      const response = await axios.get(`/api${endpoint}`, {
        headers: {
          Authorization: `Bearer ${token}`, // Use o token do estado
        },
      });
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        setUser(null);
        setToken(null);
      }
      throw error;
    }
  };
  const fetchSecurePost = async (endpoint: string, data: any) => {
    try {
      const response = await axios.post(`/api${endpoint}`, data, {
        headers: {
          Authorization: `Bearer ${token}`, // Use o token do estado
        },
      });
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        setUser(null);
        setToken(null);
      }
      throw error;
    }
  };

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

        //console.log("\n[AUTH CONTEXT] Dados do usuário:", userData);
        const token_login = userData.access_token; 
        //console.log("[AUTH CONTEXT] Token recebido:", token_login);
        if (!token_login) {
          console.warn("[AUTH CONTEXT] Token de acesso não encontrado na resposta.");
          return false;
        }
    

        // Salva os dados do login no storage para SESSION 1 (dev)
        const userToStore: User = {
          ...userData,
          email: userData.email || email,
          tabela: userData.tabela || 'default_table',
          storage: userData.storage || 'default_bucket',
          nome: userData.user || 'Usuário',
          access_token: token_login, // Adicione o token ao objeto do usuário no localStorage
        };

        setUser(userToStore);
        setIsAuthenticated(true);
        setToken(token_login);
        localStorage.setItem("usuarios", JSON.stringify(userToStore));
        console.log("[AUTH CONTEXT] Login efetuado e salvo no Storage:");
        console.log(userToStore);

        axios.defaults.headers.common['Authorization'] = `Bearer ${token_login}`; // Configura o token padrão para todas as requisições
        axios.defaults.headers.common['Content-Type'] = 'application/json'; // Adiciona o header Content-Type padrão

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
    setToken(null); // Limpe o token ao fazer logout
    localStorage.removeItem("usuarios");
    console.log("[AUTH CONTEXT] Logout realizado com sucesso");
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, isAuthLoading, login, logout, token }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth precisa estar dentro de AuthProvider");
  return context;
};