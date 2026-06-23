/**
 * Dashboard home — role-aware.
 * Renders ProfessionalDashboard or ClinicDashboard.
 */
import { createClient } from "../../lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import StatCard from "../../components/ui/StatCard";
import StatusBadge from "../../components/ui/StatusBadge";
import { getCompletionScore } from "../../lib/utils";

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");
  const role = user.user_metadata?.role;
  if (role === "clinic")
    return <ClinicDashboard supabase={supabase} user={user} />;
  return <ProfessionalDashboard supabase={supabase} user={user} />;
}

// ─────────────────────────────────────────
// PROFESSIONAL DASHBOARD
// ─────────────────────────────────────────
async function ProfessionalDashboard({ supabase, user }) {
  const { data: profile } = await supabase
    .from("profiles")
    .select("*, specialties(name), cities(name)")
    .eq("id", user.id)
    .single();

  const { data: applications } = await supabase
    .from("applications")
    .select("*, job_posts(title, clinics(name))")
    .eq("applicant_id", user.id)
    .order("created_at", { ascending: false })
    .limit(5);

  // Build jobs query — filter by specialty only if set
  let jobsQuery = supabase
    .from("job_posts")
    .select("*, clinics(name, logo_url), cities(name), specialties(name)")
    .eq("is_active", true)
    .order("created_at", { ascending: false })
    .limit(6);

  if (profile?.specialty_id) {
    jobsQuery = jobsQuery.eq("specialty_id", profile.specialty_id);
  }

  const { data: jobs } = await jobsQuery;

  // Generate signed URLs for clinic logos
  const jobsWithLogoUrls = await Promise.all(
    (jobs || []).map(async (job) => {
      if (!job.clinics?.logo_url) return job;

      const { data } = await supabase.storage
        .from("clinics")
        .createSignedUrl(job.clinics.logo_url, 3600);

      return {
        ...job,
        clinics: {
          ...job.clinics,
          logo_url: data?.signedUrl || null,
        },
      };
    }),
  );

  const completion = getCompletionScore(profile, [
    "full_name",
    "phone",
    "bio",
    "specialty_id",
    "city_id",
    "experience_years",
    "avatar_url",
    "cv_url",
  ]);

  return (
    <div className="max-w-5xl mx-auto space-y-4">
      {/* Hero banner */}
      <div className="rounded-lg bg-linear-to-r from-[#011F4C] to-[#0245A6] px-8 py-12">
        <p className="text-white/90 text-sm mb-1">Hey 👋</p>
        <h2 className="text-white text-[1.75rem] font-semibold">
          {profile?.full_name || "Professionnel"}
        </h2>
      </div>

      {/* Profile completion */}
      {completion < 100 && (
        <div className="bg-white rounded-lg px-7 py-5 flex items-center justify-between">
          <div className="flex-1">
            <p className="text-[18px] font-semibold text-textcolor">
              Votre profil est complété à{" "}
              <span className="text-primary font-bold">{completion}%</span>
            </p>
            <p className="text-xs text-gray3 mt-1">
              Un profil complet augmente vos chances d'être contacté
            </p>
            <div className="mt-5 h-2 bg-gray4 rounded-full w-72">
              <div
                className="h-2 bg-bluebackground rounded-full transition-all"
                style={{ width: `${completion}%` }}
              />
            </div>
          </div>
          <Link
            href="/profile"
            className="ml-6 bg-primary text-white px-5 py-2.5 rounded-[5px] text-sm font-medium hover:bg-blue-700 transition-colors"
          >
            Compléter
          </Link>
        </div>
      )}

      {/* Stats — 4 cards */}
      <div className="grid grid-cols-4 mt-7 gap-4">
        <StatCard
          label="Candidatures envoyées"
          value={applications?.length ?? 0}
          icon={<SendIcon />}
        />
        <StatCard
          label="Nombre de vues"
          value={profile?.views ?? 0}
          icon={<EyeIcon />}
        />
        <StatCard
          label="Spécialités"
          value={profile?.specialties?.name ?? "—"}
          icon={<StethoscopeIcon />}
          text={true}
        />
        <StatCard
          label="Disponibilité"
          value={profile?.is_available ? "Disponible" : "Indisponible"}
          icon={<AvailabilityIcon />}
          highlight={profile?.is_available}
          text={true}
        />
      </div>

      {/* Suggested jobs — horizontal scroll */}
      {jobsWithLogoUrls?.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-800 text-lg">
              Des offres pour vous
            </h3>
            <Link
              href="/dashboard/jobs"
              className="text-sm text-primary hover:underline"
            >
              Voir toutes
            </Link>
          </div>
          <div className="flex gap-4 overflow-x-auto pb-2 -mx-1 px-1">
            {jobsWithLogoUrls.map((job) => (
              <JobOfferCard key={job.id} job={job} />
            ))}
          </div>
        </div>
      )}

      {/* Recent applications */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-gray-800 text-lg">
            Mes dernières candidatures
          </h3>
          <Link
            href="/dashboard/applications"
            className="text-sm text-primary hover:underline"
          >
            Voir toutes
          </Link>
        </div>
        {applications?.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-100 p-8 text-center">
            <p className="text-gray-400 text-sm">
              Vous n'avez pas encore postulé
            </p>
            <Link
              href="/dashboard/jobs"
              className="mt-2 inline-block text-sm text-blue-600 hover:underline"
            >
              Voir les opportunités →
            </Link>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-gray-100 divide-y divide-gray-50">
            {applications.map((app) => (
              <div
                key={app.id}
                className="flex items-center justify-between px-5 py-4"
              >
                <div>
                  <p className="text-sm font-medium text-gray-800">
                    {app.job_posts?.title}
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {app.job_posts?.clinics?.name}
                  </p>
                </div>
                <StatusBadge status={app.status} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────
// JOB OFFER CARD (horizontal scroll)
// ─────────────────────────────────────────
function JobOfferCard({ job }) {
  return (
    <Link
      href={`/dashboard/jobs/${job.id}`}
      className="shrink-0 bg-white rounded-2xl border border-gray-100 p-6 hover:border-blue-200 hover:shadow-sm transition-all"
      style={{ width: "695px" }}
    >
      {/* Clinic header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-linear-to-br from-purple-400 to-blue-500 flex items-center justify-center overflow-hidden shrink-0">
            {job.clinics?.logo_url ? (
              <img
                src={job.clinics.logo_url}
                className="w-full h-full object-cover"
                alt=""
              />
            ) : (
              <span className="text-sm text-white font-bold">
                {job.clinics?.name?.charAt(0) || "C"}
              </span>
            )}
          </div>
          <span className="text-sm text-gray-600 font-medium">
            {job.clinics?.name}
          </span>
        </div>

        {/* Urgent icon */}
        {job.is_urgent && (
          <div className="w-12 h-12 bg-red-50 rounded-sm flex items-center justify-center shrink-0">
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#ef4444"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
              <line x1="12" y1="9" x2="12" y2="13" />
              <line x1="12" y1="17" x2="12.01" y2="17" />
            </svg>
          </div>
        )}
      </div>

      {/* Job title */}
      <h4 className="font-bold text-gray-900 text-xl mb-3">{job.title}</h4>

      {/* Description — fixed 3 lines height */}
      <p
        className="text-sm text-gray-400 leading-relaxed mb-5"
        style={{
          display: "-webkit-box",
          WebkitLineClamp: 3,
          WebkitBoxOrient: "vertical",
          overflow: "hidden",
          minHeight: "63px", // 3 lines × 21px line-height
        }}
      >
        {job.description || "Aucune description disponible pour ce poste."}
      </p>

      {/* Badges */}
      <div className="flex gap-3">
        {job.cities?.name && (
          <span className="flex items-center gap-1.5 text-sm text-gray-500 bg-gray-100 px-4 py-2 rounded-full">
            <svg
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
              <circle cx="12" cy="10" r="3" />
            </svg>
            {job.cities.name}
          </span>
        )}
        {job.schedule && (
          <span className="flex items-center gap-1.5 text-sm text-gray-500 bg-gray-100 px-4 py-2 rounded-full">
            <svg
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
            {job.schedule}
          </span>
        )}
      </div>
    </Link>
  );
}
// ─────────────────────────────────────────
// CLINIC DASHBOARD
// ─────────────────────────────────────────
async function ClinicDashboard({ supabase, user }) {
  const { data: clinic } = await supabase
    .from("clinics")
    .select("*, cities(name)")
    .eq("owner_id", user.id)
    .single();

  const { data: posts } = await supabase
    .from("job_posts")
    .select(
      "id, title, is_active, is_urgent, created_at, specialties(name), cities(name)",
    )
    .eq("clinic_id", clinic?.id)
    .order("created_at", { ascending: false })
    .limit(5);

  const postIds = (posts || []).map((p) => p.id);

  const postsWithCount = await Promise.all(
    (posts || []).map(async (post) => {
      const { count } = await supabase
        .from("applications")
        .select("*", { count: "exact", head: true })
        .eq("job_id", post.id);
      return { ...post, application_count: count || 0 };
    }),
  );

  const totalApplications = postsWithCount.reduce(
    (sum, p) => sum + p.application_count,
    0,
  );

  const { data: recentApplications } =
    postIds.length > 0
      ? await supabase
          .from("applications")
          .select("*, job_posts(title), profiles(full_name)")
          .in("job_id", postIds)
          .order("created_at", { ascending: false })
          .limit(5)
      : { data: [] };

  const completion = getCompletionScore(clinic, [
    "name",
    "phone",
    "description",
    "city_id",
    "logo_url",
  ]);

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Hero banner */}
      <div className="rounded-lg bg-linear-to-r from-[#011F4C] to-[#0245A6] px-8 py-12">
        <p className="text-white/70 text-sm mb-1">Hey 👋</p>
        <h2 className="text-white text-3xl font-bold">
          {clinic?.name || "Cabinet"}
        </h2>
      </div>

      {/* Profile completion */}
      {completion < 100 && (
        <div className="bg-white rounded-lg px-7 py-5 flex items-center justify-between">
          <div className="flex-1">
            <p className="text-[18px] font-semibold text-textcolor">
              Votre profil cabinet est complété à {" "}
              <span className="text-primary font-bold">{completion}%</span>
            </p>
            <p className="text-xs text-gray3 mt-1">
              Un profil complet attire plus de candidats qualifiés
            </p>
            <div className="mt-5 h-2 bg-gray4 rounded-full w-72">
              <div
                className="h-2 bg-bluebackground rounded-full transition-all"
                style={{ width: `${completion}%` }}
              />
            </div>
          </div>
          <Link
            href="/clinic-profile"
            className="ml-6 bg-primary text-white px-5 py-2.5 rounded-[5px] text-sm font-medium hover:bg-blue-700 transition-colors"
          >
            Compléter
          </Link>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <StatCard
          label="Offres publiées"
          value={posts?.length ?? 0}
          icon={<JobsIcon />}
        />
        <StatCard
          label="Candidatures reçues"
          value={totalApplications}
          icon={<ApplicationsIcon />}
        />
        <StatCard
          label="Offres actives"
          value={posts?.filter((p) => p.is_active).length ?? 0}
          icon={<AvailabilityIcon />}
          highlight={posts?.some((p) => p.is_active)}
        />
      </div>

      {/* Recent applications */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-gray-800 text-lg">
            Dernières candidatures reçues
          </h3>
          <Link
            href="/dashboard/applications"
            className="text-sm text-primary hover:underline"
          >
            Voir toutes
          </Link>
        </div>
        {recentApplications?.length === 0 ? (
          <div className="bg-white rounded-sm border border-gray-100 p-8 text-center">
            <p className="text-gray-400 text-sm">Aucune candidature reçue</p>
            <Link
              href="/dashboard/posts/new"
              className="mt-2 inline-block text-sm text-primary hover:underline"
            >
              Publier une offre →
            </Link>
          </div>
        ) : (
          <div className="bg-white rounded-sm border border-gray-100 divide-y divide-gray-50">
            {(recentApplications || []).map((app) => (
              <div
                key={app.id}
                className="flex items-center justify-between px-5 py-4"
              >
                <div>
                  <p className="text-sm font-medium text-gray-800">
                    {app.profiles?.full_name || "Candidat"}
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {app.job_posts?.title}
                  </p>
                </div>
                <StatusBadge status={app.status} />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Recent posts */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-gray-800 text-lg">
            Mes offres récentes
          </h3>
          <Link
            href="/dashboard/posts"
            className="text-sm text-primary hover:underline"
          >
            Voir toutes
          </Link>
        </div>
        {postsWithCount.length === 0 ? (
          <div className="bg-white rounded-sm border border-gray-100 p-8 text-center">
            <p className="text-gray-400 text-sm">Aucune offre publiée</p>
            <Link
              href="/dashboard/posts/new"
              className="mt-2 inline-block text-sm text-primary hover:underline"
            >
              Créer une offre →
            </Link>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-gray-100 divide-y divide-gray-50">
            {(postsWithCount || []).map((post) => (
              <div
                key={post.id}
                className="flex items-center justify-between px-5 py-4"
              >
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                        post.is_active
                          ? "bg-green-50 text-green-600"
                          : "bg-gray-100 text-gray-400"
                      }`}
                    >
                      {post.is_active ? "Active" : "Inactive"}
                    </span>
                    {post.is_urgent && (
                      <span className="text-xs bg-red-50 text-red-500 px-2 py-0.5 rounded-full">
                        Urgent
                      </span>
                    )}
                  </div>
                  <p className="text-sm font-medium text-gray-800">
                    {post.title}
                  </p>
                  <p className="text-xs text-gray-400">
                    {post.specialties?.name} · {post.cities?.name}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-blue-600">
                    {post.application_count}
                  </p>
                  <p className="text-xs text-gray-400">
                    candidature{post.application_count !== 1 ? "s" : ""}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────
// STAT ICONS
// ─────────────────────────────────────────
function SendIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="url(#grad1)"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <defs>
        <linearGradient id="grad1" x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#011B40" />
          <stop offset="100%" stopColor="#0245a6" />
        </linearGradient>
      </defs>
      <line x1="22" y1="2" x2="11" y2="13" />
      <polygon points="22 2 15 22 11 13 2 9 22 2" />
    </svg>
  );
}

function EyeIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="url(#grad2)"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <defs>
        <linearGradient id="grad2" x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#011B40" />
          <stop offset="100%" stopColor="#0245a6" />
        </linearGradient>
      </defs>
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function StethoscopeIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="url(#grad3)"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <defs>
        <linearGradient id="grad3" x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#011B40" />
          <stop offset="100%" stopColor="#0245a6" />
        </linearGradient>
      </defs>
      <path d="M4.8 2.3A.3.3 0 105 2H4a2 2 0 00-2 2v5a6 6 0 006 6 6 6 0 006-6V4a2 2 0 00-2-2h-1a.2.2 0 10.3.3" />
      <path d="M8 15v1a6 6 0 006 6 6 6 0 006-6v-4" />
      <circle cx="20" cy="10" r="2" />
    </svg>
  );
}

function AvailabilityIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="url(#grad4)"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <defs>
        <linearGradient id="grad4" x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#011B40" />
          <stop offset="100%" stopColor="#0245a6" />
        </linearGradient>
      </defs>
      <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
    </svg>
  );
}

function JobsIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="url(#grad5)"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <defs>
        <linearGradient id="grad5" x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#011B40" />
          <stop offset="100%" stopColor="#0245a6" />
        </linearGradient>
      </defs>
      <rect x="2" y="7" width="20" height="14" rx="2" />
      <path d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2" />
    </svg>
  );
}

function ApplicationsIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="url(#grad6)"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <defs>
        <linearGradient id="grad6" x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#011B40" />
          <stop offset="100%" stopColor="#0245a6" />
        </linearGradient>
      </defs>
      <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
    </svg>
  );
}
