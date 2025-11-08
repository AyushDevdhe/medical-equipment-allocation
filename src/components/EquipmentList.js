import React, { useState } from "react";
import { Package, Edit, Trash2, Plus } from "lucide-react";
import AddEquipmentForm from "./AddEquipmentForm";

const EquipmentList = ({ equipment, onAdd, onUpdate, onDelete }) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});

  const handleEdit = (eq) => {
    setEditingId(eq.id);
    setEditForm(eq);
  };

  const handleSaveEdit = (id) => {
    onUpdate(id, editForm);
    setEditingId(null);
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">
          Equipment Inventory
        </h2>
        <button
          onClick={() => setShowAddForm(true)}
          className="flex items-center space-x-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-all"
        >
          <Plus className="w-5 h-5" />
          <span className="font-medium">Add Equipment</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {equipment.map((eq) => (
          <div
            key={eq.id}
            className="border-2 border-gray-200 rounded-xl p-5 hover:shadow-lg transition-all hover:border-blue-300"
          >
            {editingId === eq.id ? (
              <div className="space-y-3">
                <input
                  type="text"
                  value={editForm.name}
                  onChange={(e) =>
                    setEditForm({ ...editForm, name: e.target.value })
                  }
                  className="w-full px-2 py-1 border rounded text-sm"
                  placeholder="Name"
                />
                <input
                  type="number"
                  value={editForm.total}
                  onChange={(e) =>
                    setEditForm({
                      ...editForm,
                      total: parseInt(e.target.value),
                    })
                  }
                  className="w-full px-2 py-1 border rounded text-sm"
                  placeholder="Total"
                />
                <input
                  type="number"
                  value={editForm.available}
                  onChange={(e) =>
                    setEditForm({
                      ...editForm,
                      available: parseInt(e.target.value),
                    })
                  }
                  className="w-full px-2 py-1 border rounded text-sm"
                  placeholder="Available"
                />
                <input
                  type="text"
                  value={editForm.location}
                  onChange={(e) =>
                    setEditForm({ ...editForm, location: e.target.value })
                  }
                  className="w-full px-2 py-1 border rounded text-sm"
                  placeholder="Location"
                />
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleSaveEdit(eq.id)}
                    className="flex-1 bg-green-500 text-white px-3 py-1 rounded text-sm hover:bg-green-600"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => setEditingId(null)}
                    className="flex-1 bg-gray-500 text-white px-3 py-1 rounded text-sm hover:bg-gray-600"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="font-bold text-lg text-gray-800">
                      {eq.name}
                    </h3>
                    <p className="text-sm text-gray-600">{eq.type}</p>
                  </div>
                  <Package className="w-8 h-8 text-blue-500" />
                </div>
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Total Quantity:</span>
                    <span className="font-semibold">{eq.total}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Available:</span>
                    <span className="font-semibold text-green-600">
                      {eq.available}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">In Use:</span>
                    <span className="font-semibold text-orange-600">
                      {eq.total - eq.available}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Location:</span>
                    <span className="font-semibold">{eq.location}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Cost/Day:</span>
                    <span className="font-semibold">${eq.costPerDay}</span>
                  </div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                  <div
                    className="bg-blue-500 h-2 rounded-full transition-all"
                    style={{ width: `${(eq.available / eq.total) * 100}%` }}
                  />
                </div>
                <p className="text-xs text-gray-500 mb-3 text-center">
                  {((eq.available / eq.total) * 100).toFixed(0)}% Available
                </p>

                {/* Action Buttons */}
                <div className="flex space-x-2 pt-2 border-t">
                  <button
                    onClick={() => handleEdit(eq)}
                    className="flex-1 flex items-center justify-center space-x-1 bg-yellow-500 text-white px-3 py-2 rounded-lg hover:bg-yellow-600 transition-all text-sm"
                  >
                    <Edit className="w-4 h-4" />
                    <span>Edit</span>
                  </button>
                  <button
                    onClick={() => {
                      if (window.confirm("Delete this equipment?")) {
                        onDelete(eq.id);
                      }
                    }}
                    className="flex-1 flex items-center justify-center space-x-1 bg-red-500 text-white px-3 py-2 rounded-lg hover:bg-red-600 transition-all text-sm"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>Delete</span>
                  </button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>

      {showAddForm && (
        <AddEquipmentForm onAdd={onAdd} onClose={() => setShowAddForm(false)} />
      )}
    </div>
  );
};

export default EquipmentList;
