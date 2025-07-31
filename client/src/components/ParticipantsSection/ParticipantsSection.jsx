// import React from 'react';
// import Participants from '../Participants/Participants';
// import DirectChat from '../DirectChat/DirectChat';
// import { FaTimes } from 'react-icons/fa'; // Importing the X button icon

// function ParticipantsSection({ closeSection }) {
//   return (
//     <div className="participants_section_container flex flex-col w-full h-full">
//       {/* Close button */}
//       <div className="absolute top-4 right-4">
//         <button
//           onClick={closeSection}
//           className="text-red-500 hover:text-red-700 font-bold"
//         >
//           <FaTimes size={20} />
//         </button>
//       </div>

//       {/* Label for the participants section */}
//       <div className="participants_label_container mb-4">
//         <p className="participants_label_paragraph pt-4">PARTICIPANTS</p>
//       </div>

//       {/* Scrollable container for both Participants and DirectChat */}
//       <div className="flex flex-col h-full">
//         {/* Participants section should take up available space and be scrollable */}
//         <div className="flex-grow overflow-y-auto h-[36vh]">
//           <Participants />
//         </div>

//         {/* DirectChat section at the bottom, sticky with overflow-y-auto */}
//         <div className="h-[40vh] overflow-y-auto flex-shrink-0">
//           <DirectChat />
//         </div>
//       </div>
//     </div>
//   );
// }

// export default ParticipantsSection;

import React from 'react';
import { FaTimes, FaSearch } from 'react-icons/fa';
import Participants from '../Participants/Participants';
import DirectChat from '../DirectChat/DirectChat';

const ParticipantsSection = ({
  participantCount,
  toggleParticipants,
  closeSection,
}) => {
  return (
    <div className="participants_section_container flex flex-col w-full h-full rounded-lg shadow-lg">
      {/* Close button */}
      <div className="absolute top-4 right-4">
        <button
          onClick={closeSection}
          className="text-red-500 hover:text-red-700 font-bold"
        >
          <FaTimes size={20} />
        </button>
      </div>

      {/* Label for the participants section */}
      <div className="participants_label_container mb-4">
        <p className="participants_label_paragraph pt-4">PARTICIPANTS</p>
      </div>

      {/* Participants List */}
      <div className="overflow-y-auto flex-1">
        <div className="p-4">
          {/* Participant list */}
          <div className="flex-grow overflow-y-auto max-h-[calc(100%-160px)] md:h-auto">
            <Participants />
          </div>

          {/* Direct Chat section */}
          <div className="h-[30vh] md:h-auto overflow-y-auto flex-shrink-0 mt-2">
            {/* Direct chat component can be added here if required */}
            <DirectChat />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ParticipantsSection;
