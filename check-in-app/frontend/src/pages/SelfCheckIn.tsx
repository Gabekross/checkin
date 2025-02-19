import React, { useState, useEffect } from 'react';
import { supabase } from '../supabase';
import { useNavigate, useParams } from 'react-router-dom';
// import QRScanner from '../components/QRScanner';
import { fetchEventById } from '../api/events';
import styles from '../styles/SelfCheckIn.module.scss';

const SelfCheckIn: React.FC = () => {
  const { eventId } = useParams<{ eventId: string }>();
  const [event, setEvent] = useState<any>(null);
  const [attendees, setAttendees] = useState<{ id: string; name: string; email: string; status?: string; checked_in: boolean }[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filteredAttendee, setFilteredAttendee] = useState<{ id: string; name: string; email: string; status?: string; checked_in: boolean } | null>(null);
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
    const attendee = attendees.find(a => a.name.toLowerCase() === searchQuery.toLowerCase());
    setFilteredAttendee(attendee || null);
    setShowWarning(!attendee);
  };

  const handleRegister = async () => {
    if (!newAttendee.name || !newAttendee.email || !newAttendee.status) {
      alert('Please provide name, email, and marital status.');
      return;
    }

    const { data, error } = await supabase.from('attendees').insert({
      event_id: eventId,
      name: newAttendee.name,
      email: newAttendee.email,
      status: newAttendee.status,
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

  const checkInAttendee = async (attendeeId: string, status?: string) => {
    if (!status) {
      alert("Please select your marital status before checking in.");
      return;
    }

    const { error } = await supabase.from('attendees').update({ checked_in: true, status }).eq('id', attendeeId);
    if (error) {
      console.error('Error checking in attendee:', error);
      alert('Failed to check in attendee.');
    } else {
      setCheckedIn(true);
      setFilteredAttendee(prev => prev ? { ...prev, checked_in: true, status } : null);
      alert('Check-in successful!');
    }
  };

  return (
    <div className={`${styles.selfCheckIn} ${checkedIn ? styles.checkedIn : ''}`} style={checkedIn ? { backgroundColor: 'green', color: 'white' } : {}}>
      {event && (
        <div className={styles.eventInfo}>
          <h2>{event.name}</h2>
          <p>{event.date} - {event.location}</p>
        </div>
      )}
      {!checkedIn ? (
        <>
          {/* <h2 className={styles.title}>Scan QR Code or Enter Your Name</h2>
          <QRScanner onScanSuccess={(scannedEventId) => navigate(`/self-check-in/${scannedEventId}`)} /> */}
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

          {/* Warning message if attendee not found */}
          {showWarning && (
            <div className={styles.warningMessage}>
              <p>Attendee not found. Please register below.</p>
              <button className={styles.closeButton} onClick={() => setShowWarning(false)}>X</button>
            </div>
          )}

          {/* If attendee is found */}
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

          {/* Registration form for new attendees */}
          {!filteredAttendee && (
            <div className={styles.registerSection}>
              <h3>Not Registered? Register Here</h3>
              <input
                type="text"
                placeholder="Enter Your Name"
                value={newAttendee.name}
                onChange={(e) => setNewAttendee({ ...newAttendee, name: e.target.value })}
                className={styles.input}
              />
              <input
                type="email"
                placeholder="Enter Your Email"
                value={newAttendee.email}
                onChange={(e) => setNewAttendee({ ...newAttendee, email: e.target.value })}
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
        <div className={`${styles.confirmation} ${styles.checkedIn}`}>
          <h2>Checked In</h2>
        </div>
      )}
    </div>
  );
};

export default SelfCheckIn;
