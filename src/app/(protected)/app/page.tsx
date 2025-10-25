import { AnimalCard } from '@/components/AnimalCard'
import { AddAnimalDialogWrapper } from '@/components/AddAnimalDialogWrapper'
import { StatCard } from '@/components/StatCard'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { createClient } from '@/lib/supabaseServer'
import type { Animal } from '@/lib/types'
import { Scan, Plus, Calendar, AlertCircle } from 'lucide-react'
import Link from 'next/link'

export default async function AppPage() {
  const supabase = await createClient()

  // Get current user
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return null
  }

  // Fetch animals and subscription
  const [{ data: animals }, { data: subscription }] = await Promise.all([
    supabase
      .from('animals')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false }),
    supabase
      .from('subscriptions')
      .select('status')
      .eq('user_id', user.id)
      .single(),
  ])

  const animalList = (animals || []) as Animal[]
  const isProUser = subscription?.status === 'active'
  const freeLimit = 5
  const animalCount = animalList.length
  const limitReached = !isProUser && animalCount >= freeLimit

  // Get user's first name
  const firstName = user.email?.split('@')[0] || 'there'

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          Welcome back, {firstName}! 👋
        </h1>
        <p className="text-gray-600 mt-1">
          Here's what's happening with your collection today
        </p>
      </div>

      {/* Quick Actions */}
      <div className="flex flex-wrap gap-2">
        <AddAnimalDialogWrapper userId={user.id} email={user.email || ''} />
        <Link href="/app/animals">
          <Button variant="outline" className="border-gray-300 hover:bg-gray-50">
            <Scan className="h-4 w-4 mr-2" />
            View All
          </Button>
        </Link>
        <Button variant="outline" disabled className="opacity-40 cursor-not-allowed border-gray-300">
          <Calendar className="h-4 w-4 mr-2" />
          Tasks (Pro)
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <StatCard
          title="Total Animals"
          value={animalCount}
          icon={Scan}
          description={isProUser ? 'Unlimited' : `${animalCount} of ${freeLimit} used`}
          showProgress={!isProUser}
          progressValue={animalCount}
          progressMax={freeLimit}
          variant={limitReached ? 'warning' : 'default'}
          actionLabel={limitReached ? 'Upgrade to Pro' : undefined}
          actionHref={limitReached ? '/account' : undefined}
        />

        <StatCard
          title="Recent Activity"
          value={animalList.length > 0 ? '3' : '0'}
          icon={Calendar}
          description="Events logged this week"
        />

        <Card className="p-5 border border-gray-200 bg-white shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                Pro Status
              </p>
              <p className="text-2xl font-semibold text-gray-900 mt-1.5">
                {isProUser ? 'Active' : 'Free'}
              </p>
              <p className="text-sm text-gray-600 mt-1">
                {isProUser ? 'All features unlocked' : 'Limited features'}
              </p>
            </div>
          </div>
          {!isProUser && (
            <div className="mt-4 pt-4 border-t border-gray-100">
              <Link href="/account">
                <Button size="sm" className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                  Upgrade to Pro
                </Button>
              </Link>
            </div>
          )}
        </Card>
      </div>

      {/* Limit Warning */}
      {limitReached && (
        <Card className="p-4 bg-yellow-50 border border-yellow-200 shadow-sm">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-yellow-700 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <h3 className="text-sm font-semibold text-gray-900">
                Animal Limit Reached
              </h3>
              <p className="text-sm text-gray-600 mt-1">
                You've added {freeLimit}/{freeLimit} animals on the free plan. Upgrade to Pro for unlimited animals.
              </p>
              <Link href="/account">
                <Button size="sm" className="mt-3 bg-blue-600 hover:bg-blue-700 text-white">
                  Upgrade to Pro
                </Button>
              </Link>
            </div>
          </div>
        </Card>
      )}

      {/* Animals Section */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-gray-900">Your Collection</h2>
          <span className="text-sm text-gray-600">
            {animalCount} {animalCount === 1 ? 'animal' : 'animals'}
          </span>
        </div>

        {animalList.length === 0 ? (
          <Card className="p-12 text-center">
            <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
              <Scan className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No animals yet
            </h3>
            <p className="text-gray-600 mb-6 max-w-sm mx-auto">
              Add your first exotic pet to start tracking care, health, and breeding records.
            </p>
            <AddAnimalDialogWrapper userId={user.id} email={user.email || ''} />
          </Card>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {animalList.map((animal) => (
              <AnimalCard key={animal.id} animal={animal} />
            ))}
            {!limitReached && (
              <button
                className="border-2 border-dashed border-gray-300 rounded-xl p-8 hover:border-blue-400 hover:bg-blue-50/50 transition-all text-center group"
                onClick={() => {
                  document.querySelector<HTMLButtonElement>('[data-add-animal-trigger]')?.click()
                }}
              >
                <div className="w-12 h-12 rounded-full bg-gray-100 group-hover:bg-blue-100 flex items-center justify-center mx-auto mb-3 transition-colors">
                  <Plus className="h-6 w-6 text-gray-400 group-hover:text-blue-600" />
                </div>
                <p className="text-sm font-medium text-gray-600 group-hover:text-blue-700">
                  Add Animal
                </p>
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
