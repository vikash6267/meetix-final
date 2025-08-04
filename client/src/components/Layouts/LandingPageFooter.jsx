"use client"

import { DevicePhoneMobileIcon } from "@heroicons/react/24/solid"
import { Link } from "react-router-dom"
import meetixLogo from "../../assets/meetix-logo.png"

const LandingPageFooter = () => {
  return (
    <footer className="bg-gradient-to-br from-black via-gray-900 to-purple-900 border-t border-purple-800/30">
      <div className="container mx-auto px-4 py-12">
        {/* Abstract background elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-10 -left-10 w-40 h-40 bg-purple-500/10 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-10 -right-10 w-60 h-60 bg-indigo-500/10 rounded-full blur-3xl"></div>
        </div>

        <div className="relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <Link to={"/"}>
                <div className="flex items-center mb-4 group">
                  <img
                    src={meetixLogo || "/placeholder.svg"}
                    alt="Meetix Logo"
                    className="h-8 w-8 mr-3 transition-transform duration-200 group-hover:scale-110"
                  />
                  <h3 className="text-xl font-bold text-white group-hover:text-purple-300 transition-colors duration-200">
                    Meetix
                  </h3>
                </div>
              </Link>
              <p className="text-gray-300 mb-6 leading-relaxed">
                Bringing people together through seamless video communication with cutting-edge technology.
              </p>
              <div className="flex space-x-4">
                <a
                  href="#"
                  className="text-gray-400 hover:text-purple-400 transition-colors duration-200 transform hover:scale-110"
                >
                  <span className="sr-only">Facebook</span>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path
                      fillRule="evenodd"
                      d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
                      clipRule="evenodd"
                    />
                  </svg>
                </a>
                <a
                  href="#"
                  className="text-gray-400 hover:text-purple-400 transition-colors duration-200 transform hover:scale-110"
                >
                  <span className="sr-only">Twitter</span>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                </a>
                <a
                  href="#"
                  className="text-gray-400 hover:text-purple-400 transition-colors duration-200 transform hover:scale-110"
                >
                  <span className="sr-only">LinkedIn</span>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                  </svg>
                </a>
                <a
                  href="#"
                  className="text-gray-400 hover:text-purple-400 transition-colors duration-200 transform hover:scale-110"
                >
                  <span className="sr-only">Instagram</span>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 6.62 5.367 11.987 11.988 11.987s11.987-5.367 11.987-11.987C24.004 5.367 18.637.001 12.017.001zM8.449 16.988c-1.297 0-2.448-.49-3.323-1.297C4.198 14.926 3.708 13.775 3.708 12.478s.49-2.448 1.418-3.323C6.001 8.228 7.152 7.738 8.449 7.738s2.448.49 3.323 1.417c.875.875 1.365 2.026 1.365 3.323s-.49 2.448-1.365 3.323c-.875.807-2.026 1.187-3.323 1.187zm7.718-1.187c-.875.875-2.026 1.365-3.323 1.365s-2.448-.49-3.323-1.365c-.875-.875-1.365-2.026-1.365-3.323s.49-2.448 1.365-3.323c.875-.875 2.026-1.365 3.323-1.365s2.448.49 3.323 1.365c.875.875 1.365 2.026 1.365 3.323s-.49 2.448-1.365 3.323z" />
                  </svg>
                </a>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-6 text-white flex items-center">
                <div className="w-2 h-2 bg-purple-500 rounded-full mr-3"></div>
                Features
              </h3>
              <ul className="space-y-3">
                <li>
                  <Link
                    to={"/screen-sharing"}
                    className="text-gray-300 hover:text-purple-300 transition-colors duration-200 flex items-center group"
                  >
                    <svg
                      className="w-4 h-4 mr-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Screen Sharing
                  </Link>
                </li>
                <li>
                  <Link
                    to={"/recordings-page"}
                    className="text-gray-300 hover:text-purple-300 transition-colors duration-200 flex items-center group"
                  >
                    <svg
                      className="w-4 h-4 mr-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Recording
                  </Link>
                </li>
                <li>
                  <Link
                    to={"/virtual-background"}
                    className="text-gray-300 hover:text-purple-300 transition-colors duration-200 flex items-center group"
                  >
                    <svg
                      className="w-4 h-4 mr-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Virtual Background
                  </Link>
                </li>
                <li>
                  <Link
                    to={"/live-captions"}
                    className="text-gray-300 hover:text-purple-300 transition-colors duration-200 flex items-center group"
                  >
                    <svg
                      className="w-4 h-4 mr-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Live Captions
                  </Link>
                </li>
                <li>
                  <Link
                    to={"/breakout-rooms"}
                    className="text-gray-300 hover:text-purple-300 transition-colors duration-200 flex items-center group"
                  >
                    <svg
                      className="w-4 h-4 mr-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Breakout Rooms
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-6 text-white flex items-center">
                <div className="w-2 h-2 bg-indigo-500 rounded-full mr-3"></div>
                Resources
              </h3>
              <ul className="space-y-3">
                <li>
                  <Link
                    to={"/help-center"}
                    className="text-gray-300 hover:text-purple-300 transition-colors duration-200 flex items-center group"
                  >
                    <svg
                      className="w-4 h-4 mr-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Help Center
                  </Link>
                </li>
                <li>
                  <Link
                    to={"/community"}
                    className="text-gray-300 hover:text-purple-300 transition-colors duration-200 flex items-center group"
                  >
                    <svg
                      className="w-4 h-4 mr-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Community
                  </Link>
                </li>
                <li>
                  <Link
                    to={"/webinars"}
                    className="text-gray-300 hover:text-purple-300 transition-colors duration-200 flex items-center group"
                  >
                    <svg
                      className="w-4 h-4 mr-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Webinars
                  </Link>
                </li>
                <li>
                  <Link
                    to={"/tutorials"}
                    className="text-gray-300 hover:text-purple-300 transition-colors duration-200 flex items-center group"
                  >
                    <svg
                      className="w-4 h-4 mr-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Tutorials
                  </Link>
                </li>
                <li>
                  <Link
                    to={"/blogs"}
                    className="text-gray-300 hover:text-purple-300 transition-colors duration-200 flex items-center group"
                  >
                    <svg
                      className="w-4 h-4 mr-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Blog
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-6 text-white flex items-center">
                <div className="w-2 h-2 bg-violet-500 rounded-full mr-3"></div>
                Company
              </h3>
              <ul className="space-y-3">
                <li>
                  <Link
                    to={"/about-us"}
                    className="text-gray-300 hover:text-purple-300 transition-colors duration-200 flex items-center group"
                  >
                    <svg
                      className="w-4 h-4 mr-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    About Us
                  </Link>
                </li>
                <li>
                  <Link
                    to={"/careers"}
                    className="text-gray-300 hover:text-purple-300 transition-colors duration-200 flex items-center group"
                  >
                    <svg
                      className="w-4 h-4 mr-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Careers
                  </Link>
                </li>
                <li>
                  <Link
                    to={"/privacy-policy"}
                    className="text-gray-300 hover:text-purple-300 transition-colors duration-200 flex items-center group"
                  >
                    <svg
                      className="w-4 h-4 mr-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link
                    to={"/terms-of-service"}
                    className="text-gray-300 hover:text-purple-300 transition-colors duration-200 flex items-center group"
                  >
                    <svg
                      className="w-4 h-4 mr-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <Link
                    to={"/contact"}
                    className="text-gray-300 hover:text-purple-300 transition-colors duration-200 flex items-center group"
                  >
                    <svg
                      className="w-4 h-4 mr-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Contact Us
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-purple-800/30 pt-8 flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center mb-4 md:mb-0 group">
              <div className="p-2 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-lg mr-3 group-hover:scale-110 transition-transform duration-200">
                <DevicePhoneMobileIcon className="h-5 w-5 text-white" />
              </div>
              <span className="text-gray-300 group-hover:text-purple-300 transition-colors duration-200">
                Download our mobile app
              </span>
            </div>

            <div className="flex space-x-6 mb-4 md:mb-0">
              <Link
                to={"/privacy-policy"}
                className="text-gray-400 hover:text-purple-300 transition-colors duration-200 text-sm"
              >
                Privacy
              </Link>
              <Link
                to={"/terms-of-service"}
                className="text-gray-400 hover:text-purple-300 transition-colors duration-200 text-sm"
              >
                Terms
              </Link>
              <Link
                to={"/cookies"}
                className="text-gray-400 hover:text-purple-300 transition-colors duration-200 text-sm"
              >
                Cookies
              </Link>
            </div>

            <p className="text-gray-400 text-sm">© {new Date().getFullYear()} Meetix. All rights reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default LandingPageFooter
