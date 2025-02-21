import React, { useState, useEffect } from 'react';
import { supabase } from '../supabase';
import { useNavigate } from 'react-router-dom';
import Papa from 'papaparse';
import styles from '../styles/RegisterAttendee.module.scss';

const RegisterAttendee: React.FC = () => {
  const [attendees, setAttendees] = useState<{ name: string; email?: string; status?: string }[]>([]);
  const [newAttendee, setNewAttendee] = useState({ name: '', email: '', status: '' });
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setNewAttendee({ ...newAttendee, [e.target.name]: e.target.value });
  };

  const addAttendeeManually = () => {
    const name = newAttendee.name.trim().toUpperCase(); // ✅ Convert Name to Uppercase
    const email = newAttendee.email.trim();
    const status = newAttendee.status.trim();

    if (!name) {
      alert('Name is required.');
      return;
    }

    setAttendees([...attendees, { name, email, status }]);
    setNewAttendee({ name: '', email: '', status: '' });
  };

  const handleCsvUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setCsvFile(e.target.files[0]);

      Papa.parse(e.target.files[0], {
        header: true,
        skipEmptyLines: true,
        complete: (result) => {
          console.log("Parsed CSV Data:", result.data);

          const parsedAttendees = result.data
            .filter((row: any) => row.name) // ✅ Name is required
            .map((row: any) => ({
              name: row.name.trim().toUpperCase(), // ✅ Convert Name to Uppercase
              email: row.email ? row.email.trim() : null, // ✅ Email is optional
              status: row.status ? row.status.trim() : null, // ✅ Status is optional
            }));

          console.log("Filtered Attendees:", parsedAttendees);
          setAttendees((prevAttendees) => [...prevAttendees, ...parsedAttendees]);
        },
        error: (error) => {
          console.error("CSV Parsing Error:", error.message);
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
        email: attendee.email || null, // ✅ Store null if missing
        status: attendee.status || null, // ✅ Store null if missing
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

      {/* Select Event */}
      <div className={styles.selectSection}>
        <label>Select Event:</label>
        <select value={selectedEventId} onChange={(e) => setSelectedEventId(e.target.value)}>
          <option value="">-- Select an Event --</option>
          {events.map((event) => (
            <option key={event.id} value={event.id}>{event.name}</option>
          ))}
        </select>
      </div>

      {/* Manual Attendee Registration */}
      <div className={styles.formGroup}>
        <input
          type="text"
          name="name"
          placeholder="Full Name"
          value={newAttendee.name}
          onChange={handleInputChange}
          className={styles.input}
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email (Optional)"
          value={newAttendee.email}
          onChange={handleInputChange}
          className={styles.input}
        />
        <label>Select Marital Status:</label>
        <select name="status" value={newAttendee.status} onChange={handleInputChange} className={styles.input}>
          <option value="">-- Select --</option>
          <option value="single">Single</option>
          <option value="married">Married</option>
        </select>
        <button onClick={addAttendeeManually} className={styles.button}>Add Attendee</button>
      </div>

      {/* CSV Upload */}
      <div className={styles.csvSection}>
        <h3>Or Upload CSV</h3>
        <input type="file" accept=".csv" onChange={handleCsvUpload} className={styles.fileInput} />
      </div>

      {/* List of Attendees to be Registered */}
      <h3 className={styles.listTitle}>Attendees to be Registered</h3>
      <ul className={styles.attendeeList}>
        {attendees.map((attendee, index) => (
          <li key={index} className={styles.attendeeItem}>
            {attendee.name} - {attendee.email || "No Email"} - {attendee.status || "No Status"}
          </li>
        ))}
      </ul>

      <button onClick={submitAttendees} className={styles.submitButton}>Submit Attendees</button>
    </div>
  );
};

export default RegisterAttendee;
