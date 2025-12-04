export enum ViewState {
  HOME = 'HOME',
  SEARCH = 'SEARCH',
  ABOUT = 'ABOUT',
  STACK = 'STACK',
  PROJECTS = 'PROJECTS',
  CERTIFICATES = 'CERTIFICATES',
  CV = 'CV',
  CONTACT = 'CONTACT'
}

export interface Project {
  id: number;
  title: string;
  description: string;
  role?: string;
  tags: string[];
  image: string;
  link?: string;
}

export interface SkillCategory {
  name: string;
  skills: string[];
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
}

export interface UserProfile {
  name: string;
  role: string;
  school: string;
  leadership: string;
  achievements: string[];
}