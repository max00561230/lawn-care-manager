"use client";

import { useCustomers, useAppointments, usePayments, useTasks, useReminders, ensureSeeded } from "@/lib/storage";
import { APPOINTMENT_STATUSES } from "@/lib/constants";
import Link from "next/link";
import {
  Users, Briefcase, DollarSign, AlertCircle, Clock, CheckSquare, Bell,
  ArrowRight, TrendingUp, Calendar,
} from "lucide-react";
import { useEffect } from "react";

export default function DashboardPage() {
  const { customers } = useCustomers();
  const { appointments } = useAppointments();
  const { payments } = usePayments();
  const { tasks } = useTasks();
  const { reminders } = useReminders();

  useEffect(() => { ensureSeeded(); }, []);

  const today = new Date().toISOString().split("T")[0];
  const todayAppts = appointments.filter((a) => a.date === today);
  const next7 = appointments.filter((a) => {
    const d = new Date(a.date);
    const now = new Date();
    const weekLater = new Date(now);
    weekLater.setDate(weekLater.getDate() + 7);
    return d >= now && d <= weekLater && a.status !== "cancelled";
  }).sort((a, b) => a.date.localeCompare(b.date) || (a.start_time || "").localeCompare(b.start_time || ""));

  const activeJobs = appointments.filter((a) => ["scheduled", "approved", "in_progress", "on_the_way"].includes(a.status)).length;
  const monthPayments = payments.filter((p) => {
    const d = p.paid_at || p.created_at;
    const now = new Date();
    return d && d.startsWith(now.toISOString().slice(0, 7));
  });
  const revenueThisMonth = monthPayments.filter((p) => p.status === "paid").reduce((sum, p) => sum + p.amount, 0);
  const unpaidInvoices = payments.filter((p) => p.status === "unpaid" || p.status === "past_due").reduce((sum, p) => sum + p.amount, 0);

  const pendingTasks = tasks.filter((t) => t.status !== "complete").slice(0, 5);
  const unreadReminders = reminders.filter((r) => !r.is_read).slice(0, 5);

  const getStatusStyle = (status: string) => {
    const found = APPOINTMENT_STATUSES.find((s) => s.value === status);
    return found || { label: status, color: "#94a3b8" };
  };

  const stats = [
    { label: "Total Customers", value: customers.length, icon: Users, color: "bg-green-100 text-green-700", accent: "border-l-4 border-green-500" },
    { label: "Active Jobs", value: activeJobs, icon: Briefcase, color: "bg-blue-100 text-blue-700", accent: "border-l-4 border-blue-500" },
    { label: "Revenue This Month", value: `$${revenueThisMonth.toLocaleString()}`, icon: DollarSign, color: "bg-orange-100 text-orange-700", accent: "border-l-4 border-orange-500" },
    { label: "Unpaid Invoices", value: `$${unpaidInvoices.toLocaleString()}`, icon: AlertCircle, color: "bg-red-100 text-red-700", accent: "border-l-4 border-red-500" },
  ];

  return (
    <div className="space-y-6">
      {/* Header with sticky backdrop */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            {new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" })}
          </p>
        </div>
        <Link href="/book/" className="btn-accent text-sm flex items-center gap-2">
          <TrendingUp className="w-4 h-4" />
          Book Page
        </Link>
      </div>

      {/* Stats cards — upgraded with accent borders and rounded-2xl */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div key={stat.label} className={`bg-white rounded-2xl shadow-sm p-5 card-hover ${stat.accent}`}>
            <div className="flex items-center gap-3">
              <div className={`p-2.5 rounded-xl ${stat.color}`}>
                <stat.icon className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs text-gray-500 font-medium">{stat.label}</p>
                <p className="text-xl font-bold text-gray-900">{stat.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Today's Schedule */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm">
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
            <h2 className="font-semibold text-gray-900 flex items-center gap-2">
              <Clock className="w-5 h-5 text-orange-500" /> Today&apos;s Schedule
            </h2>
            <Link href="/appointments/" className="text-sm text-orange-600 hover:text-orange-700 font-medium flex items-center gap-1">
              View All <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="divide-y divide-gray-50">
            {todayAppts.length === 0 ? (
              <p className="px-6 py-10 text-gray-400 text-sm text-center">No appointments today</p>
            ) : (
              todayAppts.map((apt) => {
                const st = getStatusStyle(apt.status);
                return (
                  <div key={apt.id} className="px-6 py-3.5 flex items-center gap-4 hover:bg-green-50/50 transition-colors">
                    <div className="text-sm font-mono text-gray-400 w-16">{apt.start_time || "—"}</div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 truncate">{apt.title}</p>
                      <p className="text-xs text-gray-500">{apt.customer?.name || "No customer"}</p>
                    </div>
                    <span className="status-badge" style={{ backgroundColor: st.color + "22", color: st.color }}>
                      {st.label}
                    </span>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Quick links sidebar */}
        <div className="space-y-4">
          {/* Pending tasks */}
          <div className="bg-white rounded-2xl shadow-sm">
            <div className="flex items-center justify-between px-5 py-3.5 border-b border-gray-100">
              <h3 className="font-semibold text-gray-900 flex items-center gap-2 text-sm">
                <CheckSquare className="w-4 h-4 text-orange-500" /> Pending Tasks
              </h3>
              <Link href="/tasks/" className="text-xs text-orange-600 hover:text-orange-700 font-medium">View all</Link>
            </div>
            <div className="divide-y divide-gray-50">
              {pendingTasks.length === 0 ? (
                <p className="px-5 py-5 text-gray-400 text-xs text-center">No pending tasks</p>
              ) : (
                pendingTasks.map((t) => (
                  <div key={t.id} className="px-5 py-2.5 flex items-center gap-2.5 text-sm">
                    <span className={`w-2 h-2 rounded-full flex-shrink-0 ${
                      t.priority === "high" ? "bg-red-500" : t.priority === "medium" ? "bg-yellow-500" : "bg-green-400"
                    }`} />
                    <span className="flex-1 truncate text-gray-700">{t.title}</span>
                    <span className="text-xs text-gray-400 flex-shrink-0">{t.due_date}</span>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Reminders */}
          <div className="bg-white rounded-2xl shadow-sm">
            <div className="flex items-center justify-between px-5 py-3.5 border-b border-gray-100">
              <h3 className="font-semibold text-gray-900 flex items-center gap-2 text-sm">
                <Bell className="w-4 h-4 text-orange-500" /> Reminders
              </h3>
              <Link href="/reminders/" className="text-xs text-orange-600 hover:text-orange-700 font-medium">View all</Link>
            </div>
            <div className="divide-y divide-gray-50">
              {unreadReminders.length === 0 ? (
                <p className="px-5 py-5 text-gray-400 text-xs text-center">No new reminders</p>
              ) : (
                unreadReminders.map((r) => (
                  <div key={r.id} className="px-5 py-2.5 flex items-center gap-2.5 text-sm">
                    <span className="w-2 h-2 rounded-full bg-orange-400 flex-shrink-0" />
                    <span className="flex-1 truncate text-gray-700">{r.title}</span>
                    <span className="text-xs text-gray-400 flex-shrink-0">{r.due_date}</span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Upcoming 7 days */}
      {next7.length > 0 && (
        <div className="bg-white rounded-2xl shadow-sm">
          <div className="px-6 py-4 border-b border-gray-100">
            <h2 className="font-semibold text-gray-900 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-orange-500" />
              Upcoming Appointments (Next 7 Days)
            </h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50/80">
                  <th className="px-5 py-3 text-left font-medium text-gray-500">Date</th>
                  <th className="px-5 py-3 text-left font-medium text-gray-500">Time</th>
                  <th className="px-5 py-3 text-left font-medium text-gray-500">Customer</th>
                  <th className="px-5 py-3 text-left font-medium text-gray-500">Service</th>
                  <th className="px-5 py-3 text-left font-medium text-gray-500">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {next7.map((apt) => {
                  const st = getStatusStyle(apt.status);
                  return (
                    <tr key={apt.id} className="hover:bg-green-50/50 transition-colors">
                      <td className="px-5 py-3 text-gray-700">{apt.date}</td>
                      <td className="px-5 py-3 text-gray-700">{apt.start_time || "—"}</td>
                      <td className="px-5 py-3 text-gray-700">{apt.customer?.name || "—"}</td>
                      <td className="px-5 py-3 text-gray-700">{apt.service?.name || apt.title}</td>
                      <td className="px-5 py-3">
                        <span className="status-badge" style={{ backgroundColor: st.color + "22", color: st.color }}>
                          {st.label}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}