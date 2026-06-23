'use client'

/**
 * Create new job post form — clinic only.
 * On submit, inserts into job_posts table and redirects to posts list.
 */
import { useState, useEffect } from 'react'
import { createClient } from '../../../../lib/supabase/client'
import { useRouter } from 'next/navigation'
import Field, { inputClass } from './../../../../components/ui/Field'
import Toggle from '../../../../components/ui/Toggle'

export default function NewPostPage() {
  const supabase = createClient()
  const router = useRouter()

  const [specialties, setSpecialties] = useState([])
  const [cities, setCities] = useState([])
  const [loading, setLoading] = useState(false)
  const [clinicId, setClinicId] = useState(null)

  const [form, setForm] = useState({
    title: '',
    specialty_id: '',
    city_id: '',
    contract_type: '',
    schedule: '',
    experience_min_years: '',
    description: '',
    is_urgent: false,
  })

  useEffect(() => { loadData() }, [])

  async function loadData() {
    const { data: { user } } = await supabase.auth.getUser()

    const [clinicRes, specialtiesRes, citiesRes] = await Promise.all([
      supabase.from('clinics').select('id').eq('owner_id', user.id).single(),
      supabase.from('specialties').select('*'),
      supabase.from('cities').select('*'),
    ])

    setClinicId(clinicRes.data?.id)
    setSpecialties(specialtiesRes.data || [])
    setCities(citiesRes.data || [])
  }

  function handleChange(e) {
    const { name, value, type, checked } = e.target
    setForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  async function handleSubmit() {
    if (!form.title || !form.specialty_id || !form.city_id || !form.contract_type) return

    setLoading(true)

    const { error } = await supabase.from('job_posts').insert({
      clinic_id: clinicId,
      title: form.title,
      specialty_id: form.specialty_id,
      city_id: form.city_id,
      contract_type: form.contract_type,
      schedule: form.schedule || null,
      experience_min_years: form.experience_min_years ? parseInt(form.experience_min_years) : 0,
      description: form.description || null,
      is_urgent: form.is_urgent,
      is_active: true,
    })

    setLoading(false)
    if (!error) router.push('/dashboard/posts')
  }

  const isValid = form.title && form.specialty_id && form.city_id && form.contract_type

  return (
    <div className="max-w-2xl mx-auto space-y-6">

      <div>
        <h2 className="text-2xl font-bold text-gray-800">Nouvelle offre d'emploi</h2>
        <p className="text-gray-500 text-sm mt-1">Les champs marqués * sont obligatoires</p>
      </div>

      <div className="bg-white rounded-lg border border-gray-100 p-6 space-y-5">

        <Field label="Titre du poste *">
          <input
            name="title"
            value={form.title}
            onChange={handleChange}
            placeholder="Ex: Médecin généraliste, Infirmier(e)..."
            className={inputClass}
          />
        </Field>

        <div className="grid grid-cols-2 gap-4">
          <Field label="Spécialité *">
            <select name="specialty_id" value={form.specialty_id} onChange={handleChange} className={inputClass}>
              <option value="">Sélectionner</option>
              {specialties.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>
          </Field>
          <Field label="Ville *">
            <select name="city_id" value={form.city_id} onChange={handleChange} className={inputClass}>
              <option value="">Sélectionner</option>
              {cities.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </Field>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Field label="Type de contrat *">
            <select name="contract_type" value={form.contract_type} onChange={handleChange} className={inputClass}>
              <option value="">Sélectionner</option>
              <option value="Temps plein">Temps plein</option>
              <option value="Temps partiel">Temps partiel</option>
              <option value="Vacation">Vacation</option>
              <option value="Week-end">Week-end</option>
            </select>
          </Field>
          <Field label="Horaire">
            <select name="schedule" value={form.schedule} onChange={handleChange} className={inputClass}>
              <option value="">Sélectionner</option>
              <option value="Jour">Jour</option>
              <option value="Nuit">Nuit</option>
              <option value="Après-midi">Après-midi</option>
            </select>
          </Field>
        </div>

        <Field label="Expérience minimum (années)">
          <input
            name="experience_min_years"
            type="number"
            min="0"
            value={form.experience_min_years}
            onChange={handleChange}
            placeholder="0"
            className={inputClass}
          />
        </Field>

        <Field label="Description du poste">
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="Décrivez le poste, les missions, les avantages..."
            rows={5}
            className={inputClass}
          />
        </Field>

        <Toggle
          enabled={form.is_urgent}
          onChange={() => setForm(prev => ({ ...prev, is_urgent: !prev.is_urgent }))}
          label="Marquer comme urgent"
          description='L&apos;offre sera mise en avant avec un badge "Urgent"'
          activeColor="bg-red-500"
        />
      </div>

      <div className="flex gap-3">
        <button
          onClick={() => router.back()}
          className="flex-1 border border-gray-200 text-gray-600 py-3 rounded-sm text-sm font-medium hover:bg-gray-50 transition-colors"
        >
          Annuler
        </button>
        <button
          onClick={handleSubmit}
          disabled={loading || !isValid}
          className="flex-1 bg-primary text-white py-3 rounded-sm text-sm font-medium hover:bg-blue-700 transition-colors"
        >
          {loading ? 'Publication...' : "Publier l'offre"}
        </button>
      </div>
    </div>
  )
}