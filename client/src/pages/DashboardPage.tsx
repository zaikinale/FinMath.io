import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { 
  FaArrowLeft, FaWallet, FaArrowUp, FaArrowDown, FaChartPie, FaCalendarAlt, 
  FaFileDownload, FaChevronLeft, FaChevronRight, FaPlus, FaList, FaHome, 
  FaUser, FaTimes, FaTags, FaEdit, FaTrash, FaCheck, FaReceipt, FaCog 
} from 'react-icons/fa';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

// Схемы валидации
const catSchema = z.object({ name: z.string().min(2, 'Мин. 2 символа'), type: z.enum(['income', 'expense']) });
const tagSchema = z.object({ name: z.string().min(2, 'Мин. 2 символа') });
const txSchema = z.object({
  amount: z.coerce.number().positive('Сумма > 0'),
  type: z.enum(['income', 'expense']),
  categoryId: z.string().min(1, 'Выберите категорию'),
  date: z.string().min(1, 'Укажите дату'),
  desc: z.string().max(50).optional()
});

type CatInput = z.infer<typeof catSchema>;
type TagInput = z.infer<typeof tagSchema>;
type TxInput = z.infer<typeof txSchema>;

type Category = { id: string; name: string; type: 'income' | 'expense'; tags: string[] };
type Tag = { id: string; name: string };
type Transaction = { id: string; amount: number; type: 'income' | 'expense'; categoryId: string; tags: string[]; date: string; desc: string };

