import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import {
  UserPlus,
  X,
  Loader2,
  CheckCircle,
  Mail,
  Lock,
  User,
  Shield,
} from 'lucide-react';
import { adminAPI } from '../api/admin';

const RegisterStaff = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    full_name: '',
    role: 'worker',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (data) => adminAPI.registerStaff(data),
    onSuccess: () => {
      setSuccess(true);
      setFormData({
        email: '',
        password: '',
        full_name: '',
        role: 'worker',
      });
      setTimeout(() => setSuccess(false), 3000);
    },
    onError: (err) => {
      const errorData = err.response?.data;
      if (errorData?.detail && Array.isArray(errorData.detail)) {
        const errorMessages = errorData.detail.map((error) => {
          const field = error.loc?.[error.loc.length - 1] || 'поле';
          return `${field}: ${error.msg}`;
        });
        setError(errorMessages.join('\n'));
      } else {
        setError(
          errorData?.detail ||
            errorData?.message ||
            'Ошибка при регистрации работника'
        );
      }
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    const submitData = {
      email: formData.email.trim(),
      password: formData.password,
      full_name: formData.full_name.trim(),
      role: formData.role,
    };

    if (!submitData.email || !submitData.password || !submitData.full_name) {
      setError('Пожалуйста, заполните все обязательные поля');
      return;
    }

    mutation.mutate(submitData);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl lg:text-4xl font-bold text-white mb-2">
          Регистрация работников
        </h1>
        <p className="text-sm lg:text-base text-gray-400">
          Создание нового аккаунта для сотрудника библиотеки
        </p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card p-4 lg:p-8 max-w-2xl"
      >
        <form onSubmit={handleSubmit} className="space-y-4 lg:space-y-5">
          <div>
            <label className="block text-xs lg:text-sm font-medium text-gray-300 mb-1.5 lg:mb-2 flex items-center space-x-2">
              <User className="w-3.5 h-3.5 lg:w-4 lg:h-4" />
              <span>Полное имя *</span>
            </label>
            <input
              type="text"
              value={formData.full_name}
              onChange={(e) =>
                setFormData({ ...formData, full_name: e.target.value })
              }
              required
              className="w-full px-3 py-2.5 lg:px-4 lg:py-3 bg-gray-800 border border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm lg:text-base text-white"
              placeholder="Иван Иванов"
            />
          </div>

          <div>
            <label className="block text-xs lg:text-sm font-medium text-gray-300 mb-1.5 lg:mb-2 flex items-center space-x-2">
              <Mail className="w-3.5 h-3.5 lg:w-4 lg:h-4" />
              <span>Email *</span>
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              required
              className="w-full px-3 py-2.5 lg:px-4 lg:py-3 bg-gray-800 border border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm lg:text-base text-white"
              placeholder="worker@library.ru"
            />
          </div>

          <div>
            <label className="block text-xs lg:text-sm font-medium text-gray-300 mb-1.5 lg:mb-2 flex items-center space-x-2">
              <Lock className="w-3.5 h-3.5 lg:w-4 lg:h-4" />
              <span>Пароль *</span>
            </label>
            <input
              type="password"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              required
              minLength={1}
              className="w-full px-3 py-2.5 lg:px-4 lg:py-3 bg-gray-800 border border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm lg:text-base text-white"
              placeholder="Минимум 1 символ"
            />
          </div>

          <div>
            <label className="block text-xs lg:text-sm font-medium text-gray-300 mb-1.5 lg:mb-2 flex items-center space-x-2">
              <Shield className="w-3.5 h-3.5 lg:w-4 lg:h-4" />
              <span>Роль *</span>
            </label>
            <select
              value={formData.role}
              onChange={(e) =>
                setFormData({ ...formData, role: e.target.value })
              }
              className="w-full px-3 py-2.5 lg:px-4 lg:py-3 bg-gray-800 border border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm lg:text-base text-white"
            >
              <option value="worker">Работник</option>
              <option value="admin">Администратор</option>
            </select>
            <p className="text-xs text-gray-400 mt-1">
              Работник может управлять книгами и мероприятиями. Администратор
              имеет полный доступ.
            </p>
          </div>

          {error && (
            <div className="p-2.5 lg:p-3 rounded-xl bg-red-900/20 border border-red-800">
              <p className="text-xs lg:text-sm text-red-400 whitespace-pre-line">
                {error}
              </p>
            </div>
          )}

          {success && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-2.5 lg:p-3 rounded-xl bg-green-900/20 border border-green-800"
            >
              <p className="text-xs lg:text-sm text-green-400 flex items-center space-x-2">
                <CheckCircle className="w-3.5 h-3.5 lg:w-4 lg:h-4" />
                <span>Работник успешно зарегистрирован!</span>
              </p>
            </motion.div>
          )}

          <div className="pt-3 lg:pt-4">
            <motion.button
              type="submit"
              disabled={mutation.isPending}
              whileHover={{ scale: mutation.isPending ? 1 : 1.02 }}
              whileTap={{ scale: mutation.isPending ? 1 : 0.98 }}
              className="w-full py-2.5 lg:py-3 px-4 bg-blue-500 hover:bg-blue-600 text-white text-sm lg:text-base font-medium rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {mutation.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 lg:w-5 lg:h-5 mr-2 animate-spin" />
                  Регистрация...
                </>
              ) : (
                <>
                  <UserPlus className="w-4 h-4 lg:w-5 lg:h-5 mr-2" />
                  Зарегистрировать работника
                </>
              )}
            </motion.button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default RegisterStaff;


