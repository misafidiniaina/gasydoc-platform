'use client'

/**
 * Applications page — role-aware.
 * Professionals see their sent applications.
 * Clinics see applications received on their job posts.
 */
import { useState, useEffect } from 'react'
import { createClient } from '../../../lib/supabase/client'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import StatusBadge from '../../../components/ui/StatusBadge'
import { getSignedUrl } from '../../../lib/storage'
import { formatDate } from '../../../lib/utils'


export default function ApplicationsPage() {
  const supabase = createClient()
  const searchParams = useSearchParams()
  const postId = searchParams.get('post_id')

  const [role, setRole] = useState(null)
  const [applications, setApplications] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')
  const [search, setSearch] = useState('')

  useEffect(() => { loadApplications() }, [])

  async function loadApplications() {
    const { data: { user } } = await supabase.auth.getUser()
    const userRole = user.user_metadata?.role
    setRole(userRole)

    if (userRole === 'professional') {
      const { data } = await supabase
        .from('applications')
        .select(`
          *,
          job_posts (
            id, title, contract_type, schedule, is_urgent,
            clinics(name), cities(name), specialties(name)
          )
        `)
        .eq('applicant_id', user.id)
        .order('created_at', { ascending: false })

      setApplications(data || [])

    } else {
      const { data: clinic } = await supabase
        .from('clinics')
        .select('id')
        .eq('owner_id', user.id)
        .single()

      const { data: clinicPosts } = await supabase
        .from('job_posts')
        .select('id')
        .eq('clinic_id', clinic?.id)

      const postIds = (clinicPosts || []).map(p => p.id)

      if (postIds.length === 0) {
        setApplications([])
        setLoading(false)
        return
      }

      let query = supabase
        .from('applications')
        .select(`
          *,
          job_posts (
            id, title, contract_type,
            clinics(name), cities(name), specialties(name)
          )
        `)
        .in('job_id', postIds)
        .order('created_at', { ascending: false })

      if (postId) query = query.eq('job_id', postId)

      const { data: apps } = await query

      if (!apps || apps.length === 0) {
        setApplications([])
        setLoading(false)
        return
      }

      const applicantIds = [...new Set(apps.map(a => a.applicant_id))]
      const { data: profiles } = await supabase
        .from('profiles')
        .select('id, full_name, phone, experience_years, avatar_url, cv_url, specialties(name), cities(name)')
        .in('id', applicantIds)

      const profileMap = {}
      profiles?.forEach(p => { profileMap[p.id] = p })

      setApplications(apps.map(app => ({
        ...app,
        profiles: profileMap[app.applicant_id] || null
      })))
    }

    setLoading(false)
  }

  async function updateStatus(appId, status) {
    await supabase
      .from('applications')
      .update({ status })
      .eq('id', appId)

    setApplications(prev =>
      prev.map(a => a.id === appId ? { ...a, status } : a)
    )
  }

  // Filter by status
  const byStatus = filter === 'all'
    ? applications
    : applications.filter(a => a.status === filter)

  // Filter by search (clinic name)
  const filtered = search.trim()
    ? byStatus.filter(a =>
        a.job_posts?.clinics?.name?.toLowerCase().includes(search.toLowerCase()) ||
        a.job_posts?.title?.toLowerCase().includes(search.toLowerCase())
      )
    : byStatus

  const counts = {
    all:      applications.length,
    pending:  applications.filter(a => a.status === 'pending').length,
    accepted: applications.filter(a => a.status === 'accepted').length,
    rejected: applications.filter(a => a.status === 'rejected').length,
  }

  return (
    <div className="max-w-5xl mx-auto space-y-5">

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
          placeholder={role === 'clinic' ? 'Rechercher un candidat' : 'Rechercher , nom de cabinet'}
          className="w-full pl-10 pr-4 py-3.5 bg-white border border-gray-200 rounded-sm text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Title + count */}
      <div>
        <h2 className="text-2xl font-semibold text-textcolor">
          {role === 'clinic' ? 'Candidatures reçues' : 'Mes candidatures'}
        </h2>
        <p className="text-sm text-gray-400 mt-1">
          {applications.length} candidature{applications.length !== 1 ? 's' : ''}
        </p>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-1 border-b border-gray-200">
        {[
          { key: 'all',      label: 'Toutes' },
          { key: 'pending',  label: 'En attente' },
          { key: 'accepted', label: 'Acceptée' },
          { key: 'rejected', label: 'Refusée' },
        ].map(tab => (
          <button
            key={tab.key}
            onClick={() => setFilter(tab.key)}
            className={`px-4 py-2.5 text-sm font-medium transition-colors relative ${
              filter === tab.key
                ? 'text-primary after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {tab.label} ({counts[tab.key] ?? 0})
          </button>
        ))}
      </div>

      {/* List */}
      {loading ? (
        <div className="text-center py-12 text-gray-400 text-sm">Chargement...</div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-sm border border-gray-100">
          <p className="text-gray-400 text-sm">Aucune candidature trouvée</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map(app => (
            role === 'clinic'
              ? <ClinicApplicationCard key={app.id} app={app} onUpdateStatus={updateStatus} />
              : <ProfessionalApplicationCard key={app.id} app={app} />
          ))}
        </div>
      )}
    </div>
  )
}

// ─────────────────────────────────────────
// PROFESSIONAL APPLICATION CARD
// ─────────────────────────────────────────
function ProfessionalApplicationCard({ app }) {
  const job = app.job_posts

  // Format date as DD/MM/YY
  const date = new Date(app.created_at)
  const formatted = `${String(date.getDate()).padStart(2, '0')}/${String(date.getMonth() + 1).padStart(2, '0')}/${String(date.getFullYear()).slice(-2)}`

  return (
    <div className="bg-white rounded-sm border border-gray-100 p-6">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">

          {/* Date + status */}
          <p className="text-sm font-regular text-textcolor mb-2" suppressHydrationWarning>
            {formatDate(app.created_at)}
          </p>
          <StatusBadge status={app.status} />

          {/* Job info */}
          <div className="mt-5">
            <h3 className="font-medium text-textcolor2">{job?.title}</h3>
            <p className="text-sm text-gray3">{job?.clinics?.name}</p>
          </div>
        </div>

        {/* Action */}
        <Link
          href={`/dashboard/jobs/${job?.id}`}
          className="shrink-0 text-sm text-primary border border-primary px-4 py-2 rounded-sm hover:bg-blue-50 transition-colors"
        >
          Revoir l'offre
        </Link>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────
// CLINIC APPLICATION CARD
// ─────────────────────────────────────────
function ClinicApplicationCard({ app, onUpdateStatus }) {
  const profile = app.profiles
  const job = app.job_posts

  const [cvUrl, setCvUrl] = useState(null)
  const [avatarUrl, setAvatarUrl] = useState(null)

  useEffect(() => {
    async function loadSignedUrls() {
      if (profile?.cv_url) {
        const url = await getSignedUrl('profiles', profile.cv_url)
        setCvUrl(url)
      }
      if (profile?.avatar_url) {
        const url = await getSignedUrl('profiles', profile.avatar_url)
        setAvatarUrl(url)
      }
    }
    loadSignedUrls()
  }, [profile])

  const date = new Date(app.created_at)
  const F = `${String(date.getDate()).padStart(2, '0')}/${String(date.getMonth() + 1).padStart(2, '0')}/${String(date.getFullYear()).slice(-2)}`

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-6">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-4 flex-1">

          {/* Avatar */}
          <div className="w-12 h-12 rounded-full bg-gray-100 overflow-hidden shrink-0 flex items-center justify-center">
            {avatarUrl
              ? <img src={avatarUrl} className="w-full h-full object-cover" alt="avatar" />
              : <span className="text-xl">👤</span>
            }
          </div>

          <div className="flex-1">
            {/* Date */}
            <p className="text-sm font-medium text-gray-700 mb-2" suppressHydrationWarning>
              {formatDate(app.created_at)}
            </p>
            <StatusBadge status={app.status} />

            <div className="mt-3">
              <h3 className="font-semibold text-gray-800">
                {profile?.full_name || 'Candidat anonyme'}
              </h3>
              <p className="text-sm text-gray-400 mt-0.5">
                {profile?.specialties?.name} · {profile?.cities?.name}
              </p>
              {profile?.experience_years && (
                <p className="text-xs text-gray-400 mt-0.5">
                  {profile.experience_years} ans d'expérience
                </p>
              )}
              <p className="text-xs text-blue-600 mt-1">Poste : {job?.title}</p>

              {app.message && (
                <p className="mt-2 text-xs text-gray-500 italic bg-gray-50 px-3 py-2 rounded-xl">
                  "{app.message}"
                </p>
              )}

              {cvUrl && (
                
                <a  href={cvUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 inline-block text-xs text-blue-600 hover:underline"
                >
                  📄 Voir le CV
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col items-end gap-2 shrink-0">
          <div className="flex gap-2">
            <button
              onClick={() => onUpdateStatus(app.id, 'accepted')}
              disabled={app.status === 'accepted'}
              className="text-xs bg-green-50 text-green-600 px-3 py-1.5 rounded-xl hover:bg-green-100 transition-colors disabled:opacity-40"
            >
              Accepter
            </button>
            <button
              onClick={() => onUpdateStatus(app.id, 'rejected')}
              disabled={app.status === 'rejected'}
              className="text-xs bg-red-50 text-red-500 px-3 py-1.5 rounded-xl hover:bg-red-100 transition-colors disabled:opacity-40"
            >
              Refuser
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}