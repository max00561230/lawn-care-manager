// Email provider SMTP configurations
// Each provider has pre-configured settings so customers don't need to know SMTP details

export type EmailProvider = 'gmail' | 'outlook' | 'zoho' | 'yahoo' | 'custom';

export interface SmtpConfig {
  host: string;
  port: number;
  encryption: 'ssl' | 'tls' | 'starttls';
}

export interface EmailProviderInfo {
  id: EmailProvider;
  name: string;
  icon: string;
  smtp: SmtpConfig;
  imap: SmtpConfig;
  requiresAppPassword: boolean;
  appPasswordGuide?: string;
  website?: string;
}

export const EMAIL_PROVIDERS: Record<EmailProvider, EmailProviderInfo> = {
  gmail: {
    id: 'gmail',
    name: 'Gmail',
    icon: '🔵',
    smtp: { host: 'smtp.gmail.com', port: 587, encryption: 'starttls' },
    imap: { host: 'imap.gmail.com', port: 993, encryption: 'ssl' },
    requiresAppPassword: true,
    appPasswordGuide: [
      '1. Go to myaccount.google.com/security',
      '2. Turn on 2-Step Verification (if not already on)',
      '3. Go to App Passwords (myaccount.google.com/apppasswords)',
      '4. Select "Mail" → "Other" → type "LawnCare Manager"',
      '5. Copy the 16-letter password',
      '6. Paste it in the password field below',
    ].join('\n'),
  },
  outlook: {
    id: 'outlook',
    name: 'Outlook / Microsoft 365',
    icon: '🟠',
    smtp: { host: 'smtp.office365.com', port: 587, encryption: 'starttls' },
    imap: { host: 'outlook.office365.com', port: 993, encryption: 'ssl' },
    requiresAppPassword: false,
  },
  zoho: {
    id: 'zoho',
    name: 'Zoho Mail',
    icon: '🟣',
    smtp: { host: 'smtp.zoho.com', port: 465, encryption: 'ssl' },
    imap: { host: 'imappro.zoho.com', port: 993, encryption: 'ssl' },
    requiresAppPassword: false,
    website: 'https://mail.zoho.com',
  },
  yahoo: {
    id: 'yahoo',
    name: 'Yahoo Mail',
    icon: '🟡',
    smtp: { host: 'smtp.mail.yahoo.com', port: 465, encryption: 'ssl' },
    imap: { host: 'imap.mail.yahoo.com', port: 993, encryption: 'ssl' },
    requiresAppPassword: true,
    appPasswordGuide: [
      '1. Go to login.yahoo.com/account/security',
      '2. Turn on 2-Step Verification if not already on',
      '3. Go to App Passwords',
      '4. Select "Other App" → type "LawnCare Manager"',
      '5. Copy the generated password',
      '6. Paste it in the password field below',
    ].join('\n'),
  },
  custom: {
    id: 'custom',
    name: 'Custom / Other',
    icon: '🏢',
    smtp: { host: '', port: 587, encryption: 'starttls' },
    imap: { host: '', port: 993, encryption: 'ssl' },
    requiresAppPassword: false,
  },
};

export type EmailTemplateType = 
  | 'booking_confirmation'
  | 'appointment_approved'
  | 'appointment_reminder'
  | 'estimate_sent'
  | 'payment_receipt'
  | 'appointment_status_update';

export interface EmailSettings {
  // Connection status
  connected: boolean;
  // Provider selection
  provider: EmailProvider;
  // SMTP credentials
  smtpHost: string;
  smtpPort: number;
  smtpEncryption: 'ssl' | 'tls' | 'starttls';
  smtpUsername: string;
  smtpPassword: string; // stored locally, never sent to server
  // Sender info
  senderName: string;
  senderEmail: string;
  // Which emails to auto-send
  autoSend: {
    bookingConfirmation: boolean;
    appointmentApproved: boolean;
    appointmentReminder: boolean;
    estimateSent: boolean;
    paymentReceipt: boolean;
    statusUpdate: boolean;
  };
  // Last verified
  lastVerifiedAt: string | null;
}

export const DEFAULT_EMAIL_SETTINGS: EmailSettings = {
  connected: false,
  provider: 'gmail',
  smtpHost: 'smtp.gmail.com',
  smtpPort: 587,
  smtpEncryption: 'starttls',
  smtpUsername: '',
  smtpPassword: '',
  senderName: '',
  senderEmail: '',
  autoSend: {
    bookingConfirmation: true,
    appointmentApproved: true,
    appointmentReminder: true,
    estimateSent: true,
    paymentReceipt: true,
    statusUpdate: true,
  },
  lastVerifiedAt: null,
};

export const STORAGE_KEY_EMAIL = 'lcm_email_settings';