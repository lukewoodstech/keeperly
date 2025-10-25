'use client'

import { useState } from 'react'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import type { EventType } from '@/lib/types'

interface QuickLogDialogProps {
  animalId: string
  onSubmit?: (data: EventFormData) => void
}

export interface EventFormData {
  type: EventType
  title: string
  description?: string
  happened_on: string
  details?: Record<string, unknown>
}

export function QuickLogDialog({ animalId, onSubmit }: QuickLogDialogProps) {
  const [open, setOpen] = useState(false)
  const [formData, setFormData] = useState<EventFormData>({
    type: 'feeding',
    title: '',
    happened_on: new Date().toISOString().split('T')[0],
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit?.(formData)
    setOpen(false)
    setFormData({
      type: 'feeding',
      title: '',
      happened_on: new Date().toISOString().split('T')[0],
    })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-blue-600 hover:bg-blue-700">
          <Plus className="h-4 w-4 mr-2" />
          Quick Log
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-gray-900">Log Event</DialogTitle>
          <DialogDescription className="text-gray-600">
            Record an event for this animal
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="type">Event Type *</Label>
              <Select
                value={formData.type}
                onValueChange={(value) => setFormData({ ...formData, type: value as EventType })}
              >
                <SelectTrigger id="type">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="feeding">Feeding</SelectItem>
                  <SelectItem value="weight">Weight</SelectItem>
                  <SelectItem value="medical">Medical</SelectItem>
                  <SelectItem value="molt">Molt</SelectItem>
                  <SelectItem value="shedding">Shedding</SelectItem>
                  <SelectItem value="breeding">Breeding</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g., Fed frozen mouse"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="happened_on">Date *</Label>
              <Input
                id="happened_on"
                type="date"
                required
                value={formData.happened_on}
                onChange={(e) => setFormData({ ...formData, happened_on: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description || ''}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Additional notes..."
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)} className="border-gray-300 hover:bg-gray-100">
              Cancel
            </Button>
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700">Save Event</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
