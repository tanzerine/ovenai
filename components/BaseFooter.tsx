import React from 'react';
import Image from 'next/image';


const Footer: React.FC = () => {
  return (
    <div className="Footer w-full bg-white">
      <div className="max-w-[1200px] mx-auto px-4 mt-20">
        <div className="flex flex-col items-center py-10">
          <div className="flex items-center mb-6">
            <div className="flex items-center w-[130px] h-[84px]">
            <Image 
  src="/logo_bl.svg"
  alt="Logo"
  width={136} // 34 * 4 (assuming 1 unit in Tailwind = 0.25rem, and 1rem = 16px)
  height={72} // 18 * 4 (assuming 1 unit in Tailwind = 0.25rem, and 1rem = 16px)
  className="rounded-full mr-2"
/>            </div>
            <div className="w-px h-[25px] mx-4 bg-[#e1e4eb]" />
            <div className="text-[#666666] text-lg font-medium font-['Instrument Sans']">
              The future of Generative Design @2024 Oven
            </div>
          </div>
          
          <div className="w-full border-t border-[#e1e4eb] my-6" />
          
          <div className="text-center text-[#606060] text-lg font-medium font-['Instrument Sans'] max-w-[880px]">
            <p className="mb-4">
              The information provided on this website is for general purposes only. Oven does not guarantee the 
              accuracy or reliability of any content. Commercial availability and features may change 
              without notice. User experiences may vary. Always consult a professional for advice specific to your needs.

            </p>
            <p>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Footer;