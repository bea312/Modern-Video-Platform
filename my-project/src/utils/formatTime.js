const suffixes = [
  { value: 1e9, symbol: 'B' },
  { value: 1e6, symbol: 'M' },
  { value: 1e3, symbol: 'K' }
];

export const shortenNumber = (value) => {
  if (value === undefined || value === null) return '';
  const numeric = Number(value);
  if (Number.isNaN(numeric)) return '';
  for (const suffix of suffixes) {
    if (numeric >= suffix.value) {
      return `${(numeric / suffix.value).toFixed(1)}${suffix.symbol}`;
    }
  }
  return numeric.toLocaleString();
};

export const formatRelativeDate = (isoString) => {
  if (!isoString) return '';
  const published = new Date(isoString);
  const diff = Date.now() - published.getTime();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  if (days <= 0) return 'Today';
  if (days === 1) return 'Yesterday';
  if (days < 30) return `${days} days ago`;
  const months = Math.floor(days / 30);
  if (months < 12) return `${months} month${months > 1 ? 's' : ''} ago`;
  const years = Math.floor(days / 365);
  return `${years} year${years > 1 ? 's' : ''} ago`;
};

export const formatDuration = (isoDuration) => {
  if (!isoDuration) return '';
  const parts = isoDuration
    .replace('PT', '')
    .replace(/H/, ':')
    .replace(/M/, ':')
    .replace(/S/, '')
    .split(':')
    .filter(Boolean);
  return parts.map((part) => part.padStart(2, '0')).join(':');
};
