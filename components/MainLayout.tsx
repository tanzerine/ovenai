import React from 'react';
import BaseNavbar from './BaseNavbar';
import BaseFooter from './BaseFooter';
import styles from './MainLayout.module.css';
import { Analytics } from "@vercel/analytics/react"

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  return (
    <div className={`min-h-screen ${styles.layout}`}>
      <div className={styles.backgroundImage1}></div>
      <div className={styles.backgroundImage2}></div>
      <div className={styles.navbarContainer}>
        <BaseNavbar />
      </div>
      <div className="relative pt-[64px]"> {/* Adjust 64px to match your navbar height */}
        <div
          className={`absolute top-0 left-0 w-full h-[125vh] sm:h-[225vh] lg:h-[125vh] bg-[#F6F7F9] `}
        ></div>
        <main className={`text-neutral-800 ${styles.mainContent}`}>
          {children}
        </main>
        <BaseFooter />
      </div>
    </div>
  );
};

export default MainLayout;