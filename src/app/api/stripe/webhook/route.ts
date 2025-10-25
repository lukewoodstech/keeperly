import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import { createClient } from '@supabase/supabase-js'

// Use Node.js runtime for Stripe
export const runtime = 'nodejs'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-09-30.clover',
})

// Service role client for admin operations
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
)

type SubscriptionStatus = 'active' | 'past_due' | 'canceled' | 'none'

function mapStripeStatus(stripeStatus: Stripe.Subscription.Status): SubscriptionStatus {
  switch (stripeStatus) {
    case 'active':
      return 'active'
    case 'past_due':
      return 'past_due'
    case 'canceled':
    case 'incomplete':
    case 'incomplete_expired':
    case 'unpaid':
      return 'canceled'
    default:
      return 'none'
  }
}

export async function POST(request: Request) {
  // Read raw body - DO NOT parse as JSON before validation
  const body = await request.text()
  const signature = request.headers.get('stripe-signature')

  if (!signature) {
    return NextResponse.json(
      { error: 'Missing stripe-signature header' },
      { status: 400 }
    )
  }

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (error) {
    console.error('Webhook signature verification failed:', error)
    if (error instanceof Error) {
      return NextResponse.json(
        { error: `Webhook Error: ${error.message}` },
        { status: 400 }
      )
    }
    return NextResponse.json({ error: 'Webhook verification failed' }, { status: 400 })
  }

  try {
    console.log(`📨 Processing event: ${event.type} [${event.id}]`)

    // Handle checkout.session.completed (MOST IMPORTANT for new subs)
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session
      console.log('✅ Checkout completed:', session.id)

      const userId = session.metadata?.userId

      if (!userId) {
        console.error('❌ No userId in checkout session metadata')
        return NextResponse.json({ received: true })
      }

      // If there's a subscription, fetch it and update DB
      if (session.subscription) {
        const subscription = await stripe.subscriptions.retrieve(
          session.subscription as string
        )
        await upsertSubscription(userId, subscription, event.id)
      }
    }

    // Handle customer.subscription.* events
    if (event.type.startsWith('customer.subscription.')) {
      const subscription = event.data.object as Stripe.Subscription
      console.log(`🔄 Subscription event: ${subscription.id} - ${subscription.status}`)

      // Try to get userId from subscription metadata first
      let userId = subscription.metadata?.userId

      // If not in subscription metadata, fetch customer and check there
      if (!userId) {
        try {
          const customer = await stripe.customers.retrieve(
            subscription.customer as string
          ) as Stripe.Customer

          userId = customer.metadata?.userId

          if (!userId) {
            // As last resort, try to find user by email
            if (!customer.deleted && customer.email) {
              const { data: user } = await supabaseAdmin
                .from('auth.users')
                .select('id')
                .eq('email', customer.email)
                .single()

              if (user) {
                userId = user.id
              }
            }
          }
        } catch (error) {
          console.error('Error fetching customer:', error)
        }
      }

      if (!userId) {
        console.error('❌ Could not determine userId for subscription')
        return NextResponse.json({ received: true })
      }

      await upsertSubscription(userId, subscription, event.id)
    }

    // Handle invoice.payment_succeeded
    if (event.type === 'invoice.payment_succeeded') {
      const invoice = event.data.object as Stripe.Invoice
      console.log('💳 Invoice paid:', invoice.id)

      // Refresh subscription data
      if (invoice.subscription) {
        const subscription = await stripe.subscriptions.retrieve(
          invoice.subscription as string
        )
        const userId = subscription.metadata?.userId
        if (userId) {
          await upsertSubscription(userId, subscription, event.id)
        }
      }
    }

    // Handle invoice.payment_failed
    if (event.type === 'invoice.payment_failed') {
      const invoice = event.data.object as Stripe.Invoice
      console.log('❌ Invoice payment failed:', invoice.id)

      // Update subscription to past_due
      if (invoice.subscription) {
        const subscription = await stripe.subscriptions.retrieve(
          invoice.subscription as string
        )
        const userId = subscription.metadata?.userId
        if (userId) {
          await upsertSubscription(userId, subscription, event.id)
        }
      }
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('❌ Webhook handler error:', error)
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// Helper function to upsert subscription (with cache invalidation)
async function upsertSubscription(
  userId: string,
  subscription: Stripe.Subscription,
  eventId: string
) {
  const status = mapStripeStatus(subscription.status)

  console.log(`💾 Upserting subscription for user ${userId}:`, {
    status,
    subscriptionId: subscription.id,
    eventId,
  })

  // Upsert subscription record
  const { error } = await supabaseAdmin.from('subscriptions').upsert(
    {
      user_id: userId,
      stripe_customer_id: subscription.customer as string,
      stripe_subscription_id: subscription.id,
      status,
      current_period_start: new Date(
        (subscription as any).current_period_start * 1000
      ).toISOString(),
      current_period_end: new Date(
        (subscription as any).current_period_end * 1000
      ).toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      onConflict: 'user_id',
    }
  )

  if (error) {
    console.error('❌ Error upserting subscription:', error)
    throw error
  }

  console.log(`✅ Subscription upserted successfully for user ${userId}`)

  // 🔥 CRITICAL: Revalidate Next.js cache
  const { revalidatePath } = await import('next/cache')
  revalidatePath('/app', 'layout')
  revalidatePath('/account', 'layout')

  console.log(`🔄 Cache revalidated for user ${userId}`)
}
