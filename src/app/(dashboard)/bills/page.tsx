"use client";

import { useState, useCallback } from "react";
import { useBills, useCustomers } from "@/lib/storage";
import { BillStatus, BillItem } from "@/types";
import { Plus, X, Trash2, FileText, Send, CheckCircle, AlertTriangle, Eye } from "lucide-react";

const STATUS_TABS = [
  { value: "all", label: "All" },
  { value: "draft", label: "Draft" },
  { value: "sent", label: "Sent" },
  { value: "paid", label: "Paid" },
  { value: "overdue", label: "Overdue" },
];

const STATUS_COLORS: Record<string, string> = {
  draft: "bg-gray-100 text-gray-700",
  sent: "bg-blue-100 text-blue-700",
  paid: "bg-green-100 text-green-700",
  overdue: "bg-red-100 text-red-700",
  cancelled: "bg-gray-100 text-gray-500 line-through",
};

const STATUS_ICONS: Record<string, React.ReactNode> = {
  draft: <FileText className="w-3 h-3" />,
  sent: <Send className="w-3 h-3" />,
  paid: <CheckCircle className="w-3 h-3" />,
  overdue: <AlertTriangle className="w-3 h-3" />,
};

const emptyItem = (): BillItem => ({
  id: crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).slice(2),
  description: "",
  quantity: 1,
  unit_price: 0,
  total: 0,
});

