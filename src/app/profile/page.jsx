'use client'

import { useState, useEffect } from 'react'
import { createClient } from '../../lib/supabase/client'
import { useRouter } from 'next/navigation'
import { uploadFile, getSignedUrl } from '../../lib/storage'
import {
  User,
  Phone,
  Link,
  FileText,
  Stethoscope,
  Calendar,
  Zap,
  Briefcase,
  GraduationCap,
  Check,
  AlertCircle,
  CloudUpload,
  X,
  ChevronLeft,
  ChevronRight,
  ArrowLeft,
  Plus,
  MapPin,
  Globe,
  Globe2,
  Eye,
} from "lucide-react";
// ─── Constants ────────────────────────────────────────────────────────────────

const TABS = [
  { key: 'info',           label: 'Informations',   hint: 'Un profil avec photo reçoit 3× plus de contacts.',                               icon: User },
  { key: 'classification', label: 'Classification', hint: 'Indispensable pour apparaître dans les recherches des cabinets.',                icon: Stethoscope },
  { key: 'availability',   label: 'Disponibilité',  hint: 'Les cabinets filtrent par disponibilité pour trouver des candidats.',            icon: Calendar },
  { key: 'skills',         label: 'Compétences',    hint: 'Les compétences rares augmentent votre visibilité.',                            icon: Zap },
  { key: 'missions',       label: 'Missions',       hint: 'Précisez vos disponibilités pour recevoir des offres ciblées.',                 icon: Briefcase },
  { key: 'diplomas',       label: 'Diplômes',       hint: 'Les diplômes renforcent votre crédibilité professionnelle.',                    icon: GraduationCap },
]

const CATEGORIES = [
  'Professionnel médical', 'Professionnel paramédical', 'Technicien de santé',
  'Pharmacie', 'Santé publique et ONG', 'Universitaire', 'Responsable de structure',
]

const PROFESSIONS = {
  'Professionnel médical':     ['Médecin généraliste', 'Médecin de famille', 'Médecin spécialiste', 'Chirurgien', 'Dentiste'],
  'Professionnel paramédical': ['Infirmier(e)', 'Sage-femme', 'Kinésithérapeute', 'Masseur thérapeute', 'Orthophoniste', 'Ergothérapeute'],
  'Technicien de santé':       ['Technicien supérieur de santé', 'Technicien de laboratoire', 'Manipulateur radio', 'Technicien biomédical'],
  'Pharmacie':                 ['Pharmacien', 'Préparateur'],
  'Santé publique et ONG':     ['Nutritionniste', 'Épidémiologiste', 'Gestionnaire de projets santé', 'Responsable S&E'],
  'Universitaire':             ['Interne des Hôpitaux', 'Assistant Hospitalo-Universitaire', 'Maître Assistant', 'Maître de Conférences Agrégé', 'Professeur Agrégé', 'Professeur Titulaire', 'Professeur Émérite'],
  'Responsable de structure':  ['Chef de service', 'Directeur médical', "Directeur d'établissement"],
}

const SKILL_LEVELS       = ['Débutant', 'Confirmé', 'Senior', 'Référent']
const MISSION_TYPES      = ['Consultation', 'Vacation', 'Remplacement', 'Formation', 'Supervision', 'Recherche', 'Audit', 'Création de contenu', 'Webinaire', 'Projet ONG', 'Conseil stratégique']
const AVAILABILITY_TYPES = ['Temps plein', 'Temps partiel', 'Consultant', 'Freelance', 'Deuxième activité']

const LEVEL_STYLES = {
  'Débutant': { bg: 'bg-slate-100',   text: 'text-slate-600',   dot: 'bg-slate-400'   },
  'Confirmé': { bg: 'bg-blue-50',     text: 'text-blue-700',    dot: 'bg-blue-500'    },
  'Senior':   { bg: 'bg-violet-50',   text: 'text-violet-700',  dot: 'bg-violet-500'  },
  'Référent': { bg: 'bg-emerald-50',  text: 'text-emerald-700', dot: 'bg-emerald-500' },
}

