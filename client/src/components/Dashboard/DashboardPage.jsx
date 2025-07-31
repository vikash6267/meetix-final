import React from 'react';
import Sidebar from '../Layouts/SideNav';

const DashboardPage = () => {
  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      
      <div className="flex-1 overflow-auto p-8 flex justify-center items-center">
        <div className="max-w-2xl w-full text-center bg-white p-10 rounded-lg shadow-lg">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Coming Soon!</h1>
          <p className="text-xl text-gray-600 mb-6">
            This feature is under development.
          </p>
          <div className="text-center">
            <span className="text-teal-500 font-semibold text-xl">Stay tuned!</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
