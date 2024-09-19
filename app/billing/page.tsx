'use client'

import { useState } from 'react'
import { useUser } from "@clerk/nextjs"
import { Button } from "@/components/ui/button"
import { loadStripe } from '@stripe/stripe-js'

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

export default function BillingPage() {
  const { user } = useUser()
  const [isLoading, setIsLoading] = useState(false)

  const handlePurchase = async (points: number, amount: number) => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ points, amount }),
      })

      const { sessionId } = await response.json()
      const stripe = await stripePromise
      await stripe!.redirectToCheckout({ sessionId })
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto mt-20 p-6">
      <h1 className="text-3xl font-bold mb-6">Purchase Points</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="border p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">500 Points</h2>
          <p className="mb-4">Price: $5</p>
          <Button 
            onClick={() => handlePurchase(500, 5)} 
            disabled={isLoading}
            className="w-full"
          >
            Purchase
          </Button>
        </div>
        <div className="border p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">1000 Points</h2>
          <p className="mb-4">Price: $9</p>
          <Button 
            onClick={() => handlePurchase(1000, 9)} 
            disabled={isLoading}
            className="w-full"
          >
            Purchase
          </Button>
        </div>
        <div className="border p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">2000 Points</h2>
          <p className="mb-4">Price: $15</p>
          <Button 
            onClick={() => handlePurchase(2000, 15)} 
            disabled={isLoading}
            className="w-full"
          >
            Purchase
          </Button>
        </div>
      </div>
    </div>
  )
}