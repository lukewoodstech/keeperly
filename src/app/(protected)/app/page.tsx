import { AnimalCard } from '@/components/AnimalCard'
import { AddAnimalDialogWrapper } from '@/components/AddAnimalDialogWrapper'
import { createClient } from '@/lib/supabaseServer'
import type { Animal } from '@/lib/types'

export default async function AppPage() {
  const supabase = await createClient()

  // Get current user session
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    return null // Layout will redirect
  }

  // Fetch animals for the current user
  const { data: animals } = await supabase
    .from('animals')
    .select('*')
    .eq('user_id', session.user.id)
    .order('created_at', { ascending: false })

  const animalList = (animals || []) as Animal[]

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">My Animals</h1>
          <p className="text-muted-foreground mt-1">
            {animalList.length} {animalList.length === 1 ? 'animal' : 'animals'} in your collection
          </p>
        </div>
        <AddAnimalDialogWrapper userId={session.user.id} />
      </div>

      {animalList.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground mb-4">
            You haven't added any animals yet.
          </p>
          <AddAnimalDialogWrapper userId={session.user.id} />
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {animalList.map((animal) => (
            <AnimalCard key={animal.id} animal={animal} />
          ))}
        </div>
      )}
    </div>
  )
}
