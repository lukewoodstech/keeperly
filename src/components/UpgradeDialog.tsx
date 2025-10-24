'use client'

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
  onUpgrade?: () => void
}

const proFeatures = [
  'Unlimited animals',
  'Breeding tracking & genetics',
  'Advanced analytics',
  'Export data',
  'Priority support',
]

export function UpgradeDialog({ open, onOpenChange, onUpgrade }: UpgradeDialogProps) {
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

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Maybe Later
          </Button>
          <Button onClick={onUpgrade}>
            <Crown className="h-4 w-4 mr-2" />
            Upgrade Now
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
