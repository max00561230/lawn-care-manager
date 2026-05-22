// Email sending utility — connects EmailSettings with templates and API route
import { EmailSettings, STORAGE_KEY_EMAIL, DEFAULT_EMAIL_SETTINGS, EMAIL_PROVIDERS } from './email-config';
import type { EmailProvider } from './email-config';

// Read email settings from localStorage (client-side only)
export function getEmailSettings(): EmailSettings {
  if (typeof window === 'undefined') return DEFAULT_EMAIL_SETTINGS;
  const raw = localStorage.getItem(STORAGE_KEY_EMAIL);
  if (!raw) return DEFAULT_EMAIL_SETTINGS;
  try {
    return { ...DEFAULT_EMAIL_SETTINGS, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_EMAIL_SETTINGS;
  }
}

// Save email settings to localStorage (client-side only)
export function saveEmailSettings(settings: EmailSettings): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY_EMAIL, JSON.stringify(settings));
}

// Apply provider defaults when switching providers
export function applyProviderDefaults(provider: EmailProvider): Partial<EmailSettings> {
  const config = EMAIL_PROVIDERS[provider];
  return {
    provider,
    smtpHost: config.smtp.host,
    smtpPort: config.smtp.port,
    smtpEncryption: config.smtp.encryption,
  };
}

// Send an email using the stored email settings
export async function sendEmail(params: {
  to: string | string[];
  subject: string;
  html?: string;
  text?: string;
  settings: EmailSettings;
}): Promise<{ success: boolean; message: string }> {
  const { to, subject, html, text, settings } = params;

  if (!settings.connected && (!settings.smtpHost || !settings.smtpUsername)) {
    return { success: false, message: 'Email not configured. Please set up your email settings first.' };
  }

  try {
    const response = await fetch('/api/email/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        to: Array.isArray(to) ? to.join(', ') : to,
        subject,
        html,
        text,
        smtpConfig: {
          host: settings.smtpHost,
          port: settings.smtpPort,
          encryption: settings.smtpEncryption,
          username: settings.smtpUsername,
          password: settings.smtpPassword,
        },
        senderName: settings.senderName,
        senderEmail: settings.senderEmail || settings.smtpUsername,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      return { success: false, message: data.error || 'Failed to send email' };
    }

    return { success: true, message: data.message || 'Email sent successfully' };
  } catch (error: unknown) {
    const errMsg = error instanceof Error ? error.message : 'Network error';
    return { success: false, message: errMsg };
  }
}

// Verify SMTP connection (send a test email)
export async function verifyEmailConnection(settings: EmailSettings, testRecipient?: string): Promise<{ success: boolean; message: string }> {
  const recipient = testRecipient || settings.senderEmail || settings.smtpUsername;
  if (!recipient) {
    return { success: false, message: 'No email address to send test to. Enter your sender email first.' };
  }

  return sendEmail({
    to: recipient,
    subject: `✅ LawnCare Manager — Email Connected Successfully`,
    html: `
      <div style="font-family: sans-serif; max-width: 500px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #15803d, #166534); padding: 20px; border-radius: 12px 12px 0 0; text-align: center;">
          <h1 style="color: white; margin: 0;">🌿 Email Connected!</h1>
        </div>
        <div style="padding: 20px; background: white; border-radius: 0 0 12px 12px; border: 1px solid #e5e7eb;">
          <p style="color: #374151;">Your email is working! LawnCare Manager Pro can now send emails on your behalf.</p>
          <p style="color: #6b7280; font-size: 13px;">Connected via: <strong>${EMAIL_PROVIDERS[settings.provider]?.name || 'Custom'}</strong><br>
          Account: <strong>${settings.smtpUsername}</strong></p>
        </div>
      </div>
    `,
    text: 'Your email is working! LawnCare Manager Pro can now send emails on your behalf.',
    settings,
  });
}