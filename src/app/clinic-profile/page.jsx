"use client";

/**
 * Clinic profile edit page.
 * Handles clinic info and logo upload.
 * Logo is stored as path in DB, signed URL generated for display.
 */
import { useState, useEffect } from "react";
import { createClient } from "../../lib/supabase/client";
import { useRouter } from "next/navigation";
import Field, { inputClass } from "../../components/ui/Field";
import { uploadFile, getSignedUrl } from "../../lib/storage";

export default function ClinicProfilePage() {
  const supabase = createClient();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [cities, setCities] = useState([]);

  const [form, setForm] = useState({
    name: "",
    phone: "",
    description: "",
    city_id: "",
  });

  const [logoFile, setLogoFile] = useState(null);
  const [logoPreview, setLogoPreview] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return router.push("/login");

    const [clinicRes, citiesRes] = await Promise.all([
      supabase.from("clinics").select("*").eq("owner_id", user.id).single(),
      supabase.from("cities").select("*"),
    ]);

    if (clinicRes.data) {
      const c = clinicRes.data;
      setForm({
        name: c.name || "",
        phone: c.phone || "",
        description: c.description || "",
        city_id: c.city_id || "",
      });

      // Generate signed URL for logo preview
      if (c.logo_url) {
        const url = await getSignedUrl("clinics", c.logo_url);
        if (url) setLogoPreview(url);
      }
    }

    setCities(citiesRes.data || []);
    setLoading(false);
  }

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  function handleLogoChange(e) {
    const file = e.target.files[0];
    if (!file) return;
    setLogoFile(file);
    setLogoPreview(URL.createObjectURL(file)); // local preview before upload
  }

  async function handleSave() {
    setSaving(true);
    setSuccess(false);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    let logo_url = null;

    if (logoFile) {
      const ext = logoFile.name.split(".").pop();
      logo_url = await uploadFile(
        "clinics",
        `logos/${user.id}.${ext}`,
        logoFile,
      );
    }

    const updates = {
      ...form,
      city_id: form.city_id || null, // ← empty string → null
      ...(logo_url && { logo_url }),
    };

    const { error } = await supabase
      .from("clinics")
      .update(updates)
      .eq("owner_id", user.id);

    console.log("save error:", error);
    console.log("updates:", updates);

    setSaving(false);
    if (!error) setSuccess(true);
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <p className="text-gray-400 text-sm">Chargement...</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto py-10 px-4 space-y-8 bg-white">
      <div>
        <h2 className="text-2xl font-bold text-gray-800">Profil du cabinet</h2>
        <p className="text-gray-500 text-sm mt-1">
          Ces informations sont visibles par les professionnels de santé
        </p>
      </div>

      {/* Logo */}
      <div className="flex items-center gap-6">
        <div className="w-20 h-20 rounded-2xl bg-gray-100 overflow-hidden flex items-center justify-center border border-gray-200">
          {logoPreview ? (
            <img
              src={logoPreview}
              alt="logo"
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="text-3xl">🏥</span>
          )}
        </div>
        <div>
          <label className="cursor-pointer text-sm text-primary font-medium hover:underline">
            Changer le logo
            <input
              type="file"
              accept="image/*"
              onChange={handleLogoChange}
              className="hidden"
            />
          </label>
          <p className="text-xs text-gray-400 mt-1">JPG ou PNG, max 2MB</p>
        </div>
      </div>

      <div className="space-y-5">
        <Field label="Nom du cabinet *">
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Ex: Clinique Sainte Marie"
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

        <Field label="Description">
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="Décrivez votre cabinet, vos spécialités, votre équipe..."
            rows={4}
            className={inputClass}
          />
        </Field>
      </div>

      {success && (
        <p className="text-sm text-green-600 bg-green-50 px-4 py-3 rounded-sm">
          ✓ Profil mis à jour avec succès
        </p>
      )}

      <button
        onClick={handleSave}
        disabled={saving || !form.name}
        className="w-full bg-primary text-white py-3 rounded-sm font-medium text-sm hover:bg-blue-700 transition-colors disabled:opacity-50"
      >
        {saving ? "Enregistrement..." : "Enregistrer"}
      </button>
    </div>
  );
}
