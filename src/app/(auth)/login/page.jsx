'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '../../../lib/supabase/client'
import Link from 'next/link'
import Image from 'next/image'
import illustration from "../../../images/auth-illustration.png"

export default function LoginPage() {
  const router = useRouter()
  const supabase = createClient()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleLogin() {
    setLoading(true)
    setError('')

    const { error } = await supabase.auth.signInWithPassword({ email, password })

    if (error) {
      setError('Email ou mot de passe incorrect')
      setLoading(false)
      return
    }

    router.push('/dashboard')
    router.refresh()
  }

  return (
    <div className="min-h-screen flex">

      {/* Left panel — illustration */}
      <div className="hidden lg:flex w-1/2 bg-[#011B40] relative overflow-hidden items-center justify-center p-12">

        {/* Background gradient */}
        <div className="absolute inset-0 bg-radial from-[#0245A6] to-[#011127]" />

        {/* Illustration image — replace src with your actual PNG */}
        <div className="relative scale-93 z-10 w-full flex flex-col items-center">
          <div className="max-w-md mb-15">
            {/* Replace this with your actual illustration */}
            <Image
              src="/images/auth-illustration.png"
              alt="GasyDoc network illustration"
              width={260}
              height={100}
              className="w-full object-contain"
            />
          </div>

          {/* Quote */}
          <div className="text-center">
            <p className="text-white text-2xl font-light italic leading-[90%]">
              <span className="text-[#1EEF7C] font-bold text-4xl font-serif leading-[90%]">"</span>
              {' '}Unir les talents, connecter toute la famille
              <br />du secteur sanitaire.{' '}
              <span className="text-[#1EEF7C] font-bold text-4xl font-serif leading-[90%]">"</span>
            </p>
          </div>
        </div>
      </div>

      {/* Right panel — form */}
      <div className="flex-1 flex items-center  bg-white justify-center px-35 py-12">
        <div className="w-full max-w-md">

          {/* Title */}
          <h1 className="text-2xl font-semibold text-textcolor text-center mb-8">
            CONNEXION
          </h1>

          {/* Social login buttons */}
          <div className="space-y-3 mb-6">
            <button className="w-full flex items-center justify-center gap-3 px-4 py-3.5 border border-gray-200 rounded-xmd text-gray-700 text-sm font-medium hover:bg-gray-50 transition-colors">
              {/* Google icon */}
              <svg width="18" height="18" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              google
            </button>

            <button className="w-full flex items-center justify-center gap-3 px-4 py-3.5 border border-gray-200 rounded-xmd text-gray-700 text-sm font-medium hover:bg-gray-50 transition-colors">
              {/* LinkedIn icon */}
              <svg width="18" height="18" viewBox="0 0 24 24" fill="#0A66C2">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
              </svg>
              Linkedin
            </button>
          </div>

          {/* Divider */}
          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200" />
            </div>
            <div className="relative flex justify-center">
              <span className="bg-white px-4 text-xs text-gray-400">ou</span>
            </div>
          </div>

          {/* Email + password */}
          <div className="space-y-4 mb-4">
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="E-mail"
              className="w-full px-4 py-3.5 border border-[#6E768D] rounded-xmd text-sm text-[#47445F] placeholder-[#6E768D] focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />

            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Mot de passe"
                className="w-full px-4 py-3.5 border border-[#6E768D] rounded-xmd text-sm text-[#47445F] placeholder-[#6E768D] focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent pr-12"
              />
              <button
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-[#6E768D] hover:text-gray-600"
              >
                {showPassword ? (
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94"/>
                    <path d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19"/>
                    <line x1="1" y1="1" x2="23" y2="23"/>
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                    <circle cx="12" cy="12" r="3"/>
                  </svg>
                )}
              </button>
            </div>
          </div>

          {/* Remember me + forgot password */}
          <div className="flex items-center justify-between mb-6">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={e => setRememberMe(e.target.checked)}
                className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary"
              />
              <span className="text-sm text-gray-500">Se souvenir de moi</span>
            </label>
            <Link href="/forgot-password" className="text-sm text-primary hover:underline">
              Mot de passe oublié
            </Link>
          </div>

          {error && (
            <p className="mb-4 text-sm text-red-500 bg-red-50 px-4 py-3 rounded-xmd">
              {error}
            </p>
          )}

          {/* Submit */}
          <button
            onClick={handleLogin}
            disabled={loading || !email || !password}
            className="w-full bg-primary text-white py-4 rounded-xmd font-semibold text-sm hover:bg-[#1530a0] transition-colors"
          >
            {loading ? 'Connexion...' : 'Se connecter'}
          </button>

          {/* Sign up link */}
          <p className="mt-6 text-center text-sm text-gray-500">
            je n'ai pas de compte ?{' '}
            <Link href="/signup" className="text-primary font-medium hover:underline">
              S'inscrire
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}