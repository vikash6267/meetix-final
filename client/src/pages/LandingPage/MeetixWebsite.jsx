import React, { useState, useEffect } from "react";
import { Video, Users, Shield, Zap, Monitor, Mic } from "lucide-react";

const MeetixWebsite = () => {
  const [activeFeature, setActiveFeature] = useState(0);
  const [progress, setProgress] = useState(0);
  const AUTO_ROTATE_INTERVAL = 5000; // 5 seconds per feature

  const features = [
    {
      id: 0,
      icon: <Video className="w-5 h-5" />,
      title: "Unlimited Everything",
      emoji: "🎥",
      description:
        "Unlimited meeting durations, no participant limits — just pure, uninterrupted collaboration.",
      detailedDescription:
        "Break free from time constraints with unlimited meeting durations and no participant limits. Whether you're hosting a quick team standup or a day-long workshop, Meetix scales with your needs without any restrictions.",
      highlight: "No time limits, no participant caps, no interruptions",
    },
    {
      id: 1,
      icon: <Users className="w-5 h-5" />,
      title: "Meet & Present",
      emoji: "👥",
      description:
        "Host up to 100 participants (1,000 with upgrades) with presenter mode, audience chat, Q&A, and polls built-in.",
      detailedDescription:
        "Transform your presentations with professional-grade features. Engage your audience with interactive polls, live Q&A sessions, and seamless screen sharing. Scale up to 1,000 participants for large webinars and company-wide meetings.",
      highlight: "Interactive presentations, live polls, Q&A sessions",
    },
    {
      id: 2,
      icon: <Shield className="w-5 h-5" />,
      title: "Enterprise Security",
      emoji: "🔒",
      description:
        "End-to-end encrypted meetings with advanced host controls, waiting rooms, and role-based team management.",
      detailedDescription:
        "Your privacy and security are our top priorities. Every meeting is protected with end-to-end encryption, advanced host controls, customizable waiting rooms, and comprehensive role-based access management.",
      highlight: "End-to-end encryption, waiting rooms, role-based access",
    },
    {
      id: 3,
      icon: <Monitor className="w-5 h-5" />,
      title: "Crystal Clear Quality",
      emoji: "🔊",
      description:
        "Enjoy adaptive HD video, echo cancellation, and noise suppression — smooth on any device or network.",
      detailedDescription:
        "Experience superior audio and video quality with our adaptive HD technology. Advanced noise suppression, echo cancellation, and automatic bandwidth optimization ensure crystal-clear communication regardless of your network conditions.",
      highlight: "HD video, noise suppression, adaptive quality",
    },
  ];

  // Auto-rotate features
  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          setActiveFeature((current) => (current + 1) % features.length);
          return 0;
        }
        return prev + 100 / (AUTO_ROTATE_INTERVAL / 100);
      });
    }, 100);

    return () => clearInterval(interval);
  }, [features.length]);

  // Reset progress when manually selecting a feature
  const handleFeatureClick = (index) => {
    setActiveFeature(index);
    setProgress(0);
  };

  return (
    <div className="min-h-screen bg-[#191c1e] text-white">
      

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="text-center mb-12">
          <div className="mb-4">
            <span className="inline-flex items-center px-4 py-2 rounded-full bg-purple-900/30 text-purple-300 text-sm font-medium border border-purple-600/50">
              ✨ Trusted by 10,000+ teams worldwide
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold mb-4 lg:mb-6 leading-tight text-white">
            <span className="block lg:inline">REDEFINING</span>
            <br />
            <span className="bg-gradient-to-r from-purple-400 via-purple-500 to-purple-600 bg-clip-text text-transparent">
              VIRTUAL
            </span>
            <br />
            <span className="block lg:inline">CONNECTIONS</span>
          </h1>
          <p className="hidden lg:block text-sm md:text-base text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
            Welcome to Meetix — the all-in-one video collaboration platform
            built for modern teams, educators, creators, and enterprises. Say
            goodbye to time limits, laggy calls, and confusing interfaces.
          </p>
          {/* <div className="flex flex-col sm:flex-row gap-4 justify-center mb-6 lg:mb-8">
            <button className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white px-6 lg:px-8 py-3 lg:py-4 rounded-xl text-base lg:text-lg font-semibold transition-all transform hover:scale-105 shadow-lg hover:shadow-xl">
              Start Free Trial
            </button>
            <button className="bg-gray-800 hover:bg-gray-700 text-white border border-gray-600 px-6 lg:px-8 py-3 lg:py-4 rounded-xl text-base lg:text-lg font-semibold transition-all hover:border-purple-500">
              Watch Demo
            </button>
          </div> */}

          {/* Dashboard Preview */}
          <div className="bg-gray-800 rounded-3xl shadow-2xl border border-gray-700 overflow-hidden mb-10 max-w-7xl mx-auto">
            {/* Top Bar */}
            <div className="bg-gray-900 px-8 py-4 border-b border-gray-700 flex items-center justify-between">
              <div className="flex items-center space-x-6">
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-red-500 rounded-full"></div>
                  <div className="w-4 h-4 bg-yellow-500 rounded-full"></div>
                  <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                </div>
                <div className="text-base text-gray-400 font-mono">
                  meetix.com/dashboard
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gray-700 rounded flex items-center justify-center">
                  <div className="w-4 h-4 bg-gray-500 rounded"></div>
                </div>
                <div className="w-8 h-8 bg-gray-700 rounded flex items-center justify-center">
                  <div className="w-4 h-4 bg-gray-500 rounded"></div>
                </div>
              </div>
            </div>

            {/* Dashboard Content */}
            <div className="flex min-h-[450px]">
              {/* Sidebar */}
              <div className="w-72 bg-gray-900 border-r border-gray-700 p-5">
                <div className="space-y-2">
                  <div className="flex items-center space-x-3 p-3 rounded-xl bg-purple-900/40 text-purple-300">
                    <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                    <span className="text-sm font-medium">Dashboard</span>
                  </div>
                  <div className="flex items-center space-x-3 p-3 rounded-xl text-gray-400 hover:bg-gray-800 cursor-pointer transition-colors">
                    <div className="w-4 h-4 bg-gray-600 rounded"></div>
                    <span className="text-sm">Processes</span>
                  </div>
                  <div className="flex items-center space-x-3 p-3 rounded-xl text-gray-400 hover:bg-gray-800 cursor-pointer transition-colors">
                    <div className="w-4 h-4 bg-gray-600 rounded"></div>
                    <span className="text-sm">Deployments</span>
                  </div>
                  <div className="flex items-center space-x-3 p-3 rounded-xl text-gray-400 hover:bg-gray-800 cursor-pointer transition-colors">
                    <div className="w-4 h-4 bg-gray-600 rounded"></div>
                    <span className="text-sm">Analytics</span>
                  </div>
                  <div className="flex items-center space-x-3 p-3 rounded-xl text-gray-400 hover:bg-gray-800 cursor-pointer transition-colors">
                    <div className="w-4 h-4 bg-gray-600 rounded"></div>
                    <span className="text-sm">Settings</span>
                  </div>
                </div>
              </div>

              {/* Main Content */}
              <div className="flex-1 p-6 bg-gray-800">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-white">Processes</h2>
                  <button className="bg-purple-600 text-white px-5 py-2 rounded-xl text-sm font-medium hover:bg-purple-700 transition-colors">
                    Create process
                  </button>
                </div>

                {/* Table Header */}
                <div className="bg-gray-900 rounded-t-xl border border-gray-700 px-6 py-3">
                  <div className="grid grid-cols-4 gap-6 text-sm font-medium text-gray-300">
                    <div>Process</div>
                    <div>Type</div>
                    <div>Instances</div>
                    <div>Pod size</div>
                  </div>
                </div>

                {/* Table Rows */}
                <div className="bg-gray-800 border-l border-r border-b border-gray-700 rounded-b-xl">
                  <div className="grid grid-cols-4 gap-6 px-6 py-4 border-b border-gray-700 text-sm">
                    <div className="font-medium text-white">Web process</div>
                    <div className="text-gray-300">Web process</div>
                    <div className="text-gray-300">1</div>
                    <div className="text-gray-300">$1</div>
                  </div>
                  <div className="grid grid-cols-4 gap-6 px-6 py-4 text-sm">
                    <div className="font-medium text-white">Clean-up DB</div>
                    <div className="text-gray-300">Cron job</div>
                    <div className="text-gray-300">1</div>
                    <div className="text-gray-300">$1</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Interactive Features Section */}
        <div className="">
          <div className="text-center mb-16">
            <span className="inline-flex items-center px-4 py-2 rounded-full bg-purple-900/30 text-purple-300 text-sm font-medium border border-purple-600/50 mb-4">
              🚀 Powerful Features
            </span>
            <h2 className="text-3xl lg:text-4xl xl:text-5xl font-bold mb-4 lg:mb-6 text-white">
              <span className="block lg:inline">Everything you need for</span>
              <br />
              <span className="bg-gradient-to-r from-purple-400 to-purple-500 bg-clip-text text-transparent">
                seamless collaboration
              </span>
            </h2>
            <p className="hidden lg:block text-xl text-gray-300 max-w-2xl mx-auto">
              From unlimited meetings to enterprise security, we've got you
              covered
            </p>
          </div>

          {/* Feature Navigation Buttons */}
          {/* Desktop Layout - Horizontal */}
          <div className="hidden lg:grid lg:grid-cols-4 gap-6 mb-12 max-w-6xl mx-auto">
            {features.map((feature, index) => (
              <button
                key={feature.id}
                onClick={() => handleFeatureClick(index)}
                className={`relative overflow-hidden px-6 py-6 rounded-2xl border-2 transition-all duration-300 flex flex-col items-center space-y-3 text-center group ${
                  activeFeature === index
                    ? "border-purple-500 bg-gradient-to-r from-purple-900/50 to-purple-800/50 shadow-lg shadow-purple-500/20"
                    : "border-gray-700 bg-gray-800/50 hover:border-purple-500 hover:bg-purple-900/30 shadow-sm hover:shadow-md"
                }`}
              >
                <div
                  className={`p-3 rounded-xl flex items-center justify-center transition-all ${
                    activeFeature === index
                      ? "bg-gradient-to-br from-purple-500 to-purple-600 text-white shadow-lg"
                      : "bg-gray-700 text-gray-300 group-hover:bg-purple-600 group-hover:text-white"
                  }`}
                >
                  {feature.icon}
                </div>
                <div>
                  <div
                    className={`font-semibold text-lg mb-1 ${
                      activeFeature === index ? "text-purple-200" : "text-white"
                    }`}
                  >
                    {feature.title}
                  </div>
                  <div
                    className={`text-sm ${
                      activeFeature === index
                        ? "text-purple-300"
                        : "text-gray-400"
                    }`}
                  >
                    {feature.highlight}
                  </div>
                </div>
                {activeFeature === index && (
                  <div
                    className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-purple-500 to-purple-600 transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  />
                )}
              </button>
            ))}
          </div>

          {/* Mobile Layout - 2x2 Grid */}
          <div className="grid grid-cols-2 gap-3 mb-12 max-w-sm mx-auto lg:hidden">
            {features.map((feature, index) => (
              <button
                key={feature.id}
                onClick={() => handleFeatureClick(index)}
                className={`relative overflow-hidden px-4 py-6 rounded-2xl border-2 transition-all duration-300 flex flex-col items-center space-y-3 text-center group ${
                  activeFeature === index
                    ? "border-purple-500 bg-gradient-to-r from-purple-900/50 to-purple-800/50 shadow-lg shadow-purple-500/20"
                    : "border-gray-700 bg-gray-800/50 hover:border-purple-500 hover:bg-purple-900/30 shadow-sm hover:shadow-md"
                }`}
              >
                <div
                  className={`p-2 rounded-xl flex items-center justify-center transition-all ${
                    activeFeature === index
                      ? "bg-gradient-to-br from-purple-500 to-purple-600 text-white shadow-lg"
                      : "bg-gray-700 text-gray-300 group-hover:bg-purple-600 group-hover:text-white"
                  }`}
                >
                  {feature.icon}
                </div>
                <div>
                  <div
                    className={`font-semibold text-sm ${
                      activeFeature === index ? "text-purple-200" : "text-white"
                    }`}
                  >
                    {feature.title}
                  </div>
                </div>
                {activeFeature === index && (
                  <div
                    className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-purple-500 to-purple-600 transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  />
                )}
              </button>
            ))}
          </div>

          {/* Feature Display Box */}
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-3xl p-8 lg:p-12 border-2 border-gray-700 shadow-xl min-h-[400px] lg:min-h-[500px] transition-all duration-500 overflow-hidden">
            <div className="flex flex-col lg:flex-row items-center space-y-8 lg:space-y-0 lg:space-x-8 h-full relative">
              {/* Feature Content */}
              <div className="flex-1 z-10">
                <div className="flex items-center space-x-4 mb-8">
                  <div className="text-5xl">
                    {features[activeFeature].emoji}
                  </div>
                  <div>
                    <h3 className="text-3xl lg:text-4xl font-bold text-white mb-3">
                      {features[activeFeature].title}
                    </h3>
                    <div className="inline-flex items-center px-3 py-1 rounded-full bg-purple-900/40 text-purple-300 text-sm font-medium">
                      {features[activeFeature].highlight}
                    </div>
                  </div>
                </div>

                <p className="text-lg lg:text-xl text-gray-300 leading-relaxed mb-8">
                  {features[activeFeature].detailedDescription}
                </p>

                {/* <button className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white px-8 py-4 rounded-xl font-semibold transition-all transform hover:scale-105 shadow-lg hover:shadow-xl">
                  Learn More
                </button> */}
              </div>

              {/* Feature Visual - iMac Desktop */}
              <div className="flex-1 flex justify-end items-center relative">
                {/* iMac Container - Positioned to be cut off naturally on the right */}
                <div className="relative transform translate-x-20 lg:translate-x-32 scale-90 lg:scale-100">
                  {/* iMac Monitor */}
                  <div className="relative bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 p-2 lg:p-5 shadow-2xl w-[500px] lg:w-[640px]">
                    {/* Screen */}
                    <div className="bg-gradient-to-br from-purple-500 via-purple-600 to-purple-700 overflow-hidden h-[300px] lg:h-[400px] relative flex items-center justify-center">
                      {/* Centered Content Container */}
                      <div className="w-[90%] max-w-[450px] bg-white rounded-2xl shadow-xl overflow-hidden h-[85%]">
                        {/* Browser-style Interface */}
                        <div className="h-full bg-white flex flex-col">
                          {/* Top Browser Bar */}
                          <div className="bg-gray-100 px-4 py-2 flex items-center justify-between border-b border-gray-200">
                            <div className="flex items-center space-x-2">
                              <div className="flex space-x-1.5">
                                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                              </div>
                              <div className="ml-4 flex-1 bg-white rounded-md px-3 py-1 text-xs text-gray-600 max-w-xs">
                                app.meetix.com/dashboard
                              </div>
                            </div>
                            <div className="flex items-center space-x-2">
                              <div className="w-4 h-4 bg-gray-300 rounded-sm"></div>
                              <div className="w-4 h-4 bg-gray-300 rounded-sm"></div>
                            </div>
                          </div>

                          {/* App Content */}
                          <div className="flex-1 flex justify-center items-center p-4">
                            {/* Main Content - Centered */}
                            <div className="w-full max-w-lg bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                              {activeFeature === 0 && (
                                <div className="p-6">
                                  <div className="flex items-center justify-between mb-6">
                                    <h3 className="text-xl font-semibold text-gray-900">
                                      Meeting Dashboard
                                    </h3>
                                    <button className="bg-purple-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-purple-700">
                                      New Meeting
                                    </button>
                                  </div>
                                  <div className="grid grid-cols-3 gap-4 mb-6">
                                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                                      <div className="text-2xl font-bold text-gray-900">
                                        24
                                      </div>
                                      <div className="text-sm text-gray-600">
                                        Active
                                      </div>
                                    </div>
                                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                                      <div className="text-2xl font-bold text-gray-900">
                                        156
                                      </div>
                                      <div className="text-sm text-gray-600">
                                        Users
                                      </div>
                                    </div>
                                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                                      <div className="text-2xl font-bold text-gray-900">
                                        98%
                                      </div>
                                      <div className="text-sm text-gray-600">
                                        Uptime
                                      </div>
                                    </div>
                                  </div>
                                  <div className="space-y-3">
                                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                      <div className="flex items-center space-x-3">
                                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                        <span className="text-sm font-medium">
                                          Team Standup
                                        </span>
                                      </div>
                                      <span className="text-xs text-gray-500">
                                        15 participants
                                      </span>
                                    </div>
                                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                      <div className="flex items-center space-x-3">
                                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                        <span className="text-sm font-medium">
                                          Client Review
                                        </span>
                                      </div>
                                      <span className="text-xs text-gray-500">
                                        8 participants
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              )}

                              {activeFeature === 1 && (
                                <div className="p-6">
                                  <h3 className="text-xl font-semibold mb-6 text-gray-900">
                                    Presentation Hub
                                  </h3>
                                  <div className="space-y-4">
                                    <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-4 rounded-lg border border-blue-200">
                                      <div className="flex items-center justify-between mb-2">
                                        <span className="text-sm text-blue-700 font-medium">
                                          Live Audience
                                        </span>
                                        <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                                          <Users className="w-3 h-3 text-white" />
                                        </div>
                                      </div>
                                      <div className="text-2xl font-bold text-blue-900">
                                        24
                                      </div>
                                      <div className="text-sm text-blue-600">
                                        Active viewers
                                      </div>
                                    </div>
                                    <div className="space-y-2">
                                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                        <span className="text-sm font-medium">
                                          Q4 Strategy
                                        </span>
                                        <span className="text-xs text-gray-500">
                                          Slide 5/12
                                        </span>
                                      </div>
                                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                        <span className="text-sm font-medium">
                                          Next: Team Updates
                                        </span>
                                        <span className="text-xs text-purple-600">
                                          Ready
                                        </span>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              )}

                              {activeFeature === 2 && (
                                <div className="p-6">
                                  <h3 className="text-xl font-semibold mb-6 text-gray-900">
                                    Meeting Recordings
                                  </h3>
                                  <div className="space-y-4">
                                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                                      <div className="flex items-center space-x-3">
                                        <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                                          <Video className="w-5 h-5 text-purple-600" />
                                        </div>
                                        <div>
                                          <div className="text-sm font-medium">
                                            Team Meeting - Q4
                                          </div>
                                          <div className="text-xs text-gray-500">
                                            Dec 15, 2023 • 45 mins
                                          </div>
                                        </div>
                                      </div>
                                      <button className="text-purple-600 text-sm hover:text-purple-700">
                                        View
                                      </button>
                                    </div>
                                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                                      <div className="flex items-center space-x-3">
                                        <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                                          <Video className="w-5 h-5 text-purple-600" />
                                        </div>
                                        <div>
                                          <div className="text-sm font-medium">
                                            Client Presentation
                                          </div>
                                          <div className="text-xs text-gray-500">
                                            Dec 14, 2023 • 32 mins
                                          </div>
                                        </div>
                                      </div>
                                      <button className="text-purple-600 text-sm hover:text-purple-700">
                                        View
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              )}

                              {activeFeature === 3 && (
                                <div className="p-6">
                                  <h3 className="text-xl font-semibold mb-6 text-gray-900">
                                    Analytics Dashboard
                                  </h3>
                                  <div className="grid grid-cols-2 gap-4 mb-6">
                                    <div className="text-center p-4 bg-gradient-to-r from-purple-50 to-purple-100 rounded-lg">
                                      <div className="text-2xl font-bold text-purple-900">
                                        2.4k
                                      </div>
                                      <div className="text-sm text-purple-700">
                                        Meetings
                                      </div>
                                    </div>
                                    <div className="text-center p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg">
                                      <div className="text-2xl font-bold text-blue-900">
                                        156h
                                      </div>
                                      <div className="text-sm text-blue-700">
                                        Time Saved
                                      </div>
                                    </div>
                                  </div>
                                  <div className="bg-gray-50 p-4 rounded-lg">
                                    <div className="text-sm font-medium mb-3 text-center">
                                      Weekly Usage
                                    </div>
                                    <div className="flex items-end justify-center space-x-1 h-16">
                                      <div className="bg-purple-400 w-4 h-8 rounded-t"></div>
                                      <div className="bg-purple-400 w-4 h-12 rounded-t"></div>
                                      <div className="bg-purple-400 w-4 h-16 rounded-t"></div>
                                      <div className="bg-purple-400 w-4 h-10 rounded-t"></div>
                                      <div className="bg-purple-400 w-4 h-14 rounded-t"></div>
                                      <div className="bg-purple-400 w-4 h-6 rounded-t"></div>
                                      <div className="bg-purple-400 w-4 h-9 rounded-t"></div>
                                    </div>
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* iMac Stand */}
                  <div className="flex justify-center mt-2">
                    <div className="w-16 h-6 bg-gradient-to-b from-gray-400 to-gray-500 rounded-b-2xl shadow-md"></div>
                  </div>
                  <div className="flex justify-center mt-0.5">
                    <div className="w-28 h-3 bg-gradient-to-b from-gray-500 to-gray-600 rounded-full shadow-sm"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MeetixWebsite;