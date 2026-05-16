import { PrismaClient } from '@prisma/client';
import { getOpenRouterClient } from '../config/openai.config.js';

const prisma = new PrismaClient();

export class AiService {
  static async generatePeriodReport(userId: string, startDateStr: string, endDateStr: string) {
    // 1. Корректно приводим строковые даты с фронтенда в JS-объекты Date для Prisma
    const start = new Date(startDateStr);
    const end = new Date(endDateStr);
    
    // Устанавливаем конец дня для конечной даты, чтобы захватить транзакции, сделанные вечером
    end.setHours(23, 59, 59, 999);

    // 2. Вытаскиваем транзакции пользователя за период вместе с категориями
    const transactions = await prisma.transaction.findMany({
      where: {
        userId,
        date: {
          gte: start,
          lte: end,
        },
      },
      include: {
        category: true,
      },
      orderBy: {
        date: 'asc',
      },
    });

    if (transactions.length === 0) {
      return "#### Общее состояние\nЗа выбранный период операций не найдено. Добавьте доходы или расходы, чтобы ИИ смог составить аналитический отчет!";
    }

    // 3. Подтягиваем установленные лимиты (бюджеты) пользователя для более глубокого анализа
    const budgets = await prisma.budget.findMany({
      where: { userId },
      include: {
        category: true
      }
    });

    // 4. Находим пользователя в базе и берем его aiApiKey
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { aiApiKey: true }
    });

    // 5. Инициализируем клиент OpenRouter (персональный или дефолтный из .env)
    const aiClient = getOpenRouterClient(user?.aiApiKey);

    // 6. Агрегируем суммы (Decimal приводим к Number через Number())
    const totalIncome = transactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + Number(t.amount), 0);
      
    const totalExpense = transactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + Math.abs(Number(t.amount)), 0);
      
    const balance = totalIncome - totalExpense;

    // Группируем расходы по категориям для ИИ, чтобы он понимал процентное соотношение
    const expenseByCategories: Record<string, number> = {};
    transactions
      .filter(t => t.type === 'expense')
      .forEach(t => {
        const catName = t.category ? t.category.name : 'Без категории';
        expenseByCategories[catName] = (expenseByCategories[catName] || 0) + Math.abs(Number(t.amount));
      });

    // Форматируем лимиты бюджетов для контекста
    const formattedBudgets = budgets.map(b => {
      return `- Категория "${b.category.name}": лимит ${Number(b.amount)} ₽`;
    }).join('\n') || 'Лимиты бюджетов не установлены.';

    // Красиво форматируем список операций для промпта
    const formattedTransactions = transactions.map(t => {
      const catName = t.category ? t.category.name : 'Без категории';
      const formattedDate = new Date(t.date).toISOString().split('T')[0];
      return `[${formattedDate}] ${t.type === 'expense' ? 'Расход' : 'Доход'} | ${catName} | ${Number(t.amount)} ₽ | ${t.desc || ''}`;
    }).join('\n');

    // Формируем детальный финансовый контекст
    const userPrompt = `Проанализируй мои финансовые операции за период с ${startDateStr} по ${endDateStr}.

Сводные показатели:
- Сумма доходов: ${totalIncome} ₽
- Сумма расходов: ${totalExpense} ₽
- Чистый остаток: ${balance} ₽

Установленные лимиты по бюджетам:
${formattedBudgets}

Распределение расходов по категориям:
${Object.entries(expenseByCategories).map(([cat, amt]) => `- ${cat}: ${amt} ₽`).join('\n')}

История операций:
${formattedTransactions}`;

    // Системный промпт жестко фиксирует заголовки (####) для парсера фронтенда
    const systemInstruction = `Ты — продвинутый ИИ-аналитик финансовой платформы FinMath. 
Твоя задача — провести жесткий аудит предоставленного бюджета и вернуть строго структурированный ответ на русском языке.

Используй СТРОГО следующий шаблон разметки Markdown (не меняй названия заголовков H4):

#### Общее состояние
(Напиши краткую оценку. Если расходы превышают доходы или баланс отрицательный, обязательно используй слово "критическое" или "минус", укажи сумму дефицита).

#### Топ самых затратных категорий
- **Категория1** — Сумма ₽ (Процент%)
- **Категория2** — Сумма ₽ (Процент%)
(Выведи до 3 категорий в таком формате с расчетом процента от общих расходов).

#### Аномалии и подозрительные траты
- (Найди транзакции со странными описаниями, дубликаты операций в один день, резкие скачки расходов или превышение установленных лимитов бюджетов. Если аномалий нет, напиши: "Аномалий не обнаружено").

#### Советы по оптимизации бюджета
- (Дай 1-2 конкретных, математически обоснованных совета на основе структуры расходов пользователя).

Отвечай лаконично, без приветствий, вступлений и лишней воды. Строго соблюдай структуру заголовков.`;

    // 7. Отправляем запрос в OpenRouter
    try {
      const response = await aiClient.chat.completions.create({
        model: 'deepseek/deepseek-v4-flash:free',
        messages: [
          {
            role: 'system',
            content: systemInstruction
          },
          {
            role: 'user',
            content: userPrompt
          }
        ],
        temperature: 0.2 // Снизили температуру до 0.2 для более точного следования инструкциям шаблона
      });

      return response.choices[0].message.content;
    } catch (error: any) {
      console.error('Ошибка работы с OpenRouter в сервисе:', error);
      
      // Если упал именно токен пользователя
      if (user?.aiApiKey && error.status === 401) {
        throw new Error('Ваш персональный API-ключ OpenRouter невалиден. Проверьте его корректность в настройках профиля.');
      }
      
      throw new Error('Не удалось получить аналитический отчет от ИИ. Проверьте подключение к сети.');
    }
  }
}