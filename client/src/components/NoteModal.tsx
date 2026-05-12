import React, { useEffect } from "react";
import { FaTimes, FaSave } from "react-icons/fa";
import { useForm } from "react-hook-form";

export const NoteModal = ({ isOpen, onClose, onSubmit, editNote, c, s }) => {
  const { register, handleSubmit, reset, setValue } = useForm();

  // Если мы редактируем, подставляем старые данные при открытии
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
    <div style={modalOverlayStyle}>
      <div style={{ ...s.card, width: '400px', position: 'relative', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.3)' }}>
        <button onClick={onClose} style={closeBtnStyle}><FaTimes color={c.muted} /></button>
        
        <h3 style={{ margin: '0 0 1.5rem 0', fontSize: '1.1rem' }}>
          {editNote ? 'Редактировать заметку' : 'Новая заметка'}
        </h3>

        <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label style={labelStyle(c)}>Заголовок</label>
            <input 
              {...register("title", { required: true })}
              placeholder="Напр: Цель на отпуск"
              style={s.input}
            />
          </div>

          <div>
            <label style={labelStyle(c)}>Текст заметки</label>
            <textarea 
              {...register("content")}
              placeholder="Детали..."
              rows={4}
              style={{ ...s.input, resize: 'none', fontFamily: 'inherit' }}
            />
          </div>

          <button type="submit" style={{ ...s.btn, background: c.purple, color: '#fff', marginTop: '0.5rem' }}>
            <FaSave /> {editNote ? 'Сохранить' : 'Создать'}
          </button>
        </form>
      </div>
    </div>
  );
};

const modalOverlayStyle = {
  position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
  background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '1rem'
};

const closeBtnStyle = {
  position: 'absolute', top: '1.25rem', right: '1.25rem', background: 'none', border: 'none', cursor: 'pointer'
};

const labelStyle = (c) => ({
  display: 'block', fontSize: '0.75rem', color: c.muted, marginBottom: '0.5rem', fontWeight: 600
});