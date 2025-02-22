import React, { useEffect, useState } from "react";
import { supabase } from "../supabase";
import { Line } from "react-chartjs-2";
import "chart.js/auto";
import styles from "../styles/CheckInAnalytics.module.scss";

const CheckInAnalytics: React.FC = () => {
  const [events, setEvents] = useState<{ id: string; name: string }[]>([]);
  const [selectedEventId, setSelectedEventId] = useState<string>("");
  const [totalAttendees, setTotalAttendees] = useState<number>(0);
  const [checkedInCount, setCheckedInCount] = useState<number>(0);
  const [checkInTimes, setCheckInTimes] = useState<string[]>([]);
  const [noShowAttendees, setNoShowAttendees] = useState<{ name: string; email?: string }[]>([]);

  useEffect(() => {
    const fetchEvents = async () => {
      const { data, error } = await supabase.from("events").select("id, name");
      if (error) console.error("Error fetching events:", error);
      else setEvents(data);
    };
    fetchEvents();
  }, []);

  useEffect(() => {
    if (!selectedEventId) return;

    const fetchCheckInStats = async () => {
      const { data, error } = await supabase
        .from("attendees")
        .select("name, email, checked_in, check_in_time")
        .eq("event_id", selectedEventId);

      if (error) {
        console.error("Error fetching check-in stats:", error);
      } else {
        setTotalAttendees(data.length);
        setCheckedInCount(data.filter(a => a.checked_in).length);
        setCheckInTimes(data.filter(a => a.checked_in).map(a => a.check_in_time || ""));
        setNoShowAttendees(data.filter(a => !a.checked_in));
      }
    };

    fetchCheckInStats();
  }, [selectedEventId]);

  // ✅ Chart Data for Check-in Trends
  const chartData = {
    labels: checkInTimes.map(time => new Date(time).toLocaleTimeString()),
    datasets: [
      {
        label: "Check-ins Over Time",
        data: checkInTimes.map((_, index) => index + 1),
        fill: false,
        borderColor: "blue",
      },
    ],
  };

  return (
    <div className={styles.analyticsContainer}>
      <h2 className={styles.title}>Check-in Analytics</h2>

      {/* Select Event Dropdown */}
      <div className={styles.selectSection}>
        <label>Select Event:</label>
        <select value={selectedEventId} onChange={(e) => setSelectedEventId(e.target.value)}>
          <option value="">-- Select an Event --</option>
          {events.map(event => (
            <option key={event.id} value={event.id}>{event.name}</option>
          ))}
        </select>
      </div>

      {/* Check-in Statistics */}
      {selectedEventId && (
        <>
          <div className={styles.statsSection}>
            <h3>Total Registered: {totalAttendees}</h3>
            <h3>Checked In: {checkedInCount}</h3>
            <h3>No Shows: {totalAttendees - checkedInCount}</h3>
          </div>

          {/* Check-in Trends Chart */}
          <div className={styles.chartContainer}>
            <h3>Check-in Trend Over Time</h3>
            <Line data={chartData} />
          </div>

          {/* No Show Attendees */}
          <div className={styles.noShowContainer}>
            <h3>Attendees Who Did Not Check-in</h3>
            <ul>
              {noShowAttendees.length > 0 ? (
                noShowAttendees.map((attendee, index) => (
                  <li key={index}>{attendee.name} - {attendee.email || "No Email"}</li>
                ))
              ) : (
                <p>All attendees checked in!</p>
              )}
            </ul>
          </div>
        </>
      )}
    </div>
  );
};

export default CheckInAnalytics;
