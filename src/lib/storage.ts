"use client";

import { useCallback } from "react";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import {
  Customer,
  Service,
  Appointment,
  Estimate,
  Task,
  Reminder,
  Payment,
  Bill,
  CustomerFormData,
  AppointmentFormData,
  ServiceFormData,
  TaskFormData,
  EstimateFormData,
  BillFormData,
  ReminderType,
  PaymentType,
  PaymentStatus,
} from "@/types";

// --- ID helper ---
function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substring(2, 9);
}

// --- Storage Keys ---
const STORAGE_KEYS = {
  customers: "lcm_customers",
  services: "lcm_services",
  appointments: "lcm_appointments",
  estimates: "lcm_estimates",
  tasks: "lcm_tasks",
  reminders: "lcm_reminders",
  payments: "lcm_payments",
  bills: "lcm_bills",
  settings: "lcm_settings",
  seeded: "lcm_seeded_v2",
  auth: "lcm_auth",
  owner: "lcm_owner",
};

// --- Owner Account (PIN-based) ---
export interface OwnerAccount {
  businessName: string;
  ownerPin: string;
  pinEnabled: boolean;
  createdAt: string;
}

// --- Auth (PIN-based like FV) ---
export function useAuth() {
  const [isLoggedIn, setIsLoggedIn] = useLocalStorage<boolean>(STORAGE_KEYS.auth, false);
  const [owner, setOwner] = useLocalStorage<OwnerAccount | null>(STORAGE_KEYS.owner, null);

  const isSetupComplete = owner !== null;

  const setup = useCallback((businessName: string, pin: string) => {
    const account: OwnerAccount = {
      businessName,
      ownerPin: pin,
      pinEnabled: true,
      createdAt: new Date().toISOString().split("T")[0],
    };
    setOwner(account);
    setIsLoggedIn(true);
  }, [setOwner, setIsLoggedIn]);

  const login = useCallback((pin: string): boolean => {
    if (!owner) return false;
    if (pin !== owner.ownerPin) return false;
    setIsLoggedIn(true);
    return true;
  }, [owner, setIsLoggedIn]);

  const logout = useCallback(() => {
    setIsLoggedIn(false);
  }, [setIsLoggedIn]);

  const updatePin = useCallback((newPin: string) => {
    if (owner) {
      setOwner({ ...owner, ownerPin: newPin });
    }
  }, [owner, setOwner]);

  const togglePinEnabled = useCallback((enabled: boolean) => {
    if (owner) {
      setOwner({ ...owner, pinEnabled: enabled });
    }
  }, [owner, setOwner]);

  const updateBusinessName = useCallback((name: string) => {
    if (owner) {
      setOwner({ ...owner, businessName: name });
    }
  }, [owner, setOwner]);

  return { isLoggedIn, isSetupComplete, owner, setup, login, logout, updatePin, togglePinEnabled, updateBusinessName };
}

// --- Seed Data (Free Plan Demo — 3 customers, 3 services, 3 estimates) ---
const TODAY = new Date();
const fmt = (d: Date) => d.toISOString().split("T")[0];
const addDays = (d: Date, n: number) => { const r = new Date(d); r.setDate(r.getDate() + n); return r; };

