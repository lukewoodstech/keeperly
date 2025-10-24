'use client'

import { useState } from 'react'
import { QuickLogDialog, type EventFormData } from './QuickLogDialog'
import { createEvent } from '@/app/(protected)/app/animal/[id]/actions'

interface QuickLogDialogWrapperProps {
  animalId: string
  userId: string
}

export function QuickLogDialogWrapper({ animalId, userId }: QuickLogDialogWrapperProps) {
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (data: EventFormData) => {
    setError(null)

    const result = await createEvent(animalId, userId, {
      type: data.type,
      title: data.title,
      description: data.description,
      happened_on: data.happened_on,
      details: data.details,
    })

    if (!result.success) {
      setError(result.error || 'Failed to create event')
      // Could show toast notification here
      console.error('Error creating event:', result.error)
    }
    // On success, the page will revalidate automatically
  }

  return <QuickLogDialog animalId={animalId} onSubmit={handleSubmit} />
}
