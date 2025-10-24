'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, User, Crown } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

interface SidebarProps {
  hasPro?: boolean
}

export function Sidebar({ hasPro = false }: SidebarProps) {
  const pathname = usePathname()

  const links = [
    { href: '/app', label: 'Animals', icon: Home },
    { href: '/account', label: 'Account', icon: User },
  ]

  return (
    <aside className="hidden md:flex md:w-64 md:flex-col border-r bg-background">
      <div className="p-6">
        <h1 className="text-2xl font-bold">Keeperly</h1>
      </div>
      <nav className="flex-1 space-y-1 px-3">
        {links.map((link) => {
          const Icon = link.icon
          const isActive = pathname === link.href
          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-primary text-primary-foreground'
                  : 'hover:bg-accent hover:text-accent-foreground'
              )}
            >
              <Icon className="h-5 w-5" />
              {link.label}
            </Link>
          )
        })}
      </nav>
      {hasPro && (
        <div className="p-4 border-t">
          <Badge variant="secondary" className="gap-1">
            <Crown className="h-3 w-3" />
            Breeding Pro
          </Badge>
        </div>
      )}
    </aside>
  )
}
