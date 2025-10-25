'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabaseServer'
import { animalSchema } from '@/lib/validators'

interface ActionResult {
  ok?: true
  error?: string
  requiresUpgrade?: boolean
}

export async function createAnimal(
  formData: unknown,
  userId: string
): Promise<ActionResult> {
  try {
    const supabase = await createClient()

    // Check subscription status
    const { data: subscription } = await supabase
      .from('subscriptions')
      .select('status')
      .eq('user_id', userId)
      .single()

    const isPro = subscription?.status === 'active'

    // If not pro, check animal count limit (5 animals max for free tier)
    if (!isPro) {
      const { count } = await supabase
        .from('animals')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId)

      if (count !== null && count >= 5) {
        return {
          error: 'You have reached the limit of 5 animals on the free plan',
          requiresUpgrade: true,
        }
      }
    }

    // Validate form data
    const validatedData = animalSchema.parse(formData)

    // Insert animal
    const { error: insertError } = await supabase.from('animals').insert({
      user_id: userId,
      ...validatedData,
    })

    if (insertError) {
      return {
        error: insertError.message,
      }
    }

    // Revalidate the animals page
    revalidatePath('/app')

    return { ok: true }
  } catch (error) {
    if (error instanceof Error) {
      return {
        error: error.message,
      }
    }
    return {
      error: 'An unexpected error occurred',
    }
  }
}

export async function updateAnimal(
  animalId: string,
  formData: unknown,
  userId: string
): Promise<ActionResult> {
  try {
    const supabase = await createClient()

    // Verify ownership
    const { data: animal } = await supabase
      .from('animals')
      .select('user_id')
      .eq('id', animalId)
      .single()

    if (!animal) {
      return {
        error: 'Animal not found',
      }
    }

    if (animal.user_id !== userId) {
      return {
        error: 'You do not have permission to update this animal',
      }
    }

    // Validate form data
    const validatedData = animalSchema.parse(formData)

    // Update animal
    const { error: updateError } = await supabase
      .from('animals')
      .update(validatedData)
      .eq('id', animalId)

    if (updateError) {
      return {
        error: updateError.message,
      }
    }

    // Revalidate the animals page and detail page
    revalidatePath('/app')
    revalidatePath(`/app/animal/${animalId}`)

    return { ok: true }
  } catch (error) {
    if (error instanceof Error) {
      return {
        error: error.message,
      }
    }
    return {
      error: 'An unexpected error occurred',
    }
  }
}

export async function deleteAnimal(
  animalId: string,
  userId: string
): Promise<ActionResult> {
  try {
    const supabase = await createClient()

    // Verify ownership
    const { data: animal } = await supabase
      .from('animals')
      .select('user_id')
      .eq('id', animalId)
      .single()

    if (!animal) {
      return {
        error: 'Animal not found',
      }
    }

    if (animal.user_id !== userId) {
      return {
        error: 'You do not have permission to delete this animal',
      }
    }

    // Delete animal (events will be cascade deleted by database)
    const { error: deleteError } = await supabase
      .from('animals')
      .delete()
      .eq('id', animalId)

    if (deleteError) {
      return {
        error: deleteError.message,
      }
    }

    // Revalidate the animals page
    revalidatePath('/app')

    return { ok: true }
  } catch (error) {
    if (error instanceof Error) {
      return {
        error: error.message,
      }
    }
    return {
      error: 'An unexpected error occurred',
    }
  }
}
