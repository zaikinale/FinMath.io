import React, { useState, useMemo, useEffect } from "react";
import { FaPlus, FaRobot, FaChartPie, FaCog, FaUser, FaStickyNote, FaFileAlt, FaHistory } from "react-icons/fa";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';

// Сервис
import { FinanceService } from "../api/finance.service.js";

// Локальные типы
import { type Transaction, type Note, type AiReport, type ThemeColors, type ThemeStyles, type ReportPeriod } from "../components/dashboard/dashboard.types";

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
  const [isDark] = useState(window.matchMedia('(prefers-color-scheme: dark)').matches);
  
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

  // Конфиг дизайн-системы темы
  const c: ThemeColors = {
    bg: isDark ? '#0a0a0a' : '#fafafa', card: isDark ? '#141414' : '#ffffff',
    text: isDark ? '#f5f5f5' : '#111111', muted: isDark ? '#888888' : '#666666',
    border: isDark ? '#2a2a2a' : '#e5e5e5', accent: isDark ? '#ffffff' : '#000000',
    purple: '#8b5cf6', accentText: isDark ? '#000000' : '#ffffff'
  };

  const s: ThemeStyles = {
    isDark,
    btn: { padding: '0.6rem 1rem', borderRadius: '8px', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', fontSize: '0.85rem', fontWeight: 600 },
    card: { background: c.card, border: `1px solid ${c.border}`, borderRadius: '14px', padding: '1.25rem' }
  };

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
      backgroundColor: [c.purple, isDark ? '#333' : '#e0e0e0'], borderWidth: 0, hoverOffset: 10
    }]
  }), [transactions, isDark, c.purple]);

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
    <div style={{ minHeight: '100vh', background: c.bg, color: c.text, fontFamily: 'system-ui, sans-serif' }}>
      
      {/* ШАПКА */}
      <nav style={{ position: 'sticky', top: 0, zIndex: 100, background: c.bg + 'CC', backdropFilter: 'blur(10px)', padding: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ maxWidth: '900px', width: '100%', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ fontWeight: 800, fontSize: '1.1rem' }}>FinMath</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <button onClick={() => setIsModalOpen(true)} style={{ ...s.btn, background: c.accent, color: isDark ? '#000' : '#fff' }}><FaPlus size={12} /> Операция</button>
            <button style={s.btn} onClick={() => navigate('/profile')}><FaUser /> Профиль</button>
          </div>
        </div>
      </nav>

      {/* ОСНОВНОЙ СЕТОЧНЫЙ КОНТЕНТ */}
      <main style={{ maxWidth: '900px', margin: '2rem auto', padding: '0 1rem', display: 'grid', gridTemplateColumns: '1fr 320px', gap: '1.5rem', alignItems: 'start' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          {/* ОБЩИЙ БАЛАНС */}
          <div style={{ ...s.card, position: 'sticky', top: '80px', zIndex: 50 }}>
            <p style={{ color: c.muted, fontSize: '0.8rem', margin: '0 0 0.5rem 0' }}>ОБЩИЙ БАЛАНС</p>
            <h2 style={{ fontSize: '2rem', margin: 0, fontWeight: 800, color: totalBalance < 0 ? '#ef4444' : c.text }}>
              {totalBalance.toLocaleString()} ₽
            </h2>
            <div style={{ display: 'flex', gap: '1rem', marginTop: '1.25rem', borderTop: `1px solid ${c.border}`, paddingTop: '1.25rem' }}>
              {[{ label: 'Неделя', days: 7 }, { label: 'Месяц', days: 30 }, { label: 'Год', days: 365 }].map(period => {
                const cutoff = new Date();
                cutoff.setDate(cutoff.getDate() - period.days);
                const totalExpense = transactions
                  .filter(t => t.type === 'expense' && new Date(t.date) >= cutoff)
                  .reduce((acc, t) => acc + Math.abs(Number(t.amount)), 0);
                return (
                  <div key={period.label} style={{ flex: 1 }}>
                    <p style={{ color: c.muted, fontSize: '0.65rem', margin: 0, textTransform: 'uppercase', letterSpacing: '0.5px' }}>{period.label}</p>
                    <p style={{ fontSize: '0.95rem', fontWeight: 700, margin: '2px 0 0 0' }}>-{totalExpense.toLocaleString()} ₽</p>
                  </div>
                );
              })}
            </div>
            <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.5rem' }}>
                <button onClick={() => setIsAiReportOpen(true)} style={{ ...s.btn, flex: 1, border: `1px solid ${c.purple}44`, background: 'transparent', color: c.purple }}><FaRobot /> Спросить ИИ</button>
                <button onClick={() => setIsPeriodModalOpen(true)} style={{ ...s.btn, flex: 1, background: c.purple, color: '#fff' }}><FaFileAlt /> Отчет</button>
            </div>
          </div>

          <div style={s.card}>
            <h3 style={{ fontSize: '1rem', marginBottom: '1.5rem' }}>Последние операции</h3>
            <TransactionList transactions={sortedTransactions} isDark={isDark} c={c} />
          </div>
        </div>

        {/* ПРАВАЯ ПАНЕЛЬ С ВЫНЕСЕННЫМИ КОМПОНЕНТАМИ */}
        <aside style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', position: 'sticky', top: '80px' }}>
          <CalendarNav value={filterDate} onChange={setFilterDate} onDateClick={(date) => navigate(`/transactions?date=${date}`)} transactions={transactions} c={c} />
          
          <div style={s.card}>
             <h3 style={{ fontSize: '0.9rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><FaChartPie /> Аналитика</h3>
             <div style={{ height: '180px', position: 'relative' }}>
                <Doughnut data={chartData} options={{ maintainAspectRatio: false, cutout: '75%', plugins: { legend: { display: false } } }} />
             </div>
          </div>
          
          {/* ЗАМЕТКИ */}
          <div style={s.card}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3 style={{ fontSize: '0.9rem', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}><FaStickyNote size={14} /> Заметки</h3>
              <button onClick={() => { setEditingNote(null); setIsNoteModalOpen(true); }} style={{ background: 'none', border: 'none', color: c.purple, cursor: 'pointer' }}><FaPlus size={12} /></button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', maxHeight: '160px', overflowY: 'auto' }}>
              {notes.map(note => (
                <div key={note.id} onClick={() => { setEditingNote(note); setIsNoteModalOpen(true); }} style={{ padding: '0.75rem', borderRadius: '8px', background: 'rgba(255,255,255,0.03)', border: `1px solid ${c.border}`, cursor: 'pointer' }}>
                  <div style={{ fontSize: '0.8rem', fontWeight: 700, marginBottom: '2px' }}>{note.title}</div>
                  <div style={{ fontSize: '0.7rem', color: c.muted }}>{note.content}</div>
                </div>
              ))}
            </div>
          </div>

          {/* ИСТОРИЯ ИИ-ОТЧЕТОВ */}
          <div style={s.card}>
            <h3 style={{ fontSize: '0.9rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><FaHistory size={13} color={c.purple} /> Аналитика ИИ</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', maxHeight: '180px', overflowY: 'auto' }}>
              {aiSavedReports.length === 0 ? (
                <p style={{ fontSize: '0.75rem', color: c.muted, margin: 0, textAlign: 'center' }}>Сохраненных отчетов нет</p>
              ) : (
                aiSavedReports.map(report => (
                  <div key={report.id} onClick={() => { setSelectedAiReport(report); setIsViewReportOpen(true); }} style={{ padding: '0.75rem', borderRadius: '8px', background: 'rgba(139, 92, 246, 0.04)', border: `1px solid ${c.purple}22`, cursor: 'pointer' }}>
                    <div style={{ fontSize: '0.8rem', fontWeight: 700, marginBottom: '2px' }}><FaRobot size={11} color={c.purple} /> {translatePeriodLabel(report.periodType)}</div>
                    <div style={{ fontSize: '0.7rem', color: c.muted, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{report.dateRange}</div>
                  </div>
                ))
              )}
            </div>
          </div>

          <button onClick={() => setIsCatModalOpen(true)} style={{ ...s.btn, background: 'transparent', border: `1px solid ${c.border}`, color: c.text, width: '100%' }}><FaCog /> Настроить категории</button>
        </aside>
      </main>

      {/* ПОДКЛЮЧЕНИЕ ИМПОРТИРОВАННЫХ ОКОН */}
      <TransactionModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSubmit={onSubmit} {...{ register, handleSubmit, watch, setValue, categories, s, c }} />
      <AiReportModal isOpen={isAiReportOpen} onClose={() => { setIsAiReportOpen(false); setAiReport(null); }} onGenerate={handleGenerateAiReport} onSaveReport={handleSaveAiReport} loading={aiLoading} report={aiReport} s={s} c={c} />
      <CategorySettingsModal isOpen={isCatModalOpen} onClose={() => setIsCatModalOpen(false)} categories={categories} setCategories={setCategories} s={s} c={c} />
      
      <ReportPeriodModal isOpen={isPeriodModalOpen} onClose={() => setIsPeriodModalOpen(false)} onSelect={handleOpenReport} c={c} s={s} />
      <ViewAiReportModal isOpen={isViewReportOpen} onClose={() => { setIsViewReportOpen(false); setSelectedAiReport(null); }} report={selectedAiReport} onDelete={handleDeletedAiReport} c={c} s={s} />
      <NoteModal isOpen={isNoteModalOpen} onClose={() => { setIsNoteModalOpen(false); setEditingNote(null); }} onSubmit={onNoteSubmit} onDelete={onNoteDelete} editNote={editingNote} c={c} s={s} />

      {showSummary && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 3000, background: c.bg, padding: '2rem', overflowY: 'auto' }}>
            <div style={{ maxWidth: '600px', margin: '0 auto' }}>
              {reportLoading ? <p style={{ color: c.muted, textAlign: 'center' }}>Загрузка финансового отчета...</p> : (
                <FinancialSummary period={reportPeriod} reportData={reportData} transactions={transactions} categories={categories} onBack={() => { setShowSummary(false); setReportData(null); }} s={s} c={c} />
              )}
            </div>
        </div>
      )}
    </div>
  );
}