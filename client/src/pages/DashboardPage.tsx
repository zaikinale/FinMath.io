import React, { useState, useMemo, useEffect } from "react";
import { FaPlus, FaRobot, FaChartPie, FaCog, FaUser, FaStickyNote, FaFileAlt, FaHistory } from "react-icons/fa";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';

// Сервис
import { FinanceService } from "../api/finance.service.js";

// Локальные типы
import { type Transaction, type Note, type AiReport, type ReportPeriod } from "../components/dashboard/dashboard.types";

// Внешние компоненты
import { TransactionModal } from "../components/TransactionModal";
import { AiReportModal } from "../components/AiReportModal";
import { TransactionList } from "../components/TransactionList";
import { CategorySettingsModal } from "../components/CategorySettingsModal";
import { FinancialSummary } from "../components/FinancialSummary"; 

// Вынесенные декомпозированные компоненты
import { CalendarNav } from "../components/dashboard/CalendarNav";
import { ReportPeriodModal } from "../components/dashboard/ReportPeriodModal";
import { NoteModal } from "../components/dashboard/NoteModal";
import { ViewAiReportModal } from "../components/dashboard/ViewAiReportModal";

ChartJS.register(ArcElement, Tooltip, Legend);

export default function DashboardPage() {
  const navigate = useNavigate();
  
  // Состояния открытия окон
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAiReportOpen, setIsAiReportOpen] = useState(false);
  const [isPeriodModalOpen, setIsPeriodModalOpen] = useState(false);
  const [isCatModalOpen, setIsCatModalOpen] = useState(false);
  const [isNoteModalOpen, setIsNoteModalOpen] = useState(false);
  const [isViewReportOpen, setIsViewReportOpen] = useState(false);
  
  // Бизнес-состояния данных
  const [showSummary, setShowSummary] = useState(false);
  const [reportPeriod, setReportPeriod] = useState<ReportPeriod | null>(null);
  const [notes, setNotes] = useState<Note[]>([]);
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [aiSavedReports, setAiSavedReports] = useState<AiReport[]>([]);
  const [selectedAiReport, setSelectedAiReport] = useState<AiReport | null>(null);
  const [filterDate, setFilterDate] = useState(new Date().toISOString().split('T')[0]);
  const [categories, setCategories] = useState<{ expense: any[]; income: any[] }>({ expense: [], income: [] });
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  // ИИ и обычная аналитика
  const [aiLoading, setAiLoading] = useState(false);
  const [aiReport, setAiReport] = useState<{ insight: string } | null>(null);
  const [currentPeriodType, setCurrentPeriodType] = useState<'week' | 'month' | 'year' | 'custom'>('month');
  const [currentDateRange, setCurrentDateRange] = useState<string>('');
  const [reportData, setReportData] = useState(null);
  const [reportLoading, setReportLoading] = useState(false);

  // Старая заглушка для совместимости с пропсами модалок, если они все еще её требуют
  const c = { purple: '#8b5cf6' };
  const s = {};

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [cats, txs, notesData, aiHistoryResponse] = await Promise.all([
          FinanceService.getCategories(),
          FinanceService.getTransactions(),
          FinanceService.getNotes(),
          FinanceService.getAiReportsHistory()
        ]);
        
        setCategories({
          expense: cats.filter((c: any) => c.type === 'expense'),
          income: cats.filter((c: any) => c.type === 'income')
        });
        setTransactions(txs);
        setNotes(notesData);
        
        if (aiHistoryResponse && aiHistoryResponse.success) {
          setAiSavedReports(aiHistoryResponse.data || []);
        }
      } catch (err) {
        console.error("Ошибка при загрузке данных:", err);
      }
    };
    fetchData();
  }, []);

  const { register, handleSubmit, reset, watch, setValue } = useForm({
    defaultValues: { type: 'expense', date: new Date().toISOString().split('T')[0], amount: '', categoryId: '', desc: '' }
  });

  const onSubmit = async (data: any) => {
    try {
      const response = await FinanceService.createTransaction({ ...data, amount: Number(data.amount) });
      if (response.warning) alert(response.warning);
      setTransactions([response.transaction, ...transactions]);
      setIsModalOpen(false);
      reset();
    } catch (err) {
      alert("Ошибка при сохранении транзакции");
    }
  };

  const onNoteSubmit = async (data: { title: string; content: string }) => {
    try {
      if (editingNote) {
        const updated = await FinanceService.updateNote(editingNote.id, data);
        setNotes(notes.map(n => n.id === updated.id ? updated : n));
      } else {
        const created = await FinanceService.createNote(data);
        setNotes([created, ...notes]);
      }
      setIsNoteModalOpen(false);
      setEditingNote(null);
    } catch (e) {
      alert("Ошибка при сохранении заметки");
    }
  };

  const onNoteDelete = async (id: string) => {
    if (!window.confirm("Удалить заметку?")) return;
    try {
      await FinanceService.deleteNote(id);
      setNotes(notes.filter(n => n.id !== id));
      setIsNoteModalOpen(false);
      setEditingNote(null);
    } catch (e) {
      alert("Ошибка при удалении");
    }
  };

  const handleDeletedAiReport = async (id: string) => {
    if (!window.confirm("Удалить этот отчет из истории?")) return;
    try {
      await FinanceService.deleteAiReport(id);
      setAiSavedReports(aiSavedReports.filter(r => r.id !== id));
      setIsViewReportOpen(false);
      setSelectedAiReport(null);
    } catch (e) {
      alert("Ошибка при удалении отчета");
    }
  };

  const formatDateString = (date: Date) => {
    const offset = date.getTimezoneOffset();
    const localDate = new Date(date.getTime() - (offset * 60 * 1000));
    return localDate.toISOString().split('T')[0];
  };

  const handleGenerateAiReport = async (period: any) => {
    setAiLoading(true);
    setAiReport(null);
    let startDate = '';
    let endDate = formatDateString(new Date());
    const now = new Date();

    if (period === 'week') {
      const weekAgo = new Date();
      weekAgo.setDate(now.getDate() - 7);
      startDate = formatDateString(weekAgo);
      setCurrentPeriodType('week');
    } else if (period === 'month') {
      const monthAgo = new Date();
      monthAgo.setMonth(now.getMonth() - 1);
      startDate = formatDateString(monthAgo);
      setCurrentPeriodType('month');
    } else if (period === 'year') {
      const yearAgo = new Date();
      yearAgo.setFullYear(now.getFullYear() - 1);
      startDate = formatDateString(yearAgo);
      setCurrentPeriodType('year');
    } else {
      startDate = period.start;
      endDate = period.end;
      setCurrentPeriodType('custom');
    }

    setCurrentDateRange(`${startDate} — ${endDate}`);

    try {
      const data = await FinanceService.getAiAnalytics(startDate, endDate);
      setAiReport({ insight: data.report });
    } catch (err: any) {
      setAiReport({ insight: err.response?.data?.message || 'Не удалось сформировать отчет.' });
    } finally {
      setAiLoading(false);
    }
  };

  const handleSaveAiReport = async (markdownText: string): Promise<boolean> => {
    try {
      const response = await FinanceService.saveAiReport({
        periodType: currentPeriodType,
        dateRange: currentDateRange,
        insight: markdownText
      });
      if (response && response.success && response.data) {
        setAiSavedReports([response.data, ...aiSavedReports]);
        return true;
      }
      return false;
    } catch (error) {
      return false;
    }
  };

  const handleOpenReport = async (period: ReportPeriod) => {
    setIsPeriodModalOpen(false);
    setReportLoading(true);
    setShowSummary(true);
    setReportPeriod(period);
    let start = '';
    let end = formatDateString(new Date());
    const now = new Date();

    if (period === 'week') {
      const weekAgo = new Date();
      weekAgo.setDate(now.getDate() - 7);
      start = formatDateString(weekAgo);
    } else if (period === 'month') {
      const monthAgo = new Date();
      monthAgo.setMonth(now.getMonth() - 1);
      start = formatDateString(monthAgo);
    } else if (period === 'year') {
      const yearAgo = new Date();
      yearAgo.setFullYear(now.getFullYear() - 1);
      start = formatDateString(yearAgo);
    } else if (typeof period === 'object') {
      start = period.start;
      end = period.end;
    }

    try {
      const data = await FinanceService.getReport(start, end);
      setReportData(data);
    } catch (err) {
      alert("Не удалось загрузить данные отчета с сервера");
    } finally {
      setReportLoading(false);
    }
  };

  const chartData = useMemo(() => ({
    labels: ['Расходы', 'Доходы'],
    datasets: [{
      data: [
        transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + Math.abs(Number(t.amount)), 0),
        transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + Number(t.amount), 0)
      ],
      backgroundColor: ['#8b5cf6', 'rgba(255,255,255,0.1)'], 
      borderWidth: 0, 
      hoverOffset: 10
    }]
  }), [transactions]);

  const totalBalance = transactions.reduce((acc, t) => {
    const amt = Number(t.amount);
    return acc + (t.type === 'expense' ? -Math.abs(amt) : amt);
  }, 0);

  const sortedTransactions = useMemo(() => {
    return [...transactions].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [transactions]);

  const translatePeriodLabel = (type: string) => {
    const map: Record<string, string> = { week: 'Неделя', month: 'Месяц', year: 'Год', custom: 'Период' };
    return map[type] || type;
  };

  return (
    <div className="min-h-screen w-full bg-[#fafafa] dark:bg-[#0a0a0a] text-[#111111] dark:text-[#f5f5f5] font-sans box-border">
      
      {/* ШАПКА */}
      <nav className="sticky top-0 z-[100] bg-[#fafafa]/80 dark:bg-[#0a0a0a]/80 backdrop-blur-md border-b border-[#e5e5e5] dark:border-[#2a2a2a] px-4 py-3 flex items-center justify-center box-border">
        <div className="max-w-[900px] w-full flex justify-between items-center box-border">
          <div className="font-black text-lg tracking-tight">FinMath</div>
          <div className="flex items-center gap-3">
            <button 
              type="button"
              onClick={() => setIsModalOpen(true)} 
              className="px-4 py-2 border-none rounded-xl text-sm font-bold flex items-center justify-center gap-2 cursor-pointer bg-black dark:bg-white text-white dark:text-black transition-opacity hover:opacity-90"
            >
              <FaPlus size={11} /> Операция
            </button>
            <button 
              type="button"
              onClick={() => navigate('/profile')}
              className="px-4 py-2 border-none rounded-xl text-sm font-semibold flex items-center justify-center gap-2 cursor-pointer bg-neutral-200/60 dark:bg-neutral-800/60 text-[#111111] dark:text-[#f5f5f5] transition-colors hover:bg-neutral-200 dark:hover:bg-neutral-800"
            >
              <FaUser size={12} /> Профиль
            </button>
          </div>
        </div>
      </nav>

      {/* ОСНОВНОЙ СЕТОЧНЫЙ КОНТЕНТ */}
      <main className="max-w-[900px] mx-auto my-8 px-4 grid grid-cols-1 md:grid-cols-[1fr_320px] gap-6 items-start box-border">
        
        {/* ЛЕВАЯ КОЛОНКА */}
        <div className="flex flex-col gap-6 w-full box-border">
          
          {/* ОБЩИЙ БАЛАНС */}
          <div className="sticky top-20 z-40 bg-white dark:bg-[#141414] border border-[#e5e5e5] dark:border-[#2a2a2a] rounded-2xl p-5 box-border shadow-sm">
            <p className="text-[#666666] dark:text-[#888888] text-xs font-black tracking-wider m-0 mb-2 uppercase">Общий баланс</p>
            <h2 className={`text-3xl font-black m-0 tracking-tight ${totalBalance < 0 ? 'text-red-500' : 'text-[#111111] dark:text-[#f5f5f5]'}`}>
              {totalBalance.toLocaleString()} ₽
            </h2>
            
            {/* Периодические траты */}
            <div className="grid grid-cols-3 gap-4 mt-5 border-t border-[#e5e5e5] dark:border-[#2a2a2a] pt-5 box-border">
              {[{ label: 'Неделя', days: 7 }, { label: 'Месяц', days: 30 }, { label: 'Год', days: 365 }].map(period => {
                const cutoff = new Date();
                cutoff.setDate(cutoff.getDate() - period.days);
                const totalExpense = transactions
                  .filter(t => t.type === 'expense' && new Date(t.date) >= cutoff)
                  .reduce((acc, t) => acc + Math.abs(Number(t.amount)), 0);
                return (
                  <div key={period.label} className="w-full">
                    <p className="text-[#666666] dark:text-[#888888] text-[10px] font-bold m-0 text-uppercase tracking-wider uppercase">{period.label}</p>
                    <p className="text-sm font-extrabold m-0 mt-1 truncate">-{totalExpense.toLocaleString()} ₽</p>
                  </div>
                );
              })}
            </div>
            
            {/* ИИ Кнопки */}
            <div className="flex gap-3 mt-6 box-border">
              <button 
                type="button"
                onClick={() => setIsAiReportOpen(true)} 
                className="flex-1 py-2.5 border border-violet-500/30 dark:border-violet-500/20 bg-transparent text-violet-500 font-bold text-sm rounded-xl flex items-center justify-center gap-2 cursor-pointer transition-colors hover:bg-violet-500/5"
              >
                <FaRobot /> Спросить ИИ
              </button>
              <button 
                type="button"
                onClick={() => setIsPeriodModalOpen(true)} 
                className="flex-1 py-2.5 border-none bg-violet-600 text-white font-bold text-sm rounded-xl flex items-center justify-center gap-2 cursor-pointer transition-all hover:bg-violet-500 shadow-sm shadow-violet-500/10"
              >
                <FaFileAlt /> Отчет
              </button>
            </div>
          </div>

          {/* Список последних операций */}
          <div className="bg-white dark:bg-[#141414] border border-[#e5e5e5] dark:border-[#2a2a2a] rounded-2xl p-5 box-border shadow-sm">
            <h3 className="text-base font-black m-0 mb-5 tracking-tight">Последние операции</h3>
            <TransactionList transactions={sortedTransactions} isDark={true} c={{ purple: '#8b5cf6', text: '#f5f5f5', muted: '#888888', border: '#2a2a2a' }} />
          </div>
        </div>

        {/* ПРАВАЯ ПАНЕЛЬ */}
        <aside className="flex flex-col gap-6 w-full md:sticky md:top-20 box-border">
          
          {/* Календарь навигации */}
          <CalendarNav value={filterDate} onChange={setFilterDate} onDateClick={(date) => navigate(`/transactions?date=${date}`)} transactions={transactions} c={{ purple: '#8b5cf6', border: '#2a2a2a', muted: '#888888', text: '#f5f5f5' }} />
          
          {/* Круговая диаграмма аналитики */}
          <div className="bg-white dark:bg-[#141414] border border-[#e5e5e5] dark:border-[#2a2a2a] rounded-2xl p-5 box-border shadow-sm">
             <h3 className="text-sm font-bold m-0 mb-4 flex items-center gap-2 tracking-tight"><FaChartPie className="text-violet-500" /> Аналитика</h3>
             <div className="h-[180px] w-full relative">
                <Doughnut data={chartData} options={{ maintainAspectRatio: false, cutout: '75%', plugins: { legend: { display: false } } }} />
             </div>
          </div>
          
          {/* ЗАМЕТКИ */}
          <div className="bg-white dark:bg-[#141414] border border-[#e5e5e5] dark:border-[#2a2a2a] rounded-2xl p-5 box-border shadow-sm">
            <div className="flex justify-between items-center mb-4 box-border">
              <h3 className="text-sm font-bold m-0 flex items-center gap-2 tracking-tight"><FaStickyNote size={14} className="text-[#666666] dark:text-[#888888]" /> Заметки</h3>
              <button 
                type="button"
                onClick={() => { setEditingNote(null); setIsNoteModalOpen(true); }} 
                className="bg-transparent border-none text-violet-500 hover:text-violet-400 cursor-pointer p-1 flex items-center transition-colors"
              >
                <FaPlus size={12} />
              </button>
            </div>
            
            <div className="flex flex-col gap-2 max-h-[160px] overflow-y-auto pr-1 box-border">
              {notes.map(note => (
                <div 
                  key={note.id} 
                  onClick={() => { setEditingNote(note); setIsNoteModalOpen(true); }} 
                  className="p-3 rounded-xl bg-black/5 dark:bg-white/5 border border-[#e5e5e5] dark:border-[#2a2a2a] cursor-pointer hover:border-neutral-300 dark:hover:border-neutral-700 transition-all box-border"
                >
                  <div className="text-xs font-bold text-[#111111] dark:text-[#f5f5f5] mb-1 truncate">{note.title}</div>
                  <div className="text-[11px] text-[#666666] dark:text-[#888888] line-clamp-2 leading-normal">{note.content}</div>
                </div>
              ))}
            </div>
          </div>

          {/* ИСТОРИЯ ИИ-ОТЧЕТОВ */}
          <div className="bg-white dark:bg-[#141414] border border-[#e5e5e5] dark:border-[#2a2a2a] rounded-2xl p-5 box-border shadow-sm">
            <h3 className="text-sm font-bold m-0 mb-4 flex items-center gap-2 tracking-tight"><FaHistory size={13} className="text-violet-500" /> Аналитика ИИ</h3>
            
            <div className="flex flex-col gap-2 max-h-[180px] overflow-y-auto pr-1 box-border">
              {aiSavedReports.length === 0 ? (
                <p className="text-xs text-[#666666] dark:text-[#888888] m-0 py-4 text-center font-medium">Сохраненных отчетов нет</p>
              ) : (
                aiSavedReports.map(report => (
                  <div 
                    key={report.id} 
                    onClick={() => { setSelectedAiReport(report); setIsViewReportOpen(true); }} 
                    className="p-3 rounded-xl bg-violet-500/5 border border-violet-500/10 cursor-pointer hover:border-violet-500/30 transition-all box-border"
                  >
                    <div className="text-xs font-bold text-[#111111] dark:text-[#f5f5f5] flex items-center gap-1.5 mb-1">
                      <FaRobot size={11} className="text-violet-500" /> {translatePeriodLabel(report.periodType)}
                    </div>
                    <div className="text-[11px] text-[#666666] dark:text-[#888888] truncate">{report.dateRange}</div>
                  </div>
                ))
              )}
            </div>
          </div>

          <button 
            type="button"
            onClick={() => setIsCatModalOpen(true)} 
            className="w-full py-3 bg-transparent border border-[#e5e5e5] dark:border-[#2a2a2a] text-[#111111] dark:text-[#f5f5f5] text-xs font-bold rounded-xl cursor-pointer transition-colors hover:bg-black/5 dark:hover:bg-white/5"
          >
            <FaCog /> Настроить категории
          </button>
        </aside>
      </main>

      {/* Окна верхнего уровня */}
      <TransactionModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSubmit={onSubmit} {...{ register, handleSubmit, watch, setValue, categories }} s={s} c={c} />
      <AiReportModal isOpen={isAiReportOpen} onClose={() => { setIsAiReportOpen(false); setAiReport(null); }} onGenerate={handleGenerateAiReport} onSaveReport={handleSaveAiReport} loading={aiLoading} report={aiReport} s={s} c={c} />
      <CategorySettingsModal isOpen={isCatModalOpen} onClose={() => setIsCatModalOpen(false)} categories={categories} setCategories={setCategories} s={s} c={c} />
      
      <ReportPeriodModal isOpen={isPeriodModalOpen} onClose={() => setIsPeriodModalOpen(false)} onSelect={handleOpenReport} c={c} s={s} />
      <ViewAiReportModal isOpen={isViewReportOpen} onClose={() => { setIsViewReportOpen(false); setSelectedAiReport(null); }} report={selectedAiReport} onDelete={handleDeletedAiReport} c={c} s={s} />
      <NoteModal isOpen={isNoteModalOpen} onClose={() => { setIsNoteModalOpen(false); setEditingNote(null); }} onSubmit={onNoteSubmit} onDelete={onNoteDelete} editNote={editingNote} c={c} s={s} />

      {showSummary && (
        <div className="fixed inset-0 z-[3000] bg-[#fafafa] dark:bg-[#0a0a0a] p-8 overflow-y-auto box-border flex flex-col items-center">
            <div className="max-w-[600px] w-full box-border">
              {reportLoading ? (
                <p className="text-[#666666] dark:text-[#888888] text-center font-bold text-sm mt-24">Загрузка финансового отчета...</p>
              ) : (
                <FinancialSummary period={reportPeriod} reportData={reportData} transactions={transactions} categories={categories} onBack={() => { setShowSummary(false); setReportData(null); }} s={s} c={c} />
              )}
            </div>
        </div>
      )}
    </div>
  );
}