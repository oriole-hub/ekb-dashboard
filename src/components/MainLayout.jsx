import { useState, useEffect, useRef } from 'react';
import { Link, useLocation, Outlet } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  BookOpen,
  Calendar,
  LogOut,
  User,
  ChevronRight,
  Users,
  UserPlus,
  Menu,
  X,
  Scan,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useClickOutside } from '../hooks/useClickOutside';

const MainLayout = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [showAccountMenu, setShowAccountMenu] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const accountMenuRef = useRef(null);
  const sidebarRef = useRef(null);

  useClickOutside(accountMenuRef, () => setShowAccountMenu(false));
  useClickOutside(sidebarRef, () => {
    if (isMobile) {
      setIsMobileMenuOpen(false);
    }
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const navigation = [
    { name: 'Дашборд', href: '/', icon: LayoutDashboard },
    { name: 'Книги', href: '/books', icon: BookOpen },
    { name: 'Мероприятия', href: '/events', icon: Calendar },
    { name: 'Гости', href: '/users', icon: Users },
    { name: 'Проверка штрихкода', href: '/barcode-check', icon: Scan },
    { name: 'Регистрация работников', href: '/register-staff', icon: UserPlus },
  ];

  const formatDate = (date) => {
    return date.toLocaleDateString('ru-RU', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString('ru-RU', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  };

  const handleLogout = () => {
    logout();
    window.location.href = '/login';
  };

  const handleLinkClick = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-black">
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
            onClick={() => setIsMobileMenuOpen(false)}
          />
        )}
      </AnimatePresence>

      <motion.aside
        ref={sidebarRef}
        initial={false}
        animate={{ 
          x: isMobile ? (isMobileMenuOpen ? 0 : -300) : 0
        }}
        transition={{ type: "spring", damping: 25, stiffness: 200 }}
        className="fixed left-0 top-0 h-screen w-64 glass border-r border-gray-800/50 p-4 lg:p-6 z-50 lg:z-40"
      >
        <div className="flex items-center justify-between mb-6 lg:mb-8">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 lg:w-10 lg:h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
              <BookOpen className="w-4 h-4 lg:w-5 lg:h-5 text-white" />
            </div>
            <span className="text-lg lg:text-xl font-semibold text-white">
              Liba
            </span>
          </div>
          <button
            onClick={() => setIsMobileMenuOpen(false)}
            className="lg:hidden p-2 rounded-lg hover:bg-gray-800 transition-colors"
          >
            <X className="w-5 h-5 text-white" />
          </button>
        </div>

        <nav className="space-y-4 lg:space-y-5">
          {navigation.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <Link key={item.name} to={item.href} onClick={handleLinkClick}>
                <motion.div
                  whileHover={{ x: 4 }}
                  className={`flex items-center space-x-2 lg:space-x-3 px-3 py-2 lg:px-4 lg:py-3 rounded-xl transition-all ${
                    isActive
                      ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/30'
                      : 'text-gray-300 hover:bg-gray-800'
                  }`}
                >
                  <item.icon className="w-4 h-4 lg:w-5 lg:h-5" />
                  <span className="text-sm lg:text-base font-medium">{item.name}</span>
                  {isActive && <ChevronRight className="w-3 h-3 lg:w-4 lg:h-4 ml-auto" />}
                </motion.div>
              </Link>
            );
          })}
        </nav>

      </motion.aside>

      <div className="lg:ml-64">
        <motion.header
          initial={{ y: -100 }}
          animate={{ y: 0 }}
          className="sticky top-0 z-30 glass border-b border-gray-800/50"
        >
          <div className="flex items-center justify-between px-4 lg:px-8 py-3 lg:py-4">
            <div className="flex items-center space-x-3 lg:space-x-0 flex-1">
              <button
                onClick={() => setIsMobileMenuOpen(true)}
                className="lg:hidden p-2 rounded-lg hover:bg-gray-800 transition-colors"
              >
                <Menu className="w-6 h-6 text-white" />
              </button>
              <h2 className="text-base lg:text-lg font-semibold text-white">
                Привет, {user?.full_name?.split(' ')[0] || 'Администратор'}!
              </h2>
            </div>

            <div className="relative" ref={accountMenuRef}>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowAccountMenu(!showAccountMenu)}
                className="flex items-center space-x-2 lg:space-x-3 px-2 lg:px-4 py-2 rounded-xl bg-gray-800 hover:bg-gray-700 transition-colors"
              >
                <div className="w-7 h-7 lg:w-8 lg:h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                  <User className="w-3.5 h-3.5 lg:w-4 lg:h-4 text-white" />
                </div>
                <span className="text-xs lg:text-sm font-medium text-white hidden sm:inline">
                  {user?.full_name || 'Администратор'}
                </span>
              </motion.button>

              <AnimatePresence>
                {showAccountMenu && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute right-0 mt-2 w-48 glass-card shadow-xl rounded-xl overflow-hidden"
                  >
                    <div className="p-2">
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center space-x-2 px-3 py-2 text-left text-red-400 hover:bg-red-900/20 rounded-lg transition-colors"
                      >
                        <LogOut className="w-4 h-4" />
                        <span className="text-sm font-medium">Выйти</span>
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </motion.header>

        <main className="p-4 lg:p-8">
          <Outlet />
        </main>

        <motion.div
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          className="fixed bottom-4 right-4 lg:bottom-6 lg:right-6 glass-card px-3 py-2 lg:px-6 lg:py-4 shadow-xl"
        >
          <div className="text-right">
            <div className="text-lg lg:text-2xl font-semibold text-white">
              {formatTime(currentTime)}
            </div>
            <div className="text-xs lg:text-sm text-gray-400 mt-1 hidden sm:block">
              {formatDate(currentTime)}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default MainLayout;

