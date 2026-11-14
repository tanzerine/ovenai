import type { Metadata } from 'next'
import LibraryClient from './LibraryClient'

export const metadata: Metadata = {
  title: 'Free 3D Icon Library — Clay, Glass, Chrome & Plush Icons',
  description:
    'Browse free 3D icons in clay, glass, liquid chrome, plush, metal and voxel styles. Download PNGs for apps, decks and landing pages — or bake your own in seconds.',
  alternates: { canonical: 'https://www.oveners.com/library' },
  openGraph: {
    title: 'Free 3D Icon Library | Oven AI',
    description:
      'Clay, glass, chrome and plush 3D icons ready for your app, deck or landing page. Download free or generate your own.',
    url: 'https://www.oveners.com/library',
    type: 'website',
  },
}

export default function LibraryPage() {
  return <LibraryClient />
}
