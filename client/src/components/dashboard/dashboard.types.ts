import React from 'react';

export interface Transaction {
  id: string;
  amount: number | string;
  type: 'expense' | 'income';
  desc?: string;
  date: string;
  categoryId: string;
}

export interface Note {
  id: string;
  title: string;
  content?: string;
}

export interface AiReport {
  id: string;
  periodType: 'week' | 'month' | 'year' | 'custom';
  dateRange: string;
  insight: string;
}

export interface CustomDateRange {
  start: string;
  end: string;
}

export type ReportPeriod = 'week' | 'month' | 'year' | CustomDateRange;

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