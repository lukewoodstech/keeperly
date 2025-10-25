'use client'

import { useState } from 'react'
import { Edit, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { EditAnimalDialogWrapper } from './EditAnimalDialogWrapper'
import type { Animal } from '@/lib/types'

interface AnimalActionsProps {
  animal: Animal
  userId: string
}

export function AnimalActions({ animal, userId }: AnimalActionsProps) {
  const [editOpen, setEditOpen] = useState(false)

  return (
    <>
      <Button
        variant="outline"
        size="icon"
        className="hover:bg-gray-100 border-gray-300"
        onClick={() => setEditOpen(true)}
      >
        <Edit className="h-4 w-4 text-gray-700" />
      </Button>
      <Button
        variant="outline"
        size="icon"
        className="hover:bg-red-50 border-gray-300 hover:border-red-300"
      >
        <Trash2 className="h-4 w-4 text-gray-700 hover:text-red-600" />
      </Button>

      <EditAnimalDialogWrapper
        animal={animal}
        userId={userId}
        isOpen={editOpen}
        onOpenChange={setEditOpen}
      />
    </>
  )
}
