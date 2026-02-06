
import React, { useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowRight, MapPin, Star, ArrowLeft } from 'lucide-react';
import { Store, Category } from '../types';

interface CategoryPageProps {
  stores: Store[];
  categories: Category[];
  themeColors: any;
  isDarkMode: boolean;
}

const CategoryPage: React.FC<CategoryPageProps> = ({ stores, categories, themeColors, isDarkMode }) => {
  const { id } = useParams();
  const navigate = useNavigate();

  const filteredStores = useMemo(() => {
    return stores.filter(s => s.categoryId === id);
  }, [stores, id]);

  const category = categories.find(c => c.id === id);
  const categoryName = category?.name || 'القسم';

  return (
    <div className="animate-in fade-in duration-500">
      <div className="flex items-center justify-between mb-8 px-2">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate('/')} 
            className={`p-3 rounded-2xl shadow-sm border transition-all bubble-effect ${isDarkMode ? 'bg-slate-900 border-slate-800 text-slate-400' : 'bg-white border-gray-100 text-gray-500 hover:text-blue-600'}`}
          >
            <ArrowRight size={24} />
          </button>
          <div>
            <h1 className="text-2xl font-black">{categoryName}</h1>
            <p className="text-xs opacity-50 font-bold">تم العثور على {filteredStores.length} متجر</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {filteredStores.map(store => (
          <Link 
            key={store.id} 
            to={`/store/${store.id}`}
            className={`rounded-[2.5rem] overflow-hidden border transition-all group bubble-effect ${isDarkMode ? 'bg-slate-900 border-slate-800 shadow-none' : 'bg-white border-gray-50 shadow-sm hover:shadow-xl hover:-translate-y-1'}`}
          >
            <div className="h-52 overflow-hidden relative">
              <img src={store.images[0]} alt={store.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
              <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1 shadow-sm text-gray-900">
                <Star size={14} className="text-yellow-500 fill-yellow-500" />
                {store.rating}
              </div>
            </div>
            <div className="p-8">
              <h3 className={`text-xl font-black mb-2 transition-colors group-hover:${themeColors.primaryText}`}>{store.name}</h3>
              <div className="flex items-center gap-2 text-gray-500 text-sm mb-6">
                <MapPin size={16} className={themeColors.primaryText} />
                <span className="font-bold">{store.city}، {store.neighborhood}</span>
              </div>
              <div className="flex items-center justify-between pt-6 border-t border-gray-50 dark:border-slate-800">
                <span className={`text-[10px] px-4 py-1.5 rounded-full font-black uppercase tracking-widest ${themeColors.primaryLight} ${themeColors.primaryText}`}>
                  {categoryName}
                </span>
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${isDarkMode ? 'bg-slate-800 text-white group-hover:bg-blue-600' : 'bg-gray-50 text-gray-400 group-hover:bg-blue-600 group-hover:text-white shadow-inner'}`}>
                  <ArrowLeft size={22} />
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {filteredStores.length === 0 && (
        <div className={`text-center py-24 rounded-[3rem] border-4 border-dashed font-bold flex flex-col items-center gap-6 ${isDarkMode ? 'bg-slate-900 border-slate-800 opacity-30' : 'bg-white border-gray-100 opacity-40'}`}>
          <div className="w-20 h-20 rounded-full bg-gray-100 dark:bg-slate-800 flex items-center justify-center">
            <MapPin size={40} />
          </div>
          <div className="space-y-2">
            <p className="text-xl">عذراً، لا توجد متاجر حالياً</p>
            <p className="text-sm">لم نجد أي نتائج في هذا التصنيف حالياً.</p>
          </div>
          <Link to="/" className={`mt-4 px-8 py-3 rounded-2xl border-2 font-black transition-all bubble-effect ${themeColors.primaryText} border-current hover:bg-current hover:text-white`}>العودة للرئيسية</Link>
        </div>
      )}
    </div>
  );
};

export default CategoryPage;
