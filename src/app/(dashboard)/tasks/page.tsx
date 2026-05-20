"use client";

import { useState } from "react";
import { useTasks, useCustomers } from "@/lib/storage";
import { TaskPriority, TaskStatus } from "@/types";
import { Plus, X, Check, Trash2, Edit } from "lucide-react";

const priorityColors: Record<string, string> = {
  high: "bg-red-100 text-red-700",
  medium: "bg-yellow-100 text-yellow-700",
  low: "bg-green-100 text-green-700",
};

export default function TasksPage() {
  const { tasks, addTask, updateTask, deleteTask } = useTasks();
  const { customers } = useCustomers();
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [formData, setFormData] = useState<{ title: string; due_date: string; priority: TaskPriority; customer_id: string }>({
    title: "", due_date: "", priority: "medium", customer_id: "",
  });

  const filtered = tasks.filter((t) => statusFilter === "all" || t.status === statusFilter);

  const grouped = {
    high: filtered.filter((t) => t.priority === "high"),
    medium: filtered.filter((t) => t.priority === "medium"),
    low: filtered.filter((t) => t.priority === "low"),
  };

  const openAdd = () => { setFormData({ title: "", due_date: "", priority: "medium", customer_id: "" }); setEditId(null); setShowModal(true); };

  const openEdit = (id: string) => {
    const task = tasks.find((t) => t.id === id);
    if (!task) return;
    setFormData({ title: task.title, due_date: task.due_date || "", priority: task.priority, customer_id: task.customer_id || "" });
    setEditId(id);
    setShowModal(true);
  };

  const handleSave = () => {
    if (!formData.title.trim()) return;
    if (editId) {
      updateTask(editId, { title: formData.title, due_date: formData.due_date, priority: formData.priority, customer_id: formData.customer_id || undefined });
    } else {
      addTask({ title: formData.title, due_date: formData.due_date || undefined, priority: formData.priority, customer_id: formData.customer_id || undefined });
    }
    setShowModal(false);
    setEditId(null);
  };

  const toggleComplete = (id: string, currentStatus: TaskStatus) => {
    updateTask(id, { status: currentStatus === "complete" ? "not_started" : "complete" });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-green-900">Tasks</h1>
        <button onClick={openAdd} className="flex items-center gap-2 bg-green-700 text-white px-4 py-2 rounded-lg hover:bg-green-800 transition-colors text-sm font-medium">
          <Plus className="w-4 h-4" /> Add Task
        </button>
      </div>

      {/* Status filter */}
      <div className="flex overflow-x-auto gap-1 bg-white rounded-lg shadow p-1 scrollbar-hide">
        {["all", "not_started", "in_progress", "complete"].map((s) => (
          <button key={s} onClick={() => setStatusFilter(s)} className={`px-3 py-1.5 rounded text-sm font-medium whitespace-nowrap transition-colors ${
            statusFilter === s ? "bg-green-700 text-white" : "text-gray-600 hover:bg-gray-100"
          }`}>
            {s === "all" ? "All" : s === "not_started" ? "Not Started" : s === "in_progress" ? "In Progress" : "Complete"}
          </button>
        ))}
      </div>

      {/* Task lists by priority */}
      {(["high", "medium", "low"] as const).map((priority) => {
        const items = grouped[priority];
        if (items.length === 0) return null;
        return (
          <div key={priority} className="bg-white rounded-lg shadow">
            <div className="px-5 py-3 border-b border-gray-100 flex items-center gap-2">
              <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${priorityColors[priority]}`}>
                {priority.charAt(0).toUpperCase() + priority.slice(1)} Priority
              </span>
              <span className="text-xs text-gray-400">({items.length})</span>
            </div>
            <div className="divide-y divide-gray-50">
              {items.map((task) => (
                <div key={task.id} className={`px-5 py-3 flex items-center gap-3 ${task.status === "complete" ? "opacity-60" : ""}`}>
                  <button
                    onClick={() => toggleComplete(task.id, task.status)}
                    className={`w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 ${
                      task.status === "complete" ? "bg-green-600 border-green-600 text-white" : "border-gray-300 hover:border-green-500"
                    }`}
                  >
                    {task.status === "complete" && <Check className="w-3 h-3" />}
                  </button>
                  <div className="flex-1 min-w-0">
                    <p className={`font-medium ${task.status === "complete" ? "line-through text-gray-400" : "text-gray-900"}`}>{task.title}</p>
                    <div className="flex flex-wrap gap-2 mt-0.5 text-xs text-gray-500">
                      {task.due_date && <span>Due: {task.due_date}</span>}
                      {task.customer && <span>• {task.customer.name}</span>}
                      {task.status === "in_progress" && <span className="text-blue-600">In Progress</span>}
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <button onClick={() => openEdit(task.id)} className="p-1 text-gray-400 hover:text-green-700"><Edit className="w-4 h-4" /></button>
                    <button onClick={() => { if (confirm("Delete this task?")) deleteTask(task.id); }} className="p-1 text-gray-400 hover:text-red-600"><Trash2 className="w-4 h-4" /></button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      })}

      {filtered.length === 0 && <p className="text-gray-400 text-center py-8">No tasks found</p>}

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setShowModal(false)}>
          <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-green-900">{editId ? "Edit Task" : "Add Task"}</h3>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600"><X className="w-5 h-5" /></button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
                <input type="text" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" placeholder="Task title" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Due Date</label>
                  <input type="date" value={formData.due_date} onChange={(e) => setFormData({ ...formData, due_date: e.target.value })} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                  <select value={formData.priority} onChange={(e) => setFormData({ ...formData, priority: e.target.value as TaskPriority })} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm">
                    <option value="high">High</option>
                    <option value="medium">Medium</option>
                    <option value="low">Low</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Linked Customer</label>
                <select value={formData.customer_id} onChange={(e) => setFormData({ ...formData, customer_id: e.target.value })} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm">
                  <option value="">None</option>
                  {customers.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button onClick={() => setShowModal(false)} className="px-4 py-2 text-sm text-gray-600">Cancel</button>
              <button onClick={handleSave} className="px-4 py-2 bg-green-700 text-white rounded-lg text-sm font-medium hover:bg-green-800">
                {editId ? "Update" : "Add"} Task
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}