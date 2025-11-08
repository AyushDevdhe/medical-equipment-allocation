import React, { useState, useMemo, useCallback } from "react";
import {
  Zap,
  DollarSign,
  Award,
  AlertCircle,
  Clock,
  Users,
} from "lucide-react";

const AlgorithmComparison = ({
  requests = [],
  equipment = [],
  onRunGreedy,
  onRunKnapsack,
  onResultsUpdate,
}) => {
  const [budget, setBudget] = useState(5000);
  const [greedyResults, setGreedyResults] = useState(null);
  const [knapsackResults, setKnapsackResults] = useState(null);
  const [showResults, setShowResults] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [greedySteps, setGreedySteps] = useState([]);
  const [knapsackSteps, setKnapsackSteps] = useState([]);

  // Safe pending requests detection
  const pendingRequests = useMemo(() => {
    try {
      if (!Array.isArray(requests)) {
        console.warn("Requests is not an array:", requests);
        return [];
      }

      const pending = requests.filter((request) => {
        if (!request || typeof request !== "object") return false;

        const isPending =
          request.status === "pending" ||
          request.status === "Pending" ||
          request.status === "PENDING" ||
          !request.status ||
          request.allocated === false ||
          !request.allocated ||
          request.allocationTime === null ||
          !request.allocationTime;

        return isPending;
      });

      return pending;
    } catch (err) {
      console.error("Error detecting pending requests:", err);
      return [];
    }
  }, [requests]);

  // Safe equipment map
  const equipmentMap = useMemo(() => {
    try {
      if (!Array.isArray(equipment)) {
        console.warn("Equipment is not an array:", equipment);
        return {};
      }

      const map = {};
      equipment.forEach((eq) => {
        if (eq && eq.id) {
          map[eq.id] = {
            ...eq,
            available:
              eq.available !== undefined
                ? eq.available
                : eq.totalQuantity !== undefined && eq.inUse !== undefined
                ? eq.totalQuantity - eq.inUse
                : 0,
            costPerDay: eq.costPerDay || 0,
          };
        }
      });

      return map;
    } catch (err) {
      console.error("Error creating equipment map:", err);
      return {};
    }
  }, [equipment]);

  // Safe greedy algorithm with step tracking
  const runGreedyAlgorithm = useCallback(() => {
    try {
      const steps = [];
      steps.push(
        "Step 1: Sort requests by priority (Critical > High > Medium > Low)"
      );

      if (!Array.isArray(pendingRequests) || pendingRequests.length === 0) {
        steps.push("No pending requests found");
        setGreedySteps(steps); // Set steps immediately
        return {
          allocations: [],
          totalCost: 0,
          equipmentUsed: {},
          requestsProcessed: 0,
          efficiency: 0,
        };
      }

      // Priority weights for sorting
      const priorityWeights = {
        critical: 4,
        Critical: 4,
        CRITICAL: 4,
        high: 3,
        High: 3,
        HIGH: 3,
        medium: 2,
        Medium: 2,
        MEDIUM: 2,
        low: 1,
        Low: 1,
        LOW: 1,
      };

      // Sort by priority (highest first)
      const sortedRequests = [...pendingRequests].sort((a, b) => {
        const weightA = priorityWeights[a.priority] || 1;
        const weightB = priorityWeights[b.priority] || 1;
        return weightB - weightA;
      });

      steps.push(
        `Step 2: Found ${sortedRequests.length} pending requests, sorted by priority`
      );

      const allocations = [];
      let totalCost = 0;
      const equipmentUsed = {};
      const currentAvailability = { ...equipmentMap };

      let stepCounter = 3;
      for (const request of sortedRequests) {
        try {
          if (!request || !request.equipmentId) {
            continue;
          }

          const eq = currentAvailability[request.equipmentId];
          if (!eq) {
            continue;
          }

          const available = eq.available || 0;
          const requestedQty = request.quantity || 1;

          if (available >= requestedQty) {
            const allocationCost = (eq.costPerDay || 0) * requestedQty;
            const allocation = {
              requestId: request.id,
              equipmentId: request.equipmentId,
              quantity: requestedQty,
              cost: allocationCost,
              patient: request.patient || "Unknown",
              doctor: request.doctor || "Unknown",
              priority: request.priority || "low",
            };

            allocations.push(allocation);
            totalCost += allocationCost;

            currentAvailability[request.equipmentId].available =
              available - requestedQty;
            equipmentUsed[request.equipmentId] =
              (equipmentUsed[request.equipmentId] || 0) + requestedQty;

            steps.push(
              `Step ${stepCounter}: ✓ Allocated ${request.equipmentId} to ${request.patient} [${request.priority}] - Cost: $${allocationCost}`
            );
          } else {
            steps.push(
              `Step ${stepCounter}: ✗ Insufficient ${request.equipmentId} for ${request.patient} [${request.priority}]`
            );
          }
          stepCounter++;
        } catch (reqError) {
          console.error("Error processing request:", request, reqError);
        }
      }

      steps.push(
        `Completed: ${allocations.length} allocations made, Total Cost: $${totalCost}`
      );

      // Set steps in state
      setGreedySteps(steps);

      const result = {
        allocations,
        totalCost,
        equipmentUsed,
        requestsProcessed: sortedRequests.length,
        efficiency: allocations.length / Math.max(pendingRequests.length, 1),
      };

      return result;
    } catch (error) {
      console.error("❌ Greedy Algorithm Failed:", error);
      throw new Error(`Greedy algorithm error: ${error.message}`);
    }
  }, [pendingRequests, equipmentMap]);

  // Safe knapsack algorithm with step tracking
  const runKnapsackAlgorithm = useCallback(
    (budget) => {
      try {
        const steps = [];
        steps.push("Step 1: Initialize 0/1 Knapsack Dynamic Programming");
        steps.push(
          `Budget: $${budget} | Objective: Maximize value within budget constraint`
        );

        if (!Array.isArray(pendingRequests) || pendingRequests.length === 0) {
          steps.push("No pending requests found");
          setKnapsackSteps(steps); // Set steps immediately
          return {
            allocations: [],
            totalCost: 0,
            budgetRemaining: budget,
            equipmentUsed: {},
            requestsProcessed: 0,
          };
        }

        // Filter valid requests with available equipment
        const validRequests = pendingRequests.filter((req) => {
          if (!req || !req.equipmentId) return false;
          const eq = equipmentMap[req.equipmentId];
          if (!eq) return false;
          const available = eq.available || 0;
          const requestedQty = req.quantity || 1;
          return available >= requestedQty;
        });

        steps.push(
          `Step 2: Filtered to ${validRequests.length} valid requests with available equipment`
        );

        if (validRequests.length === 0) {
          steps.push("No valid requests with available equipment");
          setKnapsackSteps(steps); // Set steps immediately
          return {
            allocations: [],
            totalCost: 0,
            budgetRemaining: budget,
            equipmentUsed: {},
            requestsProcessed: 0,
          };
        }

        // Priority weights for value calculation
        const priorityWeights = {
          critical: 1000,
          Critical: 1000,
          CRITICAL: 1000,
          high: 800,
          High: 800,
          HIGH: 800,
          medium: 600,
          Medium: 600,
          MEDIUM: 600,
          low: 400,
          Low: 400,
          LOW: 400,
        };

        steps.push(
          "Step 3: Calculate value for each request based on priority:"
        );
        validRequests.forEach((req, index) => {
          const eq = equipmentMap[req.equipmentId];
          const cost = (eq.costPerDay || 0) * (req.quantity || 1);
          const priority = req.priority || "low";
          const value = priorityWeights[priority] || 400;
          steps.push(
            `   - ${req.equipmentId} for ${req.patient}: Cost=$${cost}, Value=${value} [${priority}]`
          );
        });

        // Prepare items for knapsack
        const items = validRequests.map((req, index) => {
          const eq = equipmentMap[req.equipmentId];
          const cost = (eq.costPerDay || 0) * (req.quantity || 1);
          const priority = req.priority || "low";
          const value = priorityWeights[priority] || 400;

          return {
            index,
            req,
            cost: Math.max(1, cost),
            value: Math.max(1, value),
            patient: req.patient || "Unknown",
            doctor: req.doctor || "Unknown",
            priority: req.priority || "low",
          };
        });

        steps.push(
          `Step 4: Build DP table (${items.length} items × $${budget} budget)`
        );
        steps.push("Step 5: Fill DP table using dynamic programming...");

        // Dynamic programming knapsack
        const n = items.length;
        const dp = Array(n + 1)
          .fill()
          .map(() => Array(budget + 1).fill(0));
        const keep = Array(n + 1)
          .fill()
          .map(() => Array(budget + 1).fill(false));

        for (let i = 1; i <= n; i++) {
          for (let w = 0; w <= budget; w++) {
            const item = items[i - 1];
            if (item.cost <= w) {
              const includeVal = dp[i - 1][w - item.cost] + item.value;
              if (includeVal > dp[i - 1][w]) {
                dp[i][w] = includeVal;
                keep[i][w] = true;
              } else {
                dp[i][w] = dp[i - 1][w];
              }
            } else {
              dp[i][w] = dp[i - 1][w];
            }
          }
        }

        steps.push(
          `Step 6: DP computation complete - Max value achieved: ${dp[n][budget]}`
        );

        // Backtrack to find selected items
        const allocations = [];
        let remainingBudget = budget;
        let w = budget;

        steps.push("Step 7: Backtrack to find optimal allocations:");

        let allocationStep = 8;
        for (let i = n; i > 0; i--) {
          if (keep[i][w]) {
            const item = items[i - 1];
            const allocation = {
              requestId: item.req.id,
              equipmentId: item.req.equipmentId,
              quantity: item.req.quantity || 1,
              cost: item.cost,
              patient: item.req.patient || "Unknown",
              doctor: item.req.doctor || "Unknown",
              priority: item.req.priority || "low",
            };
            allocations.push(allocation);
            w -= item.cost;
            remainingBudget -= item.cost;

            steps.push(
              `Step ${allocationStep}: ✓ Selected ${item.req.equipmentId} for ${item.req.patient} [${item.req.priority}] - Cost: $${item.cost}, Remaining: $${remainingBudget}`
            );
            allocationStep++;
          }
        }

        steps.push(`Step ${allocationStep}: Algorithm completed`);
        steps.push(
          `Results: ${allocations.length} allocations, Total Cost: $${
            budget - remainingBudget
          }, Budget Remaining: $${remainingBudget}`
        );

        // Set steps in state
        setKnapsackSteps(steps);

        const result = {
          allocations,
          totalCost: budget - remainingBudget,
          budgetRemaining: remainingBudget,
          equipmentUsed: allocations.reduce((acc, alloc) => {
            acc[alloc.equipmentId] =
              (acc[alloc.equipmentId] || 0) + alloc.quantity;
            return acc;
          }, {}),
          requestsProcessed: validRequests.length,
        };

        return result;
      } catch (error) {
        console.error("❌ Knapsack Algorithm Failed:", error);
        throw new Error(`Knapsack algorithm error: ${error.message}`);
      }
    },
    [pendingRequests, equipmentMap]
  );

  const handleRunBoth = async () => {
    console.log("🔄 Starting algorithm comparison...");
    setError(null);
    setIsLoading(true);
    setShowResults(false);

    // Reset steps and results
    setGreedySteps([]);
    setKnapsackSteps([]);
    setGreedyResults(null);
    setKnapsackResults(null);

    try {
      if (!Array.isArray(requests)) {
        throw new Error("Requests data is invalid");
      }

      if (!Array.isArray(equipment)) {
        throw new Error("Equipment data is invalid");
      }

      if (pendingRequests.length === 0) {
        throw new Error(
          `No pending requests found. Total requests: ${requests.length}`
        );
      }

      console.log("Running Greedy Algorithm...");
      const greedyResult = runGreedyAlgorithm();
      setGreedyResults(greedyResult);

      console.log("Running Knapsack Algorithm...");
      const knapsackResult = runKnapsackAlgorithm(budget);
      setKnapsackResults(knapsackResult);

      setShowResults(true);

      if (onResultsUpdate) {
        onResultsUpdate(greedyResult, knapsackResult);
      }

      console.log("✅ Algorithm comparison completed successfully");
      console.log("Greedy steps count:", greedySteps.length);
      console.log("Knapsack steps count:", knapsackSteps.length);
    } catch (err) {
      console.error("💥 Algorithm comparison failed:", err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const calculateEfficiency = (allocations, totalRequests) => {
    return ((allocations.length / Math.max(totalRequests, 1)) * 100).toFixed(1);
  };

  const determineWinner = () => {
    if (!greedyResults || !knapsackResults) return null;

    const greedyScore = greedyResults.allocations.length;
    const knapsackScore = knapsackResults.allocations.length;

    if (greedyScore > knapsackScore) {
      return { winner: "greedy", reason: "More allocations made" };
    } else if (knapsackScore > greedyScore) {
      return { winner: "knapsack", reason: "More allocations within budget" };
    } else {
      return { winner: "tie", reason: "Equal number of allocations" };
    }
  };

  const winner = determineWinner();

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-md p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          Algorithm Comparison
        </h2>

        {/* Debug Information */}
        <div className="mb-4 p-4 bg-gray-100 rounded-lg">
          <h3 className="font-semibold text-gray-700 mb-2">System Status:</h3>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div>
              Total Requests: <strong>{requests.length}</strong>
            </div>
            <div>
              Pending Requests: <strong>{pendingRequests.length}</strong>
            </div>
            <div>
              Equipment Items: <strong>{equipment.length}</strong>
            </div>
            <div>
              Budget: <strong>${budget}</strong>
            </div>
          </div>
        </div>

        {/* Statistics Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-blue-50 rounded-lg p-4">
            <div className="flex items-center space-x-2">
              <Users className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-medium text-blue-900">
                Pending Requests
              </span>
            </div>
            <p className="text-2xl font-bold text-blue-600 mt-1">
              {pendingRequests.length}
            </p>
          </div>

          <div className="bg-green-50 rounded-lg p-4">
            <div className="flex items-center space-x-2">
              <DollarSign className="w-4 h-4 text-green-600" />
              <span className="text-sm font-medium text-green-900">
                Available Equipment
              </span>
            </div>
            <p className="text-2xl font-bold text-green-600 mt-1">
              {equipment.filter((eq) => (eq.available || 0) > 0).length}
            </p>
          </div>

          <div className="bg-purple-50 rounded-lg p-4">
            <div className="flex items-center space-x-2">
              <Clock className="w-4 h-4 text-purple-600" />
              <span className="text-sm font-medium text-purple-900">
                Budget
              </span>
            </div>
            <p className="text-2xl font-bold text-purple-600 mt-1">${budget}</p>
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Set Budget ($)
          </label>
          <input
            type="number"
            value={budget}
            onChange={(e) =>
              setBudget(Math.max(0, parseInt(e.target.value) || 0))
            }
            className="w-64 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            min="0"
            step="100"
          />
        </div>

        <button
          onClick={handleRunBoth}
          disabled={isLoading || pendingRequests.length === 0}
          className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-semibold transition-colors ${
            isLoading || pendingRequests.length === 0
              ? "bg-gray-400 text-gray-200 cursor-not-allowed"
              : "bg-purple-500 text-white hover:bg-purple-600"
          }`}
        >
          <Zap className="w-5 h-5" />
          <span>
            {isLoading
              ? "Running Algorithms..."
              : pendingRequests.length === 0
              ? "No Pending Requests"
              : "Compare Both Algorithms"}
          </span>
        </button>

        {error && (
          <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center space-x-2 text-red-700">
              <AlertCircle className="w-5 h-5" />
              <span className="font-semibold">Error: {error}</span>
            </div>
          </div>
        )}
      </div>

      {showResults && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Greedy Algorithm Results */}
            <div className="bg-blue-50 border-2 border-blue-300 rounded-xl p-6">
              <div className="flex items-center space-x-2 mb-4">
                <Zap className="w-6 h-6 text-blue-600" />
                <h3 className="text-xl font-bold text-blue-900">
                  Greedy Algorithm
                </h3>
              </div>

              {greedyResults && (
                <>
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <div className="bg-white rounded-lg p-3">
                      <p className="text-sm text-gray-600">Allocations Made</p>
                      <p className="text-2xl font-bold text-blue-600">
                        {greedyResults.allocations.length}
                      </p>
                    </div>
                    <div className="bg-white rounded-lg p-3">
                      <p className="text-sm text-gray-600">Total Cost</p>
                      <p className="text-2xl font-bold text-blue-600">
                        ${greedyResults.totalCost}
                      </p>
                    </div>
                    <div className="bg-white rounded-lg p-3">
                      <p className="text-sm text-gray-600">Efficiency</p>
                      <p className="text-xl font-bold text-blue-600">
                        {calculateEfficiency(
                          greedyResults.allocations,
                          greedyResults.requestsProcessed
                        )}
                        %
                      </p>
                    </div>
                    <div className="bg-white rounded-lg p-3">
                      <p className="text-sm text-gray-600">Complexity</p>
                      <p className="text-lg font-bold text-blue-600">
                        O(n log n)
                      </p>
                    </div>
                  </div>

                  {/* Greedy Execution Steps */}
                  <div className="mt-4">
                    <h4 className="font-semibold text-blue-800 mb-2">
                      Execution Trace ({greedySteps.length} steps)
                    </h4>
                    <div className="bg-white rounded-lg p-4 max-h-60 overflow-y-auto">
                      {greedySteps.length > 0 ? (
                        greedySteps.map((step, index) => (
                          <div
                            key={index}
                            className="text-xs text-gray-700 mb-1 font-mono leading-relaxed"
                          >
                            {step}
                          </div>
                        ))
                      ) : (
                        <div className="text-sm text-gray-500 italic">
                          No execution steps available
                        </div>
                      )}
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Knapsack Algorithm Results */}
            <div className="bg-green-50 border-2 border-green-300 rounded-xl p-6">
              <div className="flex items-center space-x-2 mb-4">
                <DollarSign className="w-6 h-6 text-green-600" />
                <h3 className="text-xl font-bold text-green-900">
                  Knapsack Algorithm
                </h3>
              </div>

              {knapsackResults && (
                <>
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <div className="bg-white rounded-lg p-3">
                      <p className="text-sm text-gray-600">Allocations Made</p>
                      <p className="text-2xl font-bold text-green-600">
                        {knapsackResults.allocations.length}
                      </p>
                    </div>
                    <div className="bg-white rounded-lg p-3">
                      <p className="text-sm text-gray-600">Total Cost</p>
                      <p className="text-2xl font-bold text-green-600">
                        ${knapsackResults.totalCost}
                      </p>
                    </div>
                    <div className="bg-white rounded-lg p-3">
                      <p className="text-sm text-gray-600">Budget Left</p>
                      <p className="text-2xl font-bold text-green-600">
                        ${knapsackResults.budgetRemaining}
                      </p>
                    </div>
                    <div className="bg-white rounded-lg p-3">
                      <p className="text-sm text-gray-600">Complexity</p>
                      <p className="text-lg font-bold text-green-600">
                        O(n × W)
                      </p>
                    </div>
                  </div>

                  {/* Knapsack Execution Steps */}
                  <div className="mt-4">
                    <h4 className="font-semibold text-green-800 mb-2">
                      Execution Trace ({knapsackSteps.length} steps)
                    </h4>
                    <div className="bg-white rounded-lg p-4 max-h-60 overflow-y-auto">
                      {knapsackSteps.length > 0 ? (
                        knapsackSteps.map((step, index) => (
                          <div
                            key={index}
                            className="text-xs text-gray-700 mb-1 font-mono leading-relaxed"
                          >
                            {step}
                          </div>
                        ))
                      ) : (
                        <div className="text-sm text-gray-500 italic">
                          No execution steps available
                        </div>
                      )}
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Winner Analysis */}
          {winner && greedyResults && knapsackResults && (
            <div className="bg-yellow-50 border-2 border-yellow-400 rounded-xl p-6">
              <div className="flex items-center space-x-3 mb-4">
                <Award className="w-8 h-8 text-yellow-600" />
                <h3 className="text-2xl font-bold text-yellow-800">
                  Winner Analysis
                </h3>
              </div>

              <div className="bg-white rounded-lg p-4">
                <div
                  className={`text-lg font-bold mb-3 ${
                    winner.winner === "greedy"
                      ? "text-blue-600"
                      : winner.winner === "knapsack"
                      ? "text-green-600"
                      : "text-gray-600"
                  }`}
                >
                  {winner.winner === "tie"
                    ? "It's a Tie!"
                    : `Winner: ${winner.winner.toUpperCase()} Algorithm`}
                </div>

                <ul className="space-y-2 text-sm text-gray-700">
                  <li className="flex items-start space-x-2">
                    <span>•</span>
                    <span>
                      <strong>Greedy:</strong> Allocated{" "}
                      {greedyResults.allocations.length} requests (Cost: $
                      {greedyResults.totalCost})
                    </span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span>•</span>
                    <span>
                      <strong>Knapsack:</strong> Allocated{" "}
                      {knapsackResults.allocations.length} requests within $
                      {budget} budget (Remaining: $
                      {knapsackResults.budgetRemaining})
                    </span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span>•</span>
                    <span>
                      <strong>Reason:</strong> {winner.reason}
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default AlgorithmComparison;
