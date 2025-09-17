import React, { useRef, useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import {
  MicrophoneIcon,
  VideoCameraIcon,
  ClockIcon,
  UserGroupIcon,
  ShieldCheckIcon,
  DevicePhoneMobileIcon,
  ChevronDownIcon,
  Bars3Icon,
  XMarkIcon,
  LockOpenIcon,
  LockClosedIcon,
  BoltIcon,
  BriefcaseIcon,
  CheckBadgeIcon,
} from '@heroicons/react/24/solid';
import { Link, useNavigate } from 'react-router-dom';
import { actions } from '../../features/room';
import * as socketConnection from '../../socket/socket';
import CountUp from 'react-countup';
import { useInView } from 'react-intersection-observer';
import Header from '../../components/Layouts/LandingPageHeader';
import Footer from '../../components/Layouts/LandingPageFooter';
import AllSubscriptions from '../../components/common/AllSubscription';
import MeetixWebsite from './MeetixWebsite';

function LandingPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [open, setOpen] = useState(null); // To manage which FAQ is open

  const toggleFAQ = (index) => {
    setOpen(open === index ? null : index); // Toggle the FAQ based on index
  };

  const { ref: statsRef, inView: statsInView } = useInView({
    threshold: 0.1,
  });

  useEffect(() => {
    dispatch(actions.setIsRoomHost(false));
    socketConnection.connetWithSocket();

    if (localStorage.getItem('authToken')) {
      setIsLoggedIn(true);
    }
  }, [dispatch]);

  const { ref: heroRef, inView: heroInView } = useInView({ threshold: 0.1 });
  const { ref: featuresRef, inView: featuresInView } = useInView({
    threshold: 0.1,
  });
  const { ref: stepsRef, inView: stepsInView } = useInView({ threshold: 0.1 });
  const { ref: useCasesRef, inView: useCasesInView } = useInView({
    threshold: 0.1,
  });
  const { ref: testimonialsRef, inView: testimonialsInView } = useInView({
    threshold: 0.1,
  });
  const { ref: faqRef, inView: faqInView } = useInView({ threshold: 0.1 });
  const { ref: ctaRef, inView: ctaInView } = useInView({ threshold: 0.1 });
  const { ref: pricingRef, inView: pricingInView } = useInView({
    threshold: 0.1,
  });

  return (
    <div className="min-h-screen bg-[#191c1e] text-white flex flex-col font-poppins">
      {/* Header */}
      <Header />

      {/* Google Meet-like Main Content */}
      <main className="flex-grow container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          {/* Hero Section */}

        <MeetixWebsite />
          <div
            ref={stepsRef}
            className={`py-10 ${stepsInView ? 'zoom-in' : ''}`}
          >
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                🗒️ <span className="text-[#5a4ded]">Simple</span> and{' '}
                <span className="text-[#5a4ded]">Seamless</span> Collaboration
              </h2>
              <p className="text-xl text-white max-w-2xl mx-auto">
                Get Started in 3 Simple Steps
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="relative p-6 bg-[#272a2c] rounded-2xl transition-transform duration-300 hover:scale-125 hover:shadow-lg slide-in-left">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-xl">
                  1
                </div>
                <div className="mt-8 text-center">
                  <VideoCameraIcon className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2 text-white">
                    Start or Schedule a Meeting
                  </h3>
                  <p className="text-gray-400">
                    Invite participants with one click — via email, calendar, or
                    chat.
                  </p>
                </div>
              </div>

              <div className="relative p-6 bg-[#272a2c] rounded-2xl transition-transform duration-300 hover:scale-125 hover:shadow-lg slide-in-bottom">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center text-white font-bold text-xl">
                  2
                </div>
                <div className="mt-8 text-center">
                  <UserGroupIcon className="h-12 w-12 text-purple-600 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2 text-white">
                    Go Live & Collaborate
                  </h3>
                  <p className="text-gray-400">
                    Present, share screens, record, and engage. You’re in
                    control.
                  </p>
                </div>
              </div>

              <div className="relative p-6 bg-[#272a2c] rounded-2xl transition-transform duration-300 hover:scale-125 hover:shadow-lg slide-in-right">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-green-600 rounded-full flex items-center justify-center text-white font-bold text-xl">
                  3
                </div>
                <div className="mt-8 text-center">
                  <ShieldCheckIcon className="h-12 w-12 text-green-600 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2 text-white">
                    Secure Collaboration
                  </h3>
                  <p className="text-gray-400">
                    Enjoy encrypted communication with screen sharing and
                    recording
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div
            ref={useCasesRef}
            className={`py-16 px-4 ${useCasesInView ? 'zoom-in' : ''}`}
          >
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                💡 Built for Every Use Case
              </h2>
              <p className="text-xl text-white max-w-2xl mx-auto">
                Whether you're part of a team, an educator, an enterprise, or a
                creator, Meetix has the perfect features to support your needs.
              </p>
            </div>

            {/* Grid Section */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {/* Teams & Startups */}
              <div className="bg-[#272a2c] p-6 rounded-lg shadow-md text-center slide-in-left transition-transform duration-300 hover:scale-125 hover:shadow-lg overflow-hidden">
                <div className="h-32 w-32 absolute bg-purple-400 top-0 left-0 rounded-r-full blur-[100px] opacity-80"></div>
                <div className="bg-purple-100 p-4 rounded-full mb-5 inline-block">
                  <UserGroupIcon className="h-8 w-8 text-purple-600" />
                </div>
                <div className="border-t-2 py-5">
                  <h3 className="text-xl  font-semibold text-white mb-2">
                    ✅ Teams & Startups
                  </h3>
                  <p className="text-purple-200">
                    Keep everyone aligned, from morning standups to global
                    syncs.
                  </p>
                </div>
              </div>

              {/* Educators & Trainers */}
              <div className="bg-[#272a2c] p-6 rounded-lg shadow-md text-center slide-in-bottom transition-transform duration-300 hover:scale-125 hover:shadow-lg overflow-hidden">
                <div className="h-32 w-32 absolute bg-purple-400 top-0 left-0 rounded-r-full blur-[100px] opacity-80"></div>
                <div className="bg-yellow-100 p-4 rounded-full mb-5 inline-block">
                  <BriefcaseIcon className="h-8 w-8 text-yellow-600" />
                </div>
                <div className="border-t-2 py-5">
                  <h3 className="text-xl font-semibold text-white mb-2">
                    🎓 Educators & Trainers
                  </h3>
                  <p className="text-purple-200">
                    Deliver live courses, engage students, and share resources
                    in real-time.
                  </p>
                </div>
              </div>

              {/* Enterprises & Consultancies */}
              <div className="bg-[#272a2c] p-6 rounded-lg shadow-md text-center slide-in-bottom transition-transform duration-300 hover:scale-125 hover:shadow-lg overflow-hidden">
                <div className="h-32 w-32 absolute bg-purple-400 top-0 left-0 rounded-r-full blur-[100px] opacity-80"></div>
                <div className="bg-green-100 p-4 rounded-full mb-5 inline-block">
                  <BriefcaseIcon className="h-8 w-8 text-green-600" />
                </div>
                <div className="border-t-2 py-5">
                  <h3 className="text-xl font-semibold text-white mb-2">
                    💼 Enterprises & Consultancies
                  </h3>
                  <p className="text-purple-200">
                    Secure collaboration, client onboarding, and executive
                    briefings — all in one place.
                  </p>
                </div>
              </div>

              {/* Creators & Speakers */}
              <div className="bg-[#272a2c] p-6 rounded-lg shadow-md text-center slide-in-right transition-transform duration-300 hover:scale-125 hover:shadow-lg overflow-hidden">
                <div className="h-32 w-32 absolute bg-purple-400 top-0 left-0 rounded-r-full blur-[100px] opacity-80"></div>
                <div className="bg-red-100 p-4 rounded-full mb-5 inline-block">
                  <MicrophoneIcon className="h-8 w-8 text-red-600" />
                </div>
                <div className="border-t-2 py-5">
                  <h3 className="text-xl font-semibold text-white mb-2">
                    🎤 Creators & Speakers
                  </h3>
                  <p className="text-purple-200">
                    Go live with large audiences, host Q&As, and grow your brand
                    with impactful webinars.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Testimonials Section */}
          <div
            ref={testimonialsRef}
            className={`py-16 px-4 ${testimonialsInView ? 'zoom-in' : ''}`}
          >
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                🌍 Trusted by 50,000+ Teams Around the Globe
              </h2>
              <p className="text-xl text-white max-w-2xl mx-auto">
                Join thousands of satisfied users transforming their
                communication
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* Testimonial 1 */}
              <div className="p-8 bg-[#272a2c] rounded-2xl shadow-lg hover:shadow-2xl transition-shadow slide-in-left">
                <div className="flex items-center mb-6">
                  <div className="w-16 h-16 bg-purple-200 rounded-full flex items-center justify-center mr-4">
                    <span className="text-2xl font-bold text-purple-600">
                      1
                    </span>
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-purple-400">
                      Team Collaboration
                    </h4>
                    <p className="text-gray-200">Case Study</p>
                  </div>
                </div>
                <p className="text-gray-200 mb-6">
                  “We switched from Zoom to Meetix and never looked back. The
                  unlimited time and intuitive UI alone make it a no-brainer.”
                </p>
                <div className="flex items-center">
                  <img
                    src="https://randomuser.me/api/portraits/men/1.jpg"
                    alt="Sophia A."
                    className="w-10 h-10 rounded-full mr-3"
                  />
                  <div>
                    <p className="font-semibold text-purple-400">Sophia A.</p>
                    <p className="text-gray-200 text-sm">
                      Operations Lead at BrightEdge
                    </p>
                  </div>
                </div>
              </div>

              {/* Testimonial 2 */}
              <div className="p-8 bg-[#272a2c] rounded-2xl shadow-lg hover:shadow-xl transition-shadow slide-in-right">
                <div className="flex items-center mb-6">
                  <div className="w-16 h-16 bg-purple-200 rounded-full flex items-center justify-center mr-4">
                    <span className="text-2xl font-bold text-purple-600">
                      2
                    </span>
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-purple-400">
                      Educator's Perspective
                    </h4>
                    <p className="text-gray-200">Case Study</p>
                  </div>
                </div>
                <p className="text-gray-200 mb-6">
                  “As an educator, I needed a reliable platform with no limits
                  and good webinar tools. Meetix delivers on every front.”
                </p>
                <div className="flex items-center">
                  <img
                    src="https://randomuser.me/api/portraits/men/2.jpg"
                    alt="Dr. Raj Patel"
                    className="w-10 h-10 rounded-full mr-3"
                  />
                  <div>
                    <p className="font-semibold text-purple-400">
                      Dr. Raj Patel
                    </p>
                    <p className="text-gray-200 text-sm">Online Instructor</p>
                  </div>
                </div>
              </div>

              {/* Testimonial 3 */}
              <div className="p-8 bg-[#272a2c] rounded-2xl shadow-lg hover:shadow-2xl transition-shadow slide-in-left">
                <div className="flex items-center mb-6">
                  <div className="w-16 h-16 bg-purple-200 rounded-full flex items-center justify-center mr-4">
                    <span className="text-2xl font-bold text-purple-600">
                      3
                    </span>
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-purple-400">
                      Team Collaboration
                    </h4>
                    <p className="text-gray-200">Case Study</p>
                  </div>
                </div>
                <p className="text-gray-200 mb-6">
                  “We switched from Zoom to Meetix and never looked back. The
                  unlimited time and intuitive UI alone make it a no-brainer.”
                </p>
                <div className="flex items-center">
                  <img
                    src="https://randomuser.me/api/portraits/men/5.jpg"
                    alt="Sophia A."
                    className="w-10 h-10 rounded-full mr-3"
                  />
                  <div>
                    <p className="font-semibold text-purple-400">Alex J.</p>
                    <p className="text-gray-200 text-sm">
                      Operations Lead at BrightEdge
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* FAQ Section  */}
          <div
            ref={faqRef}
            className={`py-16 px-4 ${faqInView ? 'zoom-in' : ''}`}
          >
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-White mb-4 text-left">
                ❓ Frequently Asked Questions
              </h2>
            </div>

            {/* FAQ Items */}
            <div className="flex flex-wrap gap-4 justify-between">
              {/* FAQ Column 1 */}
              <div className="w-full md:w-[calc(50%-8px)] space-y-4">
                {/* Question 1 */}
                <div className="bg-purple-200 p-3 rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
                  <div
                    className="flex justify-between items-center cursor-pointer"
                    onClick={() => toggleFAQ(1)}
                  >
                    <h3 className="text-xl font-medium text-gray-900 mb-4">
                      Q1: Is Meetix really free?
                    </h3>
                    <span className="text-xl text-gray-500">
                      {open === 1 ? '−' : '+'}
                    </span>
                  </div>
                  <div
                    className={`overflow-hidden transition-all duration-500 ease-in-out ${open === 1 ? 'max-h-[200px]' : 'max-h-0'}`}
                  >
                    {open === 1 && (
                      <p className="text-lg text-gray-600">
                        Yes! Meetix offers unlimited meetings with up to 100
                        participants for free, with no time limits.
                      </p>
                    )}
                  </div>
                </div>

                {/* Question 3 */}
                <div className="bg-purple-300 p-3 rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
                  <div
                    className="flex justify-between items-center cursor-pointer"
                    onClick={() => toggleFAQ(3)}
                  >
                    <h3 className="text-xl font-medium text-gray-900 mb-4">
                      Q3: Is Meetix secure?
                    </h3>
                    <span className="text-xl text-gray-500">
                      {open === 3 ? '−' : '+'}
                    </span>
                  </div>
                  <div
                    className={`overflow-hidden transition-all duration-500 ease-in-out ${open === 3 ? 'max-h-[200px]' : 'max-h-0'}`}
                  >
                    {open === 3 && (
                      <p className="text-lg text-gray-600">
                        Absolutely. All meetings are protected with end-to-end
                        encryption to ensure your privacy.
                      </p>
                    )}
                  </div>
                </div>

                {/* Question 5 */}
                <div className="bg-purple-200 p-3 rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
                  <div
                    className="flex justify-between items-center cursor-pointer"
                    onClick={() => toggleFAQ(5)}
                  >
                    <h3 className="text-xl font-medium text-gray-900 mb-4">
                      Q5: What support options are available?
                    </h3>
                    <span className="text-xl text-gray-500">
                      {open === 5 ? '−' : '+'}
                    </span>
                  </div>
                  <div
                    className={`overflow-hidden transition-all duration-500 ease-in-out ${open === 5 ? 'max-h-[200px]' : 'max-h-0'}`}
                  >
                    {open === 5 && (
                      <p className="text-lg text-gray-600">
                        We offer 24/7 email and live chat support for Pro users,
                        and dedicated account managers for Business plans.
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* FAQ Column 2 */}
              <div className="w-full md:w-[calc(50%-8px)] space-y-4">
                {/* Question 2 */}
                <div className="bg-purple-300 p-3 rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
                  <div
                    className="flex justify-between items-center cursor-pointer"
                    onClick={() => toggleFAQ(2)}
                  >
                    <h3 className="text-xl font-medium text-gray-900 mb-4">
                      Q2: Do I need to install any software?
                    </h3>
                    <span className="text-xl text-gray-500">
                      {open === 2 ? '−' : '+'}
                    </span>
                  </div>
                  <div
                    className={`overflow-hidden transition-all duration-500 ease-in-out ${open === 2 ? 'max-h-[200px]' : 'max-h-0'}`}
                  >
                    {open === 2 && (
                      <p className="text-lg text-gray-600">
                        No, Meetix works directly in your browser. However, apps
                        are available for desktop and mobile.
                      </p>
                    )}
                  </div>
                </div>

                {/* Question 4 */}
                <div className="bg-purple-200 p-3 rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
                  <div
                    className="flex justify-between items-center cursor-pointer"
                    onClick={() => toggleFAQ(4)}
                  >
                    <h3 className="text-xl font-medium text-gray-900 mb-4">
                      Q4: Can I host webinars or large events?
                    </h3>
                    <span className="text-xl text-gray-500">
                      {open === 4 ? '−' : '+'}
                    </span>
                  </div>
                  <div
                    className={`overflow-hidden transition-all duration-500 ease-in-out ${open === 4 ? 'max-h-[200px]' : 'max-h-0'}`}
                  >
                    {open === 4 && (
                      <p className="text-lg text-gray-600">
                        Yes. Our Business and Enterprise plans support
                        large-scale webinars with advanced controls.
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Stats Section */}
          <div className="">
            {/* Statistics Section */}
            <div
              ref={statsRef}
              className={`py-16 ${statsInView ? 'zoom-in' : ''}`}
            >
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                <div className="p-6">
                  <div className="text-4xl font-bold text-blue-600 mb-2">
                    <CountUp
                      start={0}
                      end={statsInView ? 1 : 0}
                      duration={2.5}
                      suffix="K+"
                      startOnMount={false}
                    />
                  </div>
                  <div className="text-white">Daily Meetings</div>
                </div>

                <div className="p-6">
                  <div className="text-4xl font-bold text-purple-600 mb-2">
                    <CountUp
                      start={0}
                      end={statsInView ? 10 : 0}
                      duration={2.5}
                      suffix="K+"
                      startOnMount={false}
                    />
                  </div>
                  <div className="text-white">Active Users</div>
                </div>

                <div className="p-6">
                  <div className="text-4xl font-bold text-green-600 mb-2">
                    <CountUp
                      start={0}
                      end={statsInView ? 150 : 0}
                      duration={2.5}
                      suffix="+"
                      startOnMount={false}
                    />
                  </div>
                  <div className="text-white">Countries</div>
                </div>

                <div className="p-6">
                  <div className="text-4xl font-bold text-orange-600 mb-2">
                    <CountUp
                      start={0}
                      end={statsInView ? 99.9 : 0}
                      duration={2.5}
                      suffix="%"
                      decimals={1}
                      startOnMount={false}
                    />
                  </div>
                  <div className="text-white">Uptime</div>
                </div>
              </div>
            </div>
          </div>
          {/* CTA Section  */}
          <div
            ref={ctaRef}
            className={`py-16 px-4 ${ctaInView ? 'zoom-in' : ''}`}
          >
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                🚀 Ready to Elevate Your Communication?
              </h2>
              <p className="text-lg md:text-xl max-w-2xl mx-auto mb-8">
                Join millions of users switching to Meetix for better video
                collaboration.
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex justify-center gap-8">
              {/* Start for Free Button */}
              {!isLoggedIn && (
                <Link
                  to={'/sign-up'}
                  className="bg-purple-600 hover:bg-purple-700 text-white py-3 px-8 rounded-md text-xl font-medium shadow-lg transform hover:scale-105 transition duration-300"
                >
                  Start for Free
                </Link>
              )}

              {/* Book a Demo Button */}
              <Link
                to={'/meetings/details'}
                className="bg-transparent border-2 border-white hover:bg-white hover:text-blue-600 text-white py-3 px-8 rounded-md text-xl font-medium shadow-lg transform hover:scale-105 transition duration-300"
              >
                <Link
                to={'/meetings/details'}
                className="bg-transparent border-2 border-white hover:bg-white hover:text-blue-600 text-white py-3 px-8 rounded-md text-xl font-medium shadow-lg transform hover:scale-105 transition duration-300"
              >
                Get Started
              </Link>
              </Link>
            </div>

            {/* Subtext */}
            <p className="text-lg mt-6 text-white font-medium italic text-center">
              <span className="font-semibold">No credit card required.</span>{' '}
              Set up your first meeting in under a minute.
            </p>
          </div>

          {/* Pricing Section  */}
          <div
            ref={pricingRef}
            className={`py-16 px-4 ${pricingInView ? 'zoom-in' : ''}`}
          >
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                🔄 Make the Switch to Smarter Meetings
              </h2>
              <p className="text-xl text-white max-w-2xl mx-auto mb-8">
                Meetix isn’t just an alternative to Zoom. It’s a better way to
                connect, collaborate, and present — securely and without
                compromise.
              </p>
            </div>

            {/* Pricing Section */}
            <div className="text-center mb-16">
              <h3 className="text-3xl md:text-4xl font-bold text-white mb-6">
                🧾 Flexible Plans for Every Team
              </h3>
              <p className="text-xl text-white max-w-2xl mx-auto mb-8">
                Choose the plan that fits your needs. Start free, upgrade
                anytime.
              </p>
            </div>

            <AllSubscriptions />
          </div>
        </div>
      </main>

      {/* Enhanced Footer */}
      <Footer />
    </div>
  );
}

export default LandingPage;
