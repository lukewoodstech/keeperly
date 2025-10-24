'use client'

import { Moon, Sun, Menu } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { Sidebar } from './Sidebar'

interface TopBarProps {
  email?: string
  hasPro?: boolean
  onThemeToggle?: () => void
}

export function TopBar({ email, hasPro = false, onThemeToggle }: TopBarProps) {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-14 items-center px-4 gap-4">
        {/* Mobile menu */}
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="md:hidden">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="p-0 w-64">
            <Sidebar hasPro={hasPro} />
          </SheetContent>
        </Sheet>

        {/* Desktop logo */}
        <div className="md:hidden">
          <h1 className="text-lg font-bold">Keeperly</h1>
        </div>

        <div className="flex-1" />

        {/* Email display */}
        {email && (
          <div className="hidden sm:block text-sm text-muted-foreground">
            {email}
          </div>
        )}

        {/* Theme toggle */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              <span className="sr-only">Toggle theme</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={onThemeToggle}>
              Light
            </DropdownMenuItem>
            <DropdownMenuItem onClick={onThemeToggle}>
              Dark
            </DropdownMenuItem>
            <DropdownMenuItem onClick={onThemeToggle}>
              System
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
