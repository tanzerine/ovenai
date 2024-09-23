'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { useUser, SignInButton, UserButton } from "@clerk/nextjs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Menu } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { supabase } from '../lib/supabase'
import useCase1 from './use-case-1.jpg'
import useCase2 from './use-case-2.jpg'
import useCase3 from './use-case-3.jpg'
import useCase4 from './use-case-4.jpg'
import useCase5 from './use-case-5.jpg'
import useCase6 from './use-case-6.jpg'
import useCase7 from './use-case-7.jpg'

/this is not important/

export default function Home() {
  const { isSignedIn, user } = useUser()
  const router = useRouter()
  const [prompt, setPrompt] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [isRemovingBackground, setIsRemovingBackground] = useState(false)
  const [, setIsMobileMenuOpen] = useState(false)
  const [error, setError] = useState('')
  const [originalImageUrl, setOriginalImageUrl] = useState<string | null>(null)
  const [removedBgImageUrl, setRemovedBgImageUrl] = useState<string | null>(null)
  const [showOriginal, setShowOriginal] = useState(true)
  const [points, setPoints] = useState<number | null>(null)

  const updateUserPoints = async (newPoints: number) => {
    if (user) {
      try {
        const { error } = await supabase
          .from('user_points')
          .upsert({ user_id: user.id, points: newPoints })
          .select()
  
        if (error) throw error;
  
        setPoints(newPoints)
      } catch (error) {
        console.error("Error updating user points:", error)
        setError("Failed to update points. Please try again.")
      }
    }
  }

  useEffect(() => {
    const fetchPoints = async () => {
      if (user) {
        const { data, error } = await supabase
          .from('user_points')
          .select('points')
          .eq('user_id', user.id)
          .single()
  
        if (error) {
          console.error("Error fetching user points:", error)
          setPoints(200) // Default to 200 if there's an error
        } else {
          setPoints(data?.points ?? 200)
        }
      }
    }
    fetchPoints()
  }, [user])

  const generateIcon = async () => {
    if (!isSignedIn) {
      setError('Please sign in to generate icons')
      return
    }

    if (points === null || points < 50) {
      setError('Not enough points. Please purchase more points.')
      return
    }

    setIsGenerating(true)
    setError('')
    setOriginalImageUrl(null)
    setRemovedBgImageUrl(null)
    setShowOriginal(true)

    try {
      const newPoints = points - 50
      setPoints(newPoints) // Update points locally first

      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt }),
      })

      const data = await response.json()

      if (response.ok && data.success) {
        setOriginalImageUrl(data.image_url)
        await updateUserPoints(newPoints) // Update points in Clerk
      } else {
        throw new Error(data.error || 'Failed to generate icon')
      }
    } catch (err) {
      console.error('Error:', err)
      setError(`An error occurred: ${err instanceof Error ? err.message : String(err)}`)
      setPoints(points) // Revert points if there's an error
    } finally {
      setIsGenerating(false)
    }
  }

  const toggleImage = () => {
    setShowOriginal(!showOriginal)
  }

  const removeBackground = async () => {
    if (!originalImageUrl) {
      setError('No image to remove background from')
      return
    }

    if (points === null || points < 100) {
      setError('Not enough points. Please purchase more points.')
      return
    }

    setIsRemovingBackground(true)
    setError('')

    try {
      const newPoints = points - 100
      setPoints(newPoints) // Update points locally first

      const response = await fetch('/api/remove-background', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ imageUrl: originalImageUrl }),
      })

      const data = await response.json()

      if (response.ok && data.success) {
        setRemovedBgImageUrl(data.removed_bg_image_url)
        setShowOriginal(false)
        await updateUserPoints(newPoints) // Update points in Clerk
      } else {
        throw new Error(data.error || 'Failed to remove background')
      }
    } catch (err) {
      console.error('Error:', err)
      setError(`An error occurred: ${err instanceof Error ? err.message : String(err)}`)
      setPoints(points) // Revert points if there's an error
    } finally {
      setIsRemovingBackground(false)
    }
  }

  const downloadImage = async () => {
    if (!originalImageUrl && !removedBgImageUrl) {
      setError('No image available to download')
      return
    }
  
    try {
      const imageUrl = showOriginal ? originalImageUrl : removedBgImageUrl
      if (!imageUrl) {
        setError('Image URL is not available')
        return
      }
      const response = await fetch(imageUrl)
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.style.display = 'none'
      a.href = url
      a.download = showOriginal ? 'original-icon.png' : 'background-removed-icon.png'
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
    } catch (err) {
      console.error('Error downloading image:', err)
      setError('Failed to download image')
    }
  }

  const useCases = [
    { id: 1, title: "3D Icon Design", image: useCase1 },
    { id: 2, title: "Logo Creation", image: useCase2 },
    { id: 3, title: "Product Visualization", image: useCase3 },
    { id: 4, title: "UI/UX Elements", image: useCase4 },
    { id: 5, title: "Social Media Graphics", image: useCase5 },
    { id: 6, title: "App Icons", image: useCase6 },
    { id: 7, title: "Branding Assets", image: useCase7 },
  ];

  return (
    <div className="bg-white">
      <header className="absolute inset-x-0 top-0 z-50">
        <nav className="flex items-center justify-between p-6 lg:px-8" aria-label="Global">
          <div className="flex lg:flex-1">
            <a href="#" className="-m-1.5 p-1.5">
              <span className="sr-only">3D Icon AI</span>
              <div className="h-8 w-auto bg-indigo-600 rounded-full"></div>
            </a>
          </div>
          <div className="flex lg:hidden">
          <button
              type="button"
              className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
              onClick={() => setIsMobileMenuOpen(true)}
            >
              <span className="sr-only">Open main menu</span>
              <Menu className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>
          <div className="hidden lg:flex lg:gap-x-12">
            <a href="#" className="text-sm font-semibold leading-6 text-gray-900">Features</a>
            <a href="#" className="text-sm font-semibold leading-6 text-gray-900">Pricing</a>
            <a href="#" className="text-sm font-semibold leading-6 text-gray-900">About</a>
          </div>
          <div className="hidden lg:flex lg:flex-1 lg:justify-end items-center space-x-4">
            {isSignedIn && (
              <>
                <span className="text-sm font-semibold leading-6 text-gray-900">
                  {points !== null ? `${points} points` : 'Loading...'}
                </span>
                <Button
                  onClick={() => router.push('/billing')}
                  className="text-sm font-semibold leading-6 bg-indigo-600 text-white px-3 py-2 rounded-md"
                >
                  Buy Points
                </Button>
              </>
            )}
            {isSignedIn ? (
              <UserButton afterSignOutUrl="/" />
            ) : (
              <SignInButton mode="modal">
                <button className="text-sm font-semibold leading-6 text-gray-900">
                  Log in <span aria-hidden="true">&rarr;</span>
                </button>
              </SignInButton>
            )}
          </div>
        </nav>
      </header>

      <div className="relative isolate px-6 pt-14 lg:px-8">
        <div className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80" aria-hidden="true">
          <div
            className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
            style={{
              clipPath:
                'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
            }}
          ></div>
        </div>
        
        <div className="mx-auto max-w-2xl py-32 sm:py-48 lg:py-15">
        <div className="mx-auto max-w-2xl py-32 sm:py-25 lg:py-5">
          <div className="hidden sm:mb-8 sm:flex sm:justify-center">
            <div className="relative rounded-full px-3 py-1 text-sm leading-6 text-gray-600 ring-1 ring-gray-900/10 hover:ring-gray-900/20">
              Announcing our next round of AI improvements.{' '}
              <a href="#" className="font-semibold text-indigo-600">
                <span className="absolute inset-0" aria-hidden="true"></span>Read more <span aria-hidden="true">&rarr;</span>
              </a>
            </div>
          </div>
          </div>
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
            Enrich your designs with OVEN AI
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              Create unique 3D icons for your projects with our AI-powered generator. Simply describe your icon, and watch as our AI brings it to life in stunning 3D.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <Input
                placeholder="Must start with '3d icon of...'"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                className="max-w-xs"
              />
              <Button
                onClick={generateIcon}
                disabled={isGenerating || points === null || points < 50}
                className="bg-indigo-600 hover:bg-indigo-500"
              >
             {isGenerating ? 'Generating...' : 'Generate (50 points)'}
              </Button>
            </div>
            {error && <p className="mt-2 text-red-500">{error}</p>}
          </div>
        </div>

        <div className="mx-auto mt-16 max-w-2xl sm:mt-24 pb-10">
        <div className="w-full flex justify-right mb-2">
          <Button
            onClick={toggleImage}
            disabled={!removedBgImageUrl}
            className="border-2 text-grey-500 bg-gray-100 border-indigo-700"


          >
            {showOriginal ? 'Show Removed Background' : 'Show Original'}
          </Button>
        </div>
        <div className="w-full aspect-square bg-gray-100 rounded-lg overflow-hidden relative">
          {(showOriginal ? originalImageUrl : removedBgImageUrl) ? (
            <Image 
              src={showOriginal ? originalImageUrl! : removedBgImageUrl!} 
              alt="Generated Icon" 
              fill
              style={{ objectFit: 'contain' }}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          ) : (
            <div className="flex items-center justify-center h-full text-gray-400">
              Generated image will appear here
            </div> 
          )}
        </div>
        <div className="mt-4 flex flex-col gap-2">
          <Button
            onClick={removeBackground}
            disabled={!originalImageUrl || isRemovingBackground || points === null || points < 100}
            className="w-full bg-indigo-600 hover:bg-indigo-700"
          >
            {isRemovingBackground ? 'Removing Background...' : 'Remove Background (100 points)'}
            </Button>
            <Button
  onClick={downloadImage}
  disabled={!originalImageUrl && !removedBgImageUrl}
  className="bg-indigo-600 hover:bg-indigo-700"
>
  Download
</Button>
        </div>
      </div>


      <div className="mt-40 mb-16">
        <h2 className="text-3xl font-bold text-center mb-40">Use Cases</h2>
        <div className="overflow-hidden w-full">
          <div className="flex animate-scroll">
            {[...useCases, ...useCases].map((useCase, index) => (
              <div key={`${useCase.id}-${index}`} className="flex-none w-[calc(100vw/5)] px-2">
                <div className="bg-white rounded-lg shadow-md overflow-hidden group h-full">
                  <div className="relative aspect-[2/3] h-full">
                    <Image 
                      src={useCase.image}
                      alt={useCase.title}
                      layout="fill"
                      objectFit="cover"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 20vw"

                    />
                    <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      <div className="text-white text-center p-4">
                        <h3 className="text-lg font-semibold mb-2">{useCase.title}</h3>
                        <p className="text-sm">Create stunning {useCase.title.toLowerCase()} with our AI-powered tool.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

        
        <div className="absolute inset-x-0 top-[calc(100%-13rem)] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-30rem)]" aria-hidden="true">
          <div
            className="relative left-[calc(50%+3rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%+36rem)] sm:w-[72.1875rem]"
            style={{
              clipPath:
                'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
            }}
          ></div>
        </div>
      </div>
    </div>
  )
}
