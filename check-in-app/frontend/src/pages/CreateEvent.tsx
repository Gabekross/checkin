import React, { useState } from "react";
import { supabase } from "../supabase";
import styles from "../styles/CreateEvent.module.scss";

const CreateEvent: React.FC = () => {
  const [eventName, setEventName] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [eventLocation, setEventLocation] = useState("");
  const [eventImage, setEventImage] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  // ✅ Handle File Selection
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setEventImage(file);
      setPreviewImage(URL.createObjectURL(file)); // ✅ Show preview before upload
    }
  };

  // ✅ Handle Event Creation
  const handleCreateEvent = async () => {
    if (!eventName || !eventDate || !eventLocation) {
      alert("Please fill in all fields.");
      return;
    }

    let imageUrl = null;

    if (eventImage) {
      setUploading(true);
      const filePath = `events/${Date.now()}_${eventImage.name}`;

      const { data, error: uploadError } = await supabase.storage.from("event-images").upload(filePath, eventImage);

      if (uploadError) {
        console.error("🚨 Image upload failed:", uploadError.message);
        alert("Failed to upload image.");
        setUploading(false);
        return;
      }

      // ✅ Get Public Image URL from Supabase
      imageUrl = supabase.storage.from("event-images").getPublicUrl(filePath).data.publicUrl;
    }

    // ✅ Save Event Data to Supabase
    const { error: eventError } = await supabase.from("events").insert([
      {
        name: eventName,
        date: eventDate,
        location: eventLocation,
        image_url: imageUrl, // ✅ Store image URL
      },
    ]);

    setUploading(false);

    if (eventError) {
      console.error("🚨 Event creation failed:", eventError.message);
      alert("Failed to create event.");
      return;
    }

    alert("🎉 Event created successfully!");
    setEventName("");
    setEventDate("");
    setEventLocation("");
    setPreviewImage(null);
    setEventImage(null);
  };

  return (
    <div className={styles.createEventContainer}>
      <h2>Create Event</h2>
      
      <input
        type="text"
        placeholder="Event Name"
        value={eventName}
        onChange={(e) => setEventName(e.target.value)}
        className={styles.input}
      />
      <input
        type="date"
        placeholder="Event Date"
        value={eventDate}
        onChange={(e) => setEventDate(e.target.value)}
        className={styles.input}
      />
      <input
        type="text"
        placeholder="Event Location"
        value={eventLocation}
        onChange={(e) => setEventLocation(e.target.value)}
        className={styles.input}
      />

      {/* ✅ Image Upload Section */}
      <label className={styles.fileLabel}>📷 Upload Event Image</label>
      <input type="file" accept="image/*" onChange={handleFileChange} className={styles.fileInput} />

      {previewImage && (
        <div className={styles.previewImage}>
          <h3>Event Image Preview:</h3>
          <img src={previewImage} alt="Event" />
        </div>
      )}

      <button onClick={handleCreateEvent} className={styles.button} disabled={uploading}>
        {uploading ? "Uploading..." : "Create Event"}
      </button>
    </div>
  );
};

export default CreateEvent;
