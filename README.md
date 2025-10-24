# Keeperly

A modern animal management platform for reptile and exotic pet breeders. Track your animals, log events, manage breeding records, and access advanced analytics.

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS + shadcn/ui
- **Database & Auth**: Supabase
- **Payments**: Stripe
- **Validation**: Zod

## Features

- Magic link authentication
- Animal management with rich details
- Event logging (feeding, weight, medical, breeding, etc.)
- Free tier with 5-animal limit
- Pro subscription ($9.99/month) with unlimited animals
- Mobile-first responsive design with dark mode

## Getting Started

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up Environment Variables

Copy the example environment file:

```bash
cp .env.local.example .env.local
```

Then populate the values (see setup instructions below).

### 3. Configure Supabase

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to Project Settings > API
3. Copy your project URL and anon key to `.env.local`:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. Copy your service role key (for webhooks):
   - `SUPABASE_SERVICE_ROLE_KEY`
5. Run the database schema:
   - Go to SQL Editor in Supabase dashboard
   - Execute the SQL from `supabase/schema.sql` (if you have it) or refer to your migration files
6. Configure Authentication:
   - Go to Authentication > Providers
   - Enable Email provider
   - Configure email templates as needed
7. Set redirect URLs:
   - Go to Authentication > URL Configuration
   - Add `http://localhost:3000/auth/callback` for development
   - Add your production URL when deploying

### 4. Configure Stripe

#### Create Product and Price

1. Sign up at [stripe.com](https://stripe.com)
2. Go to Products > Add Product
3. Create "Breeding Pro" subscription:
   - Name: "Breeding Pro"
   - Price: $9.99 USD
   - Billing: Recurring monthly
4. Copy the Price ID (starts with `price_`)
5. Update `/src/app/api/checkout/route.ts` line 57:
   ```typescript
   price: 'price_YOUR_ACTUAL_PRICE_ID', // Replace price_XXXX
   ```

#### Get API Keys

1. Go to Developers > API Keys
2. Copy your Secret Key to `.env.local`:
   - `STRIPE_SECRET_KEY=sk_test_...`

#### Set Up Webhook (Development)

For local testing, use Stripe CLI:

```bash
# Install Stripe CLI
brew install stripe/stripe-cli/stripe

# Login to your Stripe account
stripe login

# Forward webhooks to your local server
stripe listen --forward-to localhost:3000/api/stripe/webhook
```

Copy the webhook signing secret (starts with `whsec_`) to `.env.local`:
- `STRIPE_WEBHOOK_SECRET=whsec_...`

#### Set Up Webhook (Production)

1. Go to Developers > Webhooks
2. Add endpoint: `https://yourdomain.com/api/stripe/webhook`
3. Select events to listen for:
   - `checkout.session.completed`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
4. Copy the webhook signing secret to your production environment variables

### 5. Set App URL

Update `NEXT_PUBLIC_APP_URL` in `.env.local`:
- Development: `http://localhost:3000`
- Production: `https://yourdomain.com`

### 6. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## Project Structure

```
src/
├── app/
│   ├── (marketing)/        # Public pages (landing)
│   ├── (protected)/        # Authenticated pages (app, account, animals)
│   ├── api/
│   │   ├── checkout/       # Stripe checkout session creation
│   │   └── stripe/
│   │       └── webhook/    # Stripe webhook handler
│   ├── auth/               # Authentication pages and callback
│   └── layout.tsx
├── components/
│   ├── ui/                 # shadcn/ui components
│   └── [feature components]
└── lib/
    ├── supabaseBrowser.ts  # Client-side Supabase client
    ├── supabaseServer.ts   # Server-side Supabase client
    ├── types.ts            # TypeScript types
    ├── validators.ts       # Zod schemas
    ├── format.ts           # Date formatting utilities
    └── utils.ts            # General utilities
```

## Database Schema

The application uses four main tables:

- `profiles`: User profile data
- `subscriptions`: Stripe subscription status
- `animals`: Animal records with details
- `events`: Event logs (feeding, weight, medical, etc.)

All tables implement Row Level Security (RLS) to ensure users can only access their own data.

## Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Import your repository in [Vercel](https://vercel.com)
3. Add environment variables:
   - All variables from `.env.local`
   - Update `NEXT_PUBLIC_APP_URL` to your production domain
4. Deploy

### Post-Deployment

1. Update Supabase redirect URLs with your production domain
2. Update Stripe webhook endpoint with your production URL
3. Test the complete checkout flow in Stripe test mode
4. Switch to Stripe live mode when ready

## Subscription Flow

1. User clicks "Upgrade to Pro"
2. App creates Stripe checkout session via `/api/checkout`
3. User completes payment on Stripe
4. Stripe sends webhook to `/api/stripe/webhook`
5. Webhook handler updates `subscriptions` table
6. User gains access to Pro features

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint errors automatically

## Support

For issues or questions, please open an issue in the repository.
