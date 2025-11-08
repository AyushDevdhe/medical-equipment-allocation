// Greedy Algorithm for Equipment Allocation
// Time Complexity: O(n log n) - dominated by sorting
// Space Complexity: O(n) - for storing results

export const greedyAllocation = (requests, equipment) => {
  const steps = [];

  // Step 1: Filter pending requests and sort by priority (Greedy approach)
  const pendingRequests = requests
    .filter((r) => r.status === "Pending")
    .sort((a, b) => {
      // Priority: 1 = Critical, 2 = High, 3 = Medium, 4 = Low
      // We want Critical (1) first, then High (2), then Medium (3), then Low (4)
      if (a.priority !== b.priority) return a.priority - b.priority;
      return a.timestamp - b.timestamp; // FIFO for same priority
    });

  steps.push({
    step: 1,
    description: "Sort requests by priority (Critical > High > Medium > Low)",
    data: `Found ${pendingRequests.length} pending requests, sorted by priority`,
    complexity: "O(n log n) - Sorting operation",
  });

  // Debug: Log the sorted order
  console.log("📊 Sorted requests by priority:");
  pendingRequests.forEach((req, index) => {
    console.log(
      `  ${index + 1}. Request #${req.id} - ${req.patient} - Priority: ${
        req.priority
      }`
    );
  });

  const allocations = [];
  const updatedEquipment = [...equipment];
  const updatedRequests = [...requests];

  // Step 2: Process each request in priority order
  pendingRequests.forEach((request, index) => {
    // Find equipment by ID if specified, otherwise by type
    const eq = request.equipmentId
      ? updatedEquipment.find((e) => e.id === request.equipmentId)
      : updatedEquipment.find((e) => e.type === request.equipmentType);

    steps.push({
      step: index + 2,
      description: `Process request #${request.id} - ${
        request.equipmentName || request.equipmentType
      }`,
      data: `Priority: ${getPriorityLabel(request.priority)}, Patient: ${
        request.patient
      }`,
      complexity: "O(1) - Constant time check",
    });

    // Check if equipment is available
    if (eq && eq.available >= request.quantity) {
      // Allocate equipment
      eq.available -= request.quantity;

      const allocation = {
        id: Date.now() + index,
        requestId: request.id,
        equipmentId: eq.id,
        equipmentName: eq.name,
        equipmentType: eq.type,
        doctor: request.doctor,
        patient: request.patient,
        priority: request.priority,
        priorityLabel: getPriorityLabel(request.priority),
        quantity: request.quantity,
        cost: (eq.costPerDay || 0) * request.quantity,
        allocatedAt: new Date().toLocaleString(),
        status: "Allocated",
      };

      allocations.push(allocation);

      const reqIndex = updatedRequests.findIndex((r) => r.id === request.id);
      updatedRequests[reqIndex].status = "Allocated";

      steps.push({
        step: index + 2.5,
        description: `✅ Successfully allocated ${eq.name} to ${request.patient}`,
        data: `Priority: ${getPriorityLabel(request.priority)}, Cost: $${
          allocation.cost
        }, Remaining: ${eq.available}/${eq.total}`,
        complexity: "Success",
      });
    } else {
      steps.push({
        step: index + 2.5,
        description: `❌ Allocation failed for ${request.patient}`,
        data: eq
          ? `Available: ${eq.available}, Needed: ${request.quantity}`
          : "Equipment not found",
        complexity: "Failed",
      });
    }
  });

  steps.push({
    step: steps.length + 1,
    description: "Algorithm Complete",
    data: `Successfully allocated ${allocations.length} out of ${pendingRequests.length} requests`,
    complexity: `Overall Time Complexity: O(n log n)`,
  });

  return {
    allocations,
    updatedEquipment,
    updatedRequests,
    steps,
  };
};

// Helper function to convert priority number to label
function getPriorityLabel(priority) {
  const priorityMap = {
    1: "Critical",
    2: "High",
    3: "Medium",
    4: "Low",
  };
  return priorityMap[priority] || `Unknown (${priority})`;
}
