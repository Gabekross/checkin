import React, { useState, useEffect } from 'react';
import { supabase } from '../supabase';
import { useParams } from 'react-router-dom';
// import QRScanner from '../components/QRScanner';
import { fetchEventById } from '../api/events';
import styles from '../styles/SelfCheckIn.module.scss';

const SelfCheckIn: React.FC = () => {
  const { eventId } = useParams<{ eventId: string }>();
  const [event, setEvent] = useState<any>(null);
  // const [attendees, setAttendees] = useState<{ id: string; name: string; email: string; status?: string; checked_in: boolean }[]>([]);
  const [attendees, setAttendees] = useState<{ id: string; name: string; email?: string; status?: string; checked_in: boolean ;check_in_time?: string}[]>([]);
  //const [searchQuery, setSearchQuery] = useState<string>('');
  const [filteredAttendee, setFilteredAttendee] = useState<{ id: string; name: string; email?: string; status?: string; checked_in: boolean; check_in_time?: string; } | null>(null);
  //const [filteredAttendee, setFilteredAttendee] = useState<{ id: string; name: string; email: string; status?: string; checked_in: boolean } | null>(null);
  const [newAttendee, setNewAttendee] = useState<{ firstName: string; lastName: string; name: string; email: string; status: string }>({ firstName: '',
    lastName: '', name: '', email: '', status: '' });
  const [checkedIn, setCheckedIn] = useState<boolean>(false);
  const [showWarning, setShowWarning] = useState<boolean>(false);
  const [selectedStatus, setSelectedStatus] = useState<string>('');
  //const navigate = useNavigate();
  const [searchFirstName, setSearchFirstName] = useState<string>('');
  const [searchLastName, setSearchLastName] = useState<string>('');

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
  const sanitizedFirst = searchFirstName.replace(/[^a-zA-Z\s]/g, "").trim().toLowerCase();
  const sanitizedLast = searchLastName.replace(/[^a-zA-Z\s]/g, "").trim().toLowerCase();
  
  if (!sanitizedFirst || !sanitizedLast) return;

  const attendee = attendees.find(a => {
    const [attendeeFirst, ...attendeeLastParts] = a.name.toLowerCase().split(" ");
    const attendeeLast = attendeeLastParts.join(" "); // Handle multiple last names
    return attendeeFirst === sanitizedFirst && attendeeLast === sanitizedLast;
  });

  if (attendee) {
    attendee.name = capitalizeFirstLetter(attendee.name);
  }

 
    setFilteredAttendee(attendee || null);
    setShowWarning(!attendee);
  };

  const capitalizeFirstLetter = (name: string) => {
    if (!name) return "";
    return name
      .split(" ") // Split the name into words (handles cases like "john doe")
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()) // Capitalize each word
      .join(" "); // Join them back into a string
  };
  
  const handleRegister = async () => {
    // ✅ Email Validation Regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const sanitizedFirstName = newAttendee.firstName.replace(/[^a-zA-Z\s]/g, "").trim();
    const sanitizedLastName = newAttendee.lastName.replace(/[^a-zA-Z\s]/g, "").trim();
    const fullName = `${sanitizedFirstName} ${sanitizedLastName}`.trim();
  
    if (!sanitizedFirstName || !sanitizedLastName) {
      alert("Please enter both first and last names with only letters.");
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
      name: fullName,
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
          <div className={styles.searchFields}>
              <input
                type="text"
                placeholder="First Name"
                value={searchFirstName}
                onChange={(e) => setSearchFirstName(e.target.value)}
                className={styles.input}
              />
              <input
                type="text"
                placeholder="Last Name"
                value={searchLastName}
                onChange={(e) => setSearchLastName(e.target.value)}
                className={styles.input}
              />
            </div>
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
            <p>
              {capitalizeFirstLetter(filteredAttendee?.name)} - 
              {filteredAttendee.checked_in ? '✔ Checked In' : '❌ Not Checked In'}
            </p>


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
            <div className={styles.nameFields}>
                <input type="text" placeholder="First Name" value={newAttendee.firstName} onChange={(e) => setNewAttendee({ ...newAttendee, firstName: e.target.value.replace(/[^a-zA-Z\s]/g, "").trimStart() })} className={styles.input} />
                <input type="text" placeholder="Last Name" value={newAttendee.lastName} onChange={(e) => setNewAttendee({ ...newAttendee, lastName: e.target.value.replace(/[^a-zA-Z\s]/g, "").trimStart() })} className={styles.input} />
              </div>
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
            
            Welcome, {capitalizeFirstLetter(filteredAttendee?.name?.split(" ")[0] || "Guest")}!
          

          </h2>
          <h3 className={`${styles.eventName}`}
          style={{ 
            color: filteredAttendee?.status ===  "married" ? "black" : "white"
          }}
          >______________</h3>
          <p className={styles.eventText}>Checked In</p>
        </div>
      </div>
    )}
  </div>
);
};

export default SelfCheckIn;
