/**
 * Dashboard layout — wraps all /dashboard/* pages.
 * Fetches user server-side and passes role to Sidebar.
 * Redirects to /login if not authenticated.
 */
import { createClient } from "../../lib/supabase/server";
import { redirect } from "next/navigation";
import Sidebar from "../../components/layout/Sidebar";

export default async function DashboardLayout({ children }) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Server-side auth check — middleware handles redirects
  // but we double-check here for safety
  if (!user) redirect("/login");

  const role = user.user_metadata?.role;

  return (
    <div className="h-screen flex bg-gray-50">
      <aside className="w-60 h-screen sticky top-0 shrink-0">
        <Sidebar role={role} />
      </aside>
      <main className="flex-1 overflow-y-auto bg-[#f4f4f4] p-8">
        {children}
      </main>
    </div>
  );
}
