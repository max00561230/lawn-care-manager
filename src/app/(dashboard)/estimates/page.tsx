"use client";

import { useState } from "react";
import { useEstimates, useCustomers, useServices, useAppointments } from "@/lib/storage";
import { EstimateStatus } from "@/types";
import { Plus, X, ArrowRight } from "lucide-react";

const STATUS_CONFIG: Record<string, { label: string; color: string }> = {
  draft: { label: "Draft", color: "#94a3b8" },
  sent: { label: "Sent", color: "#60A5FA" },
  accepted: { label: "Accepted", color: "#10B981" },
  declined: { label: "Declined", color: "#EF4444" },
};

export default function EstimatesPage() {
  const { estimates, addEstimate, updateEstimate, deleteEstimate } = useEstimates();
  const { customers } = useCustomers();
  const { services } = useServices();
  const { addAppointment } = useAppointments();
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    customer_id: "", service_id: "", property_address: "", estimated_price: 0, notes: "",
  });

  const filtered = estimates.filter((e) => statusFilter === "all" || e.status === statusFilter);

  const convertToAppointment = (estimate: typeof estimates[0]) => {
    addAppointment({
      customer_id: estimate.customer_id,
      service_id: estimate.service_id,
      title: `${estimate.service?.name || "Service"} — ${estimate.customer?.name || "Customer"}`,
      date: new Date().toISOString().split("T")[0],
      start_time: "09:00",
      notes: `From estimate: ${estimate.notes || ""}`,
    });
    updateEstimate(estimate.id, { status: "accepted" as EstimateStatus });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Estimates</h1>
        <button onClick={() => setShowModal(true)} className="flex items-center gap-2 btn-accent text-sm">
          <Plus className="w-4 h-4" /> Create Estimate
        </button>
      </div>

      {/* Status filter */}
      <div className="flex overflow-x-auto gap-1 bg-white rounded-2xl shadow-sm border border-gray-100 p-1 scrollbar-hide">
        {["all", "draft", "sent", "accepted", "declined"].map((s) => (
          <button
            key={s}
            onClick={() => setStatusFilter(s)}
            className={`px-3 py-1.5 rounded-xl text-sm font-medium whitespace-nowrap transition-colors ${
              statusFilter === s ? "bg-green-700 text-white" : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            {s === "all" ? "All" : STATUS_CONFIG[s]?.label || s}
          </button>
        ))}
      </div>

      {/* Estimates list */}
      <div className="space-y-3">
        {filtered.length === 0 ? (
          <p className="text-gray-400 text-center py-8">No estimates found</p>
        ) : (
          filtered.map((est) => {
            const cfg = STATUS_CONFIG[est.status] || { label: est.status, color: "#94a3b8" };
            return (
              <div key={est.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-gray-900">{est.customer?.name || "No Customer"}</h3>
                      <span className="status-badge" style={{ backgroundColor: cfg.color + "22", color: cfg.color }}>{cfg.label}</span>
                    </div>
                    <p className="text-sm text-gray-500 mt-1">{est.service?.name || "No service"}</p>
                    {est.property_address && <p className="text-xs text-gray-400 mt-0.5">{est.property_address}</p>}
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-green-700">${(est.estimated_price || 0).toLocaleString()}</p>
                    <p className="text-xs text-gray-400">{est.created_at}</p>
                  </div>
                </div>
                {est.notes && <p className="text-sm text-gray-600 mt-2">{est.notes}</p>}
                <div className="flex items-center gap-2 mt-3">
                  {est.status === "draft" && (
                    <button onClick={() => updateEstimate(est.id, { status: "sent" as EstimateStatus })} className="text-xs bg-blue-100 text-blue-700 px-3 py-1 rounded-full hover:bg-blue-200">
                      Mark as Sent
                    </button>
                  )}
                  {est.status === "sent" && (
                    <>
                      <button onClick={() => updateEstimate(est.id, { status: "accepted" as EstimateStatus })} className="text-xs bg-green-100 text-green-700 px-3 py-1 rounded-full hover:bg-green-200">
                        Accept
                      </button>
                      <button onClick={() => updateEstimate(est.id, { status: "declined" as EstimateStatus })} className="text-xs bg-red-100 text-red-700 px-3 py-1 rounded-full hover:bg-red-200">
                        Decline
                      </button>
                    </>
                  )}
                  {est.status === "accepted" && (
                    <button onClick={() => convertToAppointment(est)} className="text-xs bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full hover:bg-yellow-200 flex items-center gap-1">
                      <ArrowRight className="w-3 h-3" /> Convert to Appointment
                    </button>
                  )}
                  <button onClick={() => { if (confirm("Delete this estimate?")) deleteEstimate(est.id); }} className="text-xs text-red-500 hover:text-red-700">
                    Delete
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Create Estimate Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setShowModal(false)}>
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900">Create Estimate</h3>
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
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Service</label>
                <select value={formData.service_id} onChange={(e) => setFormData({ ...formData, service_id: e.target.value })} className="input-field">
                  <option value="">Select service</option>
                  {services.filter((s) => s.is_active).map((s) => <option key={s.id} value={s.id}>{s.name} — ${s.base_price}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Property Address</label>
                <input type="text" value={formData.property_address} onChange={(e) => setFormData({ ...formData, property_address: e.target.value })} className="input-field" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Estimated Price ($)</label>
                <input type="number" value={formData.estimated_price} onChange={(e) => setFormData({ ...formData, estimated_price: parseFloat(e.target.value) || 0 })} className="input-field" min="0" step="0.01" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                <textarea value={formData.notes} onChange={(e) => setFormData({ ...formData, notes: e.target.value })} rows={3} className="input-field" />
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button onClick={() => setShowModal(false)} className="px-4 py-2 text-sm text-gray-600">Cancel</button>
              <button
                onClick={() => {
                  addEstimate(formData);
                  setShowModal(false);
                  setFormData({ customer_id: "", service_id: "", property_address: "", estimated_price: 0, notes: "" });
                }}
                className="btn-accent text-sm"
              >
                Create Estimate
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}