# Настройка Firebase для блога

## 1. Создание проекта Firebase

1. Перейдите в [Firebase Console](https://console.firebase.google.com/)
2. Нажмите **"Создать проект"** (Create a project)
3. Введите название проекта (например, `my-blog-app`)
4. Выберите, нужна ли вам Google Analytics (необязательно)
5. Нажмите **"Создать проект"**

## 2. Настройка Firestore Database

1. В левом меню выберите **"Firestore Database"**
2. Нажмите **"Создать базу данных"** (Create database)
3. Выберите **"Начать в тестовом режиме"** (Start in test mode)
4. Выберите регион (рекомендуется близкий к вашему расположению)
5. Нажмите **"Готово"**

## 3. Настройка правил безопасности (для разработки)

В консоли Firestore перейдите в **"Правила"** (Rules) и замените содержимое на:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Разрешить чтение и запись для всех пользователей (только для разработки!)
    match /{document=**} {
      allow read, write: if true;
    }
  }
}
```

⚠️ **Важно**: Эти правила подходят только для разработки! Для продакшена настройте более строгие правила безопасности.

## 4. Получение конфигурации Firebase

1. В левом меню нажмите на **шестеренку** рядом с "Project Overview"
2. Выберите **"Project settings"**
3. Прокрутите вниз до секции **"Your apps"**
4. Нажмите на иконку **веб-приложения** (</>) или **"Добавить приложение"**
5. Введите название приложения (например, `blog-web-app`)
6. Нажмите **"Зарегистрировать приложение"**
7. Скопируйте объект конфигурации

## 5. Настройка переменных окружения

Создайте файл `.env.local` в корневой папке проекта и добавьте:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key-here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id
```

Замените значения на те, которые вы получили из Firebase Console.

## 6. Пример конфигурации Firebase

Ваша конфигурация должна выглядеть примерно так:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyB1234567890abcdefghijklmnopqrstuvwxyz",
  authDomain: "my-blog-app-12345.firebaseapp.com",
  projectId: "my-blog-app-12345",
  storageBucket: "my-blog-app-12345.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdef1234567890abcdef"
};
```

## 7. Проверка подключения

После настройки переменных окружения запустите проект:

```bash
npm run dev
```

Если всё настроено правильно, вы сможете:
- Создавать новые посты
- Просматривать существующие посты
- Добавлять комментарии
- Редактировать и удалять посты

## 8. Структура данных в Firestore

Приложение автоматически создаст следующие коллекции:

### Коллекция `posts`:
```javascript
{
  id: "auto-generated-id",
  title: "Заголовок поста",
  content: "Содержимое поста",
  author: "Автор поста",
  excerpt: "Краткое описание",
  tags: ["тег1", "тег2"],
  isPublished: true,
  createdAt: Timestamp,
  updatedAt: Timestamp,
  publishedAt: Timestamp
}
```

### Коллекция `comments`:
```javascript
{
  id: "auto-generated-id",
  postId: "id-поста",
  author: "Автор комментария",
  content: "Текст комментария",
  createdAt: Timestamp,
  updatedAt: Timestamp
}
```

## 9. Правила безопасности для продакшена

Для продакшена используйте более строгие правила:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Разрешить чтение всех опубликованных постов
    match /posts/{postId} {
      allow read: if resource.data.isPublished == true;
      allow create, update, delete: if request.auth != null;
    }
    
    // Разрешить чтение комментариев всем, создание только авторизованным
    match /comments/{commentId} {
      allow read: if true;
      allow create: if request.auth != null;
      allow update, delete: if request.auth != null && request.auth.uid == resource.data.authorId;
    }
  }
}
```

## 10. Устранение неполадок

### Ошибка "Firebase: No Firebase App '[DEFAULT]' has been created"
- Проверьте, что все переменные окружения заданы правильно
- Убедитесь, что файл `.env.local` находится в корневой папке проекта

### Ошибка "FirebaseError: Missing or insufficient permissions"
- Проверьте правила безопасности в Firestore
- Убедитесь, что используете тестовые правила для разработки

### Ошибка "Firebase: Error (auth/configuration-not-found)"
- Проверьте правильность PROJECT_ID в переменных окружения
- Убедитесь, что проект существует в Firebase Console

## 11. Полезные ссылки

- [Firebase Console](https://console.firebase.google.com/)
- [Документация Firestore](https://firebase.google.com/docs/firestore)
- [Правила безопасности Firestore](https://firebase.google.com/docs/firestore/security/get-started)
- [Firebase для веб-приложений](https://firebase.google.com/docs/web/setup) 