"use client";

import { useState } from "react";
import { useSettings, useAuth, exportAllData, importAllData, resetAllData } from "@/lib/storage";
import EmailSettingsSection from "@/components/EmailSettings";

export default function SettingsPage() {
  const { settings, updateSettings } = useSettings();
  const { owner, updatePin, updateBusinessName } = useAuth();
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [importText, setImportText] = useState("");
  const [newPin, setNewPin] = useState("");
  const [pinSaved, setPinSaved] = useState(false);

  const handleExport = () => {
    const data = exportAllData();
    const blob = new Blob([data], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `lawncare-backup-${new Date().toISOString().split("T")[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = () => {
    if (!importText.trim()) return;
    const success = importAllData(importText);
    if (!success) {
      alert("Failed to import data. Please check the format.");
    }
  };

  const handleReset = () => {
    resetAllData();
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <h1 className="text-2xl font-bold text-gray-900">Settings</h1>

      {/* Account / PIN */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <h2 className="font-semibold text-gray-900 mb-4">Account</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Business Name</label>
            <input
              type="text"
              value={owner?.businessName || ""}
              onChange={(e) => updateBusinessName(e.target.value)}
              className="input-field"
              placeholder="Your business name"
            />
            <p className="text-xs text-gray-400 mt-1">This appears on your app banner and bills</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Change PIN</label>
            <div className="flex gap-2">
              <input
                type="password"
                inputMode="numeric"
                maxLength={10}
                value={newPin}
                onChange={(e) => { setNewPin(e.target.value.replace(/\D/g, "")); setPinSaved(false); }}
                className="input-field flex-1"
                placeholder="Enter new PIN"
              />
              <button
                onClick={() => {
                  if (newPin.length >= 4) {
                    updatePin(newPin);
                    setNewPin("");
                    setPinSaved(true);
                    setTimeout(() => setPinSaved(false), 3000);
                  } else {
                    alert("PIN must be at least 4 digits");
                  }
                }}
                className="btn-primary text-sm whitespace-nowrap"
              >
                {pinSaved ? "✓ Saved" : "Update PIN"}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Business Info */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <h2 className="font-semibold text-gray-900 mb-4">Business Information</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Company Name</label>
            <input type="text" value={settings.company_name} onChange={(e) => updateSettings({ company_name: e.target.value })} className="input-field" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
              <input type="tel" value={settings.phone} onChange={(e) => updateSettings({ phone: e.target.value })} className="input-field" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input type="email" value={settings.email} onChange={(e) => updateSettings({ email: e.target.value })} className="input-field" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
            <input type="text" value={settings.address} onChange={(e) => updateSettings({ address: e.target.value })} className="input-field" />
          </div>
        </div>
      </div>

      {/* Email Settings */}
      <EmailSettingsSection />

      {/* Working Hours */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <h2 className="font-semibold text-gray-900 mb-4">Working Hours</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Start Time</label>
            <input type="time" value={settings.working_hours_start} onChange={(e) => updateSettings({ working_hours_start: e.target.value })} className="input-field" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">End Time</label>
            <input type="time" value={settings.working_hours_end} onChange={(e) => updateSettings({ working_hours_end: e.target.value })} className="input-field" />
          </div>
        </div>
      </div>

      {/* Service Area */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <h2 className="font-semibold text-gray-900 mb-4">Default Service Area</h2>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Service Area Description</label>
          <input type="text" value={settings.service_area} onChange={(e) => updateSettings({ service_area: e.target.value })} className="input-field" />
        </div>
      </div>

      {/* Notifications */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <h2 className="font-semibold text-gray-900 mb-4">Notification Preferences</h2>
        <div className="space-y-3">
          <label className="flex items-center gap-3">
            <input type="checkbox" checked={settings.notification_email} onChange={(e) => updateSettings({ notification_email: e.target.checked })} className="rounded border-gray-300 text-green-700 focus:ring-orange-500" />
            <span className="text-sm text-gray-700">Email notifications</span>
          </label>
          <label className="flex items-center gap-3">
            <input type="checkbox" checked={settings.notification_sms} onChange={(e) => updateSettings({ notification_sms: e.target.checked })} className="rounded border-gray-300 text-green-700 focus:ring-orange-500" />
            <span className="text-sm text-gray-700">SMS notifications</span>
          </label>
          <label className="flex items-center gap-3">
            <input type="checkbox" checked={settings.notification_push} onChange={(e) => updateSettings({ notification_push: e.target.checked })} className="rounded border-gray-300 text-green-700 focus:ring-orange-500" />
            <span className="text-sm text-gray-700">Push notifications</span>
          </label>
        </div>
      </div>

      {/* Data Management */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <h2 className="font-semibold text-gray-900 mb-4">Data Management</h2>
        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-2">Export Data</h3>
            <p className="text-xs text-gray-500 mb-2">Download all your data as a JSON file for backup.</p>
            <button onClick={handleExport} className="btn-primary text-sm">
              Export Data
            </button>
          </div>
          <div className="border-t border-gray-100 pt-4">
            <h3 className="text-sm font-medium text-gray-700 mb-2">Import Data</h3>
            <p className="text-xs text-gray-500 mb-2">Paste previously exported JSON data to restore.</p>
            <textarea value={importText} onChange={(e) => setImportText(e.target.value)} rows={4} className="input-field font-mono mb-2" placeholder="Paste JSON data here..." />
            <button onClick={handleImport} className="bg-blue-600 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-blue-700 transition-colors">
              Import Data
            </button>
          </div>
          <div className="border-t border-gray-100 pt-4">
            <h3 className="text-sm font-medium text-red-700 mb-2">Reset Data</h3>
            <p className="text-xs text-gray-500 mb-2">Delete all data and reload with sample data.</p>
            {!showResetConfirm ? (
              <button onClick={() => setShowResetConfirm(true)} className="bg-red-600 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-red-700 transition-colors">
                Reset All Data
              </button>
            ) : (
              <div className="flex items-center gap-3">
                <p className="text-sm text-red-600 font-medium">Are you sure? This cannot be undone.</p>
                <button onClick={handleReset} className="bg-red-600 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-red-700">Yes, Reset</button>
                <button onClick={() => setShowResetConfirm(false)} className="bg-gray-200 text-gray-700 px-4 py-2 rounded-xl text-sm font-medium hover:bg-gray-300">Cancel</button>
              </div>
            )}
          </div>
        </div>
      </div>

      <p className="text-xs text-gray-400 text-center">LawnCare Manager Pro v1.0 • JRT Lawn Care</p>
    </div>
  );
}