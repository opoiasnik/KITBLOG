# Firebase Authentication Setup

## Настройка OAuth провайдеров в Firebase Console

Для корректной работы авторизации необходимо настроить OAuth провайдеров в Firebase Console:

### 1. Перейти в Firebase Console

1. Откройте [Firebase Console](https://console.firebase.google.com/)
2. Выберите ваш проект `kitglobal-88e0e`

### 2. Настройка Authentication

1. В левом меню выберите **Authentication**
2. Перейдите на вкладку **Sign-in method**

### 3. Настройка Google OAuth

1. Найдите **Google** в списке провайдеров
2. Нажмите кнопку **Enable**
3. Выберите support email (ваш email)
4. Нажмите **Save**

### 4. Настройка GitHub OAuth

1. Найдите **GitHub** в списке провайдеров
2. Нажмите кнопку **Enable**
3. Перейдите в [GitHub Developer Settings](https://github.com/settings/developers)
4. Нажмите **New OAuth App**
5. Заполните поля:
   - **Application name**: `KITBLOG`
   - **Homepage URL**: `https://kitglobal-88e0e.web.app` (или ваш домен)
   - **Authorization callback URL**: `https://kitglobal-88e0e.firebaseapp.com/__/auth/handler`
6. Нажмите **Register application**
7. Скопируйте **Client ID** и **Client Secret**
8. Вернитесь в Firebase Console
9. Вставьте **Client ID** и **Client Secret** в соответствующие поля
10. Нажмите **Save**

### 5. Настройка Authorized domains

1. В Firebase Console, в разделе **Authentication**
2. Перейдите на вкладку **Settings**
3. В разделе **Authorized domains** добавьте:
   - `localhost` (для разработки)
   - `kitglobal-88e0e.web.app` (для продакшена)
   - Ваш собственный домен (если есть)

## Функциональность

После настройки OAuth провайдеров приложение будет поддерживать:

### Авторизация
- **Google OAuth** - вход через Google аккаунт
- **GitHub OAuth** - вход через GitHub аккаунт
- Автоматическое заполнение профиля пользователя

### Защищенные функции
- **Создание постов** - только для авторизованных пользователей
- **Редактирование постов** - только для авторизованных пользователей
- **Автоматическое заполнение автора** - берется из профиля пользователя

### Компоненты
- **AuthModal** - модальное окно для входа
- **UserProfile** - профиль пользователя с возможностью выхода
- **Header** - интеграция с кнопкой входа/профилем

## Как это работает

1. **Неавторизованный пользователь**:
   - Видит кнопку "Sign In" в хедере
   - При попытке создать пост открывается модальное окно авторизации
   - Может просматривать все посты

2. **Авторизованный пользователь**:
   - Видит свой профиль в хедере
   - Может создавать и редактировать посты
   - Поле автора заполняется автоматически
   - Может выйти из аккаунта

## Безопасность

- Все OAuth токены обрабатываются Firebase
- Пользовательские данные защищены Firebase Auth
- Локальное хранение минимально (только состояние авторизации)

## Дополнительные провайдеры

Вы можете добавить другие OAuth провайдеры:
- **Facebook**
- **Twitter**
- **Microsoft**
- **Apple**

Для этого нужно:
1. Настроить провайдера в Firebase Console
2. Добавить соответствующие методы в `firebase.ts`
3. Обновить `AuthContext.tsx` и `AuthModal.tsx` 