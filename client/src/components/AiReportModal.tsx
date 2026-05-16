import React, { useState, useEffect } from 'react';
import { FaRobot, FaTimes, FaChevronRight, FaMagic, FaBookmark, FaCheck } from 'react-icons/fa';
import ReactMarkdown from 'react-markdown';

type ReportType = 'week' | 'month' | 'year' | 'custom';

interface AiReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onGenerate: (period: any) => void;
  onSaveReport?: (reportText: string) => Promise<boolean>;
  loading: boolean;
  report: any;
  s: any;
  c: any;
}

export const AiReportModal = ({ 
  isOpen, 
  onClose, 
  onGenerate, 
  onSaveReport, 
  loading, 
  report, 
  s, 
  c 
}: AiReportModalProps) => {
  const [selectedType, setSelectedType] = useState<ReportType>('month');
  const [customRange, setCustomRange] = useState({ start: '', end: '' });
  
  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  // Исправленный сброс состояния: сбрасываем "сохранено", если отчет пропал (вернулись на экран параметров)
  useEffect(() => {
    if (isOpen && !report) {
      setIsSaved(false);
      setIsSaving(false);
    }
  }, [isOpen, report]);

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

  // Твой бэкенд возвращает { report: "текст" }, поэтому проверяем оба варианта
  const reportText = report?.report || report?.insight || (typeof report === 'string' ? report : '');

  const handleSave = async () => {
    if (!onSaveReport || !reportText || isSaved) return;
    
    setIsSaving(true);
    try {
      const success = await onSaveReport(reportText);
      if (success) {
        setIsSaved(true);
      }
    } catch (error) {
      console.error("Не удалось сохранить отчет:", error);
    } finally {
      setIsSaving(false);
    }
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
    border: `1px solid ${isActive ? c.purple : 'transparent'}`,
  });

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2000, padding: '1rem' }}>
      <div style={{ 
        ...s.card, 
        width: '100%', 
        maxWidth: report ? '520px' : '420px', 
        padding: '1.5rem', 
        border: `1px solid ${c.border}`,
        maxHeight: '90vh', 
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '0 20px 40px rgba(0,0,0,0.5)'
      }}>
        
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.2rem', flexShrink: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <div style={{ background: c.purple + '22', padding: '0.5rem', borderRadius: '10px', display: 'flex' }}>
              <FaRobot color={c.purple} size={18} />
            </div>
            <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 700 }}>ИИ Аналитика</h3>
          </div>
          <FaTimes onClick={onClose} style={{ cursor: 'pointer', color: c.muted, transition: 'color 0.2s' }} />
        </div>

        {!report ? (
          /* Форма параметров */
          <div style={{ flexShrink: 0 }}>
            <p style={{ color: c.muted, fontSize: '0.85rem', marginBottom: '1.2rem' }}>
              Выберите временной отрезок для формирования умного отчета.
            </p>

            <div style={{ display: 'flex', gap: '0.4rem', marginBottom: '1.2rem', background: '#1a1a1a', padding: '4px', borderRadius: '12px', border: `1px solid ${c.border}` }}>
              {presets.map((p) => (
                <div key={p.id} onClick={() => setSelectedType(p.id as ReportType)} style={optionStyle(selectedType === p.id)}>
                  {p.label}
                </div>
              ))}
            </div>

            {selectedType === 'custom' && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.2rem' }}>
                <input 
                  type="date" 
                  value={customRange.start}
                  onChange={(e) => setCustomRange({ ...customRange, start: e.target.value })}
                  style={{ ...s.input, flex: 1, padding: '0.5rem', fontSize: '0.8rem', minHeight: '38px' }} 
                />
                <div style={{ color: c.muted }}><FaChevronRight size={10} /></div>
                <input 
                  type="date" 
                  value={customRange.end}
                  onChange={(e) => setCustomRange({ ...customRange, end: e.target.value })}
                  style={{ ...s.input, flex: 1, padding: '0.5rem', fontSize: '0.8rem', minHeight: '38px' }} 
                />
              </div>
            )}

            <button 
              onClick={handleGenerate} 
              disabled={loading || (selectedType === 'custom' && (!customRange.start || !customRange.end))} 
              style={{ ...s.btn, background: c.purple, color: 'white', width: '100%', justifyContent: 'center', height: '45px', fontWeight: 600, opacity: loading ? 0.7 : 1 }}
            >
              {loading ? 'Просчитываю тренды...' : 'Сгенерировать анализ'}
            </button>
          </div>
        ) : (
          /* ОТОБРАЖЕНИЕ ОТЧЕТА СО СКРОЛЛОМ И СОХРАНЕНИЕМ */
          <div style={{ display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: c.purple, fontWeight: 800, fontSize: '0.75rem', marginBottom: '0.6rem', textTransform: 'uppercase', letterSpacing: '0.05em', flexShrink: 0 }}>
              <FaMagic /> Результат анализа
            </div>
            
            {/* Контейнер отчета со скроллбаром */}
            <div 
              style={{ 
                flex: 1,
                overflowY: 'auto', 
                background: 'rgba(255, 255, 255, 0.02)', 
                padding: '1rem', 
                borderRadius: '12px', 
                border: `1px solid ${c.border}`,
                fontSize: '0.85rem', 
                lineHeight: 1.6, 
                color: c.text,
              }}
            >
              {/* Добавлена стилизация для h4 и убран node для избежания конфликтов типов */}
              <ReactMarkdown components={{
                h3: ({...props}) => <h3 style={{ color: c.purple, fontSize: '1rem', fontWeight: 700, margin: '1.2rem 0 0.5rem 0', borderBottom: `1px solid ${c.border}44`, paddingBottom: '0.3rem' }} {...props} />,
                h4: ({...props}) => <h4 style={{ color: c.purple, fontSize: '0.95rem', fontWeight: 700, margin: '1.2rem 0 0.5rem 0', borderBottom: `1px solid ${c.border}44`, paddingBottom: '0.3rem' }} {...props} />,
                ul: ({...props}) => <ul style={{ paddingLeft: '1.2rem', margin: '0.5rem 0' }} {...props} />,
                li: ({...props}) => <li style={{ marginBottom: '0.4rem', color: '#e0e0e0' }} {...props} />,
                strong: ({...props}) => <strong style={{ color: '#fff', fontWeight: 600 }} {...props} />,
                table: ({...props}) => <table style={{ width: '100%', borderCollapse: 'collapse', margin: '0.8rem 0' }} {...props} />,
                th: ({...props}) => <th style={{ background: 'rgba(255,255,255,0.04)', padding: '0.4rem', border: `1px solid ${c.border}`, textAlign: 'left', fontSize: '0.8rem' }} {...props} />,
                td: ({...props}) => <td style={{ padding: '0.4rem', border: `1px solid ${c.border}`, fontSize: '0.8rem' }} {...props} />
              }}>
                {reportText}
              </ReactMarkdown>
            </div>
            
            {/* Секция двух кнопок внизу */}
            <div style={{ display: 'flex', gap: '0.6rem', marginTop: '1rem', flexShrink: 0 }}>
              {/* Кнопка «Сохранить отчет» */}
              <button 
                onClick={handleSave} 
                disabled={isSaving || isSaved || !onSaveReport}
                style={{ 
                  ...s.btn, 
                  background: isSaved ? 'rgba(0, 200, 83, 0.15)' : 'transparent', 
                  color: isSaved ? '#00c853' : '#fff', 
                  border: `1px solid ${isSaved ? '#00c853' : c.border}`,
                  flex: 1,
                  justifyContent: 'center', 
                  height: '42px', 
                  fontWeight: 600,
                  fontSize: '0.85rem',
                  borderRadius: '12px',
                  cursor: isSaved ? 'default' : 'pointer'
                }}
              >
                {isSaving ? (
                  'Сохраняю...'
                ) : isSaved ? (
                  <>
                    <FaCheck style={{ marginRight: '6px' }} /> Сохранено
                  </>
                ) : (
                  <>
                    <FaBookmark style={{ marginRight: '6px', color: c.purple }} /> Сохранить в историю
                  </>
                )}
              </button>

              {/* Кнопка закрытия */}
              <button 
                onClick={onClose} 
                style={{ ...s.btn, background: c.purple, color: '#fff', flex: 1, justifyContent: 'center', height: '42px', fontWeight: 600, fontSize: '0.85rem', borderRadius: '12px' }}
              >
                Закрыть отчет
              </button>
            </div>
          </div>
        )}

        <div style={{ marginTop: '1rem', textAlign: 'center', flexShrink: 0 }}>
          <p style={{ fontSize: '0.7rem', color: c.muted, margin: 0 }}>
            FinMath ИИ анализирует лимиты, аномалии и структуру транзакций.
          </p>
        </div>
      </div>
    </div>
  );
};