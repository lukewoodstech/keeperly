'use client'

import Link from 'next/link'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import type { Animal } from '@/lib/types'
import { Clock } from 'lucide-react'

interface AnimalCardProps {
  animal: Animal
}

export function AnimalCard({ animal }: AnimalCardProps) {
  // Calculate days since last event (placeholder)
  const lastEventDays = Math.floor(Math.random() * 7) // TODO: Calculate from actual events

  return (
    <Link href={`/app/animal/${animal.id}`}>
      <Card className="overflow-hidden border border-gray-200 shadow-sm hover:shadow-md transition-all cursor-pointer group">
        {/* Image placeholder */}
        <div className="aspect-square bg-gray-100 relative overflow-hidden">
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-6xl opacity-10">
              {animal.species === 'Snake' ? '🐍' :
               animal.species === 'Lizard' ? '🦎' :
               animal.species === 'Gecko' ? '🦎' :
               animal.species === 'Dragon' ? '🐉' : '🦎'}
            </span>
          </div>
          {/* Quick info overlay on hover */}
          <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <span className="text-white text-sm font-medium">View Details</span>
          </div>
        </div>

        {/* Card content */}
        <div className="p-4 space-y-2.5">
          {/* Name and sex badge */}
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-semibold text-gray-900 line-clamp-1">
              {animal.name}
            </h3>
            {animal.sex && (
              <Badge
                variant="secondary"
                className="flex-shrink-0 bg-gray-100 text-gray-700 border-gray-200 text-xs"
              >
                {animal.sex}
              </Badge>
            )}
          </div>

          {/* Species */}
          <div className="text-sm text-gray-600 line-clamp-1">
            {animal.species}
            {animal.morph && ` • ${animal.morph}`}
          </div>

          {/* Last activity */}
          <div className="flex items-center gap-1.5 text-xs text-gray-500 pt-2 border-t border-gray-100">
            <Clock className="h-3 w-3" />
            {lastEventDays === 0 ? (
              <span>Updated today</span>
            ) : (
              <span>Updated {lastEventDays}d ago</span>
            )}
          </div>
        </div>
      </Card>
    </Link>
  )
}
