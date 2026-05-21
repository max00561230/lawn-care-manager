"use client";

import Link from "next/link";

export default function BookSuccessPage() {
  return (
    <div className="min-h-screen bg-green-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>

        <h1 className="text-2xl font-bold text-gray-900 mb-2">Request Received!</h1>
        <p className="text-gray-600 mb-6">
          Your appointment request has been submitted. We&apos;ll review it and contact you to confirm the details.
        </p>

        <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-6">
          <p className="text-sm text-green-800">
            <strong>What happens next?</strong><br />
            1. We review your request<br />
            2. We confirm or suggest a new time<br />
            3. You receive a confirmation
          </p>
        </div>

        <div className="flex flex-col gap-3">
          <Link
            href="/book/"
            className="w-full btn-accent py-2.5 text-center"
          >
            Book Another Service
          </Link>
          <Link
            href="/"
            className="w-full border border-gray-300 text-gray-700 hover:bg-gray-50 font-medium py-2.5 px-4 rounded-xl transition-colors"
          >
            Back to Home
          </Link>
        </div>

        <div className="mt-6 pt-4 border-t border-gray-100">
          <p className="text-xs text-gray-400">
            Powered by <span className="font-semibold text-green-700">Jade Rose Technology</span>
          </p>
        </div>
      </div>
    </div>
  );
}