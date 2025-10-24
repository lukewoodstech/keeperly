'use client'

import { useState } from 'react'
import { Crown, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface UpgradeDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  userId: string
  email: string
}

const proFeatures = [
  'Unlimited animals',
  'Breeding tracking & genetics',
  'Advanced analytics',
  'Export data',
  'Priority support',
]

export function UpgradeDialog({ open, onOpenChange, userId, email }: UpgradeDialogProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleUpgrade = async () => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId, email }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create checkout session')
      }

      // Redirect to Stripe Checkout
      if (data.url) {
        window.location.href = data.url
      }
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message)
      } else {
        setError('An unexpected error occurred')
      }
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Crown className="h-5 w-5 text-yellow-500" />
            Upgrade to Breeding Pro
          </DialogTitle>
          <DialogDescription>
            Unlock advanced features for serious breeders
          </DialogDescription>
        </DialogHeader>

        <Card className="border-primary">
          <CardHeader>
            <CardTitle className="flex items-baseline gap-2">
              <span className="text-3xl font-bold">$9.99</span>
              <span className="text-muted-foreground text-base font-normal">/month</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {proFeatures.map((feature) => (
                <li key={feature} className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-primary flex-shrink-0" />
                  <span className="text-sm">{feature}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {error && (
          <div className="text-sm text-destructive">{error}</div>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>
            Maybe Later
          </Button>
          <Button onClick={handleUpgrade} disabled={loading}>
            <Crown className="h-4 w-4 mr-2" />
            {loading ? 'Loading...' : 'Upgrade Now'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
