//  Check-In Page 
import React, { useEffect, useState } from 'react';
import { supabase } from '../supabase';
import { useParams } from 'react-router-dom';

const CheckIn: React.FC = () => {
  const { eventId } = useParams<{ eventId: string }>();
  const [attendees, setAttendees] = useState<any[]>([]);

  useEffect(() => {
    const fetchAttendees = async () => {
      const { data, error } = await supabase.from('attendees').select('*').eq('event_id', eventId);
      if (error) console.error(error);
      else setAttendees(data);
    };
    fetchAttendees();
  }, [eventId]);

  const handleCheckIn = async (attendeeId: string) => {
    await supabase.from('attendees').update({ checked_in: true }).eq('id', attendeeId);
    setAttendees(attendees.map(att => att.id === attendeeId ? { ...att, checked_in: true } : att));
  };

  return (
    <div>
      <h1>Check-In</h1>
      <ul>
        {attendees.map(attendee => (
          <li key={attendee.id}>
            {attendee.name} - {attendee.checked_in ? '✅ Checked In' : <button onClick={() => handleCheckIn(attendee.id)}>Check In</button>}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CheckIn;
