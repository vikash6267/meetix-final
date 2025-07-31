import React from 'react';
import Messages from '../Messages/Messages';
import NewMessage from '../NewMessage/NewMessage';

function ChatSection({ closeChat }) {
  return (
    <div className="w-full h-full max-w-md p-4 bg-white shadow-lg rounded-xl flex flex-col justify-between">
      {/* Chat Header with Close Button */}
      <div className="flex items-center justify-between mb-4">
        <p className="text-lg font-semibold text-gray-700">Chat</p>
        <button
          className="text-red-500 hover:text-red-700 font-bold"
          onClick={closeChat}
        >
          X
        </button>
      </div>

      {/* Messages and New Message Input */}
      <div className="flex flex-col gap-4 flex-grow overflow-auto h-[72vh]">
        <Messages />
        <NewMessage />
      </div>
    </div>
  );
}

export default ChatSection;

// import React from 'react';
// import { FaTimes, FaThumbtack } from 'react-icons/fa';

// const ChatSection = ({
//   messages,
//   newMessage,
//   setNewMessage,
//   handleSendMessage,
//   togglePinMessage,
//   toggleChat,
// }) => {
//   return (
//     <div
//       className={`absolute md:relative right-0 top-0 h-full w-full md:w-96 bg-[#2f3034] text-[#e8eaed] shadow-lg flex flex-col border-l border-[#414141]`}
//     >
//       <div className="p-4 border-b border-[#414141]">
//         <div className="flex justify-between items-center">
//           <h2 className="text-lg font-medium">In-call messages</h2>
//           <button
//             onClick={toggleChat}
//             className="text-[#9aa0a6] hover:text-white"
//           >
//             <FaTimes />
//           </button>
//         </div>
//         <p className="text-sm text-[#9aa0a6] mt-1">
//           Let everyone send messages! You can pin messages to make them visible
//           for people who join later.
//         </p>
//       </div>

//       {/* Pinned Messages */}
//       <div className="p-4 bg-[#3c4043] border-b border-[#414141]">
//         {messages
//           .filter((m) => m.pinned)
//           .map((msg) => (
//             <div key={`pinned-${msg.id}`} className="mb-3">
//               <div className="flex justify-between items-start">
//                 <div>
//                   <p className="font-medium">{msg.text}</p>
//                   <span className="text-xs text-[#9aa0a6]">
//                     {msg.time} | {msg.sender}
//                   </span>
//                 </div>
//                 <button
//                   onClick={() => togglePinMessage(msg.id)}
//                   className="text-[#9aa0a6] hover:text-[#fbbc04]"
//                 >
//                   <FaThumbtack className="text-[#fbbc04]" />
//                 </button>
//               </div>
//             </div>
//           ))}
//       </div>

//       {/* Messages List */}
//       <div className="flex-1 overflow-y-auto p-4">
//         <div className="space-y-4">
//           {messages
//             .filter((m) => !m.pinned)
//             .map((msg) => (
//               <div key={msg.id} className="mb-4">
//                 <div className="flex justify-between items-start">
//                   <div>
//                     <p>{msg.text}</p>
//                     <span className="text-xs text-[#9aa0a6]">
//                       {msg.time} | {msg.sender}
//                     </span>
//                   </div>
//                   <button
//                     onClick={() => togglePinMessage(msg.id)}
//                     className="text-[#9aa0a6] hover:text-white"
//                   >
//                     <FaThumbtack />
//                   </button>
//                 </div>
//               </div>
//             ))}
//         </div>
//       </div>

//       {/* Message Input */}
//       <div className="p-4 border-t border-[#414141]">
//         <form onSubmit={handleSendMessage} className="flex">
//           <input
//             type="text"
//             value={newMessage}
//             onChange={(e) => setNewMessage(e.target.value)}
//             placeholder="Send a message"
//             className="flex-1 bg-[#3c4043] text-[#e8eaed] border border-[#5f6368] rounded-l px-3 py-2 focus:outline-none focus:border-[#8ab4f8] focus:ring-1 focus:ring-[#8ab4f8]"
//           />
//           <button
//             type="submit"
//             className="bg-[#8ab4f8] text-[#202124] px-4 py-2 rounded-r hover:bg-[#aecbfa] focus:outline-none focus:ring-1 focus:ring-[#8ab4f8]"
//           >
//             Send
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default ChatSection;
