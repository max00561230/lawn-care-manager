// LawnCare Manager Pro v1.0 — Database Types

export type ServiceFrequency = 'one_time' | 'weekly' | 'bi_weekly' | 'monthly' | 'seasonal';
export type CustomerStatus = 'active' | 'inactive' | 'new';
export type CustomerType = 'residential' | 'commercial';
export type PaymentStatus = 'paid' | 'unpaid' | 'past_due' | 'refunded';
export type AppointmentStatus = 'requested' | 'approved' | 'scheduled' | 'on_the_way' | 'in_progress' | 'completed' | 'cancelled' | 'rescheduled' | 'payment_pending' | 'paid';
export type TaskPriority = 'low' | 'medium' | 'high';
export type TaskStatus = 'not_started' | 'in_progress' | 'complete';
export type EstimateStatus = 'draft' | 'sent' | 'accepted' | 'declined';
export type ReminderType = 'appointment' | 'payment' | 'follow_up' | 'equipment' | 'recurring' | 'seasonal';
export type PaymentType = 'full' | 'deposit' | 'recurring';
export type BillStatus = 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled';

export interface Customer {
  id: string;
  owner_id: string;
  name: string;
  address?: string;
  phone?: string;
  email?: string;
  service_frequency?: ServiceFrequency;
  service_type?: string[];
  last_service_date?: string;
  next_service_date?: string;
  payment_status: PaymentStatus;
  notes?: string;
  photos?: string[];
  property_size?: string;
  gate_code?: string;
  preferred_day?: string;
  customer_since: string;
  customer_type: CustomerType;
  status: CustomerStatus;
  created_at: string;
  updated_at: string;
}

export interface Service {
  id: string;
  owner_id: string;
  name: string;
  base_price: number;
  description?: string;
  estimated_time?: string;
  is_recurring: boolean;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Appointment {
  id: string;
  owner_id: string;
  customer_id?: string;
  service_id?: string;
  title: string;
  date: string;
  start_time?: string;
  end_time?: string;
  status: AppointmentStatus;
  notes?: string;
  is_recurring: boolean;
  recurring_pattern?: string;
  created_at: string;
  updated_at: string;
  // Joined
  customer?: Customer;
  service?: Service;
}

export interface Estimate {
  id: string;
  owner_id: string;
  customer_id?: string;
  service_id?: string;
  property_address?: string;
  estimated_price?: number;
  notes?: string;
  photos?: string[];
  status: EstimateStatus;
  created_at: string;
  updated_at: string;
  customer?: Customer;
  service?: Service;
}

export interface Task {
  id: string;
  owner_id: string;
  customer_id?: string;
  title: string;
  due_date?: string;
  priority: TaskPriority;
  status: TaskStatus;
  created_at: string;
  updated_at: string;
  customer?: Customer;
}

export interface Reminder {
  id: string;
  owner_id: string;
  customer_id?: string;
  appointment_id?: string;
  title: string;
  reminder_type: ReminderType;
  due_date?: string;
  is_read: boolean;
  created_at: string;
  customer?: Customer;
}

export interface Payment {
  id: string;
  owner_id: string;
  customer_id?: string;
  appointment_id?: string;
  stripe_session_id?: string;
  amount: number;
  payment_type: PaymentType;
  status: PaymentStatus;
  description?: string;
  paid_at?: string;
  created_at: string;
  customer?: Customer;
}

export interface BillItem {
  id: string;
  description: string;
  quantity: number;
  unit_price: number;
  total: number;
}

export interface Bill {
  id: string;
  owner_id: string;
  bill_number: string;
  customer_id?: string;
  items: BillItem[];
  subtotal: number;
  tax_rate: number;
  tax_amount: number;
  total: number;
  notes?: string;
  status: BillStatus;
  due_date?: string;
  paid_at?: string;
  created_at: string;
  updated_at: string;
  customer?: Customer;
}

export interface Message {
  id: string;
  owner_id: string;
  customer_id?: string;
  content: string;
  direction: 'inbound' | 'outbound';
  is_read: boolean;
  created_at: string;
  customer?: Customer;
}

// Form types
export interface CustomerFormData {
  name: string;
  address?: string;
  phone?: string;
  email?: string;
  service_frequency?: ServiceFrequency;
  service_type?: string[];
  property_size?: string;
  gate_code?: string;
  preferred_day?: string;
  customer_type?: CustomerType;
  notes?: string;
}

export interface AppointmentFormData {
  customer_id?: string;
  service_id?: string;
  title: string;
  date: string;
  start_time?: string;
  end_time?: string;
  notes?: string;
  is_recurring?: boolean;
  recurring_pattern?: string;
}

export interface ServiceFormData {
  name: string;
  base_price: number;
  description?: string;
  estimated_time?: string;
  is_recurring?: boolean;
}

export interface TaskFormData {
  customer_id?: string;
  title: string;
  due_date?: string;
  priority?: TaskPriority;
}

export interface EstimateFormData {
  customer_id?: string;
  service_id?: string;
  property_address?: string;
  estimated_price?: number;
  notes?: string;
}

export interface BillFormData {
  customer_id?: string;
  items: BillItem[];
  tax_rate?: number;
  notes?: string;
  due_date?: string;
  status?: BillStatus;
}