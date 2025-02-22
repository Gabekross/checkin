import React, { useState, useEffect } from "react";
import { supabase } from "../supabase";
import { useNavigate } from "react-router-dom";
import styles from "../styles/AdminCheckIn.module.scss";

const AdminCheckIn: React.FC = () => {
  const [events, setEvents] = useState<{ id: string; name: string }[]>([]);
  const [selectedEventId, setSelectedEventId] = useState<string>("");
  const [attendees, setAttendees] = useState<{ id: string; name: string; email: string; status?: string; checked_in: boolean }[]>([]);
  const navigate = useNavigate();

  // ✅ Check if Admin is Logged In
  useEffect(() => {
    const checkAuth = async () => {
      const { data } = await supabase.auth.getSession();
      if (!data.session) {
        navigate("/admin-sign-in"); // ✅ Redirect if not logged in
      }
    };
    checkAuth();
  }, [navigate]);

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

  return (
    <div className={styles.adminCheckInContainer}>
      <h2 className={styles.title}>Admin Panel</h2>

      {/* ✅ Admin Navigation Cards (Column Layout) */}
      <div className={styles.adminNavContainer}>
        <div className={styles.adminNavCard} onClick={() => navigate("/create-event")}>
          <h3>Create New Event</h3>
          <p>Set up new events and manage details.</p>
        </div>
        <div className={styles.adminNavCard} onClick={() => navigate("/test-qr")}>
          <h3>Generate QR Code</h3>
          <p>Create QR codes for quick check-ins.</p>
        </div>
        <div className={styles.adminNavCard} onClick={() => navigate("/register-attendee")}>
          <h3>Pre-Event Registration</h3>
          <p>Register attendees before the event.</p>
        </div>
        <div className={styles.adminNavCard} onClick={() => navigate("/attendee-search")}>
          <h3>Search & Register Attendees</h3>
          <p>Find attendees and register new walk-ins.</p>
        </div>
        <div className={styles.adminNavCard} onClick={() => navigate("/check-in-analytics")}>
          <h3>View Analytics</h3>
          <p>Track check-in trends and attendance stats.</p>
        </div>
        
      </div>

      {/* ✅ Attendee List */}
      <h3 className={styles.listTitle}></h3>
      {selectedEventId ? (
        <ul className={styles.attendeeList}>
          {attendees.length > 0 ? (
            attendees.map(attendee => (
              <li key={attendee.id} className={styles.attendeeItem}>
                {attendee.name} - {attendee.email || "No Email"} - {attendee.status || "No Status"} - {attendee.checked_in ? "✔ Checked In" : "❌ Not Checked In"}
              </li>
            ))
          ) : (
            <p className={styles.noAttendeesMessage}>No attendees found for this event.</p>
          )}
        </ul>
      ) : (
        <p className={styles.selectEventMessage}></p>
      )}
    </div>
  );
};

export default AdminCheckIn;
