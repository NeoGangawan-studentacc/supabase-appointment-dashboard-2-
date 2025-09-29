
export interface Appointment {
  id: number;
  created_at: string;
  Status: string;
  Appt_type: string;
  [key: string]: any; 
}

export interface ChartDataPoint {
  name: string;
  value: number;
}