function getTabCompletion(tab, form, skills, missions, diplomas) {
  switch (tab) {
    case 'info':           return [form.full_name, form.phone, form.bio].filter(Boolean).length / 3
    case 'classification': return [form.category, form.profession].filter(Boolean).length / 2
    case 'availability':   return [form.availability_type, form.city_id].filter(Boolean).length / 2
    case 'skills':         return skills.length > 0 ? 1 : 0
    case 'missions':       return missions.length > 0 ? 1 : 0
    case 'diplomas':       return diplomas.length > 0 ? 1 : 0
    default:               return 0
  }
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function ProfilePage() {
  const supabase = createClient()
  const router   = useRouter()

  const [activeTab,        setActiveTab]        = useState('info')
  const [loading,          setLoading]          = useState(true)
  const [saving,           setSaving]           = useState(false)
  const [success,          setSuccess]          = useState(false)
  const [errors,           setErrors]           = useState({})
  const [specialties,      setSpecialties]      = useState([])
  const [cities,           setCities]           = useState([])
  const [bioLength,        setBioLength]        = useState(0)
  const [skills,           setSkills]           = useState([])
  const [newSkill,         setNewSkill]         = useState({ skill: '', level: 'Confirmé' })
  const [selectedMissions, setSelectedMissions] = useState([])
  const [diplomas,         setDiplomas]         = useState([])
  const [newDiploma,       setNewDiploma]       = useState({ title: '', institution: '', year: '' })
  const [avatarFile,       setAvatarFile]       = useState(null)
  const [avatarPreview,    setAvatarPreview]    = useState(null)
  const [cvFile,           setCvFile]           = useState(null)
  const [cvFileName,       setCvFileName]       = useState(null)

  const [form, setForm] = useState({
    full_name: '', phone: '', whatsapp: '', linkedin: '', facebook: '', bio: '',
    category: '', profession: '', specialty_id: '', city_id: '', experience_years: '',
    availability_type: '', mobility_national: false, mobility_international: false, is_available: true,
  })

  useEffect(() => { loadData() }, [])

  const completedCount    = TABS.reduce((n, t) => n + (getTabCompletion(t.key, form, skills, selectedMissions, diplomas) === 1 ? 1 : 0), 0)
  const overallCompletion = Math.round((completedCount / TABS.length) * 100)
  const currentIndex      = TABS.findIndex(t => t.key === activeTab)
  const currentTab        = TABS[currentIndex]
  const isFirst           = currentIndex === 0
  const isLast            = currentIndex === TABS.length - 1

  async function loadData() {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return router.push('/login')

    const [profileRes, specialtiesRes, citiesRes, skillsRes, missionsRes, diplomasRes] =
      await Promise.all([
        supabase.from('profiles').select('*').eq('id', user.id).single(),
        supabase.from('specialties').select('*'),
        supabase.from('cities').select('*'),
        supabase.from('profile_skills').select('*').eq('profile_id', user.id),
        supabase.from('profile_missions').select('*').eq('profile_id', user.id),
        supabase.from('profile_diplomas').select('*').eq('profile_id', user.id),
      ])

    if (profileRes.data) {
      const p = profileRes.data
      setForm({
        full_name: p.full_name || '', phone: p.phone || '', whatsapp: p.whatsapp || '',
        linkedin: p.linkedin || '', facebook: p.facebook || '', bio: p.bio || '',
        category: p.category || '', profession: p.profession || '', specialty_id: p.specialty_id || '',
        city_id: p.city_id || '', experience_years: p.experience_years || '',
        availability_type: p.availability_type || '', mobility_national: p.mobility_national || false,
        mobility_international: p.mobility_international || false, is_available: p.is_available ?? true,
      })
      setBioLength(p.bio?.length || 0)
      if (p.avatar_url) {
        const url = await getSignedUrl('profiles', p.avatar_url)
        if (url) setAvatarPreview(url)
      }
    }

    setSpecialties(specialtiesRes.data || [])
    setCities(citiesRes.data || [])
    setSkills(skillsRes.data || [])
    setSelectedMissions((missionsRes.data || []).map(m => m.mission))
    setDiplomas(diplomasRes.data || [])
    setLoading(false)
  }

  function validateCurrentTab() {
    const e = {}
    if (activeTab === 'info') {
      if (!form.full_name?.trim()) e.full_name = 'Nom complet requis'
      if (!form.phone?.trim())     e.phone     = 'Téléphone requis'
      if (!form.bio?.trim())       e.bio       = 'Biographie requise'
    }
    if (activeTab === 'classification') {
      if (!form.category)   e.category   = 'Catégorie requise'
      if (!form.profession) e.profession = 'Profession requise'
    }
    if (activeTab === 'availability') {
      if (!form.availability_type) e.availability_type = 'Type de disponibilité requis'
      if (!form.city_id)           e.city_id           = 'Ville requise'
    }
    setErrors(e)
    return Object.keys(e).length === 0
  }

  function handleChange(e) {
    const { name, value, type, checked } = e.target
    setForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
      ...(name === 'category' && { profession: '' }),
    }))
    if (name === 'bio') setBioLength(value.length)
    if (errors[name])  setErrors(prev => ({ ...prev, [name]: null }))
  }

  function handleAvatarChange(e) {
    const file = e.target.files[0]
    if (!file) return
    setAvatarFile(file)
    setAvatarPreview(URL.createObjectURL(file))
  }

  function switchTab(key) {
    setActiveTab(key)
    document.getElementById('main-panel')?.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function addSkill() {
    if (!newSkill.skill.trim()) return
    setSkills(prev => [...prev, { ...newSkill, id: Date.now().toString() }])
    setNewSkill({ skill: '', level: 'Confirmé' })
  }

  function addDiploma() {
    if (!newDiploma.title.trim()) return
    setDiplomas(prev => [...prev, { ...newDiploma, id: Date.now().toString() }])
    setNewDiploma({ title: '', institution: '', year: '' })
  }

  async function handleSave() {
    if (!validateCurrentTab()) return
    setSaving(true)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      let avatar_url = null, cv_url = null

      if (avatarFile) {
        const ext = avatarFile.name.split('.').pop()
        avatar_url = await uploadFile('profiles', `avatars/${user.id}.${ext}`, avatarFile)
      }
      if (cvFile) {
        const ext = cvFile.name.split('.').pop()
        cv_url = await uploadFile('profiles', `cvs/${user.id}.${ext}`, cvFile)
      }

      await supabase.from('profiles').update({
        ...form,
        experience_years: form.experience_years ? parseInt(form.experience_years) : null,
        specialty_id: form.specialty_id || null,
        city_id: form.city_id || null,
        ...(avatar_url && { avatar_url }),
        ...(cv_url && { cv_url }),
      }).eq('id', user.id)

      await supabase.from('profile_skills').delete().eq('profile_id', user.id)
      if (skills.length > 0)
        await supabase.from('profile_skills').insert(skills.map(s => ({ profile_id: user.id, skill: s.skill, level: s.level })))

      await supabase.from('profile_missions').delete().eq('profile_id', user.id)
      if (selectedMissions.length > 0)
        await supabase.from('profile_missions').insert(selectedMissions.map(m => ({ profile_id: user.id, mission: m })))

      await supabase.from('profile_diplomas').delete().eq('profile_id', user.id)
      if (diplomas.length > 0)
        await supabase.from('profile_diplomas').insert(diplomas.map(d => ({
          profile_id: user.id, title: d.title,
          institution: d.institution || null,
          year: d.year ? parseInt(d.year) : null,
        })))

      setSuccess(true)
      setTimeout(() => setSuccess(false), 3000)
    } catch (err) {
      console.error(err)
    } finally {
      setSaving(false)
    }
  }

  // Shared input style
  const inp = (err) =>
    `w-full px-4 py-2.5 rounded-sm border text-sm text-slate-800 bg-white placeholder-slate-400 outline-none transition-all ${
      err
        ? 'border-red-300 ring-2 ring-red-100 focus:border-red-400'
        : 'border-slate-200 focus:border-primary focus:ring-2 focus:ring-blue-100'
    }`

  if (loading) return (
    <div className="w-full h-screen flex items-center justify-center bg-white">
      <div className="flex flex-col items-center gap-3">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        <p className="text-sm text-slate-400 font-medium">Chargement du profil...</p>
      </div>
    </div>
  )

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">

      {/* ── Sidebar ─────────────────────────────────────────────────────── */}
      <aside className="w-72 bg-[#0a1445] flex flex-col shrink-0 h-full relative overflow-hidden">

        {/* Dot pattern */}
        <div className="absolute inset-0 opacity-5 pointer-events-none"
          style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '24px 24px' }}
        />

        {/* Top progress strip */}
        <div className="relative h-1 bg-white/10 shrink-0">
          <div className="h-full bg-emerald-400 transition-all duration-700" style={{ width: `${overallCompletion}%` }} />
        </div>

        {/* Back button — top */}
        <div className="relative px-5 pt-5 pb-4 border-b border-white/10">
          <button
            onClick={() => router.push('/dashboard')}
            className="flex items-center gap-2 text-white/50 hover:text-white transition-all text-xs font-semibold group"
          >
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" />
            Retour au tableau de bord
          </button>
        </div>

        {/* Brand + progress ring */}
        <div className="relative px-7 pt-5 pb-6 border-b border-white/10">
          <p className="text-white font-bold text-base tracking-tight">Mon Profil</p>
          <p className="text-white/40 text-xs mt-0.5 font-medium">
            {completedCount}/{TABS.length} sections complétées
          </p>
          <div className="absolute right-7 top-5">
            <svg width="44" height="44" viewBox="0 0 44 44">
              <circle cx="22" cy="22" r="18" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="3"/>
              <circle cx="22" cy="22" r="18" fill="none" stroke="#34d399" strokeWidth="3"
                strokeLinecap="round"
                strokeDasharray={`${2 * Math.PI * 18}`}
                strokeDashoffset={`${2 * Math.PI * 18 * (1 - overallCompletion / 100)}`}
                transform="rotate(-90 22 22)"
              />
              <text x="22" y="26" textAnchor="middle" fill="white" fontSize="9" fontWeight="700" fontFamily="sans-serif">
                {overallCompletion}%
              </text>
            </svg>
          </div>
        </div>

        {/* Tab steps */}
        <nav className="relative flex-1 px-4 py-5 overflow-y-auto space-y-1">
          {TABS.map((tab) => {
            const completion = getTabCompletion(tab.key, form, skills, selectedMissions, diplomas)
            const done       = completion === 1
            const active     = activeTab === tab.key
            const partial    = completion > 0 && completion < 1
            const Icon       = tab.icon

            return (
              <button
                key={tab.key}
                onClick={() => switchTab(tab.key)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-sm text-left transition-all ${
                  active ? 'bg-white/15 text-white' :
                  done   ? 'text-white/70 hover:bg-white/8 hover:text-white' :
                           'text-white/35 hover:bg-white/8 hover:text-white/70'
                }`}
              >
                <div className={`w-8 h-8 rounded-sm flex items-center justify-center shrink-0 transition-all ${
                  done    ? 'bg-emerald-400 text-white'   :
                  active  ? 'bg-white text-[#0a1445]'     :
                  partial ? 'bg-white/20 text-white/80'   :
                            'bg-white/10 text-white/35'
                }`}>
                  {done ? <Check className="w-4 h-4 stroke-[2.5]" /> : <Icon className="w-4 h-4" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`text-xs font-semibold truncate ${active ? 'text-white' : ''}`}>
                    {tab.label}
                  </p>
                  {partial && !done && (
                    <div className="mt-1 h-0.5 bg-white/20 rounded-full overflow-hidden">
                      <div className="h-full bg-amber-400 rounded-full" style={{ width: `${completion * 100}%` }} />
                    </div>
                  )}
                </div>
                {active && <div className="w-1.5 h-1.5 rounded-full bg-white shrink-0" />}
              </button>
            )
          })}
        </nav>
      </aside>

      {/* ── Main panel ──────────────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col overflow-hidden">

        {/* Top bar */}
        <header className="bg-white border-b border-slate-100 px-8 py-4 flex items-center justify-between shrink-0">
          <div>
            <h1 className="text-base font-bold text-slate-900">{currentTab.label}</h1>
            <p className="text-xs text-slate-400 mt-0.5">{currentTab.hint}</p>
          </div>
          {/* Step dots */}
          <div className="flex items-center gap-1.5">
            {TABS.map((tab) => {
              const done   = getTabCompletion(tab.key, form, skills, selectedMissions, diplomas) === 1
              const active = activeTab === tab.key
              return (
                <button key={tab.key} onClick={() => switchTab(tab.key)}
                  className={`h-2 rounded-full transition-all ${
                    done   ? 'bg-emerald-400 w-4' :
                    active ? 'bg-primary w-4'     :
                             'bg-slate-200 w-2'
                  }`}
                />
              )
            })}
          </div>
        </header>

        {/* Required fields note */}
        <div className="bg-slate-50 border-b border-slate-100 px-8 py-2 flex items-center gap-1">
          <AlertCircle className="w-3 h-3 text-slate-400" />
          <p className="text-xs text-slate-400">
            Les champs marqués <span className="text-red-500 font-bold">*</span> sont obligatoires
          </p>
        </div>

        {/* Scrollable content */}
        <div id="main-panel" className="flex-1 overflow-y-auto">
          <div className="px-8 py-8 pb-36">

            {/* ── INFO ──────────────────────────────────────────── */}
            {activeTab === 'info' && (
              <div className="space-y-8">

                {/* Avatar */}
                <div className="bg-white border border-slate-100 rounded-sm p-5 flex items-center gap-5">
                  <div className={`w-20 h-20 rounded-sm overflow-hidden flex items-center justify-center shrink-0 ${
                    avatarPreview ? '' : 'bg-slate-50 border-2 border-dashed border-slate-200'
                  }`}>
                    {avatarPreview
                      ? <img src={avatarPreview} alt="" className="w-full h-full object-cover" />
                      : <User className="w-8 h-8 text-slate-300" />
                    }
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-semibold text-slate-800">Photo de profil</p>
                    <p className="text-xs text-slate-400">Format carré recommandé · max 2 Mo</p>
                    <label className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary cursor-pointer hover:underline mt-1">
                      <CloudUpload className="w-3.5 h-3.5" />
                      {avatarPreview ? 'Changer la photo' : 'Ajouter une photo'}
                      <input type="file" accept="image/*" onChange={handleAvatarChange} className="hidden" />
                    </label>
                  </div>
                </div>

                {/* Coordonnées */}
                <Block title="Coordonnées">
                  <div className="grid grid-cols-2 gap-4">
                    <FF label="Nom complet" required error={errors.full_name}>
                      <InputIcon icon={<User className="w-4 h-4" />}>
                        <input name="full_name" value={form.full_name} onChange={handleChange}
                          placeholder="Dr. Miora Rakoto" className={inp(errors.full_name)} />
                      </InputIcon>
                    </FF>
                    <FF label="Téléphone" required error={errors.phone} hint="Numéro principal pour être contacté">
                      <InputIcon icon={<Phone className="w-4 h-4" />}>
                        <input name="phone" value={form.phone} onChange={handleChange}
                          placeholder="034 00 000 00" className={inp(errors.phone)} />
                      </InputIcon>
                    </FF>
                    <FF label="WhatsApp" hint="Si différent de votre téléphone">
                      <InputIcon icon={<Phone className="w-4 h-4" />}>
                        <input name="whatsapp" value={form.whatsapp} onChange={handleChange}
                          placeholder="034 00 000 00" className={inp()} />
                      </InputIcon>
                    </FF>
                    <FF label="LinkedIn" hint="URL complète de votre profil">
                      <InputIcon icon={<Link className="w-4 h-4" />}>
                        <input name="linkedin" value={form.linkedin} onChange={handleChange}
                          placeholder="linkedin.com/in/votre-profil" className={inp()} />
                      </InputIcon>
                    </FF>
                    <FF label="Facebook">
                      <InputIcon icon={<Link className="w-4 h-4" />}>
                        <input name="facebook" value={form.facebook} onChange={handleChange}
                          placeholder="facebook.com/votre-profil" className={inp()} />
                      </InputIcon>
                    </FF>
                  </div>
                </Block>

                {/* Bio */}
                <Block title="Présentation">
                  <FF label="Biographie" required error={errors.bio}
                    hint="Visible par les cabinets qui consultent votre profil">
                    <textarea name="bio" value={form.bio} onChange={handleChange} rows={5}
                      maxLength={500}
                      placeholder="Décrivez votre parcours, vos points forts, ce qui vous distingue..."
                      className={`${inp(errors.bio)} resize-none`}
                    />
                    <div className="flex justify-end">
                      <span className={`text-xs font-medium ${bioLength > 450 ? 'text-amber-500' : 'text-slate-300'}`}>
                        {bioLength}/500
                      </span>
                    </div>
                  </FF>
                </Block>

                {/* CV */}
                <Block title="Curriculum Vitæ">
                  <div className={`border-2 border-dashed rounded-sm p-5 text-center transition-all ${
                    cvFileName ? 'border-emerald-200 bg-emerald-50' : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}>
                    {cvFileName ? (
                      <div className="flex items-center justify-center gap-3">
                        <div className="w-8 h-8 bg-emerald-100 rounded-sm flex items-center justify-center">
                          <Check className="w-4 h-4 text-emerald-600" />
                        </div>
                        <div className="text-left">
                          <p className="text-xs font-semibold text-emerald-700">{cvFileName}</p>
                          <p className="text-xs text-emerald-500">Prêt à être envoyé</p>
                        </div>
                        <button onClick={() => { setCvFile(null); setCvFileName(null) }}
                          className="ml-2 text-emerald-400 hover:text-emerald-600">
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <label className="cursor-pointer block">
                        <FileText className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                        <p className="text-xs font-semibold text-slate-600">Déposer votre CV (PDF)</p>
                        <p className="text-xs text-slate-400 mt-1">ou cliquez pour sélectionner</p>
                        <input type="file" accept=".pdf"
                          onChange={e => { setCvFile(e.target.files[0]); setCvFileName(e.target.files[0]?.name) }}
                          className="hidden" />
                      </label>
                    )}
                  </div>
                  <p className="text-xs text-slate-400 font-medium mt-2 flex items-center gap-1">
                    <Eye className="w-3 h-3" />
                    Accessible uniquement aux cabinets qui reçoivent votre candidature
                  </p>
                </Block>
              </div>
            )}

            {/* ── CLASSIFICATION ────────────────────────────────── */}
            {activeTab === 'classification' && (
              <div className="space-y-8">
                <Block title="Profil professionnel">
                  <div className="space-y-4">
                    <FF label="Catégorie principale" required error={errors.category}
                      hint="Choisissez la catégorie qui correspond le mieux à votre profil">
                      <select name="category" value={form.category} onChange={handleChange} className={inp(errors.category)}>
                        <option value="">Sélectionner une catégorie</option>
                        {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                    </FF>

                    {form.category ? (
                      <FF label="Profession" required error={errors.profession}>
                        <select name="profession" value={form.profession} onChange={handleChange}
                          className={`${inp(errors.profession)} disabled:opacity-40`}>
                          <option value="">Sélectionner une profession</option>
                          {(PROFESSIONS[form.category] || []).map(p => <option key={p} value={p}>{p}</option>)}
                        </select>
                      </FF>
                    ) : (
                      <div className="p-4 bg-slate-50 rounded-sm border border-dashed border-slate-200 text-center">
                        <Stethoscope className="w-5 h-5 text-slate-300 mx-auto mb-1" />
                        <p className="text-xs text-slate-400">Sélectionnez d'abord une catégorie</p>
                      </div>
                    )}

                    <div className="grid grid-cols-2 gap-4">
                      <FF label="Spécialité médicale" hint="Optionnel si couvert par votre profession">
                        <select name="specialty_id" value={form.specialty_id} onChange={handleChange} className={inp()}>
                          <option value="">Aucune spécialité</option>
                          {specialties.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                        </select>
                      </FF>
                      <FF label="Années d'expérience" hint="Expérience totale cumulée">
                        <input name="experience_years" type="number" min="0" max="50"
                          value={form.experience_years} onChange={handleChange}
                          placeholder="Ex: 3" className={inp()} />
                      </FF>
                    </div>
                  </div>
                </Block>

                {/* Live preview */}
                {(form.category || form.profession) && (
                  <div className="bg-gradient-to-br from-primary to-blue-700 rounded-sm p-5 text-white">
                    <p className="text-xs font-semibold text-white/50 mb-3 uppercase tracking-wider flex items-center gap-1.5">
                      <Eye className="w-3.5 h-3.5" /> Aperçu de votre fiche
                    </p>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-sm bg-white/20 flex items-center justify-center">
                        <Stethoscope className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <p className="font-bold text-sm">{form.profession || '—'}</p>
                        <p className="text-white/60 text-xs">{form.category}</p>
                      </div>
                      {form.experience_years && (
                        <span className="ml-auto text-xs bg-white/20 px-2.5 py-1 rounded-sm font-semibold">
                          {form.experience_years} ans
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* ── AVAILABILITY ──────────────────────────────────── */}
            {activeTab === 'availability' && (
              <div className="space-y-8">
                <Block title="Rythme et localisation">
                  <div className="grid grid-cols-2 gap-4">
                    <FF label="Type de disponibilité" required error={errors.availability_type}
                      hint="Votre mode de travail principal">
                      <select name="availability_type" value={form.availability_type}
                        onChange={handleChange} className={inp(errors.availability_type)}>
                        <option value="">Sélectionner</option>
                        {AVAILABILITY_TYPES.map(a => <option key={a} value={a}>{a}</option>)}
                      </select>
                    </FF>
                    <FF label="Ville principale" required error={errors.city_id}
                      hint="Votre ville de résidence ou d'exercice">
                      <InputIcon icon={<MapPin className="w-4 h-4" />}>
                        <select name="city_id" value={form.city_id} onChange={handleChange} className={inp(errors.city_id)}>
                          <option value="">Sélectionner</option>
                          {cities.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                        </select>
                      </InputIcon>
                    </FF>
                  </div>
                </Block>

                <Block title="Statut et mobilité">
                  <div className="space-y-2">
                    {[
                      { key: 'is_available',          label: 'Disponible pour des opportunités', desc: 'Activez pour apparaître dans les recherches des cabinets', icon: Eye },
                      { key: 'mobility_national',     label: 'Mobilité nationale',               desc: 'Vous acceptez des missions dans tout Madagascar',         icon: Globe },
                      { key: 'mobility_international',label: 'Mobilité internationale',          desc: 'Vous acceptez des missions à l\'étranger',                icon: Globe2 },
                    ].map(({ key, label, desc, icon: Icon }) => (
                      <div key={key}
                        className="flex items-center justify-between p-4 bg-white border border-slate-100 rounded-sm hover:border-slate-200 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-slate-50 rounded-sm flex items-center justify-center shrink-0">
                            <Icon className="w-4 h-4 text-slate-400" />
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-slate-800">{label}</p>
                            <p className="text-xs text-slate-400 mt-0.5">{desc}</p>
                          </div>
                        </div>
                        <button
                          onClick={() => setForm(prev => ({ ...prev, [key]: !prev[key] }))}
                          className={`relative w-11 h-6 rounded-full transition-all shrink-0 ${form[key] ? 'bg-primary' : 'bg-slate-200'}`}
                        >
                          <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-all ${form[key] ? 'left-5' : 'left-0.5'}`} />
                        </button>
                      </div>
                    ))}
                  </div>
                </Block>

                {/* Summary */}
                <div className="bg-slate-50 rounded-sm p-5 border border-slate-100">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Résumé</p>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { label: 'Statut',   value: form.is_available ? 'Disponible' : 'Non disponible',                                                                      ok: form.is_available },
                      { label: 'Rythme',   value: form.availability_type || '—',                                                                                            ok: !!form.availability_type },
                      { label: 'Ville',    value: cities.find(c => c.id === form.city_id)?.name || '—',                                                                     ok: !!form.city_id },
                      { label: 'Mobilité', value: [form.mobility_national && 'Nationale', form.mobility_international && 'Internationale'].filter(Boolean).join(', ') || 'Locale', ok: true },
                    ].map(({ label, value, ok }) => (
                      <div key={label} className="bg-white rounded-sm p-3 border border-slate-100">
                        <p className="text-xs text-slate-400">{label}</p>
                        <p className={`text-sm font-bold mt-0.5 ${ok && value !== '—' ? 'text-slate-800' : 'text-slate-300'}`}>{value}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* ── SKILLS ────────────────────────────────────────── */}
            {activeTab === 'skills' && (
              <div className="space-y-6">
                <Block title="Ajouter une compétence">
                  <p className="text-xs text-slate-400 -mt-2">Ex: Rééducation sportive, Gestion cabinet médical, Télémédecine...</p>
                  <div className="flex gap-2">
                    <input
                      value={newSkill.skill}
                      onChange={e => setNewSkill(prev => ({ ...prev, skill: e.target.value }))}
                      placeholder="Nom de la compétence"
                      className={`${inp()} flex-1`}
                      onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addSkill())}
                    />
                    <select
                      value={newSkill.level}
                      onChange={e => setNewSkill(prev => ({ ...prev, level: e.target.value }))}
                      className="px-3 border border-slate-200 rounded-sm bg-white text-xs font-semibold text-slate-700 outline-none focus:border-primary"
                    >
                      {SKILL_LEVELS.map(l => <option key={l} value={l}>{l}</option>)}
                    </select>
                    <button onClick={addSkill} disabled={!newSkill.skill.trim()}
                      className="bg-primary hover:bg-blue-700 text-white font-bold px-4 rounded-sm text-sm transition-all disabled:opacity-40 flex items-center gap-1">
                      <Plus className="w-4 h-4" /> Ajouter
                    </button>
                  </div>

                  {/* Level legend */}
                  <div className="flex flex-wrap gap-2">
                    {SKILL_LEVELS.map(l => {
                      const s = LEVEL_STYLES[l]
                      return (
                        <span key={l} className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-sm ${s.bg} ${s.text}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
                          {l}
                        </span>
                      )
                    })}
                  </div>
                </Block>

                {skills.length === 0
                  ? <Empty icon={Zap} title="Aucune compétence ajoutée"
                      desc="Ajoutez au moins 3 compétences pour maximiser vos chances d'être trouvé." />
                  : (
                    <div className="space-y-2">
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                        {skills.length} compétence{skills.length > 1 ? 's' : ''}
                      </p>
                      <div className="grid grid-cols-2 gap-2">
                        {skills.map(s => {
                          const style = LEVEL_STYLES[s.level] || LEVEL_STYLES['Confirmé']
                          return (
                            <div key={s.id}
                              className="flex items-center justify-between p-3 bg-white border border-slate-100 rounded-sm hover:border-slate-200 transition-colors group"
                            >
                              <span className="text-sm font-semibold text-slate-800 truncate pr-2">{s.skill}</span>
                              <div className="flex items-center gap-2 shrink-0">
                                <span className={`inline-flex items-center gap-1 text-xs font-bold px-2 py-0.5 rounded-sm ${style.bg} ${style.text}`}>
                                  <span className={`w-1.5 h-1.5 rounded-full ${style.dot}`} />
                                  {s.level}
                                </span>
                                <button onClick={() => setSkills(prev => prev.filter(x => x.id !== s.id))}
                                  className="text-slate-300 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100">
                                  <X className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  )
                }
              </div>
            )}

            {/* ── MISSIONS ──────────────────────────────────────── */}
            {activeTab === 'missions' && (
              <div className="space-y-6">
                <Block title="Types de missions acceptées">
                  <p className="text-xs text-slate-400 -mt-2">
                    Sélectionnez toutes les missions que vous acceptez
                  </p>
                  <div className="grid grid-cols-3 gap-2">
                    {MISSION_TYPES.map(m => {
                      const on = selectedMissions.includes(m)
                      return (
                        <button key={m} type="button"
                          onClick={() => setSelectedMissions(prev =>
                            prev.includes(m) ? prev.filter(x => x !== m) : [...prev, m]
                          )}
                          className={`relative p-3 rounded-sm border text-xs font-semibold text-left transition-all ${
                            on
                              ? 'border-primary bg-blue-50 text-primary'
                              : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                          }`}
                        >
                          {on && (
                            <span className="absolute top-2 right-2 w-4 h-4 bg-primary rounded-full flex items-center justify-center">
                              <Check className="w-2.5 h-2.5 text-white stroke-[3]" />
                            </span>
                          )}
                          {m}
                        </button>
                      )
                    })}
                  </div>
                </Block>

                {selectedMissions.length > 0 && (
                  <div className="bg-blue-50 rounded-sm p-4 border border-blue-100">
                    <p className="text-xs font-bold text-primary mb-1.5 flex items-center gap-1.5">
                      <Briefcase className="w-3.5 h-3.5" />
                      {selectedMissions.length} mission{selectedMissions.length > 1 ? 's' : ''} sélectionnée{selectedMissions.length > 1 ? 's' : ''}
                    </p>
                    <p className="text-xs text-blue-400 leading-relaxed">
                      {selectedMissions.join(' · ')}
                    </p>
                  </div>
                )}

                {selectedMissions.length === 0 && (
                  <Empty icon={Briefcase} title="Aucune mission sélectionnée"
                    desc="Sélectionnez au moins une mission pour indiquer vos disponibilités aux cabinets." />
                )}
              </div>
            )}

            {/* ── DIPLOMAS ──────────────────────────────────────── */}
            {activeTab === 'diplomas' && (
              <div className="space-y-6">
                <Block title="Ajouter un diplôme ou certification">
                  <div className="space-y-3">
                    <FF label="Intitulé du diplôme" required>
                      <input value={newDiploma.title}
                        onChange={e => setNewDiploma(prev => ({ ...prev, title: e.target.value }))}
                        placeholder="Ex: Doctorat en médecine, DU Cardiologie..."
                        className={inp()} />
                    </FF>
                    <div className="grid grid-cols-2 gap-3">
                      <FF label="Établissement">
                        <input value={newDiploma.institution}
                          onChange={e => setNewDiploma(prev => ({ ...prev, institution: e.target.value }))}
                          placeholder="Université d'Antananarivo"
                          className={inp()} />
                      </FF>
                      <FF label="Année d'obtention">
                        <input type="number" min="1970" max={new Date().getFullYear()}
                          value={newDiploma.year}
                          onChange={e => setNewDiploma(prev => ({ ...prev, year: e.target.value }))}
                          placeholder="2018" className={inp()} />
                      </FF>
                    </div>
                    <button onClick={addDiploma} disabled={!newDiploma.title.trim()}
                      className="bg-primary hover:bg-blue-700 text-white font-bold px-5 py-2.5 rounded-sm text-sm transition-all disabled:opacity-40 flex items-center gap-2">
                      <Plus className="w-4 h-4" /> Ajouter le diplôme
                    </button>
                  </div>
                </Block>

                {diplomas.length === 0
                  ? <Empty icon={GraduationCap} title="Aucun diplôme ajouté"
                      desc="Vos diplômes constituent le fondement de la crédibilité de votre parcours médical." />
                  : (
                    <div className="space-y-2">
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                        {diplomas.length} diplôme{diplomas.length > 1 ? 's' : ''}
                      </p>
                      {diplomas.map(d => (
                        <div key={d.id}
                          className="flex items-start justify-between p-4 bg-white border border-slate-100 rounded-sm hover:border-slate-200 transition-colors group"
                        >
                          <div className="flex items-start gap-3">
                            <div className="w-8 h-8 bg-blue-50 rounded-sm flex items-center justify-center shrink-0 mt-0.5">
                              <GraduationCap className="w-4 h-4 text-primary" />
                            </div>
                            <div>
                              <p className="text-sm font-bold text-slate-800">{d.title}</p>
                              <p className="text-xs text-slate-400 mt-0.5">
                                {[d.institution, d.year].filter(Boolean).join(' · ')}
                              </p>
                            </div>
                          </div>
                          <button onClick={() => setDiplomas(prev => prev.filter(x => x.id !== d.id))}
                            className="text-slate-300 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100 mt-0.5 shrink-0">
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )
                }
              </div>
            )}
          </div>
        </div>

        {/* ── Bottom dock ───────────────────────────────────────── */}
        <div className="bg-white border-t border-slate-100 px-8 py-4 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-4">
            {!isFirst && (
              <button onClick={() => switchTab(TABS[currentIndex - 1].key)}
                className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-slate-700 transition-colors">
                <ChevronLeft className="w-4 h-4" /> Précédent
              </button>
            )}
            {success && (
              <span className="flex items-center gap-1.5 text-xs font-bold text-emerald-600">
                <Check className="w-3.5 h-3.5" /> Enregistré
              </span>
            )}
          </div>

          <div className="flex items-center gap-3">
            <button onClick={handleSave} disabled={saving}
              className="px-5 py-2.5 rounded-sm border border-slate-200 text-slate-700 text-xs font-bold hover:border-primary hover:text-primary transition-all disabled:opacity-50">
              {saving ? 'Sauvegarde...' : 'Sauvegarder'}
            </button>

            {!isLast
              ? (
                <button onClick={() => switchTab(TABS[currentIndex + 1].key)}
                  className="flex items-center gap-1.5 bg-primary hover:bg-blue-700 text-white font-bold px-5 py-2.5 rounded-sm text-xs transition-all">
                  Continuer <ChevronRight className="w-3.5 h-3.5" />
                </button>
              )
              : (
                <button onClick={handleSave} disabled={saving}
                  className="flex items-center gap-1.5 bg-emerald-500 hover:bg-emerald-600 text-white font-bold px-5 py-2.5 rounded-sm text-xs transition-all disabled:opacity-50">
                  <Check className="w-3.5 h-3.5" /> Terminer
                </button>
              )
            }
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function Block({ title, children }) {
  return (
    <div className="space-y-4">
      <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">{title}</h3>
      {children}
    </div>
  )
}

function FF({ label, required, error, hint, children }) {
  return (
    <div className="space-y-1.5">
      <label className="flex items-center gap-1 text-xs font-semibold text-slate-600">
        {label}{required && <span className="text-red-400">*</span>}
      </label>
      {children}
      {hint  && <p className="text-xs text-slate-400">{hint}</p>}
      {error && (
        <p className="flex items-center gap-1 text-xs font-semibold text-red-500">
          <AlertCircle className="w-3 h-3" /> {error}
        </p>
      )}
    </div>
  )
}

function InputIcon({ icon, children }) {
  return (
    <div className="relative">
      <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
        {icon}
      </div>
      <div className="[&>*]:pl-9">{children}</div>
    </div>
  )
}

function Empty({ icon: Icon, title, desc }) {
  return (
    <div className="border-2 border-dashed border-slate-200 rounded-sm p-10 text-center">
      <div className="w-12 h-12 bg-slate-50 rounded-sm flex items-center justify-center mx-auto mb-3">
        <Icon className="w-6 h-6 text-slate-300" />
      </div>
      <p className="text-sm font-bold text-slate-700">{title}</p>
      <p className="text-xs text-slate-400 max-w-xs mx-auto mt-1.5 leading-relaxed">{desc}</p>
    </div>
  )
}