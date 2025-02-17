import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '../supabase';

const EventDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [event, setEvent] = useState<any>(null);

  useEffect(() => {
    const fetchEventDetails = async () => {
      const { data, error } = await supabase.from('events').select('*').eq('id', id).single();
      if (error) console.error(error);
      else setEvent(data);
    };
    fetchEventDetails();
  }, [id]);

  if (!event) return <p>Loading...</p>;

  return (
    <div>
      <h1>{event.name}</h1>
      <p>Date: {new Date(event.date).toLocaleString()}</p>
      <p>Location: {event.location}</p>
      <p>{event.description}</p>
    </div>
  );
};

export default EventDetails;