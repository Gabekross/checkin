// // // Attendee Registration Form
// // import React, { useState } from 'react';
// // import { supabase } from '../supabase';
// // import { useNavigate, useParams } from 'react-router-dom';

// // const RegisterAttendee: React.FC = () => {
// //   const { eventId } = useParams<{ eventId: string }>();
// //   const [name, setName] = useState('');
// //   const [email, setEmail] = useState('');
// //   const [phone, setPhone] = useState('');
// //   const navigate = useNavigate();

// //   const handleRegisterAttendee = async (e: React.FormEvent) => {
// //     e.preventDefault();
// //     const { data, error } = await supabase.from('attendees').insert([{ event_id: eventId, name, email, phone }]);
// //     if (error) return alert(error.message);
// //     navigate(`/event/${eventId}`);
// //   };

// //   return (
// //     <form onSubmit={handleRegisterAttendee}>
// //       <input type="text" placeholder="Full Name" value={name} onChange={e => setName(e.target.value)} required />
// //       <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
// //       <input type="tel" placeholder="Phone" value={phone} onChange={e => setPhone(e.target.value)} />
// //       <button type="submit">Register Attendee</button>
// //     </form>
// //   );
// // };

// // export default RegisterAttendee;


// import React, { useState, useEffect } from 'react';
// import { supabase } from '../supabase';
// import { useNavigate } from 'react-router-dom';
// import Papa from 'papaparse';

// const RegisterAttendee: React.FC = () => {
//   const [attendees, setAttendees] = useState<{ name: string; email: string }[]>([]);
//   const [newAttendee, setNewAttendee] = useState({ name: '', email: '' });
//   const [csvFile, setCsvFile] = useState<File | null>(null);
//   const [events, setEvents] = useState<{ id: string; name: string }[]>([]);
//   const [selectedEventId, setSelectedEventId] = useState<string>('');
//   const navigate = useNavigate();

//   useEffect(() => {
//     const fetchEvents = async () => {
//       const { data, error } = await supabase.from('events').select('id, name');
//       if (error) {
//         console.error('Error fetching events:', error);
//       } else {
//         setEvents(data);
//       }
//     };
//     fetchEvents();
//   }, []);

//   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     setNewAttendee({ ...newAttendee, [e.target.name]: e.target.value });
//   };

//   const addAttendeeManually = () => {
//     if (newAttendee.name && newAttendee.email) {
//       setAttendees([...attendees, newAttendee]);
//       setNewAttendee({ name: '', email: '' });
//     }
//   };

//   const handleCsvUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
//     if (e.target.files && e.target.files[0]) {
//       setCsvFile(e.target.files[0]);
//       Papa.parse(e.target.files[0], {
//         header: true,
//         skipEmptyLines: true,
//         complete: (result) => {
//           const parsedAttendees = result.data as { name: string; email: string }[];
//           setAttendees([...attendees, ...parsedAttendees]);
//         },
//       });
//     }
//   };

//   const submitAttendees = async () => {
//     if (!selectedEventId) {
//       alert('Please select an event before submitting attendees.');
//       return;
//     }

//     if (attendees.length === 0) {
//       alert('No attendees to submit.');
//       return;
//     }

//     const { error } = await supabase.from('attendees').insert(
//       attendees.map((attendee) => ({
//         event_id: selectedEventId,
//         name: attendee.name,
//         email: attendee.email,
//         checked_in: false,
//       }))
//     );

//     if (error) {
//       console.error('Error adding attendees:', error);
//       alert('Failed to add attendees.');
//     } else {
//       alert('Attendees added successfully!');
//       setAttendees([]);
//       navigate('/admin-check-in'); // Redirect back to Admin Check-In page
//     }
//   };

//   return (
//     <div>
//       <h2>Pre-Register Attendees</h2>
//       <div>
//         <label>Select Event:</label>
//         <select value={selectedEventId} onChange={(e) => setSelectedEventId(e.target.value)}>
//           <option value="">-- Select an Event --</option>
//           {events.map((event) => (
//             <option key={event.id} value={event.id}>{event.name}</option>
//           ))}
//         </select>
//       </div>
//       <div>
//         <input
//           type="text"
//           name="name"
//           placeholder="Attendee Name"
//           value={newAttendee.name}
//           onChange={handleInputChange}
//         />
//         <input
//           type="email"
//           name="email"
//           placeholder="Attendee Email"
//           value={newAttendee.email}
//           onChange={handleInputChange}
//         />
//         <button onClick={addAttendeeManually}>Add Attendee</button>
//       </div>

