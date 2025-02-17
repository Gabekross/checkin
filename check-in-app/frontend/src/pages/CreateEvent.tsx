import React, { useState } from 'react';
import { supabase } from '../supabase';
import { useNavigate } from 'react-router-dom';

const CreateEvent: React.FC = () => {
  const [name, setName] = useState('');
  const [date, setDate] = useState('');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const navigate = useNavigate();

  const handleCreateEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    const { data, error } = await supabase.from('events').insert([{ name, date, location, description }]);
    if (error) return alert(error.message);
    navigate('/');
  };

  return (
    <form onSubmit={handleCreateEvent}>
      <input type="text" placeholder="Event Name" value={name} onChange={e => setName(e.target.value)} required />
      <input type="datetime-local" value={date} onChange={e => setDate(e.target.value)} required />
      <input type="text" placeholder="Location" value={location} onChange={e => setLocation(e.target.value)} required />
      <textarea placeholder="Description" value={description} onChange={e => setDescription(e.target.value)} />
      <button type="submit">Create Event</button>
    </form>
  );
};

export default CreateEvent;
