import React from 'react';
import LandingPageFooter from '../../components/Layouts/LandingPageFooter';
import Header from '../../components/Layouts/LandingPageHeader';

const AppLayout = ({ children }) => {
    return (
        <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-grow px-4 py-8 bg-white text-center flex items-center justify-center">
                {children}
            </main>
            <LandingPageFooter />
        </div>
    );
};

export default AppLayout;
