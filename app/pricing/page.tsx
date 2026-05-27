import type { Metadata } from 'next'
import PricingContent from '@/components/pricing/PricingContent'

export const metadata: Metadata = {
  title: 'Pricing — Pay as you bake',
  description:
    'Start free with 15 icons a month. Upgrade to Starter, Studio or Enterprise when you need more. Cancel any time — no questions, no contracts.',
  alternates: { canonical: 'https://www.oveners.com/pricing' },
  openGraph: {
    title: 'Oven AI Pricing — Pay as you bake',
    description: 'Flexible 3D icon plans from $0. Studio renders, background removal, style memory.',
    url: 'https://www.oveners.com/pricing',
  },
}

const pricingJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Product',
  name: 'Oven AI — 3D Icon Generator',
  description:
    'AI-powered 3D icon generator. Credit-based packs starting from free.',
  brand: { '@type': 'Brand', name: 'Oven AI' },
  offers: {
    '@type': 'AggregateOffer',
    priceCurrency: 'USD',
    lowPrice: '0',
    highPrice: '50',
    offerCount: '4',
    offers: [
      {
        '@type': 'Offer',
        name: 'Free',
        price: '0',
        priceCurrency: 'USD',
        description: '15 icons per month. Personal use.',
      },
      {
        '@type': 'Offer',
        name: 'Starter pack',
        price: '5',
        priceCurrency: 'USD',
        description: '1,000 credits.',
      },
      {
        '@type': 'Offer',
        name: 'Studio pack',
        price: '12',
        priceCurrency: 'USD',
        description: '2,600 credits.',
      },
      {
        '@type': 'Offer',
        name: 'Pro pack',
        price: '50',
        priceCurrency: 'USD',
        description: '12,000 credits.',
      },
    ],
  },
}

export default function PricingPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(pricingJsonLd) }}
      />
      <PricingContent />
    </>
  )
}
