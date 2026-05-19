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
    <div className="fixed inset-0 bg-black/60 dark:bg-black/85 backdrop-blur-sm flex items-center justify-center z-[2000] p-4 box-border">
      
      {/* Контейнер карточки */}
      <div className="w-full max-w-[520px] bg-white dark:bg-[#141414] border border-[#e5e5e5] dark:border-[#2a2a2a] p-6 rounded-3xl max-h-[90vh] flex flex-col box-border shadow-2xl">
        
        {/* Header */}
        <div className="flex justify-between items-center mb-4 flex-shrink-0 box-border">
          <div className="flex items-center gap-2.5 box-border">
            <div className="bg-violet-500/10 p-2 rounded-xl flex items-center justify-center box-border">
              <FaRobot className="text-violet-600 dark:text-violet-400 w-4.5 h-4.5" />
            </div>
            <div>
              <h3 className="m-0 text-sm font-bold text-neutral-900 dark:text-white tracking-tight">Архивный отчет ИИ</h3>
              <p className="m-0 text-xs text-[#666666] dark:text-[#999999] font-medium mt-0.5">
                {translatePeriod(report.periodType)} ({report.dateRange})
              </p>
            </div>
          </div>
          <FaTimes 
            onClick={onClose} 
            className="cursor-pointer text-[#666666] dark:text-[#999999] hover:opacity-80 transition-opacity w-4 h-4" 
          />
        </div>

        {/* Контейнер отчета с markdown-стилизацией */}
        <div className="flex-1 overflow-y-auto bg-black/[0.02] dark:bg-white/[0.02] p-4 rounded-xl border border-[#e5e5e5] dark:border-[#2a2a2a] text-xs font-medium leading-relaxed text-neutral-800 dark:text-[#f5f5f5] box-border
          [&_h3]:text-violet-600 [&_h3]:dark:text-violet-400 [&_h3]:text-sm [&_h3]:font-bold [&_h3]:mt-5 [&_h3]:mb-2 [&_h3]:border-0 [&_h3]:border-b [&_h3]:border-solid [&_h3]:border-[#e5e5e5] [&_h3]:dark:border-white/10 [&_h3]:pb-1
          [&_h4]:text-violet-600 [&_h4]:dark:text-violet-400 [&_h4]:text-xs [&_h4]:font-bold [&_h4]:mt-4 [&_h4]:mb-2 [&_h4]:border-0 [&_h4]:border-b [&_h4]:border-solid [&_h4]:border-[#e5e5e5] [&_h4]:dark:border-white/10 [&_h4]:pb-1
          [&_ul]:pl-5 [&_ul]:my-2 [&_ul]:list-disc
          [&_li]:mb-1.5 [&_li]:text-neutral-700 [&_li]:dark:text-[#e0e0e0]
          [&_strong]:text-neutral-950 [&_strong]:dark:text-white [&_strong]:font-bold
          [&_table]:w-full [&_table]:border-collapse [&_table]:my-3
          [&_th]:bg-black/[0.04] [&_th]:dark:bg-white/[0.04] [&_th]:p-2 [&_th]:border [&_th]:border-solid [&_th]:border-[#e5e5e5] [&_th]:dark:border-[#2a2a2a] [&_th]:text-left [&_th]:text-[11px]
          [&_td]:p-2 [&_td]:border [&_td]:border-solid [&_td]:border-[#e5e5e5] [&_td]:dark:border-[#2a2a2a] [&_td]:text-[11px]"
        >
          <ReactMarkdown>
            {report.insight}
          </ReactMarkdown>
        </div>

        {/* Футер-кнопки */}
        <div className="flex gap-2.5 mt-4 flex-shrink-0 box-border">
          <button 
            onClick={() => onDelete(report.id)} 
            className="px-4 h-11 bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-solid border-red-500/20 hover:border-red-500/30 font-bold text-xs rounded-xl flex items-center justify-center gap-2 cursor-pointer transition-colors"
          >
            <FaTrash className="w-3 h-3" /> Удалить
          </button>
          
          <button 
            onClick={onClose} 
            className="flex-1 h-11 bg-violet-600 hover:bg-violet-500 text-white font-bold text-xs border-none rounded-xl cursor-pointer flex items-center justify-center transition-colors shadow-sm shadow-violet-500/10"
          >
            Закрыть
          </button>
        </div>

      </div>
    </div>
  );
};