export default function BillsPage() {
  const { bills, addBill, updateBill, deleteBill } = useBills();
  const { customers } = useCustomers();
  const [statusFilter, setStatusFilter] = useState("all");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [viewingBillId, setViewingBillId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    customer_id: "",
    items: [emptyItem()],
    tax_rate: 0,
    notes: "",
    due_date: "",
    status: "draft" as BillStatus,
  });

  const filtered = bills.filter((b) => {
    if (statusFilter !== "all" && b.status !== statusFilter) return false;
    return true;
  }).sort((a, b) => b.created_at.localeCompare(a.created_at));

  const totalDraft = bills.filter((b) => b.status === "draft").reduce((s, b) => s + b.total, 0);
  const totalSent = bills.filter((b) => b.status === "sent").reduce((s, b) => s + b.total, 0);
  const totalPaid = bills.filter((b) => b.status === "paid").reduce((s, b) => s + b.total, 0);
  const totalOverdue = bills.filter((b) => b.status === "overdue").reduce((s, b) => s + b.total, 0);

  const updateItem = useCallback((index: number, field: string, value: string | number) => {
    setFormData((prev) => {
      const items = [...prev.items];
      items[index] = { ...items[index], [field]: value };
      // Auto-calc total
      const qty = field === "quantity" ? Number(value) : items[index].quantity;
      const price = field === "unit_price" ? Number(value) : items[index].unit_price;
      items[index].quantity = qty;
      items[index].unit_price = price;
      items[index].total = Math.round(qty * price * 100) / 100;
      return { ...prev, items };
    });
  }, []);

  const addItem = useCallback(() => {
    setFormData((prev) => ({ ...prev, items: [...prev.items, emptyItem()] }));
  }, []);

  const removeItem = useCallback((index: number) => {
    setFormData((prev) => ({
      ...prev,
      items: prev.items.length > 1 ? prev.items.filter((_, i) => i !== index) : prev.items,
    }));
  }, []);

  const calcSubtotal = formData.items.reduce((sum, item) => sum + item.total, 0);
  const calcTax = Math.round(calcSubtotal * formData.tax_rate * 100) / 100;
  const calcTotal = calcSubtotal + calcTax;

  const resetForm = () => {
    setFormData({ customer_id: "", items: [emptyItem()], tax_rate: 0, notes: "", due_date: "", status: "draft" });
  };

  const viewingBill = viewingBillId ? bills.find((b) => b.id === viewingBillId) : null;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Bills & Invoices</h1>
        <button onClick={() => { resetForm(); setShowCreateModal(true); }} className="flex items-center gap-2 btn-accent text-sm">
          <Plus className="w-4 h-4" /> Create Bill
        </button>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
          <p className="text-xs text-gray-500 flex items-center gap-1"><FileText className="w-3 h-3" /> Draft</p>
          <p className="text-lg font-bold text-gray-700 mt-1">${totalDraft.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
        </div>
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
          <p className="text-xs text-blue-600 flex items-center gap-1"><Send className="w-3 h-3" /> Sent</p>
          <p className="text-lg font-bold text-blue-700 mt-1">${totalSent.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
        </div>
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
          <p className="text-xs text-green-600 flex items-center gap-1"><CheckCircle className="w-3 h-3" /> Paid</p>
          <p className="text-lg font-bold text-green-700 mt-1">${totalPaid.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
        </div>
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
          <p className="text-xs text-red-600 flex items-center gap-1"><AlertTriangle className="w-3 h-3" /> Overdue</p>
          <p className="text-lg font-bold text-red-600 mt-1">${totalOverdue.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
        </div>
      </div>

      {/* Status filter tabs */}
      <div className="flex overflow-x-auto gap-1 bg-white rounded-2xl shadow-sm border border-gray-100 p-1 scrollbar-hide">
        {STATUS_TABS.map((tab) => (
          <button key={tab.value} onClick={() => setStatusFilter(tab.value)} className={`px-3 py-1.5 rounded-xl text-sm font-medium whitespace-nowrap transition-colors ${
            statusFilter === tab.value ? "bg-green-700 text-white" : "text-gray-600 hover:bg-gray-100"
          }`}>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Bills list */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {filtered.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-4xl mb-2">🧾</div>
            <p className="text-gray-400">No bills yet</p>
            <p className="text-gray-400 text-sm">Create your first bill to get started</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-50">
            {filtered.map((bill) => (
              <div key={bill.id} className="p-4 hover:bg-green-50/30 transition-colors">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-bold text-gray-900 text-sm">{bill.bill_number}</span>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium flex items-center gap-1 ${STATUS_COLORS[bill.status] || "bg-gray-100 text-gray-600"}`}>
                        {STATUS_ICONS[bill.status]}
                        {bill.status?.replace("_", " ")}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">
                      {bill.customer?.name || "No customer"} · {bill.items.length} item{bill.items.length !== 1 ? "s" : ""}
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      Created {bill.created_at}
                      {bill.due_date && ` · Due ${bill.due_date}`}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-gray-900">${bill.total.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
                    <div className="flex items-center gap-1 mt-1 justify-end">
                      <button onClick={() => setViewingBillId(bill.id)} className="p-1 text-gray-400 hover:text-green-600" title="View"><Eye className="w-4 h-4" /></button>
                      {bill.status === "draft" && (
                        <button onClick={() => updateBill(bill.id, { status: "sent" })} className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-xl hover:bg-blue-200 flex items-center gap-1"><Send className="w-3 h-3" />Send</button>
                      )}
                      {(bill.status === "sent" || bill.status === "overdue") && (
                        <button onClick={() => updateBill(bill.id, { status: "paid", paid_at: new Date().toISOString().split("T")[0] })} className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-xl hover:bg-green-200 flex items-center gap-1"><CheckCircle className="w-3 h-3" />Mark Paid</button>
                      )}
                      <button onClick={() => { if (confirm("Delete this bill?")) deleteBill(bill.id); }} className="p-1 text-gray-400 hover:text-red-600" title="Delete"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* View Bill Modal */}
      {viewingBill && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setViewingBillId(null)}>
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900">{viewingBill.bill_number}</h3>
              <button onClick={() => setViewingBillId(null)} className="text-gray-400 hover:text-gray-600"><X className="w-5 h-5" /></button>
            </div>

            <div className="space-y-4">
              {/* Bill header */}
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm text-gray-500">Customer</p>
                  <p className="font-semibold text-gray-900">{viewingBill.customer?.name || "No customer"}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500">Status</p>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${STATUS_COLORS[viewingBill.status]}`}>
                    {viewingBill.status?.replace("_", " ")}
                  </span>
                </div>
              </div>

              <div className="flex justify-between text-sm text-gray-600">
                <span>Created: {viewingBill.created_at}</span>
                {viewingBill.due_date && <span>Due: {viewingBill.due_date}</span>}
              </div>

              {/* Line items */}
              <div className="border-t border-gray-100 pt-3">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-gray-500">
                      <th className="text-left pb-2">Item</th>
                      <th className="text-right pb-2">Qty</th>
                      <th className="text-right pb-2">Price</th>
                      <th className="text-right pb-2">Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {viewingBill.items.map((item) => (
                      <tr key={item.id}>
                        <td className="py-2 text-gray-900">{item.description}</td>
                        <td className="py-2 text-right text-gray-600">{item.quantity}</td>
                        <td className="py-2 text-right text-gray-600">${item.unit_price.toFixed(2)}</td>
                        <td className="py-2 text-right font-medium text-gray-900">${item.total.toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Totals */}
              <div className="border-t border-gray-100 pt-3 space-y-1">
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Subtotal</span>
                  <span>${viewingBill.subtotal.toFixed(2)}</span>
                </div>
                {viewingBill.tax_rate > 0 && (
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Tax ({(viewingBill.tax_rate * 100).toFixed(1)}%)</span>
                    <span>${viewingBill.tax_amount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between text-lg font-bold text-gray-900 border-t border-gray-200 pt-2">
                  <span>Total</span>
                  <span>${viewingBill.total.toFixed(2)}</span>
                </div>
              </div>

              {viewingBill.notes && (
                <div>
                  <p className="text-sm text-gray-500 mb-1">Notes</p>
                  <p className="text-sm text-gray-700 bg-gray-50 rounded-xl p-3">{viewingBill.notes}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Create Bill Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setShowCreateModal(false)}>
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900">Create Bill</h3>
              <button onClick={() => setShowCreateModal(false)} className="text-gray-400 hover:text-gray-600"><X className="w-5 h-5" /></button>
            </div>

            <div className="space-y-4">
              {/* Customer select */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Customer</label>
                <select
                  value={formData.customer_id}
                  onChange={(e) => setFormData({ ...formData, customer_id: e.target.value })}
                  className="input-field"
                >
                  <option value="">Select customer (optional)</option>
                  {customers.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>

              {/* Status */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as BillStatus })}
                  className="input-field"
                >
                  <option value="draft">Draft</option>
                  <option value="sent">Sent</option>
                  <option value="paid">Paid</option>
                </select>
              </div>

              {/* Due date */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Due Date</label>
                <input
                  type="date"
                  value={formData.due_date}
                  onChange={(e) => setFormData({ ...formData, due_date: e.target.value })}
                  className="input-field"
                />
              </div>

              {/* Line Items */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Line Items</label>
                <div className="space-y-2">
                  {formData.items.map((item, idx) => (
                    <div key={item.id} className="bg-gray-50 rounded-xl p-3 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-medium text-gray-500">Item {idx + 1}</span>
                        {formData.items.length > 1 && (
                          <button onClick={() => removeItem(idx)} className="text-red-400 hover:text-red-600"><Trash2 className="w-3.5 h-3.5" /></button>
                        )}
                      </div>
                      <input
                        type="text"
                        placeholder="Description (e.g. Lawn Mowing)"
                        value={item.description}
                        onChange={(e) => updateItem(idx, "description", e.target.value)}
                        className="input-field text-sm"
                      />
                      <div className="grid grid-cols-3 gap-2">
                        <div>
                          <label className="text-xs text-gray-500">Qty</label>
                          <input
                            type="number"
                            min="1"
                            step="1"
                            value={item.quantity}
                            onChange={(e) => updateItem(idx, "quantity", e.target.value)}
                            className="input-field text-sm"
                          />
                        </div>
                        <div>
                          <label className="text-xs text-gray-500">Unit Price</label>
                          <input
                            type="number"
                            min="0"
                            step="0.01"
                            value={item.unit_price}
                            onChange={(e) => updateItem(idx, "unit_price", e.target.value)}
                            className="input-field text-sm"
                          />
                        </div>
                        <div>
                          <label className="text-xs text-gray-500">Total</label>
                          <div className="input-field text-sm bg-gray-100 font-semibold">${item.total.toFixed(2)}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <button onClick={addItem} className="mt-2 flex items-center gap-1 text-sm text-green-700 hover:text-green-800 font-medium">
                  <Plus className="w-4 h-4" /> Add Item
                </button>
              </div>

              {/* Tax rate */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Tax Rate (%)</label>
                <input
                  type="number"
                  min="0"
                  max="1"
                  step="0.01"
                  value={formData.tax_rate}
                  onChange={(e) => setFormData({ ...formData, tax_rate: parseFloat(e.target.value) || 0 })}
                  className="input-field"
                  placeholder="0.07 for 7%"
                />
              </div>

              {/* Notes */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Notes</label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="input-field"
                  rows={2}
                  placeholder="Payment terms, additional info..."
                />
              </div>

              {/* Live total preview */}
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-4 border border-green-200">
                <div className="flex justify-between text-sm text-gray-600 mb-1">
                  <span>Subtotal</span>
                  <span>${calcSubtotal.toFixed(2)}</span>
                </div>
                {formData.tax_rate > 0 && (
                  <div className="flex justify-between text-sm text-gray-600 mb-1">
                    <span>Tax ({(formData.tax_rate * 100).toFixed(1)}%)</span>
                    <span>${calcTax.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between text-lg font-bold text-gray-900 border-t border-green-200 pt-2 mt-2">
                  <span>Total</span>
                  <span>${calcTotal.toFixed(2)}</span>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button onClick={() => setShowCreateModal(false)} className="px-4 py-2 text-sm text-gray-600">Cancel</button>
              <button
                onClick={() => {
                  if (formData.items.some((item) => !item.description.trim())) {
                    alert("Please fill in all item descriptions");
                    return;
                  }
                  addBill({
                    customer_id: formData.customer_id || undefined,
                    items: formData.items,
                    tax_rate: formData.tax_rate,
                    notes: formData.notes || undefined,
                    due_date: formData.due_date || undefined,
                    status: formData.status,
                  });
                  setShowCreateModal(false);
                  resetForm();
                }}
                className="btn-accent text-sm"
              >
                Create Bill
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}