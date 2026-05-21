"use client";

import { useEffect, useState, useRef } from "react";
import QRCode from "qrcode";
import { useAuth } from "@/lib/storage";
import { Printer, X } from "lucide-react";
import Link from "next/link";

export default function FlyerPage() {
  const { owner } = useAuth();
  const [qrDataUrl, setQrDataUrl] = useState("");
  const printRef = useRef<HTMLDivElement>(null);

  const businessName = owner?.businessName || "JRT Lawn Care";
  const businessPhone = "";
  // The booking page URL — uses current origin for the QR code
  const bookUrl = typeof window !== "undefined" ? `${window.location.origin}/book/` : "";

  useEffect(() => {
    if (bookUrl) {
      QRCode.toDataURL(bookUrl, {
        width: 300,
        margin: 2,
        color: { dark: "#1a1a1a", light: "#ffffff" },
      }).then(setQrDataUrl).catch(console.error);
    }
  }, [bookUrl]);

  const FlyerCard = () => (
    <div className="w-full bg-white rounded-2xl shadow-xl overflow-hidden" style={{ height: "5in" }}>
      {/* Top green band */}
      <div className="bg-green-700 px-6 py-4 text-white">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center text-xl">🌿</div>
          <div>
            <h1 className="text-lg font-bold">{businessName}</h1>
            <p className="text-xs text-green-200">Book Your Service Online</p>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="px-6 py-5 text-center">
        <p className="text-2xl font-bold text-gray-900 mb-1">📱 Scan to Book!</p>
        <p className="text-sm text-gray-500 mb-4">Quick &amp; easy — no app download needed</p>

        {/* QR Code */}
        {qrDataUrl && (
          <div className="flex justify-center mb-4">
            <img src={qrDataUrl} alt="Scan to book" className="w-48 h-48" />
          </div>
        )}

        {/* Feature highlights */}
        <div className="grid grid-cols-2 gap-2 text-left text-xs mb-4">
          <div className="flex items-center gap-1.5 text-gray-700">
            <span className="text-green-600">✅</span> No app download
          </div>
          <div className="flex items-center gap-1.5 text-gray-700">
            <span className="text-orange-500">⏱️</span> Quick scheduling
          </div>
          <div className="flex items-center gap-1.5 text-gray-700">
            <span className="text-blue-500">📋</span> All services listed
          </div>
          <div className="flex items-center gap-1.5 text-gray-700">
            <span className="text-purple-500">🔔</span> Confirmation alerts
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-100 pt-3 flex items-center justify-between text-xs text-gray-400">
          {businessPhone && <span>📞 {businessPhone}</span>}
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
            Print QR Flyer
          </h1>
          <div className="flex items-center gap-3">
            <button
              onClick={() => window.print()}
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

      {/* Printable area */}
      <div ref={printRef} className="max-w-3xl mx-auto px-8 py-8">
        <div className="grid grid-rows-2 gap-4" style={{ pageBreakInside: "avoid" }}>
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