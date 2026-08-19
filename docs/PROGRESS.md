# Progress Log

Журнал прогресса по [PLAN.md](./PLAN.md). Обновляется по мере выполнения шагов — что сделано, в какой ветке/PR, что дальше.

## Шаг 1: Инициализация проекта
- [x] `create-next-app` (TypeScript, App Router, Tailwind, ESLint)
- [ ] shadcn/ui init + базовые компоненты
- [ ] next-themes + переключатель темы

## Шаг 2: База данных и модели (Prisma)
- [ ] Схема Prisma (User, Account, Session, Post, Comment, Like, Follow)
- [ ] Первая миграция
- Ветка в работе: `feature/prisma-setup` (создана, коммитов пока нет)

## Шаг 3: Авторизация (Auth.js v5)
- [ ] Не начато

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
