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
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '1rem' }}>
      <div style={{ ...s.card, width: '100%', maxWidth: '400px', position: 'relative' }}>
        <button onClick={onClose} style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'none', border: 'none', cursor: 'pointer', color: c.muted }}><FaTimes /></button>
        <h3 style={{ margin: '0 0 1.5rem 0' }}>{editNote ? 'Правка заметки' : 'Новая заметка'}</h3>
        <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <input {...register("title", { required: true })} placeholder="Заголовок" style={{ ...s.card, padding: '0.75rem', background: 'rgba(255,255,255,0.05)', border: `1px solid ${c.border}`, color: c.text } as React.CSSProperties} />
          <textarea {...register("content")} placeholder="Текст заметки..." rows={4} style={{ ...s.card, padding: '0.75rem', background: 'rgba(255,255,255,0.05)', border: `1px solid ${c.border}`, color: c.text, resize: 'none' } as React.CSSProperties} />
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