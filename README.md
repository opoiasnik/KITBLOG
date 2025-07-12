# Одностраничный блог с Redux Toolkit, TypeScript и Firestore

Современное веб-приложение для ведения блога, построенное с использованием Next.js 13+, Redux Toolkit, TypeScript, Firebase Firestore и Zod валидации.

## 🚀 Особенности

- **Современный стек технологий**: Next.js 13+ с App Router, TypeScript, Redux Toolkit
- **База данных**: Firebase Firestore для хранения постов и комментариев
- **Валидация**: Zod схемы для проверки данных форм
- **Адаптивный дизайн**: Полностью адаптивный интерфейс с Tailwind CSS
- **Управление состоянием**: Redux Toolkit для эффективного управления состоянием
- **Типизация**: Полная типизация TypeScript
- **SSR**: Server-Side Rendering с Next.js 13+

## 🎯 Функциональность

### Основные возможности:
- ✅ Просмотр списка постов с фильтрацией и поиском
- ✅ Создание новых постов с валидацией форм
- ✅ Редактирование существующих постов
- ✅ Удаление постов
- ✅ Детальный просмотр поста
- ✅ Система комментариев
- ✅ Теги для категоризации постов
- ✅ Черновики и публикация постов
- ✅ Адаптивный дизайн для всех устройств

### Фильтрация и поиск:
- Поиск по заголовку, содержимому и краткому описанию
- Фильтрация по тегам
- Фильтрация по автору
- Фильтрация по статусу публикации

## 🏗️ Архитектура проекта

```
blog-app/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── layout.tsx         # Главный лейаут
│   │   ├── page.tsx           # Главная страница
│   │   └── globals.css        # Глобальные стили
│   ├── components/            # React компоненты
│   │   ├── BlogApp.tsx        # Главный компонент приложения
│   │   ├── PostList.tsx       # Список постов
│   │   ├── PostForm.tsx       # Форма создания/редактирования
│   │   └── PostDetail.tsx     # Детальный просмотр поста
│   ├── store/                 # Redux store
│   │   ├── index.ts           # Конфигурация store
│   │   └── blogSlice.ts       # Slice для блога
│   ├── types/                 # TypeScript типы
│   │   └── index.ts           # Основные типы
│   ├── schemas/               # Zod схемы
│   │   └── index.ts           # Схемы валидации
│   ├── hooks/                 # Кастомные хуки
│   │   └── redux.ts           # Типизированные Redux хуки
│   ├── lib/                   # Утилиты
│   │   └── firebase.ts        # Конфигурация Firebase
│   └── providers/             # Провайдеры
│       └── ReduxProvider.tsx  # Redux провайдер
├── .env.local                 # Переменные окружения
├── package.json              # Зависимости
└── README.md                 # Документация
```

## 🛠️ Установка и запуск

### Предварительные требования:
- Node.js 18.0 или выше
- npm или yarn
- Firebase проект с настроенным Firestore

### Шаги установки:

1. **Клонирование репозитория:**
```bash
git clone <repository-url>
cd blog-app
```

2. **Установка зависимостей:**
```bash
npm install
# или
yarn install
```

