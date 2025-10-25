'use client'

import { useState } from 'react'
import { EditAnimalDialog, type AnimalFormData } from './EditAnimalDialog'
import { updateAnimal } from '@/app/(protected)/app/actions'
import type { Animal } from '@/lib/types'
import { useRouter } from 'next/navigation'

interface EditAnimalDialogWrapperProps {
  animal: Animal
  userId: string
  isOpen: boolean
  onOpenChange: (open: boolean) => void
}

export function EditAnimalDialogWrapper({
  animal,
  userId,
  isOpen,
  onOpenChange,
}: EditAnimalDialogWrapperProps) {
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const handleSubmit = async (data: AnimalFormData) => {
    setError(null)

    const result = await updateAnimal(animal.id, data, userId)

    if (!result.ok) {
      setError(result.error || 'Failed to update animal')
      console.error('Error updating animal:', result.error)
      // Could show toast notification here
    } else {
      // On success, the page will revalidate automatically
      router.refresh()
    }
  }

  return (
    <EditAnimalDialog
      animal={animal}
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      onSubmit={handleSubmit}
    />
  )
}
