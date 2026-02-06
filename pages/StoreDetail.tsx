
import React, { useState, useRef, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, MapPin, MessageCircle, MessageSquare, Clock, Info, Navigation, Star, PlusCircle, User, Send, Trash2, X, AlertTriangle, ImageIcon, CheckCircle, ChevronRight, Plus } from 'lucide-react';
import { Store, AppSettings, StorePost, User as UserType, Comment, Report, InternalMessage } from '../types';

interface StoreDetailProps {
  stores: Store[];
  setStores: React.Dispatch<React.SetStateAction<Store[]>>;
  posts: StorePost[];
  setPosts: React.Dispatch<React.SetStateAction<Store[]>>; // Note: This type might be StorePost[] in actual usage
  postsData: StorePost[];
  setPostsData: React.Dispatch<React.SetStateAction<StorePost[]>>;
  comments: Comment[];
  setComments: React.Dispatch<React.SetStateAction<Comment[]>>;
  reports: Report[];
  setReports: React.Dispatch<React.SetStateAction<Report[]>>;
  currentUser: UserType | null;
  settings: AppSettings;
  themeColors: any;
  sendMessage: (msg: Omit<InternalMessage, 'id' | 'isRead' | 'createdAt'>) => void;
  addActionLog: (action: string, details: string) => void;
  notify: (title: string, body: string) => void;
}

