import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { BookOpen, Loader2 } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await login(email, password);
    
    if (result.success) {
      navigate('/');
    } else {
      setError(result.error);
    }
    
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-black p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="glass-card p-6 lg:p-8 shadow-2xl">
          <div className="flex justify-center mb-6 lg:mb-8">
            <div className="w-12 h-12 lg:w-16 lg:h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
              <BookOpen className="w-6 h-6 lg:w-8 lg:h-8 text-white" />
            </div>
          </div>

          <h1 className="text-2xl lg:text-3xl font-semibold text-center mb-2 text-white">
            Liba
          </h1>
          <p className="text-center text-sm lg:text-base text-gray-400 mb-6 lg:mb-8">
            Вход в панель администратора
          </p>

          <form onSubmit={handleSubmit} className="space-y-4 lg:space-y-5">
            <div>
              <label
                htmlFor="email"
                className="block text-xs lg:text-sm font-medium text-gray-300 mb-1.5 lg:mb-2"
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-3 py-2.5 lg:px-4 lg:py-3 rounded-xl bg-gray-800 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-sm lg:text-base text-white"
                placeholder="admin@library.ru"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-xs lg:text-sm font-medium text-gray-300 mb-1.5 lg:mb-2"
              >
                Пароль
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-3 py-2.5 lg:px-4 lg:py-3 rounded-xl bg-gray-800 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-sm lg:text-base text-white"
                placeholder="••••••••"
              />
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-2.5 lg:p-3 rounded-xl bg-red-900/20 border border-red-800"
              >
                <p className="text-xs lg:text-sm text-red-400 text-center">
                  {error}
                </p>
              </motion.div>
            )}

            <motion.button
              type="submit"
              disabled={loading}
              whileHover={{ scale: loading ? 1 : 1.02 }}
              whileTap={{ scale: loading ? 1 : 0.98 }}
              className="w-full py-2.5 lg:py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white text-sm lg:text-base font-medium rounded-xl transition-colors shadow-lg shadow-blue-500/30 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 lg:w-5 lg:h-5 mr-2 animate-spin" />
                  Вход...
                </>
              ) : (
                'Войти'
              )}
            </motion.button>
          </form>
        </div>

        <p className="text-center text-xs lg:text-sm text-gray-400 mt-4 lg:mt-6">
          © 2025 Система управления библиотекой
        </p>
      </motion.div>
    </div>
  );
};

export default Login;


