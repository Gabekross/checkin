import React, { useState } from 'react';
import { supabase } from '../supabase';
import { useNavigate } from 'react-router-dom';
import styles from '../styles/CreateEvent.module.scss';

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
    alert('Event created successfully!');
    navigate('/');
  };

  return (
    <div className={styles.createEventContainer}>
      <h2 className={styles.title}>Create New Event</h2>
      <form onSubmit={handleCreateEvent} className={styles.eventForm}>
        <input 
          type="text" 
          placeholder="Event Name" 
          value={name} 
          onChange={e => setName(e.target.value)} 
          required 
          className={styles.input}
        />
        <input 
          type="datetime-local" 
          value={date} 
          onChange={e => setDate(e.target.value)} 
          required 
          className={styles.input}
        />
        <input 
          type="text" 
          placeholder="Location" 
          value={location} 
          onChange={e => setLocation(e.target.value)} 
          required 
          className={styles.input}
        />
        <textarea 
          placeholder="Description" 
          value={description} 
          onChange={e => setDescription(e.target.value)} 
          className={styles.textarea}
        />
        <button type="submit" className={styles.submitButton}>Create Event</button>
      </form>
    </div>
  );
};

export default CreateEvent;
