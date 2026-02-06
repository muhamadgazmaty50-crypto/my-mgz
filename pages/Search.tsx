
import React, { useState, useMemo, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, MapPin, Star, ChevronLeft, Globe, Zap } from 'lucide-react';
import { Store, Category, AppSettings } from '../types';
import { PROVINCES } from '../constants';

interface SearchProps {
  stores: Store[];
  categories: Category[];
  settings: AppSettings;
  themeColors: any;
}

const SearchPage: React.FC<SearchProps> = ({ stores, categories, settings, themeColors }) => {
  const [query, setQuery] = useState('');
  const [city, setCity] = useState<string>('الكل');
  const [category, setCategory] = useState('الكل');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const suggestions = useMemo(() => {
    if (!query.trim()) return [];
    const lowerQuery = query.toLowerCase();
    
    const storeSuggestions = stores
      .filter(s => s.name.toLowerCase().includes(lowerQuery))
      .slice(0, 3)
      .map(s => ({ id: s.id, name: s.name, type: 'STORE' }));

    const categorySuggestions = categories
      .filter(c => c.name.toLowerCase().includes(lowerQuery))
      .slice(0, 2)
      .map(c => ({ id: c.id, name: c.name, type: 'CATEGORY' }));

    return [...categorySuggestions, ...storeSuggestions];
  }, [query, stores, categories]);

  const filteredStores = useMemo(() => {
    return stores.filter(store => {
      const matchesQuery = store.name.toLowerCase().includes(query.toLowerCase()) || 
                          store.description.toLowerCase().includes(query.toLowerCase());
      const matchesCity = city === 'الكل' || store.city === city;
      const matchesCategory = category === 'الكل' || store.categoryId === category;
      return matchesQuery && matchesCity && matchesCategory;
    });
  }, [stores, query, city, category]);

  return (
    <div className="space-y-6">
      <div className={`p-6 rounded-3xl shadow-sm border sticky top-4 z-40 transition-colors ${settings.isDarkMode ? 'bg-slate-900 border-slate-800 text-slate-100' : 'bg-white border-gray-100'}`} ref={searchRef}>
        <h1 className="text-2xl font-bold mb-6 flex items-center gap-2">
          <Globe className={themeColors.primaryText} /> البحث والتصفية
        </h1>
        
        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input 
              type="text" 
              placeholder="ابحث عن متجر، مادة بناء..."
              className={`w-full border rounded-2xl py-4 pr-12 pl-4 focus:ring-4 ${settings.isDarkMode ? 'focus:ring-white/5 bg-slate-800 border-slate-700 text-slate-100' : 'focus:ring-blue-500/5 bg-gray-50 border-gray-200'} outline-none transition-all`}
              value={query}
              onChange={(e) => { setQuery(e.target.value); setShowSuggestions(true); }}
              onFocus={() => setShowSuggestions(true)}
            />

            {/* نظام الإكمال التلقائي */}
            {showSuggestions && suggestions.length > 0 && (
              <div className={`absolute left-0 right-0 top-full mt-2 rounded-2xl border shadow-2xl overflow-hidden z-50 animate-in slide-in-from-top-2 ${settings.isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-gray-100'}`}>
                {suggestions.map((item, idx) => (
                  <div 
                    key={`${item.type}-${item.id}`}
                    className={`p-4 flex items-center gap-3 cursor-pointer transition-colors ${settings.isDarkMode ? 'hover:bg-slate-800' : 'hover:bg-gray-50'} ${idx !== suggestions.length - 1 ? 'border-b border-gray-100 dark:border-slate-800' : ''}`}
                    onClick={() => { setQuery(item.name); setShowSuggestions(false); }}
                  >
                    <Zap size={14} className={item.type === 'CATEGORY' ? 'text-amber-500' : 'text-blue-500'} />
                    <span className="font-bold text-sm">{item.name}</span>
                    <span className="text-[10px] opacity-40 mr-auto uppercase font-black">{item.type === 'CATEGORY' ? 'قسم' : 'متجر'}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <select className={`w-full border rounded-xl py-3 px-4 outline-none ${settings.isDarkMode ? 'bg-slate-800 border-slate-700 text-slate-100' : 'bg-gray-50 border-gray-200'}`} value={city} onChange={(e) => setCity(e.target.value)}>
              <option value="الكل">جميع المحافظات</option>
              {PROVINCES.map(p => <option key={p} value={p}>{p}</option>)}
            </select>
            <select className={`w-full border rounded-xl py-3 px-4 outline-none ${settings.isDarkMode ? 'bg-slate-800 border-slate-700 text-slate-100' : 'bg-gray-50 border-gray-200'}`} value={category} onChange={(e) => setCategory(e.target.value)}>
              <option value="الكل">جميع المواد</option>
              {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
            </select>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {filteredStores.length > 0 ? (
          <div className="grid grid-cols-1 gap-4">
            {filteredStores.map(store => (
              <Link key={store.id} to={`/store/${store.id}`} className={`p-4 rounded-2xl border shadow-sm flex gap-4 transition-all group bubble-effect ${settings.isDarkMode ? 'bg-slate-900 border-slate-800 hover:bg-slate-800/50' : 'bg-white border-gray-100 hover:shadow-md'}`}>
                <img src={store.images[0]} className="w-24 h-24 rounded-xl object-cover" alt="" />
                <div className="flex-1 min-w-0 py-1">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-bold truncate">{store.name}</h3>
                    <div className="flex items-center gap-1 text-[10px] font-bold text-yellow-600">
                      <Star size={12} className="fill-yellow-600" /> {store.rating}
                    </div>
                  </div>
                  <div className="flex items-center gap-1 text-gray-400 text-xs mb-2">
                    <MapPin size={12} /> <span>{store.city} - {store.neighborhood}</span>
                  </div>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${settings.isDarkMode ? 'bg-blue-900/30 text-blue-400' : 'bg-blue-50 text-blue-600'}`}>
                    {categories.find(c => c.id === store.categoryId)?.name}
                  </span>
                </div>
                <div className="flex items-center text-gray-300"><ChevronLeft size={20} /></div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 rounded-3xl border border-dashed opacity-50 font-bold">لم يتم العثور على نتائج</div>
        )}
      </div>
    </div>
  );
};

export default SearchPage;
