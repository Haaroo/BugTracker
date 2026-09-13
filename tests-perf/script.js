import http from "k6/http";
import { sleep, check } from "k6";
import { htmlReport } from "https://raw.githubusercontent.com/benc-uk/k6-reporter/main/dist/bundle.js";
import { textSummary } from "https://jslib.k6.io/k6-summary/0.0.1/index.js";

const BASE_URL = __ENV.BASE_URL || "http://localhost:8080";

export const options = {
  scenarios: {
    steady_load: {
      executor: "constant-vus",
      vus: 5,
      duration: "30s",
    },
  },
  thresholds: {
    http_req_failed: ["rate<0.01"], // fewer than 1% of requests should fail
    http_req_duration: ["p(95)<500"], // 95% of requests should complete under 500ms
  },
};

export default function () {
  const healthRes = http.get(`${BASE_URL}/api/health`);
  check(healthRes, { "health check status is 200": (r) => r.status === 200 });

  const payload = JSON.stringify({
    title: `Load test bug ${Date.now()}-${__VU}`,
    description: "Created by the k6 performance suite",
    priority: "Medium",
  });

  const createRes = http.post(`${BASE_URL}/api/bugs`, payload, {
    headers: { "Content-Type": "application/json" },
  });
  const created = check(createRes, {
    "create bug status is 201": (r) => r.status === 201,
    "bug has an id": (r) => JSON.parse(r.body).id !== undefined,
  });

  if (created) {
    const bugId = JSON.parse(createRes.body).id;

    const listRes = http.get(`${BASE_URL}/api/bugs`);
    check(listRes, { "list bugs status is 200": (r) => r.status === 200 });

    const commentRes = http.post(
      `${BASE_URL}/api/bugs/${bugId}/comments`,
      JSON.stringify({ author: "k6", content: "Automated load-test comment" }),
      { headers: { "Content-Type": "application/json" } }
    );
    check(commentRes, { "add comment status is 201": (r) => r.status === 201 });

    const deleteRes = http.del(`${BASE_URL}/api/bugs/${bugId}`);
    check(deleteRes, { "delete bug status is 204": (r) => r.status === 204 });
  }

  sleep(1);
}

export function handleSummary(data) {
  return {
    "perf-results.html": htmlReport(data),
    stdout: textSummary(data, { indent: " ", enableColors: true }),
  };
}
