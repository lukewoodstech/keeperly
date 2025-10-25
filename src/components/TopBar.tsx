'use client'

import { Menu, User } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { Sidebar } from './Sidebar'
import { ProBadge } from './ProBadge'

interface TopBarProps {
  email?: string
  hasPro?: boolean
}

export function TopBar({ email, hasPro = false }: TopBarProps) {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white shadow-sm">
      <div className="flex h-16 items-center px-4 lg:px-6 gap-4">
        {/* Mobile menu */}
        <Sheet>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden hover:bg-gray-100"
            >
              <Menu className="h-5 w-5 text-gray-700" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="p-0 w-64">
            <Sidebar hasPro={hasPro} />
          </SheetContent>
        </Sheet>

        {/* Mobile logo */}
        <div className="md:hidden flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
            <span className="text-white font-bold text-sm">K</span>
          </div>
          <h1 className="text-lg font-bold text-gray-900">Keeperly</h1>
        </div>

        <div className="flex-1" />

        {/* User info */}
        <div className="flex items-center gap-3">
          {hasPro && (
            <div className="hidden sm:block">
              <ProBadge variant="sparkle" />
            </div>
          )}

          {email && (
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gray-50 border border-gray-200">
              <User className="h-4 w-4 text-gray-500" />
              <span className="text-sm font-medium text-gray-700">{email}</span>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