function seedData() {
  const customers: Customer[] = [
    {
      id: "demo_cust_1", owner_id: "owner", name: "John Smith", address: "123 Oak Lane, Springfield",
      phone: "(555) 123-4567", email: "john@email.com", service_frequency: "weekly",
      service_type: ["Lawn Mowing", "Edging"], last_service_date: fmt(addDays(TODAY, -3)),
      next_service_date: fmt(addDays(TODAY, 4)), payment_status: "paid", property_size: "0.25 acre",
      gate_code: "1234", preferred_day: "Tuesday", customer_since: fmt(addDays(TODAY, -180)),
      customer_type: "residential", status: "active", is_demo: true,
      created_at: fmt(addDays(TODAY, -180)), updated_at: fmt(addDays(TODAY, -1)),
    },
    {
      id: "demo_cust_2", owner_id: "owner", name: "Greenfield Office Park", address: "456 Commerce Blvd, Springfield",
      phone: "(555) 987-6543", email: "manager@greenfield.com", service_frequency: "bi_weekly",
      service_type: ["Commercial Lawn Maintenance", "Hedge Trimming"], last_service_date: fmt(addDays(TODAY, -7)),
      next_service_date: fmt(addDays(TODAY, 7)), payment_status: "unpaid", property_size: "2 acres",
      preferred_day: "Thursday", customer_since: fmt(addDays(TODAY, -365)),
      customer_type: "commercial", status: "active", is_demo: true,
      created_at: fmt(addDays(TODAY, -365)), updated_at: fmt(addDays(TODAY, -3)),
    },
    {
      id: "demo_cust_3", owner_id: "owner", name: "Mary Johnson", address: "789 Maple Drive, Springfield",
      phone: "(555) 456-7890", email: "mary.j@email.com", service_frequency: "monthly",
      service_type: ["Lawn Mowing", "Fertilizer Treatment"], next_service_date: fmt(addDays(TODAY, 12)),
      payment_status: "paid", property_size: "0.5 acre", preferred_day: "Friday",
      customer_since: fmt(addDays(TODAY, -60)), customer_type: "residential", status: "active", is_demo: true,
      created_at: fmt(addDays(TODAY, -60)), updated_at: fmt(addDays(TODAY, -5)),
    },
  ];

  const services: Service[] = [
    { id: "demo_svc_1", owner_id: "owner", name: "Lawn Mowing", base_price: 35, description: "Lawn Mowing — professional quality service", estimated_time: "45 min", is_recurring: true, is_active: true, is_demo: true, created_at: fmt(addDays(TODAY, -365)), updated_at: fmt(addDays(TODAY, -1)) },
    { id: "demo_svc_2", owner_id: "owner", name: "Edging", base_price: 15, description: "Edging — professional quality service", estimated_time: "20 min", is_recurring: true, is_active: true, is_demo: true, created_at: fmt(addDays(TODAY, -365)), updated_at: fmt(addDays(TODAY, -1)) },
    { id: "demo_svc_3", owner_id: "owner", name: "Weed Trimming", base_price: 20, description: "Weed Trimming — professional quality service", estimated_time: "30 min", is_recurring: true, is_active: true, is_demo: true, created_at: fmt(addDays(TODAY, -365)), updated_at: fmt(addDays(TODAY, -1)) },
  ];

  const appointments: Appointment[] = [
    {
      id: "demo_apt_1", owner_id: "owner", customer_id: "demo_cust_1", service_id: "demo_svc_1",
      title: "Lawn Mowing — John Smith", date: fmt(TODAY), start_time: "09:00", end_time: "09:45",
      status: "scheduled", is_recurring: true, recurring_pattern: "weekly",
      created_at: fmt(addDays(TODAY, -5)), updated_at: fmt(addDays(TODAY, -1)),
    },
    {
      id: "demo_apt_2", owner_id: "owner", customer_id: "demo_cust_2", service_id: "demo_svc_1",
      title: "Lawn Mowing — Greenfield", date: fmt(TODAY), start_time: "10:30", end_time: "11:30",
      status: "approved", is_recurring: true, recurring_pattern: "bi_weekly",
      created_at: fmt(addDays(TODAY, -3)), updated_at: fmt(addDays(TODAY, -1)),
    },
    {
      id: "demo_apt_3", owner_id: "owner", customer_id: "demo_cust_3", service_id: "demo_svc_3",
      title: "Weed Trimming — Mary Johnson", date: fmt(addDays(TODAY, 1)), start_time: "14:00", end_time: "14:30",
      status: "scheduled", is_recurring: false,
      created_at: fmt(addDays(TODAY, -1)), updated_at: fmt(TODAY),
    },
  ];

  const estimates: Estimate[] = [
    {
      id: "demo_est_1", owner_id: "owner", customer_id: "demo_cust_1", service_id: "demo_svc_2",
      property_address: "123 Oak Lane, Springfield", estimated_price: 50, status: "sent",
      notes: "Edging and trimming — monthly service", is_demo: true, created_at: fmt(addDays(TODAY, -3)), updated_at: fmt(addDays(TODAY, -1)),
    },
    {
      id: "demo_est_2", owner_id: "owner", customer_id: "demo_cust_2", service_id: "demo_svc_1",
      property_address: "456 Commerce Blvd, Springfield", estimated_price: 150, status: "accepted",
      notes: "Bi-weekly commercial lawn maintenance", is_demo: true, created_at: fmt(addDays(TODAY, -7)), updated_at: fmt(addDays(TODAY, -2)),
    },
    {
      id: "demo_est_3", owner_id: "owner", customer_id: "demo_cust_3", service_id: "demo_svc_3",
      property_address: "789 Maple Drive, Springfield", estimated_price: 55, status: "draft",
      notes: "Weed trimming — one-time seasonal service", is_demo: true, created_at: fmt(addDays(TODAY, -1)), updated_at: fmt(TODAY),
    },
  ];

  const tasks: Task[] = [
    { id: "demo_task_1", owner_id: "owner", customer_id: "demo_cust_2", title: "Schedule walk-through for Greenfield", due_date: fmt(addDays(TODAY, 3)), priority: "medium", status: "in_progress", created_at: fmt(addDays(TODAY, -3)), updated_at: fmt(TODAY) },
    { id: "demo_task_2", owner_id: "owner", title: "Order replacement trimmer line", due_date: fmt(addDays(TODAY, 2)), priority: "medium", status: "not_started", created_at: fmt(addDays(TODAY, -1)), updated_at: fmt(TODAY) },
    { id: "demo_task_3", owner_id: "owner", customer_id: "demo_cust_3", title: "Call Mary Johnson about estimate", due_date: fmt(TODAY), priority: "high", status: "in_progress", created_at: fmt(addDays(TODAY, -1)), updated_at: fmt(TODAY) },
  ];

  const reminders: Reminder[] = [
    { id: "demo_rem_1", owner_id: "owner", customer_id: "demo_cust_1", appointment_id: "demo_apt_1", title: "Lawn mowing appointment today", reminder_type: "appointment", due_date: fmt(TODAY), is_read: false, created_at: fmt(addDays(TODAY, -1)) },
    { id: "demo_rem_2", owner_id: "owner", title: "Sharpen mower blades", reminder_type: "equipment", due_date: fmt(addDays(TODAY, 3)), is_read: false, created_at: fmt(addDays(TODAY, -2)) },
    { id: "demo_rem_3", owner_id: "owner", customer_id: "demo_cust_3", title: "Weekly recurring — Mary Johnson", reminder_type: "recurring", due_date: fmt(addDays(TODAY, 2)), is_read: false, created_at: fmt(addDays(TODAY, -5)) },
  ];

  const payments: Payment[] = [
    { id: "demo_pay_1", owner_id: "owner", customer_id: "demo_cust_1", appointment_id: "demo_apt_1", amount: 35, payment_type: "recurring", status: "paid", description: "Lawn Mowing — weekly", paid_at: fmt(addDays(TODAY, -7)), created_at: fmt(addDays(TODAY, -7)) },
    { id: "demo_pay_2", owner_id: "owner", customer_id: "demo_cust_2", appointment_id: "demo_apt_2", amount: 150, payment_type: "recurring", status: "unpaid", description: "Commercial Maintenance — bi-weekly", created_at: fmt(addDays(TODAY, -3)) },
    { id: "demo_pay_3", owner_id: "owner", customer_id: "demo_cust_3", amount: 55, payment_type: "full", status: "paid", description: "Weed Trimming", paid_at: fmt(addDays(TODAY, -10)), created_at: fmt(addDays(TODAY, -10)) },
  ];

  return { customers, services, appointments, estimates, tasks, reminders, payments };
}

