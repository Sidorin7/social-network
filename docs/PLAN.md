# Пет-проект: Блог/соцсеть на Next.js для практики

## Context

Пользователь только что изучил основы Next.js и хочет закрепить знания на практическом проекте с авторизацией, красивым дизайном и разнообразным функционалом. Выбран формат "блог/соцсеть" (посты, лайки, комментарии, подписки, лента) с двумя способами авторизации: email+пароль и OAuth (Google/GitHub).

Цель — не production-сервис, а обучающий проект, который даёт руки на: App Router, Server Components/Actions, работу с БД через ORM, полноценную авторизацию (кастомную + OAuth), формы с валидацией, красивый переиспользуемый UI и базовые социальные механики (лайки/подписки/лента).

Формат работы: пользователь пишет код сам, Claude выступает наставником — объясняет концепции, отвечает на вопросы, ревьюит код, подсказывает при затыках.

## Стек

- **Next.js 15 (App Router) + TypeScript**
- **Tailwind CSS + shadcn/ui** — компоненты и дизайн-система "из коробки", легко кастомизировать
- **Prisma ORM + PostgreSQL** (рекомендуется Neon/Supabase — бесплатный облачный Postgres, не нужно поднимать локально; при желании легко заменить на SQLite для полностью локальной разработки)
- **Auth.js (NextAuth v5)** — Credentials provider (email+пароль, bcrypt для хэширования) + Google OAuth provider
- **Zod + React Hook Form** — валидация форм
- **next-themes** — переключение тёмная/светлая тема

## Структура функционала (по шагам реализации)

1. **Инициализация проекта**
   - `create-next-app` (TypeScript, App Router, Tailwind, ESLint)
   - Установка и настройка shadcn/ui (базовые компоненты: Button, Input, Card, Avatar, DropdownMenu, Dialog, Skeleton)
   - Настройка `next-themes` + переключатель темы в шапке

2. **База данных и модели (Prisma)**
   - Модели: `User` (id, email, passwordHash?, name, image, bio), `Account`/`Session` (для NextAuth adapter), `Post` (title, content/markdown, authorId, createdAt), `Comment` (content, postId, authorId), `Like` (userId, postId, unique-пара), `Follow` (followerId, followingId, unique-пара)
   - `prisma migrate dev` для первичной миграции

3. **Авторизация (Auth.js v5)**
   - Настройка `auth.ts` с Prisma Adapter
   - Credentials provider: страница регистрации (хэш пароля через bcrypt), страница логина
   - Google OAuth provider (и опционально GitHub)
   - Middleware для защиты приватных роутов (`/dashboard`, `/settings`, создание поста)
   - Красивые формы логина/регистрации на shadcn/ui + React Hook Form + Zod

4. **Лента и посты**
   - Главная страница `/` — публичная лента постов (Server Component, пагинация)
   - `/posts/[id]` — страница поста с комментариями
   - `/posts/new`, `/posts/[id]/edit` — создание/редактирование (Server Actions), markdown-редактор (например `@uiw/react-md-editor` или простой textarea + рендер через `react-markdown`)
   - Удаление поста (только автор)

5. **Социальные механики**
   - Лайки (Server Action, оптимистичный UI через `useOptimistic`)
   - Комментарии (форма + список, Server Action)
   - Подписки на пользователей (Follow/Unfollow), персонализированная лента "подписки" vs "все"
   - Профиль пользователя `/users/[username]` — его посты, число подписчиков/подписок, кнопка Follow

6. **Дизайн и полировка**
   - Единая цветовая схема и типографика через Tailwind config + shadcn theme
   - Адаптивность (мобильная навигация, карточки постов)
   - Скелетоны/лоадеры при загрузке (Suspense + `loading.tsx`)
   - Тосты для уведомлений (shadcn `sonner`)

7. **(Опционально, если останется время)**
   - Загрузка аватара/картинок к постам (UploadThing или Cloudinary)
   - Поиск постов/пользователей
   - Пагинация/infinite scroll в ленте

## Ключевые файлы/директории проекта

- `app/(auth)/login/page.tsx`, `app/(auth)/register/page.tsx` — формы авторизации
- `app/(main)/page.tsx` — лента
- `app/(main)/posts/[id]/page.tsx` — страница поста
- `app/(main)/users/[username]/page.tsx` — профиль
- `auth.ts`, `middleware.ts` — конфигурация Auth.js
- `prisma/schema.prisma` — схема БД
- `lib/actions/*.ts` — Server Actions (posts.ts, comments.ts, likes.ts, follows.ts)
- `components/ui/*` — shadcn компоненты
- `components/*` — кастомные компоненты (PostCard, CommentList, FollowButton, ThemeToggle)

## Git workflow

GitHub Flow: `master` защищён (PR обязателен, прямой push и force-push запрещены), работа ведётся в ветках `feature/*`, `fix/*`, `docs/*`, `chore/*`, коммиты в стиле Conventional Commits (`feat:`, `fix:`, `docs:`, `chore:`, `refactor:`).

## Верификация

- `npm run dev` — визуально проверить регистрацию/логин обоими способами, создание поста, лайк/коммент, подписку, смену темы
- `npx prisma studio` — проверить, что данные корректно пишутся в БД
- `npm run build` — убедиться, что проект собирается без ошибок типов
