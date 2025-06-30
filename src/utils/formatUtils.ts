/**
 * Format view count to a human-readable string
 */
export function formatViewCount(count: number): string {
  if (count < 1000) {
    return count.toString();
  } else if (count < 1000000) {
    return (count / 1000).toFixed(count % 1000 < 100 ? 0 : 1) + 'K';
  } else {
    return (count / 1000000).toFixed(count % 1000000 < 100000 ? 1 : 2) + 'M';
  }
}

/**
 * Format duration in seconds to MM:SS format
 */
export function formatDuration(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
}