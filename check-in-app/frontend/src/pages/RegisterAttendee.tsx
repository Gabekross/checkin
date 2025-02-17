// Attendee Registration Form
import React, { useState } from 'react';
import { supabase } from '../supabase';
import { useNavigate, useParams } from 'react-router-dom';

const RegisterAttendee: React.FC = () => {
  const { eventId } = useParams<{ eventId: string }>();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const navigate = useNavigate();

  const handleRegisterAttendee = async (e: React.FormEvent) => {
    e.preventDefault();
    const { data, error } = await supabase.from('attendees').insert([{ event_id: eventId, name, email, phone }]);
    if (error) return alert(error.message);
    navigate(`/event/${eventId}`);
  };

  return (
    <form onSubmit={handleRegisterAttendee}>
      <input type="text" placeholder="Full Name" value={name} onChange={e => setName(e.target.value)} required />
      <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
      <input type="tel" placeholder="Phone" value={phone} onChange={e => setPhone(e.target.value)} />
      <button type="submit">Register Attendee</button>
    </form>
  );
};

export default RegisterAttendee;