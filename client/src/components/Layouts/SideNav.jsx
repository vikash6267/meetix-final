import { Settings } from 'lucide-react';
import React, { useState } from 'react';
import {
  FaHome,
  FaSignInAlt,
  FaChartLine,
  FaCalendarAlt,
  FaVideo,
  FaCog,
  FaPlusCircle,
  FaFileDownload,
  FaTimes,
  FaChevronRight,
  FaUserCheck,
  FaCode,
  FaKey,
  FaBook,
} from 'react-icons/fa';
import { Link, useLocation, useNavigate } from 'react-router-dom';

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const location = useLocation();
  const [isMeetingsExpanded, setIsMeetingsExpanded] = useState(
    location.pathname === '/meetings' ||
      location.pathname.startsWith('/meetings2/'),
  );

  const [isAnalysisExpanded, setIsAnalysisExpanded] = useState(
    location.pathname === '/dashboard' ||
      location.pathname.startsWith('/dashboard/'),
  );

  const [isDevelopersExpanded, setIsDevelopersExpanded] = useState(
    location.pathname === '/developers' ||
      location.pathname.startsWith('/developers/'),
  );

  const [isAdminExpanded, setIsAdminExpanded] = useState(
    location.pathname.startsWith('/admin'),
  );
  const [isSubsExpanded, setIsSubsExpanded] = useState(
    location.pathname.startsWith('/admin'),
  );
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear all localStorage items
    localStorage.clear();

    // Redirect to login page
    navigate('/login');
  };
  const storedUser = localStorage.getItem('user');
  const user = storedUser ? JSON.parse(storedUser) : null;
  return (
    <div
      className={`fixed top-0 left-0 bg-[#191c1e] text-white w-72 h-screen p-6 overflow-y-auto z-50 transform transition-all duration-300 ease-in-out shadow-2xl ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:relative md:translate-x-0 md:w-64 hide-scrollbar`}
    >
      {/* Close Button (Mobile) */}
      <div className="md:hidden absolute top-4 right-4">
        <button
          className="text-white hover:text-[#4b155d] transition-colors focus:outline-none"
          onClick={toggleSidebar}
        >
          <FaTimes size={24} />
        </button>
      </div>

      {/* Brand/Header */}
      <div className="mb-10 pt-2">
        <Link to="/">
          <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-300 to-teal-300">
            Meetix
          </h2>
        </Link>
        <div className="w-16 h-1 bg-teal-400 rounded-full mt-2"></div>
      </div>

      {/* Navigation Links */}
      <ul className="space-y-2">
        {/* Landing Page */}
        <li>
          <Link
            to="/"
            className={`flex items-center justify-between p-3 rounded-lg transition-all duration-200 ${
              location.pathname === '/'
                ? 'bg-[#4b155d]       600 shadow-lg'
                : 'hover:bg-[#4b155d]       700 hover:shadow-md hover:pl-4'
            }`}
          >
            <div className="flex items-center">
              <FaHome className="mr-3 text-teal-300" />
              <span>Home</span>
            </div>
            {location.pathname === '/' && (
              <FaChevronRight className="text-sm opacity-70" />
            )}
          </Link>
        </li>

        {/* Dashboard Pages (shown after login) */}
        <li className="pt-4 mt-4 border-t border-[#4b155d]">
          <span className="text-xs font-semibold text-white uppercase tracking-wider pl-3">
            Dashboard
          </span>
        </li>

        <li>
          <div
            onClick={() => setIsAnalysisExpanded(!isAnalysisExpanded)}
            className={`flex items-center justify-between p-3 rounded-lg transition-all duration-200 cursor-pointer ${
              location.pathname.startsWith('/meetings/')
                ? 'bg-[#6f2687]  shadow-lg'
                : 'hover:bg-[#4b155d]  hover:shadow-md hover:pl-4'
            }`}
          >
            <div className="flex items-center">
              <FaChartLine className="mr-3 text-teal-300" />
              <span>View Records</span>
            </div>
            <FaChevronRight
              className={`text-sm opacity-70 transition-transform ${isAnalysisExpanded ? 'transform rotate-90' : ''}`}
            />
          </div>
        </li>

        {/* Analysis Submenu */}
        {isAnalysisExpanded && (
          <ul className="pl-6 mt-1 space-y-1">
            <li>
              <Link
                to="/meetings/details"
                className={`text-white flex items-center p-2 text-sm rounded-lg transition-colors ${
                  location.pathname === '/meetings/details'
                    ? 'bg-teal-800 text-white font-medium'
                    : 'text-white hover:bg-[#4b155d] '
                }`}
              >
                <FaUserCheck className="mr-2 text-xs" />
                <span>View Meetings</span>
              </Link>
            </li>
           
          </ul>
        )}

        <li>
          <div
            onClick={() => setIsMeetingsExpanded(!isMeetingsExpanded)}
            className={`flex items-center justify-between p-3 rounded-lg transition-all duration-200 cursor-pointer ${
              location.pathname === '/meetings2' ||
              location.pathname.startsWith('/meetings2/')
                ? 'bg-[#4b155d]       600 shadow-lg'
                : 'hover:bg-[#4b155d]       700 hover:shadow-md hover:pl-4'
            }`}
          >
            <div className="flex items-center">
              <FaCalendarAlt className="mr-3 text-teal-300" />
              <span>My Meetings</span>
            </div>
            <FaChevronRight
              className={`text-sm opacity-70 transition-transform ${isMeetingsExpanded ? 'transform rotate-90' : ''}`}
            />
          </div>
        </li>

        {/* Meeting Submenu */}
        {isMeetingsExpanded && (
          <ul className="pl-6 mt-1 space-y-1">
            <li>
              <Link
                to={`https://meetix.mahitechnocrafts.in?id=${user?._id}`}
                target="_blank"
                className={`text-white flex items-center p-2 text-sm rounded-lg transition-colors ${
                  location.pathname === '/meetings/new'
                    ? 'bg-teal-800 text-white font-medium'
                    : 'text-white hover:bg-[#4b155d]'
                }`}
              >
                <FaPlusCircle className="mr-2 text-xs" />
                <span>New Meeting</span>
              </Link>
            </li>
            <li>
              <Link
                to="/meetings2/upcoming"
                className={`text-white flex items-center p-2 text-sm rounded-lg transition-colors ${
                  location.pathname === '/meetings2/upcoming'
                    ? 'bg-teal-800 text-white font-medium'
                    : 'text-white hover:bg-[#4b155d]'
                }`}
              >
                <FaCalendarAlt className="mr-2 text-xs" />
                <span>Upcoming</span>
              </Link>
            </li>
            {/* <li>
              <Link
                to="/meetings/completed"
                className={`text-white flex items-center p-2 text-sm rounded-lg transition-colors ${location.pathname === '/meetings/completed'
                    ? 'bg-teal-800 text-white font-medium'
                    : 'text-white hover:bg-[#4b155d]'
                  }`}
              >
                <FaVideo className="mr-2 text-xs" />
                <span>Completed</span>
              </Link>
            </li>
            <li>
              <Link
                to="/meetings/recordings"
                className={`text-white flex items-center p-2 text-sm rounded-lg transition-colors ${location.pathname === '/meetings/recordings'
                    ? 'bg-teal-800 text-white font-medium'
                    : 'text-white hover:bg-[#4b155d]'
                  }`}
              >
                <FaFileDownload className="mr-2 text-xs" />
                <span>Recordings</span>
              </Link>
            </li> */}
          </ul>
        )}

        <li>
          <div
            onClick={() => setIsSubsExpanded(!isSubsExpanded)}
            className={`flex items-center justify-between p-3 rounded-lg transition-all duration-200 cursor-pointer ${
              location.pathname.startsWith('/subscription')
                ? 'bg-[#4b155d] shadow-lg'
                : 'hover:bg-[#4b155d] hover:shadow-md hover:pl-4'
            }`}
          >
            <div className="flex items-center">
              <FaUserCheck className="mr-3 text-teal-300" />
              <span>Subscription</span>
            </div>
            <FaChevronRight
              className={`text-sm opacity-70 transition-transform ${
                isAdminExpanded ? 'transform rotate-90' : ''
              }`}
            />
          </div>
        </li>

        {isSubsExpanded && (
          <ul className="pl-6 mt-1 space-y-1">
            <li>
              <Link
                to="/subscription/plan"
                className={`text-white flex items-center p-2 text-sm rounded-lg transition-colors ${
                  location.pathname === '/subscription/plan'
                    ? 'bg-teal-800 text-white font-medium'
                    : 'text-white hover:bg-[#4b155d]'
                }`}
              >
                <FaUserCheck className="mr-2 text-xs" />
                <span>Subscription Plan</span>
              </Link>
            </li>
          </ul>
        )}
        <li className="pt-4 mt-4 border-t border-[#4b155d]">
          <span className="text-xs font-semibold text-white uppercase tracking-wider pl-3">
            Developers
          </span>
        </li>

        <li>
          <div
            onClick={() => setIsDevelopersExpanded(!isDevelopersExpanded)}
            className={`flex items-center justify-between p-3 rounded-lg transition-all duration-200 cursor-pointer ${
              location.pathname.startsWith('/developers')
                ? 'bg-[#4b155d]       600 shadow-lg'
                : 'hover:bg-[#4b155d]       700 hover:shadow-md hover:pl-4'
            }`}
          >
            <div className="flex items-center">
              <FaCode className="mr-3 text-teal-300" />
              <span>API Integration</span>
            </div>
            <FaChevronRight
              className={`text-sm opacity-70 transition-transform ${isDevelopersExpanded ? 'transform rotate-90' : ''}`}
            />
          </div>
        </li>

        {/* Developers Submenu */}
        {isDevelopersExpanded && (
          <ul className="pl-6 mt-1 space-y-1">
            <li>
              <Link
                to="/developers/documentation"
                className={`text-white flex items-center p-2 text-sm rounded-lg transition-colors ${
                  location.pathname === '/developers/documentation'
                    ? 'bg-teal-800 text-white font-medium'
                    : 'text-white hover:bg-[#4b155d]'
                }`}
              >
                <FaBook className="mr-2 text-xs" />
                <span>API Documentation</span>
              </Link>
            </li>
          
            {/* <li>
              <Link
                to="/developers/integration-guide"
                className={`text-white flex items-center p-2 text-sm rounded-lg transition-colors ${
                  location.pathname === '/developers/integration-guide'
                    ? 'bg-teal-800 text-white font-medium'
                    : 'text-white hover:bg-[#4b155d]'
                }`}
              >
                <FaVideo className="mr-2 text-xs" />
                <span>Integration Guide</span>
              </Link>
            </li> */}
          </ul>
        )}

        {/* Settings */}
        {/* <li className="pt-4 mt-4 border-t border-[#4b155d]       700">
          <Link 
            to="/settings"
            className={`flex items-center justify-between p-3 rounded-lg transition-all duration-200 ${
              location.pathname === '/settings' 
                ? 'bg-[#4b155d]       600 shadow-lg' 
                : 'hover:bg-[#4b155d]       700 hover:shadow-md hover:pl-4'
            }`}
          >
            <div className="flex items-center">
              <FaCog className="mr-3 text-teal-300" />
              <span>Settings</span>
            </div>
            {location.pathname === '/settings' && <FaChevronRight className="text-sm opacity-70" />}
          </Link>
        </li> */}

        {user && user.isAdmin === "true" && (
          <>
            <li className="pt-4 mt-4 border-t border-[#4b155d]">
              <span className="text-xs font-semibold text-white uppercase tracking-wider pl-3">
                Admin
              </span>
            </li>

            <li>
              <div
                onClick={() => setIsAdminExpanded(!isAdminExpanded)}
                className={`flex items-center justify-between p-3 rounded-lg transition-all duration-200 cursor-pointer ${
                  location.pathname.startsWith('/admin')
                    ? 'bg-[#4b155d] shadow-lg'
                    : 'hover:bg-[#4b155d] hover:shadow-md hover:pl-4'
                }`}
              >
                <div className="flex items-center">
                  <FaUserCheck className="mr-3 text-teal-300" />
                  <span>Admin Panel</span>
                </div>
                <FaChevronRight
                  className={`text-sm opacity-70 transition-transform ${
                    isAdminExpanded ? 'transform rotate-90' : ''
                  }`}
                />
              </div>
            </li>

            {isAdminExpanded && (
              <ul className="pl-6 mt-1 space-y-1">
                <li>
                  <Link
                    to="/admin/users"
                    className={`text-white flex items-center p-2 text-sm rounded-lg transition-colors ${
                      location.pathname === '/admin/users'
                        ? 'bg-teal-800 text-white font-medium'
                        : 'text-white hover:bg-[#4b155d]'
                    }`}
                  >
                    <FaUserCheck className="mr-2 text-xs" />
                    <span>All Users</span>
                  </Link>
                </li>
                <li>
                  <Link
                    to="/admin/subs"
                    className={`text-white flex items-center p-2 text-sm rounded-lg transition-colors ${
                      location.pathname === '/admin/subs'
                        ? 'bg-teal-800 text-white font-medium'
                        : 'text-white hover:bg-[#4b155d]'
                    }`}
                  >
                    <FaUserCheck className="mr-2 text-xs" />
                    <span> Subscripton</span>
                  </Link>
                </li>
              </ul>
            )}
          </>
        )}
      </ul>

      <div className="flex w-full items-center justify-center py-6 ">
        <button
          onClick={handleLogout}
          className="px-6 py-2 bg-red-600 text-white font-semibold rounded-lg shadow-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-400 transition duration-300"
        >
          Logout
        </button>
      </div>

     <div className="flex w-full items-center justify-center py">
      <Link
        to="/setting"
        className="flex items-center gap-2 px-2 py-2 bg-white shadow-lg border border-gray-200 rounded-full text-gray-800 hover:bg-gray-200 transition-all duration-300"
      >
        <Settings className="w-5 h-5" />
        <span className="font-medium">Setting</span>
      </Link>
    </div>

      {/* Bottom Decoration */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-teal-400 to-transparent"></div>
    </div>
  );
};

export default Sidebar;
