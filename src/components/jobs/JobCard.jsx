'use client'

/**
 * Displays a single job post card.
 * Used in the jobs listing page.
 */
import Link from 'next/link'
import { getTimeAgo } from '../../lib/utils'
import SignedImage from '../../components/ui/SignedImage'

export default function JobCard({ job }) {
  return (
    <div className="bg-white rounded-sm border border-gray-100 p-6 hover:border-blue-200 hover:shadow-sm transition-all w-full">
      <div className="flex items-start justify-between gap-4">

        {/* Left — clinic + content */}
        <div className="flex-1 min-w-0">

          {/* Clinic header */}
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 aspect-square rounded-full bg-gray1 flex items-center justify-center overflow-hidden shrink-0">
              {job.clinics?.logo_url ? (
                <SignedImage
                  bucket="clinics"
                  path={job.clinics.logo_url}
                  className="w-full h-full object-cover"
                  fallback={
                    <span className="text-sm text-white font-bold">
                      {job.clinics?.name?.charAt(0) || 'C'}
                    </span>
                  }
                />
              ) : (
                <span className="text-sm text-bluebackground font-bold">
                  {job.clinics?.name?.charAt(0) || 'C'}
                </span>
              )}
            </div>
            <span className="text-sm text-gray-600 font-medium">{job.clinics?.name}</span>
          </div>

          {/* Job title */}
          <h3 className="font-bold text-gray-900 text-xl mb-3">{job.title}</h3>

          {/* Description — fixed 3 lines */}
          <p
            className="text-sm text-gray-400 leading-relaxed mb-5"
            style={{
              display: '-webkit-box',
              WebkitLineClamp: 3,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              minHeight: '63px',
            }}
          >
            {job.description || 'Aucune description disponible pour ce poste.'}
          </p>

          {/* City + schedule badges */}
          <div className="flex gap-3 flex-wrap">
            {job.cities?.name && (
              <span className="flex items-center gap-1.5 text-sm text-gray-500 bg-gray-100 px-4 py-2 rounded-full">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/>
                  <circle cx="12" cy="10" r="3"/>
                </svg>
                {job.cities.name}
              </span>
            )}
            {job.schedule && (
              <span className="flex items-center gap-1.5 text-sm text-gray-500 bg-gray-100 px-4 py-2 rounded-full">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10"/>
                  <polyline points="12 6 12 12 16 14"/>
                </svg>
                {job.schedule}
              </span>
            )}
          </div>
        </div>

        {/* Right — urgent + time + action */}
        <div className="flex flex-col items-end justify-between gap-4 shrink-0 self-stretch">

          {job.is_urgent ? (
            <div className="w-10 aspect-square bg-red-50 rounded-sm flex items-center justify-center">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/>
                <line x1="12" y1="9" x2="12" y2="13"/>
                <line x1="12" y1="17" x2="12.01" y2="17"/>
              </svg>
            </div>
          ) : (
            <div />
          )}

          <div className="flex flex-col items-end gap-2">
            <span className="text-xs text-gray-300" suppressHydrationWarning>
              {getTimeAgo(job.created_at)}
            </span>
            <Link
              href={`/dashboard/jobs/${job.id}`}
              className="bg-blue-600 text-white text-sm px-5 py-2.5 rounded-sm hover:bg-blue-700 transition-colors font-medium"
            >
              Postuler
            </Link>
          </div>
        </div>

      </div>
    </div>
  )
}