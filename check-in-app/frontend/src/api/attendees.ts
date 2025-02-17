import { supabase } from '../supabase';

export const fetchAttendees = async (eventId: string) => {
  const { data, error } = await supabase
    .from('attendees')
    .select('*')
    .eq('event_id', eventId);
  if (error) throw new Error(error.message);
  return data;
};
