"use client";

/**
 * Clinic job posts list.
 * Shows all job posts created by the logged-in clinic
 * with application counts and active/inactive toggle.
 */
import { useState, useEffect } from "react";
import { createClient } from "../../../lib/supabase/client";
import Link from "next/link";
import { getTimeAgo } from "../../../lib/utils";

export default function PostsPage() {
  const supabase = createClient();

  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPosts();
  }, []);

  async function loadPosts() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    const { data: clinic } = await supabase
      .from("clinics")
      .select("id")
      .eq("owner_id", user.id)
      .single();

    if (!clinic) return setLoading(false);

    const { data: posts } = await supabase
      .from("job_posts")
      .select("*, specialties(name), cities(name)")
      .eq("clinic_id", clinic.id)
      .order("created_at", { ascending: false });

    // Fetch application count for each post
    const postsWithCount = await Promise.all(
      (posts || []).map(async (post) => {
        const { count } = await supabase
          .from("applications")
          .select("*", { count: "exact", head: true })
          .eq("job_id", post.id);
        return { ...post, application_count: count || 0 };
      }),
    );

    setPosts(postsWithCount);
    setLoading(false);
  }

  async function toggleActive(postId, currentState) {
    await supabase
      .from("job_posts")
      .update({ is_active: !currentState })
      .eq("id", postId);

    // Optimistic update — no need to refetch
    setPosts((prev) =>
      prev.map((p) =>
        p.id === postId ? { ...p, is_active: !currentState } : p,
      ),
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-gray-800">
            Mes offres d'emploi
          </h2>
          <p className="text-gray-500 text-sm mt-1">
            {posts.length} offre{posts.length !== 1 ? "s" : ""} publiée
            {posts.length !== 1 ? "s" : ""}
          </p>
        </div>
        <Link
          href="/dashboard/posts/new"
          className="bg-primary text-white px-4 py-2.5 rounded-sm text-sm font-medium hover:bg-blue-700 transition-colors"
        >
          + Nouvelle offre
        </Link>
      </div>

      {loading ? (
        <div className="text-center py-12 text-gray-400 text-sm">
          Chargement...
        </div>
      ) : posts.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-lg border border-gray-100">
          <p className="text-4xl mb-3">📝</p>
          <p className="text-gray-600 font-medium">Aucune offre publiée</p>
          <p className="text-gray-400 text-sm mt-1">
            Créez votre première offre pour commencer à recevoir des
            candidatures
          </p>
          <Link
            href="/dashboard/posts/new"
            className="mt-4 inline-block bg-primary text-white px-5 py-2.5 rounded-sm text-sm font-medium hover:bg-blue-700 transition-colors"
          >
            Créer une offre
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {posts.map((post) => (
            <div
              key={post.id}
              className="bg-white rounded-2xl border border-gray-100 p-5"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span
                      className={`text-xs font-medium px-2 py-0.5 rounded-full ${
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
                    <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">
                      {post.contract_type}
                    </span>
                  </div>
                  <h3 className="font-semibold text-gray-800">{post.title}</h3>
                  <p className="text-sm text-gray-500 mt-0.5">
                    {post.specialties?.name} · 📍 {post.cities?.name}
                  </p>
                  <div className="mt-3 flex items-center gap-1.5">
                    <span className="text-2xl font-bold text-primary">
                      {post.application_count}
                    </span>
                    <span className="text-sm text-gray-400">
                      candidature{post.application_count !== 1 ? "s" : ""} reçue
                      {post.application_count !== 1 ? "s" : ""}
                    </span>
                  </div>
                </div>

                <div className="flex flex-col items-end gap-2 shrink-0">
                  <span
                    className="text-xs text-gray-300"
                    suppressHydrationWarning
                  >
                    {getTimeAgo(post.created_at)}
                  </span>
                  <Link
                    href={`/dashboard/applications?post_id=${post.id}`}
                    className="text-sm text-primary border border-blue-200 px-3 py-1.5 rounded-xl hover:bg-blue-50 transition-colors"
                  >
                    Voir candidatures
                  </Link>
                  <button
                    onClick={() => toggleActive(post.id, post.is_active)}
                    className="text-xs text-gray-400 hover:text-gray-600"
                  >
                    {post.is_active ? "Désactiver" : "Réactiver"}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
