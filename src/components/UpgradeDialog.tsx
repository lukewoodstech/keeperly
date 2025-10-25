'use client'

import { useState } from 'react'
import { Crown, Check, Sparkles } from 'lucide-react'
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
import { ProBadge } from '@/components/ProBadge'

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
      <DialogContent className="sm:max-w-[500px] bg-gradient-to-br from-purple-50 to-pink-50">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-gray-900">
            <ProBadge variant="sparkle" />
            Upgrade to Keeperly Pro
          </DialogTitle>
          <DialogDescription className="text-purple-700">
            Unlock advanced features for serious breeders
          </DialogDescription>
        </DialogHeader>

        <Card className="border-purple-200 bg-white shadow-md">
          <CardHeader className="bg-gradient-to-br from-purple-50 to-pink-50">
            <CardTitle className="flex items-baseline gap-2 text-gray-900">
              <span className="text-3xl font-bold">$9.99</span>
              <span className="text-gray-600 text-base font-normal">/month</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <ul className="space-y-3">
              {proFeatures.map((feature) => (
                <li key={feature} className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center flex-shrink-0">
                    <Check className="h-4 w-4 text-white" />
                  </div>
                  <span className="text-sm text-gray-700 font-medium">{feature}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {error && (
          <div className="text-sm text-red-600 bg-red-50 p-3 rounded-lg border border-red-200">{error}</div>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={loading} className="border-purple-300 hover:bg-purple-50">
            Maybe Later
          </Button>
          <Button onClick={handleUpgrade} disabled={loading} className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white shadow-md">
            <Sparkles className="h-4 w-4 mr-2" />
            {loading ? 'Loading...' : 'Upgrade Now'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
