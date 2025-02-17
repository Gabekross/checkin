import React, { useState, useEffect } from 'react';
import { supabase } from '../supabase';
import { useNavigate } from 'react-router-dom';

const AdminCheckIn: React.FC = () => {
  const [events, setEvents] = useState<{ id: string; name: string }[]>([]);
  const [selectedEventId, setSelectedEventId] = useState<string>('');
  const [attendees, setAttendees] = useState<{ id: string; name: string; checked_in: boolean }[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filteredAttendee, setFilteredAttendee] = useState<{ id: string; name: string; checked_in: boolean } | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEvents = async () => {
      const { data, error } = await supabase.from('events').select('id, name');
      if (error) {
        console.error('Error fetching events:', error);
      } else {
        setEvents(data);
      }
    };
    fetchEvents();
  }, []);

  useEffect(() => {
    const fetchAttendees = async () => {
      if (!selectedEventId) return;
      const { data, error } = await supabase.from('attendees').select('id, name, checked_in').eq('event_id', selectedEventId);
      if (error) {
        console.error('Error fetching attendees:', error);
      } else {
        setAttendees(data);
      }
    };
    fetchAttendees();
  }, [selectedEventId]);

  const handleSearch = () => {
    const attendee = attendees.find(a => a.name.toLowerCase() === searchQuery.toLowerCase());
    setFilteredAttendee(attendee || null);
  };

  const checkInAttendee = async (attendeeId: string) => {
    const { error } = await supabase.from('attendees').update({ checked_in: true }).eq('id', attendeeId);
    if (error) {
      console.error('Error checking in attendee:', error);
      alert('Failed to check in attendee.');
    } else {
      setAttendees(attendees.map(a => a.id === attendeeId ? { ...a, checked_in: true } : a));
      setFilteredAttendee(prev => prev ? { ...prev, checked_in: true } : null);
      alert('Attendee checked in successfully!');
    }
  };

  return (
    <div>
      <h2>Admin Check-In Panel</h2>
      <div>
        <label>Select Event:</label>
        <select value={selectedEventId} onChange={(e) => setSelectedEventId(e.target.value)}>
          <option value="">-- Select an Event --</option>
          {events.map((event) => (
            <option key={event.id} value={event.id}>{event.name}</option>
          ))}
        </select>
      </div>
      <div>
        <input
          type="text"
          placeholder="Search Attendee by Name"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button onClick={handleSearch}>Search</button>
      </div>

      {filteredAttendee && (
        <div>
          <h3>Attendee Found</h3>
          <p>{filteredAttendee.name} - {filteredAttendee.checked_in ? '✔ Checked In' : '❌ Not Checked In'}</p>
          {!filteredAttendee.checked_in && <button onClick={() => checkInAttendee(filteredAttendee.id)}>Check In</button>}
        </div>
      )}

      <h3>Attendee List</h3>
      <ul>
        {attendees.map((attendee) => (
          <li key={attendee.id}>{attendee.name} - {attendee.checked_in ? '✔ Checked In' : '❌ Not Checked In'}</li>
        ))}
      </ul>

      <button onClick={() => navigate('/register-attendee')}>Go to Pre-Register Attendees</button>
    </div>
  );
};

export default AdminCheckIn;
