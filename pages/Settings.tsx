
import React, { useState } from 'react';
import { AppSettings, Currency, User, AppTheme } from '../types';
import { Settings as SettingsIcon, Bell, Moon, Sun, Save, Palette, Check, RefreshCcw, Zap, Sparkles, Wind, Flame, Milestone, CloudMoon } from 'lucide-react';

interface SettingsProps {
  settings: AppSettings;
  setSettings: (settings: AppSettings) => void;
  setActiveTheme: (theme: AppTheme) => void;
  currentUser: User | null;
  toggleDarkMode: () => void;
  themeColors: any;
}

const SettingsPage: React.FC<SettingsProps> = ({ settings, setSettings, setActiveTheme, toggleDarkMode, themeColors }) => {
  const [saveMessage, setSaveMessage] = useState<string | null>(null);
  const [previewTheme, setPreviewTheme] = useState<AppTheme>(settings.theme);

  const triggerSave = (msg: string) => {
    setSaveMessage(msg);
    setTimeout(() => setSaveMessage(null), 3000);
  };

  const handlePreviewTheme = (theme: AppTheme) => {
    setPreviewTheme(theme);
    setActiveTheme(theme);
  };

  const themes = [
    { id: AppTheme.MODERN_BLUE, name: 'الأزرق الحديث', colors: ['#2563eb', '#eff6ff'], icon: <Milestone size={16}/>, desc: 'النمط الكلاسيكي للأعمال.' },
    { id: AppTheme.ROYAL_GOLD, name: 'الذهبي الملكي', colors: ['#d97706', '#fffbeb'], icon: <Sparkles size={16}/>, desc: 'فخامة وتميز.' },
    { id: AppTheme.EMERALD_CITY, name: 'المدينة الزمردية', colors: ['#059669', '#ecfdf5'], icon: <Zap size={16}/>, desc: 'مريح للعين.' },
    { id: AppTheme.NEON_CYBER, name: 'ليلة البنفسج', colors: ['#c026d3', '#fdf4ff'], icon: <Milestone size={16}/>, desc: 'عصري وجريء.' },
    { id: AppTheme.ROSE_GARDEN, name: 'حديقة الورد', colors: ['#e11d48', '#fff1f2'], icon: <Milestone size={16}/>, desc: 'ناعم ودافئ.' },
    { id: AppTheme.OCEAN_BREEZE, name: 'نسيم المحيط', colors: ['#0891b2', '#ecfeff'], icon: <Wind size={16}/>, desc: 'هادئ ومنعش.' },
    { id: AppTheme.LAVA_FLOW, name: 'بركان الغضب', colors: ['#dc2626', '#fef2f2'], icon: <Flame size={16}/>, desc: 'قوة وحرارة بركانية.' },
    { id: AppTheme.SPACE_NEBULA, name: 'سديم الفضاء', colors: ['#4338ca', '#eef2ff'], icon: <CloudMoon size={16}/>, desc: 'عمق الكون وسحره.' },
    { id: AppTheme.AUTUMN_LEAVES, name: 'أوراق الخريف', colors: ['#9a3412', '#fff7ed'], icon: <Milestone size={16}/>, desc: 'دفء ألوان الطبيعة.' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in pb-10">
      {saveMessage && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-[100] bg-green-500 text-white px-8 py-3 rounded-2xl shadow-2xl flex items-center gap-2 animate-bounce">
          <Check size={20} /> <span className="font-bold">{saveMessage}</span>
        </div>
      )}

      <div className="flex items-center gap-4">
        <div className={`p-4 ${themeColors.primary} text-white rounded-3xl shadow-lg transition-all active:scale-90`}><SettingsIcon size={28} /></div>
        <div><h1 className="text-2xl font-bold">الإعدادات والتخصيص</h1><p className="text-xs opacity-50">تحكم في مظهر وتجربة المنصة</p></div>
      </div>

      <section className={`p-8 rounded-[2.5rem] border shadow-sm transition-all ${settings.isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-gray-100 shadow-sm'}`}>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold flex items-center gap-3"><Palette className={themeColors.primaryText} /> سمات التطبيق (معاينة حية)</h2>
          {previewTheme !== settings.theme && <button onClick={() => { setPreviewTheme(settings.theme); setActiveTheme(settings.theme); }} className="text-xs text-red-500 font-bold flex items-center gap-1 hover:underline"><RefreshCcw size={12}/> استعادة</button>}
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 gap-5 mb-8">
          {themes.map((t) => {
            const isSelected = previewTheme === t.id;
            return (
              <button 
                key={t.id} 
                onClick={() => handlePreviewTheme(t.id)} 
                className={`relative p-5 rounded-[2rem] border-2 transition-all bubble-effect group overflow-hidden flex flex-col items-start text-right
                  ${isSelected 
                    ? `shadow-xl scale-[1.03] z-10 ${settings.isDarkMode ? 'border-white bg-slate-800' : 'border-gray-300 bg-white'}` 
                    : `border-transparent ${settings.isDarkMode ? 'bg-slate-800/40 hover:bg-slate-800' : 'bg-gray-50 hover:bg-gray-100'} hover:translate-y-[-4px]`
                  }`}
                style={isSelected ? { borderColor: t.colors[0] } : {}}
              >
                <div className="flex items-center justify-between w-full mb-4">
                  <div className="flex gap-1 relative">
                    <div className="w-9 h-9 rounded-full shadow-inner border-2 border-white dark:border-slate-800 z-10" style={{ backgroundColor: t.colors[0] }} />
                    <div className="w-9 h-9 rounded-full -mr-5 border-2 border-white dark:border-slate-800 shadow-sm" style={{ backgroundColor: t.colors[1] }} />
                  </div>
                  <div className={`p-2.5 rounded-2xl transition-all ${isSelected ? 'scale-110 shadow-sm' : 'opacity-40'}`} style={{ backgroundColor: isSelected ? t.colors[0] : 'transparent', color: isSelected ? 'white' : 'inherit' }}>
                    {t.icon}
                  </div>
                </div>
                
                <h3 className={`font-black text-sm mb-1 transition-colors ${isSelected ? (settings.isDarkMode ? 'text-white' : 'text-gray-900') : 'text-gray-400'}`}>
                  {t.name}
                </h3>
                <p className={`text-[10px] font-bold line-clamp-1 transition-opacity ${isSelected ? 'opacity-60' : 'opacity-30'}`}>
                  {t.desc}
                </p>
                
                {isSelected && (
                  <div className="absolute top-2 left-2 animate-in zoom-in duration-300" style={{ color: t.colors[0] }}>
                     <Check size={14} strokeWidth={4} />
                  </div>
                )}

                {/* مؤشر لوني سفلي ناعم */}
                {isSelected && (
                  <div className="absolute bottom-0 left-0 right-0 h-1 opacity-50" style={{ backgroundColor: t.colors[0] }}></div>
                )}
              </button>
            );
          })}
        </div>

        <div className="flex gap-4">
          <button onClick={toggleDarkMode} className={`flex-1 flex items-center justify-center gap-3 py-4 rounded-2xl font-bold transition-all bubble-effect active:scale-95 ${settings.isDarkMode ? 'bg-slate-800 text-yellow-400 border border-slate-700' : 'bg-gray-100 border border-gray-200 text-gray-700 hover:bg-gray-200'}`}>
            {settings.isDarkMode ? <Sun size={20}/> : <Moon size={20}/>} {settings.isDarkMode ? 'الوضع النهاري' : 'الوضع الليلي'}
          </button>
          <button onClick={() => { setSettings({ ...settings, theme: previewTheme }); triggerSave("تم حفظ السمة بنجاح"); }} className={`flex-1 ${themeColors.primary} text-white font-bold py-4 rounded-2xl shadow-lg transition-all hover:brightness-110 active:scale-95 bubble-effect flex items-center justify-center gap-2`}><Save size={20} /> حفظ المظهر</button>
        </div>
      </section>

      {/* نظام التنبيهات الذكي - نسخة محسنة للوضع النهاري */}
      <section className={`p-8 rounded-[2.5rem] border transition-all ${settings.isDarkMode ? 'bg-slate-900 border-slate-800 shadow-none' : 'bg-white shadow-xl shadow-gray-100 border-gray-100'}`}>
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-xl font-black flex items-center gap-4">
            <div className={`p-2.5 rounded-2xl ${themeColors.primaryLight} ${themeColors.primaryText}`}>
              <Bell size={24} className={settings.notificationsEnabled ? 'animate-ring' : ''} />
            </div>
            <span>نظام التنبيهات الذكي</span>
          </h2>
          <span className={`text-[10px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full ${settings.notificationsEnabled ? 'bg-green-500/10 text-green-600' : 'bg-gray-100 text-gray-400'}`}>
            {settings.notificationsEnabled ? 'متصل' : 'متوقف'}
          </span>
        </div>

        <div 
          onClick={() => setSettings({ ...settings, notificationsEnabled: !settings.notificationsEnabled })} 
          className={`p-6 rounded-[2rem] flex items-center justify-between cursor-pointer transition-all border-2 group relative overflow-hidden
            ${settings.notificationsEnabled 
              ? 'bg-green-50/50 border-green-200 dark:bg-green-500/5 dark:border-green-500/20' 
              : 'bg-gray-50/50 border-gray-100 dark:bg-slate-800/40 dark:border-slate-800'}`}
        >
          <div className="flex items-center gap-5 relative z-10">
            <div className={`p-4 rounded-2xl transition-all duration-500 ${settings.notificationsEnabled ? 'bg-green-500 text-white shadow-lg shadow-green-200' : 'bg-gray-200 text-gray-500 dark:bg-slate-700 dark:text-slate-400'}`}>
              <Bell size={24} className={settings.notificationsEnabled ? 'animate-ring' : ''} />
            </div>
            <div>
              <span className={`font-black block text-lg mb-1 transition-colors ${settings.notificationsEnabled ? 'text-green-800' : 'text-gray-400'}`}>
                تفعيل الإشعارات الفورية
              </span>
              <p className={`text-xs font-bold opacity-60 max-w-[240px] leading-relaxed ${settings.notificationsEnabled ? 'text-green-700' : 'text-gray-400'}`}>
                كن أول من يعلم عند توفر مواد بناء جديدة أو افتتاح متاجر في منطقتك.
              </p>
            </div>
          </div>

          <div className={`w-16 h-8 rounded-full p-1 transition-all duration-500 flex items-center relative shadow-inner ${settings.notificationsEnabled ? 'bg-green-500' : 'bg-gray-300 dark:bg-slate-600'}`}>
            <div 
              className={`w-6 h-6 bg-white rounded-full shadow-lg transition-all duration-500 flex items-center justify-center transform
                ${settings.notificationsEnabled ? 'translate-x-[-32px] rotate-[360deg]' : 'translate-x-0 rotate-0'}`}
            >
              {settings.notificationsEnabled && <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />}
            </div>
          </div>

          {/* تأثير بصري خلفي ناعم عند التفعيل */}
          {settings.notificationsEnabled && (
            <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/5 rounded-full blur-[40px] -mr-16 -mt-16 pointer-events-none" />
          )}
        </div>

        <div className="mt-6 flex items-start gap-3 p-4 rounded-2xl bg-blue-50/50 dark:bg-slate-800/20 border border-blue-100/50 dark:border-slate-800/50">
           <Sparkles size={16} className="text-blue-500 shrink-0 mt-0.5" />
           <p className="text-[10px] font-bold text-blue-600/80 dark:text-blue-400/80 leading-relaxed">
             نقوم بإرسال تنبيهات مخصصة بناءً على اهتماماتك وموقعك الجغرافي لضمان حصولك على أفضل العروض والأسعار.
           </p>
        </div>
      </section>
    </div>
  );
};

export default SettingsPage;
