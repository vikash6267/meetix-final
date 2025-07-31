import { createBrowserRouter } from 'react-router-dom';
import RoomPage from './pages/RoomPage/RoomPage';
import JoinRoomPage from './pages/JoinRoomPage/JoinRoomPage';
// import IntroductionPage from './pages/IntroductionPage/IntroductionPage';
import LandingPage from './pages/LandingPage/LandingPage';
import SignIn from './components/auth/SignIn';
import SignUp from './components/auth/SignUp';
import SideBar from "./components/Layouts/SideNav"
import ForgotPassword from './components/auth/ForgetPassword';
import RecordingsPage from './components/RecordingsPage/RecordingsPage';
import AttendancePage from './components/Attendance/Attendance';
import ChatPage from './components/ChatPage/ChatPage'
import NewMeetingPage from './components/NewMeeting/NewMeeting';
import UpcomingMeetingPage from './components/UpcomingMeetings/UpcomingMeetings';
import CompletedMeetingPage from './components/CompletedMeetings/CompletedMeetings';
import DashboardPage from './components/Dashboard/DashboardPage';
import SubscripationPage from './components/SubscriptionPage/SubscripationPage';
import DeveloperDocumentationPage from './components/DeveloperDocumentation/DeveloperDocumentationPage';
import ApiGeneratePage from './components/ApiGeneratePage/ApiGeneratePage';
import IntegrationGuidePage from './components/IntegrationGuide/IntegrationGuidePage';
import ScreenSharing from './pages/ScreenSharingPage/ScreenSharingPage';
import LiveCaptions from './pages/LiveCaptionsPage/LiveCaptionsPage';
import BreakOutRooms from './pages/BreakoutRoomsPage/BreakoutRoomsPage';
import VirtualBackground from './pages/VirtualBackgroundPage/VirtualBackgroundPage';
import AboutUs from './pages/AboutUsPage/AboutUsPage';
import Careers from './pages/CareersPage/CareersPage';
import PrivacyPolicy from './pages/PrivacyPolicyPage/PrivacyPolicyPage';
import TermsOfServices from './pages/TermsOfServicePage/TermsOfServicePage';
import ContactUs from './pages/ContactUsPage/ContactUsPage';
import HelpCenter from './pages/HelpCenterPage/HelpCenterPage';
import Community from './pages/CommunityPage/CommunityPage';
import Webinars from './pages/WebinarsPage/WebinarsPage';
import Tutorials from './pages/TutorialsPage/TutorialsPage';
import Blogs from './pages/BlogsPage/BlogsPage';
import FreePlans from './pages/FreePlansPage/FreePlansPage';
import ProPlans from './pages/ProPlansPage/ProPlansPage';
import BusinessPlans from './pages/BusinessPlanPage/BusinessPlansPage';
import BookDemo from './pages/BookDemoPage/BookDemoPage';
import SessionPage from './components/SessionPage/SessionPage';
import User from './pages/Admin/User';
import SubscriptionDashboard from './pages/Admin/Subscription';
import MeetingDetails from './pages/Meeting/MeetingDetails';
import PrivateRoute from './components/routes/PrivateRoute';
import PaymentSuccess from './components/Subscription/Paymentsuccess';
import Settings from './pages/Admin/Setting';
import MeetingCheck from './pages/MeetingCheck';

export const router = createBrowserRouter([
  // { path: '/', element: <IntroductionPage /> },
  { path: '/', element: <LandingPage /> },
  { path: '/room', element: <RoomPage /> },
  { path: '/join-room', element: <JoinRoomPage /> },
  { path: '/login', element: <SignIn /> },
  { path: '/sign-up', element: <SignUp /> },
  { path: "/join/:id/:userId" ,element:<MeetingCheck /> },

  // { path: '/dashboard', element: <DashboardPage /> },
  { path: '/forgot-password', element: <ForgotPassword /> },
 { path: '/meetings/recordings', element: 
  <PrivateRoute>
    <RecordingsPage />
  </PrivateRoute>
},
 { path: '/setting', element: 
  <PrivateRoute>
    <Settings />
  </PrivateRoute>
},
{ path: '/dashboard/attendance', element: 
  <PrivateRoute>
    <AttendancePage />
  </PrivateRoute>
},
{ path: '/dashboard/chat-messages', element: 
  <PrivateRoute>
    <ChatPage />
  </PrivateRoute>
},
// { path: '/dashboard/session', element: <PrivateRoute><SessionPage /></PrivateRoute> },
{ path: '/admin/users', element: 
  <PrivateRoute>
    <User />
  </PrivateRoute>
},
{ path: '/admin/subs', element: 
  <PrivateRoute>
    <SubscriptionDashboard />
  </PrivateRoute>
},
{ path: '/meetings/new', element: 
  <PrivateRoute>
    <NewMeetingPage />
  </PrivateRoute>
},
{ path: '/meetings2/upcoming', element: 
  <PrivateRoute>
    <UpcomingMeetingPage />
  </PrivateRoute>
},
{ path: '/meetings/completed', element: 
  <PrivateRoute>
    <CompletedMeetingPage />
  </PrivateRoute>
},
{ path: '/meetings/details', element: 
  <PrivateRoute>
    <MeetingDetails />
  </PrivateRoute>
},
{ path: '/subscription/plan', element: 
  <PrivateRoute>
    <SubscripationPage />
  </PrivateRoute>
},
{ path: '/developers/documentation', element: 
  <PrivateRoute>
    <DeveloperDocumentationPage />
  </PrivateRoute>
},
{ path: '/developers/generate-key', element: 
  <PrivateRoute>
    <ApiGeneratePage />
  </PrivateRoute>
},
{ path: '/developers/integration-guide', element: 
  <PrivateRoute>
    <IntegrationGuidePage />
  </PrivateRoute>
},
{ path: '/payment-success', element: <PaymentSuccess /> },
  { path: '/screen-sharing', element: <ScreenSharing /> },
  { path: '/recordings-page', element: <RecordingsPage /> },
  { path: '/virtual-background', element: <VirtualBackground /> },
  { path: '/live-captions', element: <LiveCaptions /> },
  { path: '/breakout-rooms', element: <BreakOutRooms /> },
  { path: '/about-us', element: <AboutUs /> },
  { path: '/careers', element: <Careers /> },
  { path: '/privacy-policy', element: <PrivacyPolicy /> },
  { path: '/terms-of-service', element: <TermsOfServices /> },
  { path: '/contact', element: <ContactUs /> },
  { path: '/help-center', element: <HelpCenter /> },
  { path: '/community', element: <Community /> },
  { path: '/webinars', element: <Webinars /> },
  { path: '/tutorials', element: <Tutorials /> },
  { path: '/blogs', element: <Blogs /> },
  { path: '/free-plans', element: <FreePlans /> },
  { path: '/pro-plans', element: <ProPlans /> },
  { path: '/business-plans', element: <BusinessPlans /> },
  { path: '/book-demo', element: <BookDemo /> },
]);
