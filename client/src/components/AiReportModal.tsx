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

  // Исправленный сброс состояния: сбрасываем "сохранено", если отчет пропал
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

  return (
    <div className="fixed inset-0 bg-black/60 dark:bg-black/85 backdrop-blur-sm flex items-center justify-center z-[2000] p-4 box-border">
      
      {/* Главный контейнер карточки */}
      <div className={`w-full bg-white dark:bg-[#141414] border border-[#e5e5e5] dark:border-[#2a2a2a] p-6 rounded-3xl max-h-[90vh] flex flex-col box-border shadow-2xl transition-all duration-300 ${
        report ? 'max-w-[520px]' : 'max-w-[420px]'
      }`}>
        
        {/* Header */}
        <div className="flex justify-between items-center mb-5 flex-shrink-0 box-border">
          <div className="flex items-center gap-2.5 box-border">
            <div className="bg-violet-500/10 p-2 rounded-xl flex items-center justify-center box-border">
              <FaRobot className="text-violet-600 dark:text-violet-400 w-4.5 h-4.5" />
            </div>
            <h3 className="m-0 text-base font-bold text-neutral-900 dark:text-white tracking-tight">ИИ Аналитика</h3>
          </div>
          <FaTimes 
            onClick={onClose} 
            className="cursor-pointer text-[#666666] dark:text-[#999999] hover:opacity-80 transition-opacity w-4 h-4" 
          />
        </div>

        {!report ? (
          /* Форма параметров генерации */
          <div className="flex-shrink-0 box-border">
            <p className="text-[#666666] dark:text-[#999999] text-xs font-medium m-0 mb-5 leading-relaxed">
              Выберите временной отрезок для формирования умного отчета.
            </p>

            {/* Селектор пресетов периодов */}
            <div className="flex gap-1 bg-[#f0f0f0] dark:bg-[#1a1a1a] p-1 rounded-xl border border-transparent dark:border-[#2a2a2a] mb-5 box-border">
              {presets.map((p) => {
                const isActive = selectedType === p.id;
                return (
                  <div 
                    key={p.id} 
                    onClick={() => setSelectedType(p.id as ReportType)} 
                    className={`flex-1 py-2 rounded-lg text-xs font-bold cursor-pointer text-center select-none transition-all ${
                      isActive 
                        ? 'bg-violet-600 text-white shadow-sm' 
                        : 'bg-transparent text-[#666666] dark:text-[#999999] hover:text-[#111111] dark:hover:text-[#f5f5f5]'
                    }`}
                  >
                    {p.label}
                  </div>
                );
              })}
            </div>

            {/* Кастомный выбор дат, если выбран 'custom' */}
            {selectedType === 'custom' && (
              <div className="flex items-center gap-2 mb-5 box-border animate-fade-in">
                <input 
                  type="date" 
                  value={customRange.start}
                  onChange={(e) => setCustomRange({ ...customRange, start: e.target.value })}
                  className="flex-1 px-3 py-2 bg-white dark:bg-[#1a1a1a] border border-[#e5e5e5] dark:border-[#2a2a2a] rounded-xl text-neutral-900 dark:text-white text-xs box-border outline-none min-h-[38px] transition-colors focus:border-neutral-400 dark:focus:border-neutral-600" 
                />
                <div className="text-[#666666] dark:text-[#999999] flex-shrink-0">
                  <FaChevronRight className="w-2.5 h-2.5" />
                </div>
                <input 
                  type="date" 
                  value={customRange.end}
                  onChange={(e) => setCustomRange({ ...customRange, end: e.target.value })}
                  className="flex-1 px-3 py-2 bg-white dark:bg-[#1a1a1a] border border-[#e5e5e5] dark:border-[#2a2a2a] rounded-xl text-neutral-900 dark:text-white text-xs box-border outline-none min-h-[38px] transition-colors focus:border-neutral-400 dark:focus:border-neutral-600" 
                />
              </div>
            )}

            {/* Кнопка отправки */}
            <button 
              onClick={handleGenerate} 
              disabled={loading || (selectedType === 'custom' && (!customRange.start || !customRange.end))} 
              className="w-full h-11 bg-violet-600 hover:bg-violet-500 text-white border-none rounded-xl font-bold text-sm flex items-center justify-center cursor-pointer transition-all disabled:opacity-60 disabled:not-allowed shadow-sm shadow-violet-500/10"
            >
              {loading ? 'Просчитываю тренды...' : 'Сгенерировать анализ'}
            </button>
          </div>
        ) : (
          /* Экран отображения сгенерированного отчета */
          <div className="flex flex-col flex-1 overflow-hidden box-border">
            <div className="flex items-center gap-1.5 text-violet-600 dark:text-violet-400 font-black text-[11px] mb-2.5 uppercase tracking-wider flex-shrink-0 box-border">
              <FaMagic className="w-3 h-3" /> Результат анализа
            </div>
            
            {/* Контейнер отчета со встроенным скроллбаром и стилизацией Markdown через Tailwind */}
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
              <ReactMarkdown>{reportText}</ReactMarkdown>
            </div>
            
            {/* Кнопки управления */}
            <div className="flex gap-2.5 mt-4 flex-shrink-0 box-border">
              {/* Кнопка «Сохранить отчет» */}
              <button 
                onClick={handleSave} 
                disabled={isSaving || isSaved || !onSaveReport}
                className={`flex-1 h-11 font-bold text-xs rounded-xl border border-solid flex items-center justify-center gap-1.5 transition-all ${
                  isSaved 
                    ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-500 border-emerald-500/30 cursor-default' 
                    : 'bg-transparent text-neutral-800 dark:text-white border-[#e5e5e5] dark:border-[#2a2a2a] hover:bg-black/5 dark:hover:bg-white/5 cursor-pointer'
                } disabled:opacity-60`}
              >
                {isSaving ? (
                  'Сохраняю...'
                ) : isSaved ? (
                  <>
                    <FaCheck className="w-3.5 h-3.5" /> Сохранено
                  </>
                ) : (
                  <>
                    <FaBookmark className="text-violet-600 dark:text-violet-400 w-3 h-3" /> Сохранить в историю
                  </>
                )}
              </button>

              {/* Кнопка закрытия */}
              <button 
                onClick={onClose} 
                className="flex-1 h-11 bg-violet-600 hover:bg-violet-500 text-white font-bold text-xs border-none rounded-xl cursor-pointer flex items-center justify-center transition-colors shadow-sm shadow-violet-500/10"
              >
                Закрыть отчет
              </button>
            </div>
          </div>
        )}

        {/* Подвал дисклеймера */}
        <div className="mt-4 text-center flex-shrink-0 box-border">
          <p className="text-[10px] text-[#666666] dark:text-[#999999] m-0 font-medium tracking-wide">
            FinMath ИИ анализирует лимиты, аномалии и структуру транзакций.
          </p>
        </div>
      </div>
    </div>
  );
};