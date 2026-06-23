'use client'

/**
 * Sidebar navigation link.
 * Active state shows a left blue border indicator.
 */
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function NavLink({ href, label, icon, exact = false }) {
  const pathname = usePathname()
  const isActive = exact ? pathname === href : pathname.startsWith(href)

  return (
    <Link
      href={href}
      className={`flex items-center gap-3 px-3 py-2.5 text-sm transition-colors relative ${
        isActive
          ? 'text-primary font-medium bg-[#FBFBFE] border-l-3 border-primary'
          : 'text-gray2 hover:text-textcolor2 hover:bg-gray-50 border-l-4 border-transparent'
      }`}
    >
      <span className={isActive ? 'text-primary' : 'text-gray2'}>{icon}</span>
      <span className='text-nowrap'>{label}</span>
    </Link>
  )
}