// --- Seed Check ---
export function ensureSeeded(): void {
  if (typeof window === "undefined") return;
  if (!localStorage.getItem(STORAGE_KEYS.seeded)) {
    const data = seedData();
    localStorage.setItem(STORAGE_KEYS.customers, JSON.stringify(data.customers));
    localStorage.setItem(STORAGE_KEYS.services, JSON.stringify(data.services));
    localStorage.setItem(STORAGE_KEYS.appointments, JSON.stringify(data.appointments));
    localStorage.setItem(STORAGE_KEYS.estimates, JSON.stringify(data.estimates));
    localStorage.setItem(STORAGE_KEYS.tasks, JSON.stringify(data.tasks));
    localStorage.setItem(STORAGE_KEYS.reminders, JSON.stringify(data.reminders));
    localStorage.setItem(STORAGE_KEYS.payments, JSON.stringify(data.payments));
    localStorage.setItem(STORAGE_KEYS.seeded, "true");
  }
}

// --- Clear Demo Data ---
export function clearDemoData(): { customers: number; services: number; estimates: number; appointments: number; tasks: number; reminders: number; payments: number } {
  if (typeof window === "undefined") return { customers: 0, services: 0, estimates: 0, appointments: 0, tasks: 0, reminders: 0, payments: 0 };

  const clearList = <T extends { is_demo?: boolean }>(key: string): number => {
    const items: T[] = JSON.parse(localStorage.getItem(key) || "[]");
    const kept = items.filter(i => !i.is_demo);
    localStorage.setItem(key, JSON.stringify(kept));
    return items.length - kept.length;
  };

  const count = {
    customers: clearList<Customer>(STORAGE_KEYS.customers),
    services: clearList<Service>(STORAGE_KEYS.services),
    estimates: clearList<Estimate>(STORAGE_KEYS.estimates),
    appointments: clearList<Appointment>(STORAGE_KEYS.appointments),
    tasks: clearList<Task>(STORAGE_KEYS.tasks),
    reminders: clearList<Reminder>(STORAGE_KEYS.reminders),
    payments: clearList<Payment>(STORAGE_KEYS.payments),
  };

  return count;
}

