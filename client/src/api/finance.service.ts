import { $api } from './axios.js';

export const FinanceService = {
  // === Категории ===
  async getCategories() {
    const { data } = await $api.get('/categories');
    return data;
  },

  async createCategory(payload: { name: string, type: 'expense' | 'income' }) {
    const { data } = await $api.post('/categories', payload);
    return data;
  },

  async updateCategory(id: string, payload: { limit: number | null }) {
    const { data } = await $api.patch(`/categories/${id}`, payload);
    return data;
  },

  async deleteCategory(id: string) {
    await $api.delete(`/categories/${id}`);
  },

  // === Транзакции ===
  async getTransactions(date?: string) {
    const { data } = await $api.get('/transactions', { params: { date } });
    return data;
  },

  async createTransaction(payload: any) {
    const { data } = await $api.post('/transactions', payload);
    return data; // Вернет { transaction, warning }
  },

  // === Графики и отчетность ===
  async getReport(start: string, end: string) {
    const { data } = await $api.get('/reports', { params: { start, end } });
    return data;
  },

  // === Пользовательские заметки ===
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

  // === ИИ-Аналитика и Профиль ===
  // 1. Запрос на получение ИИ-аналитики за период (слегка поправил деструктуризацию под твой бэк, который возвращает { report })
  async getAiAnalytics(startDate: string, endDate: string) {
    const { data } = await $api.get('/ai/analytics', {
      params: { startDate, endDate }
    });
    return data; // Вернет { report: "#### Общее состояние..." }
  },

  // 2. Запрос на обновление профиля (для сохранения ключа OpenRouter)
  async updateProfile(payload: { aiApiKey: string }) {
    const { data } = await $api.patch('/auth/profile', payload); 
    return data;
  },

  // 3. НОВЫЙ: Сохранение сгенерированного отчета в историю
  async saveAiReport(payload: {
    periodType: 'week' | 'month' | 'year' | 'custom';
    dateRange: string;
    insight: string;
  }) {
    const { data } = await $api.post('/ai/reports', payload);
    return data; // Вернет { success: true, data: newReport }
  },

  // 4. НОВЫЙ: Получение всей истории сохраненных отчетов ИИ
  async getAiReportsHistory() {
    const { data } = await $api.get('/ai/reports');
    return data; // Вернет { success: true, data: [отчет1, отчет2, ...] }
  },

  // 5. НОВЫЙ: Удаление ИИ-отчета из истории
  async deleteAiReport(id: string) {
    const { data } = await $api.delete(`/ai/reports/${id}`);
    return data; // Вернет { success: true, message: "Успешно удален" }
  }
};