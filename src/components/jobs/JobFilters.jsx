/**
 * Filter bar for job listings.
 * Controlled component — receives filters and onChange from parent.
 */
export default function JobFilters({ filters, specialties, cities, onChange, onClear }) {
  const hasFilters = Object.values(filters).some(v => v !== '')

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-4">
      <div className="grid grid-cols-3 gap-3">
        <select
          name="specialty_id"
          value={filters.specialty_id}
          onChange={onChange}
          className={selectClass}
        >
          <option value="">Toutes les spécialités</option>
          {specialties.map(s => (
            <option key={s.id} value={s.id}>{s.name}</option>
          ))}
        </select>

        <select
          name="city_id"
          value={filters.city_id}
          onChange={onChange}
          className={selectClass}
        >
          <option value="">Toutes les villes</option>
          {cities.map(c => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>

        <select
          name="contract_type"
          value={filters.contract_type}
          onChange={onChange}
          className={selectClass}
        >
          <option value="">Tous les contrats</option>
          <option value="Temps plein">Temps plein</option>
          <option value="Temps partiel">Temps partiel</option>
          <option value="Vacation">Vacation</option>
          <option value="Week-end">Week-end</option>
        </select>
      </div>

      {hasFilters && (
        <button
          onClick={onClear}
          className="mt-3 text-xs text-gray-400 hover:text-gray-600"
        >
          ✕ Effacer les filtres
        </button>
      )}
    </div>
  )
}

const selectClass = "w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-600"