// --- Generic helpers ---
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function getItems<T>(key: string, _idField: string = "id"): T[] {
  if (typeof window === "undefined") return [];
  const raw = localStorage.getItem(key);
  return raw ? JSON.parse(raw) : [];
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function setItems<T>(key: string, items: T[]): void {
  localStorage.setItem(key, JSON.stringify(items));
}

function enrichAppointment(apt: Appointment, customers: Customer[], services: Service[]): Appointment {
  return {
    ...apt,
    customer: customers.find((c) => c.id === apt.customer_id),
    service: services.find((s) => s.id === apt.service_id),
  };
}

// --- CUSTOMERS ---
export function useCustomers() {
  const [customers, setCustomers] = useLocalStorage<Customer[]>(STORAGE_KEYS.customers, []);

  const addCustomer = useCallback((data: CustomerFormData): Customer => {
    const newCustomer: Customer = {
      id: generateId(),
      owner_id: "owner",
      name: data.name,
      address: data.address,
      phone: data.phone,
      email: data.email,
      service_frequency: data.service_frequency,
      service_type: data.service_type,
      property_size: data.property_size,
      gate_code: data.gate_code,
      preferred_day: data.preferred_day,
      customer_type: data.customer_type || "residential",
      notes: data.notes,
      payment_status: "unpaid",
      customer_since: new Date().toISOString().split("T")[0],
      status: "new",
      created_at: new Date().toISOString().split("T")[0],
      updated_at: new Date().toISOString().split("T")[0],
    };
    setCustomers((prev) => [...prev, newCustomer]);
    return newCustomer;
  }, [setCustomers]);

  const updateCustomer = useCallback((id: string, data: Partial<CustomerFormData | Customer>): void => {
    setCustomers((prev) =>
      prev.map((c) => (c.id === id ? { ...c, ...data, updated_at: new Date().toISOString().split("T")[0] } : c))
    );
  }, [setCustomers]);

  const deleteCustomer = useCallback((id: string): void => {
    setCustomers((prev) => prev.filter((c) => c.id !== id));
  }, [setCustomers]);

  return { customers, addCustomer, updateCustomer, deleteCustomer };
}

// --- SERVICES ---
export function useServices() {
  const [services, setServices] = useLocalStorage<Service[]>(STORAGE_KEYS.services, []);

  const addService = useCallback((data: ServiceFormData): Service => {
    const newService: Service = {
      id: generateId(),
      owner_id: "owner",
      name: data.name,
      base_price: data.base_price,
      description: data.description,
      estimated_time: data.estimated_time,
      is_recurring: data.is_recurring ?? false,
      is_active: true,
      created_at: new Date().toISOString().split("T")[0],
      updated_at: new Date().toISOString().split("T")[0],
    };
    setServices((prev) => [...prev, newService]);
    return newService;
  }, [setServices]);

  const updateService = useCallback((id: string, data: Partial<Service>): void => {
    setServices((prev) =>
      prev.map((s) => (s.id === id ? { ...s, ...data, updated_at: new Date().toISOString().split("T")[0] } : s))
    );
  }, [setServices]);

  const deleteService = useCallback((id: string): void => {
    setServices((prev) => prev.filter((s) => s.id !== id));
  }, [setServices]);

  const toggleService = useCallback((id: string): void => {
    setServices((prev) =>
      prev.map((s) => (s.id === id ? { ...s, is_active: !s.is_active, updated_at: new Date().toISOString().split("T")[0] } : s))
    );
  }, [setServices]);

  return { services, addService, updateService, deleteService, toggleService };
}

// --- APPOINTMENTS ---
export function useAppointments() {
  const [appointments, setAppointments] = useLocalStorage<Appointment[]>(STORAGE_KEYS.appointments, []);
  const [customers] = useLocalStorage<Customer[]>(STORAGE_KEYS.customers, []);
  const [services] = useLocalStorage<Service[]>(STORAGE_KEYS.services, []);

  const enriched = appointments.map((a) => enrichAppointment(a, customers, services));

  const addAppointment = useCallback((data: AppointmentFormData): Appointment => {
    const newApt: Appointment = {
      id: generateId(),
      owner_id: "owner",
      customer_id: data.customer_id,
      service_id: data.service_id,
      title: data.title,
      date: data.date,
      start_time: data.start_time,
      end_time: data.end_time,
      status: "requested",
      notes: data.notes,
      is_recurring: data.is_recurring ?? false,
      recurring_pattern: data.recurring_pattern,
      created_at: new Date().toISOString().split("T")[0],
      updated_at: new Date().toISOString().split("T")[0],
    };
    setAppointments((prev) => [...prev, newApt]);
    return newApt;
  }, [setAppointments]);

  const updateAppointment = useCallback((id: string, data: Partial<Appointment>): void => {
    setAppointments((prev) =>
      prev.map((a) => (a.id === id ? { ...a, ...data, updated_at: new Date().toISOString().split("T")[0] } : a))
    );
  }, [setAppointments]);

  const deleteAppointment = useCallback((id: string): void => {
    setAppointments((prev) => prev.filter((a) => a.id !== id));
  }, [setAppointments]);

  return { appointments: enriched, rawAppointments: appointments, addAppointment, updateAppointment, deleteAppointment };
}

// --- ESTIMATES ---
export function useEstimates() {
  const [estimates, setEstimates] = useLocalStorage<Estimate[]>(STORAGE_KEYS.estimates, []);
  const [customers] = useLocalStorage<Customer[]>(STORAGE_KEYS.customers, []);
  const [services] = useLocalStorage<Service[]>(STORAGE_KEYS.services, []);

  const enriched = estimates.map((e) => ({
    ...e,
    customer: customers.find((c) => c.id === e.customer_id),
    service: services.find((s) => s.id === e.service_id),
  }));

  const addEstimate = useCallback((data: EstimateFormData): Estimate => {
    const newEst: Estimate = {
      id: generateId(),
      owner_id: "owner",
      customer_id: data.customer_id,
      service_id: data.service_id,
      property_address: data.property_address,
      estimated_price: data.estimated_price,
      notes: data.notes,
      status: "draft",
      created_at: new Date().toISOString().split("T")[0],
      updated_at: new Date().toISOString().split("T")[0],
    };
    setEstimates((prev) => [...prev, newEst]);
    return newEst;
  }, [setEstimates]);

  const updateEstimate = useCallback((id: string, data: Partial<Estimate>): void => {
    setEstimates((prev) =>
      prev.map((e) => (e.id === id ? { ...e, ...data, updated_at: new Date().toISOString().split("T")[0] } : e))
    );
  }, [setEstimates]);

  const deleteEstimate = useCallback((id: string): void => {
    setEstimates((prev) => prev.filter((e) => e.id !== id));
  }, [setEstimates]);

  return { estimates: enriched, addEstimate, updateEstimate, deleteEstimate };
}

// --- TASKS ---
export function useTasks() {
  const [tasks, setTasks] = useLocalStorage<Task[]>(STORAGE_KEYS.tasks, []);
  const [customers] = useLocalStorage<Customer[]>(STORAGE_KEYS.customers, []);

  const enriched = tasks.map((t) => ({
    ...t,
    customer: customers.find((c) => c.id === t.customer_id),
  }));

  const addTask = useCallback((data: TaskFormData): Task => {
    const newTask: Task = {
      id: generateId(),
      owner_id: "owner",
      customer_id: data.customer_id,
      title: data.title,
      due_date: data.due_date,
      priority: data.priority ?? "medium",
      status: "not_started",
      created_at: new Date().toISOString().split("T")[0],
      updated_at: new Date().toISOString().split("T")[0],
    };
    setTasks((prev) => [...prev, newTask]);
    return newTask;
  }, [setTasks]);

  const updateTask = useCallback((id: string, data: Partial<Task>): void => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, ...data, updated_at: new Date().toISOString().split("T")[0] } : t))
    );
  }, [setTasks]);

  const deleteTask = useCallback((id: string): void => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  }, [setTasks]);

  return { tasks: enriched, addTask, updateTask, deleteTask };
}

