import { $api } from './axios.js';

export const FinanceService = {
  // Категории
  async getCategories() {
    const { data } = await $api.get('/categories');
    return data;
  },

  // Транзакции за конкретную дату
  async getTransactions(date?: string) {
    const { data } = await $api.get('/transactions', { params: { date } });
    return data;
  },

  // Создание транзакции
  async createTransaction(payload: any) {
    const { data } = await $api.post('/transactions', payload);
    return data; // Вернет { transaction, warning }
  },

  // Получение данных для графиков
  async getReport(start: string, end: string) {
    const { data } = await $api.get('/reports', { params: { start, end } });
    return data;
  },

  async getNotes() {
    const { data } = await $api.get('/notes');
    return data;
  },
  async createNote(payload: { title: string, content: string }) {
    const { data } = await $api.post('/notes', payload);
    return data;
  },
  async updateNote(id: string, payload: { title: string, content: string }) {
    const { data } = await $api.patch(`/notes/${id}`, payload);
    return data;
  },
  async deleteNote(id: string) {
    await $api.delete(`/notes/${id}`);
  },

    async getCategories() {
    const { data } = await $api.get('/categories');
    return data;
  },

  // 2. Создание категории
    async createCategory(payload: { name: string, type: 'expense' | 'income' }) {
    const { data } = await $api.post('/categories', payload);
    return data;
  },

  // 3. Обновление категории (лимита)
    async updateCategory(id: string, payload: { limit: number | null }) {
    const { data } = await $api.patch(`/categories/${id}`, payload);
    return data;
  },

  // 4. Удаление категории
    async deleteCategory(id: string) {
    await $api.delete(`/categories/${id}`);
  }
};