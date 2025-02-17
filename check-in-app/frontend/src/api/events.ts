import { supabase } from '../supabase';

export const fetchEvents = async () => {
  const { data, error } = await supabase.from('events').select('*');
  if (error) throw new Error(error.message);
  return data;
};