3. **Настройка Firebase:**
   - Создайте новый проект в [Firebase Console](https://console.firebase.google.com/)
   - Включите Firestore Database
   - Создайте веб-приложение в настройках проекта
   - Скопируйте конфигурацию Firebase

4. **Настройка переменных окружения:**
Создайте файл `.env.local` в корневой папке проекта:
```env
NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id
```

5. **Запуск в режиме разработки:**
```bash
npm run dev
# или
yarn dev
```

6. **Открытие приложения:**
Перейдите по адресу [http://localhost:3000](http://localhost:3000)

## 📦 Основные зависимости

### Производственные зависимости:
- **Next.js 15+**: React фреймворк с SSR
- **React 18+**: Библиотека для создания пользовательских интерфейсов
- **Redux Toolkit**: Современный Redux с упрощенной настройкой
- **React Redux**: Официальные React биндинги для Redux
- **Firebase**: Backend-as-a-Service для базы данных
- **Zod**: TypeScript-first схемы валидации
- **React Hook Form**: Производительные формы с минимальными рендерами
- **Tailwind CSS**: Utility-first CSS фреймворк
- **Lucide React**: Иконки для React
- **date-fns**: Современная библиотека для работы с датами

### Зависимости для разработки:
- **TypeScript**: Статическая типизация
- **ESLint**: Линтер для JavaScript/TypeScript
- **PostCSS**: Инструмент для трансформации CSS
- **Tailwind CSS**: CSS фреймворк

## 🔧 Структура данных

### Пост (BlogPost):
```typescript
interface BlogPost {
  id: string;
  title: string;
  content: string;
  author: string;
  createdAt: Date;
  updatedAt: Date;
  tags: string[];
  excerpt: string;
  publishedAt?: Date;
  isPublished: boolean;
}
```

### Комментарий (Comment):
```typescript
interface Comment {
  id: string;
  postId: string;
  author: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}
```

## 🎨 Дизайн и UX

### Адаптивность:
- **Мобильные устройства**: Оптимизированный интерфейс для экранов < 768px
- **Планшеты**: Адаптированный layout для средних экранов
- **Десктоп**: Полноценный интерфейс для больших экранов

### Доступность:
- Семантическая HTML структура
- Поддержка навигации с клавиатуры
- Контрастные цвета для читаемости
- Альтернативные тексты для изображений

## 🔄 Redux Store

### Структура состояния:
```typescript
interface BlogState {
  posts: BlogPost[];
  comments: Comment[];
  loading: boolean;
  error: string | null;
  currentPost: BlogPost | null;
  filter: FilterOptions;
}
```

### Основные actions:
- `fetchPosts`: Получение списка постов
- `createPost`: Создание нового поста
- `updatePost`: Обновление поста
- `deletePost`: Удаление поста
- `fetchComments`: Получение комментариев
- `createComment`: Создание комментария

## 📝 Валидация форм

Используется Zod для валидации данных форм:

### Схема создания поста:
```typescript
const createPostSchema = z.object({
  title: z.string().min(1).max(200),
  content: z.string().min(10).max(10000),
  author: z.string().min(1).max(100),
  tags: z.array(z.string()).max(10),
  excerpt: z.string().min(10).max(300),
  isPublished: z.boolean()
});
```

## 🚀 Деплой

### Vercel (рекомендуется):
1. Подключите репозиторий к Vercel
2. Добавьте переменные окружения в настройках проекта
3. Деплой происходит автоматически при push

### Другие платформы:
1. Соберите проект: `npm run build`
2. Запустите: `npm start`
3. Настройте переменные окружения на платформе

## 🧪 Тестирование

Для добавления тестов рекомендуется использовать:
- **Jest**: Фреймворк для тестирования
- **React Testing Library**: Тестирование React компонентов
- **MSW**: Mock Service Worker для API тестов

## 🔍 Возможные улучшения

### Краткосрочные:
- [ ] Добавить аутентификацию пользователей
- [ ] Реализовать загрузку изображений
- [ ] Добавить rich text editor
- [ ] Реализовать пагинацию постов

### Долгосрочные:
- [ ] Добавить систему уведомлений
- [ ] Реализовать кэширование
- [ ] Добавить PWA функциональность
- [ ] Интегрировать систему аналитики

## 🤝 Вклад в проект

1. Форкните репозиторий
2. Создайте ветку для новой функциональности
3. Внесите изменения
4. Добавьте тесты
5. Создайте Pull Request

## 📄 Лицензия

Этот проект создан в учебных целях и доступен для использования и модификации.

## 🐛 Известные проблемы и решения

### Проблема с Firebase:
Если возникают ошибки подключения к Firebase, убедитесь, что:
- Правильно настроены переменные окружения
- Firestore Database включен в проекте
- Правила безопасности Firestore настроены для разработки

### Проблемы с типизацией:
Если TypeScript выдает ошибки, убедитесь, что:
- Все зависимости установлены
- Версии пакетов совместимы
- Правильно настроен tsconfig.json

## 📞 Поддержка

Если у вас есть вопросы или предложения, создайте Issue в репозитории или свяжитесь с разработчиком.

---

**Создано с ❤️ используя Next.js, Redux Toolkit, TypeScript и Firebase**
