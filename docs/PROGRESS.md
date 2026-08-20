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
- [x] Редактирование поста (только автор) — инлайн, текст переключается в `Textarea` прямо в карточке
- [x] Удаление поста (только автор) — через меню действий, проверка `authorId` в server action
- [x] Пагинация ленты — бесконечный скролл (`InfiniteFeed` + `IntersectionObserver`, курсорная пагинация через `getPosts` по 10 постов)
- Баг: новый пост не появлялся в ленте после публикации (`InfiniteFeed` не подхватывал обновлённый `initialPosts` после `router.refresh()`) — исправлено, `createPost` теперь возвращает созданный пост и `CreatePostCard` добавляет его в локальный стейт напрямую
- Security-фикс: `createPost`/`getPosts` и страница поста тянули весь объект `User` (включая `hashedPassword`) в ответ клиенту через `include: { author: true }` — сужено до `select: { name: true }`

## Шаг 5: Социальные механики — in progress
- [x] Лайки — `toggleLike` server action (`lib/actions/likes.ts`) поверх уникальной пары `Like.userId_postId`; счётчик и «лайкнул ли я» подтягиваются через общий `postInclude()` (`lib/posts.ts`), кнопка в `PostCard` с optimistic UI (мгновенно меняется, откатывается при ошибке сервера)
- [x] Комментарии — `lib/actions/comments.ts` (`getComments`/`createComment`/`deleteComment`, удаление только автору), `CommentSection` на странице поста: форма + список, счётчик в `PostCard` теперь реальный (`_count.comments`), клик по иконке комментариев в ленте ведёт на страницу поста
- [ ] Подписки (Follow/unfollow) + профиль пользователя `/users/[username]`
- Репосты и просмотры остаются визуальной заглушкой — этих моделей нет в схеме

## Шаг 6: Дизайн и полировка — in progress
- [x] Применена дизайн-система Substack (`Design.md`): токены цвета/шрифтов, pill-кнопки, плоская лента с hairline-разделителями
- [x] Трёхколоночный адаптивный layout (сайдбар / лента / рекомендации), мобильный header ниже `md`
- [x] Карточка поста переверстана: аватар+имя+относительное время сверху слева, меню действий (`⋮` → Редактировать/Удалить) сверху справа, движок лайков/комментов/репостов/просмотров снизу
- [x] Баг: hydration mismatch из-за относительного времени (`Date.now()` при рендере) — исправлено через детерминированный SSR-текст + обновление после монтирования
- [ ] Тёмная тема
- [ ] Скелетоны/лоадеры (Suspense + `loading.tsx`)
- [ ] Тосты для уведомлений

## Git-инфраструктура
- [x] Репозиторий создан, remote `origin` подключён (`Sidorin7/social-network`)
- [x] Репозиторий сделан публичным
- [x] Branch protection на `master`: PR обязателен, force-push и удаление ветки запрещены
- [x] GitHub Flow процесс согласован (feature/fix/docs/chore ветки + Conventional Commits)
