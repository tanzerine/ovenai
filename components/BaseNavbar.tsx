'use client'

import React, { useState } from 'react';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';
import { useUser, SignInButton, UserButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { UserPoints } from './UserPoints'; // Update the import path as needed

const BaseNavbar: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const { isSignedIn, user } = useUser()
  const router = useRouter()
  const pointsData = UserPoints()

  const handlePointsClick = () => {
    router.push('/billing')
  }

  return (
    <div className="h-[94px] flex-col justify-start items-start inline-flex w-full relative">
      <div className="self-stretch px-4 sm:px-8 md:px-16 lg:px-32 xl:px-64 2xl:px-96 pt-6 justify-center items-center inline-flex">
        <div className="h-[70px] relative bg-[#2d2d2d] rounded-[100px] w-full max-w-[1200px] flex items-center px-4">
          <Link href="/" className="flex items-center">
            <Image 
              src="/logo.svg"
              alt="Logo"
              width={112}
              height={48}
              className="rounded-full"
            />
          </Link>

          <nav className="hidden lg:flex items-center ml-8 space-x-6">
            <NavLink href="/main" label="Generate" />
            <NavLink href="/billing" label="Pricing" />
            <NavLink href="/landing" label="About" />
          </nav>

          <div className="hidden lg:flex items-center ml-auto space-x-4">
            {isSignedIn ? (
              <div className="flex items-center space-x-2 bg-[#3d3d3d] rounded-full px-4 py-2">
                <Button
                  onClick={handlePointsClick}
                  className="bg-transparent hover:bg-[#4d4d4d] text-white text-sm"
                >
                  {pointsData?.points !== null ? `${pointsData.points} points` : 'Loading...'}
                </Button>
                <div className="w-px h-6 bg-gray-600" />
                <UserButton 
                  appearance={{
                    elements: {
                      avatarBox: "w-8 h-8",
                      userButtonPopoverCard: "bg-[#2d2d2d]"
                    }
                  }}
                />
              </div>
            ) : (
              <SignInButton mode="modal">
                <button className="px-4 py-2 bg-[#3384ff] rounded-full text-white text-sm font-semibold hover:bg-[#2b6cd4] transition-colors">
                  Get Started
                </button>
              </SignInButton>
            )}
          </div>

          <div className="lg:hidden ml-auto">
            <button
              type="button"
              className="text-gray-400 hover:text-white"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {isMobileMenuOpen && (
        <MobileMenu 
          isSignedIn={isSignedIn ?? false} 
          points={pointsData?.points ?? null} 
          setIsMobileMenuOpen={setIsMobileMenuOpen} 
          handlePointsClick={handlePointsClick}
        />
      )}
    </div>
  );
};

// Rest of your component (NavLink and MobileMenu) remains the same...

export default BaseNavbar;
