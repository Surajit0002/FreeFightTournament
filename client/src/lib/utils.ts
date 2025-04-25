import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(amount);
}

export function formatTimeLeft(date: Date | string): string {
  const targetDate = typeof date === 'string' ? new Date(date) : date;
  const now = new Date();
  
  // Get the time difference in milliseconds
  const timeDiff = targetDate.getTime() - now.getTime();
  
  // Return if the date is in the past
  if (timeDiff <= 0) {
    return 'Started';
  }
  
  // Calculate days, hours, minutes
  const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
  
  if (days > 0) {
    return `${days}d ${hours}h`;
  }
  
  return `${hours}h ${minutes}m`;
}

export function getGameModeColor(mode: string): string {
  switch (mode.toLowerCase()) {
    case 'solo':
      return 'text-accent';
    case 'duo':
      return 'text-secondary';
    case 'squad':
      return 'text-primary';
    default:
      return 'text-white';
  }
}

export function getGameModeBgColor(mode: string): string {
  switch (mode.toLowerCase()) {
    case 'solo':
      return 'bg-accent';
    case 'duo':
      return 'bg-secondary';
    case 'squad':
      return 'bg-primary';
    default:
      return 'bg-muted';
  }
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
}

// Generate a random avatar URL from UI Avatars service
export function getDefaultAvatar(username: string): string {
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(username)}&background=8B5CF6&color=fff&size=100`;
}
