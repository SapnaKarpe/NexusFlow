const { from } = require("rxjs");
const { map, reduce } = require("rxjs/operators");

const executeRule = (nodes, edges, telemetry) => {
  return from(nodes).pipe(
    map((node) => {
      const result = {
        nodeId: node.id,
        nodeType: node.type,
        status: "processed",
      };

      if (node.type === "dataSource") {
        result.sensorId = telemetry.sensorId;
        result.temperature = telemetry.temperature;
        result.pressure = telemetry.pressure;
      }

      if (node.type === "math") {
        result.inputTemperature = telemetry.temperature;
        result.calculatedValue = Number(telemetry.temperature);
      }

      if (node.type === "action") {
        result.action = "SMS Alert";
        result.triggered = telemetry.temperature >= 90;
      }

      return result;
    }),

    reduce(
      (results, nodeResult) => {
        results.push(nodeResult);
        return results;
      },
      []
    ),

    map((results) => ({
      status: "success",
      message: "Rule executed successfully",
      nodeCount: nodes.length,
      edgeCount: edges.length,
      telemetry,
      results,
      executedAt: new Date(),
    }))
  );
};

module.exports = {
  executeRule,
};