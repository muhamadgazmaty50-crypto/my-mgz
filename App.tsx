
import React, { useState, useEffect, useMemo } from 'react';
import { HashRouter as Router, Routes, Route, Link, useLocation, Navigate } from 'react-router-dom';
import { Home as HomeIcon, Search as SearchIcon, Settings as SettingsIcon, LogIn, Sun, Moon, User as UserIcon, Code2, X, Mail, User as DevIcon } from 'lucide-react';
import { Currency, AppSettings, Store, User, UserRole, UserStatus, Category, StorePost, AppTheme, ActionLog, Comment, Report, InternalMessage } from './types';
import HomePage from './pages/Home';
import StoreDetailPage from './pages/StoreDetail';
import CategoryPage from './pages/CategoryPage';
import SearchPage from './pages/Search';
import SettingsPage from './pages/Settings';
import LoginPage from './pages/Login';
import RegisterPage from './pages/Register';
import AdminDashboard from './pages/Admin';
import ContactPage from './pages/Contact';
import ProfilePage from './pages/Profile';
import { MOCK_STORES } from './constants';

const App: React.FC = () => {
  const [settings, setSettings] = useState<AppSettings>(() => {
    const saved = localStorage.getItem('appSettings');
    return saved ? JSON.parse(saved) : { 
      appName: 'دليل البناء',
      currency: Currency.SYP, 
      exchangeRate: 15000,
      appLogo: '🏗️',
      ownerWhatsapp: '963900000000',
      adminEmail: 'support@binaaguide.com',
      adminPhone: '+963 11 000 0000',
      heroTitle: 'ابحث عن أفضل مواد البناء في منطقتك',
      heroSubtitle: 'دليلك الشامل لمتاجر الإسمنت والحديد في سوريا',
      notificationsEnabled: false,
      isDarkMode: false,
      autoApprovePosts: true,
      theme: AppTheme.MODERN_BLUE
    };
  });

  const [activeTheme, setActiveTheme] = useState<AppTheme>(settings.theme);
  const [showDevModal, setShowDevModal] = useState(false);
  
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('currentUser');
    return saved ? JSON.parse(saved) : null;
  });

  const [categories, setCategories] = useState<Category[]>(() => {
    const saved = localStorage.getItem('categories');
    return saved ? JSON.parse(saved) : [
      { id: '1', name: 'إسمنت', iconName: 'Layers', color: 'bg-gray-200 text-gray-700' },
      { id: '2', name: 'حديد', iconName: 'HardHat', color: 'bg-orange-100 text-orange-600' },
      { id: '3', name: 'رمل وبحص', iconName: 'Waves', color: 'bg-yellow-100 text-yellow-700' },
      { id: '4', name: 'دهان', iconName: 'Paintbrush', color: 'bg-blue-100 text-blue-600' },
      { id: '5', name: 'أدوات صحية', iconName: 'Pipette', color: 'bg-cyan-100 text-cyan-700' },
      { id: '6', name: 'كهرباء', iconName: 'Zap', color: 'bg-amber-100 text-amber-700' }
    ];
  });

  const [stores, setStores] = useState<Store[]>(() => {
    const saved = localStorage.getItem('stores');
    return saved ? JSON.parse(saved) : MOCK_STORES;
  });

  const [posts, setPosts] = useState<StorePost[]>(() => {
    const saved = localStorage.getItem('storePosts');
    return saved ? JSON.parse(saved) : [];
  });

  const [comments, setComments] = useState<Comment[]>(() => {
    const saved = localStorage.getItem('comments');
    return saved ? JSON.parse(saved) : [];
  });

  const [reports, setReports] = useState<Report[]>(() => {
    const saved = localStorage.getItem('reports');
    return saved ? JSON.parse(saved) : [];
  });

  const [actionLogs, setActionLogs] = useState<ActionLog[]>(() => {
    const saved = localStorage.getItem('actionLogs');
    return saved ? JSON.parse(saved) : [];
  });

  const [messages, setMessages] = useState<InternalMessage[]>(() => {
    const saved = localStorage.getItem('messages');
    return saved ? JSON.parse(saved) : [];
  });

  const [users, setUsers] = useState<User[]>(() => {
    const saved = localStorage.getItem('users');
    const existingUsers = saved ? JSON.parse(saved) : [];
    
    const INITIAL_ADMIN: User = {
      id: 'admin-super-0',
      username: 'ادمن',
      password: '123',
      email: 'admin', // للسماح بتسجيل الدخول بكلمة admin
      role: UserRole.SUPER_ADMIN,
      status: UserStatus.APPROVED,
      joinDate: new Date().toISOString(),
      permissions: {
        canManageCategories: true,
        canManageStores: true,
        canBanUsers: true,
        canManageReports: true,
        canDeletePosts: true,
        canDeleteComments: true,
        canEditSettings: true
      }
    };

    const adminExists = existingUsers.find((u: User) => u.username === 'ادمن' || u.email === 'admin');
    if (!adminExists) return [INITIAL_ADMIN, ...existingUsers];
    return existingUsers;
  });

  const updateGlobalUser = (updatedUser: User) => {
    setUsers(prev => prev.map(u => u.id === updatedUser.id ? updatedUser : u));
    setCurrentUser(updatedUser);
  };

  const themeColors = useMemo(() => {
    const isDark = settings.isDarkMode;
    switch(activeTheme) {
      case AppTheme.ROYAL_GOLD:
        return {
          primary: isDark ? 'bg-amber-500' : 'bg-amber-600',
          primaryText: isDark ? 'text-amber-400' : 'text-amber-700',
          primaryHover: 'hover:brightness-110 hover:shadow-lg hover:shadow-amber-500/20',
          primaryLight: isDark ? 'bg-amber-500/10' : 'bg-amber-50',
          hex: isDark ? '#f59e0b' : '#d97706'
        };
      case AppTheme.EMERALD_CITY:
        return {
          primary: isDark ? 'bg-emerald-500' : 'bg-emerald-600',
          primaryText: isDark ? 'text-emerald-400' : 'text-emerald-700',
          primaryHover: 'hover:-translate-y-1 hover:shadow-emerald-500/30 hover:shadow-xl',
          primaryLight: isDark ? 'bg-emerald-500/10' : 'bg-emerald-50',
          hex: isDark ? '#10b981' : '#059669'
        };
      case AppTheme.NEON_CYBER:
        return {
          primary: isDark ? 'bg-fuchsia-600' : 'bg-fuchsia-700',
          primaryText: isDark ? 'text-fuchsia-400' : 'text-fuchsia-800',
          primaryHover: 'hover:shadow-[0_0_20px_rgba(192,38,211,0.5)] hover:scale-[1.02]',
          primaryLight: isDark ? 'bg-fuchsia-500/10' : 'bg-fuchsia-50',
          hex: isDark ? '#c026d3' : '#a21caf'
        };
      case AppTheme.ROSE_GARDEN:
        return {
          primary: isDark ? 'bg-rose-500' : 'bg-rose-600',
          primaryText: isDark ? 'text-rose-400' : 'text-rose-700',
          primaryHover: 'hover:scale-105 hover:shadow-rose-500/20',
          primaryLight: isDark ? 'bg-rose-500/10' : 'bg-rose-50',
          hex: isDark ? '#f43f5e' : '#e11d48'
        };
      case AppTheme.OCEAN_BREEZE:
        return {
          primary: isDark ? 'bg-cyan-500' : 'bg-cyan-600',
          primaryText: isDark ? 'text-cyan-400' : 'text-cyan-700',
          primaryHover: 'hover:opacity-90 hover:backdrop-blur-sm',
          primaryLight: isDark ? 'bg-cyan-500/10' : 'bg-cyan-50',
          hex: isDark ? '#06b6d4' : '#0891b2'
        };
      case AppTheme.LAVA_FLOW:
        return {
          primary: isDark ? 'bg-red-500' : 'bg-red-600',
          primaryText: isDark ? 'text-red-400' : 'text-red-700',
          primaryHover: 'hover:shadow-[0_0_25px_rgba(220,38,38,0.5)] hover:brightness-125',
          primaryLight: isDark ? 'bg-red-500/10' : 'bg-red-50',
          hex: isDark ? '#ef4444' : '#dc2626'
        };
      case AppTheme.SPACE_NEBULA:
        return {
          primary: isDark ? 'bg-indigo-600' : 'bg-indigo-700',
          primaryText: isDark ? 'text-indigo-400' : 'text-indigo-800',
          primaryHover: 'hover:-translate-y-2 hover:rotate-1 hover:shadow-2xl hover:shadow-indigo-500/40',
          primaryLight: isDark ? 'bg-indigo-500/10' : 'bg-indigo-50',
          hex: isDark ? '#4f46e5' : '#4338ca'
        };
      case AppTheme.AUTUMN_LEAVES:
        return {
          primary: isDark ? 'bg-orange-700' : 'bg-orange-800',
          primaryText: isDark ? 'text-orange-500' : 'text-orange-900',
          primaryHover: 'hover:scale-[1.03] hover:shadow-orange-900/40',
          primaryLight: isDark ? 'bg-orange-500/10' : 'bg-orange-50',
          hex: isDark ? '#c2410c' : '#9a3412'
        };
      default:
        return {
          primary: isDark ? 'bg-blue-500' : 'bg-blue-600',
          primaryText: isDark ? 'text-blue-400' : 'text-blue-700',
          primaryHover: 'hover:brightness-110 hover:shadow-blue-500/20',
          primaryLight: isDark ? 'bg-blue-500/10' : 'bg-blue-50',
          hex: isDark ? '#3b82f6' : '#2563eb'
        };
    }
  }, [activeTheme, settings.isDarkMode]);

  useEffect(() => {
    localStorage.setItem('appSettings', JSON.stringify(settings));
    localStorage.setItem('stores', JSON.stringify(stores));
    localStorage.setItem('users', JSON.stringify(users));
    localStorage.setItem('categories', JSON.stringify(categories));
    localStorage.setItem('storePosts', JSON.stringify(posts));
    localStorage.setItem('comments', JSON.stringify(comments));
    localStorage.setItem('reports', JSON.stringify(reports));
    localStorage.setItem('actionLogs', JSON.stringify(actionLogs));
    localStorage.setItem('messages', JSON.stringify(messages));
    
    if (settings.isDarkMode) document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');

    document.documentElement.style.setProperty('--theme-primary', themeColors.hex);
    document.documentElement.style.setProperty('--theme-ripple', themeColors.hex + '4D');

    if (currentUser) localStorage.setItem('currentUser', JSON.stringify(currentUser));
    else localStorage.removeItem('currentUser');
  }, [settings, stores, users, currentUser, categories, posts, comments, reports, actionLogs, messages, themeColors]);

  const addActionLog = (action: string, details: string) => {
    if (!currentUser) return;
    const log: ActionLog = {
      id: Math.random().toString(36).substr(2, 9),
      adminId: currentUser.id,
      adminName: currentUser.username,
      action,
      details,
      timestamp: new Date().toISOString()
    };
    setActionLogs(prev => [log, ...prev]);
  };

  const showSystemNotification = (title: string, body: string) => {
    if (settings.notificationsEnabled && typeof Notification !== 'undefined' && Notification.permission !== 'granted') {
      Notification.requestPermission();
    }
    if (settings.notificationsEnabled && typeof Notification !== 'undefined' && Notification.permission === 'granted') {
      new Notification(title, { body, icon: settings.appLogo });
    }
  };

  const sendMessage = (msg: Omit<InternalMessage, 'id' | 'isRead' | 'createdAt'>) => {
    const newMsg: InternalMessage = {
      ...msg,
      id: Math.random().toString(36).substr(2, 9),
      isRead: false,
      createdAt: new Date().toISOString()
    };
    setMessages(prev => [newMsg, ...prev]);
  };

  return (
    <Router>
      <div className={`flex flex-col min-h-screen pb-20 md:pb-0 md:pt-16 transition-all duration-500 ${settings.isDarkMode ? 'bg-slate-950 text-slate-100' : 'bg-gray-50 text-gray-900'}`}>
        <header className={`fixed top-0 left-0 right-0 shadow-sm z-50 px-6 py-3 hidden md:flex items-center justify-between transition-all duration-300 ${settings.isDarkMode ? 'bg-slate-900/90 border-b border-slate-800 backdrop-blur-md' : 'bg-white/90 border-b border-gray-100 backdrop-blur-md shadow-sm'}`}>
          <div className="flex items-center gap-8">
            <Link to="/" className={`text-2xl font-bold ${themeColors.primaryText} flex items-center gap-2 hover:opacity-80 transition-all active:scale-95 group`}>
              <span className={`p-1.5 ${themeColors.primary} text-white rounded-xl flex items-center justify-center min-w-[42px] shadow-lg group-hover:rotate-6 transition-transform`}>
                {settings.appLogo.length > 10 ? 
                  <img src={settings.appLogo} className="w-6 h-6 object-contain" alt="Logo" /> : 
                  <span>{settings.appLogo}</span>
                }
              </span>
              <span className="tracking-tight">{settings.appName}</span>
            </Link>
            
            <nav className="flex gap-1">
              <HeaderNavLink to="/" label="الرئيسية" isDarkMode={settings.isDarkMode} themeColors={themeColors} />
              <HeaderNavLink to="/search" label="البحث" isDarkMode={settings.isDarkMode} themeColors={themeColors} />
              <HeaderNavLink to="/settings" label="الإعدادات" isDarkMode={settings.isDarkMode} themeColors={themeColors} />
              {(currentUser?.role === UserRole.ADMIN || currentUser?.role === UserRole.SUPER_ADMIN) && (
                <Link to="/admin" className={`font-bold bubble-effect px-4 py-2 rounded-2xl transition-all duration-300 hover:-translate-y-0.5 active:scale-95 ${settings.isDarkMode ? 'text-red-400 hover:bg-red-900/30' : 'text-red-600 bg-red-50 hover:bg-red-100 shadow-sm border border-red-200/50'}`}>لوحة التحكم</Link>
              )}
            </nav>
          </div>
          
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setShowDevModal(true)} 
              title="معلومات المطور"
              className={`p-2.5 rounded-2xl bubble-effect transition-all duration-300 hover:shadow-md hover:-translate-y-0.5 active:scale-95 ${settings.isDarkMode ? 'bg-slate-800 text-blue-400 border border-slate-700 hover:bg-slate-700' : 'bg-gray-100 text-blue-600 border border-gray-200 hover:bg-gray-200'}`}
            >
              <Code2 size={20} />
            </button>

            <button onClick={() => setSettings(p => ({...p, isDarkMode: !p.isDarkMode}))} className={`p-2.5 rounded-2xl bubble-effect transition-all duration-300 hover:shadow-md hover:-translate-y-0.5 active:scale-95 ${settings.isDarkMode ? 'bg-slate-800 text-yellow-400 border border-slate-700 hover:bg-slate-700' : 'bg-gray-100 text-gray-600 border border-gray-200 hover:bg-gray-200'}`}>
              {settings.isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            {!currentUser ? (
              <Link to="/login" className={`px-6 py-2.5 font-bold rounded-2xl text-sm transition-all duration-300 bubble-effect hover:-translate-y-0.5 active:scale-95 ${settings.isDarkMode ? 'bg-slate-800 text-white border border-slate-700' : `bg-white ${themeColors.primaryText} border border-gray-200 shadow-sm hover:border-blue-200`}`}>دخول</Link>
            ) : (
              <Link to="/profile" className="flex items-center gap-2 px-3 py-1.5 rounded-2xl bg-gray-100 dark:bg-slate-800 border border-transparent dark:border-slate-700 hover:bg-gray-200 dark:hover:bg-slate-700 transition-all">
                {currentUser.avatar ? <img src={currentUser.avatar} className="w-6 h-6 rounded-full object-cover" /> : <div className={`w-6 h-6 rounded-full ${themeColors.primary} text-white flex items-center justify-center text-[10px]`}>{currentUser.username[0].toUpperCase()}</div>}
                <span className="text-xs font-bold">{currentUser.username}</span>
              </Link>
            )}
          </div>
        </header>

        <div className="md:hidden fixed top-3 left-4 z-[60]">
           <button 
              onClick={() => setShowDevModal(true)} 
              className={`p-2 rounded-xl shadow-lg bubble-effect transition-all ${settings.isDarkMode ? 'bg-slate-800 text-blue-400' : 'bg-white text-blue-600 border border-gray-100'}`}
            >
              <Code2 size={20} />
            </button>
        </div>

        <main className="flex-1 w-full max-w-4xl mx-auto px-4 py-6">
          <Routes>
            <Route path="/" element={<HomePage stores={stores} settings={settings} categories={categories} themeColors={themeColors} />} />
            <Route path="/store/:id" element={<StoreDetailPage 
              stores={stores} setStores={setStores} 
              posts={posts} setPosts={setPosts} 
              comments={comments} setComments={setComments}
              reports={reports} setReports={setReports}
              currentUser={currentUser} settings={settings} themeColors={themeColors} 
              sendMessage={sendMessage}
              addActionLog={addActionLog}
              notify={showSystemNotification}
            />} />
            <Route path="/category/:id" element={<CategoryPage stores={stores} categories={categories} themeColors={themeColors} isDarkMode={settings.isDarkMode} />} />
            <Route path="/search" element={<SearchPage stores={stores} categories={categories} settings={settings} themeColors={themeColors} />} />
            <Route path="/contact" element={<ContactPage settings={settings} themeColors={themeColors} />} />
            <Route path="/profile" element={<ProfilePage 
              currentUser={currentUser} setCurrentUser={updateGlobalUser} 
              posts={posts} comments={comments} settings={settings} themeColors={themeColors} 
            />} />
            <Route path="/settings" element={<SettingsPage settings={settings} setSettings={setSettings} setActiveTheme={setActiveTheme} currentUser={currentUser} themeColors={themeColors} toggleDarkMode={() => setSettings(p => ({...p, isDarkMode: !p.isDarkMode}))} />} />
            <Route path="/login" element={<LoginPage setCurrentUser={setCurrentUser} users={users} settings={settings} themeColors={themeColors} />} />
            <Route path="/register" element={<RegisterPage setUsers={setUsers} users={users} settings={settings} themeColors={themeColors} />} />
            <Route 
              path="/admin" 
              element={(currentUser?.role === UserRole.ADMIN || currentUser?.role === UserRole.SUPER_ADMIN) ? (
                <AdminDashboard 
                  stores={stores} setStores={setStores} 
                  users={users} setUsers={setUsers} 
                  categories={categories} setCategories={setCategories}
                  posts={posts} setPosts={setPosts}
                  comments={comments} setComments={setComments}
                  reports={reports} setReports={setReports}
                  actionLogs={actionLogs} addActionLog={addActionLog}
                  settings={settings} setSettings={setSettings}
                  notifyNewStore={(name) => showSystemNotification("متجر جديد!", `تمت إضافة متجر "${name}" إلى الدليل.`)}
                  themeColors={themeColors}
                  currentUser={currentUser}
                />
              ) : <Navigate to="/login" />} 
            />
          </Routes>
        </main>

        <nav className={`fixed bottom-0 left-0 right-0 border-t flex justify-around items-center py-3 md:hidden z-50 transition-colors duration-300 ${settings.isDarkMode ? 'bg-slate-900/95 border-slate-800 backdrop-blur-md' : 'bg-white/95 border-gray-100 backdrop-blur-md shadow-[0_-4px_20px_-5px_rgba(0,0,0,0.1)]'}`}>
          <MobileNavLink to="/" icon={<HomeIcon size={24} />} label="الرئيسية" themeColors={themeColors} />
          <MobileNavLink to="/search" icon={<SearchIcon size={24} />} label="بحث" themeColors={themeColors} />
          <MobileNavLink to="/profile" icon={<UserIcon size={24} />} label="حسابي" themeColors={themeColors} />
          <MobileNavLink to="/settings" icon={<SettingsIcon size={24} />} label="إعدادات" themeColors={themeColors} />
        </nav>

        {showDevModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 animate-in fade-in duration-300">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowDevModal(false)} />
            <div className={`relative w-full max-w-sm p-8 rounded-[2.5rem] shadow-2xl border transition-all animate-in zoom-in-95 duration-300 ${settings.isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-gray-100'}`}>
              <button 
                onClick={() => setShowDevModal(false)}
                className="absolute top-4 left-4 p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors opacity-50"
              >
                <X size={20} />
              </button>
              <div className="text-center space-y-6">
                <div className={`w-20 h-20 mx-auto rounded-3xl flex items-center justify-center shadow-lg ${themeColors.primary} text-white`}>
                  <Code2 size={40} />
                </div>
                <div>
                  <h2 className="text-2xl font-black mb-1">معلومات المطور</h2>
                  <p className="text-xs opacity-40 font-bold uppercase tracking-widest">فريق التطوير الفني</p>
                </div>
                <div className="space-y-4">
                  <div className={`p-4 rounded-2xl border flex items-center gap-4 transition-all ${settings.isDarkMode ? 'bg-slate-800/50 border-slate-700' : 'bg-gray-50 border-gray-100'}`}>
                    <div className={`p-2.5 rounded-xl ${themeColors.primaryLight} ${themeColors.primaryText}`}>
                      <DevIcon size={20} />
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] font-black opacity-40 block mb-0.5">الاسم الكامل</span>
                      <span className="font-bold text-sm">محمد جزماتي</span>
                    </div>
                  </div>
                  <button 
                    onClick={() => window.open('mailto:muhamadgazmaty@gmail.com')}
                    className={`w-full p-4 rounded-2xl border flex items-center gap-4 transition-all hover:translate-y-[-2px] active:scale-95 bubble-effect ${settings.isDarkMode ? 'bg-slate-800/50 border-slate-700 hover:border-blue-500/50' : 'bg-gray-50 border-gray-100 hover:border-blue-200'}`}
                  >
                    <div className={`p-2.5 rounded-xl bg-blue-500/10 text-blue-500`}>
                      <Mail size={20} />
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] font-black opacity-40 block mb-0.5">البريد الإلكتروني</span>
                      <span className="font-bold text-sm">muhamadgazmaty@gmail.com</span>
                    </div>
                  </button>
                </div>
                <div className="pt-4">
                  <button 
                    onClick={() => setShowDevModal(false)}
                    className={`w-full py-4 rounded-2xl font-black text-white shadow-lg transition-all active:scale-95 bubble-effect ${themeColors.primary}`}
                  >
                    إغلاق النافذة
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </Router>
  );
};

const HeaderNavLink: React.FC<{ to: string, label: string, isDarkMode: boolean, themeColors: any }> = ({ to, label, isDarkMode, themeColors }) => {
  const location = useLocation();
  const isActive = location.pathname === to;
  return (
    <Link 
      to={to} 
      className={`font-bold bubble-effect px-4 py-2 rounded-2xl transition-all duration-300 hover:-translate-y-0.5 active:scale-95 ${isActive 
        ? `${themeColors.primaryText} ${themeColors.primaryLight}` 
        : (isDarkMode ? 'text-slate-400 hover:text-slate-100' : 'text-gray-500 hover:text-blue-600')}`}
    >
      {label}
    </Link>
  );
};

const MobileNavLink: React.FC<{ to: string, icon: React.ReactNode, label: string, themeColors: any }> = ({ to, icon, label, themeColors }) => {
  const location = useLocation();
  const isActive = location.pathname === to;
  return (
    <Link to={to} className={`flex flex-col items-center gap-1 transition-all bubble-effect px-4 py-1 rounded-2xl ${isActive ? `${themeColors.primaryText} scale-110` : 'text-gray-400'}`}>
      {icon}
      <span className="text-[10px] font-bold">{label}</span>
    </Link>
  );
};

export default App;
