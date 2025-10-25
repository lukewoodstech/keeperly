import { Crown, Mail, Calendar, CreditCard, AlertTriangle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { SignOutButton } from '@/components/SignOutButton'
import { UpgradeButton } from '@/components/UpgradeButton'
import { ProBadge } from '@/components/ProBadge'
import { createClient } from '@/lib/supabaseServer'
import { fmtDate } from '@/lib/format'
import type { PlanStatus } from '@/lib/types'

export default async function AccountPage() {
  const supabase = await createClient()

  // Get current user
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return null // Layout will redirect
  }

  // Fetch subscription data
  const { data: subscription } = await supabase
    .from('subscriptions')
    .select('*')
    .eq('user_id', user.id)
    .single()

  const subscriptionData: {
    status: PlanStatus
    stripe_customer_id?: string
    stripe_subscription_id?: string
  } = subscription || { status: 'none' }

  const isPro = subscriptionData.status === 'active'
  const isPastDue = subscriptionData.status === 'past_due'

  // Fetch animal count for usage meter
  const { count: animalCount } = await supabase
    .from('animals')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', user.id)

  const totalAnimals = animalCount || 0
  const freeLimit = 5
  const usagePercent = Math.min((totalAnimals / freeLimit) * 100, 100)

  return (
    <div className="space-y-8 max-w-4xl">
      {/* Hero Section */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Account Settings</h1>
        <p className="text-gray-600 mt-1">
          Manage your account and subscription
        </p>
      </div>

      {/* Profile Card */}
      <Card className="hover:shadow-md transition-shadow">
        <CardHeader>
          <CardTitle className="text-gray-900">Profile</CardTitle>
          <CardDescription className="text-gray-600">Your account information</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50">
            <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
              <Mail className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-700">Email</p>
              <p className="text-sm text-gray-600">{user.email}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50">
            <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
              <Calendar className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-700">Member Since</p>
              <p className="text-sm text-gray-600">
                {fmtDate(user.created_at)}
              </p>
            </div>
          </div>
          <div className="pt-4 border-t border-gray-200">
            <SignOutButton />
          </div>
        </CardContent>
      </Card>

      {/* Subscription Card */}
      <Card className={`hover:shadow-md transition-shadow ${isPro ? 'bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200' : ''}`}>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2 text-gray-900">
                {isPro && <ProBadge />}
                Subscription
              </CardTitle>
              <CardDescription className={isPro ? 'text-purple-700' : 'text-gray-600'}>
                {isPro
                  ? 'You have access to all Pro features'
                  : 'Upgrade to unlock advanced features'}
              </CardDescription>
            </div>
            <Badge
              variant={isPastDue ? 'destructive' : 'secondary'}
              className={isPro ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white border-0' : 'bg-gray-100 text-gray-700'}
            >
              {subscriptionData.status === 'none'
                ? 'Free'
                : subscriptionData.status.replace('_', ' ').toUpperCase()}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {isPro ? (
            <>
              <div className="flex items-center gap-3 p-4 rounded-lg bg-white border border-purple-200">
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center">
                  <Crown className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900">Keeperly Pro</p>
                  <p className="text-sm text-gray-600">$9.99/month</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 rounded-lg bg-white border border-purple-200">
                <div className="w-12 h-12 rounded-lg bg-gray-50 flex items-center justify-center">
                  <CreditCard className="h-6 w-6 text-gray-600" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900">Payment Method</p>
                  <p className="text-sm text-gray-600">
                    •••• •••• •••• 4242
                  </p>
                </div>
              </div>
              <div className="pt-4 border-t border-purple-200 flex gap-2">
                <Button variant="outline" size="sm" className="flex-1 border-purple-300 hover:bg-purple-50">
                  Manage Billing
                </Button>
                <Button variant="outline" size="sm" className="flex-1 border-purple-300 hover:bg-purple-50">
                  Cancel Subscription
                </Button>
              </div>
            </>
          ) : (
            <>
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between text-sm mb-2">
                    <span className="font-semibold text-gray-900">Free Plan</span>
                    <span className="text-gray-600">
                      {totalAnimals} of {freeLimit} animals used
                    </span>
                  </div>
                  <Progress value={usagePercent} className="h-2" />
                  {totalAnimals >= freeLimit && (
                    <p className="text-xs text-red-600 font-medium mt-2 flex items-center gap-1">
                      <AlertTriangle className="h-3 w-3" />
                      You've reached the free tier limit. Upgrade to add more animals.
                    </p>
                  )}
                </div>
                <div className="space-y-3 p-4 rounded-lg bg-gradient-to-br from-blue-50 to-purple-50 border border-blue-100">
                  <p className="text-sm font-semibold text-gray-900">
                    Unlock advanced features with Pro:
                  </p>
                  <ul className="text-sm text-gray-700 space-y-2">
                    <li className="flex items-start gap-2">
                      <span className="text-blue-600 font-bold">✓</span>
                      <span>Unlimited animals</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-600 font-bold">✓</span>
                      <span>Breeding tracking & genetics</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-600 font-bold">✓</span>
                      <span>Advanced analytics</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-600 font-bold">✓</span>
                      <span>Export data</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-600 font-bold">✓</span>
                      <span>Priority support</span>
                    </li>
                  </ul>
                </div>
              </div>
              <div className="pt-4 border-t border-gray-200">
                <UpgradeButton userId={user.id} email={user.email || ''} />
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Danger Zone */}
      <Card className="border-red-200 bg-red-50/30 hover:shadow-md transition-shadow">
        <CardHeader>
          <CardTitle className="text-red-700 flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            Danger Zone
          </CardTitle>
          <CardDescription className="text-red-600">Irreversible account actions</CardDescription>
        </CardHeader>
        <CardContent>
          <Button variant="destructive" size="sm" className="bg-red-600 hover:bg-red-700">
            Delete Account
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
