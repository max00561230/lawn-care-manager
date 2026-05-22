"use client";

import { useState } from "react";
import { useServices } from "@/lib/storage";
import { ServiceFormData } from "@/types";
import { Plus, Edit, Trash2, X } from "lucide-react";
import { usePlan } from "@/components/PlanProvider";
import { PLAN_LIMITS } from "@/lib/plan-limits";

export default function ServicesPage() {
  const { services, addService, updateService, deleteService, toggleService } = useServices();
  const { tier, showUpgrade } = usePlan();
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<ServiceFormData>({ name: "", base_price: 0, description: "", estimated_time: "", is_recurring: false });

  const openAdd = () => {
    const serviceLimit = PLAN_LIMITS.free.services;
    if (tier === "free" && serviceLimit !== null && services.length >= (serviceLimit as number)) {
      showUpgrade("services");
      return;
    }
    setFormData({ name: "", base_price: 0, description: "", estimated_time: "", is_recurring: false }); setEditingId(null); setShowModal(true);
  };
  const openEdit = (id: string) => {
    const svc = services.find((s) => s.id === id);
    if (!svc) return;
    setFormData({ name: svc.name, base_price: svc.base_price, description: svc.description, estimated_time: svc.estimated_time, is_recurring: svc.is_recurring });
    setEditingId(id);
    setShowModal(true);
  };

  const handleSave = () => {
    if (!formData.name.trim()) return;
    if (editingId) {
      updateService(editingId, formData);
    } else {
      addService(formData);
    }
    setShowModal(false);
    setEditingId(null);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Services</h1>
        <button onClick={openAdd} className="flex items-center gap-2 btn-accent text-sm">
          <Plus className="w-4 h-4" /> Add Service
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {services.map((svc) => (
          <div key={svc.id} className={`bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden ${!svc.is_active ? "opacity-60" : ""}`}>
            <div className="p-5">
              <div className="flex items-start justify-between mb-2">
                <h3 className="font-semibold text-gray-900">{svc.name}</h3>
                {svc.is_recurring && <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full">Recurring</span>}
              </div>
              <div className="text-2xl font-bold text-green-700">${svc.base_price}</div>
              {svc.description && <p className="text-sm text-gray-500 mt-2">{svc.description}</p>}
              {svc.estimated_time && (
                <p className="text-xs text-gray-400 mt-1">Est. {svc.estimated_time}</p>
              )}
            </div>
            <div className="px-5 py-3 border-t border-gray-100 flex items-center justify-between">
              <button onClick={() => toggleService(svc.id)} className={`text-xs font-medium px-3 py-1 rounded-full transition-colors ${
                svc.is_active ? "bg-green-100 text-green-700 hover:bg-red-100 hover:text-red-700" : "bg-gray-100 text-gray-500 hover:bg-green-100 hover:text-green-700"
              }`}>
                {svc.is_active ? "Active" : "Inactive"}
              </button>
              <div className="flex gap-2">
                <button onClick={() => openEdit(svc.id)} className="text-gray-400 hover:text-orange-600"><Edit className="w-4 h-4" /></button>
                <button onClick={() => { if (confirm("Delete this service?")) deleteService(svc.id); }} className="text-gray-400 hover:text-red-600"><Trash2 className="w-4 h-4" /></button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setShowModal(false)}>
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900">{editingId ? "Edit Service" : "Add Service"}</h3>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600"><X className="w-5 h-5" /></button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Service Name *</label>
                <input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="input-field" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Base Price ($) *</label>
                  <input type="number" value={formData.base_price} onChange={(e) => setFormData({ ...formData, base_price: parseFloat(e.target.value) || 0 })} className="input-field" min="0" step="0.01" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Est. Time</label>
                  <input type="text" value={formData.estimated_time || ""} onChange={(e) => setFormData({ ...formData, estimated_time: e.target.value })} className="input-field" placeholder="e.g., 45 min" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea value={formData.description || ""} onChange={(e) => setFormData({ ...formData, description: e.target.value })} rows={3} className="input-field" />
              </div>
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" checked={formData.is_recurring || false} onChange={(e) => setFormData({ ...formData, is_recurring: e.target.checked })} className="rounded border-gray-300 text-green-700 focus:ring-orange-500" />
                Recurring service
              </label>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button onClick={() => setShowModal(false)} className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800">Cancel</button>
              <button onClick={handleSave} className="btn-primary text-sm">
                {editingId ? "Update" : "Add"} Service
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}