import React from 'react';
import { FaRobot, FaTimes, FaMagic } from 'react-icons/fa';

export const AiReportModal = ({ isOpen, onClose, onGenerate, loading, report, s, c }) => {
  if (!isOpen) return null;

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2000 }}>
      <div style={{ ...s.card, width: '100%', maxWidth: '400px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
          <h3 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}><FaRobot color={c.purple}/> ИИ Аналитик</h3>
          <FaTimes onClick={onClose} style={{ cursor: 'pointer' }} />
        </div>

        {!report ? (
          <div style={{ textAlign: 'center', padding: '1rem' }}>
            <p style={{ color: c.muted, fontSize: '0.9rem' }}>ИИ проанализирует ваши траты за текущий месяц и предложит варианты оптимизации.</p>
            <button onClick={onGenerate} disabled={loading} style={{ ...s.btn, background: c.purple, color: 'white', width: '100%', justifyContent: 'center', marginTop: '1rem' }}>
              {loading ? 'Анализирую...' : 'Запустить анализ'}
            </button>
          </div>
        ) : (
          <div style={{ animation: 'fadeIn 0.3s ease' }}>
            <div style={{ background: c.purple + '11', padding: '1rem', borderRadius: '10px', border: `1px solid ${c.purple}33` }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: c.purple, fontWeight: 700, fontSize: '0.8rem', marginBottom: '0.5rem' }}><FaMagic /> ИНСАЙТ</div>
              <p style={{ margin: 0, fontSize: '0.9rem', lineHeight: 1.4 }}>{report.insight}</p>
            </div>
            <button onClick={onClose} style={{ ...s.btn, background: c.accent, color: c.accentText, width: '100%', marginTop: '1.5rem', justifyContent: 'center' }}>Понятно</button>
          </div>
        )}
      </div>
    </div>
  );
};