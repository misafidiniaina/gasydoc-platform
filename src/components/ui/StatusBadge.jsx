/**
 * Displays a colored badge based on application status.
 * Used in both professional and clinic views.
 */
export default function StatusBadge({ status }) {
  const map = {
    pending:  { label: 'En attente', class: 'bg-yellow-50 text-yellow-600' },
    viewed:   { label: 'Vue',        class: 'bg-blue-50 text-blue-600' },
    accepted: { label: 'Acceptée',   class: 'bg-green-50 text-green-600' },
    rejected: { label: 'Refusée',    class: 'bg-red-50 text-red-600' },
  }
  const s = map[status] ?? map.pending
  return (
    <span className={`text-xs font-medium px-3 py-1 rounded-full ${s.class}`}>
      {s.label}
    </span>
  )
}