// --- REMINDERS ---
export function useReminders() {
  const [reminders, setReminders] = useLocalStorage<Reminder[]>(STORAGE_KEYS.reminders, []);
  const [customers] = useLocalStorage<Customer[]>(STORAGE_KEYS.customers, []);

  const enriched = reminders.map((r) => ({
    ...r,
    customer: customers.find((c) => c.id === r.customer_id),
  }));

  const addReminder = useCallback((data: { title: string; reminder_type: ReminderType; due_date?: string; customer_id?: string }): Reminder => {
    const newReminder: Reminder = {
      id: generateId(),
      owner_id: "owner",
      customer_id: data.customer_id,
      title: data.title,
      reminder_type: data.reminder_type,
      due_date: data.due_date,
      is_read: false,
      created_at: new Date().toISOString().split("T")[0],
    };
    setReminders((prev) => [...prev, newReminder]);
    return newReminder;
  }, [setReminders]);

  const markAsRead = useCallback((id: string): void => {
    setReminders((prev) => prev.map((r) => (r.id === id ? { ...r, is_read: true } : r)));
  }, [setReminders]);

  const deleteReminder = useCallback((id: string): void => {
    setReminders((prev) => prev.filter((r) => r.id !== id));
  }, [setReminders]);

  return { reminders: enriched, addReminder, markAsRead, deleteReminder };
}

