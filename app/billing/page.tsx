'use client'

import React, { useState } from 'react'
import { useUser } from "@clerk/nextjs"
import { Button } from "@/components/ui/button"
import { loadStripe } from '@stripe/stripe-js'
import { Check } from 'lucide-react'

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

interface PricingPlanProps {
  points: number;
  price: number;
  features: string[];
}

const PricingPlan: React.FC<PricingPlanProps> = ({ points, price, features }) => {
  const [isLoading, setIsLoading] = useState(false)

  const handlePurchase = async () => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ points, amount: price }),
      })

      const { sessionId } = await response.json()
      const stripe = await stripePromise
      await stripe?.redirectToCheckout({ sessionId })
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="z-0 flex items-center rounded-b-3xl rounded-t-[20px] w-full max-w-sm mx-auto">
      <div className="relative flex h-full w-full flex-shrink-0 flex-col items-start overflow-clip rounded-b-3xl rounded-t-[20px] bg-transparent pb-[0.21px] [box-shadow:_0px_0px_0px_4px_rgba(255,255,255,1)]">
        <div className="bg-bg-component absolute inset-0 z-0 bg-cover bg-center bg-gradient-to-b from-blue-100 to-white" />
        <div className="relative z-[2] flex flex-col items-center w-full">
          <div className="absolute left-[30px] top-[30px] z-0 flex h-12 flex-shrink-0 flex-col items-center">
            <div className="z-[10] font-clash-grotesk text-2xl sm:text-[32px] leading-[48px] text-neutral-900 font-medium">
              +{points} points
            </div>
          </div>
          <div className="z-[2] flex flex-col items-center w-full">
            <div className="z-[2] h-[662px] w-full sm:w-96 flex-shrink-0 rounded-b-3xl rounded-t-[20px] border border-solid border-slate-200" />
            <div className="relative z-[3] flex h-0 flex-shrink-0 items-end justify-center leading-6 w-full">
              <div className="z-[3] flex h-[511px] items-end rounded-[20px] drop-shadow-s w-full justify-center pb-4">
                <div className="flex h-600 sm:w-90 flex-shrink-0 flex-col items-center overflow-clip rounded-[20px] bg-white">
                  <div className="h-[511px] w-full sm:w-[352px] flex-col rounded-[20px] border border-solid border-gray-200 p-4 sm:p-6">
                    <div className="flex justify-left items-center mb-4">
                      <div className="font-clash-grotesk text-lg sm:text-[22px] leading-[33px] text-neutral-800 mr-4">
                        Starting at
                      </div>
                      <div className="font-clash-grotesk text-2xl sm:text-3xl text-neutral-900 font-medium">
                        ${price}
                      </div>
                    </div>
                    <div className="text-sm sm:text-base text-[dimgray] mb-6">
                      <p>Don&apos;t worry, you&apos;ll only be charged for what you use.</p>
                    </div>
                    <Button
                      onClick={handlePurchase}
                      disabled={isLoading}
                      className="w-full mb-6 bg-blue-500 rounded-full"
                    >
                      {isLoading ? 'Processing...' : 'Buy Points'}
                    </Button>
                    <div className="text-lg sm:text-xl leading-[30px] text-neutral-800 mb-4">
                      What&apos;s Included
                    </div>
                    {features.map((feature, index) => (
                      <div key={index} className="flex items-center mb-2">
                        <Check className="h-5 w-5 flex-shrink-0 text-blue-500 mr-2" />
                        <div className="text-sm sm:text-base text-neutral-600">{feature}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function BillingPage() {
  const { } = useUser()

  const pricingPlans: PricingPlanProps[] = [
    {
      points: 1000,
      price: 5,
      features: [
        "Access to 20+ times of generation",
        "20+ times background removal",
        "Free download",
        "Image to image",
        "flux-dev model",
        "NVIDIA H100"
      ]
    },
    {
      points: 2600,
      price: 12,
      features: [
        "Access to 43+ times of generation",
        "43+ times background removal",
        "Free download",
        "Image to image",
        "flux-dev model",
        "NVIDIA H100"
      ]
    },
    {
      points: 12000,
      price: 50,
      features: [
        "Access to 240+ times of generation",
        "240+ times background removal",
        "Free download",
        "Image to image",
        "flux-dev model",
        "NVIDIA H100"
      ]
    }
  ]

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex h-[38px] flex-shrink-0 items-center rounded-[100px] drop-shadow-lg mb-8 justify-center">
        <div className="flex h-full w-full sm:w-auto flex-shrink-0 items-center justify-center overflow-clip rounded-[100px] bg-gray-100 [box-shadow:_0px_0px_0px_3px_rgba(255,255,255,1)] px-4">
          <div className="text-[17px] leading-[26px] text-neutral-700">
            Pricing
          </div>
        </div>
      </div>
      <div className="text-center mb-8">
        <h1 className="font-clash-grotesk text-4xl sm:text-5xl lg:text-[56px] leading-tight sm:leading-[73px] text-neutral-950 mb-4 font-medium">
          Our Pricing Plans
        </h1>
        <p className="text-base sm:text-lg leading-[27px] text-neutral-600 max-w-2xl mx-auto">
          Explore our flexible pricing plans designed to fit your budget and learning needs.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
        {pricingPlans.map((plan, index) => (
          <PricingPlan key={index} {...plan} />
        ))}
      </div>
    </div>
  )
}
