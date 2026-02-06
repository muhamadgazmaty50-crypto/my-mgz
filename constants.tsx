
import React from 'react';
import { 
  Province,
  Store
} from './types';

export const PROVINCES = Object.values(Province);

// Fix: Added missing 'ratings' property to MOCK_STORES elements to match the Store interface.
export const MOCK_STORES: Store[] = [
  {
    id: '1',
    name: 'الشركة السورية للحديد والصلب',
    description: 'أفضل أنواع الحديد للبناء المسلح بجميع القياسات والمواصفات العالمية.',
    categoryId: '2',
    city: Province.DAMASCUS,
    neighborhood: 'الحريقة',
    images: ['https://picsum.photos/seed/iron/800/600'],
    whatsapp: '963912345678',
    location: { lat: 33.5138, lng: 36.2965 },
    workingHours: '8:00 AM - 6:00 PM',
    rating: 4.8,
    ratings: [],
    createdAt: new Date().toISOString()
  },
  {
    id: '2',
    name: 'عالم الدهانات الحديثة',
    description: 'وكلاء حصريون لأرقى أنواع الدهانات والطلاءات الإنشائية والديكورية.',
    categoryId: '3',
    city: Province.ALEPPO,
    neighborhood: 'الجميلية',
    images: ['https://picsum.photos/seed/paint/800/600'],
    whatsapp: '963922334455',
    location: { lat: 36.2021, lng: 37.1343 },
    workingHours: '9:00 AM - 8:00 PM',
    rating: 4.5,
    ratings: [],
    createdAt: new Date().toISOString()
  }
];
