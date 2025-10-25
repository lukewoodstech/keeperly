'use client'

import { Menu, User } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { Sidebar } from './Sidebar'

interface TopBarProps {
  email?: string
  hasPro?: boolean
}

export function TopBar({ email, hasPro = false }: TopBarProps) {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white">
      <div className="flex h-14 items-center px-4 lg:px-6 gap-4">
        {/* Mobile menu */}
        <Sheet>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden hover:bg-gray-50"
            >
              <Menu className="h-5 w-5 text-gray-600" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="p-0 w-60">
            <Sidebar hasPro={hasPro} />
          </SheetContent>
        </Sheet>

        {/* Mobile logo */}
        <div className="md:hidden flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center">
            <span className="text-white font-bold text-xs">K</span>
          </div>
          <h1 className="text-base font-semibold text-gray-900">Keeperly</h1>
        </div>

        <div className="flex-1" />

        {/* User info */}
        <div className="flex items-center gap-2">
          {hasPro && (
            <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-blue-50 border border-blue-200">
              <div className="w-1.5 h-1.5 rounded-full bg-blue-600" />
              <span className="text-xs font-medium text-blue-700">Pro</span>
            </div>
          )}

          {email && (
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gray-50 border border-gray-200">
              <User className="h-4 w-4 text-gray-400" />
              <span className="text-sm text-gray-700">{email}</span>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
