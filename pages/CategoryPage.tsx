
import React, { useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowRight, MapPin, Star, ArrowLeft } from 'lucide-react';
import { Store, Category } from '../types';

// Fix: Added themeColors to CategoryPageProps to resolve type error in App.tsx.
interface CategoryPageProps {
  stores: Store[];
  categories: Category[];
  themeColors: any;
}

// Fix: Destructured themeColors from props.
const CategoryPage: React.FC<CategoryPageProps> = ({ stores, categories, themeColors }) => {
  const { id } = useParams();
  const navigate = useNavigate();

  const filteredStores = useMemo(() => {
    return stores.filter(s => s.categoryId === id);
  }, [stores, id]);

  const categoryName = categories.find(c => c.id === id)?.name || 'القسم';

  return (
    <div className="animate-in fade-in duration-500">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate('/')} 
            className="p-3 bg-white rounded-2xl shadow-sm border border-gray-100 text-gray-500 hover:text-blue-600 transition-all"
          >
            <ArrowRight size={24} />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">{categoryName}</h1>
            <p className="text-sm text-gray-500">تم العثور على {filteredStores.length} متجر</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {filteredStores.map(store => (
          <Link 
            key={store.id} 
            to={`/store/${store.id}`}
            className="bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-all group"
          >
            <div className="h-48 overflow-hidden relative">
              <img src={store.images[0]} alt={store.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
              <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1 shadow-sm">
                <Star size={14} className="text-yellow-500 fill-yellow-500" />
                {store.rating}
              </div>
            </div>
            <div className="p-6">
              <h3 className={`text-lg font-bold text-gray-800 mb-2 group-hover:${themeColors.primaryText} transition-colors`}>{store.name}</h3>
              <div className="flex items-center gap-2 text-gray-500 text-sm mb-4">
                <MapPin size={16} />
                <span>{store.city}، {store.neighborhood}</span>
              </div>
              <div className="flex items-center justify-between pt-4 border-t border-gray-50">
                <div className="flex flex-wrap gap-1">
                  <span className="text-[10px] bg-gray-100 text-gray-600 px-3 py-1 rounded-full font-bold">
                    {categories.find(c => c.id === store.categoryId)?.name}
                  </span>
                </div>
                <div className={`w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 group-hover:${themeColors.primary} group-hover:text-white transition-all`}>
                  <ArrowLeft size={20} />
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {filteredStores.length === 0 && (
        <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-200">
          <p className="text-gray-500 font-bold mb-4">عذراً، لا توجد متاجر حالياً في هذا التصنيف</p>
          <Link to="/" className={`${themeColors.primaryText} font-bold`}>العودة للرئيسية</Link>
        </div>
      )}
    </div>
  );
};

export default CategoryPage;
