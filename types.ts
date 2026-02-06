
export interface Category {
  id: string;
  name: string;
  iconName: string;
  image?: string;
  color: string;
}

export enum Province {
  DAMASCUS = 'دمشق',
  DAMASCUS_COUNTRYSIDE = 'ريف دمشق',
  ALEPPO = 'حلب',
  HOMS = 'حمص',
  HAMA = 'حماة',
  LATAKIA = 'اللاذقية',
  TARTUS = 'طروطوس',
  IDLIB = 'إدلب',
  RAQQA = 'الرقة',
  DEIR_EZ_ZOR = 'دير الزور',
  HASAKAH = 'الحسكة',
  DARAA = 'درعا',
  SUWAYDA = 'السويداء',
  QUNEITRA = 'القنيطرة'
}

export enum UserStatus {
  PENDING = 'قيد الانتظار',
  APPROVED = 'مقبول',
  REJECTED = 'مرفوض'
}

export enum UserRole {
  ADMIN = 'ADMIN',
  SUPER_ADMIN = 'SUPER_ADMIN',
  MEMBER = 'MEMBER'
}

export interface UserPermissions {
  canManageCategories: boolean;
  canManageStores: boolean;
  canBanUsers: boolean;
  canManageReports: boolean;
  canDeletePosts: boolean;
  canDeleteComments: boolean;
  canEditSettings: boolean;
}

export interface User {
  id: string;
  email: string;
  username: string;
  password?: string;
  role: UserRole;
  status: UserStatus;
  joinDate: string;
  avatar?: string;
  bio?: string;
  phone?: string;
  permissions: UserPermissions;
}

export enum Currency {
  SYP = 'ليرة سورية',
  USD = 'دولار'
}

export enum AppTheme {
  MODERN_BLUE = 'MODERN_BLUE',
  ROYAL_GOLD = 'ROYAL_GOLD',
  EMERALD_CITY = 'EMERALD_CITY',
  NEON_CYBER = 'NEON_CYBER',
  ROSE_GARDEN = 'ROSE_GARDEN',
  OCEAN_BREEZE = 'OCEAN_BREEZE',
  LAVA_FLOW = 'LAVA_FLOW',
  SPACE_NEBULA = 'SPACE_NEBULA',
  AUTUMN_LEAVES = 'AUTUMN_LEAVES'
}

export interface Coordinates {
  lat: number;
  lng: number;
}

export interface Rating {
  userId: string;
  value: number;
}

export interface Store {
  id: string;
  name: string;
  description: string;
  categoryId: string; 
  city: Province;
  neighborhood: string;
  images: string[];
  whatsapp: string;
  location: Coordinates;
  workingHours: string;
  rating: number; 
  ratings: Rating[]; 
  createdAt: string;
}

export interface Comment {
  id: string;
  postId?: string;
  storeId?: string;
  authorId: string;
  authorName: string;
  authorAvatar?: string;
  content: string;
  createdAt: string;
  parentId?: string; // For replies
}

export interface StorePost {
  id: string;
  storeId: string;
  authorId: string;
  authorName: string;
  authorAvatar?: string;
  content: string;
  imageUrl?: string;
  status: 'PENDING' | 'APPROVED';
  ratings: Rating[];
  createdAt: string;
}

export interface Report {
  id: string;
  reporterId: string;
  targetId: string; // postId or commentId
  targetType: 'POST' | 'COMMENT';
  reason: string;
  status: 'PENDING' | 'RESOLVED';
  createdAt: string;
}

export interface ActionLog {
  id: string;
  adminId: string;
  adminName: string;
  action: string;
  details: string;
  timestamp: string;
}

export interface InternalMessage {
  id: string;
  senderId: string;
  senderName: string;
  receiverId: string;
  subject: string;
  content: string;
  isRead: boolean;
  createdAt: string;
}

export interface AppSettings {
  appName: string;
  currency: Currency;
  exchangeRate: number;
  appLogo: string;
  ownerWhatsapp: string;
  adminEmail: string; 
  adminPhone: string; 
  heroTitle: string;
  heroSubtitle: string;
  notificationsEnabled: boolean;
  isDarkMode: boolean;
  autoApprovePosts: boolean;
  theme: AppTheme;
}
