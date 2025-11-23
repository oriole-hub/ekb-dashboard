import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BookOpen,
  Search,
  Loader2,
  Calendar,
  User,
  RotateCcw,
  AlertCircle,
  CheckCircle,
  X,
} from 'lucide-react';
import { loansAPI } from '../api/loans';
import EmptyState from '../components/EmptyState';

const Loans = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all'); // all, active, overdue, returned
  const queryClient = useQueryClient();

  const { data: loans, isLoading } = useQuery({
    queryKey: ['loans'],
    queryFn: loansAPI.getAll,
  });

  const returnMutation = useMutation({
    mutationFn: loansAPI.return,
    onSuccess: () => {
      queryClient.invalidateQueries(['loans']);
      queryClient.invalidateQueries(['statsSummary']);
    },
  });

  const filteredLoans = loans?.filter((loan) => {
    const matchesSearch =
      loan.book?.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      loan.book?.author?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      loan.user?.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      loan.user?.email?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesFilter =
      filterStatus === 'all' ||
      (filterStatus === 'active' && loan.status === 'issued') ||
      (filterStatus === 'overdue' && loan.is_overdue) ||
      (filterStatus === 'returned' && loan.status === 'returned');

    return matchesSearch && matchesFilter;
  });

  const formatDate = (dateString) => {
    if (!dateString) return 'Не указано';
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return 'Не указано';
    const date = new Date(dateString);
    return date.toLocaleString('ru-RU', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handleReturn = async (loanId) => {
    if (window.confirm('Вы уверены, что хотите вернуть эту книгу?')) {
      try {
        await returnMutation.mutateAsync(loanId);
      } catch (error) {
        console.error('Ошибка при возврате книги:', error);
      }
    }
  };

  const getStatusBadge = (loan) => {
    if (loan.status === 'returned') {
      return (
        <span className="px-2 py-1 bg-gray-900/30 text-gray-400 rounded-full text-xs font-medium">
          Возвращена
        </span>
      );
    }
    if (loan.is_overdue) {
      return (
        <span className="px-2 py-1 bg-red-900/30 text-red-400 rounded-full text-xs font-medium flex items-center space-x-1">
          <AlertCircle className="w-3 h-3" />
          <span>Просрочена</span>
        </span>
      );
    }
    return (
      <span className="px-2 py-1 bg-green-900/30 text-green-400 rounded-full text-xs font-medium">
        Активна
      </span>
    );
  };

  const activeLoans = loans?.filter((loan) => loan.status === 'issued') || [];
  const overdueLoans = loans?.filter((loan) => loan.is_overdue) || [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl lg:text-4xl font-bold text-white mb-2">
            Взятые книги
          </h1>
          <p className="text-sm lg:text-base text-gray-400">
            Управление выданными книгами
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-4 lg:p-6"
        >
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 lg:w-12 lg:h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
              <BookOpen className="w-5 h-5 lg:w-6 lg:h-6 text-white" />
            </div>
            <div>
              <p className="text-xs lg:text-sm text-gray-400">Всего выдач</p>
              <p className="text-lg lg:text-2xl font-semibold text-white">
                {loans?.length || 0}
              </p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-card p-4 lg:p-6"
        >
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 lg:w-12 lg:h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center">
              <CheckCircle className="w-5 h-5 lg:w-6 lg:h-6 text-white" />
            </div>
            <div>
              <p className="text-xs lg:text-sm text-gray-400">Активных</p>
              <p className="text-lg lg:text-2xl font-semibold text-white">
                {activeLoans.length}
              </p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass-card p-4 lg:p-6"
        >
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 lg:w-12 lg:h-12 bg-gradient-to-br from-red-500 to-red-600 rounded-xl flex items-center justify-center">
              <AlertCircle className="w-5 h-5 lg:w-6 lg:h-6 text-white" />
            </div>
            <div>
              <p className="text-xs lg:text-sm text-gray-400">Просрочено</p>
              <p className="text-lg lg:text-2xl font-semibold text-white">
                {overdueLoans.length}
              </p>
            </div>
          </div>
        </motion.div>
      </div>

      <div className="glass-card p-3 lg:p-4">
        <div className="flex flex-col md:flex-row gap-3 lg:gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 lg:left-4 top-1/2 -translate-y-1/2 w-4 h-4 lg:w-5 lg:h-5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Поиск по книге, автору, пользователю..."
              className="w-full pl-10 lg:pl-12 pr-3 lg:pr-4 py-2 lg:py-3 bg-gray-800 border border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm lg:text-base text-white"
            />
          </div>
          <div className="flex gap-2">
            {['all', 'active', 'overdue', 'returned'].map((status) => (
              <motion.button
                key={status}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setFilterStatus(status)}
                className={`px-3 lg:px-4 py-2 lg:py-2.5 rounded-xl text-xs lg:text-sm font-medium transition-colors ${
                  filterStatus === status
                    ? 'bg-blue-500 hover:bg-blue-600 text-white'
                    : 'bg-gray-800 hover:bg-gray-700 text-gray-300 border border-gray-700'
                }`}
              >
                {status === 'all' && 'Все'}
                {status === 'active' && 'Активные'}
                {status === 'overdue' && 'Просроченные'}
                {status === 'returned' && 'Возвращенные'}
              </motion.button>
            ))}
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
        </div>
      ) : filteredLoans && filteredLoans.length > 0 ? (
        <div className="grid grid-cols-1 gap-4">
          {filteredLoans.map((loan) => (
            <motion.div
              key={loan.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ scale: 1.01 }}
              className="glass-card p-4 lg:p-6"
            >
              <div className="flex flex-col lg:flex-row items-start justify-between gap-4">
                <div className="flex-1 w-full">
                  <div className="flex items-start justify-between mb-3 lg:mb-4">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 lg:space-x-3 mb-2">
                        {loan.book?.url_pic && (
                          <img
                            src={loan.book.url_pic}
                            alt={loan.book.title}
                            className="w-16 h-20 lg:w-20 lg:h-28 object-cover rounded-lg border border-gray-700 flex-shrink-0"
                          />
                        )}
                        <div className="flex-1 min-w-0">
                          <h3 className="text-lg lg:text-xl font-semibold text-white mb-1">
                            {loan.book?.title || 'Неизвестная книга'}
                          </h3>
                          <p className="text-sm lg:text-base text-gray-400 mb-2">
                            {loan.book?.author || 'Автор не указан'}
                          </p>
                          {getStatusBadge(loan)}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 lg:gap-4 mt-3 lg:mt-4">
                        <div className="flex items-center space-x-2">
                          <User className="w-4 h-4 lg:w-5 lg:h-5 text-gray-400 flex-shrink-0" />
                          <div>
                            <p className="text-xs text-gray-400">Пользователь</p>
                            <p className="text-sm font-medium text-white">
                              {loan.user?.full_name || 'Неизвестный'}
                            </p>
                            {loan.user?.email && (
                              <p className="text-xs text-gray-400">
                                {loan.user.email}
                              </p>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center space-x-2">
                          <Calendar className="w-4 h-4 lg:w-5 lg:h-5 text-gray-400 flex-shrink-0" />
                          <div>
                            <p className="text-xs text-gray-400">Дата выдачи</p>
                            <p className="text-sm font-medium text-white">
                              {formatDateTime(loan.issued_at)}
                            </p>
                          </div>
                        </div>

                        {loan.due_date && (
                          <div className="flex items-center space-x-2">
                            <Calendar className="w-4 h-4 lg:w-5 lg:h-5 text-gray-400 flex-shrink-0" />
                            <div>
                              <p className="text-xs text-gray-400">Срок возврата</p>
                              <p
                                className={`text-sm font-medium ${
                                  loan.is_overdue
                                    ? 'text-red-400'
                                    : 'text-white'
                                }`}
                              >
                                {formatDate(loan.due_date)}
                              </p>
                            </div>
                          </div>
                        )}

                        {loan.returned_at && (
                          <div className="flex items-center space-x-2">
                            <CheckCircle className="w-4 h-4 lg:w-5 lg:h-5 text-green-400 flex-shrink-0" />
                            <div>
                              <p className="text-xs text-gray-400">Возвращена</p>
                              <p className="text-sm font-medium text-white">
                                {formatDateTime(loan.returned_at)}
                              </p>
                            </div>
                          </div>
                        )}
                      </div>

                      {loan.book?.isbn && (
                        <div className="mt-3 lg:mt-4 pt-3 lg:pt-4 border-t border-gray-700">
                          <p className="text-xs text-gray-400 mb-1">ISBN</p>
                          <p className="text-xs lg:text-sm font-mono text-gray-300">
                            {loan.book.isbn}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {loan.status === 'issued' && (
                  <div className="flex-shrink-0 self-start lg:self-center">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleReturn(loan.id)}
                      disabled={returnMutation.isPending}
                      className="flex items-center space-x-2 px-4 lg:px-6 py-2.5 lg:py-3 bg-green-500 hover:bg-green-600 text-white rounded-xl text-sm lg:text-base font-medium shadow-lg shadow-green-500/30 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {returnMutation.isPending ? (
                        <>
                          <Loader2 className="w-4 h-4 lg:w-5 lg:h-5 animate-spin" />
                          <span>Возврат...</span>
                        </>
                      ) : (
                        <>
                          <RotateCcw className="w-4 h-4 lg:w-5 lg:h-5" />
                          <span>Вернуть</span>
                        </>
                      )}
                    </motion.button>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <EmptyState
          icon={BookOpen}
          title="Займы не найдены"
          description={
            searchQuery || filterStatus !== 'all'
              ? 'По вашему запросу займы не найдены. Попробуйте изменить параметры поиска или фильтрации.'
              : 'В системе пока нет выданных книг.'
          }
        />
      )}
    </div>
  );
};

export default Loans;

