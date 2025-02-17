// Step 5: Self Check-In Page (frontend/src/pages/SelfCheckIn.tsx)
import React, { useState, useEffect } from 'react';
import { supabase } from '../supabase';
import { useParams } from 'react-router-dom';
import QRScanner from '../components/QRScanner';
import { fetchEventById } from '../api/events';

const SelfCheckIn: React.FC = () => {
  const { eventId } = useParams<{ eventId: string }>();
  const [event, setEvent] = useState<any>(null);
  const [name, setName] = useState('');
  const [checkedIn, setCheckedIn] = useState(false);

  useEffect(() => {
    const loadEvent = async () => {
      try {
        const eventData = await fetchEventById(eventId!);
        setEvent(eventData);
      } catch (error) {
        console.error("Error fetching event:", error);
      }
    };
    loadEvent();
  }, [eventId]);

  const handleCheckIn = async (attendeeName: string) => {
    console.log("Checking in attendee:", attendeeName);
    const { data, error } = await supabase
      .from('attendees')
      .update({ checked_in: true })
      .eq('event_id', eventId)
      .eq('name', attendeeName)
      .select();
    
    if (error || !data || data.length === 0) {
      alert('Attendee not found. Please check with event staff.');
    } else {
      setCheckedIn(true);
    }
  };

  return (
    <div className={`self-check-in ${checkedIn ? 'checked-in' : ''}`} style={checkedIn ? { backgroundColor: 'green', color: 'white' } : {}} >
      {event && (
        <div>
          <h2>{event.name}</h2>
          <p>{event.date} - {event.location}</p>
        </div>
      )}
      {!checkedIn ? (
        <>
          <h2>Scan QR Code or Enter Your Name</h2>
          <QRScanner onScanSuccess={handleCheckIn} />
          <form
            onSubmit={(e) => {
              e.preventDefault();
              console.log("Searching for attendee:", name);
              handleCheckIn(name);
            }}>
            <input
              type="text"
              placeholder="Enter Your Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            <button type="submit">Done</button>
          </form>
        </>
      ) : (
        <div className="confirmation">
          <h2>Checked In</h2>
        </div>
      )}
    </div>
  );
};

export default SelfCheckIn;
