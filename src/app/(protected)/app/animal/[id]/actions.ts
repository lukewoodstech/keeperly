'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabaseServer'
import { validateEventDetails } from '@/lib/validators'
import type { Event, EventType } from '@/lib/types'

interface ActionResult {
  success: boolean
  error?: string
}

interface EventsResult {
  success: boolean
  data?: Event[]
  error?: string
}

export async function listEvents(
  animalId: string,
  userId: string
): Promise<EventsResult> {
  try {
    const supabase = await createClient()

    // Verify animal ownership
    const { data: animal } = await supabase
      .from('animals')
      .select('user_id')
      .eq('id', animalId)
      .single()

    if (!animal) {
      return {
        success: false,
        error: 'Animal not found',
      }
    }

    if (animal.user_id !== userId) {
      return {
        success: false,
        error: 'You do not have permission to view this animal',
      }
    }

    // Fetch events sorted by happened_on descending (most recent first)
    const { data: events, error } = await supabase
      .from('events')
      .select('*')
      .eq('animal_id', animalId)
      .order('happened_on', { ascending: false })

    if (error) {
      return {
        success: false,
        error: error.message,
      }
    }

    return {
      success: true,
      data: (events || []) as Event[],
    }
  } catch (error) {
    if (error instanceof Error) {
      return {
        success: false,
        error: error.message,
      }
    }
    return {
      success: false,
      error: 'An unexpected error occurred',
    }
  }
}

interface CreateEventInput {
  type: EventType
  title: string
  description?: string
  happened_on: string
  details?: unknown
}

export async function createEvent(
  animalId: string,
  userId: string,
  input: CreateEventInput
): Promise<ActionResult> {
  try {
    const supabase = await createClient()

    // Verify animal ownership
    const { data: animal } = await supabase
      .from('animals')
      .select('user_id')
      .eq('id', animalId)
      .single()

    if (!animal) {
      return {
        success: false,
        error: 'Animal not found',
      }
    }

    if (animal.user_id !== userId) {
      return {
        success: false,
        error: 'You do not have permission to log events for this animal',
      }
    }

    // Validate event details based on event type
    let validatedDetails: Record<string, unknown> | undefined
    if (input.details) {
      try {
        validatedDetails = validateEventDetails(input.type, input.details)
      } catch (error) {
        if (error instanceof Error) {
          return {
            success: false,
            error: error.message,
          }
        }
        return {
          success: false,
          error: 'Invalid event details',
        }
      }
    }

    // Insert event
    const { error: insertError } = await supabase.from('events').insert({
      user_id: userId,
      animal_id: animalId,
      type: input.type,
      title: input.title,
      description: input.description,
      happened_on: input.happened_on,
      details: validatedDetails || null,
    })

    if (insertError) {
      return {
        success: false,
        error: insertError.message,
      }
    }

    // Revalidate the animal detail page
    revalidatePath(`/app/animal/${animalId}`)

    return { success: true }
  } catch (error) {
    if (error instanceof Error) {
      return {
        success: false,
        error: error.message,
      }
    }
    return {
      success: false,
      error: 'An unexpected error occurred',
    }
  }
}
