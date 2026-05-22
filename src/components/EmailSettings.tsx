"use client";

import { useState, useEffect } from "react";
import {
  EmailSettings,
  EmailProvider,
  DEFAULT_EMAIL_SETTINGS,
  EMAIL_PROVIDERS,
  STORAGE_KEY_EMAIL,
} from "@/lib/email-config";
import { applyProviderDefaults, verifyEmailConnection, saveEmailSettings } from "@/lib/email";
import { useSettings } from "@/lib/storage";

type Step = "select" | "configure" | "verify" | "done";

export default function EmailSettingsSection() {
  const { settings: appSettings } = useSettings();
  const [emailSettings, setEmailSettings] = useState<EmailSettings>(DEFAULT_EMAIL_SETTINGS);
  const [step, setStep] = useState<Step>("select");
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showAppPasswordGuide, setShowAppPasswordGuide] = useState(false);

  // Load settings from localStorage on mount
  useEffect(() => {
    const raw = localStorage.getItem(STORAGE_KEY_EMAIL);
    if (raw) {
      try {
        const saved = JSON.parse(raw);
        setEmailSettings({ ...DEFAULT_EMAIL_SETTINGS, ...saved });
        if (saved.connected) {
          setStep("done");
        } else if (saved.provider && saved.smtpHost) {
          setStep("configure");
        }
      } catch { /* use defaults */ }
    }
  }, []);

  const updateSettings = (updates: Partial<EmailSettings>) => {
    setEmailSettings((prev) => {
      const next = { ...prev, ...updates };
      saveEmailSettings(next);
      return next;
    });
  };

  const handleProviderSelect = (provider: EmailProvider) => {
    const defaults = applyProviderDefaults(provider);
    const newSettings = {
      ...emailSettings,
      ...defaults,
      provider,
      connected: false,
      lastVerifiedAt: null,
    };
    // Auto-fill sender email if provider is not custom
    if (provider !== 'custom' && !newSettings.senderEmail) {
      newSettings.smtpUsername = newSettings.smtpUsername || '';
    }
    setEmailSettings(newSettings);
    saveEmailSettings(newSettings);
    setStep("configure");
    setTestResult(null);
  };

  const handleTestConnection = async () => {
    setTesting(true);
    setTestResult(null);
    const result = await verifyEmailConnection(emailSettings);
    setTestResult(result);
    setTesting(false);
    if (result.success) {
      const updated = { ...emailSettings, connected: true, lastVerifiedAt: new Date().toISOString() };
      setEmailSettings(updated);
      saveEmailSettings(updated);
      setStep("done");
    }
  };

  const handleDisconnect = () => {
    const reset = { ...DEFAULT_EMAIL_SETTINGS, provider: emailSettings.provider };
    setEmailSettings(reset);
    saveEmailSettings(reset);
    setStep("select");
    setTestResult(null);
  };

  const providerInfo = EMAIL_PROVIDERS[emailSettings.provider];

  // Status badge
  const StatusBadge = () => {
    if (emailSettings.connected) {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium bg-green-50 text-green-700 border border-green-200">
          <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          Connected
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium bg-gray-50 text-gray-500 border border-gray-200">
        <span className="w-2 h-2 bg-gray-400 rounded-full" />
        Not Connected
      </span>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center text-xl">📧</div>
            <div>
              <h2 className="font-semibold text-gray-900">Email Settings</h2>
              <p className="text-sm text-gray-500">Send estimates, confirmations & reminders from your business email</p>
            </div>
          </div>
          <StatusBadge />
        </div>

        {/* Connected account info */}
        {emailSettings.connected && (
          <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-lg">{providerInfo.icon}</span>
                <div>
                  <p className="text-sm font-medium text-green-800">{emailSettings.senderEmail || emailSettings.smtpUsername}</p>
                  <p className="text-xs text-green-600">{providerInfo.name} • Verified {emailSettings.lastVerifiedAt ? new Date(emailSettings.lastVerifiedAt).toLocaleDateString() : ''}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={async () => {
                    setTesting(true);
                    setTestResult(null);
                    const result = await verifyEmailConnection(emailSettings);
                    setTestResult(result);
                    setTesting(false);
                    if (result.success) {
                      const updated = { ...emailSettings, lastVerifiedAt: new Date().toISOString() };
                      setEmailSettings(updated);
                      saveEmailSettings(updated);
                    }
                  }}
                  disabled={testing}
                  className="text-xs text-green-700 hover:text-green-800 font-medium disabled:opacity-50"
                >
                  {testing ? "Testing..." : "Re-test"}
                </button>
                <button
                  onClick={handleDisconnect}
                  className="text-xs text-red-600 hover:text-red-700 font-medium"
                >
                  Disconnect
                </button>
              </div>
            </div>
            {testResult && !testResult.success && (
              <p className="mt-2 text-xs text-red-600">{testResult.message}</p>
            )}
          </div>
        )}
      </div>

      {/* Step: Select Provider */}
      {(step === "select" || !emailSettings.connected) && step !== "configure" && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h3 className="font-semibold text-gray-900 mb-1">Choose Your Email Provider</h3>
          <p className="text-sm text-gray-500 mb-4">Select the service that hosts your business email. We&apos;ll pre-configure the server settings.</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {Object.values(EMAIL_PROVIDERS).map((provider) => (
              <button
                key={provider.id}
                onClick={() => handleProviderSelect(provider.id)}
                className={`flex items-center gap-3 p-4 rounded-xl border-2 transition-all text-left hover:border-green-400 hover:bg-green-50/50 ${
                  emailSettings.provider === provider.id ? 'border-green-500 bg-green-50' : 'border-gray-200 bg-white'
                }`}
              >
                <span className="text-2xl">{provider.icon}</span>
                <div>
                  <p className="font-medium text-gray-900">{provider.name}</p>
                  <p className="text-xs text-gray-500">{provider.smtp.host}:{provider.smtp.port}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Step: Configure SMTP */}
      {(step === "configure" || (emailSettings.smtpHost && !emailSettings.connected)) && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900">
              Configure {providerInfo.icon} {providerInfo.name}
            </h3>
            <button
              onClick={() => { setStep("select"); setTestResult(null); }}
              className="text-sm text-gray-500 hover:text-gray-700"
            >
              ← Change Provider
            </button>
          </div>

          {/* App Password Guide */}
          {providerInfo.requiresAppPassword && (
            <div className="mb-4">
              <button
                onClick={() => setShowAppPasswordGuide(!showAppPasswordGuide)}
                className="flex items-center gap-2 text-sm font-medium text-amber-700 hover:text-amber-800"
              >
                <span>🔑</span>
                <span>This provider requires an App Password — click for instructions</span>
                <span className="text-xs">{showAppPasswordGuide ? "▲" : "▼"}</span>
              </button>
              {showAppPasswordGuide && providerInfo.appPasswordGuide && (
                <div className="mt-2 p-3 bg-amber-50 border border-amber-200 rounded-xl">
                  <pre className="text-xs text-amber-800 whitespace-pre-wrap">{providerInfo.appPasswordGuide}</pre>
                </div>
              )}
            </div>
          )}

          <div className="space-y-4">
            {/* Sender Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Sender Name</label>
              <input
                type="text"
                value={emailSettings.senderName}
                onChange={(e) => updateSettings({ senderName: e.target.value })}
                className="input-field"
                placeholder={appSettings.company_name || "Your Business Name"}
              />
              <p className="text-xs text-gray-400 mt-1">Appears as the &quot;From&quot; name in emails</p>
            </div>

            {/* Email / Username */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
              <input
                type="email"
                value={emailSettings.smtpUsername}
                onChange={(e) => updateSettings({ smtpUsername: e.target.value, senderEmail: e.target.value })}
                className="input-field"
                placeholder="you@example.com"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {providerInfo.requiresAppPassword ? 'App Password' : 'Password'}
              </label>
              <div className="flex gap-2">
                <input
                  type={showPassword ? "text" : "password"}
                  value={emailSettings.smtpPassword}
                  onChange={(e) => updateSettings({ smtpPassword: e.target.value })}
                  className="input-field flex-1"
                  placeholder={providerInfo.requiresAppPassword ? "16-character app password" : "Your email password"}
                />
                <button
                  onClick={() => setShowPassword(!showPassword)}
                  className="px-3 py-2 text-sm text-gray-500 hover:text-gray-700 border border-gray-200 rounded-xl"
                >
                  {showPassword ? "🙈" : "👁️"}
                </button>
              </div>
              <p className="text-xs text-gray-400 mt-1">
                {providerInfo.requiresAppPassword
                  ? "Stored locally on your device only — never sent to our servers"
                  : "Encrypted and stored locally on your device"}
              </p>
            </div>

            {/* SMTP Settings (collapsible for custom, shown for reference) */}
            {emailSettings.provider === 'custom' && (
              <>
                <div className="border-t border-gray-100 pt-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-3">SMTP Server Settings</h4>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">SMTP Host</label>
                    <input
                      type="text"
                      value={emailSettings.smtpHost}
                      onChange={(e) => updateSettings({ smtpHost: e.target.value })}
                      className="input-field"
                      placeholder="smtp.example.com"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Port</label>
                    <input
                      type="number"
                      value={emailSettings.smtpPort}
                      onChange={(e) => updateSettings({ smtpPort: parseInt(e.target.value) || 587 })}
                      className="input-field"
                      placeholder="587"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Encryption</label>
                    <select
                      value={emailSettings.smtpEncryption}
                      onChange={(e) => updateSettings({ smtpEncryption: e.target.value as 'ssl' | 'tls' | 'starttls' })}
                      className="input-field"
                    >
                      <option value="starttls">STARTTLS</option>
                      <option value="ssl">SSL/TLS</option>
                      <option value="tls">TLS</option>
                    </select>
                  </div>
                </div>
              </>
            )}

            {/* Test Connection */}
            <div className="border-t border-gray-100 pt-4">
              <div className="flex items-center gap-3">
                <button
                  onClick={handleTestConnection}
                  disabled={testing || !emailSettings.smtpUsername || !emailSettings.smtpPassword}
                  className="btn-primary text-sm"
                >
                  {testing ? (
                    <span className="flex items-center gap-2">
                      <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Testing Connection...
                    </span>
                  ) : (
                    "🔒 Test & Connect"
                  )}
                </button>
                <p className="text-xs text-gray-500">We&apos;ll send a test email to verify your connection</p>
              </div>

              {testResult && (
                <div className={`mt-3 p-3 rounded-xl text-sm ${
                  testResult.success
                    ? 'bg-green-50 text-green-700 border border-green-200'
                    : 'bg-red-50 text-red-700 border border-red-200'
                }`}>
                  {testResult.success ? "✅ " : "❌ "}{testResult.message}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Step: Connected — Auto-send preferences */}
      {emailSettings.connected && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h3 className="font-semibold text-gray-900 mb-1">Email Preferences</h3>
          <p className="text-sm text-gray-500 mb-4">Choose which emails to send automatically</p>
          <div className="space-y-3">
            <label className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 transition-colors">
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={emailSettings.autoSend.bookingConfirmation}
                  onChange={(e) => updateSettings({ autoSend: { ...emailSettings.autoSend, bookingConfirmation: e.target.checked } })}
                  className="rounded border-gray-300 text-green-700 focus:ring-green-500"
                />
                <div>
                  <p className="text-sm font-medium text-gray-900">Booking Confirmations</p>
                  <p className="text-xs text-gray-500">Sent when a customer books an appointment</p>
                </div>
              </div>
              <span className="text-lg">✅</span>
            </label>

            <label className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 transition-colors">
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={emailSettings.autoSend.appointmentApproved}
                  onChange={(e) => updateSettings({ autoSend: { ...emailSettings.autoSend, appointmentApproved: e.target.checked } })}
                  className="rounded border-gray-300 text-green-700 focus:ring-green-500"
                />
                <div>
                  <p className="text-sm font-medium text-gray-900">Appointment Approved</p>
                  <p className="text-xs text-gray-500">Sent when you approve an appointment request</p>
                </div>
              </div>
              <span className="text-lg">🎉</span>
            </label>

            <label className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 transition-colors">
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={emailSettings.autoSend.appointmentReminder}
                  onChange={(e) => updateSettings({ autoSend: { ...emailSettings.autoSend, appointmentReminder: e.target.checked } })}
                  className="rounded border-gray-300 text-green-700 focus:ring-green-500"
                />
                <div>
                  <p className="text-sm font-medium text-gray-900">Appointment Reminders</p>
                  <p className="text-xs text-gray-500">Sent 24 hours before an appointment</p>
                </div>
              </div>
              <span className="text-lg">⏰</span>
            </label>

            <label className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 transition-colors">
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={emailSettings.autoSend.estimateSent}
                  onChange={(e) => updateSettings({ autoSend: { ...emailSettings.autoSend, estimateSent: e.target.checked } })}
                  className="rounded border-gray-300 text-green-700 focus:ring-green-500"
                />
                <div>
                  <p className="text-sm font-medium text-gray-900">Estimates Sent</p>
                  <p className="text-xs text-gray-500">Sent when you send an estimate to a customer</p>
                </div>
              </div>
              <span className="text-lg">📋</span>
            </label>

            <label className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 transition-colors">
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={emailSettings.autoSend.paymentReceipt}
                  onChange={(e) => updateSettings({ autoSend: { ...emailSettings.autoSend, paymentReceipt: e.target.checked } })}
                  className="rounded border-gray-300 text-green-700 focus:ring-green-500"
                />
                <div>
                  <p className="text-sm font-medium text-gray-900">Payment Receipts</p>
                  <p className="text-xs text-gray-500">Sent when a payment is marked as paid</p>
                </div>
              </div>
              <span className="text-lg">🧾</span>
            </label>

            <label className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 transition-colors">
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={emailSettings.autoSend.statusUpdate}
                  onChange={(e) => updateSettings({ autoSend: { ...emailSettings.autoSend, statusUpdate: e.target.checked } })}
                  className="rounded border-gray-300 text-green-700 focus:ring-green-500"
                />
                <div>
                  <p className="text-sm font-medium text-gray-900">Status Updates</p>
                  <p className="text-xs text-gray-500">Sent when an appointment status changes</p>
                </div>
              </div>
              <span className="text-lg">📋</span>
            </label>
          </div>

          {/* Send Test Email button */}
          <div className="border-t border-gray-100 mt-4 pt-4">
            <button
              onClick={async () => {
                setTesting(true);
                setTestResult(null);
                const result = await verifyEmailConnection(emailSettings);
                setTestResult(result);
                setTesting(false);
              }}
              disabled={testing}
              className="text-sm text-green-700 hover:text-green-800 font-medium disabled:opacity-50"
            >
              {testing ? "Sending..." : "📧 Send Test Email"}
            </button>
            {testResult && testResult.success && step === "done" && (
              <p className="mt-1 text-xs text-green-600">✅ Test email sent!</p>
            )}
          </div>
        </div>
      )}

      {/* Security Notice */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
        <div className="flex gap-3">
          <span className="text-lg">🔒</span>
          <div>
            <p className="text-sm font-medium text-blue-800">Your email credentials are secure</p>
            <p className="text-xs text-blue-600 mt-1">
              Passwords are stored locally on your device only. They are never sent to our servers. 
              Emails are sent directly through your SMTP provider.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}