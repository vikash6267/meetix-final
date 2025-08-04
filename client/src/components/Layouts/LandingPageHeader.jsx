import React, { useRef, useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import {
    VideoCameraIcon, ChevronDownIcon, Bars3Icon,
    XMarkIcon
} from "@heroicons/react/24/solid";
import { Link, useNavigate } from "react-router-dom";
import { actions } from "../../features/room";
import * as socketConnection from "../../socket/socket";
import ConnectButton from "../../components/ConnectButton/ConnectButton";
import io from 'socket.io-client';

const LandingPageHeader = () => {
    const socket = io('https://meetix.mahitechnocrafts.in', {
        transports: ['websocket'],
        secure: true,
        rejectUnauthorized: false,
    });
    console.log(socket);

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [isMeetDropdownOpen, setIsMeetDropdownOpen] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);

      const storedUser = localStorage.getItem("user")
  const user = storedUser ? JSON.parse(storedUser) : null

    useEffect(() => {
        dispatch(actions.setIsRoomHost(false));
        // socketConnection.connetWithSocket();


        if (localStorage.getItem('authToken')) {
            setIsLoggedIn(true);
        }
    }, [dispatch]);



    const handleLogout = () => {
        // Clear all localStorage items
        localStorage.clear();
        setIsLoggedIn(false);
        // Redirect to login page
        navigate('/login');
    };

    const handleMeetingAction = () => {
        if (!isLoggedIn) {
            alert("You must log in to create or join a meeting.");
            navigate("/login");  // Redirect to login page
            return;
        }
        window.location.href = `https://meetix.mahitechnocrafts.in?id=${user?._id}`;  // Redirect to meeting URL
    };

    // const handleJoinRoom = () => {
    //     const token = localStorage.getItem('authToken');
    //     // console.log("Room Id: ", room_id);

    //     const joinPayload = {
    //         room_id: '14090WarmSnake',
    //         peer_info: {
    //             peer_name: 'TEST NAME',
    //             peer_id: 'frontend-id',
    //             peer_token: token,
    //         },
    //     };



    //     try {

    //         socket.emit('join', joinPayload, (response) => {
    //             console.log('Join response:', response);

    //             // alert(response);
    //             if (response === 'unauthorized') {
    //                 alert('You are not authorized to join this room.');
    //             } else if (response === 'isBanned') {
    //                 alert('You are banned from this room.');
    //             } else if (response === 'isLocked') {
    //                 alert('Room is locked.');
    //             } else if (response === 'isLobby') {
    //                 alert('Waiting in lobby...');
    //             } else if (response?.id) {
    //                 console.log('Successfully joined room:', response.id);
    //                 // Redirect here
    //             } else {
    //                 console.error('Unexpected join response:', response);
    //             }
    //         });
    //     } catch (error) {
    //         console.error('Error joining room:', error);
    //         alert('An error occurred while trying to join the room.');

    //     }


    // };

    return (
        <header className="flex justify-between items-center px-6 py-4 border-b border-gray-200 relative">
            <div className="flex items-center">
                <img src="/src/assets/meetix-logo.png" alt="" className="h-10 w-15"/>
                <span className="ml-2 text-xl font-semibold tracking-tight text-white">Meetix</span>
            </div>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center space-x-4">
                <div className="relative">
                   {storedUser && <button
                        onClick={() => setIsMeetDropdownOpen(!isMeetDropdownOpen)}
                        className="flex items-center text-white hover:text-blue-600 font-medium"
                    >
                        Meet
                        <ChevronDownIcon className="h-4 w-4 ml-1" />
                    </button>}
                    {isMeetDropdownOpen && (
                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10 border border-gray-200">
                            <div>
                                {/* <ConnectButton > */}
                                <button onClick={handleMeetingAction} className="w-full text-black font-medium mb-2 text-center">
                                    Create Meeting
                                </button>
                                {/* <button onClick={handleJoinButton} className="w-full text-black px-4 py-2 font-medium mb-2 text-center">
                                    Create Meeting
                                </button> */}
                                {/* </ConnectButton> */}
                            </div>
                            <div className="px-4 py-2 border-t border-gray-200">
                                {/* <ConnectButton
                                    isJoinBtn
                                    className="w-full bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md font-medium"
                                > */}
                                {/* <button onClick={handleMeetingAction} className="w-full text-black px-4 py-2 font-medium mb-2 text-center">
                                    Join Meeting
                                    </button> */}
                                {/* <button onClick={handleMeetingAction} className="w-full text-black px-4 py-2 font-medium mb-2 text-center">
                                    Join Meeting
                                </button> */}
                                {/* </ConnectButton> */}
                            </div>
                        </div>
                    )}
                </div>
                {isLoggedIn ? (
                    <button
                        onClick={handleLogout}
                        className="text-white hover:text-purple-500 bg-purple-600 px-4 py-2 rounded-2xl font-semibold tracking-tight"
                    >
                        Log Out
                    </button>
                ) : (
                    <Link to={'/login'} className="text-white hover:text-purple-500 bg-purple-600 px-4 py-2 rounded-2xl font-semibold tracking-tight">
                        Sign In
                    </Link>
                )}
                {isLoggedIn && (
                    <Link
                        to={'/meetings/details'}
                        className="bg-purple-600 hover:bg-purple-400 text-white px-4 py-2 rounded-3xl font-semibold tracking-tight"
                    >
                        Go to Dashboard
                    </Link>
                )}
            </nav>

            {/* Mobile Hamburger */}
            <button
                className="md:hidden text-white hover:text-blue-600"
                onClick={() => setIsSidebarOpen(true)}
            >
                <Bars3Icon className="h-6 w-6" />
            </button>

            {/* Mobile Sidebar */}
            {isSidebarOpen && (
                <div className="fixed top-0 right-0 max-w-[70%] h-full bg-white shadow-lg z-50 p-6 flex flex-col">
                    <button
                        className="self-end text-white hover:text-red-600 mb-4"
                        onClick={() => setIsSidebarOpen(false)}
                    >
                        <XMarkIcon className="h-6 w-6" />
                    </button>
                    {/* <ConnectButton className="mb-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium"> */}
                    <button onClick={handleMeetingAction} className="w-full text-black font-medium mb-2 text-center">
                        Create Meeting
                    </button>
                    {/* </ConnectButton> */}
                    {/* <ConnectButton
                        isJoinBtn
                        className="mb-4 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md font-medium"
                    > */}
                    <button onClick={handleMeetingAction} className="w-full text-black font-medium mb-2 text-center">
                        Join Meeting
                    </button>
                    {/* </ConnectButton> */}
                    {isLoggedIn ? (
                        <button
                            onClick={handleLogout}
                            className="text-white hover:text-blue-600 font-medium mb-4"
                        >
                            Log Out
                        </button>
                    ) : (
                        <Link
                            to='/login'
                            className="text-white hover:text-blue-600 font-medium mb-4 text-center"
                        >
                            Sign In
                        </Link>
                    )}
                    {isLoggedIn && (
                        <Link
                            to={'/meetings/details'}
                            className="bg-purple-600 text-white px-4 py-2 rounded-md font-medium text-center"
                        >
                            Go to Dashboard
                        </Link>
                    )}
                </div>
            )}
        </header>
    )
}

export default LandingPageHeader