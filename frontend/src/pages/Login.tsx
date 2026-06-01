import { useState, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Loader2 } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email, password);
      navigate('/');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Erro ao fazer login');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-surface-950 relative overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-surface-800/40 rounded-full blur-[120px]" />
      </div>

      <div className="relative w-full max-w-[420px] mx-6 animate-slide-up">
        <div className="text-center mb-10">
          <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center mx-auto mb-5">
            <span className="text-surface-950 text-xl font-bold">S</span>
          </div>
          <h1 className="text-[28px] font-semibold text-white tracking-tight">
            Bem-vindo de volta
          </h1>
          <p className="text-surface-500 text-sm mt-2">Acesse o painel administrativo</p>
        </div>

        <div className="bg-surface-0 rounded-2xl shadow-modal p-8">
          {error && (
            <div className="bg-red-50 text-red-600 px-4 py-3 rounded-lg text-sm mb-6 border border-red-100">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-[11px] font-medium text-surface-400 uppercase tracking-widest mb-2">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input py-3"
                placeholder="seu@email.com"
                required
              />
            </div>

            <div>
              <label className="block text-[11px] font-medium text-surface-400 uppercase tracking-widest mb-2">
                Senha
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input py-3"
                placeholder="Digite sua senha"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-3 mt-2"
            >
              {loading ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Entrando...
                </>
              ) : (
                'Entrar'
              )}
            </button>
          </form>
        </div>

        <p className="text-center text-[12px] text-surface-600 mt-8">
          Teste com{' '}
          <span className="text-surface-400 font-mono">admin@sistema.com</span>
          {' / '}
          <span className="text-surface-400 font-mono">admin123</span>
        </p>
      </div>
    </div>
  );
}
