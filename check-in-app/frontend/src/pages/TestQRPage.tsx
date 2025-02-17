import React, { useState, useEffect } from 'react';
import { supabase } from '../supabase';
import { useNavigate } from 'react-router-dom';
import QRCodeGenerator from '../components/QRCodeGenerator';

const TestQRPage: React.FC = () => {
  const [eventId, setEventId] = useState<string | null>(null);
  const [events, setEvents] = useState<{ id: string; name: string }[]>([]);

  useEffect(() => {
    const fetchEvents = async () => {
      const { data, error } = await supabase.from('events').select('id, name').order('created_at', { ascending: false });
      if (error) {
        console.error('Error fetching events:', error);
      } else {
        setEvents(data);
      }
    };
    fetchEvents();
  }, []);

  return (
    <div>
      <h2>Generate QR Code for an Event</h2>
      <label>Select Event:</label>
      <select value={eventId || ''} onChange={(e) => setEventId(e.target.value)}>
        <option value="">-- Select an Event --</option>
        {events.map((event) => (
          <option key={event.id} value={event.id}>{event.name}</option>
        ))}
      </select>

      {eventId && <QRCodeGenerator eventId={eventId} />}
    </div>
  );
};

export default TestQRPage;
