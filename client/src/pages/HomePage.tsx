import { Link } from 'react-router-dom';
import { FaChartPie, FaRobot, FaCalculator, FaShieldAlt, FaSignInAlt, FaUserPlus } from 'react-icons/fa';

export default function HomePage() {
  const features = [
    {
      icon: <FaChartPie className="w-6 h-6" />,
      title: 'Учёт транзакций',
      description: 'Фиксируйте доходы и расходы, категоризируйте операции и отслеживайте динамику в реальном времени.'
    },
    {
      icon: <FaRobot className="w-6 h-6" />,
      title: 'ИИ-аналитика',
      description: 'Дефолтный агент работает сразу. Подключите свой API-ключ для расширенных прогнозов.'
    },
    {
      icon: <FaCalculator className="w-6 h-6" />,
      title: 'FinMath-расчёты',
      description: 'Точные финансовые формулы: сложные проценты, аннуитеты, инфляционная корректировка.'
    },
    {
      icon: <FaShieldAlt className="w-6 h-6" />,
      title: 'Приватность и контроль',
      description: 'Локальное хранение данных, клиентское шифрование ключей и полный контроль над экспортом.'
    }
  ];

  return (
    <div style={{ minHeight: '100vh' }}>
      {/* Header */}
      <header style={{
        position: 'sticky',
        top: 0,
        zIndex: 10,
        borderBottom: `1px solid var(--border)`,
        backgroundColor: 'var(--bg-primary)',
        backdropFilter: 'blur(8px)'
      }}>
        <nav style={{
          maxWidth: '72rem',
          margin: '0 auto',
          padding: '0 1.5rem',
          height: '4rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <span style={{ fontSize: '1.25rem', fontWeight: 700, letterSpacing: '-0.025em' }}>FinMath</span>
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <Link 
              to="/login" 
              className="btn-outline"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', padding: '0.5rem 1rem' }}
            >
              <FaSignInAlt className="w-4 h-4" />
              Войти
            </Link>
            <Link 
              to="/register" 
              className="btn-primary"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', padding: '0.5rem 1rem' }}
            >
              <FaUserPlus className="w-4 h-4" />
              Регистрация
            </Link>
          </div>
        </nav>
      </header>

      {/* Hero */}
      <section style={{
        maxWidth: '56rem',
        margin: '0 auto',
        padding: '6rem 1.5rem',
        textAlign: 'center'
      }}>
        <h1 style={{
          fontSize: 'clamp(2.5rem, 5vw, 3.75rem)',
          fontWeight: 700,
          letterSpacing: '-0.025em',
          marginBottom: '1.5rem',
          lineHeight: 1.1
        }}>
          Финансы под контролем.<br />
          <span style={{ color: 'var(--text-secondary)' }}>Аналитика — без границ.</span>
        </h1>
        <p style={{
          fontSize: '1.125rem',
          color: 'var(--text-secondary)',
          marginBottom: '2.5rem',
          maxWidth: '42rem',
          margin: '0 auto 2.5rem',
          lineHeight: 1.75
        }}>
          Современное веб-приложение для учёта личных финансов, интеллектуального анализа данных и точных математических расчётов.
        </p>
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
          justifyContent: 'center',
          alignItems: 'center'
        }}>
          <Link to="/register" className="btn-primary" style={{ minWidth: '200px' }}>
            Начать бесплатно
          </Link>
          <Link to="/dashboard" className="btn-outline" style={{ minWidth: '200px' }}>
            Демо-режим
          </Link>
        </div>
      </section>

      {/* Features */}
      <section style={{
        maxWidth: '72rem',
        margin: '0 auto',
        padding: '4rem 1.5rem'
      }}>
        <h2 style={{
          fontSize: '1.875rem',
          fontWeight: 700,
          textAlign: 'center',
          marginBottom: '4rem',
          letterSpacing: '-0.025em'
        }}>Возможности</h2>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '1.5rem'
        }}>
          {features.map((feature, index) => (
            <div key={index} className="card" style={{ position: 'relative' }}>
              <div className="icon-wrapper" style={{ marginBottom: '1.25rem' }}>
                {feature.icon}
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '0.75rem' }}>
                {feature.title}
              </h3>
              <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, fontSize: '0.95rem' }}>
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer style={{
        borderTop: `1px solid var(--border)`,
        padding: '2rem 1.5rem',
        textAlign: 'center',
        color: 'var(--text-secondary)',
        fontSize: '0.875rem'
      }}>
        <p>© {new Date().getFullYear()} FinMath. Учебный проект</p>
      </footer>
    </div>
  );
}