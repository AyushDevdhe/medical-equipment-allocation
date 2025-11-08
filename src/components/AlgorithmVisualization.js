import React, { useState } from "react";
import { Activity, Zap, DollarSign } from "lucide-react";

const AlgorithmVisualization = ({
  algorithmSteps,
  greedyResults = null,
  knapsackResults = null,
}) => {
  const [activeTab, setActiveTab] = useState("greedy");

  const getCurrentSteps = () => {
    if (activeTab === "greedy") {
      return greedyResults?.steps || algorithmSteps || [];
    } else if (activeTab === "knapsack") {
      return knapsackResults?.steps || [];
    }
    return [];
  };

  const currentSteps = getCurrentSteps();

  console.log("🔍 AlgorithmVisualization Debug:", {
    activeTab,
    hasGreedyResults: !!greedyResults,
    hasKnapsackResults: !!knapsackResults,
    greedySteps: greedyResults?.steps?.length || 0,
    knapsackSteps: knapsackResults?.steps?.length || 0,
    currentStepsLength: currentSteps.length,
  });

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-md p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          Algorithm Implementation
        </h2>

        {/* Debug Info - Remove after testing */}
        <div className="mb-4 p-3 bg-gray-100 rounded-lg text-xs">
          <p className="font-semibold">Debug Information:</p>
          <div className="grid grid-cols-2 gap-2 mt-1">
            <div>
              <p>
                Greedy Results:{" "}
                <span
                  className={greedyResults ? "text-green-600" : "text-red-600"}
                >
                  {greedyResults ? "✅ Available" : "❌ Not Available"}
                </span>
              </p>
              <p>
                Greedy Steps:{" "}
                <span className="font-bold">
                  {greedyResults?.steps?.length || 0}
                </span>
              </p>
            </div>
            <div>
              <p>
                Knapsack Results:{" "}
                <span
                  className={
                    knapsackResults ? "text-green-600" : "text-red-600"
                  }
                >
                  {knapsackResults ? "✅ Available" : "❌ Not Available"}
                </span>
              </p>
              <p>
                Knapsack Steps:{" "}
                <span className="font-bold">
                  {knapsackResults?.steps?.length || 0}
                </span>
              </p>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex space-x-1 mb-6 bg-gray-100 p-1 rounded-lg">
          <button
            onClick={() => setActiveTab("greedy")}
            className={`flex items-center space-x-2 px-4 py-2 rounded-md flex-1 justify-center transition-colors ${
              activeTab === "greedy"
                ? "bg-white shadow-sm text-blue-600"
                : "text-gray-600 hover:text-gray-800"
            }`}
          >
            <Zap className="w-4 h-4" />
            <span>Greedy Algorithm</span>
            {greedyResults?.steps?.length > 0 && (
              <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                {greedyResults.steps.length} steps
              </span>
            )}
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
            <span>Knapsack Algorithm</span>
            {knapsackResults?.steps?.length > 0 && (
              <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                {knapsackResults.steps.length} steps
              </span>
            )}
          </button>
        </div>

        {/* Greedy Algorithm Content */}
        {activeTab === "greedy" && (
          <div>
            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6">
              <h3 className="font-bold text-lg text-blue-900 mb-2">
                Greedy Algorithm with Priority Queue
              </h3>
              <p className="text-sm text-blue-800">
                This system uses a greedy approach combined with a priority
                queue data structure to allocate medical equipment efficiently.
                Requests are sorted by priority level, and equipment is
                allocated to the highest priority requests first.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                <h4 className="font-bold text-purple-900 mb-2">
                  Time Complexity
                </h4>
                <p className="text-2xl font-bold text-purple-600">O(n log n)</p>
                <p className="text-xs text-purple-700 mt-1">
                  Dominated by sorting operation
                </p>
              </div>
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h4 className="font-bold text-green-900 mb-2">
                  Space Complexity
                </h4>
                <p className="text-2xl font-bold text-green-600">O(n)</p>
                <p className="text-xs text-green-700 mt-1">
                  Linear space for data structures
                </p>
              </div>
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                <h4 className="font-bold text-orange-900 mb-2">
                  Algorithm Type
                </h4>
                <p className="text-2xl font-bold text-orange-600">Greedy</p>
                <p className="text-xs text-orange-700 mt-1">
                  Locally optimal choices
                </p>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-bold text-gray-800 mb-3">Algorithm Steps:</h4>
              <ol className="space-y-2 text-sm">
                <li className="flex items-start space-x-2">
                  <span className="font-bold text-blue-600">1.</span>
                  <span>
                    Collect all pending equipment requests from the queue
                  </span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="font-bold text-blue-600">2.</span>
                  <span>
                    Sort requests by priority (1=Critical, 2=High, 3=Medium,
                    4=Low) - O(n log n)
                  </span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="font-bold text-blue-600">3.</span>
                  <span>
                    For each request in sorted order, check equipment
                    availability - O(n)
                  </span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="font-bold text-blue-600">4.</span>
                  <span>
                    If equipment available: allocate and update inventory - O(1)
                  </span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="font-bold text-blue-600">5.</span>
                  <span>
                    If not available: mark request as failed and continue
                  </span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="font-bold text-blue-600">6.</span>
                  <span>
                    Return allocation results and updated equipment status
                  </span>
                </li>
              </ol>
            </div>
          </div>
        )}

        {/* Knapsack Algorithm Content */}
        {activeTab === "knapsack" && (
          <div>
            <div className="bg-green-50 border-l-4 border-green-500 p-4 mb-6">
              <h3 className="font-bold text-lg text-green-900 mb-2">
                0/1 Knapsack Algorithm with Dynamic Programming
              </h3>
              <p className="text-sm text-green-800">
                This system uses dynamic programming to solve the knapsack
                problem for medical equipment allocation. It maximizes the total
                priority value of allocated requests while staying within the
                budget constraint.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                <h4 className="font-bold text-purple-900 mb-2">
                  Time Complexity
                </h4>
                <p className="text-2xl font-bold text-purple-600">O(n × W)</p>
                <p className="text-xs text-purple-700 mt-1">
                  n = requests, W = budget
                </p>
              </div>
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h4 className="font-bold text-green-900 mb-2">
                  Space Complexity
                </h4>
                <p className="text-2xl font-bold text-green-600">O(n × W)</p>
                <p className="text-xs text-green-700 mt-1">DP table size</p>
              </div>
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                <h4 className="font-bold text-orange-900 mb-2">
                  Algorithm Type
                </h4>
                <p className="text-2xl font-bold text-orange-600">
                  Dynamic Programming
                </p>
                <p className="text-xs text-orange-700 mt-1">Optimal solution</p>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-bold text-gray-800 mb-3">Algorithm Steps:</h4>
              <ol className="space-y-2 text-sm">
                <li className="flex items-start space-x-2">
                  <span className="font-bold text-green-600">1.</span>
                  <span>
                    Collect all pending equipment requests and available budget
                  </span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="font-bold text-green-600">2.</span>
                  <span>
                    Assign value weights based on priority (Critical=1000,
                    High=800, Medium=600, Low=400)
                  </span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="font-bold text-green-600">3.</span>
                  <span>
                    Create DP table with dimensions [n+1] × [budget+1] - O(n ×
                    W)
                  </span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="font-bold text-green-600">4.</span>
                  <span>
                    Fill DP table using recurrence relation: dp[i][w] =
                    max(dp[i-1][w], value[i] + dp[i-1][w - cost[i]])
                  </span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="font-bold text-green-600">5.</span>
                  <span>
                    Backtrack through DP table to find optimal set of requests
                    to allocate
                  </span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="font-bold text-green-600">6.</span>
                  <span>
                    Return allocations that maximize total value within budget
                  </span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="font-bold text-green-600">7.</span>
                  <span>
                    Update equipment inventory and calculate remaining budget
                  </span>
                </li>
              </ol>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mt-4">
              <h4 className="font-bold text-yellow-800 mb-2">
                Mathematical Formulation:
              </h4>
              <div className="text-sm text-yellow-800 space-y-2">
                <p>
                  <strong>Maximize:</strong> Σ(value[i] × x[i])
                </p>
                <p>
                  <strong>Subject to:</strong> Σ(cost[i] × x[i]) ≤ budget
                </p>
                <p>
                  <strong>Where:</strong> x[i] ∈ {(0, 1)} (allocate or not)
                </p>
                <p>
                  <strong>value[i]</strong> = priority-based weight
                </p>
                <p>
                  <strong>cost[i]</strong> = equipment cost × quantity
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {currentSteps.length > 0 ? (
        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4">
            Last Execution Trace -{" "}
            {activeTab === "greedy" ? "Greedy" : "Knapsack"} Algorithm
            <span className="text-sm font-normal text-gray-600 ml-2">
              ({currentSteps.length} steps)
            </span>
          </h3>
          <div className="space-y-3">
            {currentSteps.map((step, idx) => (
              <div
                key={idx}
                className={`p-4 rounded-lg border-l-4 ${
                  step.complexity === "Success"
                    ? "bg-green-50 border-green-500"
                    : step.complexity === "Failed"
                    ? "bg-red-50 border-red-500"
                    : activeTab === "greedy"
                    ? "bg-blue-50 border-blue-500"
                    : "bg-green-50 border-green-500"
                }`}
              >
                <div className="flex justify-between items-start mb-1">
                  <span className="font-bold text-gray-800">
                    Step {step.step}
                  </span>
                  <span className="text-xs text-gray-600">
                    {step.complexity}
                  </span>
                </div>
                <p className="text-sm text-gray-700">{step.description}</p>
                <p className="text-xs text-gray-600 mt-1">{step.data}</p>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4">
            Execution Trace
          </h3>
          <div className="text-center py-8 text-gray-500">
            <p>No execution trace available for {activeTab} algorithm.</p>
            <p className="text-sm mt-2">
              {activeTab === "greedy"
                ? "Run the Greedy algorithm from Dashboard or Compare tab to see execution steps."
                : "Run the Knapsack algorithm from Compare tab to see execution steps."}
            </p>
            <p className="text-xs mt-4 text-gray-400">
              Make sure you run "Compare Both Algorithms" and the algorithms
              complete successfully.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default AlgorithmVisualization;
