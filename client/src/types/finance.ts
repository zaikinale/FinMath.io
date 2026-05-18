export interface User {
    id: string;
    email: string;
    aiApiKey?: string;
  }
  
  export interface Category {
    id: string;
    name: string;
    type: 'expense' | 'income';
    icon?: string;
    color?: string;
  }
  
  export interface CategoriesState {
    expense: Category[];
    income: Category[];
  }
  
  export interface Transaction {
    id: string;
    amount: number | string;
    type: 'expense' | 'income';
    desc?: string;
    date: string;
    userId: string;
    categoryId: string;
    category?: Category;
    createdAt?: string;
  }
  
  export interface Note {
    id: string;
    title: string;
    content?: string;
    userId: string;
    createdAt: string;
    updatedAt: string;
  }
  
  export interface AiReport {
    id: string;
    periodType: 'week' | 'month' | 'year' | 'custom';
    dateRange: string;
    insight: string;
    userId: string;
    createdAt: string;
  }
  
  export interface CustomDateRange {
    start: string;
    end: string;
  }
  
  export type ReportPeriod = 'week' | 'month' | 'year' | CustomDateRange;
  
  // Конфиг дизайн-системы темы приложения
  export interface ThemeColors {
    bg: string;
    card: string;
    text: string;
    muted: string;
    border: string;
    accent: string;
    purple: string;
    accentText: string;
  }
  
  export interface ThemeStyles {
    isDark: boolean;
    btn: React.CSSProperties;
    card: React.CSSProperties;
  }