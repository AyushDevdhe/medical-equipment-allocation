import React, { useState } from "react";
import { Plus, X } from "lucide-react";
import { priorityLabels } from "../data/sampleData";

// Add Request Form Component
const AddRequestForm = ({ equipment, onAdd, onClose }) => {
  const [formData, setFormData] = useState({
    patient: "",
    doctor: "",
    equipmentType: "",
    equipmentName: "",
    quantity: 1,
    priority: 1,
    reason: "",
    duration: 1,
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.patient && formData.doctor && formData.equipmentType) {
      onAdd(formData);
      onClose();
    } else {
      alert("Please fill in all required fields");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "quantity" || name === "priority" || name === "duration"
          ? parseInt(value)
          : value,
    }));
  };

  // Get unique equipment types
  const equipmentTypes = [...new Set(equipment.map((eq) => eq.type))];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold text-gray-800">
            New Equipment Request
          </h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Patient Name *
            </label>
            <input
              type="text"
              name="patient"
              value={formData.patient}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Doctor Name *
            </label>
            <input
              type="text"
              name="doctor"
              value={formData.doctor}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Equipment Type *
            </label>
            <select
              name="equipmentType"
              value={formData.equipmentType}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Select Equipment Type</option>
              {equipmentTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Equipment Name
            </label>
            <input
              type="text"
              name="equipmentName"
              value={formData.equipmentName}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Optional specific model/name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Quantity *
            </label>
            <input
              type="number"
              name="quantity"
              value={formData.quantity}
              onChange={handleChange}
              min="1"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Priority Level *
            </label>
            <select
              name="priority"
              value={formData.priority}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="1">Priority 1: Critical/Emergency</option>
              <option value="2">Priority 2: High/Urgent</option>
              <option value="3">Priority 3: Medium</option>
              <option value="4">Priority 4: Low</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Reason for Request *
            </label>
            <textarea
              name="reason"
              value={formData.reason}
              onChange={handleChange}
              rows="3"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Duration (days) *
            </label>
            <input
              type="number"
              name="duration"
              value={formData.duration}
              onChange={handleChange}
              min="1"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-all"
            >
              Submit Request
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const RequestsList = ({ requests, equipment, onAdd }) => {
  const [showAddForm, setShowAddForm] = useState(false);

  const sortedRequests = [...requests].sort((a, b) => {
    if (a.priority !== b.priority) return a.priority - b.priority;
    return new Date(a.timestamp) - new Date(b.timestamp);
  });

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">
            Equipment Requests
          </h2>
          <span className="text-sm text-gray-600">
            Sorted by Priority (Priority Queue)
          </span>
        </div>
        <button
          onClick={() => setShowAddForm(true)}
          className="flex items-center space-x-2 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-all"
        >
          <Plus className="w-5 h-5" />
          <span className="font-medium">New Request</span>
        </button>
      </div>

      <div className="space-y-4">
        {sortedRequests.map((req) => (
          <div
            key={req.id}
            className={`border-2 rounded-xl p-5 ${
              req.status === "Allocated"
                ? "border-green-300 bg-green-50"
                : "border-gray-200"
            }`}
          >
            <div className="flex justify-between items-start mb-3">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      priorityLabels[req.priority].color
                    } text-white`}
                  >
                    Priority {req.priority}:{" "}
                    {priorityLabels[req.priority].label}
                  </span>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      req.status === "Allocated"
                        ? "bg-green-500 text-white"
                        : "bg-yellow-500 text-white"
                    }`}
                  >
                    {req.status}
                  </span>
                </div>
                <h3 className="font-bold text-lg text-gray-800">
                  {req.equipmentName || req.equipmentType}
                </h3>
                <p className="text-sm text-gray-500">{req.equipmentType}</p>
                <p className="text-sm text-gray-600 mt-1">
                  Patient: <span className="font-semibold">{req.patient}</span>
                </p>
                <p className="text-sm text-gray-600">
                  Doctor: <span className="font-semibold">{req.doctor}</span>
                </p>
                <p className="text-sm text-gray-600 mt-2">
                  Reason: {req.reason}
                </p>
                <p className="text-xs text-gray-500 mt-2">
                  Requested: {new Date(req.timestamp).toLocaleString()}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-600">Quantity</p>
                <p className="text-2xl font-bold text-blue-600">
                  {req.quantity}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {showAddForm && (
        <AddRequestForm
          equipment={equipment}
          onAdd={onAdd}
          onClose={() => setShowAddForm(false)}
        />
      )}
    </div>
  );
};

export default RequestsList;
