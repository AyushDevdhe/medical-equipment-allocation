import React, { useState } from "react";
import { CheckCircle, AlertCircle, Zap, DollarSign, List } from "lucide-react";
import { priorityLabels } from "../data/sampleData";

const AllocationsList = ({
  allocations = [],
  greedyResults = null,
  knapsackResults = null,
}) => {
  const [activeTab, setActiveTab] = useState("current");

  // Format algorithm allocations for display
  const formatAlgorithmAllocations = (algorithmResults, algorithmType) => {
    if (!algorithmResults || !algorithmResults.allocations) return [];

    return algorithmResults.allocations.map((alloc, index) => ({
      id: `${algorithmType}-${index}`,
      equipmentName: alloc.equipmentId,
      patient: alloc.patient || "Unknown Patient",
      doctor: alloc.doctor || "Unknown Doctor",
      priority: alloc.priority || "medium",
      quantity: alloc.quantity || 1,
      cost: alloc.cost || 0,
      allocatedAt: new Date().toLocaleString(),
      algorithm: algorithmType,
      isSimulated: true,
    }));
  };

  const greedyAllocations = formatAlgorithmAllocations(greedyResults, "greedy");
  const knapsackAllocations = formatAlgorithmAllocations(
    knapsackResults,
    "knapsack"
  );

  const AllocationCard = ({ alloc }) => (
    <div
      className={`border-2 rounded-xl p-5 ${
        alloc.isSimulated
          ? alloc.algorithm === "greedy"
            ? "border-blue-300 bg-blue-50"
            : "border-green-300 bg-green-50"
          : "border-green-300 bg-green-50"
      }`}
    >
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-2">
            <CheckCircle
              className={`w-5 h-5 ${
                alloc.isSimulated
                  ? alloc.algorithm === "greedy"
                    ? "text-blue-600"
                    : "text-green-600"
                  : "text-green-600"
              }`}
            />
            <span className="font-bold text-lg text-gray-800">
              {alloc.equipmentName}
            </span>
            {alloc.isSimulated && (
              <span
                className={`text-xs px-2 py-1 rounded-full ${
                  alloc.algorithm === "greedy"
                    ? "bg-blue-100 text-blue-800"
                    : "bg-green-100 text-green-800"
                }`}
              >
                {alloc.algorithm === "greedy" ? "Greedy" : "Knapsack"}
              </span>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <p className="text-gray-600">
                Patient: <span className="font-semibold">{alloc.patient}</span>
              </p>
              <p className="text-gray-600">
                Doctor: <span className="font-semibold">{alloc.doctor}</span>
              </p>
            </div>
            <div>
              <p className="text-gray-600">
                Priority:{" "}
                <span
                  className={`font-semibold ${
                    priorityLabels[alloc.priority]?.textColor || "text-gray-600"
                  }`}
                >
                  {priorityLabels[alloc.priority]?.label || alloc.priority}
                </span>
              </p>
              <p className="text-gray-600">
                Quantity:{" "}
                <span className="font-semibold">{alloc.quantity}</span>
              </p>
              {alloc.cost > 0 && (
                <p className="text-gray-600">
                  Cost: <span className="font-semibold">${alloc.cost}</span>
                </p>
              )}
            </div>
          </div>

          <p className="text-xs text-gray-500 mt-2">
            {alloc.isSimulated
              ? "Simulated Allocation"
              : `Allocated: ${alloc.allocatedAt}`}
          </p>
        </div>
      </div>
    </div>
  );

  const EmptyState = ({ message }) => (
    <div className="text-center py-12">
      <AlertCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
      <p className="text-gray-500">{message}</p>
    </div>
  );

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        Equipment Allocations
      </h2>

      {/* Tab Navigation */}
      <div className="flex space-x-1 mb-6 bg-gray-100 p-1 rounded-lg">
        <button
          onClick={() => setActiveTab("current")}
          className={`flex items-center space-x-2 px-4 py-2 rounded-md flex-1 justify-center transition-colors ${
            activeTab === "current"
              ? "bg-white shadow-sm text-green-600"
              : "text-gray-600 hover:text-gray-800"
          }`}
        >
          <List className="w-4 h-4" />
          <span>Current ({allocations.length})</span>
        </button>
        <button
          onClick={() => setActiveTab("greedy")}
          className={`flex items-center space-x-2 px-4 py-2 rounded-md flex-1 justify-center transition-colors ${
            activeTab === "greedy"
              ? "bg-white shadow-sm text-blue-600"
              : "text-gray-600 hover:text-gray-800"
          }`}
        >
          <Zap className="w-4 h-4" />
          <span>Greedy ({greedyAllocations.length})</span>
        </button>
        <button
          onClick={() => setActiveTab("knapsack")}
          className={`flex items-center space-x-2 px-4 py-2 rounded-md flex-1 justify-center transition-colors ${
            activeTab === "knapsack"
              ? "bg-white shadow-sm text-green-600"
              : "text-gray-600 hover:text-gray-800"
          }`}
        >
          <DollarSign className="w-4 h-4" />
          <span>Knapsack ({knapsackAllocations.length})</span>
        </button>
      </div>

      {/* Current Allocations Tab */}
      {activeTab === "current" && (
        <div>
          <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-sm text-green-800">
              <strong>Real Allocations:</strong> These are the equipment
              allocations currently active in the system.
            </p>
          </div>
          {allocations.length === 0 ? (
            <EmptyState message="No allocations yet. Run the allocation algorithm to see results." />
          ) : (
            <div className="space-y-4">
              {allocations.map((alloc) => (
                <AllocationCard key={alloc.id} alloc={alloc} />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Greedy Algorithm Tab */}
      {activeTab === "greedy" && (
        <div>
          <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>Greedy Algorithm Simulation:</strong> Shows what would be
              allocated using the Greedy approach (prioritizes by request
              priority only, ignores budget).
              {greedyResults && (
                <span className="block mt-1">
                  Total Cost: <strong>${greedyResults.totalCost || 0}</strong> |
                  Allocations: <strong>{greedyAllocations.length}</strong>
                </span>
              )}
            </p>
          </div>
          {greedyAllocations.length === 0 ? (
            <EmptyState message="No Greedy algorithm results available. Run the algorithm comparison first." />
          ) : (
            <div className="space-y-4">
              {greedyAllocations.map((alloc) => (
                <AllocationCard key={alloc.id} alloc={alloc} />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Knapsack Algorithm Tab */}
      {activeTab === "knapsack" && (
        <div>
          <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-sm text-green-800">
              <strong>Knapsack Algorithm Simulation:</strong> Shows what would
              be allocated using the Knapsack approach (optimizes for maximum
              priority value within budget).
              {knapsackResults && (
                <span className="block mt-1">
                  Total Cost: <strong>${knapsackResults.totalCost || 0}</strong>{" "}
                  | Budget Left:{" "}
                  <strong>${knapsackResults.budgetRemaining || 0}</strong> |
                  Allocations: <strong>{knapsackAllocations.length}</strong>
                </span>
              )}
            </p>
          </div>
          {knapsackAllocations.length === 0 ? (
            <EmptyState message="No Knapsack algorithm results available. Run the algorithm comparison first." />
          ) : (
            <div className="space-y-4">
              {knapsackAllocations.map((alloc) => (
                <AllocationCard key={alloc.id} alloc={alloc} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AllocationsList;
