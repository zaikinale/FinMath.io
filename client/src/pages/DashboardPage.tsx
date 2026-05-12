import { useState, useMemo, useEffect } from "react";
import { FaPlus, FaRobot, FaChartPie, FaCog, FaChevronLeft, FaChevronRight, FaUser, FaStickyNote, FaTimes, FaSave, FaFileAlt, FaCalendarAlt, FaTrash } from "react-icons/fa";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

// Импорт сервиса
import { FinanceService } from "../api/finance.service.js";

// Chart.js
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';

// Твои компоненты
import { TransactionModal } from "../components/TransactionModal";
import { AiReportModal } from "../components/AiReportModal";
import { TransactionList } from "../components/TransactionList";
import { CategorySettingsModal } from "../components/CategorySettingsModal";
import { FinancialSummary } from "../components/FinancialSummary"; 

ChartJS.register(ArcElement, Tooltip, Legend);

// --- МОДАЛКИ ---

const ReportPeriodModal = ({ isOpen, onClose, onSelect, c, s }) => {
  const [customRange, setCustomRange] = useState({ start: '', end: '' });
  if (!isOpen) return null;
  const periods = [
    { label: 'Неделя', value: 'week' },
    { label: 'Месяц', value: 'month' },
    { label: 'Год', value: 'year' }
  ];
  return (
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2000, padding: '1rem' }}>
      <div style={{ ...s.card, width: '100%', maxWidth: '350px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h3 style={{ margin: 0 }}>Выбор периода</h3>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: c.muted, cursor: 'pointer' }}><FaTimes /></button>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {periods.map(p => (
            <button key={p.value} onClick={() => onSelect(p.value)} style={{ ...s.btn, background: 'rgba(255,255,255,0.05)', color: c.text, border: `1px solid ${c.border}`, justifyContent: 'flex-start' }}>
              <FaCalendarAlt size={12} color={c.purple} /> {p.label}
            </button>
          ))}
          <div style={{ marginTop: '0.5rem', paddingTop: '1rem', borderTop: `1px solid ${c.border}` }}>
            <p style={{ fontSize: '0.75rem', color: c.muted, marginBottom: '0.75rem' }}>Кастомный период</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <input type="date" onChange={(e) => setCustomRange({...customRange, start: e.target.value})} style={{ ...s.btn, background: 'rgba(0,0,0,0.2)', color: c.text, border: `1px solid ${c.border}` }} />
              <input type="date" onChange={(e) => setCustomRange({...customRange, end: e.target.value})} style={{ ...s.btn, background: 'rgba(0,0,0,0.2)', color: c.text, border: `1px solid ${c.border}` }} />
              <button disabled={!customRange.start || !customRange.end} onClick={() => onSelect(customRange)} style={{ ...s.btn, background: c.purple, color: '#fff', marginTop: '0.5rem' }}>Показать отчет</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const NoteModal = ({ isOpen, onClose, onSubmit, onDelete, editNote, c, s }) => {
  const { register, handleSubmit, reset, setValue } = useForm();
  useEffect(() => {
    if (editNote) {
      setValue("title", editNote.title);
      setValue("content", editNote.content);
    } else {
      reset({ title: "", content: "" });
    }
  }, [editNote, isOpen, setValue, reset]);
  if (!isOpen) return null;
  return (
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '1rem' }}>
      <div style={{ ...s.card, width: '100%', maxWidth: '400px', position: 'relative' }}>
        <button onClick={onClose} style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'none', border: 'none', cursor: 'pointer', color: c.muted }}><FaTimes /></button>
        <h3 style={{ margin: '0 0 1.5rem 0' }}>{editNote ? 'Правка заметки' : 'Новая заметка'}</h3>
        <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <input {...register("title", { required: true })} placeholder="Заголовок" style={{ ...s.card, padding: '0.75rem', background: 'rgba(255,255,255,0.05)', border: `1px solid ${c.border}`, color: c.text }} />
          <textarea {...register("content")} placeholder="Текст заметка..." rows={4} style={{ ...s.card, padding: '0.75rem', background: 'rgba(255,255,255,0.05)', border: `1px solid ${c.border}`, color: c.text, resize: 'none' }} />
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button type="submit" style={{ ...s.btn, flex: 1, background: c.purple, color: '#fff' }}><FaSave /> Сохранить</button>
            {editNote && (
               <button type="button" onClick={() => onDelete(editNote.id)} style={{ ...s.btn, background: '#ef4444', color: '#fff' }}><FaTrash /></button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

const CalendarNav = ({ value, onChange, transactions, c, onDateClick }) => {
  const date = new Date(value);
  const year = date.getFullYear();
  const month = date.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayIndex = new Date(year, month, 1).getDay();
  const shift = firstDayIndex === 0 ? 6 : firstDayIndex - 1;
  const days = [];
  for (let i = 0; i < shift; i++) days.push(null);
  for (let d = 1; d <= daysInMonth; d++) days.push(d);
  const monthName = new Intl.DateTimeFormat('ru-RU', { month: 'long', year: 'numeric' }).format(date);
  
  const handleMonthChange = (offset) => {
    const newDate = new Date(year, month + offset, 1);
    onChange(newDate.toISOString().split('T')[0]);
  };

  return (
    <div style={{ background: c.card, border: `1px solid ${c.border}`, borderRadius: '14px', padding: '1rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <button onClick={() => handleMonthChange(-1)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: c.text }}><FaChevronLeft size={12}/></button>
        <span style={{ fontWeight: 700, fontSize: '0.85rem', textTransform: 'capitalize' }}>{monthName}</span>
        <button onClick={() => handleMonthChange(1)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: c.text }}><FaChevronRight size={12}/></button>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '4px', textAlign: 'center' }}>
        {['пн', 'вт', 'ср', 'чт', 'пт', 'сб', 'вс'].map(d => (<div key={d} style={{ fontSize: '0.65rem', color: c.muted, fontWeight: 600, paddingBottom: '4px' }}>{d}</div>))}
        {days.map((d, i) => {
          if (!d) return <div key={i} />;
          const dateKey = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
          const isSelected = value === dateKey;
          const hasData = transactions.some(t => t.date === dateKey);
          return (
            <div key={i} onClick={() => onDateClick(dateKey)} style={{ height: '30px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', borderRadius: '6px', fontSize: '0.75rem', position: 'relative', background: isSelected ? c.purple : 'transparent', color: isSelected ? '#fff' : c.text, transition: '0.2s' }}>
              {d} {hasData && !isSelected && (<div style={{ width: '4px', height: '4px', borderRadius: '50%', background: c.purple, position: 'absolute', bottom: '3px' }} />)}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default function DashboardPage() {
  const navigate = useNavigate();
  const [isDark] = useState(window.matchMedia('(prefers-color-scheme: dark)').matches);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAiReportOpen, setIsAiReportOpen] = useState(false);
  const [isPeriodModalOpen, setIsPeriodModalOpen] = useState(false);
  const [isCatModalOpen, setIsCatModalOpen] = useState(false);
  const [isNoteModalOpen, setIsNoteModalOpen] = useState(false);
  
  const [showSummary, setShowSummary] = useState(false);
  const [reportPeriod, setReportPeriod] = useState(null);
  const [notes, setNotes] = useState([]);
  const [editingNote, setEditingNote] = useState(null);
  const [filterDate, setFilterDate] = useState(new Date().toISOString().split('T')[0]);
  
  const [categories, setCategories] = useState({ expense: [], income: [] });
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [cats, txs, notesData] = await Promise.all([
          FinanceService.getCategories(),
          FinanceService.getTransactions(), // Загружаем все для "Последних операций"
          FinanceService.getNotes()
        ]);
        
        setCategories({
          expense: cats.filter(c => c.type === 'expense'),
          income: cats.filter(c => c.type === 'income')
        });
        setTransactions(txs);
        setNotes(notesData);
      } catch (err) {
        console.error("Ошибка при загрузке данных:", err);
      }
    };
    fetchData();
  }, []);

  const { register, handleSubmit, reset, watch, setValue } = useForm({
    defaultValues: { type: 'expense', date: new Date().toISOString().split('T')[0] }
  });

  const onSubmit = async (data) => {
    try {
      const response = await FinanceService.createTransaction({
        ...data,
        amount: Number(data.amount)
      });
      if (response.warning) alert(response.warning);
      setTransactions([response.transaction, ...transactions]);
      setIsModalOpen(false);
      reset();
    } catch (err) {
      alert("Ошибка при сохранении транзакции");
    }
  };

  const onNoteSubmit = async (data) => {
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

  const onNoteDelete = async (id) => {
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

  const c = {
    bg: isDark ? '#0a0a0a' : '#fafafa', card: isDark ? '#141414' : '#ffffff',
    text: isDark ? '#f5f5f5' : '#111111', muted: isDark ? '#888888' : '#666666',
    border: isDark ? '#2a2a2a' : '#e5e5e5', accent: isDark ? '#ffffff' : '#000000',
    purple: '#8b5cf6',
  };

  const s = {
    isDark,
    btn: { padding: '0.6rem 1rem', borderRadius: '8px', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', fontSize: '0.85rem', fontWeight: 600 },
    card: { background: c.card, border: `1px solid ${c.border}`, borderRadius: '14px', padding: '1.25rem' }
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

  const handleOpenReport = (period) => {
    setReportPeriod(period);
    setIsPeriodModalOpen(false);
    setShowSummary(true);
  };

  const totalBalance = transactions.reduce((acc, t) => acc + Number(t.amount), 0);

  // Сортировка для истории (сначала новые)
  const sortedTransactions = useMemo(() => {
    return [...transactions].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [transactions]);

  return (
    <div style={{ minHeight: '100vh', background: c.bg, color: c.text, fontFamily: 'system-ui, sans-serif' }}>
      {/* СТИКИ ШАПКА */}
      <nav style={{ 
        position: 'sticky', top: 0, zIndex: 100,
        background: c.bg + 'CC', backdropFilter: 'blur(10px)',
        padding: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center'
      }}>
        <div style={{ maxWidth: '900px', width: '100%', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ fontWeight: 800, fontSize: '1.1rem' }}>FinMath</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <button onClick={() => setIsModalOpen(true)} style={{ ...s.btn, background: c.accent, color: isDark ? '#000' : '#fff' }}><FaPlus size={12} /> Операция</button>
            <button style={s.btn} onClick={() => navigate('/profile')}><FaUser /> Профиль</button>
          </div>
        </div>
      </nav>

      <main style={{ maxWidth: '900px', margin: '2rem auto', padding: '0 1rem', display: 'grid', gridTemplateColumns: '1fr 320px', gap: '1.5rem', alignItems: 'start' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* БАЛАНС (можно тоже сделать sticky, если нужно) */}
          <div style={{ ...s.card, position: 'sticky', top: '80px', zIndex: 50 }}>
            <p style={{ color: c.muted, fontSize: '0.8rem', margin: '0 0 0.5rem 0' }}>ОБЩИЙ БАЛАНС</p>
            <h2 style={{ fontSize: '2rem', margin: 0, fontWeight: 800, color: totalBalance < 0 ? '#ef4444' : c.text }}>
              {totalBalance.toLocaleString()} ₽
            </h2>

            <div style={{ display: 'flex', gap: '1rem', marginTop: '1.25rem', borderTop: `1px solid ${c.border}`, paddingTop: '1.25rem' }}>
              {[
                { label: 'Неделя', days: 7 },
                { label: 'Месяц', days: 30 },
                { label: 'Год', days: 365 }
              ].map(period => {
                const now = new Date();
                const cutoff = new Date(now.setDate(now.getDate() - period.days));
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

        {/* СТИКИ БОКОВАЯ ПАНЕЛЬ */}
        <aside style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', position: 'sticky', top: '80px' }}>
          <CalendarNav 
            value={filterDate} 
            onChange={setFilterDate} 
            onDateClick={(date) => navigate(`/transactions?date=${date}`)}
            transactions={transactions} 
            c={c} 
          />
          <div style={s.card}>
             <h3 style={{ fontSize: '0.9rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><FaChartPie /> Аналитика</h3>
             <div style={{ height: '180px', position: 'relative' }}>
                <Doughnut data={chartData} options={{ maintainAspectRatio: false, cutout: '75%', plugins: { legend: { display: false } } }} />
             </div>
          </div>
          <div style={s.card}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3 style={{ fontSize: '0.9rem', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}><FaStickyNote size={14} /> Заметки</h3>
              <button onClick={() => { setEditingNote(null); setIsNoteModalOpen(true); }} style={{ background: 'none', border: 'none', color: c.purple, cursor: 'pointer' }}><FaPlus size={12} /></button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', maxHeight: '200px', overflowY: 'auto' }}>
              {notes.map(note => (
                <div key={note.id} onClick={() => { setEditingNote(note); setIsNoteModalOpen(true); }} style={{ padding: '0.75rem', borderRadius: '8px', background: 'rgba(255,255,255,0.03)', border: `1px solid ${c.border}`, cursor: 'pointer' }}>
                  <div style={{ fontSize: '0.8rem', fontWeight: 700, marginBottom: '2px' }}>{note.title}</div>
                  <div style={{ fontSize: '0.7rem', color: c.muted }}>{note.content}</div>
                </div>
              ))}
            </div>
          </div>
          <button onClick={() => setIsCatModalOpen(true)} style={{ ...s.btn, background: 'transparent', border: `1px solid ${c.border}`, color: c.text, width: '100%' }}><FaCog /> Настроить категории</button>
        </aside>
      </main>

      <TransactionModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSubmit={onSubmit} {...{ register, handleSubmit, watch, setValue, categories, s, c }} />
      <AiReportModal isOpen={isAiReportOpen} onClose={() => setIsAiReportOpen(false)} onGenerate={() => {}} loading={false} report={null} {...{ s, c }} />
      <ReportPeriodModal isOpen={isPeriodModalOpen} onClose={() => setIsPeriodModalOpen(false)} onSelect={handleOpenReport} c={c} s={s} />
      <CategorySettingsModal isOpen={isCatModalOpen} onClose={() => setIsCatModalOpen(false)} categories={categories} setCategories={setCategories} s={s} c={c} />
      <NoteModal isOpen={isNoteModalOpen} onClose={() => { setIsNoteModalOpen(false); setEditingNote(null); }} onSubmit={onNoteSubmit} onDelete={onNoteDelete} editNote={editingNote} c={c} s={s} />

      {showSummary && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 3000, background: c.bg, padding: '2rem', overflowY: 'auto' }}>
            <div style={{ maxWidth: '600px', margin: '0 auto' }}>
                <FinancialSummary period={reportPeriod} transactions={transactions} categories={categories} onBack={() => setShowSummary(false)} s={s} c={c} />
            </div>
        </div>
      )}
    </div>
  );
}