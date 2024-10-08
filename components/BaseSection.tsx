import React, { HTMLAttributes } from 'react';

const BaseSection: React.FC<HTMLAttributes<HTMLDivElement>> = ({ children, ...props }) => {
  return (
    <div className="relative max-w-screen-xl px-4 sm:px-8 mx-auto grid grid-cols-12 gap-x-6 overflow-hidden" {...props}>
      {children}
    </div>
  );
};

export default BaseSection;