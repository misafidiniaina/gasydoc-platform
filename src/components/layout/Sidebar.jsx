/**
 * Dashboard sidebar.
 * Shows GasyDoc logo, role-aware nav links, and logout button.
 */
import NavLink from "../../components/layout/NavLink";
import LogoutButton from "../../components/auth/LogoutButton";
import Image from "next/image";

export default function Sidebar({ role }) {
  return (
    <aside className="bg-white border-r border-gray-100 flex flex-col min-h-screen">
      {/* Logo */}
      <div className="p-6 mt-2 mb-6 border-b border-b-[#F3F4F6]">
        <div className="flex items-center gap-2">
          {/* Replace with your actual logo */}
          <Image
            src="/images/logo.png"
            alt="GasyDoc"
            width={50}
            height={50}
            className="object-contain"
          />
          <div>
            <p className="text-[18px] font-bold text-bluebackground leading-none tracking-tight">
              GasyDoc
            </p>
            <p className="text-xs text-gray3 leading-none">Network</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 space-y-2">
        {role === "professional" && (
          <>
            <NavLink
              href="/dashboard"
              exact
              label="Tableau de bord"
              icon={<DashboardIcon />}
            />
            <NavLink
              href="/dashboard/jobs"
              label="Opportunités"
              icon={<JobsIcon />}
            />
            <NavLink
              href="/dashboard/applications"
              label="Mes candidatures"
              icon={<ApplicationsIcon />}
            />
            <NavLink
              href="/profile"
              label="Mon profil"
              icon={<ProfileIcon />}
            />
          </>
        )}
        {role === "clinic" && (
          <>
            <NavLink
              href="/dashboard"
              exact
              label="Tableau de bord"
              icon={<DashboardIcon />}
            />
            <NavLink
              href="/dashboard/posts"
              label="Mes offres"
              icon={<JobsIcon />}
            />
            <NavLink
              href="/dashboard/applications"
              label="Candidatures reçues"
              icon={<ApplicationsIcon />}
            />
            <NavLink
              href="/clinic-profile"
              label="Mon cabinet"
              icon={<ClinicIcon />}
            />
          </>
        )}
      </nav>

      {/* Logout */}
      <div className="p-3 border-t border-gray-100">
        <LogoutButton />
      </div>
    </aside>
  );
}

// ── Icons ──────────────────────────────────
function DashboardIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="3" y="3" width="7" height="7" />
      <rect x="14" y="3" width="7" height="7" />
      <rect x="14" y="14" width="7" height="7" />
      <rect x="3" y="14" width="7" height="7" />
    </svg>
  );
}

function JobsIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="2" y="7" width="20" height="14" rx="2" />
      <path d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2" />
    </svg>
  );
}

function ApplicationsIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
    </svg>
  );
}

function ProfileIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}

function ClinicIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
      <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  );
}
