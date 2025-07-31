import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import { actions } from '../../features/room';
import JoinRoomContent from '../../components/JoinRoomContent/JoinRoomContent';
import './JoinRoomPage.css';

function JoinRoomPage() {
  const [searchParams] = useSearchParams();
  const isRoomHost = searchParams.get('host');
  const dispatch = useDispatch();

  useEffect(() => {
    if (isRoomHost) {
      dispatch(actions.setIsRoomHost(!!isRoomHost));
    }
  }, []);

  return (
    <div className="join_room_page_container">
      <div className="join_room_page_panel">
        <p className="join_room_title">
          {isRoomHost ? 'Host meeting' : 'Join meeting'}
        </p>

        <JoinRoomContent />
      </div>
    </div>
  );
}

export default JoinRoomPage;