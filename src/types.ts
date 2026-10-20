export type UserRole = 'user' | 'admin';

export type AspectRatio = '2/3' | '1/1' | '3/4' | '16/9' | '9/16';

export type SchoolClass =
  | 'Pry 4'
  | 'Pry 5'
  | 'Pry 6'
  | 'JSS 1'
  | 'JSS 2'
  | 'JSS 3'
  | 'SSS 1'
  | 'SSS 2'
  | 'SSS 3';

export const SCHOOL_CLASSES: SchoolClass[] = [
  'Pry 4',
  'Pry 5',
  'Pry 6',
  'JSS 1',
  'JSS 2',
  'JSS 3',
  'SSS 1',
  'SSS 2',
  'SSS 3',
];

export interface DominantColor {
  name: string;
  hex: string;
}

export interface PinComment {
  id: string;
  userName: string;
  userAvatar: string;
  userRole?: string;
  text: string;
  timestamp: string;
}

export interface AIVisionAnalysis {
  aestheticVibe: string;
  suggestedTags: string[];
  dominantColors: DominantColor[];
  recognizedSubjects: string[];
  category: string;
  confidenceScore?: number;
}

export interface Pin {
  id: string;
  _id?: string;
  title: string;
  description: string;
  imageUrl: string;
  cloudinaryPublicId?: string;
  aspectRatio: AspectRatio;
  category: string;
  tags: string[];
  dominantColor: DominantColor;
  author: {
    name: string;
    handle: string;
    avatar: string;
    role: 'admin' | 'curator' | 'user';
  };
  curatedByAdmin: boolean;
  savedCount: number;
  likesCount: number;
  likedByUser: boolean;
  isFavourite?: boolean;
  createdAt: string;
  sourceUrl?: string;
  comments: PinComment[];
  aiAnalysis?: AIVisionAnalysis;
  featured?: boolean;
}

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'user';
  avatar: string;
  token: string;
}

export type ViewTab = 'explore' | 'favourites';

export interface Board {
  id: string;
  title: string;
  description?: string;
  coverImage?: string;
  pinIds?: string[];
  [key: string]: any;
}

export interface ActivityNotification {
  id: string;
  type?: string;
  title: string;
  message: string;
  [key: string]: any;
}
