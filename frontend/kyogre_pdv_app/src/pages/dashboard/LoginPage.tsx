// LoginPageComponent.tsx
import React, { useState } from 'react';
import { Mail, Lock, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom'; // Importe useNavigate

// Refactored USUARIOS data structure for easier access
export const USUARIOS = [
    {
        role: "admin",
        email: "admin@admin",
        senha: "admin",
        table: "cardapio",
        storage: "cardapio_fotos"
    },
    {
        role: "Pedro Victor - The Creator",
        email: "pedrovictor.rveras12@gmail.com",
        senha: "pedro",
        table: "cardapio",
        storage: "cardapio_fotos"
    },
    {
        role: "cliente1",
        email: "gabyltds@icloud.com",
        senha: ""
    },
];

// Optional: Log the users for verification
USUARIOS.forEach(user => {
    console.log(`${user.role}: ${user.email}, ${user.senha}`);
});

interface LoginPageProps { // Define as props do componente
    isDebug: boolean;
    onLoginSuccess: (email: string) => void; // Modifique a definição de onLoginSuccess para aceitar email
}

export const LoginPageComponent: React.FC<LoginPageProps> = ({ isDebug, onLoginSuccess }) => { // LoginPageComponent aceita props agora
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loginError, setLoginError] = useState('');
    const navigate = useNavigate(); // Hook useNavigate

    // Simulated sendEmail function (remains the same)
    const sendEmail = (to: string, subject: string, body: string) => {
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
            // In debug mode, auto-login with the first user found (for simplicity)
            if (USUARIOS.length > 0) {
                const firstUser = USUARIOS[0];
                alert(`Modo Debug: Logado como ${firstUser.email}`);
                onLoginSuccess(firstUser.email);
                if (firstUser.role === 'cliente1') {
                    navigate('/dashboard');
                } else {
                    navigate('/dashboard');
                }
                return;
            }
        } else {
            // Production mode login logic
            let loggedIn = false;
            for (const user of USUARIOS) {
                if (email === user.email) {
                    if (user.role === 'cliente1' && password === "") {
                        onLoginSuccess(user.email);
                        navigate('/dashboard');
                        loggedIn = true;
                        break;
                    } else if (password === user.senha) {
                        onLoginSuccess(user.email);
                        navigate('/dashboard');
                        loggedIn = true;
                        break;
                    }
                }
            }
            if (!loggedIn) {
                setLoginError('Email ou senha incorretos.');
            }
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

        sendEmail(
            email,
            'Recuperação de Senha',
            'Olá,\n\nPara redefinir sua senha, clique no seguinte link (simulado):\n\n[Link de Redefinição Simulado]\n\nSe você não solicitou a recuperação, ignore este email.\n\nObrigado,\nEquipe de Suporte'
        );
        alert(`Email de recuperação de senha enviado para: ${email}`);
        setIsLogin(true);
    };

    return (
        <div className="ml-2 pt-16 min-h-screen bg-gray-50 flex items-center justify-center">
            <div className="w-full max-w-md">
                {isLogin ? (
                    <div className="bg-white p-8 rounded-xl shadow-sm">
                        <h2 className="text-2xl font-bold text-gray-900 mb-6">Login</h2>
                        {loginError && <p className="text-red-500 text-sm mb-2">{loginError}</p>}
                        <form onSubmit={handleLogin} className="space-y-4">
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

export default LoginPageComponent;

