"use client";

import { useState } from "react";
import { usePayments, useCustomers } from "@/lib/storage";
import { PaymentStatus, PaymentType } from "@/types";
import { Plus, X, Lock } from "lucide-react";
import { usePlan } from "@/components/PlanProvider";

const STATUS_TABS = [
  { value: "all", label: "All" },
  { value: "paid", label: "Paid" },
  { value: "unpaid", label: "Unpaid" },
  { value: "past_due", label: "Past Due" },
  { value: "refunded", label: "Refunded" },
];

const STATUS_COLORS: Record<string, string> = {
  paid: "bg-green-100 text-green-700",
  unpaid: "bg-yellow-100 text-yellow-700",
  past_due: "bg-red-100 text-red-700",
  refunded: "bg-gray-100 text-gray-600",
};

export default function PaymentsPage() {
  const { tier, showUpgrade } = usePlan();
  const { payments, addPayment, updatePayment, deletePayment } = usePayments();
  const { customers } = useCustomers();
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    customer_id: "", amount: 0, payment_type: "full" as PaymentType, status: "unpaid" as PaymentStatus, description: "", paid_at: "",
  });

  // Free Plan: lock payments behind upgrade wall
  if (tier === "free") {
    return (
      <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
        <div className="w-16 h-16 rounded-full bg-amber-100 flex items-center justify-center mb-6">
          <Lock className="w-8 h-8 text-amber-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Payment Collection</h2>
        <p className="text-gray-500 max-w-md mb-6">
          Accept payments, track invoices, and manage billing — all from LawnCare Manager Pro.
        </p>
        <p className="text-sm text-gray-400 mb-8 max-w-sm">
          Upgrade to unlock unlimited customers, services, quotes, and payment collection.
        </p>
        <button
          onClick={() => showUpgrade("payments")}
          className="px-8 py-3 bg-gradient-to-r from-green-600 to-emerald-500 text-white font-bold rounded-xl shadow-lg shadow-green-500/25 hover:shadow-xl hover:shadow-green-500/30 transition-all duration-200 text-lg"
        >
          Upgrade to Pro
        </button>
        <div className="mt-8 flex items-center gap-4 text-sm text-gray-400">
          <span>✓ Unlimited Customers</span>
          <span>✓ Payment Collection</span>
          <span>✓ Priority Support</span>
        </div>
      </div>
    );
  }

  const filtered = payments.filter((p) => {
    if (statusFilter !== "all" && p.status !== statusFilter) return false;
    if (dateFrom && (p.paid_at || p.created_at) < dateFrom) return false;
    if (dateTo && (p.paid_at || p.created_at) > dateTo) return false;
    return true;
  }).sort((a, b) => (b.paid_at || b.created_at).localeCompare(a.paid_at || a.created_at));

  const totalPaid = payments.filter((p) => p.status === "paid").reduce((s, p) => s + p.amount, 0);
  const totalUnpaid = payments.filter((p) => p.status === "unpaid").reduce((s, p) => s + p.amount, 0);
  const totalPastDue = payments.filter((p) => p.status === "past_due").reduce((s, p) => s + p.amount, 0);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Payments</h1>
        <button onClick={() => setShowModal(true)} className="flex items-center gap-2 btn-accent text-sm">
          <Plus className="w-4 h-4" /> Add Payment
        </button>
      </div>

      {/* Revenue summary */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
          <p className="text-xs text-gray-500">Total Paid</p>
          <p className="text-xl font-bold text-green-700">${totalPaid.toLocaleString()}</p>
        </div>
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
          <p className="text-xs text-gray-500">Unpaid</p>
          <p className="text-xl font-bold text-yellow-600">${totalUnpaid.toLocaleString()}</p>
        </div>
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
          <p className="text-xs text-gray-500">Past Due</p>
          <p className="text-xl font-bold text-red-600">${totalPastDue.toLocaleString()}</p>
        </div>
      </div>

      {/* Status filter + date range */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex overflow-x-auto gap-1 bg-white rounded-2xl shadow-sm border border-gray-100 p-1 scrollbar-hide">
          {STATUS_TABS.map((tab) => (
            <button key={tab.value} onClick={() => setStatusFilter(tab.value)} className={`px-3 py-1.5 rounded-xl text-sm font-medium whitespace-nowrap transition-colors ${
              statusFilter === tab.value ? "bg-green-700 text-white" : "text-gray-600 hover:bg-gray-100"
            }`}>
              {tab.label}
            </button>
          ))}
        </div>
        <div className="flex gap-2 items-center">
          <input type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} className="border border-gray-300 rounded-xl px-3 py-1.5 text-sm focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20" placeholder="From" />
          <span className="text-gray-400">—</span>
          <input type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)} className="border border-gray-300 rounded-xl px-3 py-1.5 text-sm focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20" placeholder="To" />
        </div>
      </div>

      {/* Payments list */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {filtered.length === 0 ? (
          <p className="text-gray-400 text-center py-8">No payments found</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50/80">
                <tr>
                  <th className="px-4 py-3 text-left font-medium text-gray-500">Date</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-500">Customer</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-500">Description</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-500">Type</th>
                  <th className="px-4 py-3 text-right font-medium text-gray-500">Amount</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-500">Status</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-500">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map((p) => (
                  <tr key={p.id} className="hover:bg-green-50/50">
                    <td className="px-4 py-3 text-gray-700">{p.paid_at || p.created_at}</td>
                    <td className="px-4 py-3 text-gray-700">{p.customer?.name || "—"}</td>
                    <td className="px-4 py-3 text-gray-700">{p.description || "—"}</td>
                    <td className="px-4 py-3 text-gray-500 capitalize">{p.payment_type?.replace("_", " ")}</td>
                    <td className="px-4 py-3 text-right font-bold text-gray-900">${p.amount.toLocaleString()}</td>
                    <td className="px-4 py-3">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${STATUS_COLORS[p.status] || "bg-gray-100 text-gray-600"}`}>
                        {p.status?.replace("_", " ")}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        {p.status === "unpaid" && (
                          <button onClick={() => updatePayment(p.id, { status: "paid" as PaymentStatus, paid_at: new Date().toISOString().split("T")[0] })} className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-xl hover:bg-green-200">
                            Mark Paid
                          </button>
                        )}
                        {p.status === "past_due" && (
                          <button onClick={() => updatePayment(p.id, { status: "paid" as PaymentStatus, paid_at: new Date().toISOString().split("T")[0] })} className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-xl hover:bg-green-200">
                            Mark Paid
                          </button>
                        )}
                        <button onClick={() => { if (confirm("Delete this payment?")) deletePayment(p.id); }} className="p-1 text-gray-400 hover:text-red-600"><X className="w-4 h-4" /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add Payment Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setShowModal(false)}>
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900">Add Payment</h3>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600"><X className="w-5 h-5" /></button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Customer</label>
                <select value={formData.customer_id} onChange={(e) => setFormData({ ...formData, customer_id: e.target.value })} className="input-field">
                  <option value="">Select customer</option>
                  {customers.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Amount ($)</label>
                  <input type="number" value={formData.amount} onChange={(e) => setFormData({ ...formData, amount: parseFloat(e.target.value) || 0 })} className="input-field" min="0" step="0.01" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                  <select value={formData.payment_type} onChange={(e) => setFormData({ ...formData, payment_type: e.target.value as PaymentType })} className="input-field">
                    <option value="full">Full</option>
                    <option value="deposit">Deposit</option>
                    <option value="recurring">Recurring</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value as PaymentStatus })} className="input-field">
                  <option value="paid">Paid</option>
                  <option value="unpaid">Unpaid</option>
                  <option value="past_due">Past Due</option>
                  <option value="refunded">Refunded</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <input type="text" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} className="input-field" />
              </div>
              {formData.status === "paid" && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Paid Date</label>
                  <input type="date" value={formData.paid_at} onChange={(e) => setFormData({ ...formData, paid_at: e.target.value })} className="input-field" />
                </div>
              )}
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button onClick={() => setShowModal(false)} className="px-4 py-2 text-sm text-gray-600">Cancel</button>
              <button
                onClick={() => {
                  addPayment({ customer_id: formData.customer_id || undefined, amount: formData.amount, payment_type: formData.payment_type, status: formData.status, description: formData.description || undefined, paid_at: formData.status === "paid" ? formData.paid_at : undefined });
                  setShowModal(false);
                  setFormData({ customer_id: "", amount: 0, payment_type: "full", status: "unpaid", description: "", paid_at: "" });
                }}
                className="btn-primary text-sm"
              >
                Add Payment
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}