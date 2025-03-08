import React, { useEffect, useState } from "react";
import { supabase } from "../supabase";
import { Line } from "react-chartjs-2";
import "chart.js/auto";
import * as XLSX from "xlsx";
import styles from "../styles/CheckInAnalytics.module.scss";

const CheckInAnalytics: React.FC = () => {
  const [events, setEvents] = useState<{ id: string; name: string }[]>([]);
  const [selectedEventId, setSelectedEventId] = useState<string>("");
  const [totalAttendees, setTotalAttendees] = useState<number>(0);
  const [checkedInCount, setCheckedInCount] = useState<number>(0);
  const [checkInTimes, setCheckInTimes] = useState<string[]>([]);
  const [noShowAttendees, setNoShowAttendees] = useState<{ name: string; email?: string }[]>([]);
  const [attendees, setAttendees] = useState<
    { name: string; email?: string; status?: string; checked_in: boolean; check_in_time?: string }[]
  >([]);

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
        .select("name, email, status, checked_in, check_in_time")
        .eq("event_id", selectedEventId);

      if (error) {
        console.error("Error fetching check-in stats:", error);
      } else {
        setTotalAttendees(data.length);
        setCheckedInCount(data.filter(a => a.checked_in).length);
        setCheckInTimes(data.filter(a => a.checked_in).map(a => a.check_in_time || ""));
        setNoShowAttendees(data.filter(a => !a.checked_in));
        setAttendees(data);
      }
    };

    fetchCheckInStats();
  }, [selectedEventId]);

  // ✅ Export Function
  const exportToExcel = () => {
    if (attendees.length === 0) {
      alert("No attendees to export.");
      return;
    }

    // ✅ Format Data for Excel
    const formattedData = attendees.map((attendee) => ({
      "Full Name": attendee.name,
      Email: attendee.email || "N/A",
      Status: attendee.status || "N/A",
      "Checked In": attendee.checked_in ? "✔ Checked In" : "❌ Not Checked In",
      "Check-In Time": attendee.check_in_time || "N/A",
    }));

    // ✅ Create a New Workbook & Worksheet
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(formattedData);

    // ✅ Auto-Size Columns
    const wsCols = [
      { wch: 20 }, // Full Name
      { wch: 25 }, // Email
      { wch: 15 }, // Status
      { wch: 15 }, // Checked In
      { wch: 20 }, // Check-In Time
    ];
    worksheet["!cols"] = wsCols;

    XLSX.utils.book_append_sheet(workbook, worksheet, "Attendees");

    // ✅ Download File
    XLSX.writeFile(workbook, `${events.find(e => e.id === selectedEventId)?.name || "Event"}_Attendees.xlsx`);
  };

  // ✅ Chart Data for Check-in Trends
  const chartData = {
    labels: checkInTimes.map(time => new Date(time).toLocaleTimeString()),
    datasets: [
      {
        label: "Check-ins Over Time",
        data: checkInTimes.map((_, index) => index + 1),
        fill: false,
        borderColor: "orange",
        borderWidth: 2,
        borderDash: [5, 5], // Creates a dashed/dotted line effect
        pointBackgroundColor: "blue", // Dot color
        pointBorderColor: "blue",
        pointRadius: 3, // Adjust dot size
      },
    ],
  };

  return (
    <div className={styles.analyticsContainer}>
      <h2 className={styles.title}>Dashboard</h2>

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
            <Line
              data={chartData}
              options={{
                responsive: true,
                scales: {
                  y: {
                    beginAtZero: true,
                    suggestedMin: 0,
                    suggestedMax: Math.max(checkInTimes.length, 300),
                    ticks: {
                      stepSize: 10,
                    },
                  },
                  x: {
                    ticks: {
                      autoSkip: true,
                      maxTicksLimit: 300,
                      callback: function (value, index, values) {
                        // ✅ Format time without seconds
                        return new Date(checkInTimes[index]).toLocaleTimeString("en-US", {
                          hour: "2-digit",
                          minute: "2-digit",
                          hour12: true, // Change to false for 24-hour format
                        });
                      },
                    },
                  },
                },
              }}
            />
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

          {/* ✅ Export to Excel Button */}
          <button onClick={exportToExcel} className={styles.exportButton}>
            📥 Export to Excel
          </button>
        </>
      )}
    </div>
  );
};

export default CheckInAnalytics;
