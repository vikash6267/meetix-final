// components/ScheduleMeetingForm.js
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { actions } from '../../features/room';
import { scheduleMeeting } from '../../utils/api';
import { FiCalendar, FiClock, FiUser, FiX, FiCheck } from 'react-icons/fi';

function ScheduleMeetingForm({ onCancel, onCreate }) {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    title: '',
    date: '',
    time: '',
    description: '',
    participants: '',
  });
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await scheduleMeeting(formData);
      dispatch(actions.setScheduleData(response));
      onCreate(response.roomId);
    } catch (err) {
      setError('Failed to schedule meeting');
      console.error(err);
    }
  };

  return (
    <div className="modern-schedule-form">
      <div className="form-header">
        <h2>Schedule New Meeting</h2>
        <button onClick={onCancel} className="close-btn">
          <FiX size={20} />
        </button>
      </div>

      {error && (
        <div className="error-message">
          <p>{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="form-group floating">
          <input
            type="text"
            name="title"
            id="title"
            value={formData.title}
            onChange={handleChange}
            required
            placeholder=" "
          />
          <label htmlFor="title">Meeting Title</label>
        </div>

        <div className="form-row">
          <div className="form-group floating icon-input">
            <FiCalendar className="input-icon" />
            <input
              type="date"
              name="date"
              id="date"
              value={formData.date}
              onChange={handleChange}
              required
              placeholder=" "
            />
            <label htmlFor="date">Date</label>
          </div>

          <div className="form-group floating icon-input">
            <FiClock className="input-icon" />
            <input
              type="time"
              name="time"
              id="time"
              value={formData.time}
              onChange={handleChange}
              required
              placeholder=" "
            />
            <label htmlFor="time">Time</label>
          </div>
        </div>

        <div className="form-group floating icon-input">
          <FiUser className="input-icon" />
          <input
            type="text"
            name="participants"
            id="participants"
            value={formData.participants}
            onChange={handleChange}
            placeholder=" "
          />
          <label htmlFor="participants">
            Participants (emails, comma separated)
          </label>
        </div>

        <div className="form-group floating">
          <textarea
            name="description"
            id="description"
            value={formData.description}
            onChange={handleChange}
            placeholder=" "
            rows="3"
          />
          <label htmlFor="description">Description (Optional)</label>
        </div>

        <div className="form-actions">
          <button type="submit" className="submit-btn" disabled={isSubmitting}>
            <FiCheck className="btn-icon" />
            {isSubmitting ? 'Scheduling...' : 'Schedule Meeting'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default ScheduleMeetingForm;
