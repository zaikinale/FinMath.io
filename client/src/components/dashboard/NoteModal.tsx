import React, { useEffect } from 'react';
import { FaTimes, FaSave, FaTrash } from 'react-icons/fa';
import { useForm } from 'react-hook-form';
import { type Note, type ThemeColors, type ThemeStyles } from './dashboard.types';

interface NoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { title: string; content: string }) => void;
  onDelete: (id: string) => void;
  editNote: Note | null;
  c: ThemeColors;
  s: ThemeStyles;
}

export const NoteModal: React.FC<NoteModalProps> = ({ isOpen, onClose, onSubmit, onDelete, editNote, c, s }) => {
  const { register, handleSubmit, reset, setValue } = useForm<{ title: string; content: string }>();

  useEffect(() => {
    if (editNote) {
      setValue("title", editNote.title);
      setValue("content", editNote.content || "");
    } else {
      reset({ title: "", content: "" });
    }
  }, [editNote, isOpen, setValue, reset]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 dark:bg-black/80 backdrop-blur-sm flex items-center justify-center z-[1000] p-4 box-border">
      
      {/* Контейнер карточки */}
      <div className="w-full max-w-[400px] bg-white dark:bg-[#141414] border border-[#e5e5e5] dark:border-[#2a2a2a] p-6 rounded-3xl relative box-border shadow-2xl">
        
        {/* Кнопка закрытия */}
        <button 
          onClick={onClose} 
          className="absolute top-5 right-5 bg-none border-none cursor-pointer text-[#666666] dark:text-[#999999] hover:opacity-80 transition-opacity p-1 flex items-center justify-center"
        >
          <FaTimes className="w-4 h-4" />
        </button>

        {/* Заголовок модалки */}
        <h3 className="m-0 mb-5 text-base font-bold text-neutral-900 dark:text-white tracking-tight">
          {editNote ? 'Правка заметки' : 'Новая заметка'}
        </h3>

        {/* Форма */}
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 w-full box-border">
          
          <input 
            {...register("title", { required: true })} 
            placeholder="Заголовок" 
            className="w-full px-4 py-3 bg-neutral-50 dark:bg-white/5 text-neutral-900 dark:text-white border border-solid border-[#e5e5e5] dark:border-[#2a2a2a] rounded-xl text-xs font-semibold outline-none box-border transition-colors focus:border-violet-500"
          />
          
          <textarea 
            {...register("content")} 
            placeholder="Текст заметки..." 
            rows={4} 
            className="w-full px-4 py-3 bg-neutral-50 dark:bg-white/5 text-neutral-900 dark:text-white border border-solid border-[#e5e5e5] dark:border-[#2a2a2a] rounded-xl text-xs font-semibold outline-none box-border resize-none transition-colors focus:border-violet-500"
          />

          {/* Кнопки управления */}
          <div className="flex gap-2 w-full mt-1 box-border">
            <button 
              type="submit" 
              className="flex-1 h-11 bg-violet-600 hover:bg-violet-500 text-white font-bold text-xs border-none rounded-xl cursor-pointer flex items-center justify-center gap-2 transition-colors shadow-sm shadow-violet-500/10"
            >
              <FaSave className="w-3.5 h-3.5" /> Сохранить
            </button>
            
            {editNote && (
               <button 
                 type="button" 
                 onClick={() => onDelete(editNote.id)} 
                 className="w-11 h-11 bg-red-500 hover:bg-red-600 text-white border-none rounded-xl cursor-pointer flex items-center justify-center transition-colors flex-shrink-0"
               >
                 <FaTrash className="w-3.5 h-3.5" />
               </button>
            )}
          </div>

        </form>
      </div>
    </div>
  );
};