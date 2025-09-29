
import { createClient } from '@supabase/supabase-js';
import { Appointment } from '../types';

const supabaseUrl = 'https://iqtlnczxffxxakrwqzmk.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlxdGxuY3p4ZmZ4eGFrcndxem1rIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgxNjU5NDUsImV4cCI6MjA3Mzc0MTk0NX0.ZHpa2O2C1kWIrdIhYu0eWqpgjrPfSLhgod4oJeecXGA';

const supabase = createClient(supabaseUrl, supabaseKey);

export const fetchAppointments = async (): Promise<Appointment[]> => {
  const { data, error } = await supabase
    .from('Appointments')
    .select('Status, Appt_type');

  if (error) {
    console.error('Error fetching appointments:', error);
    throw new Error(error.message);
  }

  // Ensure data is not null and is an array before returning
  return (data || []) as Appointment[];
};
