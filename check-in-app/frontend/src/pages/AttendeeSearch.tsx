import React, { useState, useEffect } from "react";
import { supabase } from "../supabase";
import { useNavigate } from "react-router-dom";
import styles from "../styles/AttendeeSearch.module.scss";

const AttendeeSearch: React.FC = () => {
  const [events, setEvents] = useState<{ id: string; name: string }[]>([]);
  const [selectedEventId, setSelectedEventId] = useState<string>("");
  const [attendees, setAttendees] = useState<{ id: string; name: string; email?: string; status?: string; checked_in: boolean }[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [filteredAttendee, setFilteredAttendee] = useState<{ id: string; name: string; email?: string; status?: string; checked_in: boolean } | null>(null);
  const [newAttendee, setNewAttendee] = useState<{ name: string; email: string; status: string }>({ name: "", email: "", status: "" });
  const [showWarning, setShowWarning] = useState<boolean>(false);
  const navigate = useNavigate();

  // ✅ Fetch Events
  useEffect(() => {
    const fetchEvents = async () => {
      const { data, error } = await supabase.from("events").select("id, name");
      if (error) {
        console.error("Error fetching events:", error);
      } else {
        setEvents(data);
      }
    };
    fetchEvents();
  }, []);

  // ✅ Fetch Attendees for Selected Event
  useEffect(() => {
    const fetchAttendees = async () => {
      if (!selectedEventId) return;
      const { data, error } = await supabase
        .from("attendees")
        .select("id, name, email, status, checked_in")
        .eq("event_id", selectedEventId);
      if (error) {
        console.error("Error fetching attendees:", error);
      } else {
        setAttendees(data);
      }
    };
    fetchAttendees();
  }, [selectedEventId]);

  // ✅ Handle Attendee Search
  const handleSearch = () => {
    const attendee = attendees.find(a => a.name.toLowerCase() === searchQuery.toLowerCase());
    setFilteredAttendee(attendee || null);
    setShowWarning(!attendee);
  };

  // ✅ Handle Walk-in Registration
  const addWalkInAttendee = async () => {
    if (!newAttendee.name) {
      alert("Name is required.");
      return;
    }

    const { data, error } = await supabase.from("attendees").insert({
      event_id: selectedEventId,
      name: newAttendee.name.trim().toUpperCase(),
      email: newAttendee.email ? newAttendee.email.trim() : null,
      status: newAttendee.status ? newAttendee.status.trim() : null,
      checked_in: false,
    }).select("*").single();

    if (error) {
      console.error("Error registering attendee:", error);
      alert("Failed to register attendee.");
    } else {
      setAttendees([...attendees, data]);
      setFilteredAttendee(data);
      alert("Registration successful!");
    }
  };

  return (
    <div className={styles.attendeeSearchContainer}>
      <h2 className={styles.title}>Search & Register Attendees</h2>

      {/* Select Event */}
      <div className={styles.selectSection}>
        <label>Select Event:</label>
        <select value={selectedEventId} onChange={(e) => setSelectedEventId(e.target.value)}>
          <option value="">-- Select an Event --</option>
          {events.map(event => (
            <option key={event.id} value={event.id}>{event.name}</option>
          ))}
        </select>
      </div>

      {/* Attendee Search */}
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

      {/* Warning Message if Not Found */}
      {showWarning && (
        <div className={styles.warningMessage}>
          <p>Attendee not found. Please register below.</p>
        </div>
      )}

      {/* Walk-In Registration */}
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
          placeholder="Enter Email (Optional)"
          value={newAttendee.email}
          onChange={(e) => setNewAttendee({ ...newAttendee, email: e.target.value })}
          className={styles.input}
        />
        <button onClick={addWalkInAttendee} className={styles.button}>Register</button>
      </div>
    </div>
  );
};

export default AttendeeSearch;
