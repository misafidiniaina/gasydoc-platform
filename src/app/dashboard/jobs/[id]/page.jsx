"use client";

import { useState, useEffect } from "react";
import { createClient } from "../../../../lib/supabase/client";
import { useParams, useRouter } from "next/navigation";

export default function JobDetailPage() {
  const supabase = createClient();
  const { id } = useParams();
  const router = useRouter();

  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const [applied, setApplied] = useState(false);
  const [message, setMessage] = useState("");
  const [user, setUser] = useState(null);

  useEffect(() => {
    loadJob();
  }, [id]);

  async function loadJob() {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    setUser(user);

    const { data: job } = await supabase
      .from("job_posts")
      .select(
        "*, clinics(name, city_id, phone), cities(name), specialties(name)",
      )
      .eq("id", id)
      .single();

    setJob(job);

    // Check if already applied
    if (user) {
      const { data: existing } = await supabase
        .from("applications")
        .select("id")
        .eq("job_id", id)
        .eq("applicant_id", user.id)
        .single();

      if (existing) setApplied(true);
    }

    setLoading(false);
  }

  async function handleApply() {
    setApplying(true);

    const { error } = await supabase.from("applications").insert({
      job_id: id,
      applicant_id: user.id,
      message: message.trim() || null,
      status: "pending",
    });

    setApplying(false);
    if (!error) setApplied(true);
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-400 text-sm">Chargement...</p>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-400 text-sm">Offre introuvable</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Back */}
      <button
        onClick={() => router.back()}
        className="text-sm text-gray-400 hover:text-gray-600 flex items-center gap-1"
      >
        ← Retour
      </button>

      {/* Job header */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6">
        <div className="flex items-center gap-2 mb-3">
          {job.is_urgent && (
            <span className="text-xs bg-red-50 text-red-500 font-medium px-2 py-0.5 rounded-full">
              Urgent
            </span>
          )}
          <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">
            {job.contract_type}
          </span>
        </div>

        <h2 className="text-xl font-bold text-gray-800">{job.title}</h2>
        <p className="text-gray-500 text-sm mt-1">
          {job.clinics?.name} · 📍 {job.cities?.name}
        </p>

        <div className="grid grid-cols-3 gap-3 mt-5">
          <InfoBox label="Spécialité" value={job.specialties?.name} />
          <InfoBox
            label="Expérience min."
            value={
              job.experience_min_years > 0
                ? `${job.experience_min_years} ans`
                : "Non requis"
            }
          />
          <InfoBox label="Horaire" value={job.schedule || "—"} />
        </div>
      </div>

      {/* Description */}
      {job.description && (
        <div className="bg-white rounded-2xl border border-gray-100 p-6">
          <h3 className="font-semibold text-gray-800 mb-3">
            Description du poste
          </h3>
          <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">
            {job.description}
          </p>
        </div>
      )}

      {/* Apply section */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6">
        <h3 className="font-semibold text-gray-800 mb-4">
          {applied ? "Candidature envoyée ✓" : "Postuler à cette offre"}
        </h3>

        {applied ? (
          <div className="bg-green-50 text-green-700 text-sm px-4 py-3 rounded-xl">
            Votre candidature a bien été envoyée. Le cabinet vous contactera si
            votre profil correspond.
          </div>
        ) : (
          <>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Message de motivation (optionnel)..."
              rows={4}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            />
            <button
              onClick={handleApply}
              disabled={applying}
              className="mt-3 w-full bg-blue-600 text-white py-3 rounded-xl font-medium text-sm hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              {applying ? "Envoi..." : "Envoyer ma candidature"}
            </button>
          </>
        )}
      </div>
    </div>
  );
}

function InfoBox({ label, value }) {
  return (
    <div className="bg-gray-50 rounded-xl p-3 text-center">
      <p className="text-xs text-gray-400 mb-1">{label}</p>
      <p className="text-sm font-medium text-gray-700">{value}</p>
    </div>
  );
}
