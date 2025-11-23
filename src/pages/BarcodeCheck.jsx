import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Camera,
  X,
  Loader2,
  Search,
  User,
  Mail,
  Calendar,
  BookOpen,
  AlertCircle,
  CreditCard,
  Monitor,
  CheckCircle,
  XCircle,
} from 'lucide-react';
import { useMutation } from '@tanstack/react-query';
import { adminAPI } from '../api/admin';
import { BrowserMultiFormatReader } from '@zxing/library';

const BarcodeCheck = () => {
  const [barcode, setBarcode] = useState('');
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [error, setError] = useState(null);
  const videoRef = useRef(null);
  const codeReaderRef = useRef(null);
  const streamRef = useRef(null);

  const checkMutation = useMutation({
    mutationFn: adminAPI.checkBarcode,
    onSuccess: () => {
      setError(null);
      if (isCameraOpen) {
        stopCamera();
      }
    },
    onError: (err) => {
      setError(err.response?.data?.detail || 'Пользователь не найден');
      if (isCameraOpen) {
        stopCamera();
      }
    },
  });

  const startCamera = async () => {
    try {
      setError(null);
      setIsCameraOpen(true);
      
      const codeReader = new BrowserMultiFormatReader();
      codeReaderRef.current = codeReader;

      const videoInputDevices = await codeReader.listVideoInputDevices();
      
      if (videoInputDevices.length === 0) {
        setError('Камера не найдена');
        setIsCameraOpen(false);
        return;
      }

      const selectedDeviceId = videoInputDevices[0].deviceId;

      const stream = await navigator.mediaDevices.getUserMedia({
        video: { 
          facingMode: 'environment',
          deviceId: { exact: selectedDeviceId }
        },
      });

      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }

      codeReader.decodeFromVideoDevice(
        selectedDeviceId,
        videoRef.current,
        (result, err) => {
          if (result) {
            const scannedBarcode = result.getText();
            setBarcode(scannedBarcode);
            checkMutation.mutate(scannedBarcode);
            stopCamera();
          }
          if (err) {
            if (err.name !== 'NotFoundException' && err.name !== 'NoDeviceFoundException') {
              console.log('Scanning error:', err);
            }
          }
        }
      ).catch((err) => {
        console.error('Decode error:', err);
        setError('Ошибка при сканировании');
      });
    } catch (err) {
      console.error('Camera error:', err);
      setError('Не удалось открыть камеру. Проверьте разрешения.');
      setIsCameraOpen(false);
    }
  };

  const stopCamera = () => {
    if (codeReaderRef.current) {
      codeReaderRef.current.reset();
      codeReaderRef.current = null;
    }
    
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }

    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }

    setIsCameraOpen(false);
  };

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  const handleCheck = () => {
    if (barcode.trim()) {
      setError(null);
      checkMutation.mutate(barcode.trim());
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleCheck();
    }
  };

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

  const userData = checkMutation.data?.[0];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl lg:text-4xl font-bold text-white mb-2">
            Проверка штрихкода
          </h1>
          <p className="text-sm lg:text-base text-gray-400">
            Проверьте информацию о пользователе по штрихкоду
          </p>
        </div>
      </div>

      <div className="glass-card p-4 lg:p-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={barcode}
              onChange={(e) => {
                setBarcode(e.target.value);
                setError(null);
              }}
              onKeyPress={handleKeyPress}
              placeholder="Введите штрихкод или отсканируйте"
              className="w-full pl-12 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-base text-white"
              disabled={checkMutation.isPending}
            />
          </div>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleCheck}
            disabled={!barcode.trim() || checkMutation.isPending}
            className="px-6 py-3 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-700 disabled:cursor-not-allowed text-white rounded-xl font-medium transition-colors flex items-center justify-center space-x-2"
          >
            {checkMutation.isPending ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Проверка...</span>
              </>
            ) : (
              <>
                <Search className="w-5 h-5" />
                <span>Проверить</span>
              </>
            )}
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={isCameraOpen ? stopCamera : startCamera}
            className={`px-6 py-3 rounded-xl font-medium transition-colors flex items-center justify-center space-x-2 ${
              isCameraOpen
                ? 'bg-red-500 hover:bg-red-600 text-white'
                : 'bg-gray-800 hover:bg-gray-700 text-white border border-gray-700'
            }`}
          >
            <Camera className="w-5 h-5" />
            <span>{isCameraOpen ? 'Закрыть камеру' : 'Открыть камеру'}</span>
          </motion.button>
        </div>

        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 p-4 bg-red-500/10 border border-red-500/50 rounded-xl flex items-center space-x-3"
          >
            <XCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
            <p className="text-red-400">{error}</p>
          </motion.div>
        )}
      </div>

      <AnimatePresence>
        {isCameraOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="glass-card p-4 lg:p-6"
          >
            <div className="relative">
              <video
                ref={videoRef}
                className="w-full rounded-xl bg-black aspect-video object-cover"
                autoPlay
                playsInline
                muted
              />
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="border-2 border-blue-500 rounded-lg w-64 h-40 flex items-center justify-center">
                  <div className="absolute top-2 left-2 w-6 h-6 border-t-2 border-l-2 border-blue-500"></div>
                  <div className="absolute top-2 right-2 w-6 h-6 border-t-2 border-r-2 border-blue-500"></div>
                  <div className="absolute bottom-2 left-2 w-6 h-6 border-b-2 border-l-2 border-blue-500"></div>
                  <div className="absolute bottom-2 right-2 w-6 h-6 border-b-2 border-r-2 border-blue-500"></div>
                </div>
              </div>
              <p className="mt-4 text-center text-sm text-gray-400">
                Наведите камеру на штрихкод
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {userData && !checkMutation.isPending && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="glass-card p-6 lg:p-8"
          >
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <User className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white mb-1">
                    {userData.full_name}
                  </h2>
                  <div className="flex items-center space-x-2 text-gray-400">
                    <Mail className="w-4 h-4" />
                    <span>{userData.email}</span>
                  </div>
                </div>
              </div>
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center"
              >
                <CheckCircle className="w-6 h-6 text-green-400" />
              </motion.div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-white mb-3">
                  Основная информация
                </h3>
                <div className="space-y-3">
                  <div className="flex items-start space-x-3">
                    <CreditCard className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-xs text-gray-400 mb-1">Штрихкод</p>
                      <p className="text-sm font-mono text-white break-all">
                        {userData.barcode}
                      </p>
                    </div>
                  </div>
                  {userData.birthday && (
                    <div className="flex items-start space-x-3">
                      <Calendar className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-xs text-gray-400 mb-1">Дата рождения</p>
                        <p className="text-sm text-white">
                          {formatDate(userData.birthday)}
                        </p>
                      </div>
                    </div>
                  )}
                  {userData.device_type && (
                    <div className="flex items-start space-x-3">
                      <Monitor className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-xs text-gray-400 mb-1">Тип устройства</p>
                        <p className="text-sm text-white">
                          {userData.device_type}
                        </p>
                      </div>
                    </div>
                  )}
                  <div className="flex items-start space-x-3">
                    <Calendar className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-xs text-gray-400 mb-1">Зарегистрирован</p>
                      <p className="text-sm text-white">
                        {formatDateTime(userData.created_at)}
                      </p>
                    </div>
                  </div>
                  {userData.updated_at && (
                    <div className="flex items-start space-x-3">
                      <Calendar className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-xs text-gray-400 mb-1">Последнее обновление</p>
                        <p className="text-sm text-white">
                          {formatDateTime(userData.updated_at)}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-white mb-3">
                  Статистика выдач
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-800/50 rounded-xl p-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <BookOpen className="w-4 h-4 text-blue-400" />
                      <p className="text-xs text-gray-400">Всего выдач</p>
                    </div>
                    <p className="text-2xl font-bold text-white">
                      {userData.total_loans || 0}
                    </p>
                  </div>
                  <div className="bg-gray-800/50 rounded-xl p-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <BookOpen className="w-4 h-4 text-green-400" />
                      <p className="text-xs text-gray-400">Активных</p>
                    </div>
                    <p className="text-2xl font-bold text-white">
                      {userData.active_loans || 0}
                    </p>
                  </div>
                  <div className="bg-gray-800/50 rounded-xl p-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <AlertCircle className={`w-4 h-4 ${
                        userData.overdue_loans > 0 ? 'text-red-400' : 'text-gray-400'
                      }`} />
                      <p className="text-xs text-gray-400">Просрочено</p>
                    </div>
                    <p className={`text-2xl font-bold ${
                      userData.overdue_loans > 0 ? 'text-red-400' : 'text-white'
                    }`}>
                      {userData.overdue_loans || 0}
                    </p>
                  </div>
                  <div className="bg-gray-800/50 rounded-xl p-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <CheckCircle className="w-4 h-4 text-green-400" />
                      <p className="text-xs text-gray-400">Возвращено</p>
                    </div>
                    <p className="text-2xl font-bold text-white">
                      {userData.returned_loans || 0}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {userData.last_book_title && (
              <div className="mt-6 pt-6 border-t border-gray-700">
                <h3 className="text-lg font-semibold text-white mb-3">
                  Последняя выдача
                </h3>
                <div className="bg-gray-800/50 rounded-xl p-4">
                  <p className="text-base font-medium text-white mb-1">
                    {userData.last_book_title}
                  </p>
                  {userData.last_book_author && (
                    <p className="text-sm text-gray-400 mb-2">
                      {userData.last_book_author}
                    </p>
                  )}
                  {userData.last_loan_date && (
                    <p className="text-xs text-gray-500">
                      {formatDateTime(userData.last_loan_date)}
                    </p>
                  )}
                </div>
              </div>
            )}

            <div className="mt-6 flex gap-4">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  setBarcode('');
                  checkMutation.reset();
                  setError(null);
                }}
                className="flex-1 px-6 py-3 bg-gray-800 hover:bg-gray-700 text-white rounded-xl font-medium transition-colors"
              >
                Очистить
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  setBarcode('');
                  checkMutation.reset();
                  setError(null);
                  startCamera();
                }}
                className="flex-1 px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-xl font-medium transition-colors flex items-center justify-center space-x-2"
              >
                <Camera className="w-5 h-5" />
                <span>Сканировать еще</span>
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default BarcodeCheck;

