import React, { useState, useEffect } from 'react';
import { supabase } from '../supabase';
import { useNavigate, useParams } from 'react-router-dom';
// import QRScanner from '../components/QRScanner';
import { fetchEventById } from '../api/events';
import styles from '../styles/SelfCheckIn.module.scss';

const SelfCheckIn: React.FC = () => {
  const { eventId } = useParams<{ eventId: string }>();
  const [event, setEvent] = useState<any>(null);
  // const [attendees, setAttendees] = useState<{ id: string; name: string; email: string; status?: string; checked_in: boolean }[]>([]);
  const [attendees, setAttendees] = useState<{ id: string; name: string; email?: string; status?: string; checked_in: boolean ;check_in_time?: string}[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filteredAttendee, setFilteredAttendee] = useState<{ id: string; name: string; email?: string; status?: string; checked_in: boolean; check_in_time?: string; } | null>(null);
  //const [filteredAttendee, setFilteredAttendee] = useState<{ id: string; name: string; email: string; status?: string; checked_in: boolean } | null>(null);
  const [newAttendee, setNewAttendee] = useState<{ name: string; email: string; status: string }>({ name: '', email: '', status: '' });
  const [checkedIn, setCheckedIn] = useState<boolean>(false);
  const [showWarning, setShowWarning] = useState<boolean>(false);
  const [selectedStatus, setSelectedStatus] = useState<string>('');
  const navigate = useNavigate();

  useEffect(() => {
    const loadEvent = async () => {
      if (eventId) {
        try {
          const eventData = await fetchEventById(eventId);
          setEvent(eventData);
          const { data, error } = await supabase.from('attendees').select('id, name, email, status, checked_in').eq('event_id', eventId);
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

    const sanitizedQuery = searchQuery.replace(/[^a-zA-Z\s]/g, "").trim();
    if (!sanitizedQuery) return;

    const attendee = attendees.find(a => a.name.toLowerCase() === sanitizedQuery.toLowerCase());
    setFilteredAttendee(attendee || null);
    setShowWarning(!attendee);
  };

  const handleRegister = async () => {
    // ✅ Email Validation Regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  
    // ✅ Trim spaces and remove special characters from the name
    const sanitizedName = newAttendee.name.replace(/[^a-zA-Z\s]/g, "").trim();
  
    if (!sanitizedName) {
      alert("Please enter a valid name with only letters.");
      return;
    }
  
    if (!newAttendee.email || !emailRegex.test(newAttendee.email)) {
      alert("Please enter a valid email address.");
      return;
    }
  
    if (!newAttendee.status) {
      alert("Please select your marital status.");
      return;
    }
  
    // ✅ Save sanitized input in the database
    const { data, error } = await supabase.from("attendees").insert({
      event_id: eventId,
      name: sanitizedName, 
      email: newAttendee.email.trim(),
      status: newAttendee.status,
      checked_in: false
    }).select("*").single();
  
    if (error) {
      console.error("Error registering attendee:", error);
      alert("Failed to register attendee.");
    } else {
      setAttendees([...attendees, data]);
      setFilteredAttendee(data);
      alert("Registration successful! You can now check in.");
    }
  };
  

  const checkInAttendee = async (attendeeId: string, status?: string) => {
    if (!status) {
      alert("Please select your marital status before checking in.");
      return;
    }

    //const checkInTime = new Date().toISOString();
     // ✅ Get current local time and format it properly
    const localTime = new Date();
    const checkInTime = localTime.toLocaleString("en-US", { 
      timeZone: "America/New_York", // ✅ Change this to your actual timezone!
      hour12: false // ✅ Ensures 24-hour format (optional, set to true for AM/PM)
    });


    const { error } = await supabase.from('attendees').update({ checked_in: true, status,check_in_time: checkInTime }).eq('id', attendeeId);
    if (error) {
      console.error('Error checking in attendee:', error);
      alert('Failed to check in attendee.');
    } else {
      setCheckedIn(true);
      setAttendees(prev =>
        prev.map(attendee =>
          attendee.id === attendeeId ? { ...attendee, checked_in: true, status, check_in_time: checkInTime } : attendee
        )
      );
      setFilteredAttendee(prev => prev ? { ...prev, checked_in: true, status , check_in_time: checkInTime} : null);
      alert(`Welcome, ${filteredAttendee?.name || "Guest"}! You are now checked in.`);

    }
  };

//   return (
//     <div className={`${styles.selfCheckIn} ${checkedIn ? styles.checkedIn : ''}`} style={checkedIn ? { backgroundColor: 'green', color: 'white' } : {}}>
//       {event && (
//         <div className={styles.eventInfo}>
//         {/* <h2>{event.name}</h2>
//         <p>{event.date} - {event.location}</p> */}
        
//         {/* ✅ Display Event Image (Use Default if Missing) */}
//         <img 
//           src={event.image_url || '/default-event.jpg'} // Provide a default image path
//           alt="Event"
//           className={styles.eventImage}
//         />
//       </div>
      
// )}


// {/* 
//       {event && (
//         <div className={styles.eventInfo}>
//           <h2>{event.name}</h2>
//           <p>{event.date} - {event.location}</p>
//         </div>
//       )} */}
//       {!checkedIn ? (
//         <>
//           {/* <h2 className={styles.title}>Scan QR Code or Enter Your Name</h2>
//           <QRScanner onScanSuccess={(scannedEventId) => navigate(`/self-check-in/${scannedEventId}`)} /> */}
//           <div className={styles.searchSection}>
//             <input
//               type="text"
//               placeholder="Search Attendee by Name"
//               value={searchQuery}
//               onChange={(e) => setSearchQuery(e.target.value)}
//               className={styles.input}
//             />
//             <button onClick={handleSearch} className={styles.button}>Search</button>
//           </div>

//           {/* Warning message if attendee not found */}
//           {showWarning && (
//             <div className={styles.warningMessage}>
//               <p>Attendee not found.. <br />Please register below.</p>
//               <button className={styles.closeButton} onClick={() => setShowWarning(false)}>X</button>
//             </div>
//           )}

//           {/* If attendee is found */}
//           {filteredAttendee && (
//             <div className={styles.attendeeFound}>
//               <h3>Attendee Found</h3>
//               <p>{filteredAttendee.name} - {filteredAttendee.checked_in ? '✔ Checked In' : '❌ Not Checked In'}</p>

//               {!filteredAttendee.checked_in && (
//                 <>
//                   {filteredAttendee.status ? (
//                     <button onClick={() => checkInAttendee(filteredAttendee.id, filteredAttendee.status)} className={styles.button}>Check In</button>
//                   ) : (
//                     <>
//                       <label>Select Marital Status:</label>
//                       <select onChange={(e) => setSelectedStatus(e.target.value)} className={styles.input}>
//                         <option value="">-- Select --</option>
//                         <option value="single">Single</option>
//                         <option value="married">Married</option>
//                       </select>
//                       <button onClick={() => checkInAttendee(filteredAttendee.id, selectedStatus)} className={styles.button}>Submit & Check In</button>
//                     </>
//                   )}
//                 </>
//               )}
//             </div>
//           )}

//           {/* Registration form for new attendees */}
//           {!filteredAttendee && (
//             <div className={styles.registerSection}>
//               <h3>Not Registered? Register Here</h3>
//               <input
//                 type="text"
//                 placeholder="Enter your name"
//                 value={newAttendee.name}
//                 onChange={(e) => {
//                   const sanitizedValue = e.target.value.replace(/[^a-zA-Z\s]/g, "");
//                   setNewAttendee({ ...newAttendee, name: sanitizedValue.trimStart() })}}
//                 className={styles.input}
//               />
//               <input
//                 type="email"
//                 placeholder="Enter Your Email"
//                 value={newAttendee.email}
//                 onChange={(e) => setNewAttendee({ ...newAttendee, email: e.target.value.trim() })}
//                 className={styles.input}
//               />
//               <label>Select Marital Status:</label>
//               <select
//                 value={newAttendee.status}
//                 onChange={(e) => setNewAttendee({ ...newAttendee, status: e.target.value })}
//                 className={styles.input}
//               >
//                 <option value="">-- Select --</option>
//                 <option value="single">Single</option>
//                 <option value="married">Married</option>
//               </select>
//               <button onClick={handleRegister} className={styles.button}>Register</button>
//             </div>
//           )}
//         </>
//       ) : (
//         <div className={`${styles.checkedIn}`}

//         style={{ 
//           backgroundColor: filteredAttendee.status === "single" ? "green" : "yellow", 
//           color: filteredAttendee.status === "single" ? "white" : "black" 
//         }}

        
        
//         >
//             <div className={`${styles.confirmation} ${styles.fadeIn}`}>
//                 <h2 className={styles.welcomeText}>Welcome, {filteredAttendee?.name?.split(" ")[0] || "Guest"}!</h2>
//                 <h3 className={styles.eventName}>_________________</h3>
//                 <p className={styles.eventText}>Checked In</p>
               
//             </div>
//         </div>
//       )}
//     </div>
//   );


return (
  <div className={`${styles.selfCheckIn} ${checkedIn ? styles.checkedIn : ''}`}>

    {event && (
      <div className={styles.eventInfo}>
        <img 
          src={event.image_url || '/default-event.jpg'} 
          alt="Event"
          className={styles.eventImage}
        />
      </div>
    )}

    {!checkedIn ? (
      <>
        <div className={styles.searchSection}>
          <input
            type="text"
            placeholder="Search Attendee by Name"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={styles.input}
          />
          <button onClick={handleSearch} className={styles.button}>Search</button>
        </div>

        {showWarning && (
          <div className={styles.warningMessage}>
            <p>Attendee not found.. <br />Please register below.</p>
            <button className={styles.closeButton} onClick={() => setShowWarning(false)}>X</button>
          </div>
        )}

        {filteredAttendee && (
          <div className={styles.attendeeFound}>
            <h3>Attendee Found</h3>
            <p>{filteredAttendee.name} - {filteredAttendee.checked_in ? '✔ Checked In' : '❌ Not Checked In'}</p>

            {!filteredAttendee.checked_in && (
              <>
                {filteredAttendee.status ? (
                  <button onClick={() => checkInAttendee(filteredAttendee.id, filteredAttendee.status)} className={styles.button}>Check In</button>
                ) : (
                  <>
                    <label>Select Marital Status:</label>
                    <select onChange={(e) => setSelectedStatus(e.target.value)} className={styles.input}>
                      <option value="">-- Select --</option>
                      <option value="single">Single</option>
                      <option value="married">Married</option>
                    </select>
                    <button onClick={() => checkInAttendee(filteredAttendee.id, selectedStatus)} className={styles.button}>Submit & Check In</button>
                  </>
                )}
              </>
            )}
          </div>
        )}

        {!filteredAttendee && (
          <div className={styles.registerSection}>
            <h3>Not Registered? Register Here</h3>
            <input
              type="text"
              placeholder="Enter your name"
              value={newAttendee.name}
              onChange={(e) => {
                const sanitizedValue = e.target.value.replace(/[^a-zA-Z\s]/g, "");
                setNewAttendee({ ...newAttendee, name: sanitizedValue.trimStart() });
              }}
              className={styles.input}
            />
            <input
              type="email"
              placeholder="Enter Your Email"
              value={newAttendee.email}
              onChange={(e) => setNewAttendee({ ...newAttendee, email: e.target.value.trim() })}
              className={styles.input}
            />
            <label>Select Marital Status:</label>
            <select
              value={newAttendee.status}
              onChange={(e) => setNewAttendee({ ...newAttendee, status: e.target.value })}
              className={styles.input}
            >
              <option value="">-- Select --</option>
              <option value="single">Single</option>
              <option value="married">Married</option>
            </select>
            <button onClick={handleRegister} className={styles.button}>Register</button>
          </div>
        )}
      </>
    ) : (
      <div 
        className={`${styles.checkedIn}`}
        style={{ 
          backgroundColor: filteredAttendee?.status === "single" ? "green" : filteredAttendee?.status === "married" ? "yellow" : "gray",
          color: filteredAttendee?.status ===  "married" ? "black" : "white"
        }}
      >
        <div className={`${styles.confirmation} ${styles.fadeIn}`}>
          <h2 className={styles.welcomeText}>
            Welcome, {filteredAttendee?.name?.split(" ")[0] || "Guest"}!
          </h2>
          <h3 className={`${styles.eventName}`}
          style={{ 
            color: filteredAttendee?.status ===  "married" ? "black" : "white"
          }}
          >_________________</h3>
          <p className={styles.eventText}>Checked In</p>
        </div>
      </div>
    )}
  </div>
);


};

export default SelfCheckIn;
