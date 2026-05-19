import React from 'react';
import { Link } from 'react-router-dom';
import { FaChartPie, FaRobot, FaCalculator, FaShieldAlt, FaSignInAlt, FaUserPlus } from 'react-icons/fa';

export default function HomePage() {
  const features = [
    {
      icon: <FaChartPie className="w-6 h-6 text-[#8b5cf6]" />,
      title: 'Учёт транзакций',
      description: 'Фиксируйте доходы и расходы, категоризируйте операции и отслеживайте динамику в реальном времени.'
    },
    {
      icon: <FaRobot className="w-6 h-6 text-[#8b5cf6]" />,
      title: 'ИИ-аналитика',
      description: 'Дефолтный агент работает сразу. Подключите свой API-ключ для расширенных прогнозов.'
    },
    {
      icon: <FaCalculator className="w-6 h-6 text-[#8b5cf6]" />,
      title: 'FinMath-расчёты',
      description: 'Точные финансовые формулы: сложные проценты, аннуитеты, инфляционная корректировка.'
    },
    {
      icon: <FaShieldAlt className="w-6 h-6 text-[#8b5cf6]" />,
      title: 'Приватность и контроль',
      description: 'Локальное хранение данных, клиентское шифрование ключей и полный контроль над экспортом.'
    }
  ];

  return (
    <div className="min-h-screen w-full bg-[#0a0a0a] text-[#f5f5f5] font-sans box-border">
      
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-[#2a2a2a] bg-[#0a0a0a]/80 backdrop-blur-md">
        <nav className="max-w-[1152px] mx-auto px-6 h-16 flex items-center justify-between box-border">
          <span className="text-xl font-extrabold tracking-tight text-[#f5f5f5]">FinMath</span>
          
          <div className="flex gap-3">
            <Link 
              to="/login" 
              className="btn-outline inline-flex items-center gap-2 text-sm font-semibold px-4 py-2 border border-[#2a2a2a] text-[#f5f5f5] bg-transparent hover:bg-[#141414] rounded-xl transition-all no-underline"
            >
              <FaSignInAlt className="w-4 h-4 text-[#888888]" />
              Войти
            </Link>
            <Link 
              to="/register" 
              className="btn-primary inline-flex items-center gap-2 text-sm font-bold px-4 py-2 bg-[#8b5cf6] hover:bg-[#7c3aed] text-white rounded-xl transition-all no-underline shadow-sm shadow-[#8b5cf6]/10"
            >
              <FaUserPlus className="w-4 h-4" />
              Регистрация
            </Link>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="max-w-[896px] mx-auto px-6 py-24 text-center box-border">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight mb-6 leading-[1.1] text-[#f5f5f5]">
          Финансы под контролем.<br />
          <span className="text-[#888888]">Аналитика — без границ.</span>
        </h1>
        
        <p className="text-lg md:text-xl text-[#888888] mb-10 max-w-[672px] mx-auto leading-relaxed">
          Современное веб-приложение для учёта личных финансов, интеллектуального анализа данных и точных математических расчётов.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link 
            to="/register" 
            className="btn-primary min-w-[200px] text-center font-bold px-6 py-3.5 bg-[#8b5cf6] hover:bg-[#7c3aed] text-white rounded-xl transition-all no-underline shadow-md shadow-[#8b5cf6]/20"
          >
            Начать бесплатно
          </Link>
          <Link 
            to="/dashboard" 
            className="btn-outline min-w-[200px] text-center font-semibold px-6 py-3.5 border border-[#2a2a2a] text-[#f5f5f5] bg-transparent hover:bg-[#141414] rounded-xl transition-all no-underline"
          >
            Демо-режим
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="max-w-[1152px] mx-auto px-6 py-16 box-border">
        <h2 className="text-3xl font-black text-center mb-16 tracking-tight text-[#f5f5f5]">
          Возможности
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className="card bg-[#141414] border border-[#2a2a2a] rounded-2xl p-6 relative box-border shadow-sm hover:border-[#3a3a3a] transition-all"
            >
              <div className="w-12 h-12 rounded-xl bg-[#8b5cf6]/10 flex items-center justify-center mb-5">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold mb-3 text-[#f5f5f5] tracking-tight">
                {feature.title}
              </h3>
              <p className="text-[#888888] leading-relaxed text-sm m-0">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#2a2a2a] py-8 text-center text-[#888888] text-sm box-border">
        <p className="m-0">© {new Date().getFullYear()} FinMath. Учебный проект</p>
      </footer>
      
    </div>
  );
}