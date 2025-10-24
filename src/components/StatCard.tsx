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
    <Card className="p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">{value}</p>
          {description && (
            <p className="text-xs text-gray-500 mt-1">{description}</p>
          )}
        </div>
        {Icon && (
          <div className="w-12 h-12 rounded-lg bg-blue-50 flex items-center justify-center">
            <Icon className="h-6 w-6 text-blue-600" />
          </div>
        )}
      </div>

      {showProgress && (
        <div className="mt-4 space-y-2">
          <Progress value={percentage} className="h-2" />
          <p className="text-xs text-gray-600">
            {progressValue} of {progressMax} used
          </p>
          {variant === 'warning' && progressValue >= progressMax && (
            <p className="text-xs text-red-600 font-medium">
              ⚠️ Limit reached
            </p>
          )}
        </div>
      )}

      {actionLabel && actionHref && (
        <div className="mt-4 pt-4 border-t">
          <Link href={actionHref}>
            <Button variant="outline" size="sm" className="w-full">
              {actionLabel}
            </Button>
          </Link>
        </div>
      )}
    </Card>
  )
}
