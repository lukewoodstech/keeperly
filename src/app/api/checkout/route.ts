import { NextResponse } from 'next/server'
import Stripe from 'stripe'

// Use Node.js runtime for Stripe
export const runtime = 'nodejs'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-09-30.clover',
})

interface CheckoutRequest {
  userId: string
  email: string
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as CheckoutRequest

    if (!body.userId || !body.email) {
      return NextResponse.json(
        { error: 'Missing required fields: userId and email' },
        { status: 400 }
      )
    }

    const { userId, email } = body

    // Find or create Stripe customer
    let customer: Stripe.Customer | undefined

    // First, try to find existing customer by userId in metadata
    const existingCustomers = await stripe.customers.list({
      email,
      limit: 1,
    })

    if (existingCustomers.data.length > 0) {
      customer = existingCustomers.data[0]
    } else {
      // Create new customer with userId in metadata
      customer = await stripe.customers.create({
        email,
        metadata: {
          userId,
        },
      })
    }

    // Create Checkout Session for subscription
    const session = await stripe.checkout.sessions.create({
      customer: customer.id,
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [
        {
          price: 'price_1SLo4DB8JvWmPxiTTYK4Rt72', // TEST PRICE
          quantity: 1,
        },
      ],
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/account?success=true`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/account?canceled=true`,
      metadata: {
        userId,
      },
    })

    return NextResponse.json({ url: session.url })
  } catch (error) {
    console.error('Stripe checkout error:', error)

    if (error instanceof Stripe.errors.StripeError) {
      return NextResponse.json(
        { error: error.message },
        { status: error.statusCode || 500 }
      )
    }

    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    )
  }
}
