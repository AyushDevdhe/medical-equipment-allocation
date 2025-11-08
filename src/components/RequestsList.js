import React, { useState } from "react";
import { Plus } from "lucide-react";
import { priorityLabels } from "../data/sampleData";
import AddRequestForm from "./AddRequestForm";

const RequestsList = ({ requests, equipment, onAdd }) => {
  const [showAddForm, setShowAddForm] = useState(false);

  const sortedRequests = [...requests].sort((a, b) => {
    if (a.priority !== b.priority) return a.priority - b.priority;
    return a.timestamp - b.timestamp;
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
