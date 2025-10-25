import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Crown, Heart, LineChart, Shield, Sparkles, Check } from 'lucide-react'
import { Card } from '@/components/ui/card'

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
    <div className="min-h-screen flex flex-col bg-white">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white/80 backdrop-blur sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
              <span className="text-white font-bold text-sm">K</span>
            </div>
            <h1 className="text-xl font-bold text-gray-900">Keeperly</h1>
          </div>
          <Link href="/auth">
            <Button variant="outline" className="border-gray-300 hover:bg-gray-50">Sign In</Button>
          </Link>
        </div>
      </header>

      {/* Hero */}
      <main className="flex-1">
        <section className="container mx-auto px-4 py-20 md:py-32 bg-gradient-to-br from-blue-50 via-white to-purple-50">
          <div className="max-w-3xl mx-auto text-center space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-100 text-blue-700 text-sm font-medium mb-4">
              <Sparkles className="h-4 w-4" />
              The modern way to manage your collection
            </div>
            <h2 className="text-4xl md:text-6xl font-bold tracking-tight text-gray-900">
              Manage Your Animal Collection with Ease
            </h2>
            <p className="text-xl text-gray-600">
              The complete platform for tracking, breeding, and caring for your
              reptiles, amphibians, and exotic pets.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/auth">
                <Button size="lg" className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 shadow-lg">
                  Get Started Free
                </Button>
              </Link>
              <Link href="/auth">
                <Button size="lg" variant="outline" className="w-full sm:w-auto border-gray-300 hover:bg-gray-50">
                  Learn More
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="container mx-auto px-4 py-20 bg-gray-50">
          <div className="max-w-5xl mx-auto">
            <h3 className="text-3xl font-bold text-center mb-4 text-gray-900">
              Everything You Need
            </h3>
            <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
              Powerful features to help you manage your collection, track breeding, and keep detailed records.
            </p>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {features.map((feature, index) => {
                const Icon = feature.icon
                const colors = [
                  { bg: 'bg-pink-50', icon: 'text-pink-600' },
                  { bg: 'bg-blue-50', icon: 'text-blue-600' },
                  { bg: 'bg-purple-50', icon: 'text-purple-600' },
                  { bg: 'bg-green-50', icon: 'text-green-600' },
                ]
                const color = colors[index % colors.length]
                return (
                  <Card key={feature.title} className="text-center p-6 hover:shadow-lg transition-shadow border-gray-200">
                    <div className={`inline-flex h-14 w-14 items-center justify-center rounded-xl ${color.bg} mb-4`}>
                      <Icon className={`h-7 w-7 ${color.icon}`} />
                    </div>
                    <h4 className="font-semibold text-gray-900 mb-2">{feature.title}</h4>
                    <p className="text-sm text-gray-600">
                      {feature.description}
                    </p>
                  </Card>
                )
              })}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="container mx-auto px-4 py-20">
          <Card className="max-w-4xl mx-auto bg-gradient-to-br from-blue-600 to-purple-600 border-0 text-white shadow-2xl overflow-hidden">
            <div className="p-12 text-center space-y-6 relative">
              <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMtMy4zMTQgMC02IDIuNjg2LTYgNnMyLjY4NiA2IDYgNiA2LTIuNjg2IDYtNi0yLjY4Ni02LTYtNnptMCAxMGMtMi4yMDkgMC00LTEuNzkxLTQtNHMxLjc5MS00IDQtNCA0IDEuNzkxIDQgNC0xLjc5MSA0LTQgNHoiIGZpbGw9IiNmZmYiIG9wYWNpdHk9Ii4wNSIvPjwvZz48L3N2Zz4=')] opacity-20"></div>
              <div className="relative">
                <h3 className="text-3xl md:text-4xl font-bold">Ready to Get Started?</h3>
                <p className="text-lg text-blue-100 mt-4">
                  Join thousands of keepers managing their collections with Keeperly
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
                  <Link href="/auth">
                    <Button size="lg" className="w-full sm:w-auto bg-white text-blue-600 hover:bg-gray-100 shadow-lg">
                      <Check className="h-5 w-5 mr-2" />
                      Start Free Today
                    </Button>
                  </Link>
                  <Link href="/auth">
                    <Button size="lg" variant="outline" className="w-full sm:w-auto border-white/30 text-white hover:bg-white/10">
                      Learn More
                    </Button>
                  </Link>
                </div>
                <p className="text-sm text-blue-100 mt-6">
                  No credit card required • Free tier available forever
                </p>
              </div>
            </div>
          </Card>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-gray-50">
        <div className="container mx-auto px-4 py-8 text-center text-sm text-gray-600">
          © 2024 Keeperly. All rights reserved.
        </div>
      </footer>
    </div>
  )
}
