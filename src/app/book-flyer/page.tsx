"use client";

import { useEffect, useState, useRef } from "react";
import QRCode from "qrcode";
import { useServices, useAuth } from "@/lib/storage";
import { Printer, X } from "lucide-react";
import Link from "next/link";

export default function BookFlyerPage() {
  const { owner } = useAuth();
  const { services } = useServices();
  const [qrDataUrl, setQrDataUrl] = useState("");
  const printRef = useRef<HTMLDivElement>(null);

  const businessName = owner?.businessName || "JRT Lawn Care";
  const businessPhone = "";
  const activeServices = services.filter((s) => s.is_active);
  const bookUrl = typeof window !== "undefined" ? `${window.location.origin}/book/` : "";

  useEffect(() => {
    if (bookUrl) {
      QRCode.toDataURL(bookUrl, {
        width: 400,
        margin: 2,
        color: { dark: "#14532d", light: "#ffffff" },
      }).then(setQrDataUrl).catch(console.error);
    }
  }, [bookUrl]);

  const handlePrint = () => window.print();

  const FlyerCard = () => (
    <div className="bg-white rounded-2xl shadow-xl overflow-hidden" style={{ minHeight: "8in" }}>
      {/* Top green band */}
      <div className="bg-gradient-to-r from-green-700 to-emerald-600 px-8 py-6 text-white">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center text-3xl shadow-lg">
            🌿
          </div>
          <div className="flex-1">
            <h1 className="text-2xl font-extrabold tracking-tight">{businessName}</h1>
            <p className="text-green-100 text-sm font-medium mt-0.5">Professional Lawn Care Services</p>
          </div>
        </div>
      </div>

      {/* QR Code + CTA */}
      <div className="px-8 py-8 text-center">
        <div className="inline-block bg-white p-4 rounded-2xl shadow-md border-4 border-green-100 mb-6">
          {qrDataUrl && <img src={qrDataUrl} alt="Scan to book" className="w-56 h-56" />}
        </div>

        <h2 className="text-2xl font-extrabold text-gray-900 mb-2">
          📱 Scan to Book Your Service
        </h2>
        <p className="text-gray-500 text-sm mb-6">
          No app download needed — just point your phone camera at the QR code
        </p>

        {/* How it works steps */}
        <div className="bg-green-50 rounded-2xl p-6 mb-6 text-left">
          <h3 className="font-bold text-green-900 text-base mb-4 text-center">How to Book in 3 Easy Steps</h3>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-green-600 text-white flex items-center justify-center font-bold text-sm flex-shrink-0">1</div>
              <div>
                <p className="font-semibold text-gray-900 text-sm">Scan the QR Code</p>
                <p className="text-xs text-gray-500">Point your phone camera at the square above — it&apos;ll open our booking page instantly</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-green-600 text-white flex items-center justify-center font-bold text-sm flex-shrink-0">2</div>
              <div>
                <p className="font-semibold text-gray-900 text-sm">Pick Your Services</p>
                <p className="text-xs text-gray-500">Select one or more services, choose your preferred date & time, and fill in your details</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-green-600 text-white flex items-center justify-center font-bold text-sm flex-shrink-0">3</div>
              <div>
                <p className="font-semibold text-gray-900 text-sm">Submit & We&apos;ll Confirm</p>
                <p className="text-xs text-gray-500">Hit submit — we&apos;ll review your request and reach out to confirm your appointment</p>
              </div>
            </div>
          </div>
        </div>

        {/* Services highlight */}
        <div className="mb-6">
          <h3 className="font-bold text-gray-900 text-sm mb-3 text-center">🌿 Services We Offer</h3>
          <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-left text-sm">
            {activeServices.slice(0, 8).map((s) => (
              <div key={s.id} className="flex items-center justify-between">
                <span className="text-gray-700">{s.name}</span>
                <span className="text-green-700 font-semibold ml-1">${s.base_price}</span>
              </div>
            ))}
            {activeServices.length > 8 && (
              <p className="col-span-2 text-gray-400 text-xs italic mt-1">+ {activeServices.length - 8} more services — scan QR for full list</p>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-100 pt-4 flex items-center justify-between text-xs text-gray-400">
          {businessPhone && <span className="font-medium text-gray-600">📞 {businessPhone}</span>}
          <span>Powered by Jade Rose Technology</span>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen" style={{ background: "linear-gradient(180deg, #f0fdf4 0%, #f8fafc 38%, #eff6ff 100%)" }}>
      {/* Toolbar — hidden on print */}
      <div className="no-print sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-gray-200/50">
        <div className="max-w-3xl mx-auto flex items-center justify-between px-4 py-3">
          <h1 className="font-bold text-gray-900 flex items-center gap-2">
            <Printer className="w-5 h-5 text-orange-500" />
            Book Now QR Flyer
          </h1>
          <div className="flex items-center gap-3">
            <button
              onClick={handlePrint}
              className="btn-accent text-sm flex items-center gap-2"
            >
              <Printer className="w-4 h-4" />
              Print / Save PDF
            </button>
            <Link href="/dashboard/" className="bg-gray-100 text-gray-700 px-4 py-2 rounded-xl hover:bg-gray-200 transition-colors text-sm font-medium flex items-center gap-1">
              <X className="w-4 h-4" />
              Close
            </Link>
          </div>
        </div>
      </div>

      {/* Info banner */}
      <div className="no-print max-w-3xl mx-auto px-4 py-3">
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 text-sm text-blue-800">
          <strong>📌 How to use this flyer:</strong> Print it out and hand it to customers, post it at job sites, or include it with invoices. Customers scan the QR code with their phone camera to book services instantly.
        </div>
      </div>

      {/* Printable area */}
      <div ref={printRef} className="max-w-3xl mx-auto px-8 py-4">
        <div className="grid grid-rows-2 gap-6" style={{ pageBreakInside: "avoid" }}>
          <FlyerCard />
          {/* Cut line */}
          <div className="flex items-center gap-4 text-gray-300 text-xs no-print my-2">
            <div className="flex-1 border-t-2 border-dashed border-gray-300" />
            <span className="whitespace-nowrap">✂ CUT HERE</span>
            <div className="flex-1 border-t-2 border-dashed border-gray-300" />
          </div>
          <FlyerCard />
        </div>
      </div>

      {/* Print-specific styles */}
      <style jsx global>{`
        @media print {
          body {
            background: white !important;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
          .no-print {
            display: none !important;
          }
          @page {
            size: letter;
            margin: 0.5in;
          }
        }
      `}</style>
    </div>
  );
}