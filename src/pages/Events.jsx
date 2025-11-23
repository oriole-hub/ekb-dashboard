import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus,
  Calendar,
  MapPin,
  Users,
  Edit2,
  Trash2,
  X,
  Loader2,
  CheckCircle,
  Clock,
} from 'lucide-react';
import { eventsAPI } from '../api/events';
import EmptyState from '../components/EmptyState';

const Events = () => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const queryClient = useQueryClient();

  const { data: events, isLoading } = useQuery({
    queryKey: ['events'],
    queryFn: () => eventsAPI.getAll(),
  });

  const deleteMutation = useMutation({
    mutationFn: (eventId) => eventsAPI.cancel(eventId),
    onSuccess: () => {
      queryClient.invalidateQueries(['events']);
    },
  });

  const handleEdit = (event) => {
    setSelectedEvent(event);
    setShowEditModal(true);
  };

  const handleDelete = (eventId) => {
    if (confirm('Вы уверены, что хотите удалить это мероприятие?')) {
      deleteMutation.mutate(eventId);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('ru-RU', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-4xl font-bold text-white mb-2">
            Мероприятия
          </h1>
          <p className="text-sm lg:text-base text-gray-400">
            Управление библиотечными мероприятиями
          </p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowAddModal(true)}
          className="flex items-center space-x-2 px-4 py-2 lg:px-6 lg:py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-xl text-sm lg:text-base font-medium shadow-lg shadow-blue-500/30 transition-colors"
        >
          <Plus className="w-4 h-4 lg:w-5 lg:h-5" />
          <span>Добавить мероприятие</span>
        </motion.button>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
        </div>
      ) : events && events.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
          {events.map((event) => (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ scale: 1.02, y: -5 }}
              className="glass-card p-4 lg:p-6"
            >
              <div className="flex items-start justify-between mb-3 lg:mb-4">
                <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-xl bg-blue-500/10 flex items-center justify-center">
                  <Calendar className="w-5 h-5 lg:w-6 lg:h-6 text-blue-500" />
                </div>
                <div className="flex items-center space-x-1.5 lg:space-x-2">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => handleEdit(event)}
                    className="p-1.5 lg:p-2 rounded-lg bg-gray-800 hover:bg-gray-700 transition-colors"
                  >
                    <Edit2 className="w-3.5 h-3.5 lg:w-4 lg:h-4 text-gray-400" />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => handleDelete(event.id)}
                    className="p-1.5 lg:p-2 rounded-lg bg-red-900/20 hover:bg-red-900/30 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5 lg:w-4 lg:h-4 text-red-400" />
                  </motion.button>
                </div>
              </div>

              <div className="flex items-start justify-between mb-2">
                <h3 className="text-lg lg:text-xl font-semibold text-white">
                  {event.title}
                </h3>
                {event.status && event.status !== 'planned' && (
                  <span className={`px-1.5 lg:px-2 py-0.5 lg:py-1 text-xs font-medium rounded-full ${
                    event.status === 'cancelled'
                      ? 'bg-red-900/30 text-red-400'
                      : 'bg-gray-800 text-gray-400'
                  }`}>
                    {event.status === 'cancelled' ? 'Отменено' : 'Завершено'}
                  </span>
                )}
              </div>
              <p className="text-xs lg:text-sm text-gray-400 mb-3 lg:mb-4 line-clamp-2">
                {event.description}
              </p>

              <div className="space-y-1.5 lg:space-y-2">
                <div className="flex items-center space-x-2 text-xs lg:text-sm text-gray-400">
                  <Calendar className="w-3.5 h-3.5 lg:w-4 lg:h-4 flex-shrink-0" />
                  <span>{formatDate(event.date)}</span>
                </div>
                <div className="flex items-center space-x-2 text-xs lg:text-sm text-gray-400">
                  <Clock className="w-3.5 h-3.5 lg:w-4 lg:h-4 flex-shrink-0" />
                  <span>{formatTime(event.date)}</span>
                </div>
                <div className="flex items-center space-x-2 text-xs lg:text-sm text-gray-400">
                  <MapPin className="w-3.5 h-3.5 lg:w-4 lg:h-4 flex-shrink-0" />
                  <span>{event.location}</span>
                </div>
                <div className="flex items-center space-x-2 text-xs lg:text-sm text-gray-400">
                  <Users className="w-3.5 h-3.5 lg:w-4 lg:h-4 flex-shrink-0" />
                  <span>
                    {event.total_seats - event.available_seats} / {event.total_seats} участников
                  </span>
                </div>
              </div>

              <div className="mt-4">
                <div className="h-2 bg-gray-200 bg-gray-700 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{
                      width: `${((event.total_seats - event.available_seats) / event.total_seats) * 100}%`,
                    }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className={`h-full rounded-full ${
                      event.available_seats === 0
                        ? 'bg-red-500'
                        : 'bg-blue-500'
                    }`}
                  />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <EmptyState
          icon={Calendar}
          title="Мероприятия не найдены"
          description="В библиотеке пока нет запланированных мероприятий. Создайте первое мероприятие."
          action={
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowAddModal(true)}
              className="flex items-center space-x-2 px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-xl font-medium shadow-lg shadow-blue-500/30 transition-colors"
            >
              <Plus className="w-5 h-5" />
              <span>Добавить мероприятие</span>
            </motion.button>
          }
        />
      )}

      <AnimatePresence>
        {showAddModal && (
          <EventFormModal
            onClose={() => setShowAddModal(false)}
            queryClient={queryClient}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showEditModal && selectedEvent && (
          <EventFormModal
            event={selectedEvent}
            onClose={() => {
              setShowEditModal(false);
              setSelectedEvent(null);
            }}
            queryClient={queryClient}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

const EventFormModal = ({ event, onClose, queryClient }) => {
  const [formData, setFormData] = useState({
    title: event?.title || '',
    description: event?.description || '',
    date: event?.date
      ? new Date(event.date).toISOString().slice(0, 16)
      : '',
    location: event?.location || '',
    total_seats: event?.total_seats || 20,
    status: event?.status || 'planned',
  });
  const [error, setError] = useState('');

  const mutation = useMutation({
    mutationFn: (data) =>
      event
        ? eventsAPI.update(event.id, data)
        : eventsAPI.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries(['events']);
      onClose();
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
        setError(errorData?.detail || errorData?.message || 'Ошибка при сохранении мероприятия');
      }
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    
    const submitData = {
      title: formData.title.trim(),
      date: new Date(formData.date).toISOString(),
      location: formData.location.trim(),
      total_seats: parseInt(formData.total_seats),
    };
    
    if (formData.description && formData.description.trim()) {
      submitData.description = formData.description.trim();
    }
    
    if (event) {
      if (formData.status) {
        submitData.status = formData.status;
      }
    }
    
    mutation.mutate(submitData);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-2xl glass-card p-4 lg:p-8 max-h-[90vh] overflow-y-auto"
      >
        <div className="flex items-center justify-between mb-4 lg:mb-6">
          <h2 className="text-xl lg:text-2xl font-bold text-white">
            {event ? 'Редактировать мероприятие' : 'Добавить мероприятие'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-100 hover:bg-gray-800 transition-colors"
          >
            <X className="w-5 h-5 lg:w-6 lg:h-6 text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3 lg:space-y-4">
          <div>
            <label className="block text-xs lg:text-sm font-medium text-gray-300 mb-1.5 lg:mb-2">
              Название
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              required
              className="w-full px-3 py-2 lg:px-4 lg:py-3 bg-gray-800 border border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm lg:text-base text-white"
            />
          </div>

          <div>
            <label className="block text-xs lg:text-sm font-medium text-gray-300 mb-1.5 lg:mb-2">
              Описание
            </label>
            <textarea
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              required
              rows={3}
              className="w-full px-3 py-2 lg:px-4 lg:py-3 bg-gray-800 border border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm lg:text-base text-white resize-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 lg:gap-4">
            <div>
              <label className="block text-xs lg:text-sm font-medium text-gray-300 mb-1.5 lg:mb-2">
                Дата и время
              </label>
              <input
                type="datetime-local"
                value={formData.date}
                onChange={(e) =>
                  setFormData({ ...formData, date: e.target.value })
                }
                required
                className="w-full px-3 py-2 lg:px-4 lg:py-3 bg-gray-800 border border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm lg:text-base text-white"
              />
            </div>

            <div>
              <label className="block text-xs lg:text-sm font-medium text-gray-300 mb-1.5 lg:mb-2">
                Вместимость
              </label>
              <input
                type="number"
                value={formData.total_seats}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    total_seats: parseInt(e.target.value) || 20,
                  })
                }
                required
                min="1"
                className="w-full px-3 py-2 lg:px-4 lg:py-3 bg-gray-800 border border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm lg:text-base text-white"
              />
            </div>
          </div>

            <div>
              <label className="block text-xs lg:text-sm font-medium text-gray-300 mb-1.5 lg:mb-2">
                Место проведения
              </label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) =>
                  setFormData({ ...formData, location: e.target.value })
                }
                required
                className="w-full px-3 py-2 lg:px-4 lg:py-3 bg-gray-800 border border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm lg:text-base text-white"
              />
            </div>

            {event && (
              <div>
                <label className="block text-xs lg:text-sm font-medium text-gray-300 mb-1.5 lg:mb-2">
                  Статус
                </label>
                <select
                  value={formData.status}
                  onChange={(e) =>
                    setFormData({ ...formData, status: e.target.value })
                  }
                  className="w-full px-3 py-2 lg:px-4 lg:py-3 bg-gray-800 border border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm lg:text-base text-white"
                >
                  <option value="planned">Запланировано</option>
                  <option value="cancelled">Отменено</option>
                  <option value="completed">Завершено</option>
                </select>
              </div>
            )}

          {error && (
            <div className="p-2 lg:p-3 rounded-xl bg-red-900/20 border border-red-800">
              <p className="text-xs lg:text-sm text-red-400">{error}</p>
            </div>
          )}

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 lg:gap-3 pt-3 lg:pt-4">
            <motion.button
              type="submit"
              disabled={mutation.isPending}
              whileHover={{ scale: mutation.isPending ? 1 : 1.02 }}
              whileTap={{ scale: mutation.isPending ? 1 : 0.98 }}
              className="flex-1 py-2.5 lg:py-3 px-4 bg-blue-500 hover:bg-blue-600 text-white text-sm lg:text-base font-medium rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {mutation.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 lg:w-5 lg:h-5 mr-2 animate-spin" />
                  Сохранение...
                </>
              ) : (
                <>
                  <CheckCircle className="w-4 h-4 lg:w-5 lg:h-5 mr-2" />
                  Сохранить
                </>
              )}
            </motion.button>
            <motion.button
              type="button"
              onClick={onClose}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="px-4 lg:px-6 py-2.5 lg:py-3 bg-gray-800 hover:bg-gray-700 text-white text-sm lg:text-base font-medium rounded-xl transition-colors"
            >
              Отмена
            </motion.button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default Events;

