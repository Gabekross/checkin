import React, { useState, useEffect } from "react";
import { supabase } from "../supabase";
import { useNavigate } from "react-router-dom";
import styles from "../styles/GuestCheckIn.module.scss";

const GuestCheckIn: React.FC = () => {
  const [events, setEvents] = useState<{ id: string; name: string }[]>([]);
  const [selectedEventId, setSelectedEventId] = useState<string>("");
  const navigate = useNavigate();

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

  const handleProceed = () => {
    if (!selectedEventId) {
      alert("Please select an event to proceed.");
      return;
    }
    navigate(`/self-check-in/${selectedEventId}`); // Redirect to Self Check-In with selected event ID
  };

  return (
    <div className={styles.guestContainer}>
      <div className={styles.contentBox}>
        <h2 className={styles.title}>Guest Check-In</h2>
        <p className={styles.description}>Select an event to check in:</p>

        <select
          value={selectedEventId}
          onChange={(e) => setSelectedEventId(e.target.value)}
          className={styles.select}
        >
          <option value="">-- Select an Event --</option>
          {events.map((event) => (
            <option key={event.id} value={event.id}>
              {event.name}
            </option>
          ))}
        </select>

        <button onClick={handleProceed} className={styles.button}>
          Proceed to Check-In
        </button>
      </div>
    </div>
  );
};

export default GuestCheckIn;
