# Progress Log

Журнал прогресса по [PLAN.md](./PLAN.md). Обновляется по мере выполнения шагов — что сделано, в какой ветке/PR, что дальше.

## Шаг 1: Инициализация проекта
- [x] `create-next-app` (TypeScript, App Router, Tailwind, ESLint)
- [x] shadcn/ui init + базовые компоненты (Button, Card, Input, Textarea, Label, Field, Separator)
- [ ] next-themes + переключатель темы

## Шаг 2: База данных и модели (Prisma) — done
- [x] Схема Prisma (User, Account, Session, VerificationToken, Post, Comment, Like, Follow)
- [x] Первая миграция (`prisma/migrations/20260819154026_init`)
- PR: [#2](https://github.com/Sidorin7/social-network/pull/2) (смёржен)
- Заметка: используется Prisma 7, конфигурация БД через `prisma.config.ts` (не через `datasource.url` в schema.prisma)

## Шаг 3: Авторизация (Auth.js v5) — done
- [x] `auth.ts`: NextAuth v5 конфиг, PrismaAdapter, JWT sessions
- [x] Credentials provider (email+пароль, bcrypt) — `authorize()` реализован
- [x] Route handler `app/api/auth/[...nextauth]/route.ts`
- [x] `lib/prisma.ts` — синглтон Prisma Client
- [x] Формы регистрации/логина + Server Actions (`app/(auth)/login`, `app/(auth)/register`)
- [x] Middleware для защиты приватных роутов (`proxy.ts`, матчит `/dashboard`)
- [ ] Google OAuth (провайдер зарегистрирован в `auth.ts`, но credentials/UI ещё не настроены)

## Шаг 4: Лента и посты — done
- [x] Главная лента `/` (посты по автору + дате)
- [x] Создание поста: быстрая форма в ленте (`CreatePostCard`)
- [x] Страница поста `/posts/[id]`
- [x] Пост — микроблог-сообщение без заголовка (поле `title` убрано из схемы, миграция `20260820121945_remove_post_title`); отдельная страница `/posts/new` убрана как неиспользуемая — создание полностью покрыто быстрой формой в ленте
- [x] Редактирование поста (только автор) — инлайн, `PostBody` переключает текст в `Textarea` прямо в карточке
- [x] Удаление поста (только автор) — кнопка в карточке, проверка `authorId` в server action
- [x] Пагинация ленты — бесконечный скролл (`InfiniteFeed` + `IntersectionObserver`, курсорная пагинация через `getPosts` по 10 постов)

## Шаг 5: Социальные механики
- [ ] Не начато (в UI уже заложены точки роста: правая колонка под рекомендации, место под Subscribe-ссылку в карточке поста)

## Шаг 6: Дизайн и полировка — in progress
- [x] Применена дизайн-система Substack (`Design.md`): токены цвета/шрифтов, pill-кнопки, плоская лента с hairline-разделителями
- [x] Трёхколоночный адаптивный layout (сайдбар / лента / рекомендации), мобильный header ниже `md`
- [ ] Тёмная тема
- [ ] Скелетоны/лоадеры (Suspense + `loading.tsx`)
- [ ] Тосты для уведомлений

## Git-инфраструктура
- [x] Репозиторий создан, remote `origin` подключён (`Sidorin7/social-network`)
- [x] Репозиторий сделан публичным
- [x] Branch protection на `master`: PR обязателен, force-push и удаление ветки запрещены
- [x] GitHub Flow процесс согласован (feature/fix/docs/chore ветки + Conventional Commits)
