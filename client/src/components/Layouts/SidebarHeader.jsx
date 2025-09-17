import React from 'react';
import { FaBars } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { Settings } from 'lucide-react';   // ✅ added

const Header = ({ toggleSidebar, name }) => {
  return (
    <div className="bg-[#191c1e] text-white p-4 flex justify-between items-center">
      
      {/* Left: Sidebar toggle (mobile) */}
      <div className="md:hidden">
        <button
          className="text-white focus:outline-none"
          onClick={toggleSidebar}
        >
          <FaBars size={24} />
        </button>
      </div>

      {/* Center: Page name */}
      <h1 className="text-lg md:text-xl lg:text-2xl font-bold">{name}</h1>

      {/* Right: Settings button */}
      <Link
        to="/setting"
        className="flex items-center gap-2 px-3 py-2 bg-white shadow-lg border border-gray-200 rounded-full text-gray-800 hover:bg-gray-200 transition-all duration-300"
      >
        <Settings className="w-5 h-5" />
        <span className="hidden sm:inline font-medium">Setting</span>
      </Link>
    </div>
  );
};

export default Header;