export default function DashboardPage() {
  const navigate = useNavigate();
  const [isDark, setIsDark] = useState(window.matchMedia('(prefers-color-scheme: dark)').matches);
  const [reportLoading, setReportLoading] = useState(false);
  const [txLoading, setTxLoading] = useState(false);

  // Модальное окно
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalTab, setModalTab] = useState<'categories' | 'transactions' | 'tags'>('categories');

  useEffect(() => {
    const media = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = (e: MediaQueryListEvent) => setIsDark(e.matches);
    media.addEventListener('change', handler);
    return () => media.removeEventListener('change', handler);
  }, []);

  // Палитра
  const c = {
    bg: isDark ? '#0a0a0a' : '#fafafa', card: isDark ? '#141414' : '#ffffff',
    text: isDark ? '#f5f5f5' : '#111111', muted: isDark ? '#999999' : '#666666',
    border: isDark ? '#2a2a2a' : '#e5e5e5', accent: isDark ? '#ffffff' : '#000000',
    accentText: isDark ? '#0a0a0a' : '#ffffff', green: '#16a34a', red: '#dc2626',
    inputBg: isDark ? '#1a1a1a' : '#ffffff', overlay: isDark ? 'rgba(0,0,0,0.7)' : 'rgba(0,0,0,0.4)'
  };

  // Данные (локальное состояние)
  const [categories, setCategories] = useState<Category[]>([
    { id: '1', name: 'Еда', type: 'expense', tags: ['быт'] },
    { id: '2', name: 'Зарплата', type: 'income', tags: ['работа'] },
    { id: '3', name: 'Такси', type: 'expense', tags: ['транспорт'] }
  ]);
  const [tags, setTags] = useState<Tag[]>([
    { id: 't1', name: 'быт' }, { id: 't2', name: 'работа' }, { id: 't3', name: 'транспорт' }
  ]);
  const [transactions, setTransactions] = useState<Transaction[]>([
    { id: 'tx1', amount: -3200, type: 'expense', categoryId: '1', tags: ['быт'], date: '2026-05-05', desc: 'Продукты' },
    { id: 'tx2', amount: 85000, type: 'income', categoryId: '2', tags: ['работа'], date: '2026-05-04', desc: 'Аванс' }
  ]);

  // Формы
  const catForm = useForm<CatInput>({ resolver: zodResolver(catSchema), defaultValues: { name: '', type: 'expense' } });
  const tagForm = useForm<TagInput>({ resolver: zodResolver(tagSchema), defaultValues: { name: '' } });
  const txForm = useForm<TxInput>({ resolver: zodResolver(txSchema), defaultValues: { type: 'expense', date: new Date().toISOString().split('T')[0], categoryId: '', amount: 0 } });

  // Состояния редактирования
  const [editCatId, setEditCatId] = useState<string | null>(null);
  const [editTxId, setEditTxId] = useState<string | null>(null);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  // Хендлеры CRUD
  const handleCatSubmit = catForm.handleSubmit((data) => {
    if (editCatId) {
      setCategories(prev => prev.map(cat => cat.id === editCatId ? { ...cat, ...data, tags: selectedTags } : cat));
      setEditCatId(null);
    } else {
      setCategories(prev => [...prev, { id: crypto.randomUUID(), ...data, tags: selectedTags }]);
    }
    catForm.reset(); setSelectedTags([]);
  });

  const handleTagSubmit = tagForm.handleSubmit((data) => {
    if (!tags.some(t => t.name === data.name)) {
      setTags(prev => [...prev, { id: crypto.randomUUID(), ...data }]);
      tagForm.reset();
    }
  });

  const handleTxSubmit = txForm.handleSubmit((data) => {
    if (editTxId) {
      setTransactions(prev => prev.map(tx => tx.id === editTxId ? { ...tx, ...data, tags: selectedTags } : tx));
      setEditTxId(null);
    } else {
      setTransactions(prev => [...prev, { id: crypto.randomUUID(), ...data, tags: selectedTags }]);
    }
    txForm.reset(); setSelectedTags([]); setTxLoading(false);
  });

  const toggleTag = (tag: string) => {
    setSelectedTags(prev => prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]);
  };

  // Стили
  const inputStyle: React.CSSProperties = { width: '100%', padding: '0.6rem 0.8rem', background: c.inputBg, border: `1px solid ${c.border}`, borderRadius: '8px', color: c.text, fontSize: '0.85rem', outline: 'none', boxSizing: 'border-box', fontFamily: 'inherit' };
  const btnPrimary: React.CSSProperties = { padding: '0.6rem 1rem', background: c.accent, color: c.accentText, border: 'none', borderRadius: '8px', fontSize: '0.85rem', fontWeight: 500, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '0.4rem' };
  const btnGhost: React.CSSProperties = { background: 'none', border: `1px solid ${c.border}`, color: c.text, padding: '0.4rem 0.6rem', borderRadius: '6px', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.8rem' };
  const tagPill: React.CSSProperties = { padding: '0.3rem 0.6rem', borderRadius: '20px', fontSize: '0.75rem', cursor: 'pointer', border: `1px solid ${c.border}`, background: 'transparent', color: c.muted, transition: 'all 0.2s' };
  const tagPillActive: React.CSSProperties = { ...tagPill, background: c.accent, color: c.accentText, borderColor: c.accent };

  // Календарь
  const today = new Date();
  const [calMonth, setCalMonth] = useState(today.getMonth());
  const [calYear, setCalYear] = useState(today.getFullYear());
  const daysInMonth = new Date(calYear, calMonth + 1, 0).getDate();
  const firstDay = new Date(calYear, calMonth, 1).getDay() || 7;
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const blanks = Array.from({ length: firstDay - 1 }, (_, i) => i);

  const stats = [
    { label: 'Баланс', value: '₽ 142 500', icon: <FaWallet />, color: c.text },
    { label: 'Доходы', value: '₽ 85 000', icon: <FaArrowUp />, color: c.green },
    { label: 'Расходы', value: '₽ 42 300', icon: <FaArrowDown />, color: c.red },
  ];

  const chartData = {
    labels: ['Еда', 'Транспорт', 'Развлечения', 'Подписки', 'Прочее'],
    datasets: [{ data: [35, 20, 15, 10, 20], backgroundColor: [c.accent, c.muted, `${c.muted}99`, `${c.muted}66`, `${c.muted}33`], borderWidth: 0 }]
  };

  return (
    <div style={{ minHeight: '100vh', background: c.bg, color: c.text, fontFamily: 'system-ui, -apple-system, sans-serif', paddingBottom: '2rem', transition: 'background 0.3s, color 0.3s' }}>
      {/* Навигация */}
      <nav style={{ position: 'sticky', top: 0, zIndex: 10, background: `${c.bg}ee`, backdropFilter: 'blur(8px)', borderBottom: `1px solid ${c.border}`, padding: '0.8rem 1rem' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <button onClick={() => navigate('/')} style={{ background: 'none', border: 'none', color: c.muted, cursor: 'pointer', padding: 0, display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem' }}><FaArrowLeft /> Назад</button>
            <span style={{ fontWeight: 700, fontSize: '1.1rem' }}>FinTrack</span>
          </div>
          <div style={{ display: 'flex', gap: '1.2rem', fontSize: '0.85rem' }}>
            <a href="#stats" style={{ color: c.muted, textDecoration: 'none' }}>Обзор</a>
            <a href="#add-tx" style={{ color: c.muted, textDecoration: 'none' }}>Добавить</a>
            <button onClick={() => setIsModalOpen(true)} style={{ background: 'none', border: 'none', color: c.muted, cursor: 'pointer', padding: 0, display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
              <FaCog /> Управление
            </button>
            <Link to="/profile" style={{ color: c.muted, textDecoration: 'none' }}><FaUser /></Link>
          </div>
        </div>
      </nav>

      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '1.5rem 1rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {/* Статистика */}
        <section id="stats" style={{ scrollMarginTop: '70px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
          {stats.map((s, i) => (
            <div key={i} style={{ background: c.card, border: `1px solid ${c.border}`, borderRadius: '14px', padding: '1.25rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: c.bg, border: `1px solid ${c.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: s.color }}>{s.icon}</div>
              <div><p style={{ fontSize: '0.8rem', color: c.muted, margin: 0 }}>{s.label}</p><p style={{ fontSize: '1.2rem', fontWeight: 600, margin: '0.2rem 0 0', color: s.color }}>{s.value}</p></div>
            </div>
          ))}
        </section>

        {/* Форма добавления */}
        <section id="add-tx" style={{ scrollMarginTop: '70px', background: c.card, border: `1px solid ${c.border}`, borderRadius: '14px', padding: '1.25rem' }}>
          <h3 style={{ fontSize: '0.95rem', fontWeight: 600, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><FaPlus style={{ color: c.muted }} /> Быстрая операция</h3>
          <form onSubmit={txForm.handleSubmit((data) => { setTxLoading(true); setTimeout(() => handleTxSubmit(data), 600); })} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '0.8rem', alignItems: 'end' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', color: c.muted, marginBottom: '0.3rem' }}>Сумма</label>
              <input type="number" step="0.01" {...txForm.register('amount')} style={inputStyle} placeholder="0.00" />
              {txForm.formState.errors.amount && <span style={{ color: c.red, fontSize: '0.72rem' }}>{txForm.formState.errors.amount.message}</span>}
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', color: c.muted, marginBottom: '0.3rem' }}>Тип</label>
              <select {...txForm.register('type')} style={inputStyle}><option value="expense">Расход</option><option value="income">Доход</option></select>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', color: c.muted, marginBottom: '0.3rem' }}>Категория</label>
              <select {...txForm.register('categoryId')} style={inputStyle}>
                <option value="">Выберите...</option>
                {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
              </select>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', color: c.muted, marginBottom: '0.3rem' }}>Дата</label>
              <input type="date" {...txForm.register('date')} style={inputStyle} />
            </div>
            <button type="submit" disabled={txLoading} style={{ ...btnPrimary, opacity: txLoading ? 0.6 : 1, height: '38px', justifyContent: 'center' }}>
              {txLoading ? '...' : 'Сохранить'}
            </button>
          </form>
        </section>

        {/* График + Календарь */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
          <div style={{ background: c.card, border: `1px solid ${c.border}`, borderRadius: '14px', padding: '1.25rem' }}>
            <h3 style={{ fontSize: '0.95rem', fontWeight: 600, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><FaChartPie style={{ color: c.muted }} /> Расходы</h3>
            <div style={{ height: '220px' }}><Pie key={isDark ? 'd' : 'l'} data={chartData} options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'bottom', labels: { color: c.muted } } } }} /></div>
          </div>
          <div style={{ background: c.card, border: `1px solid ${c.border}`, borderRadius: '14px', padding: '1.25rem' }}>
            <h3 style={{ fontSize: '0.95rem', fontWeight: 600, marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><FaCalendarAlt style={{ color: c.muted }} /> Календарь</h3>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
              <button onClick={() => setCalMonth(m => m === 0 ? 11 : m - 1)} style={{ background: 'none', border: 'none', color: c.muted, cursor: 'pointer' }}><FaChevronLeft /></button>
              <span style={{ fontSize: '0.9rem', fontWeight: 500 }}>{new Date(calYear, calMonth).toLocaleString('ru', { month: 'long', year: 'numeric' })}</span>
              <button onClick={() => setCalMonth(m => m === 11 ? 0 : m + 1)} style={{ background: 'none', border: 'none', color: c.muted, cursor: 'pointer' }}><FaChevronRight /></button>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', textAlign: 'center', gap: '0.2rem', fontSize: '0.72rem', color: c.muted, marginBottom: '0.4rem' }}>
              {['Пн','Вт','Ср','Чт','Пт','Сб','Вс'].map(d => <span key={d}>{d}</span>)}
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', textAlign: 'center', gap: '0.2rem', fontSize: '0.85rem' }}>
              {blanks.map(b => <span key={`b${b}`} style={{ opacity: 0 }}></span>)}
              {days.map(d => <button key={d} onClick={() => navigate(`/transactions?from=${calYear}-${String(calMonth+1).padStart(2,'0')}-${String(d).padStart(2,'0')}&to=${calYear}-${String(calMonth+1).padStart(2,'0')}-${String(d).padStart(2,'0')}`)} style={{ width: '100%', aspectRatio: '1', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', borderRadius: '6px', cursor: 'pointer', border: 'none', background: d === today.getDate() && calMonth === today.getMonth() ? c.accent : 'transparent', color: d === today.getDate() && calMonth === today.getMonth() ? c.accentText : c.text }}>{d}</button>)}
            </div>
          </div>
        </div>

        {/* История */}
        <section id="history" style={{ scrollMarginTop: '70px', background: c.card, border: `1px solid ${c.border}`, borderRadius: '14px', padding: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h3 style={{ fontSize: '0.95rem', fontWeight: 600, margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}><FaList style={{ color: c.muted }} /> Последние операции</h3>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {transactions.slice(0, 5).map(tx => (
              <div key={tx.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem', background: c.bg, borderRadius: '10px', border: `1px solid ${c.border}` }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: c.card, border: `1px solid ${c.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: c.muted, fontSize: '0.8rem' }}>{tx.desc?.[0] || '?'}</div>
                  <div><p style={{ fontSize: '0.9rem', fontWeight: 500, margin: 0 }}>{tx.desc || categories.find(cat => cat.id === tx.categoryId)?.name || 'Операция'}</p><p style={{ fontSize: '0.75rem', color: c.muted, margin: '0.15rem 0 0' }}>{tx.date}</p></div>
                </div>
                <span style={{ fontSize: '0.95rem', fontWeight: 600, color: tx.amount > 0 ? c.green : c.text }}>{tx.amount > 0 ? '+' : ''}{tx.amount.toLocaleString('ru-RU')} ₽</span>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* === МОДАЛЬНОЕ ОКНО УПРАВЛЕНИЯ === */}
      {isModalOpen && (
        <div style={{ position: 'fixed', inset: 0, background: c.overlay, backdropFilter: 'blur(4px)', zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }} onClick={() => setIsModalOpen(false)}>
          <div style={{ width: '100%', maxWidth: '600px', maxHeight: '85vh', background: c.card, border: `1px solid ${c.border}`, borderRadius: '16px', display: 'flex', flexDirection: 'column', overflow: 'hidden' }} onClick={e => e.stopPropagation()}>
            {/* Хедер модалки */}
            <div style={{ padding: '1rem 1.25rem', borderBottom: `1px solid ${c.border}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2 style={{ fontSize: '1.1rem', fontWeight: 700, margin: 0 }}>Управление данными</h2>
              <button onClick={() => setIsModalOpen(false)} style={{ background: 'none', border: 'none', color: c.muted, cursor: 'pointer', fontSize: '1.2rem', padding: '0.2rem' }}><FaTimes /></button>
            </div>

            {/* Табы */}
            <div style={{ display: 'flex', borderBottom: `1px solid ${c.border}`, padding: '0 1.25rem' }}>
              {(['categories', 'transactions', 'tags'] as const).map(tab => (
                <button key={tab} onClick={() => setModalTab(tab)} style={{ padding: '0.8rem 1rem', background: 'none', border: 'none', borderBottom: modalTab === tab ? `2px solid ${c.accent}` : '2px solid transparent', color: modalTab === tab ? c.text : c.muted, fontWeight: modalTab === tab ? 600 : 400, cursor: 'pointer', fontSize: '0.9rem', transition: 'all 0.2s' }}>
                  {tab === 'categories' ? 'Категории' : tab === 'transactions' ? 'Транзакции' : 'Теги'}
                </button>
              ))}
            </div>

            {/* Контент */}
            <div style={{ padding: '1.25rem', overflowY: 'auto', flex: 1 }}>
              
              {/* Категории */}
              {modalTab === 'categories' && (
                <div>
                  <form onSubmit={handleCatSubmit} style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
                    <input {...catForm.register('name')} placeholder="Название" style={{ ...inputStyle, flex: 1 }} />
                    <select {...catForm.register('type')} style={{ ...inputStyle, width: '100px' }}>
                      <option value="expense">Расход</option><option value="income">Доход</option>
                    </select>
                    <button type="submit" style={btnPrimary}><FaPlus /></button>
                  </form>
                  {catForm.formState.errors.name && <p style={{ color: c.red, fontSize: '0.75rem', marginBottom: '0.5rem' }}>{catForm.formState.errors.name.message}</p>}
                  
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    {categories.map(cat => (
                      <div key={cat.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.6rem', background: c.bg, borderRadius: '8px', border: `1px solid ${c.border}` }}>
                        <div>
                          <span style={{ fontWeight: 500, fontSize: '0.9rem' }}>{cat.name}</span>
                          <span style={{ fontSize: '0.7rem', color: c.muted, marginLeft: '0.5rem' }}>({cat.type === 'income' ? 'Доход' : 'Расход'})</span>
                          <div style={{ display: 'flex', gap: '0.3rem', marginTop: '0.3rem' }}>
                            {cat.tags.map(t => <span key={t} style={{ ...tagPill, fontSize: '0.65rem', padding: '0.15rem 0.4rem' }}>#{t}</span>)}
                          </div>
                        </div>
                        <div style={{ display: 'flex', gap: '0.4rem' }}>
                          <button onClick={() => { setEditCatId(editCatId === cat.id ? null : cat.id); catForm.reset({ name: cat.name, type: cat.type }); setSelectedTags(cat.tags); }} style={{ ...btnGhost, color: editCatId === cat.id ? c.accent : c.muted }}>{editCatId === cat.id ? <FaCheck /> : <FaEdit />}</button>
                          <button onClick={() => setCategories(prev => prev.filter(x => x.id !== cat.id))} style={{ ...btnGhost, color: c.red }}><FaTrash /></button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Транзакции */}
              {modalTab === 'transactions' && (
                <div>
                  <form onSubmit={handleTxSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', marginBottom: '1rem' }}>
                    <input type="number" {...txForm.register('amount')} placeholder="Сумма" style={inputStyle} />
                    <select {...txForm.register('type')} style={inputStyle}><option value="expense">Расход</option><option value="income">Доход</option></select>
                    <select {...txForm.register('categoryId')} style={inputStyle}>
                      <option value="">Категория</option>
                      {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
                    </select>
                    <input type="date" {...txForm.register('date')} style={inputStyle} />
                    <input {...txForm.register('desc')} placeholder="Описание" style={{ ...inputStyle, gridColumn: '1 / -1' }} />
                    <button type="submit" style={{ ...btnPrimary, gridColumn: '1 / -1', justifyContent: 'center' }}><FaPlus /> Добавить</button>
                  </form>
                  {txForm.formState.errors.amount && <p style={{ color: c.red, fontSize: '0.75rem' }}>{txForm.formState.errors.amount.message}</p>}

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    {transactions.map(tx => (
                      <div key={tx.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.6rem', background: c.bg, borderRadius: '8px', border: `1px solid ${c.border}` }}>
                        <div>
                          <span style={{ fontWeight: 500, fontSize: '0.9rem' }}>{tx.desc || categories.find(cat => cat.id === tx.categoryId)?.name}</span>
                          <span style={{ fontSize: '0.8rem', color: tx.amount > 0 ? c.green : c.text, marginLeft: '0.5rem' }}>{tx.amount > 0 ? '+' : ''}{tx.amount} ₽</span>
                          <div style={{ display: 'flex', gap: '0.3rem', marginTop: '0.3rem' }}>
                            {tx.tags.map(t => <span key={t} style={{ ...tagPill, fontSize: '0.65rem', padding: '0.15rem 0.4rem' }}>#{t}</span>)}
                          </div>
                        </div>
                        <button onClick={() => setTransactions(prev => prev.filter(x => x.id !== tx.id))} style={{ ...btnGhost, color: c.red }}><FaTrash /></button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Теги */}
              {modalTab === 'tags' && (
                <div>
                  <form onSubmit={handleTagSubmit} style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
                    <input {...tagForm.register('name')} placeholder="Новый тег" style={{ ...inputStyle, flex: 1 }} />
                    <button type="submit" style={btnPrimary}><FaPlus /></button>
                  </form>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                    {tags.map(tag => (
                      <div key={tag.id} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', padding: '0.4rem 0.8rem', background: c.bg, borderRadius: '20px', border: `1px solid ${c.border}` }}>
                        <span style={{ fontSize: '0.85rem' }}>#{tag.name}</span>
                        <button onClick={() => setTags(prev => prev.filter(t => t.id !== tag.id))} style={{ background: 'none', border: 'none', color: c.muted, cursor: 'pointer', padding: 0, display: 'flex' }}><FaTimes style={{ width: '12px', height: '12px' }} /></button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>
          </div>
        </div>
      )}
    </div>
  );
}