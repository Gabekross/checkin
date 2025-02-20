import React, { useState, useEffect } from 'react';
import { supabase } from '../supabase';
import { useNavigate } from 'react-router-dom';
import styles from '../styles/AdminCheckIn.module.scss';

const AdminCheckIn: React.FC = () => {
  const [events, setEvents] = useState<{ id: string; name: string }[]>([]);
  const [selectedEventId, setSelectedEventId] = useState<string>('');
  const [attendees, setAttendees] = useState<{ id: string; name: string; email: string; status?: string; checked_in: boolean }[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filteredAttendee, setFilteredAttendee] = useState<{ id: string; name: string; email: string; status?: string; checked_in: boolean } | null>(null);
  const [newAttendee, setNewAttendee] = useState<{ name: string; email: string; status: string }>({ name: '', email: '', status: '' });
  const [selectedStatus, setSelectedStatus] = useState<string>('');
  const [showWarning, setShowWarning] = useState<boolean>(false);
  const navigate = useNavigate();

  // ✅ Redirect Admin to Sign-In if Not Authenticated
  useEffect(() => {
    const checkAuth = async () => {
      const { data } = await supabase.auth.getSession();
      if (!data.session) {
        navigate("/admin-sign-in");
      }
    };
    checkAuth();
  }, [navigate]);

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
      const { data, error } = await supabase.from('attendees').select('id, name, email, status, checked_in').eq('event_id', selectedEventId);
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
    setShowWarning(!attendee); // ✅ Show warning if attendee is NOT found
  };

  const addWalkInAttendee = async () => {
    if (!newAttendee.name || !newAttendee.email || !newAttendee.status) {
      alert('Please provide name, email, and marital status.');
      return;
    }

    const { data, error } = await supabase.from('attendees').insert({
      event_id: selectedEventId,
      name: newAttendee.name,
      email: newAttendee.email,
      status: newAttendee.status,
      checked_in: false
    }).select('*').single();

    if (error) {
      console.error('Error registering attendee:', error);
      alert('Failed to register attendee.');
    } else {
      setAttendees([...attendees, data]); // ✅ Update attendee list
      alert('Registration successful!');
    }
  };

  const checkInAttendee = async (attendeeId: string, status?: string) => {
    if (!status) {
      alert("Please select the attendee's marital status before checking in.");
      return;
    }

    const { error } = await supabase.from('attendees').update({ checked_in: true, status }).eq('id', attendeeId);
    if (error) {
      console.error('Error checking in attendee:', error);
      alert('Failed to check in attendee.');
    } else {
      setAttendees(prev =>
        prev.map(a => (a.id === attendeeId ? { ...a, checked_in: true, status } : a))
      );
      setFilteredAttendee(prev => prev ? { ...prev, checked_in: true, status } : null);
      alert('Check-in successful!');
    }
  };

  return (
    <div className={styles.adminCheckInContainer}>
      <h2 className={styles.title}>Admin Check-In Panel</h2>

      {/* ✅ Event Selection */}
      <div className={styles.selectSection}>
        <label>Select Event:</label>
        <select value={selectedEventId} onChange={(e) => setSelectedEventId(e.target.value)}>
          <option value="">-- Select an Event --</option>
          {events.map((event) => (
            <option key={event.id} value={event.id}>{event.name}</option>
          ))}
        </select>
      </div>

      {/* ✅ Attendee Search */}
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

      {/* ✅ Warning Message when Attendee is NOT found */}
      {showWarning && (
        <div className={styles.warningMessage}>
          <p>Attendee not found. Please register below.</p>
          <button className={styles.closeButton} onClick={() => setShowWarning(false)}>X</button>
        </div>
      )}

      {/* ✅ If attendee is found */}
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

      {/* ✅ Walk-in Registration */}
      <div className={styles.registerSection}>
        <h3>Walk-in Registration</h3>
        <input
          type="text"
          placeholder="Enter Name"
          value={newAttendee.name}
          onChange={(e) => setNewAttendee({ ...newAttendee, name: e.target.value })}
          className={styles.input}
        />
        <input
          type="email"
          placeholder="Enter Email"
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
        <button onClick={addWalkInAttendee} className={styles.button}>Register</button>
      </div>

      {/* ✅ Attendee List for Selected Event */}
      <h3 className={styles.listTitle}>Attendees</h3>
      <ul className={styles.attendeeList}>
        {attendees.map((attendee) => (
          <li key={attendee.id} className={styles.attendeeItem}>
            {attendee.name} - {attendee.email} - {attendee.status || "No Status"} - {attendee.checked_in ? '✔ Checked In' : '❌ Not Checked In'}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AdminCheckIn;
