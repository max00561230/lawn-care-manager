"use client";

import { useState } from "react";
import { useServices, useAuth } from "@/lib/storage";
import { Clock, Phone, MapPin, Check } from "lucide-react";

export default function BookPage() {
  const { services } = useServices();
  const { owner } = useAuth();
  const activeServices = services.filter((s) => s.is_active);
  const [formData, setFormData] = useState({
    service_id: "", name: "", address: "", phone: "", email: "", preferred_date: "", preferred_time: "", notes: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const businessName = owner?.businessName || "JRT Lawn Care";
  const businessPhone = "";
  const businessAddress = "";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.service_id) return;
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
      <div className="min-h-screen flex items-center justify-center p-4" style={{ background: "linear-gradient(180deg, #f0fdf4 0%, #f8fafc 38%, #eff6ff 100%)" }}>
        <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-8 text-center">
          <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <Check className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Request Submitted!</h2>
          <p className="text-gray-600 mb-6">Thank you, {formData.name}. We&apos;ve received your service request. We&apos;ll contact you shortly to confirm the details.</p>
          <div className="bg-green-50 rounded-xl p-4 mb-6 text-left text-sm">
            <p><span className="text-gray-500">Service:</span> <span className="font-semibold text-gray-900">{activeServices.find((s) => s.id === formData.service_id)?.name}</span></p>
            <p><span className="text-gray-500">Preferred Date:</span> <span className="font-semibold text-gray-900">{formData.preferred_date || "Not specified"}</span></p>
            <p><span className="text-gray-500">Preferred Time:</span> <span className="font-semibold text-gray-900">{formData.preferred_time || "Not specified"}</span></p>
          </div>
          <div className="flex gap-3 justify-center">
            <button onClick={() => { setSubmitted(false); setFormData({ service_id: "", name: "", address: "", phone: "", email: "", preferred_date: "", preferred_time: "", notes: "" }); }} className="btn-primary text-sm">
              Book Another
            </button>
            <a href="/" className="bg-gray-100 text-gray-700 px-6 py-2.5 rounded-xl font-medium hover:bg-gray-200 transition-colors text-sm">
              Home
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ background: "linear-gradient(180deg, #f0fdf4 0%, #f8fafc 38%, #eff6ff 100%)" }}>
      {/* Sticky header with backdrop blur */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-gray-200/50">
        <div className="max-w-2xl mx-auto flex items-center gap-3 px-4 py-3">
          <div className="w-10 h-10 rounded-xl bg-green-700 flex items-center justify-center text-white text-lg font-bold flex-shrink-0">
            🌿
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="text-lg font-bold text-gray-900 truncate">{businessName}</h1>
            <div className="flex items-center gap-3 text-xs text-gray-500">
              {businessAddress && (
                <span className="flex items-center gap-1 truncate">
                  <MapPin className="w-3 h-3 flex-shrink-0" />{businessAddress}
                </span>
              )}
              {businessPhone && (
                <a href={`tel:${businessPhone}`} className="flex items-center gap-1 text-orange-600 hover:text-orange-700 font-medium flex-shrink-0">
                  <Phone className="w-3 h-3" />Call
                </a>
              )}
            </div>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-100 text-green-700 text-xs font-semibold flex-shrink-0">
            <Clock className="w-3.5 h-3.5" />
            Book Now
          </div>
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-4 py-6">
        <div className="lg:flex lg:gap-6">
          {/* Service selection + form — main column */}
          <div className="flex-1 space-y-6">
            {/* Service cards grid */}
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-1">Request a Service</h2>
              <p className="text-sm text-gray-500 mb-4">Choose a service and fill out the form. We&apos;ll confirm your appointment.</p>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {activeServices.map((s) => {
                  const selected = formData.service_id === s.id;
                  return (
                    <button
                      key={s.id}
                      onClick={() => setFormData({ ...formData, service_id: s.id })}
                      className={`text-left p-4 rounded-2xl border-2 transition-all duration-200 ${
                        selected
                          ? "border-orange-500 bg-orange-50 shadow-md shadow-orange-500/10"
                          : "border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm"
                      }`}
                    >
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm mb-2 ${
                        selected ? "bg-orange-500 text-white" : "bg-green-100 text-green-700"
                      }`}>
                        {selected ? "✓" : "🌿"}
                      </div>
                      <p className="font-semibold text-gray-900 text-sm truncate">{s.name}</p>
                      <p className="text-orange-600 font-bold text-sm mt-1">${s.base_price}</p>
                      {s.estimated_time && (
                        <p className="text-xs text-gray-400 mt-0.5">{s.estimated_time}</p>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Booking form */}
            {formData.service_id && (
              <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
                <h3 className="font-semibold text-gray-900 mb-4">Your Details</h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Your Name *</label>
                    <input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required className="input-field" placeholder="John Smith" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Address</label>
                    <input type="text" value={formData.address} onChange={(e) => setFormData({ ...formData, address: e.target.value })} className="input-field" placeholder="123 Main St, Springfield" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">Phone</label>
                      <input type="tel" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} className="input-field" placeholder="(555) 123-4567" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
                      <input type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className="input-field" placeholder="john@email.com" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">Preferred Date</label>
                      <input type="date" value={formData.preferred_date} onChange={(e) => setFormData({ ...formData, preferred_date: e.target.value })} className="input-field" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">Preferred Time</label>
                      <input type="time" value={formData.preferred_time} onChange={(e) => setFormData({ ...formData, preferred_time: e.target.value })} className="input-field" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Additional Notes</label>
                    <textarea value={formData.notes} onChange={(e) => setFormData({ ...formData, notes: e.target.value })} rows={3} className="input-field" placeholder="Any special instructions..." />
                  </div>
                  <button type="submit" className="w-full btn-accent text-lg py-3.5">
                    Submit Request
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-gray-200/50 mt-12">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center justify-between text-xs text-gray-400">
          <span>Powered by Jade Rose Technology</span>
          <span>JRT LawnCare Manager Pro</span>
        </div>
      </footer>
    </div>
  );
}