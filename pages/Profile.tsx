
import React, { useState, useRef } from 'react';
import { User, StorePost, Comment, AppSettings } from '../types';
import { Camera, Edit3, MessageSquare, History, User as UserIcon, LogOut, Save, X, Clock, ArrowLeft, ExternalLink } from 'lucide-react';
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
  const avatarInputRef = useRef<HTMLInputElement>(null);

  if (!currentUser) return <div className="text-center py-20 font-bold">يرجى تسجيل الدخول لعرض الملف الشخصي</div>;

  const userPosts = posts.filter(p => p.authorId === currentUser.id);
  const userComments = comments.filter(c => c.authorId === currentUser.id);

  const startEditing = () => {
    setEditData({
      username: currentUser.username,
      email: currentUser.email,
      phone: currentUser.phone,
      bio: currentUser.bio,
      avatar: currentUser.avatar
    });
    setIsEditing(true);
  };

  const handleSaveProfile = () => {
    setCurrentUser({ ...currentUser, ...editData } as User);
    setIsEditing(false);
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
      <div className={`p-8 rounded-[3rem] border shadow-xl relative overflow-hidden transition-all ${settings.isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-gray-100'}`}>
        <div className="flex flex-col md:flex-row items-center gap-8 relative z-10">
          <div className="relative group">
            {(editData.avatar || currentUser.avatar) ? (
              <img src={editData.avatar || currentUser.avatar} className="w-32 h-32 rounded-[2.5rem] object-cover shadow-2xl border-4 border-white dark:border-slate-800 transition-all group-hover:brightness-90" />
            ) : (
              <div className={`w-32 h-32 rounded-[2.5rem] ${themeColors.primary} text-white flex items-center justify-center text-5xl font-bold shadow-2xl`}>{currentUser.username[0].toUpperCase()}</div>
            )}
            {isEditing && (
              <button onClick={() => avatarInputRef.current?.click()} className="absolute inset-0 bg-black/40 rounded-[2.5rem] flex items-center justify-center text-white opacity-100 transition-all bubble-effect">
                <Camera size={24} />
              </button>
            )}
            <input type="file" ref={avatarInputRef} className="hidden" accept="image/*" onChange={handleAvatarUpload} />
          </div>

          <div className="text-center md:text-right flex-1">
            {isEditing ? (
              <input 
                className={`text-xl font-black p-3 rounded-2xl border w-full md:w-auto outline-none transition-all ${settings.isDarkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-gray-50 border-gray-100'}`}
                value={editData.username || ''}
                onChange={e => setEditData({...editData, username: e.target.value})}
                placeholder="اسم المستخدم"
              />
            ) : (
              <>
                <h1 className="text-3xl font-black mb-2">{currentUser.username}</h1>
                <p className="opacity-50 text-sm mb-4 font-bold">{currentUser.email}</p>
              </>
            )}
          </div>

          <div className="flex gap-2">
             {!isEditing ? (
               <button onClick={startEditing} className={`p-4 rounded-2xl border transition-all bubble-effect ${settings.isDarkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-gray-50 border-gray-100'}`}><Edit3 size={20} /></button>
             ) : (
               <div className="flex gap-2">
                  <button onClick={() => setIsEditing(false)} className="p-4 rounded-2xl bg-red-50 text-red-500 bubble-effect"><X size={20}/></button>
                  <button onClick={handleSaveProfile} className={`p-4 rounded-2xl ${themeColors.primary} text-white shadow-lg bubble-effect`}><Save size={20}/></button>
               </div>
             )}
             <button onClick={() => { setCurrentUser(null); navigate('/login'); }} className="p-4 rounded-2xl bg-red-50 text-red-500 hover:bg-red-500 hover:text-white transition-all bubble-effect"><LogOut size={20} /></button>
          </div>
        </div>
      </div>

      <div className={`flex gap-2 p-2 rounded-3xl border transition-all ${settings.isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-gray-100 shadow-sm'}`}>
        <button 
          onClick={() => setActiveTab('INFO')}
          className={`flex-1 py-4 rounded-2xl font-black text-sm flex items-center justify-center gap-2 transition-all bubble-effect ${activeTab === 'INFO' ? `${themeColors.primary} text-white shadow-xl` : 'opacity-40 hover:opacity-100'}`}
        >
          <UserIcon size={18}/> بياناتي
        </button>
        <button 
          onClick={() => setActiveTab('HISTORY')}
          className={`flex-1 py-4 rounded-2xl font-black text-sm flex items-center justify-center gap-2 transition-all bubble-effect ${activeTab === 'HISTORY' ? `${themeColors.primary} text-white shadow-xl` : 'opacity-40 hover:opacity-100'}`}
        >
          <History size={18}/> نشاطاتي
        </button>
      </div>

      <div className="animate-in slide-in-from-bottom-6 duration-500">
        {activeTab === 'INFO' && (
          <div className={`p-8 rounded-[2.5rem] border transition-all ${settings.isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white shadow-sm border-gray-50'}`}>
             <div className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="text-xs font-black opacity-30 uppercase tracking-widest">الاسم بالكامل</label>
                    <p className="text-xl font-black">{currentUser.username}</p>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black opacity-30 uppercase tracking-widest">البريد الإلكتروني</label>
                    <p className="text-xl font-black">{currentUser.email}</p>
                  </div>
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
                  className={`p-6 rounded-[2rem] border text-right transition-all group bubble-effect ${settings.isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-gray-100 shadow-sm'}`}
                 >
                   <div className="flex justify-between items-start mb-4">
                     <div className="flex items-center gap-2 text-blue-500 font-black text-[11px]">
                       <MessageSquare size={16}/> موضوع جديد
                     </div>
                   </div>
                   <p className="text-base leading-relaxed opacity-80 mb-4 font-medium line-clamp-2">"{post.content}"</p>
                   <span className="text-[10px] opacity-30 font-bold flex items-center gap-1"><Clock size={12}/> {new Date(post.createdAt).toLocaleDateString('ar-SY')}</span>
                 </button>
               ))}
               {(userPosts.length === 0 && userComments.length === 0) && (
                 <div className="text-center py-24 opacity-30 font-bold flex flex-col items-center gap-6">
                    <History size={40}/>
                    <p className="text-lg">لم تقم بأي تفاعلات حتى الآن.</p>
                 </div>
               )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
