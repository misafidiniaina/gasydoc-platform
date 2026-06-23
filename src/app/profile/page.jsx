"use client";

/**
 * Professional profile edit page.
 * Handles text fields, avatar upload, CV upload, and availability toggle.
 * Files are stored as paths in DB, signed URLs are generated for display.
 */
import { useState, useEffect } from "react";
import { createClient } from "../../lib/supabase/client";
import { useRouter } from "next/navigation";
import Field, { inputClass } from "../../components/ui/Field";
import Toggle from "../../components/ui/Toggle";
import { uploadFile, getSignedUrl } from "../../lib/storage";

export default function ProfilePage() {
  const supabase = createClient();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [specialties, setSpecialties] = useState([]);
  const [cities, setCities] = useState([]);

  const [form, setForm] = useState({
    full_name: "",
    phone: "",
    bio: "",
    specialty_id: "",
    city_id: "",
    experience_years: "",
    is_available: true,
  });

  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [cvFile, setCvFile] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return router.push("/login");

    const [profileRes, specialtiesRes, citiesRes] = await Promise.all([
      supabase.from("profiles").select("*").eq("id", user.id).single(),
      supabase.from("specialties").select("*"),
      supabase.from("cities").select("*"),
    ]);

    if (profileRes.data) {
      const p = profileRes.data;
      setForm({
        full_name: p.full_name || "",
        phone: p.phone || "",
        bio: p.bio || "",
        specialty_id: p.specialty_id || "",
        city_id: p.city_id || "",
        experience_years: p.experience_years || "",
        is_available: p.is_available ?? true,
      });

      // Generate signed URL for avatar preview
      if (p.avatar_url) {
        const url = await getSignedUrl("profiles", p.avatar_url);
        if (url) setAvatarPreview(url);
      }
    }

    setSpecialties(specialtiesRes.data || []);
    setCities(citiesRes.data || []);
    setLoading(false);
  }

  function handleChange(e) {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  }

  function handleAvatarChange(e) {
    const file = e.target.files[0];
    if (!file) return;
    setAvatarFile(file);
    setAvatarPreview(URL.createObjectURL(file)); // local preview before upload
  }

  async function handleSave() {
  setSaving(true)
  setSuccess(false)

  const { data: { user } } = await supabase.auth.getUser()

  let avatar_url = null
  let cv_url = null

  if (avatarFile) {
    const ext = avatarFile.name.split('.').pop()
    avatar_url = await uploadFile('profiles', `avatars/${user.id}.${ext}`, avatarFile)
  }

  if (cvFile) {
    const ext = cvFile.name.split('.').pop()
    cv_url = await uploadFile('profiles', `cvs/${user.id}.${ext}`, cvFile)
  }

  const updates = {
    ...form,
    experience_years: form.experience_years ? parseInt(form.experience_years) : null,
    specialty_id: form.specialty_id || null,
    city_id: form.city_id || null,
    ...(avatar_url && { avatar_url }),
    ...(cv_url && { cv_url }),
  }

  const { error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', user.id)

  console.log('save error:', error)
  console.log('updates:', updates)

  setSaving(false)
  if (!error) setSuccess(true)
}

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-400 text-sm">Chargement...</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto py-10 px-4 space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-800">Mon profil</h2>
        <p className="text-gray-500 text-sm mt-1">
          Ces informations sont visibles par les cabinets partenaires
        </p>
      </div>

      {/* Avatar */}
      <div className="flex items-center gap-6">
        <div className="w-20 h-20 rounded-full bg-gray-100 overflow-hidden flex items-center justify-center border border-gray-200">
          {avatarPreview ? (
            <img
              src={avatarPreview}
              alt="avatar"
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="text-3xl">👤</span>
          )}
        </div>
        <div>
          <label className="cursor-pointer text-sm text-primary font-medium hover:underline">
            Changer la photo
            <input
              type="file"
              accept="image/*"
              onChange={handleAvatarChange}
              className="hidden"
            />
          </label>
          <p className="text-xs text-gray-400 mt-1">JPG ou PNG, max 2MB</p>
        </div>
      </div>

      <div className="space-y-5">
        <Field label="Nom complet">
          <input
            name="full_name"
            value={form.full_name}
            onChange={handleChange}
            placeholder="Ex: Miora Rakoto"
            className={inputClass}
          />
        </Field>

        <Field label="Téléphone">
          <input
            name="phone"
            value={form.phone}
            onChange={handleChange}
            placeholder="Ex: 034 00 000 00"
            className={inputClass}
          />
        </Field>

        <Field label="Spécialité">
          <select
            name="specialty_id"
            value={form.specialty_id}
            onChange={handleChange}
            className={inputClass}
          >
            <option value="">Sélectionner une spécialité</option>
            {specialties.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>
        </Field>

        <Field label="Ville">
          <select
            name="city_id"
            value={form.city_id}
            onChange={handleChange}
            className={inputClass}
          >
            <option value="">Sélectionner une ville</option>
            {cities.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </Field>

        <Field label="Années d'expérience">
          <input
            name="experience_years"
            type="number"
            min="0"
            value={form.experience_years}
            onChange={handleChange}
            placeholder="Ex: 3"
            className={inputClass}
          />
        </Field>

        <Field label="Biographie">
          <textarea
            name="bio"
            value={form.bio}
            onChange={handleChange}
            placeholder="Décrivez votre parcours, vos compétences..."
            rows={4}
            className={inputClass}
          />
        </Field>

        <Field label="CV (PDF)">
          <input
            type="file"
            accept=".pdf"
            onChange={(e) => setCvFile(e.target.files[0])}
            className="text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-sm file:border-0 file:bg-blue-50 file:text-primary file:text-sm file:font-medium hover:file:bg-blue-100"
          />
        </Field>

        <Toggle
          enabled={form.is_available}
          onChange={() =>
            setForm((prev) => ({ ...prev, is_available: !prev.is_available }))
          }
          label="Disponible pour des opportunités"
          description="Les cabinets pourront vous contacter"
        />
      </div>

      {success && (
        <p className="text-sm text-green-600 bg-green-50 px-4 py-3 rounded-sm">
          ✓ Profil mis à jour avec succès
        </p>
      )}

      <button
        onClick={handleSave}
        disabled={saving}
        className="w-full bg-primary text-white py-3 rounded-sm font-medium text-sm hover:bg-blue-700 transition-colors disabled:opacity-50"
      >
        {saving ? "Enregistrement..." : "Enregistrer mon profil"}
      </button>
    </div>
  );
}
