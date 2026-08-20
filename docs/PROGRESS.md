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

## Шаг 5: Социальные механики — done
- [x] Лайки — `toggleLike` server action (`lib/actions/likes.ts`) поверх уникальной пары `Like.userId_postId`; счётчик и «лайкнул ли я» подтягиваются через общий `postInclude()` (`lib/posts.ts`), кнопка в `PostCard` с optimistic UI (мгновенно меняется, откатывается при ошибке сервера)
- [x] Комментарии — `lib/actions/comments.ts` (`getComments`/`createComment`/`deleteComment`, удаление только автору), `CommentSection` на странице поста: форма + список, счётчик в `PostCard` теперь реальный (`_count.comments`), клик по иконке комментариев в ленте ведёт на страницу поста
- [x] Подписки + профиль — `toggleFollow` (`lib/actions/follows.ts`) поверх `Follow.followerId_followingId`, `FollowButton` с optimistic UI; страница `/users/[username]` (посты автора через переиспользованный `InfiniteFeed` с фильтром `authorId`, счётчики постов/подписчиков/подписок); имя автора в `PostCard` теперь ссылка на профиль; в сайдбаре появился пункт «Профиль»
- Добавлено поле `User.username` (обязательное, уникальное) — миграция `20260820210155_add_user_username` с backfill из локальной части email для уже существующих пользователей; при регистрации генерируется той же логикой (`lib/username.ts`)
- Известное ограничение: username генерируется только в Credentials-регистрации; если включить Google OAuth (сейчас не настроен), `PrismaAdapter` создаст пользователя без username и упадёт на NOT NULL — нужно будет доработать при подключении OAuth
- Репосты и просмотры остаются визуальной заглушкой — этих моделей нет в схеме

## Шаг 6: Дизайн и полировка — in progress
- [x] Применена дизайн-система Substack (`Design.md`): токены цвета/шрифтов, pill-кнопки, плоская лента с hairline-разделителями
- [x] Трёхколоночный адаптивный layout (сайдбар / лента / рекомендации), мобильный header ниже `md`
- [x] Карточка поста переверстана: аватар+имя+относительное время сверху слева, меню действий (`⋮` → Редактировать/Удалить) сверху справа, движок лайков/комментов/репостов/просмотров снизу
- [x] Баг: hydration mismatch из-за относительного времени (`Date.now()` при рендере) — исправлено через детерминированный SSR-текст + обновление после монтирования
- [x] Тёмная тема — `next-themes` (`ThemeProvider` в `app/layout.tsx`, `attribute="class"`, `defaultTheme="system"`), переключатель (`ThemeToggle`) в сайдбаре и мобильном header. Палитра `.dark` в `globals.css` пересобрана на токенах из `Design.md` (Charcoal-фон, Ink-карточки, Slate-бордеры), а не на дефолтном сером наборе shadcn, который там был раньше и не имел отношения к бренду. Заодно вычистил все места, где компоненты использовали «сырые» бренд-цвета (`bg-cloud`, `bg-paper`, `text-ink`) напрямую вместо семантических токенов (`bg-muted`, `bg-background`, `text-foreground`) — иначе тёмная тема их бы не трогала
- [x] Скелетоны — `Skeleton`/`PostCardSkeleton`, показываются на ленте через **ручной `<Suspense>` внутри `app/(main)/page.tsx`**, а не через файловый `loading.tsx`. Баг по пути: `loading.tsx` создаёт Suspense-границу на всю подветку роутов `(main)`, включая `/posts/[id]` и `/users/[username]` — а это ломает `notFound()`: стриминг успевает уйти клиенту как 200 ещё до того, как страница узнаёт, что поста/юзера не существует (тело корректно показывает «не найдено», а HTTP-статус остаётся 200). Заметил через `curl -o /dev/null -w "%{http_code}"`, поэтому убрал `loading.tsx` везде и оставил ручной `Suspense` только вокруг данных ленты — единственного места, где скелетон реально нужен на каждой навигации
- [x] Тосты — `sonner` (`components/ui/sonner.tsx`, уже подключён к `next-themes`). Заменил inline-ошибки (создание/редактирование/удаление поста, комментарии) и полностью молчаливые сбои (лайк, подписка — раньше просто откатывались без единого сообщения) на `toast.error`/`toast.success`

## Производительность
Замер (`prisma.$queryRaw`, локально): "тёплый" простой запрос к Neon Postgres ~250ms (сетевая задержка до региона БД), "холодный" (после простоя, compute на бесплатном тарифе Neon засыпает) — ~2.4s на подключение. Это инфраструктурное ограничение, кодом не лечится (варианты: платный тариф без автоусыпления, БД ближе географически, или self-host).
- [x] Убран лишний DB-round-trip на каждой странице: `username` для сайдбара раньше доставался отдельным `prisma.user.findUnique` в `(main)/layout.tsx` на каждый запрос — теперь кладётся в JWT при логине (`auth.ts`) и берётся из `session.user.username` бесплатно. Уже залогиненным нужно перелогиниться разово, чтобы токен обновился
- [x] Страница поста грузит пост и комментарии параллельно (`Promise.all`) вместо последовательных await
- Замечено: `getPosts()`/`postInclude()` — это 3 отдельных SQL-запроса на один вызов (сам список + подтягивание авторов + подтягивание лайков текущего юзера), т.к. Prisma 7 с driver adapters не поддерживает `relationLoadStrategy: "join"` (проверено эмпирически). Не тронуто — переписывание в один `$queryRaw` возможно, но добавляет сложности (руками писать SQL и сборку типов) ради ~400-500ms на самом горячем пути (лента/бесконечный скролл/профиль)

## Git-инфраструктура
- [x] Репозиторий создан, remote `origin` подключён (`Sidorin7/social-network`)
- [x] Репозиторий сделан публичным
- [x] Branch protection на `master`: PR обязателен, force-push и удаление ветки запрещены
- [x] GitHub Flow процесс согласован (feature/fix/docs/chore ветки + Conventional Commits)
