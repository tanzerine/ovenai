import React from 'react';

interface ListItemProps {
  name: string;
  url: string;
}

const NavLink: React.FC<ListItemProps> = ({ name, url }) => {
  return (
    <li className="w-full">
      <a
        href={url}
        className="md:px-4 py-2 text-sm bg-transparent rounded-lg text-[#666666] hover:text-gray-900 focus:outline-none focus:shadow-outline"
      >
        {name}
      </a>
    </li>
  );
};

export default NavLink;
