/**
 * Converts a date string to a human-readable relative time.
 * @param {string} dateString - ISO date string
 * @returns {string} - e.g. "Il y a 2h", "Il y a 3j"
 */
export function getTimeAgo(dateString) {
  const diff = Date.now() - new Date(dateString).getTime()
  const hours = Math.floor(diff / 3600000)
  if (hours < 1) return "À l'instant"
  if (hours < 24) return `Il y a ${hours}h`
  const days = Math.floor(hours / 24)
  return `Il y a ${days}j`
}

/**
 * Calculates profile completion percentage.
 * @param {object} data - Profile or clinic object
 * @param {string[]} fields - Fields to check
 * @returns {number} - Percentage 0-100
 */
export function getCompletionScore(data, fields) {
  if (!data) return 0
  const filled = fields.filter(f => data[f]).length
  return Math.round((filled / fields.length) * 100)
}

/**
 * Formats a date string as DD/MM/YY.
 * Uses UTC to avoid server/client locale mismatch.
 */
export function formatDate(dateString) {
  const date = new Date(dateString)
  const day = String(date.getUTCDate()).padStart(2, '0')
  const month = String(date.getUTCMonth() + 1).padStart(2, '0')
  const year = String(date.getUTCFullYear()).slice(-2)
  return `${day}/${month}/${year}`
}