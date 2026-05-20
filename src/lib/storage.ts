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
  CustomerFormData,
  AppointmentFormData,
  ServiceFormData,
  TaskFormData,
  EstimateFormData,
  ReminderType,
  PaymentType,
  PaymentStatus,
} from "@/types";
import { DEFAULT_SERVICES } from "@/lib/constants";

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
  settings: "lcm_settings",
  seeded: "lcm_seeded_v1",
  auth: "lcm_auth",
  owner: "lcm_owner",
};

// --- Owner Account ---
export interface OwnerAccount {
  email: string;
  passwordHash: string;
  businessName: string;
  createdAt: string;
}

function simpleHash(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return hash.toString(36);
}

// --- Auth ---
export function useAuth() {
  const [isLoggedIn, setIsLoggedIn] = useLocalStorage<boolean>(STORAGE_KEYS.auth, false);
  const [owner, setOwner] = useLocalStorage<OwnerAccount | null>(STORAGE_KEYS.owner, null);

  const isSetupComplete = owner !== null;

  const signup = useCallback((email: string, password: string, businessName: string) => {
    const account: OwnerAccount = {
      email,
      passwordHash: simpleHash(password),
      businessName,
      createdAt: new Date().toISOString().split("T")[0],
    };
    setOwner(account);
    setIsLoggedIn(true);
  }, [setOwner, setIsLoggedIn]);

  const login = useCallback((email: string, password: string): boolean => {
    if (!owner) return false;
    if (owner.email !== email || owner.passwordHash !== simpleHash(password)) return false;
    setIsLoggedIn(true);
    return true;
  }, [owner, setIsLoggedIn]);

  const logout = useCallback(() => {
    setIsLoggedIn(false);
  }, [setIsLoggedIn]);

  return { isLoggedIn, isSetupComplete, owner, signup, login, logout };
}

// --- Seed Data ---
const TODAY = new Date();
const fmt = (d: Date) => d.toISOString().split("T")[0];
const addDays = (d: Date, n: number) => { const r = new Date(d); r.setDate(r.getDate() + n); return r; };

