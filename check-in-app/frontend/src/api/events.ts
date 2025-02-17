// Step 4: Event API (frontend/src/api/events.ts)
import { supabase } from '../supabase';

export const fetchEventById = async (eventId: string) => {
  const { data, error } = await supabase.from('events').select('*').eq('id', eventId).single();
  if (error) throw new Error(error.message);
  return data;
};

export const fetchEvents = async () => {
  const { data, error } = await supabase.from('events').select('*');
  if (error) throw new Error(error.message);
  return data;
};

export const createEvent = async (name: string, date: string, location: string, description?: string) => {
  const { data, error } = await supabase.from('events').insert([{ name, date, location, description }]).select();
  
  if (error) {
    console.error('Error creating event:', error);
    return null;
  }

  return data[0]; // Return the newly created event with event_id
};