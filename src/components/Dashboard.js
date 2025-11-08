import React from "react";
import {
  Activity,
  Package,
  CheckCircle,
  TrendingUp,
  Clock,
} from "lucide-react";

const Dashboard = ({ stats, equipment, requests, onRunAlgorithm }) => {
  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-blue-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Equipment</p>
              <p className="text-3xl font-bold text-gray-800">
                {stats.totalEquipment}
              </p>
            </div>
            <Package className="w-12 h-12 text-blue-500 opacity-20" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-green-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Available</p>
              <p className="text-3xl font-bold text-gray-800">
                {stats.availableEquipment}
              </p>
            </div>
            <CheckCircle className="w-12 h-12 text-green-500 opacity-20" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-purple-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Utilization Rate</p>
              <p className="text-3xl font-bold text-gray-800">
                {stats.utilizationRate}%
              </p>
            </div>
            <TrendingUp className="w-12 h-12 text-purple-500 opacity-20" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-orange-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Pending Requests</p>
              <p className="text-3xl font-bold text-gray-800">
                {stats.pendingRequests}
              </p>
            </div>
            <Clock className="w-12 h-12 text-orange-500 opacity-20" />
          </div>
        </div>
      </div>

      {/* Quick Action */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Quick Actions</h2>
        <button
          onClick={onRunAlgorithm}
          className="w-full md:w-auto flex items-center justify-center space-x-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-4 rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all shadow-lg hover:shadow-xl"
        >
          <Activity className="w-6 h-6" />
          <span className="font-semibold">Run Greedy Allocation Algorithm</span>
        </button>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="text-lg font-bold text-gray-800 mb-4">
            High Priority Requests
          </h3>
          <div className="space-y-3">
            {requests
              .filter((r) => r.priority <= 2 && r.status === "Pending")
              .slice(0, 3)
              .map((req) => (
                <div
                  key={req.id}
                  className={`p-3 rounded-lg bg-red-50 border-l-4 border-red-500`}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-semibold text-gray-800">
                        {req.patient}
                      </p>
                      <p className="text-sm text-gray-600">
                        {req.equipmentType}
                      </p>
                    </div>
                    <span className="text-xs px-2 py-1 rounded-full bg-red-500 text-white">
                      Priority {req.priority}
                    </span>
                  </div>
                </div>
              ))}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="text-lg font-bold text-gray-800 mb-4">
            Equipment Status
          </h3>
          <div className="space-y-3">
            {equipment.slice(0, 4).map((eq) => (
              <div
                key={eq.id}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div>
                  <p className="font-semibold text-gray-800">{eq.name}</p>
                  <p className="text-sm text-gray-600">{eq.location}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold">
                    {eq.available}/{eq.total}
                  </p>
                  <p className="text-xs text-gray-500">Available</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