// Adjusted props to match App.tsx usage
const StoreDetailPage: React.FC<any> = ({ 
  stores, setStores, posts, setPosts, comments, setComments, reports, setReports, 
  currentUser, settings, themeColors, sendMessage, addActionLog, notify 
}) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const store = stores.find(s => s.id === id);
  const [showPostForm, setShowPostForm] = useState(false);
  const [newPostContent, setNewPostContent] = useState('');
  const [newPostImage, setNewPostImage] = useState<string | null>(null);
  const [commentContent, setCommentContent] = useState('');
  const [toast, setToast] = useState<{message: string, type: 'success' | 'info' | 'error'} | null>(null);
  const postImageInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  if (!store) return <div className="p-10 text-center font-bold opacity-40">المتجر غير موجود</div>;

  const storePosts = (posts || []).filter(p => p.storeId === store.id && (p.status === 'APPROVED' || p.authorId === currentUser?.id));

  const handleRateStore = (value: number) => {
    if (!currentUser) {
      setToast({ message: 'يرجى تسجيل الدخول لتقييم المتجر', type: 'error' });
      return;
    }
    const existingRating = store.ratings.find(r => r.userId === currentUser.id);
    let newRatings = [...store.ratings];
    if (existingRating) newRatings = newRatings.map(r => r.userId === currentUser.id ? { ...r, value } : r);
    else newRatings.push({ userId: currentUser.id, value });
    const avg = newRatings.reduce((acc, curr) => acc + curr.value, 0) / newRatings.length;
    setStores(stores.map(s => s.id === store.id ? { ...s, ratings: newRatings, rating: parseFloat(avg.toFixed(1)) } : s));
    setToast({ message: 'تم تحديث تقييمك بنجاح', type: 'success' });
  };

  const handleAddTopicClick = () => {
    if (!currentUser) {
      setToast({ message: 'يجب تسجيل الدخول لإضافة موضوع أو استفسار', type: 'info' });
      // Redirect after a short delay to let them read the toast
      setTimeout(() => navigate('/login'), 1500);
      return;
    }
    setShowPostForm(!showPostForm);
    if (!showPostForm) {
      window.scrollTo({ top: 400, behavior: 'smooth' });
    }
  };

  const handlePostSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;
    
    const post: StorePost = {
      id: Math.random().toString(36).substr(2, 9),
      storeId: store.id,
      authorId: currentUser.id,
      authorName: currentUser.username,
      authorAvatar: currentUser.avatar,
      content: newPostContent,
      imageUrl: newPostImage || undefined,
      status: settings.autoApprovePosts ? 'APPROVED' : 'PENDING',
      ratings: [],
      createdAt: new Date().toISOString()
    };
    
    setPosts([post, ...posts]);
    if (settings.autoApprovePosts) {
      notify("موضوع جديد!", `${currentUser.username} قام بنشر موضوع في متجر ${store.name}`);
    }
    
    setNewPostContent('');
    setNewPostImage(null);
    setShowPostForm(false);
    setToast({ message: settings.autoApprovePosts ? 'تم نشر موضوعك بنجاح' : 'موضوعك قيد المراجعة الآن', type: 'success' });
  };

  const handleAddComment = (postId: string) => {
    if (!currentUser) {
      setToast({ message: 'يرجى تسجيل الدخول للتعليق', type: 'error' });
      return;
    }
    if (!commentContent.trim()) return;
    const newComment: Comment = {
      id: Math.random().toString(36).substr(2, 9),
      postId,
      storeId: store.id,
      authorId: currentUser.id,
      authorName: currentUser.username,
      authorAvatar: currentUser.avatar,
      content: commentContent,
      createdAt: new Date().toISOString(),
    };
    setComments([...comments, newComment]);
    setCommentContent('');
    setToast({ message: 'تم إضافة تعليقك', type: 'success' });
  };

  return (
    <div className="pb-10 animate-in slide-in-from-bottom-4 duration-500 relative">
      {/* Toast Alert */}
      {toast && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-[100] animate-in fade-in slide-in-from-top-10 duration-300">
           <div className={`px-6 py-4 rounded-[2rem] shadow-2xl flex items-center gap-3 border backdrop-blur-md ${
             toast.type === 'error' ? 'bg-red-50 border-red-200 text-red-700' : 
             settings.isDarkMode ? 'bg-slate-900 border-blue-500/30 text-white' : 'bg-white border-blue-100 text-gray-800'}`}>
              <div className={`p-2 rounded-full text-white ${toast.type === 'error' ? 'bg-red-500' : themeColors.primary}`}>
                {toast.type === 'success' ? <CheckCircle size={18} /> : <AlertTriangle size={18} />}
              </div>
              <span className="font-bold text-sm">{toast.message}</span>
           </div>
        </div>
      )}

      {/* Mobile Floating Action Button */}
      <button 
        onClick={handleAddTopicClick}
        className={`md:hidden fixed bottom-24 left-6 z-50 w-14 h-14 rounded-full shadow-2xl flex items-center justify-center text-white transition-all active:scale-90 bubble-effect ${themeColors.primary}`}
      >
        <Plus size={28} />
      </button>

      <div className="flex items-center justify-between mb-8">
        <button onClick={() => navigate(-1)} className={`flex items-center gap-3 px-5 py-2.5 rounded-2xl font-bold transition-all bubble-effect group ${settings.isDarkMode ? 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800' : 'bg-white text-gray-500 hover:text-gray-900 border border-gray-100 shadow-sm'}`}>
          <ChevronRight size={20} className="group-hover:-translate-x-1 transition-transform" />
          <span>العودة</span>
        </button>

        <button 
          onClick={handleAddTopicClick} 
          className={`${themeColors.primary} text-white px-6 py-2.5 rounded-2xl font-bold shadow-lg bubble-effect flex items-center gap-2 group transition-all hover:brightness-110 active:scale-95`}
        >
          {showPostForm ? <X size={18} /> : <PlusCircle size={18} className="group-hover:rotate-90 transition-transform" />}
          <span>{showPostForm ? 'إلغاء' : 'إضافة موضوع'}</span>
        </button>
      </div>

      <div className={`rounded-[2.5rem] overflow-hidden shadow-2xl border transition-all duration-500 ${settings.isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-gray-100'}`}>
        <div className="h-72 relative group">
          <img src={store.images[0]} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt="" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent p-10 flex flex-col justify-end">
            <h1 className="text-4xl font-black text-white mb-3 drop-shadow-xl">{store.name}</h1>
            <div className="flex flex-wrap items-center gap-6 text-white/90">
               <span className="flex items-center gap-2 text-xs bg-white/20 px-4 py-2 rounded-xl backdrop-blur-md font-bold border border-white/10"><MapPin size={16}/> {store.city} - {store.neighborhood}</span>
               <div className="flex gap-1.5 bg-black/30 p-2 rounded-xl backdrop-blur-sm border border-white/5">
                 {[1,2,3,4,5].map(i => (
                   <Star 
                     key={i} 
                     size={20} 
                     onClick={() => handleRateStore(i)} 
                     className={`cursor-pointer transition-all hover:scale-125 ${(store.ratings.find(r => r.userId === currentUser?.id)?.value || store.rating) >= i ? 'text-yellow-400 fill-yellow-400' : 'text-white/20'}`} 
                   />
                 ))}
               </div>
            </div>
          </div>
        </div>

        <div className="p-10 space-y-12">
          <section className="space-y-6">
            <div className="flex items-center gap-4">
              <div className={`p-3 rounded-2xl shadow-sm ${themeColors.primaryLight} ${themeColors.primaryText}`}><Info size={24}/></div>
              <h2 className="text-2xl font-black">نبذة عن المتجر</h2>
            </div>
            <p className="opacity-70 leading-relaxed text-lg font-medium">{store.description}</p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
              <div className={`p-6 rounded-3xl border flex items-center gap-4 transition-colors ${settings.isDarkMode ? 'bg-slate-800/50 border-slate-700' : 'bg-gray-50 border-gray-100'}`}>
                <div className={`p-3 rounded-xl bg-blue-500/10 text-blue-500`}><Clock size={20}/></div>
                <div>
                  <span className="text-[10px] opacity-40 font-black block mb-0.5">ساعات العمل</span>
                  <span className="font-bold text-sm">{store.workingHours}</span>
                </div>
              </div>
              <button 
                onClick={() => window.open(`https://wa.me/${store.whatsapp}`)}
                className="p-6 rounded-3xl bg-green-500 text-white flex items-center gap-4 transition-all hover:brightness-110 active:scale-95 shadow-xl shadow-green-500/20 bubble-effect"
              >
                <div className="p-3 rounded-xl bg-white/20"><MessageCircle size={20}/></div>
                <div className="text-right">
                  <span className="text-[10px] opacity-80 font-black block mb-0.5">تواصل مباشرة</span>
                  <span className="font-bold text-sm">مراسلة واتساب</span>
                </div>
              </button>
            </div>
          </section>

          <section id="discussions" className="space-y-8 pt-12 border-t border-gray-100 dark:border-slate-800">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                 <div className={`p-3 rounded-2xl shadow-sm ${themeColors.primaryLight} ${themeColors.primaryText}`}><MessageSquare size={24}/></div>
                 <h2 className="text-2xl font-black">المناقشات والآراء</h2>
              </div>
              <button 
                onClick={handleAddTopicClick}
                className={`text-sm font-bold flex items-center gap-1 ${themeColors.primaryText} hover:underline`}
              >
                <Plus size={16} /> إضافة استفسار
              </button>
            </div>

            {showPostForm && (
              <form onSubmit={handlePostSubmit} className={`p-8 rounded-[2.5rem] border-2 animate-in zoom-in-95 duration-300 ${settings.isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-100 shadow-2xl'}`}>
                <h3 className="text-lg font-black mb-4">ماذا يدور في ذهنك؟</h3>
                <textarea 
                  className={`w-full p-5 rounded-2xl outline-none focus:ring-4 min-h-[140px] text-lg font-medium transition-all ${settings.isDarkMode ? 'bg-slate-900 border-slate-700 text-white focus:ring-blue-500/10' : 'bg-gray-50 border-gray-200 focus:bg-white focus:ring-blue-500/5'}`} 
                  placeholder="اكتب استفسارك، تجربتك مع المتجر، أو حتى صوراً لمواد البناء..." 
                  value={newPostContent} 
                  onChange={e => setNewPostContent(e.target.value)} 
                  required 
                />
                <div className="flex gap-4 mt-6">
                  <button type="submit" className={`flex-1 ${themeColors.primary} text-white font-black py-4 rounded-2xl shadow-xl transition-all hover:brightness-110 active:scale-95 bubble-effect flex items-center justify-center gap-2`}>
                    <Send size={20} /> تأكيد النشر
                  </button>
                  <button type="button" onClick={() => setShowPostForm(false)} className={`px-8 py-4 rounded-2xl font-bold ${settings.isDarkMode ? 'bg-slate-700' : 'bg-gray-100'}`}>تجاهل</button>
                </div>
              </form>
            )}

            <div className="space-y-8">
              {storePosts.length > 0 ? storePosts.map(post => (
                <div key={post.id} className={`p-8 rounded-[2.5rem] border transition-all duration-300 hover:translate-y-[-4px] ${settings.isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white shadow-sm border-gray-100 hover:shadow-xl'}`}>
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-2xl ${themeColors.primary} text-white flex items-center justify-center font-black text-xl shadow-lg`}>{post.authorName[0]}</div>
                      <div>
                        <span className="font-black text-sm block">{post.authorName}</span>
                        <span className="text-[10px] opacity-40 font-bold">{new Date(post.createdAt).toLocaleDateString('ar-SY')}</span>
                      </div>
                    </div>
                    {currentUser?.id === post.authorId && (
                      <button onClick={() => setPosts(posts.filter(p => p.id !== post.id))} className="p-2 text-red-400 hover:bg-red-50 rounded-xl transition-all"><Trash2 size={18}/></button>
                    )}
                  </div>
                  <p className="text-lg opacity-80 leading-relaxed mb-6 font-medium">{post.content}</p>
                  
                  <div className="space-y-4 pt-6 border-t border-gray-50 dark:border-slate-800">
                    {comments.filter(c => c.postId === post.id).map(comment => (
                      <div key={comment.id} className={`p-4 rounded-2xl text-sm ${settings.isDarkMode ? 'bg-slate-800/50' : 'bg-gray-50'}`}>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-bold text-xs">{comment.authorName}</span>
                          <span className="text-[10px] opacity-30">{new Date(comment.createdAt).toLocaleTimeString('ar-SY')}</span>
                        </div>
                        <p className="opacity-80">{comment.content}</p>
                      </div>
                    ))}
                    
                    <div className="relative pt-2">
                      <input 
                        className={`w-full p-4 rounded-2xl text-sm border outline-none transition-all ${settings.isDarkMode ? 'bg-slate-950 border-slate-700' : 'bg-white border-gray-200 focus:border-blue-400 focus:ring-4 focus:ring-blue-500/5'}`} 
                        placeholder="اكتب رداً..." 
                        value={commentContent} 
                        onChange={e => setCommentContent(e.target.value)} 
                        onKeyPress={e => e.key === 'Enter' && handleAddComment(post.id)} 
                      />
                      <button onClick={() => handleAddComment(post.id)} className={`absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-xl transition-all ${themeColors.primaryText} hover:bg-blue-50`}><Send size={20}/></button>
                    </div>
                  </div>
                </div>
              )) : (
                <div className="text-center py-24 rounded-[3rem] border-2 border-dashed border-gray-100 dark:border-slate-800 opacity-30 font-bold flex flex-col items-center gap-4">
                  <MessageCircle size={48} />
                  <p className="text-xl">كن أول من يشارك رأيه هنا!</p>
                  <button 
                    onClick={handleAddTopicClick}
                    className={`mt-4 px-6 py-2 rounded-xl border-2 font-black ${themeColors.primaryText} border-current hover:bg-blue-50 transition-colors`}
                  >
                    إضافة أول موضوع
                  </button>
                </div>
              )}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default StoreDetailPage;
