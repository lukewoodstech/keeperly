import { Crown, Mail, Calendar, CreditCard } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { SignOutButton } from '@/components/SignOutButton'
import { UpgradeButton } from '@/components/UpgradeButton'
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
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-3xl font-bold">Account Settings</h1>
        <p className="text-muted-foreground mt-1">
          Manage your account and subscription
        </p>
      </div>

      {/* Profile Card */}
      <Card>
        <CardHeader>
          <CardTitle>Profile</CardTitle>
          <CardDescription>Your account information</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-3">
            <Mail className="h-5 w-5 text-muted-foreground" />
            <div>
              <p className="text-sm font-medium">Email</p>
              <p className="text-sm text-muted-foreground">{user.email}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Calendar className="h-5 w-5 text-muted-foreground" />
            <div>
              <p className="text-sm font-medium">Member Since</p>
              <p className="text-sm text-muted-foreground">
                {fmtDate(user.created_at)}
              </p>
            </div>
          </div>
          <div className="pt-4 border-t">
            <SignOutButton />
          </div>
        </CardContent>
      </Card>

      {/* Subscription Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                {isPro && <Crown className="h-5 w-5 text-yellow-500" />}
                Subscription
              </CardTitle>
              <CardDescription>
                {isPro
                  ? 'You have access to all Breeding Pro features'
                  : 'Upgrade to unlock advanced features'}
              </CardDescription>
            </div>
            <Badge
              variant={
                isPro ? 'default' : isPastDue ? 'destructive' : 'secondary'
              }
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
              <div className="flex items-center gap-3">
                <Crown className="h-5 w-5 text-yellow-500" />
                <div>
                  <p className="text-sm font-medium">Breeding Pro</p>
                  <p className="text-sm text-muted-foreground">$9.99/month</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <CreditCard className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Payment Method</p>
                  <p className="text-sm text-muted-foreground">
                    •••• •••• •••• 4242
                  </p>
                </div>
              </div>
              <div className="pt-4 border-t space-x-2">
                <Button variant="outline" size="sm">
                  Manage Billing
                </Button>
                <Button variant="outline" size="sm">
                  Cancel Subscription
                </Button>
              </div>
            </>
          ) : (
            <>
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between text-sm mb-2">
                    <span className="font-medium">Free Plan</span>
                    <span className="text-muted-foreground">
                      {totalAnimals} of {freeLimit} animals used
                    </span>
                  </div>
                  <Progress value={usagePercent} className="h-2" />
                  {totalAnimals >= freeLimit && (
                    <p className="text-xs text-destructive mt-2">
                      You've reached the free tier limit. Upgrade to add more animals.
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium">
                    Unlock advanced features with Breeding Pro:
                  </p>
                  <ul className="text-sm text-muted-foreground space-y-1 ml-4">
                    <li>• Unlimited animals</li>
                    <li>• Breeding tracking & genetics</li>
                    <li>• Advanced analytics</li>
                    <li>• Export data</li>
                    <li>• Priority support</li>
                  </ul>
                </div>
              </div>
              <div className="pt-4 border-t">
                <UpgradeButton userId={user.id} email={user.email || ''} />
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Danger Zone */}
      <Card className="border-destructive">
        <CardHeader>
          <CardTitle className="text-destructive">Danger Zone</CardTitle>
          <CardDescription>Irreversible account actions</CardDescription>
        </CardHeader>
        <CardContent>
          <Button variant="destructive" size="sm">
            Delete Account
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
