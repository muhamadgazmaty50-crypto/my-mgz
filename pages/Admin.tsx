
import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Store, User, Category, Province, UserStatus, UserRole, AppSettings, StorePost, ActionLog, Report, Comment, Coordinates } from '../types';
import { PROVINCES } from '../constants';
import * as LucideIcons from 'lucide-react';
import { 
  Plus, Trash2, Edit2, User as UserIcon, Users, ShoppingBag, LayoutGrid, 
  Settings as SettingsIcon, Image as ImageIcon, Check, X, Bell, Calendar, 
  Save, Upload, ChevronDown, ChevronUp, Layers, Database, MessageSquare, 
  Phone, Mail, MapPin, Camera, Shield, UserCheck, UserX, FileText, 
  AlertTriangle, Eye, Settings2, CheckCircle, ExternalLink, Navigation, 
  Activity, ArrowLeft, Headphones, MessageCircle, Star, UploadCloud, Globe 
} from 'lucide-react';

interface AdminProps {
  stores: Store[];
  setStores: React.Dispatch<React.SetStateAction<Store[]>>;
  users: User[];
  setUsers: React.Dispatch<React.SetStateAction<User[]>>;
  categories: Category[];
  setCategories: React.Dispatch<React.SetStateAction<Category[]>>;
  posts: StorePost[];
  setPosts: React.Dispatch<React.SetStateAction<StorePost[]>>;
  comments: Comment[];
  setComments: React.Dispatch<React.SetStateAction<Comment[]>>;
  reports: Report[];
  setReports: React.Dispatch<React.SetStateAction<Report[]>>;
  actionLogs: ActionLog[];
  addActionLog: (action: string, details: string) => void;
  settings: AppSettings;
  setSettings: React.Dispatch<React.SetStateAction<AppSettings>>;
  notifyNewStore: (name: string) => void;
  themeColors: any;
  currentUser: User | null;
}

const DynamicIcon = ({ name, className }: { name: string, className?: string }) => {
  const Icon = (LucideIcons as any)[name] || Layers;
  return <Icon className={className} />;
};

