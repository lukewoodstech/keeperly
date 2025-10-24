export type PlanStatus = 'active' | 'past_due' | 'canceled' | 'none'

export interface Animal {
  id: string
  user_id: string
  name: string
  species: string
  category?: string
  sex?: 'M' | 'F' | 'Unknown'
  morph?: string
  breed?: string
  dob?: string
  acquisition_date?: string
  notes?: string
  created_at: string
}

export type EventType =
  | 'feeding'
  | 'weight'
  | 'medical'
  | 'molt'
  | 'shedding'
  | 'breeding'
  | 'other'

export interface Event {
  id: string
  user_id: string
  animal_id: string
  type: EventType
  title: string
  description?: string
  happened_on: string
  details?: Record<string, unknown>
  created_at: string
}
