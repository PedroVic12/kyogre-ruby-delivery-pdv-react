// hooks/useSessionData.ts
import { useEffect, useState } from 'react';

interface SessionData {
  email: string | null;
  tabela: string | null;
  bucket: string | null;
  nome?: string | null;
  [key: string]: any; // caso você queira armazenar mais coisas
}

export function useSessionData(): SessionData {
  const [sessionData, setSessionData] = useState<SessionData>({
    email: null,
    tabela: null,
    bucket: null,
    nome: null,
  });

  useEffect(() => {
    const usuarios = localStorage.getItem('usuarios');
    if (usuarios) {
      const user = JSON.parse(usuarios);
      setSessionData({
        email: user.email || null,
        tabela: user.tabela || null,
        bucket: user.storage || null,
        nome: user.nome || null,
        ...user, // caso você queira acessar todos os campos diretamente
      });
    }
  }, []);

  return sessionData;
}
