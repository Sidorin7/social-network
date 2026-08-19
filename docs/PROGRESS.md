# Progress Log

Журнал прогресса по [PLAN.md](./PLAN.md). Обновляется по мере выполнения шагов — что сделано, в какой ветке/PR, что дальше.

## Шаг 1: Инициализация проекта
- [x] `create-next-app` (TypeScript, App Router, Tailwind, ESLint)
- [ ] shadcn/ui init + базовые компоненты
- [ ] next-themes + переключатель темы

## Шаг 2: База данных и модели (Prisma) — done
- [x] Схема Prisma (User, Account, Session, VerificationToken, Post, Comment, Like, Follow)
- [x] Первая миграция (`prisma/migrations/20260819154026_init`)
- PR: [#2](https://github.com/Sidorin7/social-network/pull/2) (смёржен)
- Заметка: используется Prisma 7, конфигурация БД через `prisma.config.ts` (не через `datasource.url` в schema.prisma)

## Шаг 3: Авторизация (Auth.js v5)
- [ ] Не начато — следующий шаг

## Шаг 4: Лента и посты
- [ ] Не начато

## Шаг 5: Социальные механики
- [ ] Не начато

## Шаг 6: Дизайн и полировка
- [ ] Не начато

## Git-инфраструктура
- [x] Репозиторий создан, remote `origin` подключён (`Sidorin7/social-network`)
- [x] Репозиторий сделан публичным
- [x] Branch protection на `master`: PR обязателен, force-push и удаление ветки запрещены
- [x] GitHub Flow процесс согласован (feature/fix/docs/chore ветки + Conventional Commits)