// --- PAYMENTS ---
export function usePayments() {
  const [payments, setPayments] = useLocalStorage<Payment[]>(STORAGE_KEYS.payments, []);
  const [customers] = useLocalStorage<Customer[]>(STORAGE_KEYS.customers, []);

  const enriched = payments.map((p) => ({
    ...p,
    customer: customers.find((c) => c.id === p.customer_id),
  }));

  const addPayment = useCallback((data: { customer_id?: string; amount: number; payment_type: PaymentType; status: PaymentStatus; description?: string; paid_at?: string }): Payment => {
    const newPayment: Payment = {
      id: generateId(),
      owner_id: "owner",
      customer_id: data.customer_id,
      amount: data.amount,
      payment_type: data.payment_type,
      status: data.status,
      description: data.description,
      paid_at: data.paid_at,
      created_at: new Date().toISOString().split("T")[0],
    };
    setPayments((prev) => [...prev, newPayment]);
    return newPayment;
  }, [setPayments]);

  const updatePayment = useCallback((id: string, data: Partial<Payment>): void => {
    setPayments((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...data, updated_at: new Date().toISOString().split("T")[0] } : p))
    );
  }, [setPayments]);

  const deletePayment = useCallback((id: string): void => {
    setPayments((prev) => prev.filter((p) => p.id !== id));
  }, [setPayments]);

  return { payments: enriched, addPayment, updatePayment, deletePayment };
}