function seedData() {
  const customers: Customer[] = [
    {
      id: "cust_1", owner_id: "owner", name: "John Smith", address: "123 Oak Lane, Springfield",
      phone: "(555) 123-4567", email: "john@email.com", service_frequency: "weekly",
      service_type: ["Lawn Mowing", "Edging"], last_service_date: fmt(addDays(TODAY, -3)),
      next_service_date: fmt(addDays(TODAY, 4)), payment_status: "paid", property_size: "0.25 acre",
      gate_code: "1234", preferred_day: "Tuesday", customer_since: fmt(addDays(TODAY, -180)),
      customer_type: "residential", status: "active", created_at: fmt(addDays(TODAY, -180)), updated_at: fmt(addDays(TODAY, -1)),
    },
    {
      id: "cust_2", owner_id: "owner", name: "Greenfield Office Park", address: "456 Commerce Blvd, Springfield",
      phone: "(555) 987-6543", email: "manager@greenfield.com", service_frequency: "bi_weekly",
      service_type: ["Commercial Lawn Maintenance", "Hedge Trimming"], last_service_date: fmt(addDays(TODAY, -7)),
      next_service_date: fmt(addDays(TODAY, 7)), payment_status: "unpaid", property_size: "2 acres",
      preferred_day: "Thursday", customer_since: fmt(addDays(TODAY, -365)),
      customer_type: "commercial", status: "active", created_at: fmt(addDays(TODAY, -365)), updated_at: fmt(addDays(TODAY, -3)),
    },
    {
      id: "cust_3", owner_id: "owner", name: "Mary Johnson", address: "789 Maple Drive, Springfield",
      phone: "(555) 456-7890", email: "mary.j@email.com", service_frequency: "monthly",
      service_type: ["Lawn Mowing", "Fertilizer Treatment"], next_service_date: fmt(addDays(TODAY, 12)),
      payment_status: "paid", property_size: "0.5 acre", preferred_day: "Friday",
      customer_since: fmt(addDays(TODAY, -60)), customer_type: "residential", status: "active",
      created_at: fmt(addDays(TODAY, -60)), updated_at: fmt(addDays(TODAY, -5)),
    },
    {
      id: "cust_4", owner_id: "owner", name: "Robert Davis", address: "321 Pine Street, Springfield",
      phone: "(555) 321-0987", service_frequency: "one_time",
      service_type: ["Yard Cleanup"], last_service_date: fmt(addDays(TODAY, -14)),
      payment_status: "paid", property_size: "0.3 acre",
      customer_since: fmt(addDays(TODAY, -30)), customer_type: "residential", status: "inactive",
      created_at: fmt(addDays(TODAY, -30)), updated_at: fmt(addDays(TODAY, -14)),
    },
    {
      id: "cust_5", owner_id: "owner", name: "Sunrise Elementary School", address: "555 School Road, Springfield",
      phone: "(555) 222-3333", email: "facilities@sunrise.edu", service_frequency: "weekly",
      service_type: ["Commercial Lawn Maintenance", "Leaf Removal"], next_service_date: fmt(addDays(TODAY, 2)),
      payment_status: "past_due", property_size: "3 acres", gate_code: "9999",
      preferred_day: "Wednesday", customer_since: fmt(addDays(TODAY, -200)),
      customer_type: "commercial", status: "active", created_at: fmt(addDays(TODAY, -200)), updated_at: fmt(addDays(TODAY, -1)),
    },
    {
      id: "cust_6", owner_id: "owner", name: "Lisa Chen", address: "42 Willow Circle, Springfield",
      phone: "(555) 777-8888", email: "lisa.chen@email.com", service_frequency: "bi_weekly",
      service_type: ["Lawn Mowing", "Weed Control"], last_service_date: fmt(addDays(TODAY, -5)),
      next_service_date: fmt(addDays(TODAY, 9)), payment_status: "unpaid",
      property_size: "0.4 acre", preferred_day: "Monday",
      customer_since: fmt(addDays(TODAY, -90)), customer_type: "residential", status: "new",
      created_at: fmt(addDays(TODAY, -14)), updated_at: fmt(addDays(TODAY, -2)),
    },
  ];

  const services: Service[] = DEFAULT_SERVICES.map((s, i) => ({
    id: `svc_${i + 1}`,
    owner_id: "owner",
    name: s.name,
    base_price: s.base_price,
    description: `${s.name} — professional quality service`,
    estimated_time: s.estimated_time,
    is_recurring: s.is_recurring,
    is_active: true,
    created_at: fmt(addDays(TODAY, -365)),
    updated_at: fmt(addDays(TODAY, -1)),
  }));

  const appointments: Appointment[] = [
    {
      id: "apt_1", owner_id: "owner", customer_id: "cust_1", service_id: "svc_1",
      title: "Lawn Mowing — John Smith", date: fmt(TODAY), start_time: "09:00", end_time: "09:45",
      status: "scheduled", is_recurring: true, recurring_pattern: "weekly",
      created_at: fmt(addDays(TODAY, -5)), updated_at: fmt(addDays(TODAY, -1)),
    },
    {
      id: "apt_2", owner_id: "owner", customer_id: "cust_2", service_id: "svc_14",
      title: "Commercial Maintenance — Greenfield", date: fmt(TODAY), start_time: "10:30", end_time: "13:30",
      status: "approved", is_recurring: true, recurring_pattern: "bi_weekly",
      created_at: fmt(addDays(TODAY, -3)), updated_at: fmt(addDays(TODAY, -1)),
    },
    {
      id: "apt_3", owner_id: "owner", customer_id: "cust_5", service_id: "svc_1",
      title: "Lawn Mowing — Sunrise Elementary", date: fmt(addDays(TODAY, 1)), start_time: "08:00", end_time: "09:00",
      status: "scheduled", is_recurring: true, recurring_pattern: "weekly",
      created_at: fmt(addDays(TODAY, -7)), updated_at: fmt(addDays(TODAY, -2)),
    },
    {
      id: "apt_4", owner_id: "owner", customer_id: "cust_3", service_id: "svc_6",
      title: "Fertilizer Treatment — Mary Johnson", date: fmt(addDays(TODAY, 2)), start_time: "14:00", end_time: "14:30",
      status: "requested", is_recurring: false,
      created_at: fmt(addDays(TODAY, -1)), updated_at: fmt(TODAY),
    },
    {
      id: "apt_5", owner_id: "owner", customer_id: "cust_6", service_id: "svc_7",
      title: "Weed Control — Lisa Chen", date: fmt(addDays(TODAY, 3)), start_time: "11:00", end_time: "11:45",
      status: "scheduled", is_recurring: true, recurring_pattern: "bi_weekly",
      created_at: fmt(addDays(TODAY, -2)), updated_at: fmt(addDays(TODAY, -1)),
    },
    {
      id: "apt_6", owner_id: "owner", customer_id: "cust_1", service_id: "svc_2",
      title: "Edging — John Smith", date: fmt(addDays(TODAY, 4)), start_time: "09:45", end_time: "10:05",
      status: "scheduled", is_recurring: true, recurring_pattern: "weekly",
      created_at: fmt(addDays(TODAY, -5)), updated_at: fmt(addDays(TODAY, -1)),
    },
    {
      id: "apt_7", owner_id: "owner", customer_id: "cust_4", service_id: "svc_9",
      title: "Yard Cleanup — Robert Davis", date: fmt(addDays(TODAY, -14)), start_time: "10:00", end_time: "11:30",
      status: "completed", is_recurring: false,
      created_at: fmt(addDays(TODAY, -20)), updated_at: fmt(addDays(TODAY, -14)),
    },
    {
      id: "apt_8", owner_id: "owner", customer_id: "cust_2", service_id: "svc_8",
      title: "Hedge Trimming — Greenfield", date: fmt(addDays(TODAY, 5)), start_time: "13:00", end_time: "13:45",
      status: "requested", is_recurring: false,
      created_at: fmt(addDays(TODAY, -1)), updated_at: fmt(TODAY),
    },
    {
      id: "apt_9", owner_id: "owner", customer_id: "cust_1", service_id: "svc_1",
      title: "Lawn Mowing — John Smith", date: fmt(addDays(TODAY, 6)), start_time: "09:00", end_time: "09:45",
      status: "scheduled", is_recurring: true, recurring_pattern: "weekly",
      created_at: fmt(addDays(TODAY, -5)), updated_at: fmt(addDays(TODAY, -1)),
    },
  ];

  const estimates: Estimate[] = [
    {
      id: "est_1", owner_id: "owner", customer_id: "cust_3", service_id: "svc_10",
      property_address: "789 Maple Drive, Springfield", estimated_price: 85, status: "sent",
      notes: "Aeration + seeding combo recommended for fall", created_at: fmt(addDays(TODAY, -3)), updated_at: fmt(addDays(TODAY, -1)),
    },
    {
      id: "est_2", owner_id: "owner", customer_id: "cust_6", service_id: "svc_12",
      property_address: "42 Willow Circle, Springfield", estimated_price: 100, status: "accepted",
      notes: "Pressure washing driveway and walkway", created_at: fmt(addDays(TODAY, -7)), updated_at: fmt(addDays(TODAY, -2)),
    },
    {
      id: "est_3", owner_id: "owner", customer_id: "cust_5", service_id: "svc_13",
      property_address: "555 School Road, Springfield", estimated_price: 180, status: "draft",
      notes: "Seasonal cleanup — entire campus, estimate pending walk-through", created_at: fmt(addDays(TODAY, -1)), updated_at: fmt(TODAY),
    },
  ];

  const tasks: Task[] = [
    { id: "task_1", owner_id: "owner", customer_id: "cust_5", title: "Follow up on past-due invoice", due_date: fmt(addDays(TODAY, 1)), priority: "high", status: "not_started", created_at: fmt(addDays(TODAY, -2)), updated_at: fmt(TODAY) },
    { id: "task_2", owner_id: "owner", customer_id: "cust_2", title: "Schedule walk-through for Greenfield", due_date: fmt(addDays(TODAY, 3)), priority: "medium", status: "in_progress", created_at: fmt(addDays(TODAY, -3)), updated_at: fmt(TODAY) },
    { id: "task_3", owner_id: "owner", title: "Order replacement trimmer line", due_date: fmt(addDays(TODAY, 2)), priority: "medium", status: "not_started", created_at: fmt(addDays(TODAY, -1)), updated_at: fmt(TODAY) },
    { id: "task_4", owner_id: "owner", title: "Update service area map on website", due_date: fmt(addDays(TODAY, 5)), priority: "low", status: "not_started", created_at: fmt(addDays(TODAY, -1)), updated_at: fmt(TODAY) },
    { id: "task_5", owner_id: "owner", customer_id: "cust_3", title: "Call Mary Johnson about estimate", due_date: fmt(addDays(TODAY, 0)), priority: "high", status: "in_progress", created_at: fmt(addDays(TODAY, -1)), updated_at: fmt(TODAY) },
  ];

  const reminders: Reminder[] = [
    { id: "rem_1", owner_id: "owner", customer_id: "cust_5", title: "Past-due payment follow-up", reminder_type: "payment", due_date: fmt(TODAY), is_read: false, created_at: fmt(addDays(TODAY, -2)) },
    { id: "rem_2", owner_id: "owner", customer_id: "cust_1", appointment_id: "apt_1", title: "Lawn mowing appointment today", reminder_type: "appointment", due_date: fmt(TODAY), is_read: false, created_at: fmt(addDays(TODAY, -1)) },
    { id: "rem_3", owner_id: "owner", customer_id: "cust_6", title: "New customer follow-up — Lisa Chen", reminder_type: "follow_up", due_date: fmt(addDays(TODAY, 1)), is_read: false, created_at: fmt(addDays(TODAY, -1)) },
    { id: "rem_4", owner_id: "owner", title: "Sharpen mower blades", reminder_type: "equipment", due_date: fmt(addDays(TODAY, 3)), is_read: false, created_at: fmt(addDays(TODAY, -2)) },
    { id: "rem_5", owner_id: "owner", title: "Spring fertilization schedule review", reminder_type: "seasonal", due_date: fmt(addDays(TODAY, 14)), is_read: true, created_at: fmt(addDays(TODAY, -7)) },
    { id: "rem_6", owner_id: "owner", customer_id: "cust_3", title: "Weekly recurring — Mary Johnson", reminder_type: "recurring", due_date: fmt(addDays(TODAY, 2)), is_read: false, created_at: fmt(addDays(TODAY, -5)) },
  ];

  const payments: Payment[] = [
    { id: "pay_1", owner_id: "owner", customer_id: "cust_1", appointment_id: "apt_1", amount: 35, payment_type: "recurring", status: "paid", description: "Lawn Mowing — weekly", paid_at: fmt(addDays(TODAY, -7)), created_at: fmt(addDays(TODAY, -7)) },
    { id: "pay_2", owner_id: "owner", customer_id: "cust_2", appointment_id: "apt_2", amount: 150, payment_type: "recurring", status: "unpaid", description: "Commercial Maintenance — bi-weekly", created_at: fmt(addDays(TODAY, -3)) },
    { id: "pay_3", owner_id: "owner", customer_id: "cust_4", appointment_id: "apt_7", amount: 60, payment_type: "full", status: "paid", description: "Yard Cleanup", paid_at: fmt(addDays(TODAY, -14)), created_at: fmt(addDays(TODAY, -14)) },
    { id: "pay_4", owner_id: "owner", customer_id: "cust_5", amount: 200, payment_type: "deposit", status: "past_due", description: "Services rendered — past due", created_at: fmt(addDays(TODAY, -21)) },
    { id: "pay_5", owner_id: "owner", customer_id: "cust_3", amount: 45, payment_type: "full", status: "paid", description: "Fertilizer Treatment", paid_at: fmt(addDays(TODAY, -10)), created_at: fmt(addDays(TODAY, -10)) },
    { id: "pay_6", owner_id: "owner", customer_id: "cust_1", amount: 50, payment_type: "full", status: "paid", description: "Edging + Weed Trimming", paid_at: fmt(addDays(TODAY, -3)), created_at: fmt(addDays(TODAY, -3)) },
    { id: "pay_7", owner_id: "owner", customer_id: "cust_6", amount: 40, payment_type: "recurring", status: "unpaid", description: "Weed Control — bi-weekly", created_at: fmt(addDays(TODAY, -1)) },
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