const AdminDashboard: React.FC<AdminProps> = ({ 
  stores, setStores, users, setUsers, categories, setCategories, posts, setPosts, 
  comments, setComments, reports, setReports, actionLogs, addActionLog, settings, setSettings, 
  notifyNewStore, themeColors, currentUser 
}) => {
  const [activeTab, setActiveTab] = useState<'STORES' | 'USERS' | 'CATEGORIES' | 'POSTS' | 'REPORTS' | 'LOGS' | 'APP_SETTINGS'>('STORES');
  const [saveStatus, setSaveStatus] = useState<string | null>(null);
  const navigate = useNavigate();
  
  const logoInputRef = useRef<HTMLInputElement>(null);
  const storeImageRef = useRef<HTMLInputElement>(null);
  const catImageRef = useRef<HTMLInputElement>(null);

  // App settings state
  const [appConfig, setAppConfig] = useState({
    appName: settings.appName,
    appLogo: settings.appLogo
  });

  // Store Form States
  const [showStoreForm, setShowStoreForm] = useState(false);
  const [editingStoreId, setEditingStoreId] = useState<string | null>(null);
  const [storeFormData, setStoreFormData] = useState<Partial<Store>>({
    name: '', city: Province.DAMASCUS, neighborhood: '', description: '', whatsapp: '', workingHours: '9:00 AM - 6:00 PM', categoryId: '1', images: [],
    location: { lat: 33.5138, lng: 36.2965 }
  });

  // Category Form States
  const [showCatForm, setShowCatForm] = useState(false);
  const [editingCatId, setEditingCatId] = useState<string | null>(null);
  const [catFormData, setCatFormData] = useState<Partial<Category>>({
    name: '', iconName: 'Layers', color: 'bg-blue-100 text-blue-600', image: ''
  });

  const triggerSaveMessage = (msg: string) => {
    setSaveStatus(msg);
    setTimeout(() => setSaveStatus(null), 2000);
  };

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setAppConfig(p => ({ ...p, appLogo: reader.result as string }));
      reader.readAsDataURL(file);
    }
  };

  const handleSaveAppConfig = (e: React.FormEvent) => {
    e.preventDefault();
    setSettings({ ...settings, ...appConfig });
    triggerSaveMessage("تم تحديث هوية التطبيق بنجاح");
    addActionLog("تحديث النظام", "قام المدير العام بتغيير اسم/شعار التطبيق");
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'STORE' | 'CATEGORY') => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (type === 'STORE') setStoreFormData(prev => ({ ...prev, images: [reader.result as string] }));
        else setCatFormData(prev => ({ ...prev, image: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveStore = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingStoreId) {
      setStores(prev => prev.map(s => s.id === editingStoreId ? { ...s, ...storeFormData } as Store : s));
      triggerSaveMessage("تم تحديث بيانات المتجر");
      addActionLog("تعديل متجر", `تعديل المتجر: ${storeFormData.name}`);
    } else {
      const newStore: Store = {
        ...storeFormData as Store,
        id: Math.random().toString(36).substr(2, 9),
        rating: 0,
        ratings: [],
        createdAt: new Date().toISOString(),
        location: storeFormData.location || { lat: 33.5138, lng: 36.2965 },
        images: storeFormData.images?.length ? storeFormData.images : ['https://picsum.photos/seed/store/800/600']
      };
      setStores(prev => [newStore, ...prev]);
      notifyNewStore(newStore.name);
      triggerSaveMessage("تمت إضافة المتجر بنجاح");
      addActionLog("إضافة متجر", `إضافة متجر جديد: ${newStore.name}`);
    }
    setShowStoreForm(false);
    setEditingStoreId(null);
  };

  const handleSaveCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingCatId) {
      setCategories(prev => prev.map(c => c.id === editingCatId ? { ...c, ...catFormData } as Category : c));
      triggerSaveMessage("تم تحديث القسم");
    } else {
      const newCat: Category = {
        ...catFormData as Category,
        id: Math.random().toString(36).substr(2, 9)
      };
      setCategories(prev => [...prev, newCat]);
      triggerSaveMessage("تمت إضافة القسم");
    }
    setShowCatForm(false);
    setEditingCatId(null);
  };

  const isSuperAdmin = currentUser?.role === UserRole.SUPER_ADMIN;

  return (
    <div className="space-y-6 pb-10">
      {saveStatus && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-[100] bg-green-500 text-white px-6 py-3 rounded-2xl shadow-2xl flex items-center gap-2 animate-in slide-in-from-top-4">
          <CheckCircle size={20} /> <span className="font-bold text-sm">{saveStatus}</span>
        </div>
      )}

      <div className={`p-6 rounded-3xl shadow-sm border transition-colors ${settings.isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-gray-100'}`}>
        <h1 className="text-2xl font-bold mb-6">مركز الإدارة والتحكم</h1>
        <div className={`flex gap-2 p-1 rounded-2xl overflow-x-auto no-scrollbar ${settings.isDarkMode ? 'bg-slate-800' : 'bg-gray-50'}`}>
          {[
            { id: 'STORES', icon: <ShoppingBag size={18}/>, label: 'المتاجر' },
            { id: 'CATEGORIES', icon: <LayoutGrid size={18}/>, label: 'الأقسام' },
            { id: 'USERS', icon: <Users size={18}/>, label: 'الأعضاء' },
            { id: 'POSTS', icon: <MessageSquare size={18}/>, label: 'المنشورات' },
            { id: 'APP_SETTINGS', icon: <Settings2 size={18}/>, label: 'النظام', hide: !isSuperAdmin },
            { id: 'REPORTS', icon: <AlertTriangle size={18}/>, label: 'البلاغات' },
            { id: 'LOGS', icon: <Activity size={18}/>, label: 'السجل' },
          ].filter(t => !t.hide).map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id as any)} className={`relative flex-1 min-w-[100px] flex items-center justify-center gap-2 py-3 rounded-xl font-bold transition-all text-sm bubble-effect ${activeTab === tab.id ? `${themeColors.primary} text-white shadow-lg` : 'text-gray-400 hover:text-gray-600 dark:hover:text-slate-200'}`}>
              {tab.icon} {tab.label}
              {tab.id === 'REPORTS' && reports.some(r => r.status === 'PENDING') && <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>}
            </button>
          ))}
        </div>
      </div>

      {activeTab === 'STORES' && (
        <div className="space-y-6 animate-in fade-in">
          <div className="flex items-center justify-between px-2">
            <h2 className="text-xl font-bold flex items-center gap-2"><ShoppingBag size={20} className={themeColors.primaryText}/> إدارة المتاجر ({stores.length})</h2>
            <button onClick={() => { setEditingStoreId(null); setStoreFormData({ name: '', city: Province.DAMASCUS, categoryId: '1', workingHours: '9:00 AM - 6:00 PM', images: [], location: { lat: 33.5138, lng: 36.2965 } }); setShowStoreForm(true); }} className={`${themeColors.primary} text-white px-6 py-2 rounded-xl font-bold flex items-center gap-2 shadow-lg bubble-effect`}>
              <Plus size={18}/> إضافة متجر
            </button>
          </div>

          {showStoreForm && (
            <form onSubmit={handleSaveStore} className={`p-8 rounded-[2.5rem] border shadow-xl space-y-6 animate-in slide-in-from-top-4 ${settings.isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-gray-100'}`}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <input required placeholder="اسم المتجر" className={`p-4 rounded-2xl border outline-none font-bold ${settings.isDarkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-gray-50 border-gray-100'}`} value={storeFormData.name} onChange={e => setStoreFormData({...storeFormData, name: e.target.value})} />
                <select className={`p-4 rounded-2xl border outline-none font-bold ${settings.isDarkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-gray-50 border-gray-100'}`} value={storeFormData.city} onChange={e => setStoreFormData({...storeFormData, city: e.target.value as Province})}>
                  {PROVINCES.map(p => <option key={p} value={p}>{p}</option>)}
                </select>
                <select className={`p-4 rounded-2xl border outline-none font-bold ${settings.isDarkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-gray-50 border-gray-100'}`} value={storeFormData.categoryId} onChange={e => setStoreFormData({...storeFormData, categoryId: e.target.value})}>
                  {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
                <div className="flex flex-col gap-2">
                   <button type="button" onClick={() => storeImageRef.current?.click()} className={`flex items-center justify-center gap-2 p-4 rounded-2xl border-2 border-dashed font-bold transition-all ${settings.isDarkMode ? 'bg-slate-800 border-slate-700 hover:border-blue-500' : 'bg-gray-50 border-gray-200 text-gray-400 hover:border-blue-600'}`}>
                     <UploadCloud size={20}/> {storeFormData.images?.length ? 'تغيير الصورة' : 'رفع صورة للمتجر'}
                   </button>
                   <input type="file" ref={storeImageRef} hidden accept="image/*" onChange={(e) => handleFileChange(e, 'STORE')} />
                   {storeFormData.images?.[0] && <img src={storeFormData.images[0]} className="w-16 h-16 rounded-xl object-cover border mx-auto shadow-sm" alt="" />}
                </div>
              </div>
              <div className="flex gap-4">
                <button type="submit" className={`flex-1 ${themeColors.primary} text-white font-black py-4 rounded-2xl shadow-xl hover:brightness-110 active:scale-95 transition-all bubble-effect`}>حفظ بيانات المتجر</button>
                <button type="button" onClick={() => setShowStoreForm(false)} className={`px-8 py-4 rounded-2xl font-bold transition-all ${settings.isDarkMode ? 'bg-slate-800 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>إلغاء</button>
              </div>
            </form>
          )}

          <div className="grid grid-cols-1 gap-4">
            {stores.map(s => (
              <div key={s.id} className={`p-4 rounded-[2rem] border flex items-center gap-4 transition-all hover:shadow-xl group ${settings.isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-gray-50 hover:border-blue-100 shadow-sm'}`}>
                <div className="relative overflow-hidden rounded-2xl w-20 h-20 shrink-0">
                   <img src={s.images[0]} className="w-full h-full object-cover transition-transform group-hover:scale-110" alt="" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-black text-lg truncate mb-0.5">{s.name}</h4>
                  <p className="text-[10px] opacity-40 font-black uppercase tracking-wider">{s.city} - {categories.find(c => c.id === s.categoryId)?.name}</p>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => navigate(`/store/${s.id}`)} className={`p-3.5 rounded-2xl transition-all bubble-effect ${settings.isDarkMode ? 'bg-blue-900/20 text-blue-400 hover:bg-blue-900/40' : 'bg-blue-50 text-blue-600 hover:bg-blue-100 hover:shadow-lg hover:shadow-blue-500/10'}`} title="عرض المتجر"><Eye size={20}/></button>
                  <button onClick={() => { setEditingStoreId(s.id); setStoreFormData(s); setShowStoreForm(true); }} className={`p-3.5 rounded-2xl transition-all bubble-effect ${settings.isDarkMode ? 'bg-amber-900/20 text-amber-400 hover:bg-amber-900/40' : 'bg-amber-50 text-amber-600 hover:bg-amber-100 hover:shadow-lg hover:shadow-amber-500/10'}`} title="تعديل"><Edit2 size={20}/></button>
                  <button onClick={() => { if(window.confirm('هل أنت متأكد من حذف المتجر؟')) setStores(prev => prev.filter(st => st.id !== s.id)); }} className={`p-3.5 rounded-2xl transition-all bubble-effect ${settings.isDarkMode ? 'bg-red-900/20 text-red-400 hover:bg-red-900/40' : 'bg-red-50 text-red-600 hover:bg-red-100 hover:shadow-lg hover:shadow-red-500/10'}`} title="حذف"><Trash2 size={20}/></button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'CATEGORIES' && (
        <div className="space-y-6 animate-in fade-in">
          <div className="flex items-center justify-between px-2">
            <h2 className="text-xl font-bold flex items-center gap-2"><LayoutGrid size={20} className={themeColors.primaryText}/> إدارة الأقسام ({categories.length})</h2>
            <button onClick={() => { setEditingCatId(null); setCatFormData({ name: '', color: 'bg-blue-100 text-blue-600', image: '' }); setShowCatForm(true); }} className={`${themeColors.primary} text-white px-6 py-2 rounded-xl font-bold flex items-center gap-2 shadow-lg bubble-effect`}>
              <Plus size={18}/> إضافة قسم
            </button>
          </div>

          {showCatForm && (
            <form onSubmit={handleSaveCategory} className={`p-8 rounded-[2.5rem] border shadow-xl space-y-6 animate-in slide-in-from-top-4 ${settings.isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-gray-100'}`}>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <input required placeholder="اسم القسم" className={`p-4 rounded-2xl border outline-none font-bold ${settings.isDarkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-gray-50 border-gray-100'}`} value={catFormData.name} onChange={e => setCatFormData({...catFormData, name: e.target.value})} />
                <div className="flex flex-col gap-2">
                   <button type="button" onClick={() => catImageRef.current?.click()} className={`flex items-center justify-center gap-2 p-4 rounded-2xl border-2 border-dashed font-bold transition-all ${settings.isDarkMode ? 'bg-slate-800 border-slate-700 hover:border-blue-500' : 'bg-gray-50 border-gray-200 text-gray-400 hover:border-blue-600'}`}>
                     <UploadCloud size={20}/> {catFormData.image ? 'تغيير الأيقونة' : 'رفع أيقونة القسم'}
                   </button>
                   <input type="file" ref={catImageRef} hidden accept="image/*" onChange={(e) => handleFileChange(e, 'CATEGORY')} />
                   {catFormData.image && <img src={catFormData.image} className="w-12 h-12 rounded-xl object-contain border mx-auto p-1 shadow-sm" alt="" />}
                </div>
              </div>
              <div className="flex gap-4">
                <button type="submit" className={`flex-1 ${themeColors.primary} text-white font-black py-4 rounded-2xl shadow-xl hover:brightness-110 transition-all bubble-effect`}>حفظ القسم</button>
                <button type="button" onClick={() => setShowCatForm(false)} className={`px-8 py-4 rounded-2xl font-bold transition-all ${settings.isDarkMode ? 'bg-slate-800 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>إلغاء</button>
              </div>
            </form>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {categories.map(c => (
              <div key={c.id} className={`p-5 rounded-[2rem] border flex items-center justify-between transition-all group hover:shadow-xl ${settings.isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-gray-50 hover:border-blue-100 shadow-sm'}`}>
                <div className="flex items-center gap-4">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center overflow-hidden transition-transform group-hover:rotate-6 ${c.color || 'bg-blue-50 text-blue-600'} shadow-sm`}>
                    {c.image ? <img src={c.image} className="w-full h-full object-contain p-2" alt="" /> : <DynamicIcon name={c.iconName} className="w-7 h-7" />}
                  </div>
                  <span className="font-black text-sm">{c.name}</span>
                </div>
                <div className="flex gap-1">
                  <button onClick={() => { setEditingCatId(c.id); setCatFormData(c); setShowCatForm(true); }} className={`p-2.5 rounded-xl transition-all bubble-effect ${settings.isDarkMode ? 'text-amber-400 hover:bg-amber-900/20' : 'text-amber-500 hover:bg-amber-50'}`}><Edit2 size={18}/></button>
                  <button onClick={() => { if(window.confirm('حذف القسم؟')) setCategories(prev => prev.filter(cat => cat.id !== c.id)); }} className={`p-2.5 rounded-xl transition-all bubble-effect ${settings.isDarkMode ? 'text-red-400 hover:bg-red-900/20' : 'text-red-500 hover:bg-red-50'}`}><Trash2 size={18}/></button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'USERS' && (
        <div className="space-y-6 animate-in fade-in">
          <h2 className="text-xl font-bold flex items-center gap-2 px-2"><Users size={20} className={themeColors.primaryText}/> إدارة المستخدمين ({users.length})</h2>
          <div className="grid grid-cols-1 gap-4">
            {users.map(u => (
              <div key={u.id} className={`p-5 rounded-3xl border flex items-center justify-between transition-all ${settings.isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-gray-50 shadow-sm hover:border-blue-100'}`}>
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-white shadow-lg ${themeColors.primary}`}>{u.username[0].toUpperCase()}</div>
                  <div>
                    <h4 className="font-black text-base flex items-center gap-2">{u.username} {u.role === UserRole.SUPER_ADMIN && <Shield size={14} className="text-amber-500" />}</h4>
                    <p className="text-[10px] opacity-40 font-black uppercase tracking-wider">{u.email} - {u.role}</p>
                  </div>
                </div>
                {u.role !== UserRole.SUPER_ADMIN && (
                   <div className="flex gap-2">
                    <button onClick={() => {
                      const newStatus = u.status === UserStatus.APPROVED ? UserStatus.REJECTED : UserStatus.APPROVED;
                      setUsers(prev => prev.map(usr => usr.id === u.id ? {...usr, status: newStatus} : usr));
                    }} className={`px-6 py-2 rounded-xl text-xs font-black transition-all bubble-effect ${u.status === UserStatus.APPROVED ? 'bg-red-50 text-red-600 hover:bg-red-100' : 'bg-green-50 text-green-600 hover:bg-green-100'}`}>
                      {u.status === UserStatus.APPROVED ? 'حظر العضو' : 'تفعيل العضو'}
                    </button>
                    <button onClick={() => { if(window.confirm('حذف المستخدم نهائياً؟')) setUsers(prev => prev.filter(usr => usr.id !== u.id)); }} className={`p-3.5 rounded-xl transition-all bubble-effect ${settings.isDarkMode ? 'bg-slate-800 text-slate-400 hover:text-red-400' : 'bg-gray-100 text-gray-400 hover:bg-red-50 hover:text-red-500'}`}><Trash2 size={20}/></button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'POSTS' && (
        <div className="space-y-6 animate-in fade-in">
          <h2 className="text-xl font-bold flex items-center gap-2 px-2"><MessageSquare size={20} className={themeColors.primaryText}/> إدارة المنشورات ({posts.length})</h2>
          <div className="space-y-4">
            {posts.map(p => (
              <div key={p.id} className={`p-6 rounded-[2rem] border transition-all ${settings.isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-gray-50 shadow-sm'}`}>
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl ${themeColors.primary} text-white flex items-center justify-center font-black shadow-md`}>{p.authorName[0]}</div>
                    <div><span className="font-black text-sm block">{p.authorName}</span><span className="text-[10px] opacity-40 font-bold">{new Date(p.createdAt).toLocaleDateString('ar-SY')}</span></div>
                  </div>
                  <div className="flex gap-2">
                     <button onClick={() => setPosts(prev => prev.map(post => post.id === p.id ? {...post, status: post.status === 'APPROVED' ? 'PENDING' : 'APPROVED'} : post))} className={`p-2.5 rounded-xl transition-all bubble-effect ${p.status === 'APPROVED' ? 'text-green-500 bg-green-50 dark:bg-green-900/20' : 'text-gray-400 bg-gray-50 dark:bg-slate-800'}`} title={p.status === 'APPROVED' ? 'إلغاء الموافقة' : 'موافقة'}><CheckCircle size={22}/></button>
                     <button onClick={() => setPosts(prev => prev.filter(post => post.id !== p.id))} className={`p-2.5 rounded-xl transition-all bubble-effect text-red-400 hover:text-red-600 bg-red-50 dark:bg-red-900/20`} title="حذف المنشور"><Trash2 size={22}/></button>
                  </div>
                </div>
                <p className="text-base font-medium opacity-80 mb-4 leading-relaxed">{p.content}</p>
                <div className="flex items-center gap-2 text-[10px] font-black opacity-30 uppercase tracking-widest bg-gray-100 dark:bg-slate-800 w-fit px-3 py-1 rounded-lg">
                  <ShoppingBag size={12} /> المتجر: {stores.find(s => s.id === p.storeId)?.name}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'APP_SETTINGS' && isSuperAdmin && (
        <div className="space-y-6 animate-in slide-in-from-bottom-4">
           <div className="flex items-center gap-3 px-2">
            <Globe className={themeColors.primaryText} size={24} />
            <h2 className="text-xl font-bold">تخصيص هوية المنصة</h2>
          </div>
          <form onSubmit={handleSaveAppConfig} className={`p-8 rounded-[2.5rem] border shadow-xl space-y-8 ${settings.isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-gray-100'}`}>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
               <div className="space-y-2">
                 <label className="text-xs font-black opacity-40 mr-2 uppercase tracking-widest">اسم التطبيق العلوي</label>
                 <input 
                  type="text" 
                  className={`w-full p-5 rounded-2xl border outline-none font-black text-lg transition-all ${settings.isDarkMode ? 'bg-slate-800 border-slate-700 text-white focus:border-blue-500' : 'bg-gray-50 border-gray-100 focus:bg-white focus:border-blue-600 focus:shadow-lg focus:shadow-blue-500/5'}`}
                  value={appConfig.appName}
                  onChange={e => setAppConfig({...appConfig, appName: e.target.value})}
                  placeholder="مثال: دليل البناء السوري"
                 />
               </div>
               <div className="space-y-2">
                  <label className="text-xs font-black opacity-40 mr-2 uppercase tracking-widest">شعار المنصة (Logo)</label>
                  <div className="flex items-center gap-4">
                    <button type="button" onClick={() => logoInputRef.current?.click()} className={`flex-1 p-5 rounded-2xl border-2 border-dashed font-black flex items-center justify-center gap-2 transition-all bubble-effect ${settings.isDarkMode ? 'bg-slate-800 border-slate-700 hover:border-blue-500' : 'bg-gray-50 border-gray-200 text-gray-500 hover:border-blue-600 hover:bg-blue-50/30'}`}>
                      <Camera size={22} /> رفع شعار جديد
                    </button>
                    <div className={`w-16 h-16 rounded-2xl shadow-xl flex items-center justify-center overflow-hidden border ${settings.isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-100'}`}>
                      {appConfig.appLogo.length > 5 ? <img src={appConfig.appLogo} className="w-full h-full object-contain" /> : <span className="text-3xl">{appConfig.appLogo}</span>}
                    </div>
                  </div>
                  <input type="file" ref={logoInputRef} className="hidden" accept="image/*" onChange={handleLogoChange} />
               </div>
             </div>
             <button type="submit" className={`w-full ${themeColors.primary} text-white font-black py-5 rounded-2xl shadow-xl hover:brightness-110 active:scale-95 transition-all bubble-effect flex items-center justify-center gap-3`}>
               <Save size={22} /> حفظ تغييرات الهوية البصرية للمنصة
             </button>
          </form>
        </div>
      )}

      {activeTab === 'LOGS' && (
        <div className="space-y-6 animate-in fade-in">
          <h2 className="text-xl font-bold flex items-center gap-2 px-2"><Activity size={20} className={themeColors.primaryText}/> سجل العمليات الإدارية</h2>
          <div className="space-y-3">
            {actionLogs.map(log => (
              <div key={log.id} className={`p-5 rounded-3xl border flex flex-col gap-2 transition-all hover:translate-x-[-4px] ${settings.isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-gray-50 shadow-sm'}`}>
                <div className="flex justify-between items-center font-black text-xs">
                  <span className={`px-3 py-1 rounded-lg ${themeColors.primaryLight} ${themeColors.primaryText}`}>{log.action}</span>
                  <span className="opacity-30 flex items-center gap-1"><Calendar size={12}/> {new Date(log.timestamp).toLocaleString('ar-SY')}</span>
                </div>
                <p className="text-sm font-bold opacity-80 leading-relaxed">{log.details}</p>
                <div className="flex items-center gap-2 text-[10px] font-black opacity-40 uppercase tracking-widest mt-1">
                   <UserIcon size={12}/> المسؤول: {log.adminName}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
