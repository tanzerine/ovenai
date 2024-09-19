'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function SuccessPage() {
  const router = useRouter()

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push('/')
    }, 5000)

    return () => clearTimeout(timer)
  }, [router])

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-4xl font-bold mb-4">Payment Successful!</h1>
      <p className="text-xl">Thank you for your purchase. Your points will be added to your account shortly.</p>
      <p className="mt-4">Redirecting to home page in 5 seconds...</p>
    </div>
  )
}