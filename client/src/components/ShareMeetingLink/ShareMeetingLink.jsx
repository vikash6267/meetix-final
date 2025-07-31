import React, { useState } from 'react';
import { useSelector } from 'react-redux';

function ShareMeeting() {
  const [emails, setEmails] = useState('');
  const [message, setMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const { roomId } = useSelector((state) => state.room);

  const handleShareMeeting = async () => {
    if (!emails) {
      setMessage('Please enter at least one email');
      return;
    }
  
    // Convert comma-separated string to array of emails
    const emailList = emails.split(',')
      .map(email => email.trim())
      .filter(email => email.length > 0);
  
    try {
      setIsSending(true);
      setMessage('');
  
      const response = await fetch('https://webinar-backend-sa37.onrender.com/api/v1/emails/send-invites', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          meetLink: roomId,
          emails: emailList, // Send as array
          senderName: 'Host' // Correct field name
        })
      });
  
      const data = await response.json();
  
      if (!response.ok) {
        throw new Error(data.message || 'Failed to send invites');
      }
  
      setMessage(`Invites sent successfully to ${emailList.length} recipient(s)`);
    } catch (error) {
      console.error('Error sharing meeting:', error);
      setMessage(error.message || 'Failed to share meeting');
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="mt-5 p-4 bg-[#2f3034] rounded-lg shadow-lg border border-[#3c4043]">
      <h3 className="text-lg font-medium text-white mb-3">Share Meeting</h3>
      <div className="flex flex-col sm:flex-row gap-3 mb-3">
        <input
          type="text"
          placeholder="Enter email addresses"
          value={emails}
          onChange={(e) => setEmails(e.target.value)}
          className="text-white flex-1 px-4 py-2 bg-[#3c4043] border border-[#5f6368] rounded-lg focus:outline-none focus:border-[#8ab4f8] focus:ring-1 focus:ring-[#8ab4f8] placeholder-[#9aa0a6]"
        />
        <button
          onClick={handleShareMeeting}
          disabled={isSending}
          className={`px-5 py-2.5 rounded-lg text-white font-medium transition-all ${
            isSending
              ? 'bg-[#5f6368] cursor-not-allowed'
              : 'bg-[#8ab4f8] hover:bg-[#aecbfa] text-[#202124]'
          }`}
        >
          {isSending ? (
            <span className="flex items-center justify-center gap-2">
              <svg
                className="animate-spin h-4 w-4 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Sending...
            </span>
          ) : (
            'Send Invites'
          )}
        </button>
      </div>

      {message && (
        <div
          className={`p-3 rounded-md text-sm font-medium ${
            message.includes('successfully')
              ? 'bg-[#e6f4ea] text-[#137333]'
              : 'bg-[#fce8e6] text-[#d93025]'
          }`}
        >
          {message}
        </div>
      )}
    </div>
  );
}

export default ShareMeeting;