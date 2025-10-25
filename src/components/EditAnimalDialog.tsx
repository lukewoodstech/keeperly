'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { cn } from '@/lib/utils'
import type { Animal } from '@/lib/types'

interface EditAnimalDialogProps {
  animal: Animal
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  onSubmit?: (data: AnimalFormData) => void
}

export interface AnimalFormData {
  name: string
  species: string
  breed?: string
  sex?: string
  morph?: string
  dob?: string
  acquisition_date?: string
  notes?: string
}

export function EditAnimalDialog({ animal, isOpen, onOpenChange, onSubmit }: EditAnimalDialogProps) {
  const [formData, setFormData] = useState<AnimalFormData>({
    name: animal.name,
    species: animal.species,
    breed: animal.breed || '',
    sex: animal.sex || '',
    morph: animal.morph || '',
    dob: animal.dob || '',
    acquisition_date: animal.acquisition_date || '',
    notes: animal.notes || '',
  })

  // Update form data when animal changes
  useEffect(() => {
    setFormData({
      name: animal.name,
      species: animal.species,
      breed: animal.breed || '',
      sex: animal.sex || '',
      morph: animal.morph || '',
      dob: animal.dob || '',
      acquisition_date: animal.acquisition_date || '',
      notes: animal.notes || '',
    })
  }, [animal])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit?.(formData)
    onOpenChange(false)
  }

  const sexOptions = [
    { value: 'M', label: 'Male' },
    { value: 'F', label: 'Female' },
    { value: 'Unknown', label: 'Unknown' },
  ]

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[640px] max-h-[90vh] overflow-y-auto rounded-xl">
        <DialogHeader className="space-y-1.5">
          <DialogTitle className="text-xl font-semibold text-gray-900">Edit Animal</DialogTitle>
          <DialogDescription className="text-sm text-gray-500">
            Update information for {animal.name}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="mt-4">
          <div className="space-y-5">
            {/* Row 1: Name & Species */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="name" className="text-sm font-medium text-gray-700">
                  Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="name"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g., Shadow"
                  className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="species" className="text-sm font-medium text-gray-700">
                  Species <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="species"
                  required
                  value={formData.species}
                  onChange={(e) => setFormData({ ...formData, species: e.target.value })}
                  placeholder="e.g., Ball Python"
                  className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Row 2: Breed & Morph */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="breed" className="text-sm font-medium text-gray-700">
                  Breed
                </Label>
                <Input
                  id="breed"
                  value={formData.breed || ''}
                  onChange={(e) => setFormData({ ...formData, breed: e.target.value })}
                  placeholder="Optional"
                  className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="morph" className="text-sm font-medium text-gray-700">
                  Morph
                </Label>
                <Input
                  id="morph"
                  value={formData.morph || ''}
                  onChange={(e) => setFormData({ ...formData, morph: e.target.value })}
                  placeholder="e.g., Albino"
                  className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Row 3: Sex (Segmented Control) */}
            <div className="space-y-1.5">
              <Label className="text-sm font-medium text-gray-700">Sex</Label>
              <div className="flex gap-2">
                {sexOptions.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setFormData({ ...formData, sex: option.value })}
                    className={cn(
                      'flex-1 px-4 py-2 text-sm font-medium rounded-lg border transition-colors',
                      formData.sex === option.value
                        ? 'bg-blue-50 border-blue-600 text-blue-600'
                        : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                    )}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Row 4: Dates */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="dob" className="text-sm font-medium text-gray-700">
                  Date of Birth
                </Label>
                <Input
                  id="dob"
                  type="date"
                  value={formData.dob || ''}
                  onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
                  className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="acquisition_date" className="text-sm font-medium text-gray-700">
                  Acquisition Date
                </Label>
                <Input
                  id="acquisition_date"
                  type="date"
                  value={formData.acquisition_date || ''}
                  onChange={(e) => setFormData({ ...formData, acquisition_date: e.target.value })}
                  className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Row 5: Notes */}
            <div className="space-y-1.5">
              <Label htmlFor="notes" className="text-sm font-medium text-gray-700">
                Notes
              </Label>
              <Textarea
                id="notes"
                value={formData.notes || ''}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                placeholder="Any additional information..."
                rows={3}
                className="border-gray-300 focus:border-blue-500 focus:ring-blue-500 resize-none"
              />
            </div>
          </div>

          <DialogFooter className="mt-6 gap-2">
            <Button
              type="button"
              variant="ghost"
              onClick={() => onOpenChange(false)}
              className="text-gray-700 hover:bg-gray-100"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              Save Changes
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
