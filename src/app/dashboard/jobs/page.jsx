'use client'

/**
 * Jobs listing page for professionals.
 * Two-column layout: job list on left, promo widgets on right.
 * Filters use dropdown selects + search bar at the top.
 */
import { useState, useEffect } from 'react'
import { createClient } from '../../../lib/supabase/client'
import JobCard from '../../../components/jobs/JobCard'

export default function JobsPage() {
  const supabase = createClient()

  const [jobs, setJobs] = useState([])
  const [specialties, setSpecialties] = useState([])
  const [cities, setCities] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  const [filters, setFilters] = useState({
    specialty_id: '',
    city_id: '',
    contract_type: '',
  })

  useEffect(() => { loadFilters() }, [])
  useEffect(() => { loadJobs() }, [filters])

  async function loadFilters() {
    const [specialtiesRes, citiesRes] = await Promise.all([
      supabase.from('specialties').select('*'),
      supabase.from('cities').select('*'),
    ])
    setSpecialties(specialtiesRes.data || [])
    setCities(citiesRes.data || [])
  }

  async function loadJobs() {
    setLoading(true)

    let query = supabase
      .from('job_posts')
      .select('*, clinics(name, logo_url), cities(name), specialties(name)')
      .eq('is_active', true)
      .order('created_at', { ascending: false })

    if (filters.specialty_id) query = query.eq('specialty_id', filters.specialty_id)
    if (filters.city_id) query = query.eq('city_id', filters.city_id)
    if (filters.contract_type) query = query.eq('contract_type', filters.contract_type)

    const { data } = await query
    setJobs(data || [])
    setLoading(false)
  }

  function handleFilter(e) {
    const { name, value } = e.target
    setFilters(prev => ({ ...prev, [name]: value }))
  }

  // Client-side search filter on title
  const filtered = search.trim()
    ? jobs.filter(j =>
        j.title.toLowerCase().includes(search.toLowerCase()) ||
        j.clinics?.name?.toLowerCase().includes(search.toLowerCase())
      )
    : jobs

  return (
    <div className="flex gap-6 max-w-6xl mx-auto">

      {/* Left — main content */}
      <div className="flex-1 min-w-0 space-y-5">

        {/* Search bar */}
        <div className="relative">
          <svg
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
            width="16" height="16" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="2"
          >
            <circle cx="11" cy="11" r="8"/>
            <line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Rechercher une offre"
            className="w-full pl-10 pr-4 py-3.5 bg-white border border-gray-200 rounded-sm text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Title + count */}
        <div>
          <h2 className="text-2xl font-semibold text-textcolor">Opportunités disponible</h2>
          <p className="text-sm text-gray-400 mt-1">
            {filtered.length} offre{filtered.length !== 1 ? 's' : ''} trouvé{filtered.length !== 1 ? 's' : ''}
          </p>
        </div>

        {/* Filters row */}
        <div className="flex items-center gap-3">
          <DropdownFilter
            name="specialty_id"
            value={filters.specialty_id}
            onChange={handleFilter}
            placeholder="Toutes les spécialités"
            options={specialties.map(s => ({ value: s.id, label: s.name }))}
          />
          <DropdownFilter
            name="city_id"
            value={filters.city_id}
            onChange={handleFilter}
            placeholder="Toutes les villes"
            options={cities.map(c => ({ value: c.id, label: c.name }))}
          />
          <DropdownFilter
            name="contract_type"
            value={filters.contract_type}
            onChange={handleFilter}
            placeholder="Toutes les contrats"
            options={[
              { value: 'Temps plein', label: 'Temps plein' },
              { value: 'Temps partiel', label: 'Temps partiel' },
              { value: 'Vacation', label: 'Vacation' },
              { value: 'Week-end', label: 'Week-end' },
            ]}
          />

          {/* Search button */}
          <button
            onClick={loadJobs}
            className="w-12 h-12 bg-primary rounded-sm flex items-center justify-center hover:bg-blue-700 transition-colors shrink-0"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
              <circle cx="11" cy="11" r="8"/>
              <line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
          </button>
        </div>

        {/* Job list */}
        {loading ? (
          <div className="text-center py-12 text-gray-400 text-sm">Chargement...</div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-2xl border border-gray-100">
            <p className="text-gray-400 text-sm">Aucune offre trouvée</p>
            <button
              onClick={() => {
                setSearch('')
                setFilters({ specialty_id: '', city_id: '', contract_type: '' })
              }}
              className="mt-2 text-sm text-primary hover:underline"
            >
              Effacer les filtres
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {filtered.map(job => <JobCard key={job.id} job={job} />)}
          </div>
        )}
      </div>

      {/* Right — promo widgets */}
      <div className="sticky w-72 shrink-0 space-y-4">

        {/* Premium card */}
        <div className="bg-linear-to-b from-[#0d2780] to-[#1a3ab8] rounded-lg p-6 text-center">
          <div className="flex justify-center mb-4">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 00-2.91-.09z"/>
              <path d="M12 15l-3-3a22 22 0 012-3.95A12.88 12.88 0 0122 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 01-4 2z"/>
              <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0"/>
              <path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5"/>
            </svg>
          </div>
          <h3 className="text-white font-bold text-lg mb-4">
            Envie de booster votre profile?
          </h3>
          <button className="w-full bg-white text-blue-700 font-semibold py-3 rounded-sm text-sm hover:bg-blue-50 transition-colors">
            Essayer l'offre premium
          </button>
        </div>

        {/* Alert card */}
        <div className="bg-white rounded-lg border border-gray-100 p-6 text-center">
          <h3 className="font-bold text-gray-900 text-lg mb-2">
            Ne manquez aucune offre
          </h3>
          <p className="text-sm text-gray-400 mb-5 leading-relaxed">
            Recevez des emails dès qu'une offre correspond à votre profile
          </p>
          <button className="w-full bg-gray-900 text-white font-semibold py-3 rounded-sm text-sm hover:bg-gray-800 transition-colors">
            Activer l'alerte
          </button>
        </div>

      </div>
    </div>
  )
}

// ─────────────────────────────────────────
// DROPDOWN FILTER
// ─────────────────────────────────────────
function DropdownFilter({ name, value, onChange, placeholder, options }) {
  return (
    <div className="relative">
      <select
        name={name}
        value={value}
        onChange={onChange}
        className="appearance-none bg-white border border-gray-200 rounded-sm px-4 py-3 pr-9 text-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
      >
        <option value="">{placeholder}</option>
        {options.map(o => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
      {/* Chevron */}
      <svg
        className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400"
        width="14" height="14" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" strokeWidth="2.5"
      >
        <polyline points="6 9 12 15 18 9"/>
      </svg>
    </div>
  )
}