// --- BILLS ---
function generateBillNumber(): string {
  const now = new Date();
  const prefix = "INV";
  const date = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, "0")}`;
  const rand = Math.floor(Math.random() * 10000).toString().padStart(4, "0");
  return `${prefix}-${date}-${rand}`;
}

export function useBills() {
  const [bills, setBills] = useLocalStorage<Bill[]>(STORAGE_KEYS.bills, []);
  const [customers] = useLocalStorage<Customer[]>(STORAGE_KEYS.customers, []);

  const enriched = bills.map((b) => ({
    ...b,
    customer: customers.find((c) => c.id === b.customer_id),
  }));

  const addBill = useCallback((data: BillFormData): Bill => {
    const subtotal = data.items.reduce((sum, item) => sum + item.total, 0);
    const taxRate = data.tax_rate ?? 0;
    const taxAmount = Math.round(subtotal * taxRate * 100) / 100;
    const total = subtotal + taxAmount;
    const newBill: Bill = {
      id: generateId(),
      owner_id: "owner",
      bill_number: generateBillNumber(),
      customer_id: data.customer_id,
      items: data.items,
      subtotal,
      tax_rate: taxRate,
      tax_amount: taxAmount,
      total,
      notes: data.notes,
      status: data.status ?? "draft",
      due_date: data.due_date,
      created_at: new Date().toISOString().split("T")[0],
      updated_at: new Date().toISOString().split("T")[0],
    };
    setBills((prev) => [...prev, newBill]);
    return newBill;
  }, [setBills]);

  const updateBill = useCallback((id: string, data: Partial<Bill>): void => {
    setBills((prev) =>
      prev.map((b) => {
        if (b.id !== id) return b;
        const updated = { ...b, ...data, updated_at: new Date().toISOString().split("T")[0] };
        // Recalculate totals if items changed
        if (data.items) {
          updated.subtotal = data.items.reduce((sum, item) => sum + item.total, 0);
          updated.tax_amount = Math.round(updated.subtotal * updated.tax_rate * 100) / 100;
          updated.total = updated.subtotal + updated.tax_amount;
        }
        return updated;
      })
    );
  }, [setBills]);

  const deleteBill = useCallback((id: string): void => {
    setBills((prev) => prev.filter((b) => b.id !== id));
  }, [setBills]);

  return { bills: enriched, addBill, updateBill, deleteBill };
}

// --- SETTINGS ---
export interface AppSettings {
  company_name: string;
  phone: string;
  email: string;
  address: string;
  working_hours_start: string;
  working_hours_end: string;
  service_area: string;
  notification_email: boolean;
  notification_sms: boolean;
  notification_push: boolean;
}

const DEFAULT_SETTINGS: AppSettings = {
  company_name: "JRT Lawn Care",
  phone: "(555) 000-0000",
  email: "info@jrtlawn.com",
  address: "Springfield, IL",
  working_hours_start: "08:00",
  working_hours_end: "18:00",
  service_area: "Springfield and surrounding 20 miles",
  notification_email: true,
  notification_sms: false,
  notification_push: true,
};

export function useSettings() {
  const [settings, setSettings] = useLocalStorage<AppSettings>(STORAGE_KEYS.settings, DEFAULT_SETTINGS);
  const updateSettings = useCallback((data: Partial<AppSettings>) => {
    setSettings((prev) => ({ ...prev, ...data }));
  }, [setSettings]);
  return { settings, updateSettings };
}

// --- Export / Import ---
export function exportAllData(): string {
  const data: Record<string, unknown> = {};
  Object.entries(STORAGE_KEYS).forEach(([key, storageKey]) => {
    if (storageKey.startsWith("lcm_")) {
      const raw = localStorage.getItem(storageKey);
      if (raw) data[key] = JSON.parse(raw);
    }
  });
  return JSON.stringify(data, null, 2);
}

export function importAllData(json: string): boolean {
  try {
    const data = JSON.parse(json);
    Object.entries(data).forEach(([key, value]) => {
      const storageKey = (STORAGE_KEYS as Record<string, string>)[key];
      if (storageKey) {
        localStorage.setItem(storageKey, JSON.stringify(value));
      }
    });
    window.location.reload();
    return true;
  } catch {
    return false;
  }
}

export function resetAllData(): void {
  Object.values(STORAGE_KEYS).forEach((key) => localStorage.removeItem(key));
  ensureSeeded();
  window.location.reload();
}