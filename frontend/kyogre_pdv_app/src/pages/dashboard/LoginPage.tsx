// LoginPageComponent.tsx
import React, { useState } from 'react';
import { Mail, Lock, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

interface LoginPageProps {
    isDebug: boolean;
}



export const LoginPageComponent: React.FC<LoginPageProps> = ({ isDebug }) => {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loginError, setLoginError] = useState('');
    const navigate = useNavigate();
    const { login } = useAuth(); // aqui usamos o login do contexto

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoginError('');

        if (isDebug) {
            console.log(`[DEBUG] Login simulado: ${email}`);
            await login(email, password); // simula mesmo assim
            navigate('/dashboard');
            return;
        }

        if (!email || !password) {
            setLoginError('Preencha todos os campos');
            return;
        }

        const success = await login(email, password);
        if (success) {
            console.log(`\n[LOGIN] Sucesso como: ${email}`);
            alert("Bem vindo, " + email + " !")
            navigate('/dashboard');
        } else {
            setLoginError('Login inválido');
        }
    };

    const handleForgotPassword = (e: React.FormEvent) => {
        e.preventDefault();
        if (!email) {
            setLoginError('Informe seu email para recuperação.');
            return;
        }

        alert(`Email de recuperação enviado para: ${email}`);
        setIsLogin(true);
    };

    return (
        <div className="ml-2 pt-16 min-h-screen bg-gray-50 flex items-center justify-center">
            <div className="w-full max-w-md">
                {isLogin ? (
                    <div className="bg-white p-8 rounded-xl shadow-sm">
                        <h2 className="text-2xl font-bold text-gray-900 mb-6">Login</h2>
                        {loginError && <h2 className="text-red-500 text-sm mb-2">{loginError}</h2>}
                        <form onSubmit={handleLogin} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
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
                                <label className="block text-sm font-medium text-gray-700 mb-1">Senha</label>
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
                                className="w-full bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 flex items-center justify-center gap-2"
                            >
                                Entrar <ArrowRight className="h-4 w-4" />
                            </button>
                        </form>
                    </div>
                ) : (
                    <div className="bg-white p-8 rounded-xl shadow-sm">
                        <h2 className="text-2xl font-bold text-gray-900 mb-6">Recuperar Senha</h2>
                        {loginError && <p className="text-red-500 text-sm mb-2">{loginError}</p>}
                        <form onSubmit={handleForgotPassword} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                <div className="relative">
                                    <input
                                        type="email"
                                        className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                    />
                                    <Mail className="h-5 w-5 text-gray-400 absolute left-3 top-2.5" />
                                </div>
                            </div>
                            <button
                                type="submit"
                                className="w-full bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700"
                            >
                                Enviar link de recuperação
                            </button>
                            <button
                                type="button"
                                onClick={() => setIsLogin(true)}
                                className="w-full text-sm text-purple-600 hover:text-purple-700"
                            >
                                Voltar para login
                            </button>
                        </form>
                    </div>
                )}
            </div>
        </div>
    );
};

export default LoginPageComponent;
