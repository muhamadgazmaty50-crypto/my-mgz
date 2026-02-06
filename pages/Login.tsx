
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { User, UserStatus, UserRole, AppSettings } from '../types';
import { LogIn, Lock, Mail, AlertCircle, Info } from 'lucide-react';

interface LoginProps {
  setCurrentUser: (user: User) => void;
  users: User[];
  settings: AppSettings;
  themeColors: any;
}

const LoginPage: React.FC<LoginProps> = ({ setCurrentUser, users, settings, themeColors }) => {
  const [idInput, setIdInput] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [attempts, setAttempts] = useState(0);
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanId = idInput.trim();
    const user = users.find(u => (u.username === cleanId || u.email === cleanId) && u.password === password);
    
    if (user) {
      if (user.status !== UserStatus.APPROVED) {
        setError('حسابك قيد المراجعة حالياً أو تم حظره.');
        return;
      }
      setCurrentUser(user);
      navigate(user.role === UserRole.ADMIN || user.role === UserRole.SUPER_ADMIN ? '/admin' : '/');
    } else {
      setAttempts(prev => prev + 1);
      setError('بيانات الدخول غير صحيحة. يرجى التأكد من اسم المستخدم وكلمة المرور.');
    }
  };

  return (
    <div className="max-w-md mx-auto py-12 px-4 animate-in fade-in slide-in-from-bottom-4">
      <div className={`p-8 rounded-[2.5rem] border transition-all ${settings.isDarkMode ? 'bg-slate-900 border-slate-800 text-slate-100 shadow-2xl' : 'bg-white border-gray-100 shadow-xl'}`}>
        <div className="text-center mb-10">
          <div className={`w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-sm ${settings.isDarkMode ? 'bg-blue-900/30 text-blue-400' : 'bg-blue-50 text-blue-600'}`}>
            <LogIn size={40} />
          </div>
          <h1 className="text-3xl font-black">تسجيل الدخول</h1>
          <p className="text-xs opacity-40 mt-2 font-bold">يرجى إدخال بيانات حسابك للمتابعة</p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-2xl text-xs mb-6 flex flex-col gap-2 font-bold animate-shake border border-red-100">
            <div className="flex items-center gap-2">
              <AlertCircle size={16} /> {error}
            </div>
            {attempts >= 2 && (
              <div className="mt-2 p-3 bg-white/50 rounded-xl border border-red-200 text-red-800">
                <div className="flex items-center gap-2 mb-1">
                  <Info size={14} /> <span className="text-[10px] uppercase">تلميح للأدمن:</span>
                </div>
                <p className="text-[10px] font-medium">جرب تسجيل الدخول بـ (ادمن) أو (admin) مع كلمة السر (123)</p>
              </div>
            )}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-black mr-2 opacity-60">اسم المستخدم أو البريد</label>
            <div className="relative group">
              <input 
                type="text" 
                required 
                placeholder="أدخل اسم المستخدم (مثال: ادمن)" 
                className={`w-full border-2 rounded-2xl py-4 px-6 outline-none transition-all duration-300 ${
                  settings.isDarkMode 
                  ? 'bg-slate-800 border-slate-700 text-white focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/10' 
                  : 'bg-white border-gray-200 text-gray-800 focus:border-blue-600 focus:ring-4 focus:ring-blue-500/10 shadow-sm'
                }`} 
                value={idInput} 
                onChange={e => setIdInput(e.target.value)} 
              />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-black mr-2 opacity-60">كلمة المرور</label>
            <div className="relative group">
              <input 
                type="password" 
                required 
                placeholder="••••••••" 
                className={`w-full border-2 rounded-2xl py-4 px-6 outline-none transition-all duration-300 ${
                  settings.isDarkMode 
                  ? 'bg-slate-800 border-slate-700 text-white focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/10' 
                  : 'bg-white border-gray-200 text-gray-800 focus:border-blue-600 focus:ring-4 focus:ring-blue-500/10 shadow-sm'
                }`} 
                value={password} 
                onChange={e => setPassword(e.target.value)} 
              />
            </div>
          </div>
          <button 
            type="submit" 
            className={`w-full ${themeColors.primary} text-white font-black py-5 rounded-2xl shadow-lg hover:brightness-110 hover:-translate-y-0.5 active:scale-95 transition-all bubble-effect`}
          >
            دخول للنظام
          </button>
        </form>
        <div className="mt-8 text-center text-sm opacity-50">
          <Link to="/register" className="hover:underline font-bold text-blue-600 dark:text-blue-400">ليس لديك حساب؟ إنشاء حساب جديد</Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
