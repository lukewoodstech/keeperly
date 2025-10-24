import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Crown, Heart, LineChart, Shield } from 'lucide-react'

export default function LandingPage() {
  const features = [
    {
      icon: Heart,
      title: 'Animal Management',
      description: 'Keep track of all your animals in one place',
    },
    {
      icon: LineChart,
      title: 'Event Tracking',
      description: 'Log feedings, medical visits, and more',
    },
    {
      icon: Crown,
      title: 'Breeding Pro',
      description: 'Advanced genetics and breeding features',
    },
    {
      icon: Shield,
      title: 'Secure & Private',
      description: 'Your data is encrypted and safe',
    },
  ]

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <h1 className="text-2xl font-bold">Keeperly</h1>
          <Link href="/auth">
            <Button variant="outline">Sign In</Button>
          </Link>
        </div>
      </header>

      {/* Hero */}
      <main className="flex-1">
        <section className="container mx-auto px-4 py-20 md:py-32">
          <div className="max-w-3xl mx-auto text-center space-y-8">
            <h2 className="text-4xl md:text-6xl font-bold tracking-tight">
              Manage Your Animal Collection with Ease
            </h2>
            <p className="text-xl text-muted-foreground">
              The complete platform for tracking, breeding, and caring for your
              reptiles, amphibians, and exotic pets.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/auth">
                <Button size="lg" className="w-full sm:w-auto">
                  Get Started Free
                </Button>
              </Link>
              <Link href="/auth">
                <Button size="lg" variant="outline" className="w-full sm:w-auto">
                  Learn More
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="container mx-auto px-4 py-20 bg-muted/50">
          <div className="max-w-5xl mx-auto">
            <h3 className="text-3xl font-bold text-center mb-12">
              Everything You Need
            </h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {features.map((feature) => {
                const Icon = feature.icon
                return (
                  <div key={feature.title} className="text-center space-y-3">
                    <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground">
                      <Icon className="h-6 w-6" />
                    </div>
                    <h4 className="font-semibold">{feature.title}</h4>
                    <p className="text-sm text-muted-foreground">
                      {feature.description}
                    </p>
                  </div>
                )
              })}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="container mx-auto px-4 py-20">
          <div className="max-w-2xl mx-auto text-center space-y-6">
            <h3 className="text-3xl font-bold">Ready to Get Started?</h3>
            <p className="text-lg text-muted-foreground">
              Join thousands of keepers managing their collections with Keeperly
            </p>
            <Link href="/auth">
              <Button size="lg">Start Free Today</Button>
            </Link>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t">
        <div className="container mx-auto px-4 py-8 text-center text-sm text-muted-foreground">
          © 2024 Keeperly. All rights reserved.
        </div>
      </footer>
    </div>
  )
}
