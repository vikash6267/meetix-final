'use client';

import { useEffect, useState } from 'react';
import Sidebar from '../Layouts/SideNav';
import Header from '../Layouts/SidebarHeader';
import {
  addUpcomingMeeting,
  getUpcomingMeetings,
  updateUpcomingMeeting,
} from '../../services/operations/user';
import {
  Calendar,
  Clock,
  Plus,
  Video,
  X,
  Users,
  FileText,
  Edit2,
  Trash2,
  Mail,
  AlertCircle,
} from 'lucide-react';

const UpcomingMeetingPage = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [meetings, setMeetings] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [scheduleDate, setScheduleDate] = useState('');
  const [scheduleTime, setScheduleTime] = useState('');
  const [meetingName, setMeetingName] = useState('');
  const [shortSummary, setShortSummary] = useState('');
  const [participantInput, setParticipantInput] = useState('');
  const [participants, setParticipants] = useState([]);
  const [editMeetingId, setEditMeetingId] = useState(null);
  const [emailError, setEmailError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const user = JSON.parse(localStorage.getItem('user') || '{}');

  // Email validation function
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleAddParticipant = () => {
    const email = participantInput.trim().toLowerCase();
    setEmailError('');

    if (!email) {
      setEmailError('Please enter an email address');
      return;
    }

    if (!validateEmail(email)) {
      setEmailError('Please enter a valid email address');
      return;
    }

    if (participants.includes(email)) {
      setEmailError('This email is already added');
      return;
    }

    setParticipants([...participants, email]);
    setParticipantInput('');
  };

  const handleRemoveParticipant = (email) => {
    setParticipants(participants.filter((e) => e !== email));
  };

  const handleCreateOrUpdateMeeting = async () => {
    if (!meetingName.trim()) {
      alert('Please enter a meeting name');
      return;
    }

    if (!scheduleDate || !scheduleTime) {
      alert('Please select both date and time');
      return;
    }

    const selectedDateTime = new Date(`${scheduleDate}T${scheduleTime}`);
    const now = new Date();

    if (selectedDateTime <= now) {
      alert('Please select a future date and time');
      return;
    }

    setIsSubmitting(true);

    const meetingData = {
      meetingName: meetingName.trim(),
      roomId: editMeetingId
        ? meetings.find((m) => m._id === editMeetingId)?.roomId
        : `room_${Date.now()}`,
      scheduleDateTime: selectedDateTime.toISOString(),
      isJoined: false,
      joinedAt: null,
      shortSummary: shortSummary.trim(),
      participants,
      isCancelled: false,
    };

    const token = localStorage.getItem('token');

    try {
      if (editMeetingId) {
        const result = await updateUpcomingMeeting(
          user._id,
          editMeetingId,
          meetingData,
          token,
        );
        if (result) {
          setMeetings((prev) =>
            prev.map((m) =>
              m._id === editMeetingId ? { ...m, ...meetingData } : m,
            ),
          );
        }
      } else {
        const result = await addUpcomingMeeting(user._id, meetingData, token);
        if (result) {
          setMeetings((prev) => [
            ...prev,
            { ...meetingData, _id: result._id || Date.now().toString() },
          ]);
        }
      }
      resetModal();
    } catch (error) {
      console.error('Error saving meeting:', error);
      alert('Failed to save meeting. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditMeeting = (meeting) => {
    setEditMeetingId(meeting._id);
    setMeetingName(meeting.meetingName || '');
    setShortSummary(meeting.shortSummary || '');
    setParticipants(meeting.participants || []);

    const meetingDate = new Date(meeting.scheduleDateTime);
    setScheduleDate(meetingDate.toISOString().split('T')[0]);
    setScheduleTime(meetingDate.toTimeString().slice(0, 5));

    setIsModalOpen(true);
  };

  const handleCancelMeeting = async (meetingId) => {
    if (!confirm('Are you sure you want to cancel this meeting?')) return;

    const token = localStorage.getItem('token');
    const result = await updateUpcomingMeeting(
      user._id,
      meetingId,
      { isCancelled: true },
      token,
    );

    if (result) {
      setMeetings((prev) =>
        prev.map((m) =>
          m._id === meetingId ? { ...m, isCancelled: true } : m,
        ),
      );
    }
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const getCurrentDateTime = () => {
    const now = new Date();
    const date = now.toISOString().split('T')[0];
    const time = now.toTimeString().slice(0, 5);
    return { date, time };
  };

  const { date: currentDate, time: currentTime } = getCurrentDateTime();

  const getUpcomingMeetingsOnly = (meetingsData) => {
    const now = new Date();
    return meetingsData.filter(
      (meeting) => new Date(meeting.scheduleDateTime) > now,
    );
  };

  const formatDateTime = (dateTime) => {
    const date = new Date(dateTime);
    return {
      date: date.toLocaleDateString('en-IN', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        timeZone: 'Asia/Kolkata',
      }),
      time: date.toLocaleTimeString('en-IN', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
        timeZone: 'Asia/Kolkata',
      }),
    };
  };

  const resetModal = () => {
    setIsModalOpen(false);
    setScheduleDate('');
    setScheduleTime('');
    setMeetingName('');
    setShortSummary('');
    setParticipants([]);
    setParticipantInput('');
    setEditMeetingId(null);
    setEmailError('');
    setIsSubmitting(false);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleAddParticipant();
    }
  };

  useEffect(() => {
    const fetchMeetings = async () => {
      if (user && user._id) {
        try {
          const res = await getUpcomingMeetings(user._id);
          const upcomingOnly = getUpcomingMeetingsOnly(res || []);
          setMeetings(upcomingOnly);
        } catch (error) {
          console.error('Failed to fetch meetings:', error);
          setMeetings([]);
        } finally {
          setLoading(false);
        }
      }
    };
    fetchMeetings();
  }, []);

  if (loading) {
    return (
      <div className="flex h-screen bg-gray-100">
        <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header toggleSidebar={toggleSidebar} name="Upcoming Meetings" />
          <div className="flex-1 flex justify-center items-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-500"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Header toggleSidebar={toggleSidebar} name=" Meetings" />

        <div className="flex-1 overflow-auto p-6">
          <div className="mb-6 flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">
                Your  Meetings
              </h2>
              <p className="text-gray-600 mt-1">
                Manage and join your scheduled meetings
              </p>
            </div>
            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-teal-500 hover:bg-teal-600 text-white px-6 py-3 rounded-lg flex items-center gap-2 transition-colors duration-200 shadow-md hover:shadow-lg"
            >
              <Plus size={20} />
              Create Meeting
            </button>
          </div>

          {meetings.length === 0 ? (
            <div className="text-center py-16">
              <div className="bg-white rounded-xl shadow-sm p-12 max-w-md mx-auto">
                <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Calendar className="w-8 h-8 text-teal-500" />
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  No Upcoming Meetings
                </h3>
                <p className="text-gray-600 mb-6">
                  Schedule your first meeting to get started
                </p>
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="bg-teal-500 hover:bg-teal-600 text-white px-6 py-2 rounded-lg transition-colors duration-200"
                >
                  Create Meeting
                </button>
              </div>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {meetings.map((meeting) => {
                const { date, time } = formatDateTime(meeting.scheduleDateTime);
                const joinedTime = meeting.joinedAt
                  ? formatDateTime(meeting.joinedAt)
                  : null;

                return (
                  <div
                    key={meeting._id}
                    className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all duration-200 hover:border-teal-200"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-start gap-3 flex-1">
                        <div className="w-12 h-12 bg-gradient-to-br from-teal-400 to-teal-600 rounded-xl flex items-center justify-center flex-shrink-0">
                          <Video className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-gray-800 text-lg mb-1 truncate">
                            {meeting.meetingName || 'Untitled Meeting'}
                          </h3>
                          <p className="text-sm text-gray-500">
                            Room ID: {meeting.roomId?.slice(-8)}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        {meeting.isJoined && (
                          <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-medium">
                            Joined
                          </div>
                        )}
                        <button
                          onClick={() => handleEditMeeting(meeting)}
                          className="p-2 text-gray-400 hover:text-teal-600 hover:bg-teal-50 rounded-lg transition-colors"
                          title="Edit Meeting"
                        >
                          <Edit2 size={16} />
                        </button>
                      </div>
                    </div>

                    {/* Short Summary */}
                    {meeting.shortSummary && (
                      <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                        <p className="text-sm text-gray-700 leading-relaxed">
                          {meeting.shortSummary}
                        </p>
                      </div>
                    )}

                    <div className="space-y-3 mb-4">
                      <div className="flex items-center gap-3 text-gray-600">
                        <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                          <Calendar className="w-4 h-4" />
                        </div>
                        <span className="text-sm font-medium text-gray-800">
                          {date}
                        </span>
                      </div>

                      <div className="flex items-center gap-3 text-gray-600">
                        <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                          <Clock className="w-4 h-4" />
                        </div>
                        <span className="text-sm font-medium text-gray-800">
                          {time}
                        </span>
                      </div>

                      {meeting.participants &&
                        meeting.participants.length > 0 && (
                          <div className="flex items-start gap-3 text-gray-600">
                            <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                              <Users className="w-4 h-4" />
                            </div>
                            <div className="flex-1">
                              <p className="text-sm font-medium text-gray-800 mb-1">
                                Participants ({meeting.participants.length})
                              </p>
                              <div className="flex flex-wrap gap-1">
                                {meeting.participants
                                  .slice(0, 2)
                                  .map((email, index) => (
                                    <span
                                      key={index}
                                      className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded"
                                    >
                                      {email}
                                    </span>
                                  ))}
                                {meeting.participants.length > 2 && (
                                  <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                                    +{meeting.participants.length - 2} more
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        )}

                      {meeting.isJoined && joinedTime && (
                        <div className="flex items-center gap-3 text-green-600">
                          <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                            <Users className="w-4 h-4" />
                          </div>
                          <span className="text-sm font-medium">
                            Joined at {joinedTime.time}
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="pt-4 border-t border-gray-100 space-y-2">
                      {meeting.isCancelled ? (
                        <div className="text-center py-2">
                          <p className="text-sm text-red-500 font-medium">
                            Meeting has been cancelled
                          </p>
                        </div>
                      ) : meeting.isJoined ? (
                        <div className="text-center py-2">
                          <p className="text-sm text-green-600 font-medium flex items-center justify-center gap-2">
                            <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                            Meeting joined successfully
                          </p>
                        </div>
                      ) : (
                        <>
                          <a
                            href={`http://localhost:3010/join/?room=${meeting?.roomId}&id=${user?._id}`}
                            className="w-full bg-teal-500 hover:bg-teal-600 text-white py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2 font-medium"
                          >
                            <Video size={18} />
                            Join Meeting
                          </a>
                          <button
                            onClick={() => handleCancelMeeting(meeting._id)}
                            className="w-full text-red-600 hover:bg-red-50 py-2 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2 text-sm"
                          >
                            <Trash2 size={16} />
                            Cancel Meeting
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Create/Edit Meeting Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-lg w-full p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-xl font-semibold text-gray-800">
                  {editMeetingId ? 'Edit Meeting' : 'Schedule New Meeting'}
                </h3>
                <p className="text-sm text-gray-600 mt-1">
                  {editMeetingId
                    ? 'Update meeting details'
                    : 'Create a new meeting with custom details'}
                </p>
              </div>
              <button
                onClick={resetModal}
                className="text-gray-400 hover:text-gray-600 transition-colors p-1"
                disabled={isSubmitting}
              >
                <X size={24} />
              </button>
            </div>

            <div className="space-y-5">
              {/* Meeting Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Meeting Name <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={meetingName}
                    onChange={(e) => setMeetingName(e.target.value)}
                    placeholder="Enter meeting name (e.g., Team Standup, Client Review)"
                    className="w-full px-4 py-3 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-colors"
                    maxLength={100}
                    disabled={isSubmitting}
                  />
                  <FileText className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  {meetingName.length}/100 characters
                </p>
              </div>

              {/* Short Summary */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Short Summary
                </label>
                <textarea
                  value={shortSummary}
                  onChange={(e) => setShortSummary(e.target.value)}
                  placeholder="Enter a brief description of the meeting"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-colors resize-none"
                  rows={3}
                  maxLength={200}
                  disabled={isSubmitting}
                />
                <p className="text-xs text-gray-500 mt-1">
                  {shortSummary.length}/200 characters
                </p>
              </div>

              {/* Date Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Date <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="date"
                    value={scheduleDate}
                    onChange={(e) => setScheduleDate(e.target.value)}
                    min={currentDate}
                    className="w-full px-4 py-3 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-colors"
                    disabled={isSubmitting}
                  />
                  <Calendar className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                </div>
              </div>

              {/* Time Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Time <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="time"
                    value={scheduleTime}
                    onChange={(e) => setScheduleTime(e.target.value)}
                    min={scheduleDate === currentDate ? currentTime : undefined}
                    className="w-full px-4 py-3 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-colors"
                    disabled={isSubmitting}
                  />
                  <Clock className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                </div>
              </div>

              {/* Participants */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Participants
                </label>
                <div className="flex gap-2">
                  <div className="flex-1 relative">
                    <input
                      type="email"
                      value={participantInput}
                      onChange={(e) => {
                        setParticipantInput(e.target.value);
                        setEmailError('');
                      }}
                      onKeyPress={handleKeyPress}
                      placeholder="Enter email address"
                      className={`w-full px-4 py-3 pl-10 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-colors ${
                        emailError ? 'border-red-300' : 'border-gray-300'
                      }`}
                      disabled={isSubmitting}
                    />
                    <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                  </div>
                  <button
                    onClick={handleAddParticipant}
                    className="px-4 py-3 bg-teal-500 hover:bg-teal-600 text-white rounded-lg transition-colors disabled:bg-gray-300"
                    disabled={isSubmitting}
                  >
                    <Plus size={16} />
                  </button>
                </div>

                {emailError && (
                  <div className="flex items-center gap-2 mt-2 text-red-600 text-sm">
                    <AlertCircle size={16} />
                    {emailError}
                  </div>
                )}

                {participants.length > 0 && (
                  <div className="mt-3">
                    <p className="text-sm text-gray-600 mb-2">
                      Added participants:
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {participants.map((email) => (
                        <span
                          key={email}
                          className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm flex items-center gap-2"
                        >
                          {email}
                          <button
                            onClick={() => handleRemoveParticipant(email)}
                            className="text-blue-600 hover:text-red-600 transition-colors"
                            disabled={isSubmitting}
                          >
                            <X size={14} />
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex gap-3 mt-8">
              <button
                onClick={resetModal}
                className="flex-1 px-4 py-3 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors duration-200 font-medium"
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button
                onClick={handleCreateOrUpdateMeeting}
                disabled={
                  !meetingName.trim() ||
                  !scheduleDate ||
                  !scheduleTime ||
                  isSubmitting
                }
                className="flex-1 px-4 py-3 bg-teal-500 hover:bg-teal-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-lg transition-colors duration-200 font-medium flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    {editMeetingId ? 'Updating...' : 'Creating...'}
                  </>
                ) : editMeetingId ? (
                  'Update Meeting'
                ) : (
                  'Schedule Meeting'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UpcomingMeetingPage;
