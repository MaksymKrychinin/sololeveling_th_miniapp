/**
 * Get start of day in user's timezone
 */
export function getStartOfDay(date: Date = new Date(), timezone?: string): Date {
  const d = new Date(date);
  
  if (timezone) {
    const dateString = d.toLocaleString('en-US', { timeZone: timezone });
    const localDate = new Date(dateString);
    localDate.setHours(0, 0, 0, 0);
    return localDate;
  }
  
  d.setHours(0, 0, 0, 0);
  return d;
}

/**
 * Get end of day in user's timezone
 */
export function getEndOfDay(date: Date = new Date(), timezone?: string): Date {
  const d = new Date(date);
  
  if (timezone) {
    const dateString = d.toLocaleString('en-US', { timeZone: timezone });
    const localDate = new Date(dateString);
    localDate.setHours(23, 59, 59, 999);
    return localDate;
  }
  
  d.setHours(23, 59, 59, 999);
  return d;
}

/**
 * Check if date is today in user's timezone
 */
export function isToday(date: Date, timezone?: string): boolean {
  const today = getStartOfDay(new Date(), timezone);
  const checkDate = getStartOfDay(date, timezone);
  return today.getTime() === checkDate.getTime();
}

/**
 * Check if date is yesterday in user's timezone
 */
export function isYesterday(date: Date, timezone?: string): boolean {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStart = getStartOfDay(yesterday, timezone);
  const checkDate = getStartOfDay(date, timezone);
  return yesterdayStart.getTime() === checkDate.getTime();
}

/**
 * Calculate days between two dates
 */
export function daysBetween(date1: Date, date2: Date): number {
  const oneDay = 24 * 60 * 60 * 1000;
  const d1 = getStartOfDay(date1);
  const d2 = getStartOfDay(date2);
  return Math.round(Math.abs((d1.getTime() - d2.getTime()) / oneDay));
}

/**
 * Format date for display
 */
export function formatDate(date: Date, format: 'short' | 'long' | 'relative' = 'short'): string {
  const now = new Date();
  
  if (format === 'relative') {
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (seconds < 60) return 'just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`;
    
    return date.toLocaleDateString();
  }
  
  if (format === 'long') {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }
  
  return date.toLocaleDateString();
}

/**
 * Check if within streak grace period (4 hours into next day)
 */
export function isWithinStreakGracePeriod(lastCompletionDate: Date, timezone?: string): boolean {
  const now = new Date();
  const startOfToday = getStartOfDay(now, timezone);
  const gracePeriodEnd = new Date(startOfToday);
  gracePeriodEnd.setHours(4, 0, 0, 0); // 4 AM grace period
  
  const lastCompletion = getStartOfDay(lastCompletionDate, timezone);
  const yesterday = new Date(startOfToday);
  yesterday.setDate(yesterday.getDate() - 1);
  
  // If last completion was yesterday and we're still in grace period
  if (lastCompletion.getTime() === yesterday.getTime() && now <= gracePeriodEnd) {
    return true;
  }
  
  return false;
}

/**
 * Get week start date (Monday)
 */
export function getWeekStart(date: Date = new Date()): Date {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1); // Adjust when day is Sunday
  const monday = new Date(d.setDate(diff));
  return getStartOfDay(monday);
}

/**
 * Get month start date
 */
export function getMonthStart(date: Date = new Date()): Date {
  const d = new Date(date);
  d.setDate(1);
  return getStartOfDay(d);
}
