// LoginPageComponent.tsx (anteriormente LoginPage.tsx e renomeado para LoginPageComponent para App.tsx usar como LoginPageComponent)
import React, { useState } from 'react';
import { Mail, Lock, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom'; // Importe useNavigate

interface LoginPageProps { // Define as props do componente
    isDebug: boolean;
    onLoginSuccess: () => void;
}

// User data
const userData = {
    "email": "pedrovictor.rveras12@gmail.com",
    "senha": "admin"
};

// Superuser credentials
const superuserEmail = "admin@admin";
const superuserPassword = "admin";



export const LoginPageComponent: React.FC<LoginPageProps> = ({ isDebug, onLoginSuccess }) => { // LoginPageComponent aceita props agora
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loginError, setLoginError] = useState('');
    const navigate = useNavigate(); // Hook useNavigate

    
    // Simulated sendEmail function
    const sendEmail = (to: string, subject: string, body: string) => {
      // ... (mesma implementação de sendEmail) ...
      if (!isDebug) {
          alert(`Simulando envio de email:\nPara: ${to}\nAssunto: ${subject}\nCorpo: ${body}`);
      } else {
          console.log(`Modo Debug: Email Simulado - Para: ${to}, Assunto: ${subject}`);
      }
    };

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        setLoginError('');

        if (isDebug) {
            handleDebugLogin(); // Usa handleDebugLogin localmente
            return;
        }

        if (email === superuserEmail && password === superuserPassword) {
            alert("Login de Superusuário Bem-sucedido!");
            onLoginSuccess(); // Chama a prop onLoginSuccess para atualizar o estado de autenticação em App.tsx
            navigate('/dashboard');
            return;
        }

        if (email === userData.email && password === userData.senha) {
            alert("Login Bem-sucedido!");
            onLoginSuccess(); // Chama a prop onLoginSuccess
            navigate('/dashboard');
        } else {
            setLoginError('Email ou senha incorretos.');
        }
    };


    const handleForgotPassword = (e: React.FormEvent) => {
        e.preventDefault();
        if (!email) {
            setLoginError('Por favor, insira seu email para recuperação de senha.');
            return;
        }

        if (isDebug) {
            alert(`Modo Debug: Recuperação de senha simulada para: ${email}`);
            setIsLogin(true);
            return;
        }


        // In production mode, simulate sending a password reset link to the email
        sendEmail(
            email,
            'Recuperação de Senha',
            'Olá,\n\nPara redefinir sua senha, clique no seguinte link (simulado):\n\n[Link de Redefinição Simulado]\n\nSe você não solicitou a recuperação, ignore este email.\n\nObrigado,\nEquipe de Suporte'
        );
        alert(`Email de recuperação de senha enviado para: ${email}`);
        setIsLogin(true);
    };


    const handleDebugLogin = () => { // Mantém handleDebugLogin local para LoginPageComponent
        alert(`Modo Debug: Logado como ${userData.email}`);
        onLoginSuccess(); // Simula login bem-sucedido e atualiza o estado em App.tsx
        navigate('/dashboard'); // Redireciona para /dashboard
    };


    return (
        <div className="ml-2 pt-16 min-h-screen bg-gray-50 flex items-center justify-center">
            <div className="w-full max-w-md">
                {isLogin ? (
                    <div className="bg-white p-8 rounded-xl shadow-sm">
                        <h2 className="text-2xl font-bold text-gray-900 mb-6">Login</h2>
                        {loginError && <p className="text-red-500 text-sm mb-2">{loginError}</p>}
                        <form onSubmit={handleLogin} className="space-y-4">
                            {/* ... seu formulário de login existente ... */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Email
                                </label>
                                <div className="relative">
                                    <input
                                        type="email"
                                        className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
                                        placeholder="seu@email.com"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                    />
                                    <Mail className="h-5 w-5 text-gray-400 absolute left-3 top-2.5" />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Senha
                                </label>
                                <div className="relative">
                                    <input
                                        type="password"
                                        className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
                                        placeholder="••••••••"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                    />
                                    <Lock className="h-5 w-5 text-gray-400 absolute left-3 top-2.5" />
                                </div>
                            </div>

                            <button
                                type="button"
                                onClick={() => setIsLogin(false)}
                                className="text-sm text-purple-600 hover:text-purple-700"
                            >
                                Esqueci minha senha
                            </button>

                            <button
                                type="submit"
                                className="w-full bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 transition-colors flex items-center justify-center gap-2"
                            >
                                Entrar
                                <ArrowRight className="h-4 w-4" />
                            </button>
                        </form>
                    </div>
                ) : (
                    <div className="bg-white p-8 rounded-xl shadow-sm">
                        <h2 className="text-2xl font-bold text-gray-900 mb-6">Recuperar Senha</h2>
                        {loginError && <p className="text-red-500 text-sm mb-2">{loginError}</p>}
                        <form onSubmit={handleForgotPassword} className="space-y-4">
                            {/* ... seu formulário de recuperação de senha existente ... */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Email
                                </label>
                                <div className="relative">
                                    <input
                                        type="email"
                                        className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
                                        placeholder="seu@email.com"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                    />
                                    <Mail className="h-5 w-5 text-gray-400 absolute left-3 top-2.5" />
                                </div>
                            </div>

                            <button
                                type="submit"
                                className="w-full bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 transition-colors"
                            >
                                Enviar link de recuperação
                            </button>

                            <button
                                type="button"
                                onClick={() => setIsLogin(true)}
                                className="w-full text-sm text-purple-600 hover:text-purple-700"
                            >
                                Voltar para o login
                            </button>
                        </form>
                    </div>
                )}
            </div>
        </div>
    );
};


export default LoginPageComponent; // Exporta LoginPageComponent agora