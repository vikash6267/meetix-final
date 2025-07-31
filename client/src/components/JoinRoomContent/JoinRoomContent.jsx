import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Input from '../Input/Input';
import ButtonsContainer from '../ButtonsContainer/ButtonsContainer';
import { getRoomExists } from '../../utils/api';
import { actions } from '../../features/room';
import './ScheduleMeetingForm.css';
import ScheduleMeetingForm from './ScheduleMeetingForm';

function JoinRoomContent() {
  const [roomId, setRoomId] = useState('');
  const [userName, setUserName] = useState('');
  const [error, setError] = useState('');
  const [showScheduleForm, setShowScheduleForm] = useState(false);
  const [scheduleData, setScheduleData] = useState({
    meetingName: '',
    date: '',
    time: '',
    description: '',
  });
  const { isRoomHost } = useSelector((state) => state.room);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleChangeName = (e) => {
    setUserName(e.target.value);
  };
  const handleChangeRoomId = (e) => {
    setRoomId(e.target.value);
  };

  const handleJoin = async () => {
    dispatch(actions.setUserName(userName));

    if (isRoomHost) {
      createRoom();
    } else {
      await joinRoom();
    }
  };

  const joinRoom = async () => {
    try {
      const response = await getRoomExists(roomId);
      const { isRoomExists, full } = response;

      if (isRoomExists) {
        if (full) {
          setError('Meeting is full, try later');
        } else {
          dispatch(actions.setRoomId(roomId));
          navigate('/room');
        }
      } else {
        setError('Meeting is not found');
      }
    } catch (error) {
      console.error(error);
    }
  };
  const createRoom = () => {
    navigate('/room');
  };

  const handleScheduleMeeting = () => {
    setShowScheduleForm(true);
  };

  const handleScheduleChange = (e) => {
    const { name, value } = e.target;
    setScheduleData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleScheduleSubmit = async (roomId) => {
    try {
      // You might want to navigate to the scheduled meeting room
      // or show a success message here
      console.log('Meeting scheduled with room ID:', roomId);

      // You can also redirect to the meeting room if needed:
      // navigate(`/room/${roomId}`);

      // Close the form after successful submission
      setShowScheduleForm(false);

      // Optionally reset any other state or show a success notification
    } catch (error) {
      // Handle any errors that might occur after form submission
      console.error('Error handling scheduled meeting:', error);
      setError('Failed to process scheduled meeting');
    }
  };

  return (
    <>
      <div className="join_room_inputs_container">
        {!isRoomHost && (
          <Input
            placeholder="Enter meeting id"
            value={roomId}
            handleChange={handleChangeRoomId}
            className="join_room_input"
          />
        )}
        <Input
          placeholder="Enter your name"
          handleChange={handleChangeName}
          value={userName}
          className="join_room_input"
        />
      </div>

      <div className="error_message_container">
        <p className="error_message_paragraph">{error}</p>
      </div>

      <ButtonsContainer handleJoin={handleJoin} />
    </>
  );
}

export default JoinRoomContent;
