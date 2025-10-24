'use client'

import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import type { Animal } from '@/lib/types'

interface AnimalCardProps {
  animal: Animal
}

export function AnimalCard({ animal }: AnimalCardProps) {
  return (
    <Link href={`/app/animal/${animal.id}`}>
      <Card className="hover:shadow-lg transition-shadow cursor-pointer">
        <CardHeader>
          <div className="flex items-start justify-between">
            <CardTitle className="text-lg">{animal.name}</CardTitle>
            {animal.sex && (
              <Badge variant="secondary" className="text-xs">
                {animal.sex}
              </Badge>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm">
            <div>
              <span className="text-muted-foreground">Species:</span>{' '}
              <span className="font-medium">{animal.species}</span>
            </div>
            {animal.breed && (
              <div>
                <span className="text-muted-foreground">Breed:</span>{' '}
                <span className="font-medium">{animal.breed}</span>
              </div>
            )}
            {animal.morph && (
              <div>
                <span className="text-muted-foreground">Morph:</span>{' '}
                <span className="font-medium">{animal.morph}</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
