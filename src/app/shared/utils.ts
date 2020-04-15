import { formatDate } from '@angular/common';

export const getDate = (date: any, format?: string): string => {
  if (!date) return;
  format = format ? format : 'MMM d, HH:mm';

  if (isToday(date.toDate())) {
    format = 'HH:mm';
  }

  if (!isCurrentYear(date.toDate())) {
    format = 'MMM d, y, HH:mm';
  }

  return formatDate(date.toDate(), format, 'en-us');
};

export const isToday = (date: any): boolean => {
  const today = new Date();
  return date.getDate() === today.getDate()
      && date.getMonth() === today.getMonth()
      && date.getFullYear() === today.getFullYear();
};

export const isCurrentYear = (date: any): boolean => {
  const today = new Date();
  return date.getFullYear() === today.getFullYear();
};
