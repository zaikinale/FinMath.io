import React from 'react';
import { FaTimes, FaRobot, FaTrash } from 'react-icons/fa';
import ReactMarkdown from 'react-markdown';
import { type AiReport, type ThemeColors, type ThemeStyles } from './dashboard.types';

interface ViewAiReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  report: AiReport | null;
  onDelete: (id: string) => void;
  c: ThemeColors;
  s: ThemeStyles;
}

export const ViewAiReportModal: React.FC<ViewAiReportModalProps> = ({ isOpen, onClose, report, onDelete, c, s }) => {
  if (!isOpen || !report) return null;

  const translatePeriod = (type: string) => {
    const map: Record<string, string> = { week: 'Неделя', month: 'Месяц', year: 'Год', custom: 'Период' };
    return map[type] || type;
  };

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2000, padding: '1rem' }}>
      <div style={{ ...s.card, width: '100%', maxWidth: '520px', padding: '1.5rem', border: `1px solid ${c.border}`, maxHeight: '90vh', display: 'flex', flexDirection: 'column' }}>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexShrink: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <div style={{ background: c.purple + '22', padding: '0.5rem', borderRadius: '10px', display: 'flex' }}>
              <FaRobot color={c.purple} size={18} />
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 700 }}>Архивный отчет ИИ</h3>
              <p style={{ margin: 0, fontSize: '0.75rem', color: c.muted }}>{translatePeriod(report.periodType)} ({report.dateRange})</p>
            </div>
          </div>
          <FaTimes onClick={onClose} style={{ cursor: 'pointer', color: c.muted }} />
        </div>

        <div style={{ flex: 1, overflowY: 'auto', background: 'rgba(255, 255, 255, 0.02)', padding: '1rem', borderRadius: '12px', border: `1px solid ${c.border}`, fontSize: '0.85rem', lineHeight: 1.6, color: c.text }}>
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
            {report.insight}
          </ReactMarkdown>
        </div>

        <div style={{ display: 'flex', gap: '0.6rem', marginTop: '1rem', flexShrink: 0 }}>
          <button onClick={() => onDelete(report.id)} style={{ ...s.btn, background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', border: '1px solid rgba(239, 68, 68, 0.2)' }}><FaTrash /> Удалить</button>
          <button onClick={onClose} style={{ ...s.btn, background: c.purple, color: '#fff', flex: 1 }}>Закрыть</button>
        </div>
      </div>
    </div>
  );
};