//       <div>
//         <h3>Or Upload CSV</h3>
//         <input type="file" accept=".csv" onChange={handleCsvUpload} />
//       </div>

//       <h3>Attendees to be Registered</h3>
//       <ul>
//         {attendees.map((attendee, index) => (
//           <li key={index}>{attendee.name} - {attendee.email}</li>
//         ))}
//       </ul>

//       <button onClick={submitAttendees}>Submit Attendees</button>
//     </div>
//   );
// };

// export default RegisterAttendee;

import React, { useState, useEffect } from 'react';
import { supabase } from '../supabase';
import { useNavigate } from 'react-router-dom';
import Papa from 'papaparse';
import styles from '../styles/RegisterAttendee.module.scss';

const RegisterAttendee: React.FC = () => {
  const [attendees, setAttendees] = useState<{ name: string; email: string }[]>([]);
  const [newAttendee, setNewAttendee] = useState({ name: '', email: '' });
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [events, setEvents] = useState<{ id: string; name: string }[]>([]);
  const [selectedEventId, setSelectedEventId] = useState<string>('');
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewAttendee({ ...newAttendee, [e.target.name]: e.target.value });
  };

  const addAttendeeManually = () => {
    if (newAttendee.name && newAttendee.email) {
      setAttendees([...attendees, newAttendee]);
      setNewAttendee({ name: '', email: '' });
    }
  };

  const handleCsvUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setCsvFile(e.target.files[0]);
      Papa.parse(e.target.files[0], {
        header: true,
        skipEmptyLines: true,
        complete: (result) => {
          const parsedAttendees = result.data as { name: string; email: string }[];
          setAttendees([...attendees, ...parsedAttendees]);
        },
      });
    }
  };

  const submitAttendees = async () => {
    if (!selectedEventId) {
      alert('Please select an event before submitting attendees.');
      return;
    }

    if (attendees.length === 0) {
      alert('No attendees to submit.');
      return;
    }

    const { error } = await supabase.from('attendees').insert(
      attendees.map((attendee) => ({
        event_id: selectedEventId,
        name: attendee.name,
        email: attendee.email,
        checked_in: false,
      }))
    );

    if (error) {
      console.error('Error adding attendees:', error);
      alert('Failed to add attendees.');
    } else {
      alert('Attendees added successfully!');
      setAttendees([]);
      navigate('/admin-check-in');
    }
  };

  return (
    <div className={styles.registerContainer}>
      <h2 className={styles.title}>Pre-Register Attendees</h2>
      <div className={styles.selectSection}>
        <label>Select Event:</label>
        <select value={selectedEventId} onChange={(e) => setSelectedEventId(e.target.value)}>
          <option value="">-- Select an Event --</option>
          {events.map((event) => (
            <option key={event.id} value={event.id}>{event.name}</option>
          ))}
        </select>
      </div>
      
      <div className={styles.formGroup}>
        <input
          type="text"
          name="name"
          placeholder="Attendee Name"
          value={newAttendee.name}
          onChange={handleInputChange}
          className={styles.input}
        />
        <input
          type="email"
          name="email"
          placeholder="Attendee Email"
          value={newAttendee.email}
          onChange={handleInputChange}
          className={styles.input}
        />
        <button onClick={addAttendeeManually} className={styles.button}>Add Attendee</button>
      </div>
      
      <div className={styles.csvSection}>
        <h3>Or Upload CSV</h3>
        <input type="file" accept=".csv" onChange={handleCsvUpload} className={styles.fileInput} />
      </div>

      <h3 className={styles.listTitle}>Attendees to be Registered</h3>
      <ul className={styles.attendeeList}>
        {attendees.map((attendee, index) => (
          <li key={index} className={styles.attendeeItem}>{attendee.name} - {attendee.email}</li>
        ))}
      </ul>

      <button onClick={submitAttendees} className={styles.submitButton}>Submit Attendees</button>
    </div>
  );
};

export default RegisterAttendee;
