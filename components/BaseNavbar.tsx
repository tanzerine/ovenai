'use client'

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';
import { useUser, SignInButton, UserButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { usePointsStore } from '../app/store/usePointsStore'


const BaseNavbar: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const { isSignedIn, user } = useUser()
  const router = useRouter()
  const { points, fetchPoints } = usePointsStore()

useEffect(() => {
  if (user?.emailAddresses?.[0]?.emailAddress) {
    // Use email consistently across the application
    fetchPoints(user.emailAddresses[0].emailAddress)
      .catch(error => {
        console.error('Error fetching points:', error)
        // Don't set default points on error - let the store handle that
      })
  }
}, [user, fetchPoints])

  return (
    <div className="h-[94px] flex-col justify-start items-start inline-flex w-full relative">
 <div className="self-stretch px-4 sm:px-8 md:px-16 lg:px-32 xl:px-64 2xl:px-96 pt-6 justify-center items-center inline-flex">
 <div className="h-[70px] relative bg-[#2d2d2d] rounded-[100px] w-full max-w-[1200px] flex items-center px-4">
 <Link href="/" className="flex items-center">
          <Image 
  src="/logo.svg"
  alt="Logo"
  width={112} // 28 * 4 (assuming the original w-28 class represents 7rem, and 1rem = 16px)
  height={48} // 12 * 4 (assuming the original h-12 class represents 3rem, and 1rem = 16px)
  className="rounded-full"
/>          </Link>

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
                  {points !== null ? `${points} points` : 'Loading...'}
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
          points={points} 
          setIsMobileMenuOpen={setIsMobileMenuOpen} 
          handlePointsClick={handlePointsClick}
        />
      )}
    </div>
  );
};

const NavLink: React.FC<{ href: string; label: string }> = ({ href, label }) => (
  <Link href={href} className="text-[#cccccc] text-sm font-medium hover:text-white transition-colors">
    {label}
  </Link>
);

interface MobileMenuProps {
  isSignedIn: boolean;
  points: number | null;
  setIsMobileMenuOpen: React.Dispatch<React.SetStateAction<boolean>>;
  handlePointsClick: () => void;
}

const MobileMenu: React.FC<MobileMenuProps> = ({ isSignedIn, points, setIsMobileMenuOpen, handlePointsClick }) => (
  <div className="md:hidden absolute top-[94px] right-4 mt-2 p-4 bg-[#3d3d3d] rounded-lg w-64 shadow-lg">
    <nav className="flex flex-col space-y-2">
      <NavLink href="#" label="Features" />
      <NavLink href="#" label="Pricing" />
      <NavLink href="#" label="About" />
    </nav>
    <div className="mt-4">
      {isSignedIn ? (
        <div className="flex items-center justify-between">
          <Button
            onClick={() => {
              handlePointsClick();
              setIsMobileMenuOpen(false);
            }}
            className="bg-transparent hover:bg-[#4d4d4d] text-white text-sm"
          >
            {points !== null ? `${points} points` : 'Loading...'}
          </Button>
          <UserButton />
        </div>
      ) : (
        <SignInButton mode="modal">
          <button 
            className="w-full px-4 py-2 bg-[#3384ff] rounded-full text-white text-sm font-semibold hover:bg-[#2b6cd4] transition-colors"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Get Started
          </button>
        </SignInButton>
      )}
    </div>
  </div>
);

export default BaseNavbar;
