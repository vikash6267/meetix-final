import React from 'react';
import { FaBars } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const Header = ({ toggleSidebar, name}) => {
  return (
    <div className="bg-gradient-to-l from-black to-[#2F4F29] text-white p-4 flex justify-between items-center">
      <div className="md:hidden">
        <button className="text-white focus:outline-none" onClick={toggleSidebar}>
          <FaBars size={24} />
        </button>
      </div>
      
      <h1 className="text-lg md:text-xl lg:text-2xl font-bold">{name}</h1>
    </div>
  );
};

export default Header;