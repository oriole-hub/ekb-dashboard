import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus,
  Search,
  Edit2,
  BookOpen,
  X,
  Loader2,
  CheckCircle,
  Package,
} from 'lucide-react';
import { booksAPI } from '../api/books';
import EmptyState from '../components/EmptyState';

const Books = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showInstanceModal, setShowInstanceModal] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null);
  const queryClient = useQueryClient();

  const { data: books, isLoading } = useQuery({
    queryKey: ['books'],
    queryFn: () => booksAPI.getAll(),
  });

  const filteredBooks = books?.filter((book) =>
    [book.title, book.author, book.isbn].some((field) =>
      field?.toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  const handleEdit = (book) => {
    setSelectedBook(book);
    setShowEditModal(true);
  };

  const handleAddInstance = (book) => {
    setSelectedBook(book);
    setShowInstanceModal(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-4xl font-bold text-white mb-2">
            Книги
          </h1>
          <p className="text-sm lg:text-base text-gray-400">
            Управление книжным фондом
          </p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowAddModal(true)}
          className="flex items-center space-x-2 px-4 py-2 lg:px-6 lg:py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-xl text-sm lg:text-base font-medium shadow-lg shadow-blue-500/30 transition-colors"
        >
          <Plus className="w-4 h-4 lg:w-5 lg:h-5" />
          <span>Добавить книгу</span>
        </motion.button>
      </div>

      <div className="glass-card p-3 lg:p-4">
        <div className="relative">
          <Search className="absolute left-3 lg:left-4 top-1/2 -translate-y-1/2 w-4 h-4 lg:w-5 lg:h-5 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Поиск по названию, автору, ISBN..."
            className="w-full pl-10 lg:pl-12 pr-3 lg:pr-4 py-2 lg:py-3 bg-gray-800 border border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm lg:text-base text-white"
          />
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
        </div>
      ) : filteredBooks && filteredBooks.length > 0 ? (
        <div className="grid grid-cols-1 gap-4">
          {filteredBooks.map((book) => (
            <motion.div
              key={book.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ scale: 1.01 }}
              className="glass-card p-4 lg:p-6 cursor-pointer"
            >
              <div className="flex flex-col sm:flex-row items-start justify-between gap-3 lg:gap-4">
                {book.url_pic && (
                  <img
                    src={book.url_pic}
                    alt={book.title}
                    className="w-20 h-28 lg:w-24 lg:h-32 object-cover rounded-lg border border-gray-700 flex-shrink-0 mx-auto sm:mx-0"
                  />
                )}
                <div className="flex-1 w-full">
                  <h3 className="text-lg lg:text-xl font-semibold text-white mb-2">
                    {book.title}
                  </h3>
                  <p className="text-sm lg:text-base text-gray-400 mb-2 lg:mb-3">
                    Автор: {book.author}
                  </p>
                  {book.description && (
                    <p className="text-xs lg:text-sm text-gray-400 mb-2 lg:mb-3 line-clamp-2">
                      {book.description}
                    </p>
                  )}
                  <div className="flex flex-wrap items-center gap-2 lg:gap-4 text-xs lg:text-sm mb-2 lg:mb-3">
                    <span className="text-gray-400">
                      ISBN: {book.isbn}
                    </span>
                    {book.genre && (
                      <span className="px-2 lg:px-3 py-1 bg-blue-900/30 text-blue-400 rounded-full text-xs">
                        {book.genre}
                      </span>
                    )}
                    <span className="text-gray-400">
                      Экземпляров: {book.instances?.length || 0}
                    </span>
                  </div>
                  
                  {book.instances && book.instances.length > 0 && (
                    <div className="mt-2 lg:mt-3 pt-2 lg:pt-3 border-t border-gray-700">
                      <p className="text-xs font-medium text-gray-400 mb-1 lg:mb-2">
                        Экземпляры:
                      </p>
                      <div className="flex flex-wrap gap-1.5 lg:gap-2">
                        {book.instances.map((instance) => (
                          <div
                            key={instance.id}
                            className="px-1.5 lg:px-2 py-0.5 lg:py-1 bg-gray-800 rounded-lg text-xs"
                          >
                            <span className="text-gray-300 font-medium">
                              {instance.inventory_number}
                            </span>
                            <span className="text-gray-400 ml-1 hidden sm:inline">
                              • {instance.storage_location}
                            </span>
                            {instance.status === 'available' && (
                              <span className="ml-1 px-1 lg:px-1.5 py-0.5 bg-green-900/30 text-green-400 rounded text-xs">
                                доступна
                              </span>
                            )}
                            {instance.status === 'reserved' && (
                              <span className="ml-1 px-1 lg:px-1.5 py-0.5 bg-yellow-900/30 text-yellow-400 rounded text-xs">
                                зарезервирована
                              </span>
                            )}
                            {instance.status === 'loaned' && (
                              <span className="ml-1 px-1 lg:px-1.5 py-0.5 bg-red-900/30 text-red-400 rounded text-xs">
                                выдана
                              </span>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-2 flex-shrink-0 self-start sm:self-center">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => handleAddInstance(book)}
                    className="p-1.5 lg:p-2 rounded-lg bg-green-900/20 hover:bg-green-900/30 transition-colors"
                    title="Добавить экземпляр"
                  >
                    <Package className="w-4 h-4 lg:w-5 lg:h-5 text-green-400" />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => handleEdit(book)}
                    className="p-1.5 lg:p-2 rounded-lg bg-gray-800 hover:bg-gray-700 transition-colors"
                    title="Редактировать"
                  >
                    <Edit2 className="w-4 h-4 lg:w-5 lg:h-5 text-gray-400" />
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <EmptyState
          icon={BookOpen}
          title="Книги не найдены"
          description={
            searchQuery
              ? 'По вашему запросу книги не найдены. Попробуйте изменить поисковый запрос.'
              : 'В библиотеке пока нет книг. Начните с добавления первой книги.'
          }
          action={
            !searchQuery && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowAddModal(true)}
                className="flex items-center space-x-2 px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-xl font-medium shadow-lg shadow-blue-500/30 transition-colors"
              >
                <Plus className="w-5 h-5" />
                <span>Добавить книгу</span>
              </motion.button>
            )
          }
        />
      )}

      <AnimatePresence>
        {showAddModal && (
          <BookFormModal
            onClose={() => setShowAddModal(false)}
            queryClient={queryClient}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showEditModal && selectedBook && (
          <BookFormModal
            book={selectedBook}
            onClose={() => {
              setShowEditModal(false);
              setSelectedBook(null);
            }}
            queryClient={queryClient}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showInstanceModal && selectedBook && (
          <AddInstanceModal
            book={selectedBook}
            onClose={() => {
              setShowInstanceModal(false);
              setSelectedBook(null);
            }}
            queryClient={queryClient}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

const BookFormModal = ({ book, onClose, queryClient }) => {
  const [formData, setFormData] = useState({
    title: book?.title || '',
    author: book?.author || '',
    isbn: book?.isbn || '',
    genre: book?.genre || '',
    description: book?.description || '',
    image: null,
  });
  const [imagePreview, setImagePreview] = useState(book?.url_pic || null);
  
  useEffect(() => {
    if (book?.url_pic) {
      setImagePreview(book.url_pic);
    }
  }, [book]);
  const [error, setError] = useState('');

  const mutation = useMutation({
    mutationFn: (data) =>
      book ? booksAPI.update(book.id, data) : booksAPI.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries(['books']);
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
        setError(errorData?.detail || errorData?.message || 'Ошибка при сохранении книги');
      }
    },
  });

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData({ ...formData, image: file });
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    
    if (book) {
      const submitData = {};
      
      if (formData.title.trim()) {
        submitData.title = formData.title.trim();
      }
      
      if (formData.author.trim()) {
        submitData.author = formData.author.trim();
      }
      
      if (formData.genre && formData.genre.trim()) {
        submitData.genre = formData.genre.trim();
      } else {
        submitData.genre = null;
      }
      
      if (formData.description && formData.description.trim()) {
        submitData.description = formData.description.trim();
      } else {
        submitData.description = null;
      }
      
      mutation.mutate(submitData);
    } else {
      const submitData = {
        title: formData.title.trim(),
        author: formData.author.trim(),
        isbn: formData.isbn.trim(),
      };
      
      if (formData.genre && formData.genre.trim()) {
        submitData.genre = formData.genre.trim();
      }
      
      if (formData.description && formData.description.trim()) {
        submitData.description = formData.description.trim();
      }
      
      if (formData.image) {
        submitData.image = formData.image;
      }
      
      if (!submitData.title || !submitData.author || !submitData.isbn) {
        setError('Пожалуйста, заполните все обязательные поля');
        return;
      }
      
      mutation.mutate(submitData);
    }
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
            {book ? 'Редактировать книгу' : 'Добавить книгу'}
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
              Автор
            </label>
            <input
              type="text"
              value={formData.author}
              onChange={(e) =>
                setFormData({ ...formData, author: e.target.value })
              }
              required
              className="w-full px-3 py-2 lg:px-4 lg:py-3 bg-gray-800 border border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm lg:text-base text-white"
            />
          </div>

          <div>
            <label className="block text-xs lg:text-sm font-medium text-gray-300 mb-1.5 lg:mb-2">
              ISBN
            </label>
            <input
              type="text"
              value={formData.isbn}
              onChange={(e) =>
                setFormData({ ...formData, isbn: e.target.value })
              }
              required
              disabled={!!book}
              className="w-full px-3 py-2 lg:px-4 lg:py-3 bg-gray-800 border border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm lg:text-base text-white disabled:opacity-50"
            />
          </div>

          <div>
            <label className="block text-xs lg:text-sm font-medium text-gray-300 mb-1.5 lg:mb-2">
              Жанр
            </label>
            <input
              type="text"
              value={formData.genre}
              onChange={(e) =>
                setFormData({ ...formData, genre: e.target.value })
              }
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
              rows={4}
              className="w-full px-3 py-2 lg:px-4 lg:py-3 bg-gray-800 border border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm lg:text-base text-white resize-none"
            />
          </div>

          {!book && (
            <div>
              <label className="block text-xs lg:text-sm font-medium text-gray-300 mb-1.5 lg:mb-2">
                Обложка книги (опционально)
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="w-full px-3 py-2 lg:px-4 lg:py-3 bg-gray-800 border border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs lg:text-sm text-white"
              />
              {imagePreview && (
                <div className="mt-2 lg:mt-3">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-24 h-36 lg:w-32 lg:h-48 object-cover rounded-lg border border-gray-700"
                  />
                </div>
              )}
            </div>
          )}

          {error && (
            <div className="p-2 lg:p-3 rounded-xl bg-red-900/20 border border-red-800">
              <p className="text-xs lg:text-sm text-red-400 whitespace-pre-line">{error}</p>
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

const AddInstanceModal = ({ book, onClose, queryClient }) => {
  const [formData, setFormData] = useState({
    inventory_number: '',
    hall: '',
    shelf: '',
    rack: '',
  });
  const [error, setError] = useState('');

  const mutation = useMutation({
    mutationFn: (data) => booksAPI.addInstance(book.id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['books']);
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
        setError(errorData?.detail || errorData?.message || 'Ошибка при добавлении экземпляра');
      }
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!formData.inventory_number.trim()) {
      setError('Пожалуйста, укажите инвентарный номер');
      return;
    }

    if (!formData.hall || !formData.shelf || !formData.rack) {
      setError('Пожалуйста, заполните все поля местоположения');
      return;
    }

    const storage_location = `Z${formData.hall}S${formData.shelf}P${formData.rack}`;

    mutation.mutate({
      inventory_number: formData.inventory_number.trim(),
      storage_location,
    });
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
        className="w-full max-w-md glass-card p-4 lg:p-8 max-h-[90vh] overflow-y-auto"
      >
        <div className="flex items-center justify-between mb-4 lg:mb-6">
          <div>
            <h2 className="text-xl lg:text-2xl font-bold text-white">
              Добавить экземпляр
            </h2>
            <p className="text-xs lg:text-sm text-gray-400 mt-1">
              {book.title}
            </p>
          </div>
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
              Инвентарный номер *
            </label>
            <input
              type="text"
              value={formData.inventory_number}
              onChange={(e) =>
                setFormData({ ...formData, inventory_number: e.target.value })
              }
              required
              className="w-full px-3 py-2 lg:px-4 lg:py-3 bg-gray-800 border border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm lg:text-base text-white"
              placeholder="Например: INV-001"
            />
          </div>

          <div>
            <label className="block text-xs lg:text-sm font-medium text-gray-300 mb-2 lg:mb-3">
              Местоположение *
            </label>
            <div className="grid grid-cols-3 gap-2 lg:gap-3">
              <div>
                <label className="block text-xs text-gray-400 mb-1">
                  Зал
                </label>
                <input
                  type="number"
                  min="1"
                  value={formData.hall}
                  onChange={(e) =>
                    setFormData({ ...formData, hall: e.target.value })
                  }
                  required
                  className="w-full px-2 py-1.5 lg:px-3 lg:py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm lg:text-base text-white"
                  placeholder="1"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1">
                  Стеллаж
                </label>
                <input
                  type="number"
                  min="1"
                  value={formData.shelf}
                  onChange={(e) =>
                    setFormData({ ...formData, shelf: e.target.value })
                  }
                  required
                  className="w-full px-2 py-1.5 lg:px-3 lg:py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm lg:text-base text-white"
                  placeholder="3"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1">
                  Полка
                </label>
                <input
                  type="number"
                  min="1"
                  value={formData.rack}
                  onChange={(e) =>
                    setFormData({ ...formData, rack: e.target.value })
                  }
                  required
                  className="w-full px-2 py-1.5 lg:px-3 lg:py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm lg:text-base text-white"
                  placeholder="4"
                />
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-1.5 lg:mt-2">
              Формат: Z{formData.hall || '1'}S{formData.shelf || '3'}P{formData.rack || '4'}
            </p>
          </div>

          {error && (
            <div className="p-2 lg:p-3 rounded-xl bg-red-900/20 border border-red-800">
              <p className="text-xs lg:text-sm text-red-400 whitespace-pre-line">{error}</p>
            </div>
          )}

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 lg:gap-3 pt-3 lg:pt-4">
            <motion.button
              type="submit"
              disabled={mutation.isPending}
              whileHover={{ scale: mutation.isPending ? 1 : 1.02 }}
              whileTap={{ scale: mutation.isPending ? 1 : 0.98 }}
              className="flex-1 py-2.5 lg:py-3 px-4 bg-green-500 hover:bg-green-600 text-white text-sm lg:text-base font-medium rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {mutation.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 lg:w-5 lg:h-5 mr-2 animate-spin" />
                  Добавление...
                </>
              ) : (
                <>
                  <CheckCircle className="w-4 h-4 lg:w-5 lg:h-5 mr-2" />
                  Добавить
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

export default Books;

