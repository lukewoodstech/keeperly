'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, Scan, Dna, CheckSquare, FolderOpen, Settings, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ProBadge } from '@/components/ProBadge'
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
    <aside className="hidden md:flex md:w-60 md:flex-col border-r bg-gray-50/50">
      {/* Logo */}
      <div className="p-6 border-b">
        <Link href="/app" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
            <span className="text-white font-bold text-sm">K</span>
          </div>
          <h1 className="text-xl font-bold text-gray-900">Keeperly</h1>
        </Link>
      </div>

      {/* Main Navigation */}
      <nav className="flex-1 p-3 space-y-1">
        {mainLinks.map((link) => {
          const Icon = link.icon
          const isActive = pathname === link.href
          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all',
                isActive
                  ? 'bg-blue-50 text-blue-700 shadow-sm'
                  : 'text-gray-700 hover:bg-gray-100'
              )}
            >
              <Icon className="h-5 w-5 flex-shrink-0" />
              <span className="flex-1">{link.label}</span>
            </Link>
          )
        })}

        {/* Pro Features */}
        <div className="pt-4 border-t mt-4">
          {proLinks.map((link) => {
            const Icon = link.icon
            const isActive = pathname === link.href
            const isLocked = !hasPro

            return (
              <Link
                key={link.href}
                href={isLocked ? '#' : link.href}
                className={cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all',
                  isLocked && 'opacity-60 cursor-not-allowed',
                  isActive && !isLocked
                    ? 'bg-blue-50 text-blue-700 shadow-sm'
                    : 'text-gray-700 hover:bg-gray-100'
                )}
                onClick={(e) => isLocked && e.preventDefault()}
              >
                <Icon className="h-5 w-5 flex-shrink-0" />
                <span className="flex-1">{link.label}</span>
                {link.pro && !hasPro && <ProBadge variant="lock" />}
              </Link>
            )
          })}
        </div>

        {/* Bottom Links */}
        <div className="pt-4 border-t mt-4">
          {bottomLinks.map((link) => {
            const Icon = link.icon
            const isActive = pathname === link.href
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all',
                  isActive
                    ? 'bg-blue-50 text-blue-700 shadow-sm'
                    : 'text-gray-700 hover:bg-gray-100'
                )}
              >
                <Icon className="h-5 w-5 flex-shrink-0" />
                {link.label}
              </Link>
            )
          })}
        </div>
      </nav>

      {/* Upgrade CTA */}
      {!hasPro && (
        <div className="p-4 border-t">
          <Link href="/account">
            <Button
              className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white shadow-md"
              size="sm"
            >
              <Sparkles className="h-4 w-4 mr-2" />
              Upgrade to Pro
            </Button>
          </Link>
        </div>
      )}

      {/* Pro Badge */}
      {hasPro && (
        <div className="p-4 border-t bg-gradient-to-r from-purple-50 to-pink-50">
          <div className="flex items-center gap-2">
            <ProBadge />
            <span className="text-sm font-medium text-gray-700">Pro Member</span>
          </div>
        </div>
      )}
    </aside>
  )
}
