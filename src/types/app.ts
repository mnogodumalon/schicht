// Schichtplaner Types

export interface Employee {
  id: string;
  name: string;
  role: string;
  color: string;
}

export interface Shift {
  id: string;
  employeeId: string;
  date: string; // YYYY-MM-DD
  startTime: string; // HH:MM
  endTime: string; // HH:MM
  note?: string;
}

export type ShiftType = 'morning' | 'afternoon' | 'night' | 'custom';
