"use client";

import { useState } from "react";
import { useCustomers } from "@/lib/storage";
import { CUSTOMER_FILTERS, SERVICE_FREQUENCIES, DAYS_OF_WEEK } from "@/lib/constants";
import { Customer, CustomerFormData, CustomerType, ServiceFrequency } from "@/types";
import { Search, Plus, X, Edit, Trash2, ChevronDown, Mail, Phone, MapPin } from "lucide-react";
import Link from "next/link";

export default function CustomersPage() {
  const { customers, addCustomer, updateCustomer, deleteCustomer } = useCustomers();
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [showAddModal, setShowAddModal] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);

  const serviceTypeOptions = ["Lawn Mowing", "Edging", "Weed Trimming", "Leaf Removal", "Mulch Installation", "Fertilizer Treatment", "Weed Control", "Hedge Trimming", "Yard Cleanup", "Aeration", "Seeding", "Pressure Washing", "Seasonal Cleanup", "Commercial Lawn Maintenance"];

  const filtered = customers.filter((c) => {
    const matchSearch = !search || c.name.toLowerCase().includes(search.toLowerCase()) || (c.email || "").toLowerCase().includes(search.toLowerCase()) || (c.phone || "").includes(search);
    if (!matchSearch) return false;
    if (filter === "all") return true;
    if (filter === "unpaid") return c.payment_status === "unpaid" || c.payment_status === "past_due";
    if (filter === "commercial") return c.customer_type === "commercial";
    if (filter === "residential") return c.customer_type === "residential";
    if (filter === "weekly" || filter === "bi_weekly" || filter === "monthly" || filter === "one_time") return c.service_frequency === filter;
    if (filter === "new" || filter === "active" || filter === "inactive") return c.status === filter;
    return true;
  });

  const [formData, setFormData] = useState<CustomerFormData>({
    name: "", address: "", phone: "", email: "",
    service_frequency: "weekly" as ServiceFrequency,
    service_type: [], property_size: "", gate_code: "",
    preferred_day: "", customer_type: "residential" as CustomerType, notes: "",
  });

  const resetForm = () => {
    setFormData({
      name: "", address: "", phone: "", email: "",
      service_frequency: "weekly" as ServiceFrequency,
      service_type: [], property_size: "", gate_code: "",
      preferred_day: "", customer_type: "residential" as CustomerType, notes: "",
    });
  };

  const openAddModal = () => { resetForm(); setEditingCustomer(null); setShowAddModal(true); };

  const openEditModal = (c: Customer) => {
    setFormData({
      name: c.name, address: c.address, phone: c.phone, email: c.email,
      service_frequency: c.service_frequency, service_type: c.service_type || [],
      property_size: c.property_size, gate_code: c.gate_code,
      preferred_day: c.preferred_day, customer_type: c.customer_type, notes: c.notes,
    });
    setEditingCustomer(c);
    setShowAddModal(true);
  };

  const handleSave = () => {
    if (!formData.name.trim()) return;
    if (editingCustomer) {
      updateCustomer(editingCustomer.id, formData);
    } else {
      addCustomer(formData);
    }
    setShowAddModal(false);
    resetForm();
    setEditingCustomer(null);
  };

  const toggleServiceType = (st: string) => {
    setFormData((prev) => ({
      ...prev,
      service_type: prev.service_type?.includes(st) ? prev.service_type.filter((s) => s !== st) : [...(prev.service_type || []), st],
    }));
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Customers</h1>
        <button onClick={openAddModal} className="flex items-center gap-2 btn-accent text-sm">
          <Plus className="w-4 h-4" /> Add Customer
        </button>
      </div>

      {/* Search and filter */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text" value={search} onChange={(e) => setSearch(e.target.value)}
            placeholder="Search customers..." className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 text-sm"
          />
        </div>
        <div className="relative">
          <select value={filter} onChange={(e) => setFilter(e.target.value)} className="appearance-none bg-white border border-gray-300 rounded-xl px-4 py-2.5 pr-8 text-sm focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20">
            {CUSTOMER_FILTERS.map((f) => <option key={f.value} value={f.value}>{f.label}</option>)}
          </select>
          <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
        </div>
      </div>

      {/* Customer list */}
      <div className="space-y-3">
        {filtered.length === 0 ? (
          <p className="text-gray-400 text-center py-8">No customers found</p>
        ) : (
          filtered.map((customer) => (
            <div key={customer.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <button
                onClick={() => setExpandedId(expandedId === customer.id ? null : customer.id)}
                className="w-full px-5 py-4 flex items-center gap-4 hover:bg-green-50/50 transition-colors"
              >
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm ${
                  customer.status === "active" ? "bg-green-600" : customer.status === "new" ? "bg-yellow-500" : "bg-gray-400"
                }`}>
                  {customer.name.charAt(0)}
                </div>
                <div className="flex-1 text-left min-w-0">
                  <div className="flex items-center gap-2">
                    <Link href={`/customers/${customer.id}/`} className="font-medium text-gray-900 hover:text-orange-600" onClick={(e) => e.stopPropagation()}>
                      {customer.name}
                    </Link>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                      customer.status === "active" ? "bg-green-100 text-green-700" :
                      customer.status === "new" ? "bg-yellow-100 text-yellow-700" :
                      "bg-gray-100 text-gray-600"
                    }`}>{customer.status}</span>
                  </div>
                  <div className="text-xs text-gray-500 flex flex-wrap gap-x-4 mt-0.5">
                    {customer.phone && <span className="flex items-center gap-1"><Phone className="w-3 h-3" />{customer.phone}</span>}
                    {customer.service_frequency && <span>{customer.service_frequency.replace("_", " ")}</span>}
                    {customer.next_service_date && <span>Next: {customer.next_service_date}</span>}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-xs px-2 py-0.5 rounded-full ${
                    customer.payment_status === "paid" ? "bg-green-100 text-green-700" :
                    customer.payment_status === "unpaid" ? "bg-yellow-100 text-yellow-700" :
                    "bg-red-100 text-red-700"
                  }`}>{customer.payment_status?.replace("_", " ")}</span>
                  <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${expandedId === customer.id ? "rotate-180" : ""}`} />
                </div>
              </button>

              {expandedId === customer.id && (
                <div className="px-5 pb-4 border-t border-gray-100 pt-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                    {customer.address && <div className="flex items-start gap-2"><MapPin className="w-4 h-4 text-gray-400 mt-0.5" /><span>{customer.address}</span></div>}
                    {customer.email && <div className="flex items-center gap-2"><Mail className="w-4 h-4 text-gray-400" /><span>{customer.email}</span></div>}
                    <div><span className="text-gray-500">Type:</span> {customer.customer_type}</div>
                    <div><span className="text-gray-500">Property:</span> {customer.property_size || "—"}</div>
                    {customer.gate_code && <div><span className="text-gray-500">Gate Code:</span> {customer.gate_code}</div>}
                    <div><span className="text-gray-500">Preferred Day:</span> {customer.preferred_day || "—"}</div>
                    {customer.service_type && customer.service_type.length > 0 && (
                      <div className="sm:col-span-2"><span className="text-gray-500">Services: </span>
                        {customer.service_type.map((s) => <span key={s} className="inline-block bg-green-100 text-green-700 text-xs px-2 py-0.5 rounded-full mr-1">{s}</span>)}
                      </div>
                    )}
                    {customer.notes && <div className="sm:col-span-2 text-gray-500 italic">{customer.notes}</div>}
                  </div>
                  <div className="flex gap-2 mt-3">
                    <button onClick={() => openEditModal(customer)} className="flex items-center gap-1 text-sm text-orange-600 hover:text-orange-700">
                      <Edit className="w-4 h-4" /> Edit
                    </button>
                    <Link href={`/customers/${customer.id}/`} className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800">
                      View Profile
                    </Link>
                    <button onClick={() => { if (confirm("Delete this customer?")) deleteCustomer(customer.id); }} className="flex items-center gap-1 text-sm text-red-600 hover:text-red-800">
                      <Trash2 className="w-4 h-4" /> Delete
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Add/Edit Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-start justify-center p-4 overflow-y-auto" onClick={() => setShowAddModal(false)}>
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 my-8 shadow-xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900">{editingCustomer ? "Edit Customer" : "Add Customer"}</h3>
              <button onClick={() => { setShowAddModal(false); setEditingCustomer(null); }} className="text-gray-400 hover:text-gray-600"><X className="w-5 h-5" /></button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
                <input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="input-field" placeholder="Customer name" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                  <input type="tel" value={formData.phone || ""} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} className="input-field" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input type="email" value={formData.email || ""} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className="input-field" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                <input type="text" value={formData.address || ""} onChange={(e) => setFormData({ ...formData, address: e.target.value })} className="input-field" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Service Frequency</label>
                  <select value={formData.service_frequency || "weekly"} onChange={(e) => setFormData({ ...formData, service_frequency: e.target.value as ServiceFrequency })} className="input-field">
                    {SERVICE_FREQUENCIES.map((f) => <option key={f.value} value={f.value}>{f.label}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Customer Type</label>
                  <select value={formData.customer_type || "residential"} onChange={(e) => setFormData({ ...formData, customer_type: e.target.value as CustomerType })} className="input-field">
                    <option value="residential">Residential</option>
                    <option value="commercial">Commercial</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Property Size</label>
                  <input type="text" value={formData.property_size || ""} onChange={(e) => setFormData({ ...formData, property_size: e.target.value })} className="input-field" placeholder="e.g., 0.25 acre" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Gate Code</label>
                  <input type="text" value={formData.gate_code || ""} onChange={(e) => setFormData({ ...formData, gate_code: e.target.value })} className="input-field" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Preferred Day</label>
                <select value={formData.preferred_day || ""} onChange={(e) => setFormData({ ...formData, preferred_day: e.target.value })} className="input-field">
                  <option value="">No preference</option>
                  {DAYS_OF_WEEK.map((d) => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Service Types</label>
                <div className="flex flex-wrap gap-2">
                  {serviceTypeOptions.map((st) => (
                    <button key={st} onClick={() => toggleServiceType(st)} className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
                      formData.service_type?.includes(st)
                        ? "bg-green-700 text-white border-green-700"
                        : "bg-white text-gray-600 border-gray-300 hover:border-orange-500"
                    }`}>{st}</button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                <textarea value={formData.notes || ""} onChange={(e) => setFormData({ ...formData, notes: e.target.value })} rows={3} className="input-field" />
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button onClick={() => { setShowAddModal(false); setEditingCustomer(null); }} className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800">Cancel</button>
              <button onClick={handleSave} className="btn-primary text-sm">
                {editingCustomer ? "Update" : "Add"} Customer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}