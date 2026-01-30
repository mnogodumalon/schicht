import { useState, useMemo } from 'react';
import { format, startOfWeek, addDays, isSameDay } from 'date-fns';
import { de } from 'date-fns/locale';
import { ChevronLeft, ChevronRight, Plus, Trash2, Clock, User } from 'lucide-react';
import type { Employee, Shift } from '@/types/app';
import { employees, initialShifts } from '@/data/mockData';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';

export default function Dashboard() {
  const [currentWeekStart, setCurrentWeekStart] = useState(() =>
    startOfWeek(new Date(), { weekStartsOn: 1 })
  );
  const [shifts, setShifts] = useState<Shift[]>(initialShifts);
  const [editingShift, setEditingShift] = useState<Shift | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  // Form State
  const [formEmployeeId, setFormEmployeeId] = useState('');
  const [formStartTime, setFormStartTime] = useState('09:00');
  const [formEndTime, setFormEndTime] = useState('17:00');

  const weekDays = useMemo(() => {
    return Array.from({ length: 7 }, (_, i) => addDays(currentWeekStart, i));
  }, [currentWeekStart]);

  const goToPreviousWeek = () => {
    setCurrentWeekStart((prev) => addDays(prev, -7));
  };

  const goToNextWeek = () => {
    setCurrentWeekStart((prev) => addDays(prev, 7));
  };

  const goToToday = () => {
    setCurrentWeekStart(startOfWeek(new Date(), { weekStartsOn: 1 }));
  };

  const getShiftsForDay = (date: Date): Shift[] => {
    const dateStr = format(date, 'yyyy-MM-dd');
    return shifts.filter((s) => s.date === dateStr);
  };

  const getEmployeeById = (id: string): Employee | undefined => {
    return employees.find((e) => e.id === id);
  };

  const openAddDialog = (date: Date) => {
    setSelectedDate(format(date, 'yyyy-MM-dd'));
    setEditingShift(null);
    setFormEmployeeId('');
    setFormStartTime('09:00');
    setFormEndTime('17:00');
    setIsDialogOpen(true);
  };

  const openEditDialog = (shift: Shift) => {
    setEditingShift(shift);
    setSelectedDate(shift.date);
    setFormEmployeeId(shift.employeeId);
    setFormStartTime(shift.startTime);
    setFormEndTime(shift.endTime);
    setIsDialogOpen(true);
  };

  const handleSaveShift = () => {
    if (!formEmployeeId || !selectedDate) return;

    if (editingShift) {
      // Update existing shift
      setShifts((prev) =>
        prev.map((s) =>
          s.id === editingShift.id
            ? {
                ...s,
                employeeId: formEmployeeId,
                startTime: formStartTime,
                endTime: formEndTime,
              }
            : s
        )
      );
    } else {
      // Add new shift
      const newShift: Shift = {
        id: Date.now().toString(),
        employeeId: formEmployeeId,
        date: selectedDate,
        startTime: formStartTime,
        endTime: formEndTime,
      };
      setShifts((prev) => [...prev, newShift]);
    }

    setIsDialogOpen(false);
    setEditingShift(null);
  };

  const handleDeleteShift = (shiftId: string) => {
    setShifts((prev) => prev.filter((s) => s.id !== shiftId));
  };

  const isToday = (date: Date) => isSameDay(date, new Date());

  // Stats
  const todayShifts = getShiftsForDay(new Date());
  const weekTotalHours = useMemo(() => {
    let total = 0;
    shifts.forEach((shift) => {
      const shiftDate = new Date(shift.date);
      if (
        shiftDate >= currentWeekStart &&
        shiftDate < addDays(currentWeekStart, 7)
      ) {
        const [startH, startM] = shift.startTime.split(':').map(Number);
        const [endH, endM] = shift.endTime.split(':').map(Number);
        const hours = endH - startH + (endM - startM) / 60;
        total += hours;
      }
    });
    return total;
  }, [shifts, currentWeekStart]);

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
              Schichtplaner
            </h1>
            <p className="text-gray-500 mt-1">
              Wochenansicht - Klicken Sie auf eine Schicht zum Bearbeiten
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={goToToday}>
              Heute
            </Button>
            <Button variant="outline" size="icon" onClick={goToPreviousWeek}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-sm font-medium min-w-[180px] text-center">
              {format(currentWeekStart, 'd. MMM', { locale: de })} -{' '}
              {format(addDays(currentWeekStart, 6), 'd. MMM yyyy', {
                locale: de,
              })}
            </span>
            <Button variant="outline" size="icon" onClick={goToNextWeek}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <User className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Heute im Dienst</p>
                  <p className="text-2xl font-bold">{todayShifts.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Clock className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Wochenstunden</p>
                  <p className="text-2xl font-bold">{weekTotalHours}h</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <User className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Mitarbeiter</p>
                  <p className="text-2xl font-bold">{employees.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-orange-100 rounded-lg">
                  <Clock className="h-5 w-5 text-orange-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Schichten/Woche</p>
                  <p className="text-2xl font-bold">
                    {
                      shifts.filter((s) => {
                        const d = new Date(s.date);
                        return (
                          d >= currentWeekStart &&
                          d < addDays(currentWeekStart, 7)
                        );
                      }).length
                    }
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Week Grid */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Wochenansicht</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-7 gap-2">
              {weekDays.map((day) => (
                <div
                  key={day.toISOString()}
                  className={`min-h-[200px] border rounded-lg p-2 ${
                    isToday(day)
                      ? 'bg-blue-50 border-blue-300'
                      : 'bg-white border-gray-200'
                  }`}
                >
                  {/* Day Header */}
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <p className="text-xs font-medium text-gray-500 uppercase">
                        {format(day, 'EEE', { locale: de })}
                      </p>
                      <p
                        className={`text-lg font-bold ${
                          isToday(day) ? 'text-blue-600' : 'text-gray-900'
                        }`}
                      >
                        {format(day, 'd')}
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7"
                      onClick={() => openAddDialog(day)}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>

                  {/* Shifts */}
                  <div className="space-y-1">
                    {getShiftsForDay(day).map((shift) => {
                      const employee = getEmployeeById(shift.employeeId);
                      return (
                        <div
                          key={shift.id}
                          onClick={() => openEditDialog(shift)}
                          className="p-2 rounded-md cursor-pointer hover:opacity-80 transition-opacity"
                          style={{
                            backgroundColor: employee?.color + '20',
                            borderLeft: `3px solid ${employee?.color}`,
                          }}
                        >
                          <p
                            className="text-xs font-medium truncate"
                            style={{ color: employee?.color }}
                          >
                            {employee?.name}
                          </p>
                          <p className="text-xs text-gray-600">
                            {shift.startTime} - {shift.endTime}
                          </p>
                        </div>
                      );
                    })}
                    {getShiftsForDay(day).length === 0 && (
                      <p className="text-xs text-gray-400 text-center py-4">
                        Keine Schichten
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Employees Legend */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Mitarbeiter</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {employees.map((emp) => (
                <Badge
                  key={emp.id}
                  variant="outline"
                  className="px-3 py-1"
                  style={{
                    borderColor: emp.color,
                    backgroundColor: emp.color + '10',
                  }}
                >
                  <span
                    className="w-2 h-2 rounded-full mr-2"
                    style={{ backgroundColor: emp.color }}
                  />
                  {emp.name} - {emp.role}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Edit/Add Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingShift ? 'Schicht bearbeiten' : 'Neue Schicht hinzufügen'}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {selectedDate && (
              <p className="text-sm text-gray-500">
                Datum:{' '}
                {format(new Date(selectedDate), 'EEEE, d. MMMM yyyy', {
                  locale: de,
                })}
              </p>
            )}

            <div className="space-y-2">
              <Label htmlFor="employee">Mitarbeiter</Label>
              <Select value={formEmployeeId} onValueChange={setFormEmployeeId}>
                <SelectTrigger>
                  <SelectValue placeholder="Mitarbeiter auswählen" />
                </SelectTrigger>
                <SelectContent>
                  {employees.map((emp) => (
                    <SelectItem key={emp.id} value={emp.id}>
                      <div className="flex items-center gap-2">
                        <span
                          className="w-2 h-2 rounded-full"
                          style={{ backgroundColor: emp.color }}
                        />
                        {emp.name}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="startTime">Startzeit</Label>
                <Input
                  id="startTime"
                  type="time"
                  value={formStartTime}
                  onChange={(e) => setFormStartTime(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="endTime">Endzeit</Label>
                <Input
                  id="endTime"
                  type="time"
                  value={formEndTime}
                  onChange={(e) => setFormEndTime(e.target.value)}
                />
              </div>
            </div>
          </div>

          <DialogFooter className="flex gap-2">
            {editingShift && (
              <Button
                variant="destructive"
                onClick={() => {
                  handleDeleteShift(editingShift.id);
                  setIsDialogOpen(false);
                }}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Löschen
              </Button>
            )}
            <DialogClose asChild>
              <Button variant="outline">Abbrechen</Button>
            </DialogClose>
            <Button onClick={handleSaveShift} disabled={!formEmployeeId}>
              {editingShift ? 'Speichern' : 'Hinzufügen'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
