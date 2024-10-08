import React, { useState } from 'react';
import { ChevronUp, ChevronDown } from 'lucide-react';

interface AccordionProps {
  accordion: {
    title: string;
    description: string;
  };
}

const Accordion: React.FC<AccordionProps> = ({ accordion }) => {
  const [selected, setSelected] = useState(false);

  return (
    <li className="relative border-b-2 border-gray-200">
      <button 
        type="button" 
        className="w-full py-4 text-left" 
        onClick={() => setSelected(!selected)}
      >
        <div className="flex items-center justify-between">
          <span className="font-medium">{accordion.title}</span>
          {selected ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </div>
      </button>
      {selected && (
        <div 
          className="relative overflow-hidden transition-all duration-700"
          style={{ maxHeight: selected ? '1000px' : '0' }}
        >
          <div className="py-2">
            <p className="text-sm text-gray-700 tracking-wide leading-relaxed">
              {accordion.description}
            </p>
          </div>
        </div>
      )}
    </li>
  );
};

export default Accordion;