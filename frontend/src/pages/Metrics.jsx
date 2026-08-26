import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import "./Metrics.css";
import { API_BASE_URL } from "../api";

function Metrics() {
  const navigate = useNavigate();

  const [metrics, setMetrics] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadMetrics = async () => {
      try {
        const response = await fetch(
          `${API_BASE_URL}/api/metrics/service/1`
        );

        const data = await response.json();

        setMetrics(data);
      } catch (error) {
        console.error("Failed to load metrics:", error);
      } finally {
        setLoading(false);
      }
    };

    loadMetrics();
  }, []);

  const chartData = useMemo(() => {
    return metrics
      .slice()
      .reverse()
      .map((metric) => ({
        ...metric,
        time: metric.recordedAt
          ? new Date(metric.recordedAt).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })
          : "",
      }));
  }, [metrics]);

  const latestMetric = metrics[0];

  if (loading) {
    return (
      <div className="metrics-page">
        <div className="metrics-content">
          <p>Loading metrics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="metrics-page">

      <aside className="metrics-sidebar">
        <div className="sidebar-brand">
          <div className="sidebar-brand-icon">A</div>

          <div>
            <strong>AEGIS</strong>
            <span>Incident Intelligence</span>
          </div>
        </div>

        <nav className="metrics-nav">
          <button onClick={() => navigate("/dashboard")}>
            Overview
          </button>

          <button onClick={() => navigate("/services")}>
            Services
          </button>

          <button onClick={() => navigate("/incidents")}>
            Incidents
          </button>

          <button className="active">
            Metrics
          </button>

          <button onClick={() => navigate("/ai")}>
            AI Insights
          </button>
        </nav>
      </aside>

      <main className="metrics-content">

        <div className="metrics-header">
          <div>
            <span className="section-label">
              SERVICE TELEMETRY
            </span>

            <h1>Metrics</h1>

            <p>
              Visualize live service performance and historical telemetry.
            </p>
          </div>

          <div className="metrics-status">
            {metrics.length} samples
          </div>
        </div>

        <div className="metrics-summary-grid">

          <div className="metric-summary-card">
            <span>Latency</span>
            <strong>
              {latestMetric
                ? `${latestMetric.latency?.toFixed?.(0) ?? latestMetric.latency} ms`
                : "--"}
            </strong>
            <small>Latest value</small>
          </div>

          <div className="metric-summary-card">
            <span>Error Rate</span>
            <strong>
              {latestMetric
                ? `${latestMetric.errorRate?.toFixed?.(1) ?? latestMetric.errorRate}%`
                : "--"}
            </strong>
            <small>Latest value</small>
          </div>

          <div className="metric-summary-card">
            <span>CPU Usage</span>
            <strong>
              {latestMetric
                ? `${latestMetric.cpuUsage?.toFixed?.(1) ?? latestMetric.cpuUsage}%`
                : "--"}
            </strong>
            <small>Latest value</small>
          </div>

          <div className="metric-summary-card">
            <span>Memory Usage</span>
            <strong>
              {latestMetric
                ? `${latestMetric.memoryUsage?.toFixed?.(1) ?? latestMetric.memoryUsage}%`
                : "--"}
            </strong>
            <small>Latest value</small>
          </div>

        </div>

        <div className="charts-grid">

          <section className="chart-card">
            <div className="chart-heading">
              <span>LATENCY</span>
              <h2>Response Time</h2>
            </div>

            <div className="chart-wrapper">
              <ResponsiveContainer width="100%" height={260}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#182235" />

                  <XAxis
                    dataKey="time"
                    stroke="#67738a"
                    tick={{ fontSize: 11 }}
                  />

                  <YAxis
                    stroke="#67738a"
                    tick={{ fontSize: 11 }}
                  />

                  <Tooltip
                    contentStyle={{
                      background: "#0d1424",
                      border: "1px solid #253049",
                      borderRadius: "10px",
                    }}
                  />

                  <Line
                    type="monotone"
                    dataKey="latency"
                    stroke="#8b7cff"
                    strokeWidth={2}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </section>

          <section className="chart-card">
            <div className="chart-heading">
              <span>ERROR RATE</span>
              <h2>Request Failures</h2>
            </div>

            <div className="chart-wrapper">
              <ResponsiveContainer width="100%" height={260}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#182235" />

                  <XAxis
                    dataKey="time"
                    stroke="#67738a"
                    tick={{ fontSize: 11 }}
                  />

                  <YAxis
                    stroke="#67738a"
                    tick={{ fontSize: 11 }}
                  />

                  <Tooltip
                    contentStyle={{
                      background: "#0d1424",
                      border: "1px solid #253049",
                      borderRadius: "10px",
                    }}
                  />

                  <Line
                    type="monotone"
                    dataKey="errorRate"
                    stroke="#ff9c47"
                    strokeWidth={2}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </section>

          <section className="chart-card">
            <div className="chart-heading">
              <span>CPU</span>
              <h2>CPU Utilization</h2>
            </div>

            <div className="chart-wrapper">
              <ResponsiveContainer width="100%" height={260}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#182235" />

                  <XAxis
                    dataKey="time"
                    stroke="#67738a"
                    tick={{ fontSize: 11 }}
                  />

                  <YAxis
                    stroke="#67738a"
                    tick={{ fontSize: 11 }}
                  />

                  <Tooltip
                    contentStyle={{
                      background: "#0d1424",
                      border: "1px solid #253049",
                      borderRadius: "10px",
                    }}
                  />

                  <Line
                    type="monotone"
                    dataKey="cpuUsage"
                    stroke="#57e6a5"
                    strokeWidth={2}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </section>

          <section className="chart-card">
            <div className="chart-heading">
              <span>MEMORY</span>
              <h2>Memory Utilization</h2>
            </div>

            <div className="chart-wrapper">
              <ResponsiveContainer width="100%" height={260}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#182235" />

                  <XAxis
                    dataKey="time"
                    stroke="#67738a"
                    tick={{ fontSize: 11 }}
                  />

                  <YAxis
                    stroke="#67738a"
                    tick={{ fontSize: 11 }}
                  />

                  <Tooltip
                    contentStyle={{
                      background: "#0d1424",
                      border: "1px solid #253049",
                      borderRadius: "10px",
                    }}
                  />

                  <Line
                    type="monotone"
                    dataKey="memoryUsage"
                    stroke="#4aa3ff"
                    strokeWidth={2}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </section>

        </div>

      </main>

    </div>
  );
}

export default Metrics;