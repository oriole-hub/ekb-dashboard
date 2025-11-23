import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import {
  BookOpen,
  Users,
  TrendingUp,
  AlertCircle,
  MapPin,
  Clock,
  Phone,
} from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
} from 'recharts';
import { mockAPI } from '../api/mock';
import { statsAPI } from '../api/stats';

const Dashboard = () => {
  const { data: libraryInfo } = useQuery({
    queryKey: ['libraryInfo'],
    queryFn: mockAPI.getLibraryInfo,
  });

  const { data: stats } = useQuery({
    queryKey: ['statsSummary'],
    queryFn: statsAPI.getSummary,
  });

  const today = new Date();
  const fromDate = new Date(today);
  fromDate.setDate(fromDate.getDate() - 30);
  
  const { data: activityData } = useQuery({
    queryKey: ['activityStats', fromDate.toISOString().split('T')[0], today.toISOString().split('T')[0]],
    queryFn: () => statsAPI.getActivity(
      fromDate.toISOString().split('T')[0],
      today.toISOString().split('T')[0]
    ),
  });

  const statCards = [
    {
      title: 'Всего книг',
      value: stats?.total_books || 0,
      icon: BookOpen,
      color: 'blue',
      change: `+${stats?.new_books || 0} новых`,
    },
    {
      title: 'Активные выдачи',
      value: stats?.active_loans || 0,
      icon: TrendingUp,
      color: 'green',
      change: 'В данный момент',
    },
    {
      title: 'Пользователи',
      value: stats?.total_users || 0,
      icon: Users,
      color: 'purple',
      change: 'Зарегистрировано',
    },
    {
      title: 'Просрочено',
      value: stats?.overdue_loans || 0,
      icon: AlertCircle,
      color: 'red',
      change: 'Требует внимания',
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  const formatWorkHours = (workHours) => {
    if (!workHours) return '';
    
    const dayMap = {
      'Понедельник': 'Пн',
      'Вторник': 'Вт',
      'Среда': 'Ср',
      'Четверг': 'Чт',
      'Пятница': 'Пт',
      'Суббота': 'Сб',
      'Воскресенье': 'Вс',
    };

    const lines = workHours.split('\n').map(line => {
      let formattedLine = line;
      Object.entries(dayMap).forEach(([full, short]) => {
        formattedLine = formattedLine.replace(full, short);
      });
      return formattedLine;
    });

    const firstRow = lines.slice(0, 4);
    const secondRow = lines.slice(4);

    return { firstRow, secondRow };
  };

  const workHoursFormatted = libraryInfo?.workHours ? formatWorkHours(libraryInfo.workHours) : null;

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      <motion.div variants={itemVariants}>
        <h1 className="text-2xl lg:text-4xl font-bold text-white mb-2">
          Дашборд
        </h1>
        <p className="text-sm lg:text-base text-gray-400">
          Обзор состояния библиотеки
        </p>
      </motion.div>

      <motion.div variants={itemVariants} className="glass-card p-4 lg:p-6">
        <h2 className="text-lg lg:text-xl font-semibold text-white mb-3 lg:mb-4">
          {libraryInfo?.name}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 lg:gap-4">
          <div className="flex items-start space-x-2 lg:space-x-3">
            <MapPin className="w-4 h-4 lg:w-5 lg:h-5 text-blue-500 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-xs lg:text-sm font-medium text-gray-300">
                Адрес
              </p>
              <p className="text-xs lg:text-sm text-gray-400">
                {libraryInfo?.address}
              </p>
            </div>
          </div>
          <div className="flex items-start space-x-2 lg:space-x-3">
            <Clock className="w-4 h-4 lg:w-5 lg:h-5 text-blue-500 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-xs lg:text-sm font-medium text-gray-300 mb-1">
                Часы работы
              </p>
              {workHoursFormatted ? (
                <div className="space-y-0.5">
                  <p className="text-xs lg:text-sm text-gray-400 leading-tight">
                    {workHoursFormatted.firstRow.join(' ')}
                  </p>
                  {workHoursFormatted.secondRow.length > 0 && (
                    <p className="text-xs lg:text-sm text-gray-400 leading-tight">
                      {workHoursFormatted.secondRow.join(' ')}
                    </p>
                  )}
                </div>
              ) : (
                <p className="text-xs lg:text-sm text-gray-400">
                  Не указано
                </p>
              )}
            </div>
          </div>
          <div className="flex items-start space-x-2 lg:space-x-3">
            <Phone className="w-4 h-4 lg:w-5 lg:h-5 text-blue-500 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-xs lg:text-sm font-medium text-gray-300">
                Телефон
              </p>
              <p className="text-xs lg:text-sm text-gray-400">
                {libraryInfo?.phone}
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        {statCards.map((card, index) => {
          const colorClasses = {
            blue: {
              bg: 'bg-blue-500/10',
              text: 'text-blue-500',
            },
            green: {
              bg: 'bg-green-500/10',
              text: 'text-green-500',
            },
            purple: {
              bg: 'bg-purple-500/10',
              text: 'text-purple-500',
            },
            red: {
              bg: 'bg-red-500/10',
              text: 'text-red-500',
            },
          };
          
          const colors = colorClasses[card.color];
          
          return (
            <motion.div
              key={card.title}
              variants={itemVariants}
              whileHover={{ scale: 1.02, y: -5 }}
              className="glass-card p-4 lg:p-6 cursor-pointer"
            >
              <div className="flex items-center justify-between mb-3 lg:mb-4">
                <div
                  className={`w-10 h-10 lg:w-12 lg:h-12 rounded-xl ${colors.bg} flex items-center justify-center`}
                >
                  <card.icon className={`w-5 h-5 lg:w-6 lg:h-6 ${colors.text}`} />
                </div>
              </div>
              <h3 className="text-xs lg:text-sm font-medium text-gray-400 mb-1">
                {card.title}
              </h3>
              <p className="text-2xl lg:text-3xl font-bold text-white mb-2">
                {card.value.toLocaleString('ru-RU')}
              </p>
              <p className="text-xs text-gray-500">
                {card.change}
              </p>
            </motion.div>
          );
        })}
      </div>

      <motion.div variants={itemVariants} className="glass-card p-4 lg:p-6">
        <h2 className="text-lg lg:text-xl font-semibold text-white mb-4 lg:mb-6">
          Статистика выдачи и возврата книг
        </h2>
        <div className="h-64 lg:h-80">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={activityData}>
              <defs>
                <linearGradient id="colorIssued" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorReturned" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
              <XAxis
                dataKey="date"
                tick={{ fontSize: 12 }}
                tickFormatter={(value) => {
                  const date = new Date(value);
                  return `${date.getDate()}.${date.getMonth() + 1}`;
                }}
              />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(255, 255, 255, 0.9)',
                  border: 'none',
                  borderRadius: '12px',
                  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                }}
                labelFormatter={(value) => {
                  const date = new Date(value);
                  return date.toLocaleDateString('ru-RU');
                }}
              />
              <Area
                type="monotone"
                dataKey="issued"
                stroke="#3b82f6"
                strokeWidth={2}
                fill="url(#colorIssued)"
                name="Выдано"
              />
              <Area
                type="monotone"
                dataKey="returned"
                stroke="#10b981"
                strokeWidth={2}
                fill="url(#colorReturned)"
                name="Возвращено"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default Dashboard;

