"use client";

import { useState } from "react";

interface SectionGuide {
  icon: string;
  title: string;
  tagline: string;
  whatItDoes: string;
  flow: string[];
  tips: string[];
}

const sections: SectionGuide[] = [
  {
    icon: "📊",
    title: "Dashboard",
    tagline: "Your business at a glance",
    whatItDoes: "The Dashboard is your command center. It shows a real-time snapshot of your entire operation — total customers, active jobs, monthly revenue, and unpaid invoices — plus today's schedule, pending tasks, and reminders, all in one place.",
    flow: [
      "When you log in, Dashboard loads first with live stats from your data",
      "Today's appointments appear in the left panel with status badges",
      "Pending tasks and unread reminders show in the right sidebar",
      "The upcoming 7-day table at the bottom shows what's ahead",
      "Click any 'View All' link to jump to the full section",
    ],
    tips: [
      "Use the 'Book Page' link in the top-right to jump to your public booking URL",
      "Stats update automatically whenever you add or change data elsewhere",
    ],
  },
  {
    icon: "📅",
    title: "Calendar",
    tagline: "See every job, every day",
    whatItDoes: "The Calendar gives you a visual month-by-month view of all appointments. Each day shows the number of scheduled jobs so you can quickly spot busy days or open slots.",
    flow: [
      "Open Calendar to see the current month with appointment counts on each day",
      "Click any day to see the full list of appointments for that date",
      "Each appointment shows the customer, service, time, and status",
      "Use the arrow buttons to navigate between months",
    ],
    tips: [
      "Days with appointments show a colored dot — hover or click for details",
      "The calendar syncs with any changes you make in the Appointments section",
    ],
  },
  {
    icon: "👥",
    title: "Customers",
    tagline: "Your client roster, organized",
    whatItDoes: "Customers stores every client's details — name, address, phone, email, property size, gate code, preferred service day, service frequency, and payment status. Filter by type (residential/commercial), status (new/active/inactive), or frequency.",
    flow: [
      "Click 'Add Customer' to create a new client record",
      "Fill in contact info, property details, and service preferences",
      "The customer list shows all clients with quick-filter buttons at the top",
      "Click any customer name to view their full profile and edit details",
      "From the customer detail page, see their appointment history, payments, and notes",
    ],
    tips: [
      "The gate code field is great for gated communities — techs can reference it in the field",
      "Set the preferred day so the system can suggest optimal scheduling",
    ],
  },
  {
    icon: "🕐",
    title: "Appointments",
    tagline: "Schedule and track every job",
    whatItDoes: "Appointments is the scheduling engine. Create, edit, and track every job from request to completion. Each appointment links to a customer and a service, with status tracking through the full lifecycle.",
    flow: [
      "A customer requests a service (via the Book Now page or phone call)",
      "You create a new appointment — select the customer, service, date, and time",
      "Status starts as 'Requested' (yellow) — you review and approve/schedule",
      "On service day, status moves through: Approved → Scheduled → On the Way → In Progress",
      "After completion, mark as 'Completed' (green) or 'Payment Pending'",
      "Once paid, status becomes 'Paid' — or 'Cancelled' / 'Rescheduled' if plans change",
    ],
    tips: [
      "Set 'Is Recurring' when creating to auto-schedule weekly/bi-weekly appointments",
      "The Book Now page creates appointments with 'Requested' status — review them here",
    ],
  },
  {
    icon: "✂️",
    title: "Services",
    tagline: "Your menu of lawn care services",
    whatItDoes: "Services is your service catalog. Define each service you offer — name, base price, estimated duration, and whether it's a recurring or one-time service. These are the options customers see on the Book Now page.",
    flow: [
      "Pre-loaded with 14 common lawn care services (mowing, edging, leaf removal, etc.)",
      "Click a service to edit its price, description, or time estimate",
      "Toggle a service 'Inactive' to hide it from the Book Now page without deleting it",
      "Add custom services for anything not covered by the defaults",
      "Changes to services are reflected immediately on the public Book Now page",
    ],
    tips: [
      "The 'Base Price' is a starting point — you can adjust final pricing per estimate or appointment",
      "Marking a service inactive hides it from customers but keeps it in your history",
    ],
  },
  {
    icon: "📝",
    title: "Estimates",
    tagline: "Professional quotes, fast",
    whatItDoes: "Estimates lets you create and track price quotes for potential jobs. An estimate is a proposed scope of work with a price — before it becomes an actual appointment. This is how you go from a customer inquiry to a confirmed job.",
    flow: [
      "A customer contacts you requesting a quote (or you proactively create one)",
      "You create a new Estimate — select the customer, service, and enter the estimated price",
      "The estimate starts with status 'Draft' — you can refine details before sending",
      "Change status to 'Sent' when you deliver the quote to the customer",
      "Customer reviews the estimate and either accepts or declines",
      "If accepted → status changes to 'Accepted' → convert it to an Appointment with one click",
      "If declined → mark as 'Declined' or 'Expired'",
      "The final appointment is created with the agreed-upon pricing from the estimate",
    ],
    tips: [
      "Use the 'Notes' field to include scope details, material lists, or special conditions",
      "An estimate is not a commitment — it's a proposal. Only becomes a real job when accepted",
    ],
  },
  {
    icon: "✅",
    title: "Tasks",
    tagline: "Your to-do list, business-focused",
    whatItDoes: "Tasks is a built-in to-do list tied to your business operations. Create tasks with priorities (high/medium/low), optional due dates, and link them to specific customers for context.",
    flow: [
      "Create a task: give it a title, optional customer link, due date, and priority level",
      "Tasks appear in the Dashboard sidebar and the full Tasks page",
      "Mark tasks as 'In Progress' when you start working on them",
      "Mark as 'Complete' when done — they disappear from the Dashboard view",
      "Overdue tasks are highlighted so nothing falls through the cracks",
    ],
    tips: [
      "Link a task to a customer to provide context when you're reviewing their profile",
      "Common tasks: follow up on past-due payments, schedule walk-throughs, order supplies",
    ],
  },
  {
    icon: "🔔",
    title: "Reminders",
    tagline: "Never miss a deadline",
    whatItDoes: "Reminders helps you stay on top of important dates and follow-ups. Create reminders for payments, appointments, equipment maintenance, seasonal tasks, and more.",
    flow: [
      "Create a reminder: choose the type (payment, appointment, follow-up, equipment, seasonal, recurring)",
      "Set a due date and optionally link it to a customer or appointment",
      "Unread reminders appear on the Dashboard with an orange dot",
      "Mark reminders as 'Read' once acknowledged",
      "Review all reminders chronologically on the Reminders page",
    ],
    tips: [
      "Recurring reminders are great for weekly/bi-weekly service follow-ups",
      "Equipment reminders (sharpen blades, order supplies) keep your operation running smooth",
    ],
  },
  {
    icon: "💳",
    title: "Payments",
    tagline: "Track who paid, who hasn't",
    whatItDoes: "Payments is your income tracker. Record every payment — recurring, one-time, or deposit — and link it to a customer and appointment. See at a glance what's paid, what's unpaid, and what's past due.",
    flow: [
      "When a customer pays, create a Payment record — select the customer, amount, and type",
      "Set payment type: Recurring (ongoing service), Full (one-time), or Deposit (partial upfront)",
      "Mark status as 'Paid' and set the paid date, or leave as 'Unpaid' / 'Past Due'",
      "The Dashboard shows total revenue this month and total unpaid invoices",
      "Filter the Payments list by status to quickly find overdue accounts",
      "Past-due payments can trigger Tasks and Reminders for follow-up",
    ],
    tips: [
      "The Dashboard 'Unpaid Invoices' counter pulls directly from unpaid/past-due payments here",
      "Always create a Payment record when you complete a job — even if not yet paid — to track what's owed",
    ],
  },
  {
    icon: "🧾",
    title: "Bills",
    tagline: "Track your business expenses",
    whatItDoes: "Bills tracks your outgoing expenses — equipment, fuel, materials, subcontractors, and other costs. Know what you're spending alongside what you're earning.",
    flow: [
      "Create a bill record with vendor, amount, category, and due date",
      "Set the status: Unpaid, Paid, or Overdue",
      "Categorize expenses (Equipment, Fuel, Materials, Labor, etc.) for reporting",
      "Mark bills as 'Paid' once the check clears or the card is charged",
      "Review all bills by category or status on the Bills page",
    ],
    tips: [
      "Pair Bills with Payments data to see true profit in the Reports section",
      "Categorize consistently for accurate expense tracking",
    ],
  },
  {
    icon: "📈",
    title: "Reports",
    tagline: "Know your numbers",
    whatItDoes: "Reports compiles your data into clear summaries — revenue trends, customer growth, service popularity, payment health, and expense breakdown. Make smarter business decisions with real numbers.",
    flow: [
      "Open Reports to see an overview dashboard with key metrics",
      "Revenue report shows income by month, week, or custom date range",
      "Customer report tracks growth, retention, and churn",
      "Service report shows which services are most popular and profitable",
      "Payment health report highlights overdue accounts and aging receivables",
      "Expense report breaks down spending by category",
    ],
    tips: [
      "Reports update in real-time as you add or change data across the app",
      "Use Reports to identify your most profitable services and busiest seasons",
    ],
  },
  {
    icon: "⚙️",
    title: "Settings",
    tagline: "Make it yours",
    whatItDoes: "Settings lets you customize your app — change your business name, update your PIN, manage your account, and configure preferences.",
    flow: [
      "Change your business name — it updates across the app and Book Now page",
      "Update your login PIN for security",
      "Toggle PIN lock on/off if you prefer quick access",
      "Manage your subscription and account details",
    ],
    tips: [
      "Your business name appears on the Book Now customer-facing page — keep it current",
      "Disable PIN lock only if your device is private and secure",
    ],
  },
  {
    icon: "📱",
    title: "Book Now (Customer Page)",
    tagline: "Your public booking portal",
    whatItDoes: "The Book Now page is the customer-facing side of LawnCare Manager. Customers visit this page (via a link or QR code) to request services without calling. They can select one or more services, enter their details, and submit a booking request.",
    flow: [
      "You share the Book Now link (or QR flyer) with customers",
      "Customer opens the page, sees your business name and available services",
      "Customer selects one or more services they want",
      "They fill in their name, address, phone, email, preferred date/time, and notes",
      "They hit 'Submit Request' — the booking is saved to your system",
      "The request appears in your Appointments list with status 'Requested'",
      "You review the request, confirm or adjust the details, and change the status to 'Scheduled'",
      "The customer gets a confirmation message on-screen that you'll follow up",
    ],
    tips: [
      "Print the QR Flyer and hand it to customers or post it at job sites",
      "Inactive services are hidden from the Book Now page automatically",
    ],
  },
];

