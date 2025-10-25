'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { deleteAnimal } from '@/app/(protected)/app/actions'

interface DeleteAnimalDialogProps {
  animalId: string
  animalName: string
  userId: string
  isOpen: boolean
  onOpenChange: (open: boolean) => void
}

export function DeleteAnimalDialog({
  animalId,
  animalName,
  userId,
  isOpen,
  onOpenChange,
}: DeleteAnimalDialogProps) {
  const [isDeleting, setIsDeleting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const handleDelete = async () => {
    setIsDeleting(true)
    setError(null)

    const result = await deleteAnimal(animalId, userId)

    if (!result.ok) {
      setError(result.error || 'Failed to delete animal')
      setIsDeleting(false)
      console.error('Error deleting animal:', result.error)
    } else {
      // On success, redirect to dashboard
      router.push('/app')
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] rounded-xl">
        <DialogHeader className="space-y-3">
          <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center mx-auto">
            <AlertCircle className="h-6 w-6 text-red-600" />
          </div>
          <DialogTitle className="text-xl font-semibold text-gray-900 text-center">
            Delete {animalName}?
          </DialogTitle>
          <DialogDescription className="text-sm text-gray-600 text-center">
            This action cannot be undone. This will permanently delete this animal and all
            associated events from your collection.
          </DialogDescription>
        </DialogHeader>

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        <DialogFooter className="gap-2 sm:gap-0">
          <Button
            type="button"
            variant="ghost"
            onClick={() => onOpenChange(false)}
            disabled={isDeleting}
            className="text-gray-700 hover:bg-gray-100"
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleDelete}
            disabled={isDeleting}
            className="bg-red-600 hover:bg-red-700 text-white"
          >
            {isDeleting ? 'Deleting...' : 'Delete Animal'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
