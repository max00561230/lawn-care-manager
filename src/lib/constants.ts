// LawnCare Manager Pro v1.0 — Constants & Config

export const APP_NAME = 'LawnCare Manager Pro';
export const APP_VERSION = '1.0.0';
export const APP_DESCRIPTION = 'Manage your lawn care business — scheduling, customers, payments, and more.';
export const APP_ICON = '🌿';

export const DEFAULT_SERVICES = [
  { name: 'Lawn Mowing', base_price: 35, estimated_time: '45 min', is_recurring: true },
  { name: 'Edging', base_price: 15, estimated_time: '20 min', is_recurring: true },
  { name: 'Weed Trimming', base_price: 20, estimated_time: '30 min', is_recurring: true },
  { name: 'Leaf Removal', base_price: 50, estimated_time: '1 hour', is_recurring: false },
  { name: 'Mulch Installation', base_price: 75, estimated_time: '2 hours', is_recurring: false },
  { name: 'Fertilizer Treatment', base_price: 45, estimated_time: '30 min', is_recurring: true },
  { name: 'Weed Control', base_price: 40, estimated_time: '45 min', is_recurring: true },
  { name: 'Hedge Trimming', base_price: 35, estimated_time: '45 min', is_recurring: true },
  { name: 'Yard Cleanup', base_price: 60, estimated_time: '1.5 hours', is_recurring: false },
  { name: 'Aeration', base_price: 80, estimated_time: '1 hour', is_recurring: false },
  { name: 'Seeding', base_price: 55, estimated_time: '45 min', is_recurring: false },
  { name: 'Pressure Washing', base_price: 100, estimated_time: '2 hours', is_recurring: false },
  { name: 'Seasonal Cleanup', base_price: 90, estimated_time: '2 hours', is_recurring: false },
  { name: 'Commercial Lawn Maintenance', base_price: 150, estimated_time: '3 hours', is_recurring: true },
];

export const SERVICE_FREQUENCIES = [
  { value: 'one_time', label: 'One Time' },
  { value: 'weekly', label: 'Weekly' },
  { value: 'bi_weekly', label: 'Every 2 Weeks' },
  { value: 'monthly', label: 'Monthly' },
  { value: 'seasonal', label: 'Seasonal' },
] as const;

export const APPOINTMENT_STATUSES = [
  { value: 'requested', label: 'Requested', color: '#FCD34D' },
  { value: 'approved', label: 'Approved', color: '#60A5FA' },
  { value: 'scheduled', label: 'Scheduled', color: '#34D399' },
  { value: 'on_the_way', label: 'On the Way', color: '#F97316' },
  { value: 'in_progress', label: 'In Progress', color: '#8B5CF6' },
  { value: 'completed', label: 'Completed', color: '#10B981' },
  { value: 'cancelled', label: 'Cancelled', color: '#EF4444' },
  { value: 'rescheduled', label: 'Rescheduled', color: '#F59E0B' },
  { value: 'payment_pending', label: 'Payment Pending', color: '#EC4899' },
  { value: 'paid', label: 'Paid', color: '#059669' },
] as const;

export const CUSTOMER_FILTERS = [
  { value: 'all', label: 'All Customers' },
  { value: 'new', label: 'New' },
  { value: 'active', label: 'Active' },
  { value: 'inactive', label: 'Inactive' },
  { value: 'weekly', label: 'Weekly Service' },
  { value: 'bi_weekly', label: 'Bi-Weekly' },
  { value: 'monthly', label: 'Monthly' },
  { value: 'one_time', label: 'One-Time' },
  { value: 'unpaid', label: 'Unpaid' },
  { value: 'commercial', label: 'Commercial' },
  { value: 'residential', label: 'Residential' },
] as const;

export const DAYS_OF_WEEK = [
  'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'
] as const;

export const NAV_ITEMS = [
  { href: '/dashboard', label: 'Dashboard', icon: 'LayoutDashboard' },
  { href: '/calendar', label: 'Calendar', icon: 'Calendar' },
  { href: '/customers', label: 'Customers', icon: 'Users' },
  { href: '/appointments', label: 'Appointments', icon: 'Clock' },
  { href: '/services', label: 'Services', icon: 'Scissors' },
  { href: '/estimates', label: 'Estimates', icon: 'FileText' },
  { href: '/tasks', label: 'Tasks', icon: 'CheckSquare' },
  { href: '/reminders', label: 'Reminders', icon: 'Bell' },
  { href: '/payments', label: 'Payments', icon: 'CreditCard' },
  { href: '/reports', label: 'Reports', icon: 'BarChart3' },
  { href: '/settings', label: 'Settings', icon: 'Settings' },
] as const;

export const CUSTOMER_NAV_ITEMS = [
  { href: '/book', label: 'Book Service' },
  { href: '/my-appointments', label: 'My Appointments' },
  { href: '/my-payments', label: 'Payments' },
  { href: '/my-history', label: 'Service History' },
  { href: '/request-estimate', label: 'Request Estimate' },
] as const;