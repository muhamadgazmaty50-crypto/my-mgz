
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { User, UserRole, UserStatus, AppSettings } from '../types';
import { UserPlus, Mail, User as UserIcon, Lock, CheckCircle } from 'lucide-react';

interface RegisterProps {
  users: User[];
  setUsers: React.Dispatch<React.SetStateAction<User[]>>;
  settings: AppSettings;
  themeColors: any;
}

const RegisterPage: React.FC<RegisterProps> = ({ users, setUsers, settings, themeColors }) => {
  const [formData, setFormData] = useState({ username: '', email: '', password: '' });
  const [submitted, setSubmitted] = useState(false);
  const navigate = useNavigate();

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newUser: User = {
      id: Math.random().toString(36).substr(2, 9),
      ...formData,
      role: UserRole.MEMBER,
      status: UserStatus.APPROVED, // تم التغيير من PENDING إلى APPROVED للاشتراك التلقائي
      joinDate: new Date().toISOString(),
      permissions: {
        canManageCategories: false,
        canManageStores: false,
        canBanUsers: false,
        canManageReports: false,
        canDeletePosts: false,
        canDeleteComments: false,
        canEditSettings: false
      }
    };
    setUsers([...users, newUser]);
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="max-w-md mx-auto py-20 px-4 text-center">
        <div className={`p-10 rounded-3xl shadow-xl border transition-colors animate-in zoom-in duration-500 ${settings.isDarkMode ? 'bg-slate-900 border-slate-800 text-slate-100' : 'bg-white border-gray-100'}`}>
          <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
            <CheckCircle size={48} />
          </div>
          <h1 className={`text-2xl font-bold mb-4 ${settings.isDarkMode ? 'text-slate-100' : 'text-gray-800'}`}>مرحباً بك في مجتمعنا!</h1>
          <p className={`${settings.isDarkMode ? 'text-slate-400' : 'text-gray-500'} leading-relaxed mb-8 font-medium`}>
            تم تفعيل حسابك بنجاح! يمكنك الآن تسجيل الدخول مباشرة والبدء في استكشاف أفضل متاجر مواد البناء في سوريا.
          </p>
          <Link to="/login" className={`inline-block w-full ${themeColors.primary} text-white font-bold px-8 py-4 rounded-2xl hover:brightness-110 transition-all shadow-lg active:scale-95 bubble-effect`}>
            سجل دخولك الآن
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto py-12 px-4 animate-in fade-in slide-in-from-bottom-4">
      <div className={`p-8 rounded-3xl shadow-xl border transition-colors ${settings.isDarkMode ? 'bg-slate-900 border-slate-800 text-slate-100' : 'bg-white border-gray-100'}`}>
        <div className="text-center mb-8">
          <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 ${settings.isDarkMode ? 'bg-blue-900/30 text-blue-400' : 'bg-blue-100 text-blue-600 shadow-sm'}`}>
            <UserPlus size={32} />
          </div>
          <h1 className={`text-2xl font-bold ${settings.isDarkMode ? 'text-slate-100' : 'text-gray-800'}`}>عضوية جديدة</h1>
          <p className={`${settings.isDarkMode ? 'text-slate-400' : 'text-gray-500'} text-sm mt-2`}>انضم إلى دليل البناء الشامل</p>
        </div>

        <form onSubmit={handleRegister} className="space-y-5">
          <div className="space-y-1">
            <label className={`text-xs font-bold mr-2 ${settings.isDarkMode ? 'text-slate-400' : 'text-gray-500'}`}>الاسم بالكامل</label>
            <div className="relative">
              <UserIcon className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input 
                type="text" required
                placeholder="مثال: أحمد محمد"
                className={`w-full border rounded-xl py-3 pr-12 pl-4 focus:ring-2 ${settings.isDarkMode ? 'focus:ring-white/10 bg-slate-800 border-slate-700 text-slate-100' : 'focus:ring-blue-500 bg-gray-50 border-gray-200'} outline-none transition-all`}
                value={formData.username}
                onChange={(e) => setFormData({...formData, username: e.target.value})}
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className={`text-xs font-bold mr-2 ${settings.isDarkMode ? 'text-slate-400' : 'text-gray-500'}`}>البريد الإلكتروني</label>
            <div className="relative">
              <Mail className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input 
                type="email" required
                placeholder="name@example.com"
                className={`w-full border rounded-xl py-3 pr-12 pl-4 focus:ring-2 ${settings.isDarkMode ? 'focus:ring-white/10 bg-slate-800 border-slate-700 text-slate-100' : 'focus:ring-blue-500 bg-gray-50 border-gray-200'} outline-none transition-all`}
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className={`text-xs font-bold mr-2 ${settings.isDarkMode ? 'text-slate-400' : 'text-gray-500'}`}>كلمة المرور</label>
            <div className="relative">
              <Lock className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input 
                type="password" required
                placeholder="••••••••"
                className={`w-full border rounded-xl py-3 pr-12 pl-4 focus:ring-2 ${settings.isDarkMode ? 'focus:ring-white/10 bg-slate-800 border-slate-700 text-slate-100' : 'focus:ring-blue-500 bg-gray-50 border-gray-200'} outline-none transition-all`}
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
              />
            </div>
          </div>

          <button type="submit" className={`w-full ${themeColors.primary} text-white font-bold py-4 rounded-xl hover:brightness-110 shadow-lg shadow-blue-500/10 transition-all active:scale-95 bubble-effect`}>
            إنشاء حسابي والبدء
          </button>
        </form>

        <div className="mt-8 text-center pt-6 border-t border-gray-50 dark:border-slate-800">
          <p className={`${settings.isDarkMode ? 'text-slate-400' : 'text-gray-500'} text-sm`}>لديك حساب بالفعل؟</p>
          <Link to="/login" className={`${themeColors.primaryText} font-bold text-sm hover:underline`}>سجل دخولك من هنا</Link>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
