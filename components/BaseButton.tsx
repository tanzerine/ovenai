import React, { ButtonHTMLAttributes } from 'react';

const BaseButton: React.FC<ButtonHTMLAttributes<HTMLButtonElement>> = ({ children, ...props }) => {
  return (
    <button
      className="text-sm text-center rounded-full hover:shadow-md hover:shadow-[#0c66ee]/50 transition duration-300"
      {...props}
    >
      {children}
    </button>
  );
};

export default BaseButton;