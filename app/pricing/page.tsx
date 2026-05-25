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

export default function PricingPage() {
  return <PricingContent />
}
