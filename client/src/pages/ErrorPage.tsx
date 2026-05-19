import { Link, useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaHome, FaExclamationTriangle } from 'react-icons/fa';

export default function ErrorPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center px-4 py-8 bg-[#fafafa] dark:bg-[#0a0a0a] text-[#111111] dark:text-[#f5f5f5] font-sans text-center transition-colors duration-300 relative box-border">
      
      {/* Кнопка назад в верхнем углу */}
      <button
        type="button"
        onClick={() => navigate(-1)}
        className="absolute top-6 left-6 inline-flex items-center gap-1.5 bg-transparent border-none text-[#666666] dark:text-[#999999] hover:opacity-80 text-sm font-medium cursor-pointer p-0 transition-opacity"
      >
        <FaArrowLeft className="w-3.5 h-3.5" /> Назад
      </button>

      {/* Иконка */}
      <div className="mb-6 text-[#666666] dark:text-[#999999]">
        <FaExclamationTriangle className="w-12 h-12" />
      </div>

      {/* Код ошибки */}
      <h1 className="text-6xl sm:text-7xl md:text-8xl font-black leading-none m-0 tracking-tighter text-black dark:text-white">
        404
      </h1>

      {/* Заголовок */}
      <h2 className="text-2xl font-bold mt-2 mb-3 tracking-tight">
        Страница не найдена
      </h2>

      {/* Описание */}
      <p className="text-[#666666] dark:text-[#999999] text-base max-w-[420px] mx-auto mb-8 leading-relaxed">
        Возможно, ссылка устарела, страница была удалена или вы ввели неверный адрес.
      </p>

      {/* Кнопки действий */}
      <div className="flex gap-4 flex-wrap justify-center">
        <Link
          to="/"
          className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-black dark:bg-white text-white dark:text-[#0a0a0a] font-medium text-sm rounded-xl no-underline hover:opacity-90 transition-opacity"
        >
          <FaHome className="w-3.5 h-3.5" /> На главную
        </Link>
        
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-transparent border border-[#e5e5e5] dark:border-[#2a2a2a] text-[#111111] dark:text-[#f5f5f5] font-medium text-sm rounded-xl cursor-pointer hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
        >
          Вернуться назад
        </button>
      </div>

      {/* Футер-подсказка */}
      <p className="absolute bottom-6 text-[#666666] dark:text-[#999999] text-xs m-0">
        © {new Date().getFullYear()} FinTrack
      </p>
    </div>
  );
}