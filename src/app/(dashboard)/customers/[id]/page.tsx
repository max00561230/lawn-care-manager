"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useCustomers, useAppointments, usePayments } from "@/lib/storage";
import { APPOINTMENT_STATUSES, SERVICE_FREQUENCIES, DAYS_OF_WEEK } from "@/lib/constants";
import { ArrowLeft, Edit, Mail, Phone, MapPin } from "lucide-react";
import Link from "next/link";
import type { Customer, ServiceFrequency, CustomerType } from "@/types";

export default function CustomerDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const { customers, updateCustomer } = useCustomers();
  const { appointments } = useAppointments();
  const { payments } = usePayments();

  const customer = customers.find((c) => c.id === id);
  const [editMode, setEditMode] = useState(false);
  const [editData, setEditData] = useState<Partial<Customer>>(customer ?? {});

  if (!customer) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Customer not found</p>
        <Link href="/customers/" className="text-orange-600 hover:text-orange-700 mt-2 inline-block">Back to Customers</Link>
      </div>
    );
  }

  const custAppts = appointments.filter((a) => a.customer_id === id).sort((a, b) => b.date.localeCompare(a.date));
  const custPayments = payments.filter((p) => p.customer_id === id).sort((a, b) => b.created_at.localeCompare(a.created_at));

  const getStatusLabel = (status: string) => APPOINTMENT_STATUSES.find((s) => s.value === status)?.label || status;
  const getStatusColor = (status: string) => APPOINTMENT_STATUSES.find((s) => s.value === status)?.color || "#94a3b8";

  const handleSave = () => {
    updateCustomer(id, editData);
    setEditMode(false);
  };

  return (
    <div className="space-y-6">
      <button onClick={() => router.back()} className="flex items-center gap-1 text-sm text-orange-600 hover:text-orange-700">
        <ArrowLeft className="w-4 h-4" /> Back
      </button>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-green-700 text-white flex items-center justify-center text-xl font-bold">
              {customer.name.charAt(0)}
            </div>
            <div>
              {editMode ? (
                <input type="text" value={editData.name || ""} onChange={(e) => setEditData({ ...editData, name: e.target.value })} className="text-xl font-bold border border-gray-300 rounded-xl px-2 py-1" />
              ) : (
                <h1 className="text-xl font-bold text-gray-900">{customer.name}</h1>
              )}
              <div className="flex flex-wrap gap-3 mt-1 text-sm text-gray-500">
                {customer.phone && <span className="flex items-center gap-1"><Phone className="w-3.5 h-3.5" />{customer.phone}</span>}
                {customer.email && <span className="flex items-center gap-1"><Mail className="w-3.5 h-3.5" />{customer.email}</span>}
                {customer.address && <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" />{customer.address}</span>}
              </div>
              <div className="flex gap-2 mt-2">
                <span className={`text-xs px-2 py-0.5 rounded-full ${customer.status === "active" ? "bg-green-100 text-green-700" : customer.status === "new" ? "bg-yellow-100 text-yellow-700" : "bg-gray-100 text-gray-600"}`}>{customer.status}</span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-blue-100 text-blue-700">{customer.customer_type}</span>
                <span className={`text-xs px-2 py-0.5 rounded-full ${customer.payment_status === "paid" ? "bg-green-100 text-green-700" : customer.payment_status === "unpaid" ? "bg-yellow-100 text-yellow-700" : "bg-red-100 text-red-700"}`}>{customer.payment_status?.replace("_", " ")}</span>
              </div>
            </div>
          </div>
          <button onClick={() => { if (editMode) { setEditData(customer); } setEditMode(!editMode); }} className="flex items-center gap-1 text-sm text-orange-600 hover:text-orange-700 px-3 py-1.5 border border-orange-500 rounded-xl">
            <Edit className="w-4 h-4" /> {editMode ? "Cancel" : "Edit"}
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-6 text-sm">
          {editMode ? (
            <>
              <div><label className="block text-gray-500 mb-1">Address</label><input type="text" value={editData.address || ""} onChange={(e) => setEditData({ ...editData, address: e.target.value })} className="input-field" /></div>
              <div><label className="block text-gray-500 mb-1">Phone</label><input type="text" value={editData.phone || ""} onChange={(e) => setEditData({ ...editData, phone: e.target.value })} className="input-field" /></div>
              <div><label className="block text-gray-500 mb-1">Email</label><input type="text" value={editData.email || ""} onChange={(e) => setEditData({ ...editData, email: e.target.value })} className="input-field" /></div>
              <div><label className="block text-gray-500 mb-1">Service Frequency</label><select value={editData.service_frequency || "weekly"} onChange={(e) => setEditData({ ...editData, service_frequency: e.target.value as ServiceFrequency })} className="input-field">{SERVICE_FREQUENCIES.map((f) => <option key={f.value} value={f.value}>{f.label}</option>)}</select></div>
              <div><label className="block text-gray-500 mb-1">Property Size</label><input type="text" value={editData.property_size || ""} onChange={(e) => setEditData({ ...editData, property_size: e.target.value })} className="input-field" /></div>
              <div><label className="block text-gray-500 mb-1">Gate Code</label><input type="text" value={editData.gate_code || ""} onChange={(e) => setEditData({ ...editData, gate_code: e.target.value })} className="input-field" /></div>
              <div><label className="block text-gray-500 mb-1">Preferred Day</label><select value={editData.preferred_day || ""} onChange={(e) => setEditData({ ...editData, preferred_day: e.target.value })} className="input-field"><option value="">No preference</option>{DAYS_OF_WEEK.map((d) => <option key={d} value={d}>{d}</option>)}</select></div>
              <div><label className="block text-gray-500 mb-1">Customer Type</label><select value={editData.customer_type || "residential"} onChange={(e) => setEditData({ ...editData, customer_type: e.target.value as CustomerType })} className="input-field"><option value="residential">Residential</option><option value="commercial">Commercial</option></select></div>
              <div className="sm:col-span-2 lg:col-span-3"><label className="block text-gray-500 mb-1">Notes</label><textarea value={editData.notes || ""} onChange={(e) => setEditData({ ...editData, notes: e.target.value })} rows={3} className="input-field" /></div>
              <div className="sm:col-span-2 lg:col-span-3 flex justify-end gap-3">
                <button onClick={() => { setEditData(customer); setEditMode(false); }} className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800">Cancel</button>
                <button onClick={handleSave} className="btn-primary text-sm">Save Changes</button>
              </div>
            </>
          ) : (
            <>
              <div><span className="text-gray-500">Frequency:</span> <span className="font-medium">{customer.service_frequency?.replace("_", " ") || "—"}</span></div>
              <div><span className="text-gray-500">Property Size:</span> <span className="font-medium">{customer.property_size || "—"}</span></div>
              <div><span className="text-gray-500">Gate Code:</span> <span className="font-medium">{customer.gate_code || "—"}</span></div>
              <div><span className="text-gray-500">Preferred Day:</span> <span className="font-medium">{customer.preferred_day || "—"}</span></div>
              <div><span className="text-gray-500">Customer Since:</span> <span className="font-medium">{customer.customer_since}</span></div>
              <div><span className="text-gray-500">Next Service:</span> <span className="font-medium">{customer.next_service_date || "—"}</span></div>
              {customer.service_type && customer.service_type.length > 0 && (
                <div className="sm:col-span-2 lg:col-span-3">
                  <span className="text-gray-500">Services:</span>{" "}
                  {customer.service_type.map((s) => <span key={s} className="inline-block bg-green-100 text-green-700 text-xs px-2 py-0.5 rounded-full mr-1">{s}</span>)}
                </div>
              )}
              {customer.notes && (
                <div className="sm:col-span-2 lg:col-span-3"><span className="text-gray-500">Notes:</span><p className="mt-1 text-gray-700">{customer.notes}</p></div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Service History */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
        <div className="px-5 py-4 border-b border-gray-100">
          <h2 className="font-semibold text-gray-900">Service History ({custAppts.length})</h2>
        </div>
        {custAppts.length === 0 ? (
          <p className="px-5 py-8 text-gray-400 text-sm text-center">No service history</p>
        ) : (
          <div className="divide-y divide-gray-50">
            {custAppts.map((apt) => {
              const st = { label: getStatusLabel(apt.status), color: getStatusColor(apt.status) };
              return (
                <div key={apt.id} className="px-5 py-3 flex items-center gap-4">
                  <div className="w-24 text-sm text-gray-500">{apt.date}</div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 truncate">{apt.title}</p>
                    <p className="text-xs text-gray-500">{apt.start_time || "—"} {apt.service?.name || ""}</p>
                  </div>
                  <span className="status-badge" style={{ backgroundColor: st.color + "22", color: st.color }}>{st.label}</span>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Payment History */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
        <div className="px-5 py-4 border-b border-gray-100">
          <h2 className="font-semibold text-gray-900">Payment History ({custPayments.length})</h2>
        </div>
        {custPayments.length === 0 ? (
          <p className="px-5 py-8 text-gray-400 text-sm text-center">No payment history</p>
        ) : (
          <div className="divide-y divide-gray-50">
            {custPayments.map((p) => (
              <div key={p.id} className="px-5 py-3 flex items-center gap-4">
                <div className="w-24 text-sm text-gray-500">{p.paid_at || p.created_at}</div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900">{p.description || "Payment"}</p>
                  <p className="text-xs text-gray-500">{p.payment_type}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-gray-900">${p.amount.toLocaleString()}</p>
                  <span className={`text-xs ${p.status === "paid" ? "text-green-600" : p.status === "past_due" ? "text-red-600" : "text-yellow-600"}`}>{p.status.replace("_", " ")}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}