export default function GuidePage() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggle = (i: number) => {
    setOpenIndex(openIndex === i ? null : i);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          📖 App Guide
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          How every section of LawnCare Manager Pro works — from customer booking to payment tracking.
        </p>
      </div>

      {/* Overview card */}
      <div className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 rounded-2xl p-6">
        <h2 className="font-bold text-green-900 text-lg mb-2">🌿 How It All Fits Together</h2>
        <p className="text-sm text-green-800 leading-relaxed mb-3">
          LawnCare Manager Pro runs your entire lawn care business from your phone or tablet. Here&apos;s the big picture:
        </p>
        <div className="bg-white/80 rounded-xl p-4 text-sm text-gray-700 leading-relaxed space-y-2">
          <p><strong>1. Setup your services</strong> — Define what you offer and your pricing in <strong>Services</strong>.</p>
          <p><strong>2. Get customers</strong> — Share your <strong>Book Now</strong> link or QR flyer so customers can request services online.</p>
          <p><strong>3. Book jobs</strong> — Booking requests appear in <strong>Appointments</strong> as &quot;Requested.&quot; Review and schedule them.</p>
          <p><strong>4. Quote work</strong> — Use <strong>Estimates</strong> to send price quotes before committing to a job.</p>
          <p><strong>5. Track work</strong> — Use <strong>Calendar</strong> and <strong>Tasks</strong> to stay on schedule and organized.</p>
          <p><strong>6. Get paid</strong> — Record payments in <strong>Payments</strong>, track expenses in <strong>Bills</strong>, and see the full picture in <strong>Reports</strong>.</p>
        </div>
      </div>

      {/* Section guides */}
      <div className="space-y-3">
        {sections.map((section, i) => (
          <div
            key={i}
            className="bg-white rounded-2xl shadow hover:shadow-lg transition-shadow duration-200 border border-gray-100 overflow-hidden"
          >
            <button
              onClick={() => toggle(i)}
              className="w-full text-left px-6 py-4 flex items-center gap-4 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-inset"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center text-lg shadow-md shadow-green-500/20 flex-shrink-0">
                {section.icon}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-gray-900">{section.title}</h3>
                <p className="text-xs text-gray-500">{section.tagline}</p>
              </div>
              <span className={`text-gray-400 transition-transform duration-200 ${openIndex === i ? "rotate-180" : ""}`}>
                ▼
              </span>
            </button>

            {openIndex === i && (
              <div className="px-6 pb-6 pt-2 border-t border-gray-100">
                <p className="text-sm text-gray-700 leading-relaxed mb-4">
                  {section.whatItDoes}
                </p>

                <div className="mb-4">
                  <h4 className="font-semibold text-gray-900 text-sm mb-2">🔄 How it works</h4>
                  <ol className="space-y-1.5">
                    {section.flow.map((step, si) => (
                      <li key={si} className="flex gap-2 text-sm">
                        <span className="w-5 h-5 rounded-full bg-green-100 text-green-700 flex items-center justify-center flex-shrink-0 text-xs font-bold">
                          {si + 1}
                        </span>
                        <span className="text-gray-700">{step}</span>
                      </li>
                    ))}
                  </ol>
                </div>

                {section.tips.length > 0 && (
                  <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                    <h4 className="font-semibold text-amber-800 text-sm mb-2">💡 Pro Tips</h4>
                    <ul className="space-y-1">
                      {section.tips.map((tip, ti) => (
                        <li key={ti} className="text-sm text-amber-900 flex items-start gap-2">
                          <span className="text-amber-500 flex-shrink-0">•</span>
                          {tip}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}