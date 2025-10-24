'use client'

import { useState } from 'react'
import { AddAnimalDialog, type AnimalFormData } from './AddAnimalDialog'
import { UpgradeDialog } from './UpgradeDialog'
import { createAnimal } from '@/app/(protected)/app/actions'

interface AddAnimalDialogWrapperProps {
  userId: string
  email: string
}

export function AddAnimalDialogWrapper({ userId, email }: AddAnimalDialogWrapperProps) {
  const [upgradeOpen, setUpgradeOpen] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (data: AnimalFormData) => {
    setError(null)

    const result = await createAnimal(data, userId)

    if (!result.ok) {
      if (result.requiresUpgrade) {
        setUpgradeOpen(true)
      } else {
        setError(result.error || 'Failed to create animal')
        // Could show toast notification here
        console.error('Error creating animal:', result.error)
      }
    }
    // On success, the page will revalidate automatically
  }

  return (
    <>
      <AddAnimalDialog onSubmit={handleSubmit} />
      <UpgradeDialog
        open={upgradeOpen}
        onOpenChange={setUpgradeOpen}
        userId={userId}
        email={email}
      />
    </>
  )
}
