import React, { useState } from 'react';
import { FaRobot, FaTimes, FaMagic, FaCalendarAlt, FaChevronRight } from 'react-icons/fa';

type ReportType = 'week' | 'month' | 'year' | 'custom';

export const AiReportModal = ({ isOpen, onClose, onGenerate, loading, report, s, c }) => {
  const [selectedType, setSelectedType] = useState<ReportType>('month');
  const [customRange, setCustomRange] = useState({ start: '', end: '' });

  if (!isOpen) return null;

  const presets = [
    { id: 'week', label: 'Неделя' },
    { id: 'month', label: 'Месяц' },
    { id: 'year', label: 'Год' },
    { id: 'custom', label: 'Период' },
  ];

  const handleGenerate = () => {
    const period = selectedType === 'custom' ? customRange : selectedType;
    onGenerate(period);
  };

  const optionStyle = (isActive: boolean): React.CSSProperties => ({
    flex: 1,
    padding: '0.6rem 0.2rem',
    borderRadius: '8px',
    fontSize: '0.8rem',
    fontWeight: 600,
    cursor: 'pointer',
    textAlign: 'center',
    transition: 'all 0.2s',
    background: isActive ? c.purple : 'transparent',
    color: isActive ? '#fff' : c.muted,
    border: `1px solid ${isActive ? c.purple : c.border}`,
  });

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2000, padding: '1rem' }}>
      <div style={{ ...s.card, width: '100%', maxWidth: '420px', padding: '1.5rem', border: `1px solid ${c.border}` }}>
        
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <div style={{ background: c.purple + '22', padding: '0.5rem', borderRadius: '10px' }}>
              <FaRobot color={c.purple} size={18} />
            </div>
            <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 700 }}>ИИ Аналитика</h3>
          </div>
          <FaTimes onClick={onClose} style={{ cursor: 'pointer', color: c.muted }} />
        </div>

        {!report ? (
          <div>
            <p style={{ color: c.muted, fontSize: '0.85rem', marginBottom: '1.2rem' }}>
              Выберите временной отрезок для формирования умного отчета.
            </p>

            {/* Selector */}
            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.2rem', background: '#1a1a1a', padding: '4px', borderRadius: '12px' }}>
              {presets.map((p) => (
                <div 
                  key={p.id} 
                  onClick={() => setSelectedType(p.id as ReportType)}
                  style={optionStyle(selectedType === p.id)}
                >
                  {p.label}
                </div>
              ))}
            </div>

            {/* Custom Range Inputs */}
            {selectedType === 'custom' && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.2rem', animation: 'fadeIn 0.2s ease' }}>
                <input 
                  type="date" 
                  value={customRange.start}
                  onChange={(e) => setCustomRange({ ...customRange, start: e.target.value })}
                  style={{ ...s.input, flex: 1, padding: '0.5rem', fontSize: '0.8rem' }} 
                />
                <div style={{ color: c.muted }}><FaChevronRight size={10} /></div>
                <input 
                  type="date" 
                  value={customRange.end}
                  onChange={(e) => setCustomRange({ ...customRange, end: e.target.value })}
                  style={{ ...s.input, flex: 1, padding: '0.5rem', fontSize: '0.8rem' }} 
                />
              </div>
            )}

            <button 
              onClick={handleGenerate} 
              disabled={loading || (selectedType === 'custom' && (!customRange.start || !customRange.end))} 
              style={{ ...s.btn, background: c.purple, color: 'white', width: '100%', justifyContent: 'center', height: '45px', fontWeight: 600 }}
            >
              {loading ? (
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                   Просчитываю...
                </span>
              ) : 'Сгенерировать анализ'}
            </button>
          </div>
        ) : (
          <div style={{ animation: 'slideUp 0.3s ease' }}>
            <div style={{ background: c.purple + '08', padding: '1.2rem', borderRadius: '14px', border: `1px solid ${c.purple}22` }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: c.purple, fontWeight: 800, fontSize: '0.75rem', marginBottom: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                <FaMagic /> Результат анализа
              </div>
              <p style={{ margin: 0, fontSize: '0.95rem', lineHeight: 1.6, color: c.text }}>{report.insight}</p>
            </div>
            
            <button 
              onClick={onClose} 
              style={{ ...s.btn, background: c.accent, color: c.accentText, width: '100%', marginTop: '1.5rem', justifyContent: 'center' }}
            >
              Закрыть
            </button>
          </div>
        )}

        <div style={{ marginTop: '1.2rem', textAlign: 'center' }}>
          <p style={{ fontSize: '0.7rem', color: c.muted, margin: 0 }}>
            ИИ учитывает категории, лимиты и динамику трат.
          </p>
        </div>
      </div>
    </div>
  );
};