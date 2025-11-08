import React, { useState, useMemo } from "react";
import { Activity } from "lucide-react";
import Dashboard from "./components/Dashboard";
import EquipmentList from "./components/EquipmentList";
import RequestsList from "./components/RequestsList";
import AllocationsList from "./components/AllocationsList";
import AlgorithmVisualization from "./components/AlgorithmVisualization";
import AlgorithmComparison from "./components/AlgorithmComparison";
import { greedyAllocation } from "./algorithms/greedyAllocation";
import { knapsackAllocation } from "./algorithms/knapsackAllocation";
import { initialEquipment, initialRequests } from "./data/sampleData";

function App() {
  const [equipment, setEquipment] = useState(initialEquipment);
  const [requests, setRequests] = useState(initialRequests);
  const [allocations, setAllocations] = useState([]);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [algorithmSteps, setAlgorithmSteps] = useState([]);
  const [greedyResults, setGreedyResults] = useState(null);
  const [knapsackResults, setKnapsackResults] = useState(null);

  const stats = useMemo(() => {
    const totalEquipment = equipment.reduce((sum, e) => sum + e.total, 0);
    const availableEquipment = equipment.reduce(
      (sum, e) => sum + e.available,
      0
    );
    const utilizationRate =
      totalEquipment > 0
        ? (
            ((totalEquipment - availableEquipment) / totalEquipment) *
            100
          ).toFixed(1)
        : 0;
    const pendingRequests = requests.filter(
      (r) => r.status === "Pending"
    ).length;

    return {
      totalEquipment,
      availableEquipment,
      utilizationRate,
      pendingRequests,
    };
  }, [equipment, requests]);

  const handleRunAlgorithm = () => {
    const result = greedyAllocation(requests, equipment);
    setEquipment(result.updatedEquipment);
    setRequests(result.updatedRequests);
    setAllocations([...allocations, ...result.allocations]);
    setAlgorithmSteps(result.steps);
    setActiveTab("allocations");
  };

  const handleRunGreedyComparison = () => {
    const requestsCopy = JSON.parse(JSON.stringify(requests));
    const equipmentCopy = JSON.parse(JSON.stringify(equipment));
    return greedyAllocation(requestsCopy, equipmentCopy);
  };

  const handleRunKnapsackComparison = (budget) => {
    const requestsCopy = JSON.parse(JSON.stringify(requests));
    const equipmentCopy = JSON.parse(JSON.stringify(equipment));
    return knapsackAllocation(requestsCopy, equipmentCopy, budget);
  };

  const handleAlgorithmResults = (greedy, knapsack) => {
    setGreedyResults(greedy);
    setKnapsackResults(knapsack);
    setActiveTab("allocations");
  };

  const handleAddEquipment = (newEquipment) => {
    setEquipment([...equipment, newEquipment]);
  };

  const handleUpdateEquipment = (id, updatedData) => {
    setEquipment(
      equipment.map((eq) => (eq.id === id ? { ...eq, ...updatedData } : eq))
    );
  };

  const handleDeleteEquipment = (id) => {
    setEquipment(equipment.filter((eq) => eq.id !== id));
  };

  const handleAddRequest = (newRequest) => {
    setRequests([...requests, newRequest]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <div className="bg-white shadow-md border-b-4 border-blue-500">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Activity className="w-10 h-10 text-blue-600" />
              <div>
                <h1 className="text-2xl font-bold text-gray-800">
                  Medical Equipment Allocation System
                </h1>
                <p className="text-sm text-gray-600">
                  Design & Analysis of Algorithms Project
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-xs text-gray-500">Algorithms</p>
                <p className="text-sm font-semibold text-blue-600">
                  Greedy + Knapsack
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="max-w-7xl mx-auto px-6 mt-6">
        <div className="flex space-x-2 bg-white rounded-lg shadow-sm p-1 overflow-x-auto">
          {[
            "dashboard",
            "equipment",
            "requests",
            "allocations",
            "compare",
            "algorithm",
          ].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-all whitespace-nowrap ${
                activeTab === tab
                  ? "bg-blue-500 text-white shadow-md"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-6">
        {activeTab === "dashboard" && (
          <Dashboard
            stats={stats}
            equipment={equipment}
            requests={requests}
            onRunAlgorithm={handleRunAlgorithm}
          />
        )}
        {activeTab === "equipment" && (
          <EquipmentList
            equipment={equipment}
            onAdd={handleAddEquipment}
            onUpdate={handleUpdateEquipment}
            onDelete={handleDeleteEquipment}
          />
        )}
        {activeTab === "requests" && (
          <RequestsList
            requests={requests}
            equipment={equipment}
            onAdd={handleAddRequest}
          />
        )}
        {activeTab === "allocations" && (
          <AllocationsList
            allocations={allocations}
            greedyResults={greedyResults}
            knapsackResults={knapsackResults}
          />
        )}
        {activeTab === "compare" && (
          <AlgorithmComparison
            requests={requests}
            equipment={equipment}
            onRunGreedy={handleRunGreedyComparison}
            onRunKnapsack={handleRunKnapsackComparison}
            onResultsUpdate={handleAlgorithmResults}
          />
        )}
        {activeTab === "algorithm" && (
          <AlgorithmVisualization
            algorithmSteps={algorithmSteps}
            greedyResults={greedyResults}
            knapsackResults={knapsackResults}
          />
        )}
      </div>
    </div>
  );
}

export default App;
