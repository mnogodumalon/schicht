import type { Employee, Shift } from '@/types/app';

export const employees: Employee[] = [
  { id: '1', name: 'Anna Müller', role: 'Manager', color: '#3b82f6' },
  { id: '2', name: 'Thomas Schmidt', role: 'Verkäufer', color: '#10b981' },
  { id: '3', name: 'Lisa Weber', role: 'Verkäuferin', color: '#f59e0b' },
  { id: '4', name: 'Max Fischer', role: 'Aushilfe', color: '#8b5cf6' },
  { id: '5', name: 'Sarah Koch', role: 'Verkäuferin', color: '#ec4899' },
];

// Hilfsfunktion um das aktuelle Datum zu bekommen
const getDateString = (daysOffset: number): string => {
  const date = new Date();
  date.setDate(date.getDate() + daysOffset);
  return date.toISOString().split('T')[0];
};

// Wir berechnen den Montag der aktuellen Woche
const getMondayOfCurrentWeek = (): Date => {
  const now = new Date();
  const day = now.getDay();
  const diff = now.getDate() - day + (day === 0 ? -6 : 1);
  return new Date(now.setDate(diff));
};

const monday = getMondayOfCurrentWeek();
const getWeekDate = (dayOffset: number): string => {
  const date = new Date(monday);
  date.setDate(date.getDate() + dayOffset);
  return date.toISOString().split('T')[0];
};

export const initialShifts: Shift[] = [
  // Montag
  { id: '1', employeeId: '1', date: getWeekDate(0), startTime: '08:00', endTime: '16:00' },
  { id: '2', employeeId: '2', date: getWeekDate(0), startTime: '09:00', endTime: '17:00' },
  { id: '3', employeeId: '3', date: getWeekDate(0), startTime: '12:00', endTime: '20:00' },

  // Dienstag
  { id: '4', employeeId: '1', date: getWeekDate(1), startTime: '08:00', endTime: '16:00' },
  { id: '5', employeeId: '4', date: getWeekDate(1), startTime: '10:00', endTime: '18:00' },
  { id: '6', employeeId: '5', date: getWeekDate(1), startTime: '14:00', endTime: '22:00' },

  // Mittwoch
  { id: '7', employeeId: '2', date: getWeekDate(2), startTime: '08:00', endTime: '16:00' },
  { id: '8', employeeId: '3', date: getWeekDate(2), startTime: '08:00', endTime: '16:00' },
  { id: '9', employeeId: '5', date: getWeekDate(2), startTime: '12:00', endTime: '20:00' },

  // Donnerstag
  { id: '10', employeeId: '1', date: getWeekDate(3), startTime: '08:00', endTime: '16:00' },
  { id: '11', employeeId: '2', date: getWeekDate(3), startTime: '12:00', endTime: '20:00' },
  { id: '12', employeeId: '4', date: getWeekDate(3), startTime: '09:00', endTime: '17:00' },

  // Freitag
  { id: '13', employeeId: '1', date: getWeekDate(4), startTime: '08:00', endTime: '14:00' },
  { id: '14', employeeId: '3', date: getWeekDate(4), startTime: '10:00', endTime: '18:00' },
  { id: '15', employeeId: '5', date: getWeekDate(4), startTime: '14:00', endTime: '22:00' },

  // Samstag
  { id: '16', employeeId: '2', date: getWeekDate(5), startTime: '09:00', endTime: '15:00' },
  { id: '17', employeeId: '4', date: getWeekDate(5), startTime: '09:00', endTime: '15:00' },

  // Sonntag - geschlossen, keine Schichten
];
