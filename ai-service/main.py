from fastapi import FastAPI
from pydantic import BaseModel
from sklearn.ensemble import IsolationForest
import numpy as np
import requests

app = FastAPI(title="AEGIS AI Service")


class MetricRequest(BaseModel):
    latency: float
    errorRate: float
    cpuUsage: float
    memoryUsage: float
    throughput: float


# Synthetic "normal" service behavior for the first MVP
normal_data = []

for _ in range(300):
    normal_data.append([
        np.random.uniform(100, 150),   # latency
        np.random.uniform(0.2, 1.2),   # error rate
        np.random.uniform(25, 50),     # CPU
        np.random.uniform(40, 60),     # memory
        np.random.uniform(700, 900)    # throughput
    ])

normal_data = np.array(normal_data)

model = IsolationForest(
    contamination=0.08,
    random_state=42
)

model.fit(normal_data)


@app.get("/health")
def health():
    return {
        "status": "UP",
        "service": "AEGIS AI Service"
    }


@app.post("/analyze")
def analyze(metric: MetricRequest):

    data = np.array([[
        metric.latency,
        metric.errorRate,
        metric.cpuUsage,
        metric.memoryUsage,
        metric.throughput
    ]])

    prediction = model.predict(data)[0]

    raw_score = model.decision_function(data)[0]

    anomaly = prediction == -1

    return {
        "anomaly": bool(anomaly),
        "rawScore": float(raw_score),
        "message": "Anomalous behavior detected"
        if anomaly
        else "Service behavior looks normal"
    }

@app.post("/root-cause")
def root_cause(metric: MetricRequest):

    prompt = f"""
You are an incident analysis assistant for AEGIS.

Analyze these service metrics:

Latency: {metric.latency} ms
Error Rate: {metric.errorRate} %
CPU Usage: {metric.cpuUsage} %
Memory Usage: {metric.memoryUsage} %
Throughput: {metric.throughput} requests/sec

Give:
1. Most likely root cause
2. Short explanation
3. 3 recommended actions

Keep the response concise and technical.
"""

    response = requests.post(
        "http://localhost:11434/api/generate",
        json={
            "model": "llama3.2:3b",
            "prompt": prompt,
            "stream": False
        }
    )

    result = response.json()

    return {
        "analysis": result["response"]
    }