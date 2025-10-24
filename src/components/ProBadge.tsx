import { Crown, Lock, Sparkles } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ProBadgeProps {
  variant?: 'default' | 'lock' | 'sparkle'
  className?: string
}

export function ProBadge({ variant = 'default', className }: ProBadgeProps) {
  const Icon = variant === 'lock' ? Lock : variant === 'sparkle' ? Sparkles : Crown

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold',
        'bg-gradient-to-r from-purple-500 to-pink-500 text-white',
        className
      )}
    >
      <Icon className="h-3 w-3" />
      PRO
    </span>
  )
}
