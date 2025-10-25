import { LucideIcon } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

interface StatCardProps {
  title: string
  value: string | number
  icon?: LucideIcon
  description?: string
  showProgress?: boolean
  progressValue?: number
  progressMax?: number
  actionLabel?: string
  actionHref?: string
  variant?: 'default' | 'warning'
}

export function StatCard({
  title,
  value,
  icon: Icon,
  description,
  showProgress,
  progressValue = 0,
  progressMax = 100,
  actionLabel,
  actionHref,
  variant = 'default',
}: StatCardProps) {
  const percentage = (progressValue / progressMax) * 100

  return (
    <Card className="p-5 border border-gray-200 bg-white shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">{title}</p>
          <p className="text-2xl font-semibold text-gray-900 mt-1.5">{value}</p>
          {description && (
            <p className="text-sm text-gray-600 mt-1">{description}</p>
          )}
        </div>
        {Icon && (
          <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0">
            <Icon className="h-5 w-5 text-blue-600" />
          </div>
        )}
      </div>

      {showProgress && (
        <div className="mt-4 space-y-1.5">
          <Progress value={percentage} className="h-1.5" />
          <p className="text-xs text-gray-500">
            {progressValue} of {progressMax} used
          </p>
          {variant === 'warning' && progressValue >= progressMax && (
            <p className="text-xs text-red-600 font-medium">
              Limit reached
            </p>
          )}
        </div>
      )}

      {actionLabel && actionHref && (
        <div className="mt-4 pt-4 border-t border-gray-100">
          <Link href={actionHref}>
            <Button variant="outline" size="sm" className="w-full text-sm border-gray-300 hover:bg-gray-50 hover:border-gray-400">
              {actionLabel}
            </Button>
          </Link>
        </div>
      )}
    </Card>
  )
}
