
import React from 'react';
import { MessageCircle, Info, ShieldCheck, Mail, Phone, ExternalLink, Clock } from 'lucide-react';
import { AppSettings } from '../types';

interface ContactProps {
  settings: AppSettings;
  themeColors: any;
}

const ContactPage: React.FC<ContactProps> = ({ settings, themeColors }) => {
  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-10">
      <div className="text-center space-y-4">
        <div className={`w-20 h-20 mx-auto rounded-3xl flex items-center justify-center shadow-lg bubble-effect ${settings.isDarkMode ? 'bg-blue-900/30 text-blue-400' : 'bg-blue-100 text-blue-600'}`}>
          <Info size={40} />
        </div>
        <h1 className="text-3xl font-black">اتصل بنا</h1>
        <p className={`max-w-md mx-auto font-medium ${settings.isDarkMode ? 'text-slate-400' : 'text-gray-500'}`}>
          دليل البناء هو منصتك الشاملة للوصول إلى أفضل موردي مواد البناء في سوريا. نحن نربطك بالمتجر مباشرة دون عمولات.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* بطاقة التواصل المباشر */}
        <section className={`p-8 rounded-[2.5rem] border shadow-xl space-y-8 hover-scale transition-all ${settings.isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-gray-100'}`}>
          <div className="flex items-center gap-3">
            <div className={`p-2.5 rounded-xl bg-green-500/10 text-green-500`}>
              <MessageCircle size={22} />
            </div>
            <h2 className="text-xl font-bold">التواصل الفوري</h2>
          </div>
          
          <div className="space-y-4">
            <button 
              onClick={() => window.open(`https://wa.me/${settings.ownerWhatsapp}`)}
              className="w-full bg-green-500 hover:bg-green-600 text-white font-black py-5 rounded-2xl flex items-center justify-center gap-3 shadow-lg shadow-green-900/20 transition-all bubble-effect"
            >
              <MessageCircle size={24} />
              مراسلة واتساب الإدارة
            </button>
            <div className={`p-5 rounded-2xl border text-center transition-colors ${settings.isDarkMode ? 'bg-slate-800/50 border-slate-700' : 'bg-gray-50 border-gray-100'}`}>
              <span className="text-[10px] text-gray-400 font-black uppercase tracking-widest block mb-1">رقم الإدارة المعتمد</span>
              <span className={`font-mono font-black text-xl ${settings.isDarkMode ? 'text-white' : 'text-gray-800'}`}>{settings.ownerWhatsapp}</span>
            </div>
          </div>
        </section>

        {/* بطاقة المعلومات الإضافية - المحسنة */}
        <section className={`p-8 rounded-[2.5rem] border shadow-xl space-y-8 hover-scale transition-all ${settings.isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-gray-100'}`}>
          <div className="flex items-center gap-3">
            <div className={`p-2.5 rounded-xl ${themeColors.primaryLight} ${themeColors.primaryText}`}>
              <ShieldCheck size={22} />
            </div>
            <h2 className="text-xl font-bold">قنوات الدعم</h2>
          </div>

          <div className="space-y-4">
            <div className={`flex items-center gap-4 p-4 rounded-2xl border transition-all ${settings.isDarkMode ? 'bg-slate-800/30 border-slate-800' : 'bg-gray-50/50 border-gray-100'} hover:border-blue-500/30 group`}>
              <div className={`p-3 rounded-xl ${themeColors.primaryLight} ${themeColors.primaryText} transition-transform group-hover:scale-110`}>
                <Mail size={20} />
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-0.5">البريد الرسمي</span>
                <span className={`font-bold text-sm ${settings.isDarkMode ? 'text-slate-200' : 'text-gray-700'}`}>{settings.adminEmail}</span>
              </div>
            </div>

            <div className={`flex items-center gap-4 p-4 rounded-2xl border transition-all ${settings.isDarkMode ? 'bg-slate-800/30 border-slate-800' : 'bg-gray-50/50 border-gray-100'} hover:border-green-500/30 group`}>
              <div className={`p-3 rounded-xl bg-green-500/10 text-green-500 transition-transform group-hover:scale-110`}>
                <Phone size={20} />
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-0.5">هاتف المكتب</span>
                <span className={`font-bold text-sm ${settings.isDarkMode ? 'text-slate-200' : 'text-gray-700'}`}>{settings.adminPhone}</span>
              </div>
            </div>

            <div className={`flex items-center gap-4 p-4 rounded-2xl border transition-all ${settings.isDarkMode ? 'bg-amber-500/5 border-slate-800' : 'bg-amber-50/30 border-amber-100/50'}`}>
              <div className={`p-3 rounded-xl bg-amber-500/10 text-amber-500`}>
                <Clock size={20} />
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-0.5">ساعات العمل</span>
                <span className={`font-bold text-xs ${settings.isDarkMode ? 'text-slate-300' : 'text-gray-600'}`}>9:00 صباحاً - 5:00 مساءً</span>
              </div>
            </div>
          </div>

          <div className="pt-2">
            <p className={`text-xs leading-relaxed italic font-medium text-center ${settings.isDarkMode ? 'text-slate-500' : 'text-gray-400'}`}>
              * نسعى دائماً للرد على كافة الاستفسارات خلال أقل من 24 ساعة عمل.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
};

export default ContactPage;
