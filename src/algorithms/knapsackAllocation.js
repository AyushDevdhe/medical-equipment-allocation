// 0/1 Knapsack Algorithm for Equipment Allocation with Budget Constraint
// Time Complexity: O(n × W) where n = number of requests, W = budget
// Space Complexity: O(n × W) - for DP table

export const knapsackAllocation = (requests, equipment, budget) => {
  const steps = [];
  
  const pendingRequests = requests.filter((r) => r.status === "Pending");

  steps.push({
    step: 1,
    description: "Initialize Knapsack Algorithm",
    data: `Found ${pendingRequests.length} pending requests, Budget: $${budget}`,
    complexity: "O(1) - Initialization",
  });

  const items = pendingRequests
    .map((req) => {
      const eq = equipment.find(
        (e) => e.id === req.equipmentId || e.type === req.equipmentType
      );
      const cost = eq ? eq.costPerDay * req.quantity : 0;
      const value = (5 - req.priority) * 10; 

      return {
        request: req,
        equipment: eq,
        cost: cost,
        value: value,
        ratio: cost > 0 ? value / cost : 0,
      };
    })
    .filter((item) => item.equipment && item.cost <= budget);

  steps.push({
    step: 2,
    description: "Calculate value and cost for each request",
    data: `Processing ${items.length} affordable requests`,
    complexity: "O(n) - Linear scan",
  });

  const n = items.length;
  if (n === 0) {
    steps.push({
      step: 3,
      description: "❌ No affordable requests within budget",
      data: `Budget: $${budget} insufficient`,
      complexity: "Complete",
    });
    return {
      allocations: [],
      updatedEquipment: equipment,
      updatedRequests: requests,
      steps,
      totalCost: 0,
      totalValue: 0,
    };
  }

  const dp = Array(n + 1)
    .fill(null)
    .map(() => Array(budget + 1).fill(0));

  steps.push({
    step: 3,
    description: "Build Dynamic Programming table",
    data: `Table size: ${n + 1} × ${budget + 1}`,
    complexity: "O(n × W) - DP table construction",
  });

  for (let i = 1; i <= n; i++) {
    for (let w = 0; w <= budget; w++) {
      const cost = items[i - 1].cost;
      const value = items[i - 1].value;

      if (cost <= w) {
        dp[i][w] = Math.max(dp[i - 1][w], dp[i - 1][w - cost] + value);
      } else {
        dp[i][w] = dp[i - 1][w];
      }
    }
  }

  steps.push({
    step: 4,
    description: "DP table filled - finding optimal solution",
    data: `Maximum value achievable: ${dp[n][budget]}`,
    complexity: "O(n × W) - Filling table",
  });

  const selected = [];
  let w = budget;
  for (let i = n; i > 0; i--) {
    if (dp[i][w] !== dp[i - 1][w]) {
      selected.push(items[i - 1]);
      w -= items[i - 1].cost;
    }
  }

  steps.push({
    step: 5,
    description: "Backtrack to find selected requests",
    data: `Selected ${selected.length} requests`,
    complexity: "O(n) - Backtracking",
  });

  const allocations = [];
  const updatedEquipment = [...equipment];
  const updatedRequests = [...requests];
  let totalCost = 0;
  let totalValue = 0;

  selected.forEach((item, index) => {
    const eq = updatedEquipment.find((e) => e.id === item.equipment.id);

    if (eq && eq.available >= item.request.quantity) {
      eq.available -= item.request.quantity;

      const allocation = {
        id: Date.now() + index,
        requestId: item.request.id,
        equipmentId: eq.id,
        equipmentName: eq.name,
        equipmentType: eq.type,
        doctor: item.request.doctor,
        patient: item.request.patient,
        priority: item.request.priority,
        quantity: item.request.quantity,
        cost: item.cost,
        value: item.value,
        allocatedAt: new Date().toLocaleString(),
        status: "Allocated",
        algorithm: "Knapsack",
      };

      allocations.push(allocation);
      totalCost += item.cost;
      totalValue += item.value;

      const reqIndex = updatedRequests.findIndex(
        (r) => r.id === item.request.id
      );
      updatedRequests[reqIndex].status = "Allocated";

      steps.push({
        step: 5.5 + index * 0.1,
        description: `✅ Allocated ${eq.name} to ${item.request.patient}`,
        data: `Cost: $${item.cost}, Value: ${item.value}, Priority: ${item.request.priority}`,
        complexity: "Success",
      });
    }
  });

  steps.push({
    step: 6,
    description: "Knapsack Algorithm Complete",
    data: `Allocated ${
      allocations.length
    } requests | Total Cost: $${totalCost} | Total Value: ${totalValue} | Budget Remaining: $${
      budget - totalCost
    }`,
    complexity: `Overall Time Complexity: O(n × W) = O(${n} × ${budget})`,
  });

  return {
    allocations,
    updatedEquipment,
    updatedRequests,
    steps,
    totalCost,
    totalValue,
    budgetRemaining: budget - totalCost,
  };
};
