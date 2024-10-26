import { createClient } from "redis";
import jest from "jest";
import { dirname } from "node:path"; // Use node: prefix for built-in modules
import { fileURLToPath } from "node:url";
import "dotenv/config";

// Manual definition of __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const redisHost = process.env.REDIS_HOST || "localhost";
const nextAppUrl = process.env.NEXT_PUBLIC_URL || "http://localhost:3001";

const redisClient = createClient({
  url: `redis://${redisHost}:6379`,
});

await redisClient.connect();

redisClient.on("error", (err) => {
  console.log("Redis error: ", err);
});

const queueName = "submissions";

async function runTests(id, challengeName) {
  try {
    const jestConfig = {
      projects: [__dirname],
      silent: false,
    };

    //TODO: also check if the test is available or not so the worker doesn't crash
    const filePath = `./tests/${challengeName}.test.js`;

    const { results } = await jest.runCLI({ ...jestConfig, _: [filePath] }, [
      __dirname,
    ]);
    const executionTime = results.testResults
      .reduce((a, c) => {
        return a + (c.perfStats.end - c.perfStats.start);
      }, 0)
      .toString();

    if (results.success) {
      let perTestResults = [];
      results.testResults[0].testResults.forEach(
        ({ title, status, duration }) => {
          perTestResults.push({ title, status, duration });
        },
      );
      fetch(`${nextAppUrl}/api/submission`, {
        method: "POST",
        body: JSON.stringify({
          values: { id, executionTime, status: "done", perTestResults },
        }),
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer J6o3GGPtq1Jf3Ai6k/RcNUUyqJiPVvq6Qq6SBPnJ8l4=`,
        },
      });
    } else {
      console.log(
        `Tests failed. Number of failed tests: ${results.numFailedTests}`,
      );
      let perTestResults = [];
      results.testResults[0].testResults.forEach(
        ({ title, status, duration }) => {
          perTestResults.push({ title, status, duration });
        },
      );
      console.log("_______________________________");
      console.log({ perTestResults });

      fetch(`${nextAppUrl}/api/submission`, {
        method: "POST",
        body: JSON.stringify({
          values: { id, executionTime, status: "failed", perTestResults },
        }),
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer J6o3GGPtq1Jf3Ai6k/RcNUUyqJiPVvq6Qq6SBPnJ8l4=`,
        },
      });
    }
  } catch (error) {
    console.log(`Error running tests: ${error.message}`);

    const status = "failed";

    fetch(`${nextAppUrl}/api/submission`, {
      method: "POST",
      body: JSON.stringify({ values: { id, executionTime: "-1", status } }),
    });
  }
}

async function pullFromQueue() {
  for (;;) {
    try {
      const data = await redisClient.brPop(queueName, 0);
      if (data) {
        const item = data.element;
        console.log(`Worker ${process.pid} received item from queue:`, item);

        const { id, backendUrl, websocketUrl, challengeName } =
          JSON.parse(item);
        globalThis.backendUrl = backendUrl;
        globalThis.websocketUrl = websocketUrl;
        await runTests(id, challengeName);
      }
    } catch (err) {
      console.error("Error pulling from queue:", err);
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
  }
}

pullFromQueue();
