import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import {
  Users,
  AlertCircle,
  Search,
  Loader2,
  Mail,
  Calendar,
  BookOpen,
} from 'lucide-react';
import { adminAPI } from '../api/admin';
import EmptyState from '../components/EmptyState';

const UsersPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterOverdue, setFilterOverdue] = useState(false);

  const { data: users, isLoading } = useQuery({
    queryKey: ['users'],
    queryFn: adminAPI.getAllUsers,
  });

  const filteredUsers = users?.filter((user) => {
    const matchesSearch =
      user.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.barcode?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesOverdue = filterOverdue ? user.overdue_loans > 0 : true;

    return matchesSearch && matchesOverdue;
  });

  const formatDate = (dateString) => {
    if (!dateString) return 'Не указано';
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl lg:text-4xl font-bold text-white mb-2">Гости</h1>
          <p className="text-sm lg:text-base text-gray-400">Список всех зарегистрированных пользователей</p>
        </div>
      </div>

      <div className="glass-card p-3 lg:p-4">
        <div className="flex flex-col md:flex-row gap-3 lg:gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 lg:left-4 top-1/2 -translate-y-1/2 w-4 h-4 lg:w-5 lg:h-5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Поиск по имени, email, штрих-коду..."
              className="w-full pl-10 lg:pl-12 pr-3 lg:pr-4 py-2 lg:py-3 bg-gray-800 border border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm lg:text-base text-white"
            />
          </div>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setFilterOverdue(!filterOverdue)}
            className={`px-4 lg:px-6 py-2.5 lg:py-3 rounded-xl text-sm lg:text-base font-medium transition-colors flex items-center space-x-2 ${
              filterOverdue
                ? 'bg-red-500 hover:bg-red-600 text-white'
                : 'bg-gray-800 hover:bg-gray-700 text-gray-300 border border-gray-700'
            }`}
          >
            <AlertCircle className="w-4 h-4 lg:w-5 lg:h-5" />
            <span>Только с просрочками</span>
          </motion.button>
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
        </div>
      ) : filteredUsers && filteredUsers.length > 0 ? (
        <div className="grid grid-cols-1 gap-4">
          {filteredUsers.map((user) => (
            <motion.div
              key={user.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ scale: 1.01 }}
              className="glass-card p-4 lg:p-6"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 lg:space-x-3 mb-2 lg:mb-3">
                    <div className="w-10 h-10 lg:w-12 lg:h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                      <Users className="w-5 h-5 lg:w-6 lg:h-6 text-white" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="text-lg lg:text-xl font-semibold text-white mb-1">
                        {user.full_name}
                      </h3>
                      <div className="flex items-center space-x-2 text-xs lg:text-sm text-gray-400">
                        <Mail className="w-3.5 h-3.5 lg:w-4 lg:h-4 flex-shrink-0" />
                        <span className="truncate">{user.email}</span>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 lg:gap-4 mt-3 lg:mt-4">
                    <div className="flex items-center space-x-1.5 lg:space-x-2">
                      <BookOpen className="w-3.5 h-3.5 lg:w-4 lg:h-4 text-blue-400 flex-shrink-0" />
                      <div>
                        <p className="text-xs text-gray-400">Активных выдач</p>
                        <p className="text-sm font-medium text-white">
                          {user.active_loans || 0}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-1.5 lg:space-x-2">
                      <AlertCircle
                        className={`w-3.5 h-3.5 lg:w-4 lg:h-4 flex-shrink-0 ${
                          user.overdue_loans > 0
                            ? 'text-red-400'
                            : 'text-gray-400'
                        }`}
                      />
                      <div>
                        <p className="text-xs text-gray-400">Просрочено</p>
                        <p
                          className={`text-sm font-medium ${
                            user.overdue_loans > 0
                              ? 'text-red-400'
                              : 'text-white'
                          }`}
                        >
                          {user.overdue_loans || 0}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-1.5 lg:space-x-2">
                      <Calendar className="w-3.5 h-3.5 lg:w-4 lg:h-4 text-gray-400 flex-shrink-0" />
                      <div>
                        <p className="text-xs text-gray-400">Всего выдач</p>
                        <p className="text-sm font-medium text-white">
                          {user.total_loans || 0}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-1.5 lg:space-x-2">
                      <div className="w-3.5 h-3.5 lg:w-4 lg:h-4" />
                      <div>
                        <p className="text-xs text-gray-400">Возвращено</p>
                        <p className="text-sm font-medium text-white">
                          {user.returned_loans || 0}
                        </p>
                      </div>
                    </div>
                  </div>

                  {user.barcode && (
                    <div className="mt-2 lg:mt-3 pt-2 lg:pt-3 border-t border-gray-700">
                      <p className="text-xs text-gray-400 mb-1">Штрих-код</p>
                      <p className="text-xs lg:text-sm font-mono text-gray-300 break-all">
                        {user.barcode}
                      </p>
                    </div>
                  )}

                  {user.last_book_title && (
                    <div className="mt-2 lg:mt-3 pt-2 lg:pt-3 border-t border-gray-700">
                      <p className="text-xs text-gray-400 mb-1">
                        Последняя выдача
                      </p>
                      <p className="text-xs lg:text-sm text-white">
                        {user.last_book_title}
                        {user.last_book_author && (
                          <span className="text-gray-400 ml-1 lg:ml-2">
                            — {user.last_book_author}
                          </span>
                        )}
                      </p>
                      {user.last_loan_date && (
                        <p className="text-xs text-gray-400 mt-1">
                          {formatDate(user.last_loan_date)}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <EmptyState
          icon={Users}
          title="Пользователи не найдены"
          description={
            searchQuery || filterOverdue
              ? 'Попробуйте изменить параметры поиска или фильтрации'
              : 'В системе пока нет зарегистрированных пользователей'
          }
        />
      )}
    </div>
  );
};

export default UsersPage;


