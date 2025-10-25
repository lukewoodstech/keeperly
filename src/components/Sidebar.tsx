'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, Scan, Dna, CheckSquare, FolderOpen, Settings, Lock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface SidebarProps {
  hasPro?: boolean
}

export function Sidebar({ hasPro = false }: SidebarProps) {
  const pathname = usePathname()

  const mainLinks = [
    { href: '/app', label: 'Dashboard', icon: LayoutDashboard, pro: false },
    { href: '/app/animals', label: 'Animals', icon: Scan, pro: false },
  ]

  const proLinks = [
    { href: '/app/breeding', label: 'Breeding', icon: Dna, pro: true },
    { href: '/app/tasks', label: 'Tasks', icon: CheckSquare, pro: true },
    { href: '/app/collections', label: 'Collections', icon: FolderOpen, pro: true },
  ]

  const bottomLinks = [
    { href: '/account', label: 'Settings', icon: Settings, pro: false },
  ]

  return (
    <aside className="hidden md:flex md:w-60 md:flex-col border-r border-gray-200 bg-white">
      {/* Logo */}
      <div className="p-6 border-b border-gray-200">
        <Link href="/app" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
            <span className="text-white font-bold text-sm">K</span>
          </div>
          <h1 className="text-lg font-semibold text-gray-900">Keeperly</h1>
        </Link>
      </div>

      {/* Main Navigation */}
      <nav className="flex-1 p-3 space-y-0.5">
        {mainLinks.map((link) => {
          const Icon = link.icon
          const isActive = pathname === link.href
          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-blue-50 text-blue-600'
                  : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
              )}
            >
              <Icon className="h-4 w-4 flex-shrink-0" />
              <span className="flex-1">{link.label}</span>
            </Link>
          )
        })}

        {/* Pro Features */}
        <div className="pt-3 mt-3 border-t border-gray-200 space-y-0.5">
          {proLinks.map((link) => {
            const Icon = link.icon
            const isActive = pathname === link.href
            const isLocked = !hasPro

            return (
              <Link
                key={link.href}
                href={isLocked ? '#' : link.href}
                className={cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                  isLocked && 'opacity-50 cursor-not-allowed',
                  isActive && !isLocked
                    ? 'bg-blue-50 text-blue-600'
                    : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                )}
                onClick={(e) => isLocked && e.preventDefault()}
              >
                <Icon className="h-4 w-4 flex-shrink-0" />
                <span className="flex-1">{link.label}</span>
                {link.pro && !hasPro && <Lock className="h-3 w-3 text-gray-400" />}
              </Link>
            )
          })}
        </div>

        {/* Bottom Links */}
        <div className="pt-3 mt-3 border-t border-gray-200 space-y-0.5">
          {bottomLinks.map((link) => {
            const Icon = link.icon
            const isActive = pathname === link.href
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-blue-50 text-blue-600'
                    : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                )}
              >
                <Icon className="h-4 w-4 flex-shrink-0" />
                {link.label}
              </Link>
            )
          })}
        </div>
      </nav>

      {/* Upgrade CTA */}
      {!hasPro && (
        <div className="p-4 border-t border-gray-200">
          <Link href="/account">
            <Button
              className="w-full bg-blue-600 hover:bg-blue-700 text-white text-sm"
              size="sm"
            >
              Upgrade to Pro
            </Button>
          </Link>
        </div>
      )}

      {/* Pro Badge */}
      {hasPro && (
        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <div className="w-2 h-2 rounded-full bg-blue-600" />
            <span className="font-medium">Pro</span>
          </div>
        </div>
      )}
    </aside>
  )
}
