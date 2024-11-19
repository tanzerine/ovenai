'use client'
import { useUser } from "@clerk/nextjs"
import { useState, useEffect } from 'react'
export function UserPoints() {
  const { user } = useUser()
  const [points, setPoints] = useState<number | null>(null)
  useEffect(() => {
    if (user) {
      const userPoints = (user.publicMetadata as { points?: number }).points
      setPoints(userPoints !== undefined ? userPoints : 500)
    }
  }, [user])
  if (points === null) {
    return null // or a loading spinner
  }
  return (
    <span className="text-sm font-semibold leading-6 text-gray-900">
      {points} points
    </span>
  )
