import type { Metadata } from 'next'
import BlogContent from '@/components/blog/BlogContent'

export const metadata: Metadata = {
  title: 'Blog — Notes from the oven',
  description:
    'Field reports, build logs, prompt cheatsheets, and opinions about the future of design tooling from the Oven AI team.',
  alternates: { canonical: 'https://www.oveners.com/blog' },
  openGraph: {
    title: 'Oven AI Blog — Notes from the oven',
    description: 'Engineering posts, tutorials, product updates and design thinking from the Oven AI team.',
    url: 'https://www.oveners.com/blog',
  },
}

export default function BlogPage() {
  return <BlogContent />
}
