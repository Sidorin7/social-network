export function formatRelativeTime(date: Date): string {
  const diffSec = Math.floor((Date.now() - date.getTime()) / 1000);

  if (diffSec < 60) return "только что";

  const diffMin = Math.floor(diffSec / 60);
  if (diffMin < 60) return `${diffMin} мин назад`;

  const diffHour = Math.floor(diffMin / 60);
  if (diffHour < 24) return `${diffHour} ч назад`;

  const diffDay = Math.floor(diffHour / 24);
  if (diffDay < 7) return `${diffDay} дн назад`;

  return date.toLocaleDateString("ru-RU");
}
