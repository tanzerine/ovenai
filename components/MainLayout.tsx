import React from 'react'
import BaseNavbar from './BaseNavbar'
import BaseFooter from './BaseFooter'

interface MainLayoutProps {
  children: React.ReactNode
}

export default function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col">
      <BaseNavbar />
      <main className="flex-1">{children}</main>
      <BaseFooter />
    </div>
  )
}
