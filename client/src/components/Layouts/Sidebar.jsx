import React, { useState, useEffect } from 'react';
import {
  HomeIcon,
  ChatBubbleLeftEllipsisIcon,
  UserCircleIcon,
  Cog6ToothIcon,
  Bars3Icon,
  XMarkIcon,
} from '@heroicons/react/24/outline';

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = (event) => {
    event.stopPropagation(); // Prevent event bubbling to document
    setIsOpen(!isOpen);
  };

  const closeSidebar = () => {
    setIsOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.sidebar-container') && !event.target.closest('.hamburger-icon')) {
        closeSidebar();
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  return (
    <div className="relative">
      {/* Hamburger Icon for Mobile */}
      <button
        className="text-gray-400 hover:text-white p-2 md:hidden hamburger-icon"
        onClick={toggleSidebar}
      >
        {isOpen ? <XMarkIcon className="w-8 h-8" /> : <Bars3Icon className="w-8 h-8" />}
      </button>

      {/* Sidebar */}
      <div
        className={`bg-gray-800 h-full w-32 bg-gradient-to-t from-[#481046] to-[#000000] flex flex-col items-center py-4 space-y-6 fixed top-0 left-0 transform transition-transform duration-300 md:translate-x-0 sidebar-container ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } md:relative`}
        onClick={(event) => event.stopPropagation()}
      >
        {/* Close Icon for Mobile */}
        {isOpen && (
          <button
            className="absolute top-4 left-4 text-gray-400 hover:text-white md:hidden"
            onClick={closeSidebar}
          >
            <XMarkIcon className="w-6 h-6" />
          </button>
        )}

        {/* Home Icon */}
        <button className="text-gray-400 hover:text-white">
          <HomeIcon className="w-8 h-8" />
        </button>

        {/* Chat Icon */}
        <button className="text-gray-400 hover:text-white">
          <ChatBubbleLeftEllipsisIcon className="w-8 h-8" />
        </button>

        {/* User Icon */}
        <button className="text-gray-400 hover:text-white">
          <UserCircleIcon className="w-8 h-8" />
        </button>

        {/* Settings Icon */}
        <button className="text-gray-400 hover:text-white">
          <Cog6ToothIcon className="w-8 h-8" />
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
