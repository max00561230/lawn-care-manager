"use client";

import { useState } from "react";
import { useAppointments,  } from "@/lib/storage";
import { APPOINTMENT_STATUSES } from "@/lib/constants";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

type ViewMode = "month" | "week" | "day";

interface AppointmentWithRelations {
  id: string;
  title: string;
  date: string;
  start_time?: string;
  end_time?: string;
  status: string;
  customerName?: string;
  serviceName?: string;
  notes?: string;
}

export default function CalendarPage() {
  const { appointments } = useAppointments();
  const [view, setView] = useState<ViewMode>("month");
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedAppointment, setSelectedAppointment] = useState<AppointmentWithRelations | null>(null);

  const aptData: AppointmentWithRelations[] = appointments.map((a) => ({
    id: a.id,
    title: a.title,
    date: a.date,
    start_time: a.start_time,
    end_time: a.end_time,
    status: a.status,
    customerName: a.customer?.name,
    serviceName: a.service?.name,
    notes: a.notes,
  }));

  const getStatusColor = (status: string) => {
    const found = APPOINTMENT_STATUSES.find((s) => s.value === status);
    return found?.color || "#94a3b8";
  };

  const getStatusLabel = (status: string) => {
    const found = APPOINTMENT_STATUSES.find((s) => s.value === status);
    return found?.label || status;
  };

  const navigateMonth = (dir: number) => {
    setCurrentDate((prev) => { const d = new Date(prev); d.setMonth(d.getMonth() + dir); return d; });
  };

  const navigateWeek = (dir: number) => {
    setCurrentDate((prev) => { const d = new Date(prev); d.setDate(d.getDate() + dir * 7); return d; });
  };

  const navigateDay = (dir: number) => {
    setCurrentDate((prev) => { const d = new Date(prev); d.setDate(d.getDate() + dir); return d; });
  };

  const getMonthDays = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const days: (Date | null)[] = [];
    for (let i = 0; i < firstDay; i++) days.push(null);
    for (let i = 1; i <= daysInMonth; i++) days.push(new Date(year, month, i));
    return days;
  };

  const getWeekDays = () => {
    const start = new Date(currentDate);
    start.setDate(start.getDate() - start.getDay());
    return Array.from({ length: 7 }, (_, i) => { const d = new Date(start); d.setDate(d.getDate() + i); return d; });
  };

  const formatDateStr = (d: Date) => d.toISOString().split("T")[0];
  const todayStr = new Date().toISOString().split("T")[0];

  // HOURS for week/day view
  const hours = Array.from({ length: 12 }, (_, i) => i + 7); // 7am - 6pm

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Calendar</h1>
        <div className="flex gap-1 bg-white rounded-2xl shadow-sm border border-gray-100 p-1">
          {(["month", "week", "day"] as ViewMode[]).map((v) => (
            <button
              key={v}
              onClick={() => setView(v)}
              className={`px-3 py-1.5 rounded-xl text-sm font-medium transition-colors ${
                view === v ? "bg-green-700 text-white" : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              {v.charAt(0).toUpperCase() + v.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between bg-white rounded-2xl shadow-sm border border-gray-100 px-4 py-3">
        <button onClick={() => { if (view === "month") navigateMonth(-1); else if (view === "week") navigateWeek(-1); else navigateDay(-1); }}
          className="p-1 rounded-xl hover:bg-green-100 text-green-700">
          <ChevronLeft className="w-5 h-5" />
        </button>
        <h2 className="text-lg font-semibold text-gray-900">
          {view === "month" && currentDate.toLocaleDateString("en-US", { month: "long", year: "numeric" })}
          {view === "week" && `${getWeekDays()[0].toLocaleDateString("en-US", { month: "short", day: "numeric" })} — ${getWeekDays()[6].toLocaleDateString("en-US", { month: "short", day: "numeric" })}`}
          {view === "day" && currentDate.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" })}
        </h2>
        <button onClick={() => { if (view === "month") navigateMonth(1); else if (view === "week") navigateWeek(1); else navigateDay(1); }}
          className="p-1 rounded-xl hover:bg-green-100 text-green-700">
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* MONTH VIEW */}
      {view === "month" && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="grid grid-cols-7 border-b border-gray-200">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
              <div key={d} className="px-2 py-3 text-center text-xs font-semibold text-gray-500">{d}</div>
            ))}
          </div>
          <div className="grid grid-cols-7">
            {getMonthDays().map((day, i) => {
              if (!day) return <div key={`empty-${i}`} className="calendar-day bg-gray-50" />;
              const dateStr = formatDateStr(day);
              const dayAppts = aptData.filter((a) => a.date === dateStr);
              const isToday = dateStr === todayStr;
              return (
                <div key={dateStr} className={`calendar-day ${isToday ? "today" : ""}`}>
                  <div className={`text-sm font-medium mb-1 ${isToday ? "text-green-700" : "text-gray-700"}`}>
                    {day.getDate()}
                  </div>
                  <div className="space-y-1">
                    {dayAppts.slice(0, 3).map((apt) => (
                      <button
                        key={apt.id}
                        onClick={() => setSelectedAppointment(apt)}
                        className="w-full text-left text-xs px-1.5 py-0.5 rounded truncate"
                        style={{ backgroundColor: getStatusColor(apt.status) + "33", color: getStatusColor(apt.status) }}
                      >
                        {apt.start_time && <span className="font-mono">{apt.start_time} </span>}
                        {apt.title}
                      </button>
                    ))}
                    {dayAppts.length > 3 && (
                      <p className="text-xs text-gray-400">+{dayAppts.length - 3} more</p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* WEEK VIEW */}
      {view === "week" && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-auto">
          <div className="grid grid-cols-8 min-w-[800px]">
            <div className="border-b border-gray-200 p-2 text-xs font-semibold text-gray-500">Time</div>
            {getWeekDays().map((day) => {
              const dateStr = formatDateStr(day);
              const isToday = dateStr === todayStr;
              return (
                <div key={dateStr} className={`border-b border-gray-200 p-2 text-center text-xs font-semibold ${isToday ? "bg-green-50 text-green-700" : "text-gray-500"}`}>
                  {day.toLocaleDateString("en-US", { weekday: "short", day: "numeric" })}
                </div>
              );
            })}
          </div>
          {hours.map((hour) => (
            <div key={hour} className="grid grid-cols-8 min-w-[800px] border-b border-gray-50">
              <div className="p-2 text-xs text-gray-400 font-mono border-r border-gray-100">
                {hour > 12 ? hour - 12 : hour}{hour >= 12 ? "pm" : "am"}
              </div>
              {getWeekDays().map((day) => {
                const dateStr = formatDateStr(day);
                const cellAppts = aptData.filter((a) => {
                  if (a.date !== dateStr || !a.start_time) return false;
                  const h = parseInt(a.start_time.split(":")[0]);
                  return h === hour;
                });
                return (
                  <div key={dateStr + "-" + hour} className="p-1 min-h-[40px] border-r border-gray-50">
                    {cellAppts.map((apt) => (
                      <button
                        key={apt.id}
                        onClick={() => setSelectedAppointment(apt)}
                        className="w-full text-left text-xs px-1 py-0.5 rounded mb-0.5 truncate"
                        style={{ backgroundColor: getStatusColor(apt.status) + "33", color: getStatusColor(apt.status) }}
                      >
                        {apt.title}
                      </button>
                    ))}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      )}

      {/* DAY VIEW */}
      {view === "day" && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          {(() => {
            const dateStr = formatDateStr(currentDate);
            const dayAppts = aptData.filter((a) => a.date === dateStr).sort((a, b) => (a.start_time || "").localeCompare(b.start_time || ""));
            return (
              <div className="divide-y divide-gray-50">
                {hours.map((hour) => {
                  const hourAppts = dayAppts.filter((a) => {
                    if (!a.start_time) return false;
                    return parseInt(a.start_time.split(":")[0]) === hour;
                  });
                  return (
                    <div key={hour} className="flex">
                      <div className="w-20 p-3 text-sm text-gray-400 font-mono border-r border-gray-100">
                        {hour > 12 ? hour - 12 : hour}{hour >= 12 ? "pm" : "am"}
                      </div>
                      <div className="flex-1 p-2 min-h-[60px]">
                        {hourAppts.map((apt) => (
                          <button
                            key={apt.id}
                            onClick={() => setSelectedAppointment(apt)}
                            className="w-full text-left mb-1 p-2 rounded-xl border-l-4"
                            style={{
                              borderLeftColor: getStatusColor(apt.status),
                              backgroundColor: getStatusColor(apt.status) + "15",
                            }}
                          >
                            <div className="font-medium text-sm text-gray-900">{apt.title}</div>
                            <div className="text-xs text-gray-500 mt-0.5">
                              {apt.start_time} – {apt.end_time} {apt.customerName && `• ${apt.customerName}`}
                            </div>
                            <span className="status-badge mt-1" style={{ backgroundColor: getStatusColor(apt.status) + "22", color: getStatusColor(apt.status) }}>
                              {getStatusLabel(apt.status)}
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>
                  );
                })}
                {dayAppts.filter((a) => !a.start_time).map((apt) => (
                  <div key={apt.id} className="flex">
                    <div className="w-20 p-3 text-sm text-gray-400 border-r border-gray-100">—</div>
                    <div className="flex-1 p-2">
                      <button
                        onClick={() => setSelectedAppointment(apt)}
                        className="w-full text-left p-2 rounded-xl border-l-4 border-l-gray-400 bg-gray-50"
                      >
                        <div className="font-medium text-sm">{apt.title}</div>
                        <span className="status-badge mt-1" style={{ backgroundColor: getStatusColor(apt.status) + "22", color: getStatusColor(apt.status) }}>
                          {getStatusLabel(apt.status)}
                        </span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            );
          })()}
        </div>
      )}

      {/* Appointment detail modal */}
      {selectedAppointment && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setSelectedAppointment(null)}>
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-start justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900">{selectedAppointment.title}</h3>
              <button onClick={() => setSelectedAppointment(null)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Date</span>
                <span className="font-medium">{selectedAppointment.date}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Time</span>
                <span className="font-medium">{selectedAppointment.start_time || "—"}{selectedAppointment.end_time ? ` – ${selectedAppointment.end_time}` : ""}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Customer</span>
                <span className="font-medium">{selectedAppointment.customerName || "—"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Service</span>
                <span className="font-medium">{selectedAppointment.serviceName || "—"}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-500">Status</span>
                <span className="status-badge" style={{ backgroundColor: getStatusColor(selectedAppointment.status) + "22", color: getStatusColor(selectedAppointment.status) }}>
                  {getStatusLabel(selectedAppointment.status)}
                </span>
              </div>
              {selectedAppointment.notes && (
                <div>
                  <span className="text-gray-500">Notes</span>
                  <p className="mt-1 text-gray-700 bg-gray-50 rounded-xl p-2">{selectedAppointment.notes}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}