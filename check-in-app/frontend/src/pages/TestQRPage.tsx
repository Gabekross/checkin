import React, { useState, useEffect, useRef } from "react";
import { supabase } from "../supabase";
import QRCodeGenerator from "../components/QRCodeGenerator";
import styles from "../styles/TestQRPage.module.scss";

const TestQRPage: React.FC = () => {
  const [eventId, setEventId] = useState<string | null>(null);
  const [events, setEvents] = useState<{ id: string; name: string }[]>([]);
  const qrCodeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchEvents = async () => {
      const { data, error } = await supabase.from("events").select("id, name").order("created_at", { ascending: false });
      if (error) {
        console.error("Error fetching events:", error);
      } else {
        setEvents(data);
      }
    };
    fetchEvents();
  }, []);

  // ✅ Download QR Code as Full-Screen Image
  const handleDownloadQR = () => {
    if (qrCodeRef.current) {
      const canvas = qrCodeRef.current.querySelector("canvas");
      if (canvas) {
        const link = document.createElement("a");
        link.href = canvas.toDataURL("image/png");
        link.download = `event_qr_${eventId}.png`;
        link.click();
      }
    }
  };

  // ✅ Print QR Code Full-Screen
  const handlePrintQR = () => {
    if (qrCodeRef.current) {
      const qrCodeHtml = qrCodeRef.current.innerHTML;
      const printWindow = window.open("", "_blank");
      if (printWindow) {
        printWindow.document.write(`
          <html>
            <head>
              <title>Print QR Code</title>
              <style>
                body { margin: 0; display: flex; justify-content: center; align-items: center; height: 100vh; }
                .qr-code-container { width: 100vw; height: 100vh; display: flex; justify-content: center; align-items: center; }
                .qr-code-container canvas { width: 100vw !important; height: 100vh !important; }
              </style>
            </head>
            <body>
              <div class="qr-code-container">${qrCodeHtml}</div>
              <script>
                setTimeout(() => { window.print(); window.close(); }, 500);
              </script>
            </body>
          </html>
        `);
        printWindow.document.close();
      }
    }
  };

  return (
    <div className={styles.testQRContainer}>
      <h2 className={styles.title}>Generate QR Code for an Event</h2>

      <label className={styles.label}>Select Event:</label>
      <select value={eventId || ""} onChange={(e) => setEventId(e.target.value)} className={styles.select}>
        <option value="">-- Select an Event --</option>
        {events.map((event) => (
          <option key={event.id} value={event.id}>
            {event.name}
          </option>
        ))}
      </select>

      {/* ✅ Display QR Code */}
      {eventId && (
        <div className={styles.qrCodeContainer} ref={qrCodeRef}>
          <QRCodeGenerator eventId={eventId} />
        </div>
      )}

      {/* ✅ Buttons for Download and Print */}
      {eventId && (
        <div className={styles.buttonGroup}>
          <button onClick={handleDownloadQR} className={styles.button}>Download QR Code</button>
          <button onClick={handlePrintQR} className={styles.button}>Print QR Code</button>
        </div>
      )}
    </div>
  );
};

export default TestQRPage;
