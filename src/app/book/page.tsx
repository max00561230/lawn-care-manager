"use client";

import { useState } from "react";
import { useServices, useAuth } from "@/lib/storage";
import { Clock, Phone, MapPin, Check } from "lucide-react";

export default function BookPage() {
  const { services } = useServices();
  const { owner } = useAuth();
  const activeServices = services.filter((s) => s.is_active);
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [formData, setFormData] = useState({
    name: "", address: "", phone: "", email: "", preferred_date: "", preferred_time: "", notes: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const businessName = owner?.businessName || "JRT Lawn Care";
  const businessPhone = "";
  const businessAddress = "";

  const toggleService = (id: string) => {
    setSelectedServices((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  };

  const totalPrice = selectedServices.reduce((sum, id) => {
    const svc = activeServices.find((s) => s.id === id);
    return sum + (svc?.base_price || 0);
  }, 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || selectedServices.length === 0) return;

    const bookings = JSON.parse(localStorage.getItem("lcm_bookings") || "[]");
    const serviceNames = selectedServices
      .map((id) => activeServices.find((s) => s.id === id)?.name)
      .filter(Boolean)
      .join(", ");

    bookings.push({
      id: Date.now().toString(36),
      ...formData,
      service_ids: selectedServices,
      service_name: serviceNames,
      created_at: new Date().toISOString(),
    });
    localStorage.setItem("lcm_bookings", JSON.stringify(bookings));
    setSubmitted(true);
  };

  if (submitted) {
    const selectedNames = selectedServices
      .map((id) => activeServices.find((s) => s.id === id)?.name)
      .filter(Boolean);

    return (
      <div className="min-h-screen flex items-center justify-center p-4" style={{ background: "linear-gradient(180deg, #f0fdf4 0%, #f8fafc 38%, #eff6ff 100%)" }}>
        <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-8 text-center">
          <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <Check className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Request Submitted!</h2>
          <p className="text-gray-600 mb-6">Thank you, {formData.name}. We&apos;ve received your service request. We&apos;ll contact you shortly to confirm the details.</p>
          <div className="bg-green-50 rounded-xl p-4 mb-6 text-left text-sm space-y-2">
            <p><span className="text-gray-500">Service(s):</span> <span className="font-semibold text-gray-900">{selectedNames.join(", ")}</span></p>
            <p><span className="text-gray-500">Preferred Date:</span> <span className="font-semibold text-gray-900">{formData.preferred_date || "Not specified"}</span></p>
            <p><span className="text-gray-500">Preferred Time:</span> <span className="font-semibold text-gray-900">{formData.preferred_time || "Not specified"}</span></p>
            {totalPrice > 0 && (
              <p><span className="text-gray-500">Estimated Total:</span> <span className="font-bold text-green-700">${totalPrice}</span></p>
            )}
          </div>
          <div className="flex gap-3 justify-center">
            <button
              onClick={() => {
                setSubmitted(false);
                setSelectedServices([]);
                setFormData({ name: "", address: "", phone: "", email: "", preferred_date: "", preferred_time: "", notes: "" });
              }}
              className="btn-primary text-sm"
            >
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
      {/* Sticky header */}
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
          <div className="flex-1 space-y-6">
            {/* Service selection */}
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-1">Request a Service</h2>
              <p className="text-sm text-gray-500 mb-4">Select one or more services and fill out the form. We&apos;ll confirm your appointment.</p>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {activeServices.map((s) => {
                  const selected = selectedServices.includes(s.id);
                  return (
                    <button
                      key={s.id}
                      onClick={() => toggleService(s.id)}
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

              {/* Selected services summary */}
              {selectedServices.length > 0 && (
                <div className="mt-4 bg-green-50 border border-green-200 rounded-xl p-4">
                  <h3 className="font-semibold text-green-900 text-sm mb-2">
                    Selected ({selectedServices.length} service{selectedServices.length > 1 ? "s" : ""})
                  </h3>
                  <div className="space-y-1.5">
                    {selectedServices.map((id) => {
                      const svc = activeServices.find((s) => s.id === id);
                      return svc ? (
                        <div key={id} className="flex items-center justify-between text-sm">
                          <span className="text-gray-700">{svc.name}</span>
                          <span className="font-semibold text-gray-900">${svc.base_price}</span>
                        </div>
                      ) : null;
                    })}
                    {selectedServices.length > 1 && (
                      <div className="border-t border-green-200 pt-1.5 mt-1.5 flex items-center justify-between text-sm font-bold">
                        <span className="text-green-900">Estimated Total</span>
                        <span className="text-green-700">${totalPrice}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Booking form */}
            {selectedServices.length > 0 && (
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
                    <textarea value={formData.notes} onChange={(e) => setFormData({ ...formData, notes: e.target.value })} rows={3} className="input-field" placeholder="Any special instructions, yard size, gate code, etc..." />
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