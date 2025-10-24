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
      <div className="flex flex-wrap gap-3">
        <AddAnimalDialogWrapper userId={user.id} email={user.email || ''} />
        <Link href="/app/animals">
          <Button variant="outline">
            <Scan className="h-4 w-4 mr-2" />
            View All Animals
          </Button>
        </Link>
        <Button variant="outline" disabled className="opacity-50">
          <Calendar className="h-4 w-4 mr-2" />
          Schedule Task (Pro)
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

        <Card className="p-6 hover:shadow-md transition-shadow">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-600">Recent Activity</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">
                {animalList.length > 0 ? '3' : '0'}
              </p>
              <p className="text-xs text-gray-500 mt-1">Events logged this week</p>
            </div>
            <div className="w-12 h-12 rounded-lg bg-green-50 flex items-center justify-center">
              <Calendar className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200 hover:shadow-md transition-shadow">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <p className="text-sm font-medium text-purple-900">Pro Features</p>
              <p className="text-2xl font-bold text-purple-900 mt-2">
                {isProUser ? 'Active' : 'Locked'}
              </p>
              <p className="text-xs text-purple-700 mt-1">
                {isProUser ? 'Enjoying all features' : 'Upgrade to unlock'}
              </p>
            </div>
          </div>
          {!isProUser && (
            <div className="mt-4 pt-4 border-t border-purple-200">
              <Link href="/account">
                <Button size="sm" className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600">
                  Unlock Pro
                </Button>
              </Link>
            </div>
          )}
        </Card>
      </div>

      {/* Limit Warning */}
      {limitReached && (
        <Card className="p-4 bg-amber-50 border-amber-200">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <h3 className="text-sm font-semibold text-amber-900">
                Animal Limit Reached
              </h3>
              <p className="text-sm text-amber-700 mt-1">
                You've added {freeLimit}/{freeLimit} animals on the free plan. Upgrade to Pro for unlimited animals and more features.
              </p>
              <Link href="/account">
                <Button size="sm" className="mt-3 bg-amber-600 hover:bg-amber-700">
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
