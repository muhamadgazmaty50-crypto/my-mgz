
import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, ArrowRight, Navigation, Layers, Search } from 'lucide-react';
import * as LucideIcons from 'lucide-react';
import { Store, Category, AppSettings } from '../types';

interface HomeProps {
  stores: Store[];
  userLocation?: { lat: number, lng: number } | null;
  settings: AppSettings;
  categories: Category[];
  themeColors: any;
}

const DynamicIcon = ({ name, className }: { name: string, className?: string }) => {
  const Icon = (LucideIcons as any)[name] || Layers;
  return <Icon className={className} />;
};

const HomePage: React.FC<HomeProps> = ({ stores, userLocation, settings, categories, themeColors }) => {
  return (
    <div className="space-y-12 animate-in fade-in duration-500 pb-10">
      <section>
        <div className={`relative overflow-hidden rounded-[3rem] ${themeColors.primary} text-white p-12 md:p-16 shadow-2xl mb-8 transition-colors duration-500`}>
          <div className="relative z-10 max-w-xl">
            <h1 className="text-4xl md:text-6xl font-black mb-8 leading-tight drop-shadow-2xl">
              {settings.heroTitle}
            </h1>
            <p className="text-white/80 text-xl mb-10 font-bold leading-relaxed">
              {settings.heroSubtitle}
            </p>
            <Link 
              to="/search" 
              className={`inline-flex items-center gap-4 bg-white ${themeColors.primaryText} px-10 py-5 rounded-[2rem] font-black text-lg hover:scale-105 transition-all shadow-2xl active:scale-95 bubble-effect border-4 border-white/20`}
            >
              <Search size={22} strokeWidth={3} />
              ابدأ البحث الآن
              <ArrowRight size={22} className="mr-2" />
            </Link>
          </div>
          <div className="absolute -bottom-20 -right-20 opacity-10 pointer-events-none rotate-12 scale-125">
             <Navigation size={450} strokeWidth={1} />
          </div>
          <div className="absolute top-0 right-0 w-80 h-80 bg-white/20 rounded-full blur-[100px] -mr-40 -mt-40"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-black/10 rounded-full blur-[80px] -ml-20 -mb-20"></div>
        </div>
      </section>

      <section>
        <div className="flex items-center justify-between mb-8 px-2">
          <h2 className={`text-2xl font-black flex items-center gap-3 ${settings.isDarkMode ? 'text-slate-100' : 'text-gray-900'}`}>
            <Layers size={24} className={themeColors.primaryText} /> الأقسام والمواد
          </h2>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-5">
          {categories.map((cat) => (
            <Link 
              key={cat.id} 
              to={`/category/${cat.id}`}
              className={`flex flex-col items-center gap-4 p-6 rounded-[2.5rem] border transition-all group bubble-effect ${settings.isDarkMode ? 'bg-slate-900 border-slate-800 hover:border-blue-500/50' : 'bg-white border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-2'}`}
            >
              <div className={`w-20 h-20 rounded-3xl flex items-center justify-center overflow-hidden transition-all group-hover:rotate-12 shadow-sm ${cat.color || `${themeColors.primaryLight} ${themeColors.primaryText}`}`}>
                {cat.image ? (
                  <img src={cat.image} className="w-full h-full object-contain p-2" alt={cat.name} />
                ) : (
                  <DynamicIcon name={cat.iconName} className="w-10 h-10" />
                )}
              </div>
              <span className={`text-sm font-black truncate w-full text-center transition-colors ${settings.isDarkMode ? 'text-slate-300 group-hover:text-white' : 'text-gray-700 group-hover:text-gray-900'}`}>{cat.name}</span>
            </Link>
          ))}
        </div>
      </section>

      <section>
        <div className="flex items-center justify-between mb-8 px-2">
          <h2 className={`text-2xl font-black ${settings.isDarkMode ? 'text-slate-100' : 'text-gray-900'}`}>أحدث المتاجر</h2>
          <Link to="/search" className={`${themeColors.primaryText} text-sm font-black hover:underline underline-offset-8 flex items-center gap-2`}>عرض الكل <ArrowRight size={16}/></Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {[...stores].sort((a,b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 6).map((store) => (
            <Link 
              key={store.id} 
              to={`/store/${store.id}`} 
              className={`rounded-[2.5rem] p-5 border transition-all flex gap-6 bubble-effect group ${settings.isDarkMode ? 'bg-slate-900 border-slate-800 hover:bg-slate-800/50' : 'bg-white border-gray-100 shadow-sm hover:shadow-2xl hover:-translate-y-1'}`}
            >
              <div className="relative overflow-hidden rounded-3xl w-28 h-28 shrink-0 shadow-inner">
                <img src={store.images[0]} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" alt="" />
              </div>
              <div className="min-w-0 flex-1 flex flex-col justify-center">
                <h3 className={`font-black truncate text-xl mb-1 ${settings.isDarkMode ? 'text-slate-100' : 'text-gray-900'}`}>{store.name}</h3>
                <div className="flex items-center gap-1.5 text-gray-400 mb-3">
                  <MapPin size={14} className={themeColors.primaryText} />
                  <p className="text-xs truncate font-bold">{store.city} - {store.neighborhood}</p>
                </div>
                <div className={`text-[10px] inline-flex items-center w-fit px-4 py-1.5 rounded-full font-black uppercase tracking-wider ${themeColors.primaryLight} ${themeColors.primaryText}`}>
                  {categories.find(c => c.id === store.categoryId)?.name}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
};

export default HomePage;
