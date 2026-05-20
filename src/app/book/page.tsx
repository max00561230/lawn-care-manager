"use client";

import { useState } from "react";
import { useServices } from "@/lib/storage";

export default function BookPage() {
  const { services } = useServices();
  const activeServices = services.filter((s) => s.is_active);
  const [formData, setFormData] = useState({
    service_id: "", name: "", address: "", phone: "", email: "", preferred_date: "", preferred_time: "", notes: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.service_id) return;
    // Store the booking request in localStorage for the business owner
    const bookings = JSON.parse(localStorage.getItem("lcm_bookings") || "[]");
    const selectedService = activeServices.find((s) => s.id === formData.service_id);
    bookings.push({
      id: Date.now().toString(36),
      ...formData,
      service_name: selectedService?.name || "",
      created_at: new Date().toISOString(),
    });
    localStorage.setItem("lcm_bookings", JSON.stringify(bookings));
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-lg max-w-md w-full p-8 text-center">
          <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
          </div>
          <h2 className="text-xl font-bold text-green-900 mb-2">Request Submitted!</h2>
          <p className="text-gray-600 mb-6">Thank you, {formData.name}. We&apos;ve received your service request. We&apos;ll contact you shortly to confirm the details.</p>
          <div className="bg-green-50 rounded-lg p-4 mb-6 text-left text-sm">
            <p><span className="text-gray-500">Service:</span> <span className="font-medium">{activeServices.find((s) => s.id === formData.service_id)?.name}</span></p>
            <p><span className="text-gray-500">Preferred Date:</span> <span className="font-medium">{formData.preferred_date || "Not specified"}</span></p>
            <p><span className="text-gray-500">Preferred Time:</span> <span className="font-medium">{formData.preferred_time || "Not specified"}</span></p>
          </div>
          <div className="flex gap-3 justify-center">
            <button onClick={() => { setSubmitted(false); setFormData({ service_id: "", name: "", address: "", phone: "", email: "", preferred_date: "", preferred_time: "", notes: "" }); }} className="bg-green-700 text-white px-6 py-2 rounded-lg font-medium hover:bg-green-800 transition-colors">
              Book Another
            </button>
            <a href="/" className="bg-gray-100 text-gray-700 px-6 py-2 rounded-lg font-medium hover:bg-gray-200 transition-colors">
              Home
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100">
      {/* Header */}
      <header className="bg-green-900 text-white">
        <div className="max-w-md mx-auto flex items-center gap-3 px-4 py-4">
          <img src="/jrt-logo.png" alt="JRT" className="w-10 h-10 rounded" />
          <div>
            <h1 className="text-lg font-bold text-yellow-400">JRT Lawn Care</h1>
            <p className="text-xs text-green-300">Book Your Service</p>
          </div>
        </div>
      </header>

      <div className="max-w-md mx-auto px-4 py-6">
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h2 className="text-xl font-bold text-green-900 mb-1">Request a Service</h2>
          <p className="text-sm text-gray-500 mb-6">Fill out the form below and we&apos;ll get back to you to confirm.</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Service *</label>
              <select value={formData.service_id} onChange={(e) => setFormData({ ...formData, service_id: e.target.value })} required className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:border-green-500 focus:ring-1 focus:ring-green-500">
                <option value="">Select a service</option>
                {activeServices.map((s) => <option key={s.id} value={s.id}>{s.name} — ${s.base_price}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Your Name *</label>
              <input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:border-green-500 focus:ring-1 focus:ring-green-500" placeholder="John Smith" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
              <input type="text" value={formData.address} onChange={(e) => setFormData({ ...formData, address: e.target.value })} className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:border-green-500 focus:ring-1 focus:ring-green-500" placeholder="123 Main St, Springfield" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                <input type="tel" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:border-green-500 focus:ring-1 focus:ring-green-500" placeholder="(555) 123-4567" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:border-green-500 focus:ring-1 focus:ring-green-500" placeholder="john@email.com" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Preferred Date</label>
                <input type="date" value={formData.preferred_date} onChange={(e) => setFormData({ ...formData, preferred_date: e.target.value })} className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:border-green-500 focus:ring-1 focus:ring-green-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Preferred Time</label>
                <input type="time" value={formData.preferred_time} onChange={(e) => setFormData({ ...formData, preferred_time: e.target.value })} className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:border-green-500 focus:ring-1 focus:ring-green-500" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Additional Notes</label>
              <textarea value={formData.notes} onChange={(e) => setFormData({ ...formData, notes: e.target.value })} rows={3} className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:border-green-500 focus:ring-1 focus:ring-green-500" placeholder="Any special instructions..." />
            </div>
            <button type="submit" className="w-full bg-green-700 text-white py-3 rounded-lg font-medium hover:bg-green-800 transition-colors text-lg">
              Submit Request
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}