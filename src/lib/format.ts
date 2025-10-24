/**
 * Format an ISO date string to a human-readable format
 * @param iso - ISO 8601 date string
 * @returns Formatted date string (e.g., "Jan 15, 2024")
 */
export function fmtDate(iso: string): string {
  const date = new Date(iso)
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(date)
}

/**
 * Format an ISO date string to relative time
 * @param iso - ISO 8601 date string
 * @returns Relative time string (e.g., "2 hours ago", "in 3 days")
 */
export function fromNow(iso: string): string {
  const date = new Date(iso)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffSec = Math.floor(Math.abs(diffMs) / 1000)
  const isPast = diffMs > 0

  const intervals = [
    { label: 'year', seconds: 31536000 },
    { label: 'month', seconds: 2592000 },
    { label: 'week', seconds: 604800 },
    { label: 'day', seconds: 86400 },
    { label: 'hour', seconds: 3600 },
    { label: 'minute', seconds: 60 },
    { label: 'second', seconds: 1 },
  ]

  for (const interval of intervals) {
    const count = Math.floor(diffSec / interval.seconds)
    if (count >= 1) {
      const plural = count !== 1 ? 's' : ''
      return isPast
        ? `${count} ${interval.label}${plural} ago`
        : `in ${count} ${interval.label}${plural}`
    }
  }

  return 'just now'
}

/**
 * Safely render event details as a formatted string
 * @param details - Record of key-value pairs
 * @returns Formatted string of details, or empty string if no details
 */
export function renderDetails(details?: Record<string, unknown>): string {
  if (!details || typeof details !== 'object') {
    return ''
  }

  return Object.entries(details)
    .filter(([_, value]) => value !== null && value !== undefined)
    .map(([key, value]) => {
      const formattedKey = key.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())
      const formattedValue = typeof value === 'object'
        ? JSON.stringify(value)
        : String(value)
      return `${formattedKey}: ${formattedValue}`
    })
    .join(' • ')
}
