"use client";

import { useState } from "react";
import { useReminders, useCustomers } from "@/lib/storage";
import { ReminderType } from "@/types";
import { Plus, X, Bell, DollarSign, RefreshCw, Wrench, Leaf, MessageCircle } from "lucide-react";

const TYPE_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  appointment: Bell,
  payment: DollarSign,
  follow_up: MessageCircle,
  equipment: Wrench,
  recurring: RefreshCw,
  seasonal: Leaf,
};

const TYPE_COLORS: Record<string, string> = {
  appointment: "bg-blue-100 text-blue-700",
  payment: "bg-yellow-100 text-yellow-700",
  follow_up: "bg-purple-100 text-purple-700",
  equipment: "bg-gray-100 text-gray-700",
  recurring: "bg-green-100 text-green-700",
  seasonal: "bg-orange-100 text-orange-700",
};

const TYPE_LABELS: Record<string, string> = {
  appointment: "Appointment",
  payment: "Payment",
  follow_up: "Follow-up",
  equipment: "Equipment",
  recurring: "Recurring",
  seasonal: "Seasonal",
};

export default function RemindersPage() {
  const { reminders, addReminder, markAsRead, deleteReminder } = useReminders();
  const { customers } = useCustomers();
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ title: "", reminder_type: "appointment" as ReminderType, due_date: "", customer_id: "" });

  const filtered = reminders
    .filter((r) => typeFilter === "all" || r.reminder_type === typeFilter)
    .sort((a, b) => (a.due_date || "").localeCompare(b.due_date || ""));

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Reminders</h1>
        <button onClick={() => setShowModal(true)} className="flex items-center gap-2 btn-accent text-sm">
          <Plus className="w-4 h-4" /> Add Reminder
        </button>
      </div>

      {/* Type filter */}
      <div className="flex overflow-x-auto gap-1 bg-white rounded-2xl shadow-sm border border-gray-100 p-1 scrollbar-hide">
        {["all", "appointment", "payment", "follow_up", "equipment", "recurring", "seasonal"].map((t) => (
          <button key={t} onClick={() => setTypeFilter(t)} className={`px-3 py-1.5 rounded-xl text-sm font-medium whitespace-nowrap transition-colors ${
            typeFilter === t ? "bg-green-700 text-white" : "text-gray-600 hover:bg-gray-100"
          }`}>
            {t === "all" ? "All" : TYPE_LABELS[t] || t}
          </button>
        ))}
      </div>

      {/* Reminders list */}
      <div className="space-y-2">
        {filtered.length === 0 ? (
          <p className="text-gray-400 text-center py-8">No reminders found</p>
        ) : (
          filtered.map((r) => {
            const Icon = TYPE_ICONS[r.reminder_type] || Bell;
            const colorClass = TYPE_COLORS[r.reminder_type] || "bg-gray-100 text-gray-700";
            return (
              <div key={r.id} className={`bg-white rounded-2xl shadow-sm border border-gray-100 p-4 flex items-start gap-3 ${r.is_read ? "opacity-70" : ""}`}>
                <div className={`p-2 rounded-xl ${colorClass}`}>
                  <Icon className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className={`font-medium ${r.is_read ? "text-gray-500" : "text-gray-900"}`}>{r.title}</p>
                    {!r.is_read && <span className="w-2 h-2 bg-yellow-400 rounded-full" />}
                  </div>
                  <div className="flex flex-wrap gap-2 mt-0.5 text-xs text-gray-500">
                    <span className={`px-2 py-0.5 rounded-full ${colorClass}`}>{TYPE_LABELS[r.reminder_type]}</span>
                    {r.due_date && <span>Due: {r.due_date}</span>}
                    {r.customer && <span>• {r.customer.name}</span>}
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  {!r.is_read && (
                    <button onClick={() => markAsRead(r.id)} className="text-xs text-orange-600 hover:text-orange-700 px-2 py-1 rounded-xl bg-orange-50">
                      Mark read
                    </button>
                  )}
                  <button onClick={() => { if (confirm("Delete this reminder?")) deleteReminder(r.id); }} className="p-1 text-gray-400 hover:text-red-600">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Add Reminder Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setShowModal(false)}>
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900">Add Reminder</h3>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600"><X className="w-5 h-5" /></button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
                <input type="text" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} className="input-field" placeholder="Reminder title" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                <select value={formData.reminder_type} onChange={(e) => setFormData({ ...formData, reminder_type: e.target.value as ReminderType })} className="input-field">
                  {Object.entries(TYPE_LABELS).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Due Date</label>
                <input type="date" value={formData.due_date} onChange={(e) => setFormData({ ...formData, due_date: e.target.value })} className="input-field" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Linked Customer</label>
                <select value={formData.customer_id} onChange={(e) => setFormData({ ...formData, customer_id: e.target.value })} className="input-field">
                  <option value="">None</option>
                  {customers.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button onClick={() => setShowModal(false)} className="px-4 py-2 text-sm text-gray-600">Cancel</button>
              <button
                onClick={() => {
                  if (!formData.title.trim()) return;
                  addReminder({ title: formData.title, reminder_type: formData.reminder_type, due_date: formData.due_date || undefined, customer_id: formData.customer_id || undefined });
                  setShowModal(false);
                  setFormData({ title: "", reminder_type: "appointment", due_date: "", customer_id: "" });
                }}
                className="btn-primary text-sm"
              >
                Add Reminder
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}