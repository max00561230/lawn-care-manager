"use client";

import { useState } from "react";
import { useCustomers, useAppointments, usePayments } from "@/lib/storage";

export default function ReportsPage() {
  const { customers } = useCustomers();
  const { appointments } = useAppointments();
  const { payments } = usePayments();
  const [dateFrom, setDateFrom] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() - 30);
    return d.toISOString().split("T")[0];
  });
  const [dateTo, setDateTo] = useState(() => new Date().toISOString().split("T")[0]);

  const filteredPayments = payments.filter((p) => {
    const d = p.paid_at || p.created_at;
    return d >= dateFrom && d <= dateTo;
  });
  const filteredAppointments = appointments.filter((a) => a.date >= dateFrom && a.date <= dateTo);

  const totalRevenue = filteredPayments.filter((p) => p.status === "paid").reduce((s, p) => s + p.amount, 0);
  const paidInvoices = filteredPayments.filter((p) => p.status === "paid").length;
  const unpaidInvoices = filteredPayments.filter((p) => p.status === "unpaid" || p.status === "past_due").length;
  const completedJobs = filteredAppointments.filter((a) => a.status === "completed").length;
  const newCustomers = customers.filter((c) => c.created_at >= dateFrom && c.created_at <= dateTo).length;

  // Most used services
  const serviceCounts: Record<string, number> = {};
  filteredAppointments.forEach((a) => {
    if (a.service?.name) serviceCounts[a.service.name] = (serviceCounts[a.service.name] || 0) + 1;
  });
  const sortedServices = Object.entries(serviceCounts).sort((a, b) => b[1] - a[1]);
  const maxServiceCount = sortedServices.length > 0 ? sortedServices[0][1] : 1;

  // Revenue by service
  const revenueByService: Record<string, number> = {};
  filteredPayments.filter((p) => p.status === "paid").forEach((p) => {
    const apt = filteredAppointments.find((a) => a.id === p.appointment_id);
    const svc = apt?.service?.name || "Other";
    revenueByService[svc] = (revenueByService[svc] || 0) + p.amount;
  });
  const sortedRevenue = Object.entries(revenueByService).sort((a, b) => b[1] - a[1]);
  const maxRevenue = sortedRevenue.length > 0 ? sortedRevenue[0][1] : 1;

  // Weekly revenue (simple bar chart)
  const weeklyRevenue: Record<string, number> = {};
  filteredPayments.filter((p) => p.status === "paid").forEach((p) => {
    const d = p.paid_at || p.created_at;
    const weekStart = getWeekStart(d);
    weeklyRevenue[weekStart] = (weeklyRevenue[weekStart] || 0) + p.amount;
  });
  const sortedWeeks = Object.entries(weeklyRevenue).sort((a, b) => a[0].localeCompare(b[0]));
  const maxWeeklyRevenue = sortedWeeks.length > 0 ? Math.max(...sortedWeeks.map(([, v]) => v)) : 1;

  function getWeekStart(dateStr: string): string {
    const d = new Date(dateStr);
    const day = d.getDay();
    d.setDate(d.getDate() - day);
    return d.toISOString().split("T")[0];
  }

  const stats = [
    { label: "Total Revenue", value: `$${totalRevenue.toLocaleString()}`, color: "bg-green-700" },
    { label: "Paid Invoices", value: String(paidInvoices), color: "bg-blue-600" },
    { label: "Unpaid Invoices", value: String(unpaidInvoices), color: "bg-yellow-500" },
    { label: "Completed Jobs", value: String(completedJobs), color: "bg-emerald-600" },
    { label: "New Customers", value: String(newCustomers), color: "bg-purple-600" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-green-900">Reports</h1>
        <div className="flex gap-2 items-center">
          <input type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm" />
          <span className="text-gray-400">—</span>
          <input type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)} className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm" />
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-white rounded-lg shadow p-4">
            <div className={`w-8 h-8 rounded-lg ${stat.color} text-white flex items-center justify-center text-sm font-bold mb-2`}>
              {stat.value.charAt(0) === "$" ? "$" : "#"}
            </div>
            <p className="text-xs text-gray-500">{stat.label}</p>
            <p className="text-xl font-bold text-gray-900">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Weekly Revenue Chart */}
      {sortedWeeks.length > 0 && (
        <div className="bg-white rounded-lg shadow p-5">
          <h2 className="font-semibold text-green-900 mb-4">Weekly Revenue</h2>
          <div className="flex items-end gap-2 h-48">
            {sortedWeeks.map(([week, revenue]) => (
              <div key={week} className="flex-1 flex flex-col items-center">
                <div className="w-full bg-green-200 rounded-t relative" style={{ height: `${(revenue / maxWeeklyRevenue) * 100}%`, minHeight: "8px" }}>
                  <div className="absolute -top-5 text-xs font-medium text-gray-700 w-full text-center">${revenue.toLocaleString()}</div>
                </div>
                <div className="text-xs text-gray-400 mt-1 truncate w-full text-center">{week.slice(5)}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Most Used Services */}
        <div className="bg-white rounded-lg shadow p-5">
          <h2 className="font-semibold text-green-900 mb-4">Most Used Services</h2>
          {sortedServices.length === 0 ? (
            <p className="text-gray-400 text-center py-4">No data for this period</p>
          ) : (
            <div className="space-y-3">
              {sortedServices.map(([name, count]) => (
                <div key={name}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-700">{name}</span>
                    <span className="font-medium text-gray-900">{count}</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-green-500 rounded-full" style={{ width: `${(count / maxServiceCount) * 100}%` }} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Revenue by Service */}
        <div className="bg-white rounded-lg shadow p-5">
          <h2 className="font-semibold text-green-900 mb-4">Revenue by Service</h2>
          {sortedRevenue.length === 0 ? (
            <p className="text-gray-400 text-center py-4">No data for this period</p>
          ) : (
            <div className="space-y-3">
              {sortedRevenue.map(([name, revenue]) => (
                <div key={name}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-700">{name}</span>
                    <span className="font-medium text-green-700">${revenue.toLocaleString()}</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-yellow-400 rounded-full" style={{ width: `${(revenue / maxRevenue) * 100}%` }} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}