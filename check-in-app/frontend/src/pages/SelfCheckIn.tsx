// // Step 5: Self Check-In Page (frontend/src/pages/SelfCheckIn.tsx)
// import React, { useState, useEffect } from 'react';
// import { supabase } from '../supabase';
// import { useParams } from 'react-router-dom';
// import QRScanner from '../components/QRScanner';
// import { fetchEventById } from '../api/events';

// const SelfCheckIn: React.FC = () => {
//   const { eventId } = useParams<{ eventId: string }>();
//   const [event, setEvent] = useState<any>(null);
//   const [name, setName] = useState('');
//   const [checkedIn, setCheckedIn] = useState(false);

//   useEffect(() => {
//     const loadEvent = async () => {
//       try {
//         const eventData = await fetchEventById(eventId!);
//         setEvent(eventData);
//       } catch (error) {
//         console.error("Error fetching event:", error);
//       }
//     };
//     loadEvent();
//   }, [eventId]);

//   const handleCheckIn = async (attendeeName: string) => {
//     console.log("Checking in attendee:", attendeeName);
//     const { data, error } = await supabase
//       .from('attendees')
//       .update({ checked_in: true })
//       .eq('event_id', eventId)
//       .eq('name', attendeeName)
//       .select();
    
//     if (error || !data || data.length === 0) {
//       alert('Attendee not found. Please check with event staff.');
//     } else {
//       setCheckedIn(true);
//     }
//   };

//   return (
//     <div className={`self-check-in ${checkedIn ? 'checked-in' : ''}`} style={checkedIn ? { backgroundColor: 'green', color: 'white' } : {}} >
//       {event && (
//         <div>
//           <h2>{event.name}</h2>
//           <p>{event.date} - {event.location}</p>
//         </div>
//       )}
//       {!checkedIn ? (
//         <>
//           <h2>Scan QR Code or Enter Your Name</h2>
//           <QRScanner onScanSuccess={handleCheckIn} />
//           <form
//             onSubmit={(e) => {
//               e.preventDefault();
//               console.log("Searching for attendee:", name);
//               handleCheckIn(name);
//             }}>
//             <input
//               type="text"
//               placeholder="Enter Your Full Name"
//               value={name}
//               onChange={(e) => setName(e.target.value)}
//               required
//             />
//             <button type="submit">Done</button>
//           </form>
//         </>
//       ) : (
//         <div className="confirmation">
//           <h2>Checked In</h2>
//         </div>
//       )}
//     </div>
//   );
// };

// export default SelfCheckIn;

import React, { useState, useEffect } from 'react';
import { supabase } from '../supabase';
import { useNavigate, useParams } from 'react-router-dom';
import QRScanner from '../components/QRScanner';
import { fetchEventById } from '../api/events';

const SelfCheckIn: React.FC = () => {
  const { eventId } = useParams<{ eventId: string }>();
  const [event, setEvent] = useState<any>(null);
  const [attendees, setAttendees] = useState<{ id: string; name: string; email: string; checked_in: boolean }[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filteredAttendee, setFilteredAttendee] = useState<{ id: string; name: string; email: string; checked_in: boolean } | null>(null);
  const [newAttendee, setNewAttendee] = useState<{ name: string; email: string }>({ name: '', email: '' });
  const [checkedIn, setCheckedIn] = useState<boolean>(false);
  const navigate = useNavigate();

  useEffect(() => {
    const loadEvent = async () => {
      if (eventId) {
        try {
          const eventData = await fetchEventById(eventId);
          setEvent(eventData);
          const { data, error } = await supabase.from('attendees').select('id, name, email, checked_in').eq('event_id', eventId);
          if (error) {
            console.error('Error fetching attendees:', error);
          } else {
            setAttendees(data);
          }
        } catch (error) {
          console.error("Error fetching event:", error);
        }
      }
    };
    loadEvent();
  }, [eventId]);

  const handleSearch = () => {
    const attendee = attendees.find(a => a.name.toLowerCase() === searchQuery.toLowerCase());
    setFilteredAttendee(attendee || null);
  };

  const handleRegister = async () => {
    if (!newAttendee.name || !newAttendee.email) {
      alert('Please provide both name and email.');
      return;
    }

    const { data, error } = await supabase.from('attendees').insert({
      event_id: eventId,
      name: newAttendee.name,
      email: newAttendee.email,
      checked_in: false
    }).select('*').single();

    if (error) {
      console.error('Error registering attendee:', error);
      alert('Failed to register attendee.');
    } else {
      setAttendees([...attendees, data]);
      setFilteredAttendee(data);
      alert('Registration successful! You can now check in.');
    }
  };

  const checkInAttendee = async (attendeeId: string) => {
    const { error } = await supabase.from('attendees').update({ checked_in: true }).eq('id', attendeeId);
    if (error) {
      console.error('Error checking in attendee:', error);
      alert('Failed to check in attendee.');
    } else {
      setCheckedIn(true);
      setFilteredAttendee(prev => prev ? { ...prev, checked_in: true } : null);
      alert('Check-in successful!');
    }
  };

  return (
    <div className={`self-check-in ${checkedIn ? 'checked-in' : ''}`} style={checkedIn ? { backgroundColor: 'green', color: 'white' } : {}}>
      {event && (
        <div>
          <h2>{event.name}</h2>
          <p>{event.date} - {event.location}</p>
        </div>
      )}
      {!checkedIn ? (
        <>
          <h2>Scan QR Code or Enter Your Name</h2>
          <QRScanner onScanSuccess={(scannedEventId) => navigate(`/self-check-in/${scannedEventId}`)} />
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

          {!filteredAttendee && (
            <div>
              <h3>Not Registered? Register Here</h3>
              <input
                type="text"
                placeholder="Enter Your Name"
                value={newAttendee.name}
                onChange={(e) => setNewAttendee({ ...newAttendee, name: e.target.value })}
              />
              <input
                type="email"
                placeholder="Enter Your Email"
                value={newAttendee.email}
                onChange={(e) => setNewAttendee({ ...newAttendee, email: e.target.value })}
              />
              <button onClick={handleRegister}>Register</button>
            </div>
          )}
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
