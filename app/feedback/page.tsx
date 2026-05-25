import type { Metadata } from 'next'
import FeedbackContent from '@/components/feedback/FeedbackContent'

export const metadata: Metadata = {
  title: 'Feedback — Write the team a letter',
  description:
    'Tell the Oven AI team what you love, what bugs you, and what to build next. We read every letter.',
  alternates: { canonical: 'https://www.oveners.com/feedback' },
  robots: { index: false, follow: false },
}

export default function FeedbackPage() {
  return <FeedbackContent />
}
