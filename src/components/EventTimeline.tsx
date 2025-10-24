'use client'

import { Calendar, Pill, Scale, Droplet, Heart, Activity } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { fmtDate, renderDetails } from '@/lib/format'
import type { Event, EventType } from '@/lib/types'

interface EventTimelineProps {
  events: Event[]
}

const eventIcons: Record<EventType, React.ElementType> = {
  feeding: Activity,
  weight: Scale,
  medical: Pill,
  molt: Droplet,
  shedding: Droplet,
  breeding: Heart,
  other: Calendar,
}

const eventColors: Record<EventType, string> = {
  feeding: 'bg-green-500',
  weight: 'bg-blue-500',
  medical: 'bg-red-500',
  molt: 'bg-purple-500',
  shedding: 'bg-purple-500',
  breeding: 'bg-pink-500',
  other: 'bg-gray-500',
}

export function EventTimeline({ events }: EventTimelineProps) {
  if (events.length === 0) {
    return (
      <Card>
        <CardContent className="p-6 text-center text-muted-foreground">
          No events logged yet. Use Quick Log to add your first event.
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {events.map((event) => {
        const Icon = eventIcons[event.type]
        const colorClass = eventColors[event.type]

        return (
          <Card key={event.id}>
            <CardContent className="p-4">
              <div className="flex gap-4">
                <div className={`flex-shrink-0 w-10 h-10 rounded-full ${colorClass} flex items-center justify-center`}>
                  <Icon className="h-5 w-5 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <h3 className="font-semibold">{event.title}</h3>
                    <Badge variant="secondary" className="text-xs capitalize flex-shrink-0">
                      {event.type.replace('_', ' ')}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">
                    {fmtDate(event.happened_on)}
                  </p>
                  {event.description && (
                    <p className="text-sm mb-2">{event.description}</p>
                  )}
                  {event.details && renderDetails(event.details) && (
                    <p className="text-xs text-muted-foreground">
                      {renderDetails(event.details)}
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
