/**
 * Filter tabs for applications page.
 * Shows count per status and highlights active tab.
 */
const TABS = [
  { key: 'all',      label: 'Toutes' },
  { key: 'pending',  label: 'En attente' },
  { key: 'viewed',   label: 'Vues' },
  { key: 'accepted', label: 'Acceptées' },
  { key: 'rejected', label: 'Refusées' },
]

export default function StatusTabs({ active, counts, onChange }) {
  return (
    <div className="flex gap-2 flex-wrap">
      {TABS.map(tab => (
        <button
          key={tab.key}
          onClick={() => onChange(tab.key)}
          className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors flex items-center gap-2 ${
            active === tab.key
              ? 'bg-blue-600 text-white'
              : 'bg-white border border-gray-200 text-gray-500 hover:border-blue-300'
          }`}
        >
          {tab.label}
          <span className={`text-xs px-1.5 py-0.5 rounded-full ${
            active === tab.key ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-500'
          }`}>
            {counts[tab.key] ?? 0}
          </span>
        </button>
      ))}
    </div>
  )
}