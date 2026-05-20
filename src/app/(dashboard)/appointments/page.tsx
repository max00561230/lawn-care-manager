"use client";

import { useState } from "react";
import { useAppointments, useCustomers, useServices } from "@/lib/storage";
import { APPOINTMENT_STATUSES } from "@/lib/constants";
import { AppointmentStatus } from "@/types";
import { Plus, X, Check, ChevronDown } from "lucide-react";

const STATUS_TABS = [
  { value: "all", label: "All" },
  { value: "requested", label: "Requested" },
  { value: "approved", label: "Approved" },
  { value: "scheduled", label: "Scheduled" },
  { value: "today", label: "Today" },
  { value: "this_week", label: "This Week" },
];

export default function AppointmentsPage() {
  const { appointments, addAppointment, updateAppointment, deleteAppointment } = useAppointments();
  const { customers } = useCustomers();
  const { services } = useServices();
  const [statusFilter, setStatusFilter] = useState("all");
  const [showAddModal, setShowAddModal] = useState(false);
  const [formData, setFormData] = useState({
    customer_id: "", service_id: "", title: "", date: "", start_time: "", end_time: "", notes: "", is_recurring: false,
  });

  const today = new Date().toISOString().split("T")[0];
  const weekFromNow = new Date(Date.now() + 7 * 86400000).toISOString().split("T")[0];

  const filtered = appointments.filter((a) => {
    if (statusFilter === "all") return true;
    if (statusFilter === "today") return a.date === today;
    if (statusFilter === "this_week") return a.date >= today && a.date <= weekFromNow;
    return a.status === statusFilter;
  }).sort((a, b) => a.date.localeCompare(b.date) || (a.start_time || "").localeCompare(b.start_time || ""));

  const getStatusLabel = (status: string) => APPOINTMENT_STATUSES.find((s) => s.value === status)?.label || status;
  const getStatusColor = (status: string) => APPOINTMENT_STATUSES.find((s) => s.value === status)?.color || "#94a3b8";

  const statusOptions: AppointmentStatus[] = ["requested", "approved", "scheduled", "on_the_way", "in_progress", "completed", "cancelled", "rescheduled", "payment_pending", "paid"];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-green-900">Appointments</h1>
        <button onClick={() => setShowAddModal(true)} className="flex items-center gap-2 bg-green-700 text-white px-4 py-2 rounded-lg hover:bg-green-800 transition-colors text-sm font-medium">
          <Plus className="w-4 h-4" /> Add Appointment
        </button>
      </div>

      {/* Status filter tabs */}
      <div className="flex overflow-x-auto gap-1 bg-white rounded-lg shadow p-1 scrollbar-hide">
        {STATUS_TABS.map((tab) => (
          <button
            key={tab.value}
            onClick={() => setStatusFilter(tab.value)}
            className={`px-3 py-1.5 rounded text-sm font-medium whitespace-nowrap transition-colors ${
              statusFilter === tab.value ? "bg-green-700 text-white" : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Appointments list */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {filtered.length === 0 ? (
          <p className="text-gray-400 text-center py-8">No appointments found</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left font-medium text-gray-500">Date</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-500">Time</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-500">Customer</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-500">Service</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-500">Status</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-500">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map((apt) => {
                  const color = getStatusColor(apt.status);
                  const label = getStatusLabel(apt.status);
                  return (
                    <tr key={apt.id} className="hover:bg-green-50/50">
                      <td className="px-4 py-3 text-gray-700">{apt.date}</td>
                      <td className="px-4 py-3 text-gray-700 font-mono">{apt.start_time || "—"}</td>
                      <td className="px-4 py-3 text-gray-700">{apt.customer?.name || "—"}</td>
                      <td className="px-4 py-3 text-gray-700">{apt.service?.name || apt.title}</td>
                      <td className="px-4 py-3">
                        <span className="status-badge" style={{ backgroundColor: color + "22", color }}>{label}</span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          {apt.status === "requested" && (
                            <>
                              <button onClick={() => updateAppointment(apt.id, { status: "approved" })} className="p-1 text-green-600 hover:bg-green-100 rounded" title="Approve">
                                <Check className="w-4 h-4" />
                              </button>
                              <button onClick={() => updateAppointment(apt.id, { status: "cancelled" })} className="p-1 text-red-600 hover:bg-red-100 rounded" title="Reject">
                                <X className="w-4 h-4" />
                              </button>
                            </>
                          )}
                          <div className="relative group">
                            <select
                              value={apt.status}
                              onChange={(e) => updateAppointment(apt.id, { status: e.target.value as AppointmentStatus })}
                              className="appearance-none bg-gray-100 rounded px-2 py-1 text-xs font-medium pr-6 cursor-pointer"
                            >
                              {statusOptions.map((s) => <option key={s} value={s}>{getStatusLabel(s)}</option>)}
                            </select>
                            <ChevronDown className="absolute right-1 top-1/2 -translate-y-1/2 w-3 h-3 text-gray-400 pointer-events-none" />
                          </div>
                          <button onClick={() => { if (confirm("Delete this appointment?")) deleteAppointment(apt.id); }} className="p-1 text-gray-400 hover:text-red-600" title="Delete">
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add Appointment Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setShowAddModal(false)}>
          <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-green-900">Add Appointment</h3>
              <button onClick={() => setShowAddModal(false)} className="text-gray-400 hover:text-gray-600"><X className="w-5 h-5" /></button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
                <input type="text" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:border-green-500 focus:ring-1 focus:ring-green-500" placeholder="e.g., Lawn Mowing — John Smith" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Customer</label>
                  <select value={formData.customer_id} onChange={(e) => setFormData({ ...formData, customer_id: e.target.value })} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm">
                    <option value="">Select customer</option>
                    {customers.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Service</label>
                  <select value={formData.service_id} onChange={(e) => setFormData({ ...formData, service_id: e.target.value })} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm">
                    <option value="">Select service</option>
                    {services.filter((s) => s.is_active).map((s) => <option key={s.id} value={s.id}>{s.name} — ${s.base_price}</option>)}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date *</label>
                  <input type="date" value={formData.date} onChange={(e) => setFormData({ ...formData, date: e.target.value })} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Start Time</label>
                  <input type="time" value={formData.start_time} onChange={(e) => setFormData({ ...formData, start_time: e.target.value })} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">End Time</label>
                  <input type="time" value={formData.end_time} onChange={(e) => setFormData({ ...formData, end_time: e.target.value })} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" />
                </div>
                <div className="flex items-end pb-2">
                  <label className="flex items-center gap-2 text-sm">
                    <input type="checkbox" checked={formData.is_recurring} onChange={(e) => setFormData({ ...formData, is_recurring: e.target.checked })} className="rounded border-gray-300 text-green-700" />
                    Recurring
                  </label>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                <textarea value={formData.notes} onChange={(e) => setFormData({ ...formData, notes: e.target.value })} rows={3} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" />
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button onClick={() => setShowAddModal(false)} className="px-4 py-2 text-sm text-gray-600">Cancel</button>
              <button
                onClick={() => {
                  if (!formData.title || !formData.date) return;
                  addAppointment(formData);
                  setShowAddModal(false);
                  setFormData({ customer_id: "", service_id: "", title: "", date: "", start_time: "", end_time: "", notes: "", is_recurring: false });
                }}
                className="px-4 py-2 bg-green-700 text-white rounded-lg text-sm font-medium hover:bg-green-800"
              >
                Add Appointment
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}