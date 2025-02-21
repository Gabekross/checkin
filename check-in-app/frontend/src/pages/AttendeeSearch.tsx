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
  const [selectedStatus, setSelectedStatus] = useState<string>("");
  const [checkedIn, setCheckedIn] = useState<boolean>(false);

  const navigate = useNavigate();

  // ✅ Fetch Events on Mount
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

  // ✅ Fetch Attendees when an Event is Selected
  useEffect(() => {
    const fetchAttendees = async () => {
      if (!selectedEventId) return;
      const { data, error } = await supabase
        .from("attendees")
        .select("id, name, email, status, checked_in")
        .eq("event_id", selectedEventId)
        .order("name", { ascending: true });

      if (error) {
        console.error("Error fetching attendees:", error);
      } else {
        setAttendees(data || []);
        setFilteredAttendee(null);
        setShowWarning(false);
      }
    };
    fetchAttendees();
  }, [selectedEventId]);

  // ✅ Handle Attendee Search
  const handleSearch = () => {
    if (!searchQuery.trim()) return;

    const attendee = attendees.find(a => a.name.toLowerCase() === searchQuery.toLowerCase());
    if (attendee) {
      setFilteredAttendee(attendee);
      setShowWarning(false);
    } else {
      setFilteredAttendee(null);
      setShowWarning(true);
    }
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
      status: newAttendee.status ? newAttendee.status.trim().toUpperCase() : null,
      checked_in: false,
    }).select("*").single();

    if (error) {
      console.error("Error registering attendee:", error);
      alert("Failed to register attendee.");
    } else {
      setAttendees(prev => [...prev, data]);
      setFilteredAttendee(data);
      alert("Registration successful!");
    }
  };

  // ✅ Handle Check-In with Status Update
  // const checkInAttendee = async (attendeeId: string) => {
  //   let statusToUpdate = selectedStatus || (filteredAttendee ? filteredAttendee.status : "");

  //   if (!statusToUpdate) {
  //     alert("Please select a status before checking in.");
  //     return;
  //   }

  //   const { data, error } = await supabase.from("attendees").update({
  //     checked_in: true,
  //     status: statusToUpdate.trim().toUpperCase()
  //   }).eq("id", attendeeId).select("*").single();

  //   if (error) {
  //     console.error("Error checking in attendee:", error);
  //     alert("Failed to check in attendee.");
  //   } else {
  //     setAttendees(prev =>
  //       prev.map(attendee => (attendee.id === attendeeId ? { ...attendee, checked_in: true, status: data.status } : attendee))
  //     );
  //     setFilteredAttendee(prev => prev ? { ...prev, checked_in: true, status: data.status } : null);
  //     alert("Check-in successful!");
  //   }
  // };

  // const checkInAttendee = async (attendeeId: string) => {
  //   let statusToUpdate = selectedStatus || (filteredAttendee ? filteredAttendee.status : '');
  
  //   if (!statusToUpdate) {
  //     alert('Please select a status before checking in.');
  //     return;
  //   }
  
  //   try {
  //     const { data, error } = await supabase
  //       .from('attendees')
  //       .update({
  //         checked_in: true,
  //         status: statusToUpdate.trim().toUpperCase(),
  //       })
  //       .eq('id', attendeeId)
  //       .select()
  //       .single(); // ✅ Ensure we are updating only one row and retrieving the updated data
  
  //     if (error) {
  //       console.error('Error checking in attendee:', error);
  //       alert('Failed to check in attendee.');
  //     } else {
  //       setCheckedIn(true);
  //       setAttendees(prev =>
  //         prev.map(attendee =>
  //           attendee.id === attendeeId ? { ...attendee, checked_in: true, status: statusToUpdate } : attendee
  //         )
  //       );
  //       setFilteredAttendee(prev => prev ? { ...prev, checked_in: true, status: statusToUpdate } : null);
  //       alert('Check-in successful!');
  //     }
  //   } catch (err) {
  //     console.error("Unexpected error:", err);
  //     alert("An unexpected error occurred. Please try again.");
  //   }
  // };
  const checkInAttendee = async (attendeeId: string) => {
    let statusToUpdate = selectedStatus || (filteredAttendee?.status?.trim().toLowerCase() || '');

  
    // ✅ Ensure status is always valid
    if (!statusToUpdate) {
      alert("Please select 'Single' or 'Married' before checking in.");
      return;
    }
  
    const validStatuses = ["single", "married"];
    if (!validStatuses.includes(statusToUpdate)) {
      alert("Invalid status. Only 'Single' or 'Married' is allowed.");
      return;
    }
  
    console.log("🔍 Checking in Attendee ID:", attendeeId);
    console.log("🔍 Status being updated to:", statusToUpdate.toUpperCase());
  
    try {
      const { data, error } = await supabase
        .from('attendees')
        .update({
          checked_in: true,
          status: statusToUpdate, // ✅ Ensure lowercase for consistency
        })
        .eq('id', attendeeId)
        .select()
        .single();
  
      if (error) {
        console.error("🚨 Supabase Error:", error);
        alert(`Failed to check in attendee. Error: ${error.message}`);
        return;
      }
  
      console.log("✅ Check-in successful! Updated attendee:", data);
  
      setCheckedIn(true);
      setAttendees(prev =>
        prev.map(attendee =>
          attendee.id === attendeeId ? { ...attendee, checked_in: true, status: statusToUpdate } : attendee
        )
      );
      setFilteredAttendee(prev => prev ? { ...prev, checked_in: true, status: statusToUpdate } : null);
      alert("Check-in successful!");
  
    } catch (err) {
      console.error("🔥 Unexpected error:", err);
      alert("An unexpected error occurred. Please try again.");
    }
  };
  

  return (
    <div className={styles.attendeeSearchContainer}>
      <h2 className={styles.title}>Search & Register Attendees</h2>

      {/* ✅ Select Event */}
      <div className={styles.selectSection}>
        <label>Select Event:</label>
        <select value={selectedEventId} onChange={(e) => setSelectedEventId(e.target.value)}>
          <option value="">-- Select an Event --</option>
          {events.map(event => (
            <option key={event.id} value={event.id}>{event.name}</option>
          ))}
        </select>
      </div>

      {/* ✅ Show Pre-Registered Attendees */}
      {selectedEventId && (
        <div className={styles.attendeeListContainer}>
          <h3>Pre-Registered Attendees</h3>
          {attendees.length > 0 ? (
            <ul className={styles.attendeeList}>
              {attendees.map(attendee => (
                <li key={attendee.id} className={styles.attendeeItem}>
                  {attendee.name} - {attendee.email || "No Email"} - {attendee.status || "No Status"} - {attendee.checked_in ? "✔ Checked In" : "❌ Not Checked In"}
                </li>
              ))}
            </ul>
          ) : (
            <p>No attendees found for this event.</p>
          )}
        </div>
      )}

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

      {/* ✅ If Attendee is Found */}
      {filteredAttendee && (
        <div className={styles.attendeeFound}>
          <h3>Attendee Found</h3>
          <p>{filteredAttendee.name} - {filteredAttendee.email || "No Email"} - {filteredAttendee.checked_in ? "✔ Checked In" : "❌ Not Checked In"}</p>

          {/* ✅ If Status is Missing, Prompt for Status */}
          {!filteredAttendee.status && (
            <div className={styles.statusSection}>
              <label>Select Marital Status:</label>
              <select onChange={(e) => setSelectedStatus(e.target.value)} className={styles.input}>
                <option value="">-- Select --</option>
                <option value="single">Single</option>
                <option value="married">Married</option>
              </select>
            </div>
          )}

          <button
            onClick={() => checkInAttendee(filteredAttendee.id)}
            className={styles.button}
          >
            Check In
          </button>
        </div>
      )}

      {/* ✅ Warning Message if Not Found */}
      {showWarning && (
        <div className={styles.warningMessage}>
          <p>Attendee not found. Please register below.</p>
        </div>
      )}

      {/* ✅ Walk-In Registration */}
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
