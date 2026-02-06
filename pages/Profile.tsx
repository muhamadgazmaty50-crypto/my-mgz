
import React, { useState, useRef } from 'react';
import { User, StorePost, Comment, AppSettings } from '../types';
import { Camera, Edit3, MessageSquare, History, User as UserIcon, LogOut, Save, X, Clock, Mail, Phone, FileText, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface ProfileProps {
  currentUser: User | null;
  setCurrentUser: (u: User | null) => void;
  posts: StorePost[];
  comments: Comment[];
  settings: AppSettings;
  themeColors: any;
}

const ProfilePage: React.FC<ProfileProps> = ({ currentUser, setCurrentUser, posts, comments, settings, themeColors }) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'INFO' | 'HISTORY'>('INFO');
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState<Partial<User>>({});
  const [saveStatus, setSaveStatus] = useState(false);
  const avatarInputRef = useRef<HTMLInputElement>(null);

  if (!currentUser) return (
    <div className="flex flex-col items-center justify-center py-24 space-y-6 animate-in fade-in">
      <div className="w-24 h-24 bg-gray-100 dark:bg-slate-800 rounded-full flex items-center justify-center text-gray-400">
        <UserIcon size={48} />
      </div>
      <p className="font-black text-xl opacity-50">يرجى تسجيل الدخول لعرض الملف الشخصي</p>
      <button onClick={() => navigate('/login')} className={`px-8 py-3 rounded-2xl font-bold text-white shadow-lg bubble-effect ${themeColors.primary}`}>تسجيل الدخول</button>
    </div>
  );

  const userPosts = posts.filter(p => p.authorId === currentUser.id);
  const userComments = comments.filter(c => c.authorId === currentUser.id);

  const startEditing = () => {
    setEditData({
      username: currentUser.username,
      email: currentUser.email,
      phone: currentUser.phone || '',
      bio: currentUser.bio || '',
      avatar: currentUser.avatar
    });
    setIsEditing(true);
  };

  const handleSaveProfile = () => {
    const updatedUser = { ...currentUser, ...editData } as User;
    setCurrentUser(updatedUser);
    setIsEditing(false);
    setSaveStatus(true);
    setTimeout(() => setSaveStatus(false), 3000);
  };

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setEditData(prev => ({ ...prev, avatar: reader.result as string }));
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-10">
      {saveStatus && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-[100] bg-green-500 text-white px-8 py-4 rounded-[2rem] shadow-2xl flex items-center gap-3 animate-in slide-in-from-top-4">
          <CheckCircle size={20} />
          <span className="font-black text-sm">تم حفظ التغييرات بنجاح</span>
        </div>
      )}

      {/* الرأس: الصورة والاسم */}
      <div className={`p-8 md:p-12 rounded-[3.5rem] border shadow-xl relative overflow-hidden transition-all ${settings.isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-gray-100'}`}>
        <div className="flex flex-col md:flex-row items-center gap-10 relative z-10">
          <div className="relative group">
            <div className="relative">
              {(editData.avatar || currentUser.avatar) ? (
                <img src={editData.avatar || currentUser.avatar} className="w-40 h-40 rounded-[3rem] object-cover shadow-2xl border-4 border-white dark:border-slate-800 transition-all group-hover:scale-[1.02]" alt="Profile" />
              ) : (
                <div className={`w-40 h-40 rounded-[3rem] ${themeColors.primary} text-white flex items-center justify-center text-6xl font-black shadow-2xl`}>{currentUser.username[0].toUpperCase()}</div>
              )}
              {isEditing && (
                <button 
                  onClick={() => avatarInputRef.current?.click()} 
                  className="absolute inset-0 bg-black/50 rounded-[3rem] flex items-center justify-center text-white opacity-100 transition-all bubble-effect backdrop-blur-[2px]"
                >
                  <div className="flex flex-col items-center gap-1">
                    <Camera size={28} />
                    <span className="text-[10px] font-black uppercase tracking-widest">تغيير الصورة</span>
                  </div>
                </button>
              )}
            </div>
            <input type="file" ref={avatarInputRef} className="hidden" accept="image/*" onChange={handleAvatarUpload} />
          </div>

          <div className="text-center md:text-right flex-1 space-y-3">
            {isEditing ? (
              <div className="space-y-1">
                <label className="text-[10px] font-black opacity-40 uppercase tracking-widest mr-2">اسم المستخدم</label>
                <input 
                  className={`text-2xl font-black p-4 rounded-2xl border w-full md:w-auto min-w-[300px] outline-none transition-all ${settings.isDarkMode ? 'bg-slate-800 border-slate-700 text-white focus:border-blue-500' : 'bg-gray-50 border-gray-100 focus:bg-white focus:border-blue-600'}`}
                  value={editData.username || ''}
                  onChange={e => setEditData({...editData, username: e.target.value})}
                />
              </div>
            ) : (
              <>
                <h1 className="text-4xl font-black tracking-tight">{currentUser.username}</h1>
                <div className="flex items-center justify-center md:justify-start gap-2 opacity-50 font-bold text-sm">
                  <Mail size={14} /> <span>{currentUser.email}</span>
                </div>
                {currentUser.bio && (
                  <p className="text-sm opacity-70 font-medium leading-relaxed max-w-lg mx-auto md:mx-0">
                    {currentUser.bio}
                  </p>
                )}
              </>
            )}
          </div>

          <div className="flex gap-3">
             {!isEditing ? (
               <button onClick={startEditing} className={`flex items-center gap-2 px-6 py-4 rounded-2xl border font-bold transition-all bubble-effect ${settings.isDarkMode ? 'bg-slate-800 border-slate-700 text-white hover:bg-slate-700' : 'bg-gray-100 border-gray-100 text-gray-700 hover:bg-gray-200'}`}>
                 <Edit3 size={20} /> <span>تعديل</span>
               </button>
             ) : (
               <div className="flex gap-2">
                  <button onClick={() => setIsEditing(false)} className="px-6 py-4 rounded-2xl bg-red-50 text-red-500 font-bold bubble-effect flex items-center gap-2">
                    <X size={20}/> <span>إلغاء</span>
                  </button>
                  <button onClick={handleSaveProfile} className={`px-6 py-4 rounded-2xl ${themeColors.primary} text-white font-bold shadow-lg bubble-effect flex items-center gap-2`}>
                    <Save size={20}/> <span>حفظ</span>
                  </button>
               </div>
             )}
             <button onClick={() => { if(window.confirm('هل تريد تسجيل الخروج؟')) { setCurrentUser(null); navigate('/login'); } }} className="p-4 rounded-2xl bg-red-50 text-red-500 hover:bg-red-500 hover:text-white transition-all bubble-effect shadow-sm">
               <LogOut size={22} />
             </button>
          </div>
        </div>

        {/* زينة خلفية */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 rounded-full blur-[80px] -mr-32 -mt-32"></div>
      </div>

      {/* التبويبات */}
      <div className={`flex gap-2 p-2 rounded-3xl border transition-all ${settings.isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-gray-100 shadow-sm'}`}>
        <button 
          onClick={() => setActiveTab('INFO')}
          className={`flex-1 py-4 rounded-2xl font-black text-sm flex items-center justify-center gap-3 transition-all bubble-effect ${activeTab === 'INFO' ? `${themeColors.primary} text-white shadow-xl` : 'opacity-40 hover:opacity-100'}`}
        >
          <UserIcon size={18}/> بياناتي الشخصية
        </button>
        <button 
          onClick={() => setActiveTab('HISTORY')}
          className={`flex-1 py-4 rounded-2xl font-black text-sm flex items-center justify-center gap-3 transition-all bubble-effect ${activeTab === 'HISTORY' ? `${themeColors.primary} text-white shadow-xl` : 'opacity-40 hover:opacity-100'}`}
        >
          <History size={18}/> سجل النشاطات
        </button>
      </div>

      {/* المحتوى */}
      <div className="animate-in slide-in-from-bottom-6 duration-500">
        {activeTab === 'INFO' && (
          <div className={`p-10 rounded-[3rem] border transition-all ${settings.isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white shadow-sm border-gray-50'}`}>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                {/* الحقول المعروضة أو المدخلة */}
                <ProfileField 
                  label="البريد الإلكتروني" 
                  value={currentUser.email} 
                  icon={<Mail size={20}/>} 
                  isEditing={isEditing}
                  inputValue={editData.email}
                  onChange={(val) => setEditData({...editData, email: val})}
                  settings={settings}
                />
                
                <ProfileField 
                  label="رقم الهاتف" 
                  value={currentUser.phone || 'غير محدد'} 
                  icon={<Phone size={20}/>} 
                  isEditing={isEditing}
                  inputValue={editData.phone}
                  onChange={(val) => setEditData({...editData, phone: val})}
                  settings={settings}
                  placeholder="+963 9xx xxx xxx"
                />

                <div className="md:col-span-2">
                  <ProfileField 
                    label="نبذة تعريفية (Bio)" 
                    value={currentUser.bio || 'لا يوجد نبذة تعريفية حالياً.'} 
                    icon={<FileText size={20}/>} 
                    isEditing={isEditing}
                    inputValue={editData.bio}
                    onChange={(val) => setEditData({...editData, bio: val})}
                    settings={settings}
                    isTextArea
                    placeholder="اكتب شيئاً عن نفسك..."
                  />
                </div>

                <div className="md:col-span-2 pt-6 border-t border-gray-50 dark:border-slate-800 flex items-center justify-between opacity-40">
                  <span className="text-xs font-bold">عضو منذ: {new Date(currentUser.joinDate).toLocaleDateString('ar-SY')}</span>
                  <span className="text-[10px] font-black uppercase tracking-widest">{currentUser.role}</span>
                </div>
             </div>
          </div>
        )}

        {activeTab === 'HISTORY' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 gap-5">
               {userPosts.map(post => (
                 <button 
                  key={post.id} 
                  onClick={() => navigate(`/store/${post.storeId}`)}
                  className={`p-8 rounded-[2.5rem] border text-right transition-all group bubble-effect ${settings.isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1'}`}
                 >
                   <div className="flex justify-between items-start mb-6">
                     <div className="flex items-center gap-3 text-blue-500 font-black text-xs bg-blue-500/10 px-4 py-2 rounded-xl">
                       <MessageSquare size={16}/> موضوع في منتدى المتجر
                     </div>
                   </div>
                   <p className="text-xl leading-relaxed opacity-80 mb-6 font-bold line-clamp-2">"{post.content}"</p>
                   <div className="flex items-center justify-between border-t border-gray-50 dark:border-slate-800 pt-4">
                     <span className="text-[10px] opacity-30 font-black flex items-center gap-1"><Clock size={12}/> {new Date(post.createdAt).toLocaleDateString('ar-SY')}</span>
                     <span className="text-[10px] font-black opacity-30 uppercase tracking-widest">انقر للمشاهدة</span>
                   </div>
                 </button>
               ))}
               {(userPosts.length === 0) && (
                 <div className="text-center py-32 opacity-30 font-bold flex flex-col items-center gap-6 rounded-[3rem] border-4 border-dashed border-gray-100 dark:border-slate-800">
                    <History size={64}/>
                    <div className="space-y-1">
                      <p className="text-2xl font-black">لا يوجد نشاطات</p>
                      <p className="text-sm">لم تقم بإضافة أي مواضيع أو استفسارات حتى الآن.</p>
                    </div>
                 </div>
               )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

interface ProfileFieldProps {
  label: string;
  value: string;
  icon: React.ReactNode;
  isEditing: boolean;
  inputValue?: string;
  onChange: (val: string) => void;
  settings: AppSettings;
  isTextArea?: boolean;
  placeholder?: string;
}

const ProfileField: React.FC<ProfileFieldProps> = ({ label, value, icon, isEditing, inputValue, onChange, settings, isTextArea, placeholder }) => {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 opacity-40">
        {icon}
        <span className="text-[10px] font-black uppercase tracking-widest">{label}</span>
      </div>
      {isEditing ? (
        isTextArea ? (
          <textarea 
            className={`w-full p-5 rounded-2xl border outline-none font-bold min-h-[120px] transition-all ${settings.isDarkMode ? 'bg-slate-800 border-slate-700 text-white focus:border-blue-500' : 'bg-gray-50 border-gray-100 focus:bg-white focus:border-blue-600'}`}
            value={inputValue || ''}
            onChange={e => onChange(e.target.value)}
            placeholder={placeholder}
          />
        ) : (
          <input 
            className={`w-full p-5 rounded-2xl border outline-none font-bold transition-all ${settings.isDarkMode ? 'bg-slate-800 border-slate-700 text-white focus:border-blue-500' : 'bg-gray-50 border-gray-100 focus:bg-white focus:border-blue-600'}`}
            value={inputValue || ''}
            onChange={e => onChange(e.target.value)}
            placeholder={placeholder}
          />
        )
      ) : (
        <p className={`text-lg font-black break-words leading-relaxed ${value === 'غير محدد' || value.startsWith('لا يوجد') ? 'opacity-20 italic font-medium' : ''}`}>
          {value}
        </p>
      )}
    </div>
  );
}

export default ProfilePage;
