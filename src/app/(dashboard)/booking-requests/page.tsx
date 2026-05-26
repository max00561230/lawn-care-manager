"use client";

import { useState } from "react";
import { useBookingRequests, useCustomers, useAppointments, useServices } from "@/lib/storage";
import { BookingRequest, BookingRequestStatus } from "@/types";
import { Clock, CheckCircle, XCircle, MessageSquare, ArrowRight, Mail, UserPlus, CalendarPlus, Filter } from "lucide-react";

export default function BookingRequestsPage() {
  const { bookingRequests, updateBookingRequest, deleteBookingRequest } = useBookingRequests();
  const { addCustomer } = useCustomers();
  const { addAppointment, updateAppointment } = useAppointments();
  const { services } = useServices();

  const [filter, setFilter] = useState<"all" | BookingRequestStatus>("all");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [suggestTimeId, setSuggestTimeId] = useState<string | null>(null);
  const [suggestTimeData, setSuggestTimeData] = useState({ date: "", time: "", note: "" });
  const [convertMode, setConvertMode] = useState<string | null>(null);

  const filtered = filter === "all"
    ? bookingRequests
    : bookingRequests.filter((r) => r.status === filter);

  const pending = bookingRequests.filter((r) => r.status === "pending").length;

  const statusColors: Record<BookingRequestStatus, string> = {
    pending: "bg-yellow-100 text-yellow-800 border-yellow-300",
    approved: "bg-green-100 text-green-800 border-green-300",
    suggested: "bg-blue-100 text-blue-800 border-blue-300",
    declined: "bg-red-100 text-red-800 border-red-300",
    converted: "bg-purple-100 text-purple-800 border-purple-300",
  };

  const statusLabels: Record<BookingRequestStatus, string> = {
    pending: "Pending",
    approved: "Approved",
    suggested: "Suggested Time",
    declined: "Declined",
    converted: "Converted to Appt",
  };

  const handleApprove = (id: string) => {
    updateBookingRequest(id, { status: "approved", response_note: "Your appointment request has been approved! We look forward to serving you." });
  };

  const handleSuggestTime = (id: string) => {
    if (!suggestTimeData.date) return;
    updateBookingRequest(id, {
      status: "suggested",
      response_note: `We'd like to suggest a different time: ${suggestTimeData.date}${suggestTimeData.time ? ` at ${suggestTimeData.time}` : ""}.${suggestTimeData.note ? ` ${suggestTimeData.note}` : ""}`,
    });
    setSuggestTimeId(null);
    setSuggestTimeData({ date: "", time: "", note: "" });
  };

  const handleDecline = (id: string) => {
    updateBookingRequest(id, { status: "declined", response_note: "We're sorry, we're unable to accommodate this request at this time." });
  };

  const handleConvert = (request: BookingRequest) => {
    // Create a customer first
    const newCustomer = addCustomer({
      name: request.name,
      address: request.address,
      phone: request.phone,
      email: request.email,
      service_type: request.service_ids,
      service_frequency: "one_time",
      notes: `Converted from booking request. Service: ${request.service_name}. Original preferred date: ${request.preferred_date || "N/A"}`,
      customer_type: "residential",
    });

    // Create an appointment
    const newAppt = addAppointment({
      customer_id: newCustomer.id,
      service_id: request.service_ids[0] || undefined,
      title: `${request.service_name} — ${request.name}`,
      date: request.preferred_date || new Date().toISOString().split("T")[0],
      start_time: request.preferred_time || undefined,
      notes: `From booking request. ${request.notes || ""}`,
    });
    // Mark as scheduled since this came from an approved booking request
    updateAppointment(newAppt.id, { status: "scheduled" });

    updateBookingRequest(request.id, {
      status: "converted",
      converted_customer_id: newCustomer.id,
      response_note: "Your request has been converted to a scheduled appointment. We'll see you soon!",
    });

    setConvertMode(null);
  };

  const getMailtoLink = (request: BookingRequest) => {
    const subject = encodeURIComponent(`Re: Your Service Request — ${request.service_name}`);
    const body = encodeURIComponent(
      request.response_note || `Hi ${request.name},\n\nThank you for reaching out about ${request.service_name}.\n\nWe'll be in touch soon.\n\nBest regards`
    );
    return `mailto:${request.email || ""}?subject=${subject}&body=${body}`;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Booking Requests</h1>
          <p className="text-sm text-gray-500 mt-1">
            {pending > 0 ? `${pending} pending request${pending > 1 ? "s" : ""} awaiting review` : "No pending requests"}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-gray-400" />
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value as "all" | BookingRequestStatus)}
            className="input-field w-auto text-sm py-2"
          >
            <option value="all">All ({bookingRequests.length})</option>
            <option value="pending">Pending ({bookingRequests.filter((r) => r.status === "pending").length})</option>
            <option value="approved">Approved ({bookingRequests.filter((r) => r.status === "approved").length})</option>
            <option value="suggested">Suggested ({bookingRequests.filter((r) => r.status === "suggested").length})</option>
            <option value="declined">Declined ({bookingRequests.filter((r) => r.status === "declined").length})</option>
            <option value="converted">Converted ({bookingRequests.filter((r) => r.status === "converted").length})</option>
          </select>
        </div>
      </div>

      {bookingRequests.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
          <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <CalendarPlus className="w-8 h-8 text-green-500" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No booking requests yet</h3>
          <p className="text-sm text-gray-500 mb-4">
            When customers submit service requests through your booking page, they&apos;ll appear here for review.
          </p>
          <div className="flex items-center justify-center gap-4 text-sm">
            <a href="/book/" className="btn-accent text-sm" target="_blank" rel="noopener noreferrer">
              View Booking Page
            </a>
            <a href="/book-flyer/" className="bg-gray-100 text-gray-700 px-4 py-2 rounded-xl hover:bg-gray-200 transition-colors text-sm font-medium">
              Print QR Flyer
            </a>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((request) => (
            <div key={request.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              {/* Request header */}
              <button
                onClick={() => setExpandedId(expandedId === request.id ? null : request.id)}
                className="w-full text-left px-6 py-4 flex items-center gap-4 hover:bg-gray-50/50 transition-colors"
              >
                <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-700 font-bold text-sm flex-shrink-0">
                  {request.name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-gray-900 truncate">{request.name}</span>
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${statusColors[request.status]}`}>
                      {statusLabels[request.status]}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 truncate">
                    {request.service_name} • {request.preferred_date || "No date pref."} {request.preferred_time || ""}
                  </p>
                </div>
                <div className="text-right text-xs text-gray-400 flex-shrink-0">
                  {new Date(request.created_at).toLocaleDateString()}
                </div>
                <svg
                  className={`w-5 h-5 text-gray-400 transition-transform flex-shrink-0 ${expandedId === request.id ? "rotate-180" : ""}`}
                  fill="none" viewBox="0 0 24 24" stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {/* Expanded detail */}
              {expandedId === request.id && (
                <div className="px-6 pb-6 border-t border-gray-100">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                    {/* Contact details */}
                    <div className="space-y-2">
                      <h4 className="font-semibold text-gray-900 text-sm flex items-center gap-1.5">
                        <UserPlus className="w-4 h-4 text-green-600" /> Contact Info
                      </h4>
                      {request.address && <p className="text-sm text-gray-600">📍 {request.address}</p>}
                      {request.phone && <p className="text-sm text-gray-600">📞 {request.phone}</p>}
                      {request.email && <p className="text-sm text-gray-600">✉️ {request.email}</p>}
                    </div>

                    {/* Service details */}
                    <div className="space-y-2">
                      <h4 className="font-semibold text-gray-900 text-sm flex items-center gap-1.5">
                        <Clock className="w-4 h-4 text-orange-500" /> Service Details
                      </h4>
                      <p className="text-sm text-gray-600">🌿 {request.service_name}</p>
                      {request.preferred_date && <p className="text-sm text-gray-600">📅 {request.preferred_date}</p>}
                      {request.preferred_time && <p className="text-sm text-gray-600">🕐 {request.preferred_time}</p>}
                    </div>
                  </div>

                  {request.notes && (
                    <div className="mt-3 p-3 bg-gray-50 rounded-xl text-sm text-gray-600">
                      <span className="font-medium text-gray-700">Notes:</span> {request.notes}
                    </div>
                  )}

                  {/* Response note */}
                  {request.response_note && (
                    <div className="mt-3 p-3 bg-blue-50 rounded-xl text-sm text-blue-800 border border-blue-200">
                      <span className="font-medium">Response:</span> {request.response_note}
                    </div>
                  )}

                  {/* Action buttons */}
                  <div className="mt-4 flex flex-wrap gap-2">
                    {request.status === "pending" && (
                      <>
                        <button
                          onClick={() => handleApprove(request.id)}
                          className="flex items-center gap-1.5 px-4 py-2 bg-green-600 text-white rounded-xl text-sm font-semibold hover:bg-green-700 transition-colors"
                        >
                          <CheckCircle className="w-4 h-4" />
                          Approve
                        </button>
                        <button
                          onClick={() => { setSuggestTimeId(request.id); setSuggestTimeData({ date: "", time: "", note: "" }); }}
                          className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-blue-700 transition-colors"
                        >
                          <Clock className="w-4 h-4" />
                          Suggest Time
                        </button>
                        <button
                          onClick={() => handleDecline(request.id)}
                          className="flex items-center gap-1.5 px-4 py-2 bg-red-100 text-red-700 rounded-xl text-sm font-semibold hover:bg-red-200 transition-colors border border-red-200"
                        >
                          <XCircle className="w-4 h-4" />
                          Decline
                        </button>
                        <button
                          onClick={() => setConvertMode(request.id)}
                          className="flex items-center gap-1.5 px-4 py-2 bg-purple-600 text-white rounded-xl text-sm font-semibold hover:bg-purple-700 transition-colors"
                        >
                          <ArrowRight className="w-4 h-4" />
                          Convert to Appt
                        </button>
                      </>
                    )}

                    {request.status === "approved" && (
                      <button
                        onClick={() => setConvertMode(request.id)}
                        className="flex items-center gap-1.5 px-4 py-2 bg-purple-600 text-white rounded-xl text-sm font-semibold hover:bg-purple-700 transition-colors"
                      >
                        <ArrowRight className="w-4 h-4" />
                        Convert to Appointment
                      </button>
                    )}

                    {request.status === "suggested" && (
                      <button
                        onClick={() => setConvertMode(request.id)}
                        className="flex items-center gap-1.5 px-4 py-2 bg-purple-600 text-white rounded-xl text-sm font-semibold hover:bg-purple-700 transition-colors"
                      >
                        <ArrowRight className="w-4 h-4" />
                        Convert to Appointment
                      </button>
                    )}

                    {/* Email preview */}
                    {request.email && request.response_note && (
                      <a
                        href={getMailtoLink(request)}
                        className="flex items-center gap-1.5 px-4 py-2 bg-orange-100 text-orange-700 rounded-xl text-sm font-semibold hover:bg-orange-200 transition-colors border border-orange-200"
                      >
                        <Mail className="w-4 h-4" />
                        Send Email
                      </a>
                    )}

                    {/* Delete */}
                    <button
                      onClick={() => { if (confirm("Delete this request?")) deleteBookingRequest(request.id); }}
                      className="flex items-center gap-1.5 px-4 py-2 bg-gray-100 text-gray-500 rounded-xl text-sm font-semibold hover:bg-gray-200 transition-colors"
                    >
                      🗑️ Delete
                    </button>
                  </div>

                  {/* Suggest time form */}
                  {suggestTimeId === request.id && (
                    <div className="mt-4 p-4 bg-blue-50 rounded-xl border border-blue-200">
                      <h4 className="font-semibold text-blue-900 text-sm mb-3 flex items-center gap-1.5">
                        <MessageSquare className="w-4 h-4" />
                        Suggest a different time
                      </h4>
                      <div className="grid grid-cols-2 gap-3 mb-3">
                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-1">Suggested Date *</label>
                          <input
                            type="date"
                            value={suggestTimeData.date}
                            onChange={(e) => setSuggestTimeData({ ...suggestTimeData, date: e.target.value })}
                            className="input-field text-sm"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-1">Suggested Time</label>
                          <input
                            type="time"
                            value={suggestTimeData.time}
                            onChange={(e) => setSuggestTimeData({ ...suggestTimeData, time: e.target.value })}
                            className="input-field text-sm"
                          />
                        </div>
                      </div>
                      <div className="mb-3">
                        <label className="block text-xs font-medium text-gray-700 mb-1">Note</label>
                        <input
                          type="text"
                          value={suggestTimeData.note}
                          onChange={(e) => setSuggestTimeData({ ...suggestTimeData, note: e.target.value })}
                          className="input-field text-sm"
                          placeholder="Optional message..."
                        />
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleSuggestTime(request.id)}
                          disabled={!suggestTimeData.date}
                          className="btn-accent text-sm disabled:opacity-50"
                        >
                          Send Suggestion
                        </button>
                        <button
                          onClick={() => setSuggestTimeId(null)}
                          className="bg-gray-100 text-gray-700 px-4 py-2 rounded-xl text-sm font-medium hover:bg-gray-200 transition-colors"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Convert confirmation */}
                  {convertMode === request.id && (
                    <div className="mt-4 p-4 bg-purple-50 rounded-xl border border-purple-200">
                      <h4 className="font-semibold text-purple-900 text-sm mb-2 flex items-center gap-1.5">
                        <ArrowRight className="w-4 h-4" />
                        Convert to Appointment
                      </h4>
                      <p className="text-sm text-purple-700 mb-3">
                        This will create a new customer record and a scheduled appointment from this request.
                      </p>
                      <div className="bg-white rounded-lg p-3 border border-purple-200 text-sm space-y-1 mb-3">
                        <p><span className="text-gray-500">Customer:</span> <span className="font-medium">{request.name}</span></p>
                        <p><span className="text-gray-500">Service:</span> <span className="font-medium">{request.service_name}</span></p>
                        <p><span className="text-gray-500">Date:</span> <span className="font-medium">{request.preferred_date || "TBD"}</span></p>
                        {request.preferred_time && <p><span className="text-gray-500">Time:</span> <span className="font-medium">{request.preferred_time}</span></p>}
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleConvert(request)}
                          className="bg-purple-600 text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-purple-700 transition-colors"
                        >
                          Confirm & Create Appointment
                        </button>
                        <button
                          onClick={() => setConvertMode(null)}
                          className="bg-gray-100 text-gray-700 px-4 py-2 rounded-xl text-sm font-medium hover:bg-gray-200 transition-colors"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}