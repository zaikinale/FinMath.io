import React, { useState } from 'react';
import { FaTimes, FaCalendarAlt } from 'react-icons/fa';
import { type ThemeColors, type ThemeStyles, type ReportPeriod } from './dashboard.types';

interface ReportPeriodModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (period: ReportPeriod) => void;
  c: ThemeColors;
  s: ThemeStyles;
}

export const ReportPeriodModal: React.FC<ReportPeriodModalProps> = ({ isOpen, onClose, onSelect, c, s }) => {
  const [customRange, setCustomRange] = useState({ start: '', end: '' });
  if (!isOpen) return null;

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2000, padding: '1rem' }}>
      <div style={{ ...s.card, width: '100%', maxWidth: '350px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h3 style={{ margin: 0 }}>Выбор периода</h3>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: c.muted, cursor: 'pointer' }}><FaTimes /></button>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {(['week', 'month', 'year'] as const).map(p => (
            <button key={p} onClick={() => onSelect(p)} style={{ ...s.btn, background: 'rgba(255,255,255,0.05)', color: c.text, border: `1px solid ${c.border}`, justifyContent: 'flex-start' }}>
              <FaCalendarAlt size={12} color={c.purple} /> {p === 'week' ? 'Неделя' : p === 'month' ? 'Месяц' : 'Год'}
            </button>
          ))}
          <div style={{ marginTop: '0.5rem', paddingTop: '1rem', borderTop: `1px solid ${c.border}` }}>
            <p style={{ fontSize: '0.75rem', color: c.muted, marginBottom: '0.75rem' }}>Кастомный период</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <input type="date" onChange={(e) => setCustomRange({...customRange, start: e.target.value})} style={{ ...s.btn, background: 'rgba(0,0,0,0.2)', color: c.text, border: `1px solid ${c.border}` } as React.CSSProperties} />
              <input type="date" onChange={(e) => setCustomRange({...customRange, end: e.target.value})} style={{ ...s.btn, background: 'rgba(0,0,0,0.2)', color: c.text, border: `1px solid ${c.border}` } as React.CSSProperties} />
              <button disabled={!customRange.start || !customRange.end} onClick={() => onSelect(customRange)} style={{ ...s.btn, background: c.purple, color: '#fff', marginTop: '0.5rem' }}>Показать отчет</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};