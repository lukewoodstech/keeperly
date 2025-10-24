import { z } from 'zod'
import type { EventType } from './types'

// Animal validation schema
export const animalSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name is too long'),
  species: z.string().min(1, 'Species is required').max(100, 'Species is too long'),
  category: z.string().max(50).optional(),
  sex: z.enum(['M', 'F', 'Unknown']).optional(),
  morph: z.string().max(100).optional(),
  breed: z.string().max(100).optional(),
  dob: z.string().optional(),
  acquisition_date: z.string().optional(),
  notes: z.string().max(1000).optional(),
})

export type AnimalFormData = z.infer<typeof animalSchema>

// Event detail schemas
export const feedingSchema = z.object({
  prey: z.string().min(1, 'Prey type is required'),
  amount: z.string().min(1, 'Amount is required'),
})

export const weightSchema = z.object({
  grams: z.number().positive('Weight must be greater than 0'),
  unit: z.string().default('g'),
})

export const medicalSchema = z.object({
  treatment: z.string().min(1, 'Treatment is required'),
  vet: z.string().optional(),
  medication: z.string().optional(),
  notes: z.string().optional(),
})

export const moltSchema = z.object({
  stage: z.enum(['pre_molt', 'in_molt', 'post_molt', 'complete']),
  photoUrl: z.string().url().optional().or(z.literal('')),
  notes: z.string().optional(),
})

export const breedingSchema = z.object({
  partnerId: z.string().uuid().optional(),
  partnerName: z.string().optional(),
  result: z.enum(['successful', 'unsuccessful', 'pending', 'eggs_laid', 'eggs_fertile', 'eggs_infertile']),
  eggs: z.number().int().nonnegative().optional(),
  notes: z.string().optional(),
})

export const sheddingSchema = z.object({
  quality: z.enum(['complete', 'incomplete', 'stuck_shed']).optional(),
  notes: z.string().optional(),
})

export const otherSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
})

// Map of event types to their schemas
const eventSchemaMap = {
  feeding: feedingSchema,
  weight: weightSchema,
  medical: medicalSchema,
  molt: moltSchema,
  shedding: sheddingSchema,
  breeding: breedingSchema,
  other: otherSchema,
} as const

// Validate event details based on event type
export function validateEventDetails(
  type: EventType,
  input: unknown
): Record<string, unknown> {
  const schema = eventSchemaMap[type]

  if (!schema) {
    throw new Error(`Unknown event type: ${type}`)
  }

  try {
    return schema.parse(input) as Record<string, unknown>
  } catch (error) {
    if (error instanceof z.ZodError) {
      const messages = error.errors.map((e) => e.message).join(', ')
      throw new Error(`Validation failed: ${messages}`)
    }
    throw error
  }
}

// Type exports for TypeScript
export type FeedingDetails = z.infer<typeof feedingSchema>
export type WeightDetails = z.infer<typeof weightSchema>
export type MedicalDetails = z.infer<typeof medicalSchema>
export type MoltDetails = z.infer<typeof moltSchema>
export type BreedingDetails = z.infer<typeof breedingSchema>
export type SheddingDetails = z.infer<typeof sheddingSchema>
export type OtherDetails = z.infer<typeof otherSchema>
