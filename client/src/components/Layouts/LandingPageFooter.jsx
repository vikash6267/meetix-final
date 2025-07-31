import React from 'react'
import {
    VideoCameraIcon, DevicePhoneMobileIcon,
} from "@heroicons/react/24/solid";
import { Link } from 'react-router-dom';

const LandingPageFooter = () => {
    return (
        <footer className="bg-gradient-to-tr from-black to-[#2F4F29] border-t border-gray-200">
            <div className="container mx-auto px-4 py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
                    <div>
                        <Link to={'/'}>
                            <h3 className="text-lg font-semibold mb-4 flex items-center">
                                <VideoCameraIcon className="h-6 w-6 text-[#00FF40] mr-2" />
                                Meetix
                            </h3>
                        </Link>
                        <p className="text-white-600 mb-4">
                            Bringing people together through seamless video communication.
                        </p>
                        <div className="flex space-x-4">
                            <a href="#" className="text-white-500 hover:text-blue-600">
                                <span className="sr-only">Facebook</span>
                                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                                    <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                                </svg>
                            </a>
                            <a href="#" className="text-white-500 hover:text-blue-600">
                                <span className="sr-only">Twitter</span>
                                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                                </svg>
                            </a>
                            <a href="#" className="text-white-500 hover:text-blue-600">
                                <span className="sr-only">LinkedIn</span>
                                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                                </svg>
                            </a>
                        </div>
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold mb-4">Features</h3>
                        <ul className="space-y-2">
                            <li><Link to={'/screen-sharing'} className="text-white-600 hover:text-blue-600">Screen Sharing</Link></li>
                            <li><Link to={'/recordings-page'} className="text-white-600 hover:text-blue-600">Recording</Link></li>
                            <li><Link to={'/virtual-background'} className="text-white-600 hover:text-blue-600">Virtual Background</Link></li>
                            <li><Link to-={'/live-captions'} className="text-white-600 hover:text-blue-600">Live Captions</Link></li>
                            <li><Link to={'/breakout-rooms'} className="text-white-600 hover:text-blue-600">Breakout Rooms</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold mb-4">Resources</h3>
                        <ul className="space-y-2">
                            <li><Link to={'/help-center'} className="text-white-600 hover:text-blue-600">Help Center</Link></li>
                            <li><Link to={'/community'} className="text-white-600 hover:text-blue-600">Community</Link></li>
                            <li><Link to={'/webinars'} className="text-white-600 hover:text-blue-600">Webinars</Link></li>
                            <li><Link to={'/tutorials'} className="text-white-600 hover:text-blue-600">Tutorials</Link></li>
                            <li><Link to={'/blogs'} className="text-white-600 hover:text-blue-600">Blog</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold mb-4">Company</h3>
                        <ul className="space-y-2">
                            <li><Link to={'/about-us'} className="text-white-600 hover:text-blue-600">About Us</Link></li>
                            <li><Link to={'/careers'} className="text-white-600 hover:text-blue-600">Careers</Link></li>
                            <li><Link to={'/privacy-policy'} className="text-white-600 hover:text-blue-600">Privacy Policy</Link></li>
                            <li><Link to={'/terms-of-service'} className="text-white-600 hover:text-blue-600">Terms of Service</Link></li>
                            <li><Link to={'/contact'} className="text-white-600 hover:text-blue-600">Contact Us</Link></li>
                        </ul>
                    </div>
                </div>
                <div className="border-t border-gray-200 pt-8 flex flex-col md:flex-row justify-between items-center">
                    <div className="flex items-center mb-4 md:mb-0">
                        <DevicePhoneMobileIcon className="h-5 w-5 text-white-500 mr-2" />
                        <span className="text-white-600">Download our mobile app</span>
                    </div>
                    <div className="flex space-x-4">
                        <Link to={'/privacy-policy'} className="text-white-600 hover:text-blue-600">Privacy</Link>
                        <Link to={'/terms-of-service'} className="text-white-600 hover:text-blue-600">Terms</Link>
                        {/* <a href="#" className="text-white-600 hover:text-blue-600">Cookies</a> */}
                    </div>
                    <p className="text-white-600 mt-4 md:mt-0">© {new Date().getFullYear()} Meetix. All rights reserved.</p>
                </div>
            </div>
        </footer>
    )
}

export default LandingPageFooter
