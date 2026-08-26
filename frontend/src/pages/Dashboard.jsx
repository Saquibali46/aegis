import { useEffect, useState } from "react";
import "./Dashboard.css";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../api";

function Dashboard() {
  const navigate = useNavigate();
  const [services, setServices] = useState([]);
  const [incidents, setIncidents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [metrics, setMetrics] = useState([]);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        const servicesResponse = await fetch(
          `${API_BASE_URL}/api/services`
        );

        const incidentsResponse = await fetch(
          `${API_BASE_URL}/api/incidents`
        );

        const metricsResponse = await fetch(
          `${API_BASE_URL}/api/metrics/service/1`
        );


        const servicesData = await servicesResponse.json();
        const incidentsData = await incidentsResponse.json();
        const metricsData = await metricsResponse.json();

        setServices(servicesData);
        setIncidents(incidentsData);
        setMetrics(metricsData);

      } catch (error) {
        console.error("Failed to load AEGIS dashboard:", error);
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  const openIncidents = incidents.filter(
    incident => incident.status === "OPEN"
  ).length;

  const criticalIncidents = incidents.filter(
    incident =>
      incident.severity === "CRITICAL" &&
      incident.status === "OPEN"
  ).length;

  const firstService = services[0];
  const latestMetric = metrics[0];

  return (
    <div className="dashboard-page">
      <aside className="sidebar">
        <div className="sidebar-logo">
          <div className="sidebar-logo-icon">A</div>
          <div>
            <strong>AEGIS</strong>
            <span>Incident Intelligence</span>
          </div>
        </div>

        <nav className="sidebar-nav">
          <a className="active" href="/dashboard">Overview</a>
          <a href="/services">Services</a>
          <a href="/incidents">Incidents</a>
          <a href="/metrics">Metrics</a>
          <a href="/ai">AI Insights</a>
        </nav>
      </aside>

      <main className="dashboard-main">
        <div className="dashboard-top">
          <div>
            <span className="dashboard-label">SYSTEM OVERVIEW</span>
            <h1>Good morning, Syed Saquib Ali</h1>
            <p>Monitor incidents, services and AI intelligence from one place.</p>
          </div>

          <div className="system-badge">
            <span className="green-dot"></span>
            System Operational
          </div>
        </div>

        <div className="stats-grid">
          <div className="stat-card">
            <span>Monitored Services</span>
            <strong>{services.length}</strong>
            <small>{services.length} monitored</small>
          </div>

          <div className="stat-card">
            <span>Open Incidents</span>
            <strong>{openIncidents}</strong>
            <small>
              {openIncidents === 0 ? "All clear" : "Needs attention"}
            </small>
          </div>

          <div className="stat-card">
            <span>Critical Incidents</span>
            <strong>{criticalIncidents}</strong>
            <small>
              {criticalIncidents === 0 ? "No critical issues" : "High priority"}
            </small>
          </div>

          <div className="stat-card">
            <span>AI Status</span>
            <strong>Online</strong>
            <small>Llama 3.2 connected</small>
          </div>
        </div>

        <div className="dashboard-grid">
          <section className="panel">
            <div className="panel-header">
              <div>
                <span className="panel-label">SERVICE HEALTH</span>
                <h2>{firstService?.name || "No Service"}</h2>
              </div>

              <span className="healthy-badge">
                {firstService?.status || "UNKNOWN"}
              </span>
            </div>

            <div className="service-metrics">
              <div>
                <span>Latency</span>
                <strong>
                  {latestMetric ? `${latestMetric.latency.toFixed(0)} ms` : "--"}
                </strong>
              </div>

              <div>
                <span>Error Rate</span>
                <strong>
                  {latestMetric ? `${latestMetric.errorRate.toFixed(1)}%` : "--"}
                </strong>
              </div>

              <div>
                <span>CPU</span>
                <strong>
                  {latestMetric ? `${latestMetric.cpuUsage.toFixed(1)}%` : "--"}
                </strong>
              </div>

              <div>
                <span>Memory</span>
                <strong>
                  {latestMetric ? `${latestMetric.memoryUsage.toFixed(1)}%` : "--"}
                </strong>
              </div>
            </div>
          </section>

          <section className="panel">
            <div className="panel-header">
              <div>
                <span className="panel-label">AI ENGINE</span>
                <h2>Intelligence Status</h2>
              </div>
            </div>

            <div className="ai-status-box">
              <div className="ai-row">
                <span>ML Anomaly Detection</span>
                <strong>Active</strong>
              </div>

              <div className="ai-row">
                <span>Local GenAI</span>
                <strong>Connected</strong>
              </div>

              <div className="ai-row">
                <span>Model</span>
                <strong>Llama 3.2 3B</strong>
              </div>
            </div>
          </section>
        </div>

        <section className="panel recent-incidents">
          <div className="panel-header">
            <div>
              <span className="panel-label">RECENT INCIDENTS</span>
              <h2>Latest activity</h2>
            </div>

            <a href="/incidents">View all →</a>
          </div>

          {incidents.length === 0 ? (
            <div className="incident-empty">
              No incidents detected.
            </div>
          ) : (
            incidents
              .slice()
              .reverse()
              .slice(0, 5)
              .map((incident) => (
                <div
                  className="incident-row"
                  key={incident.id}
                  onClick={() => navigate(`/incidents/${incident.id}`)}
                  style={{ cursor: "pointer" }}
                >

                  <div className="incident-info">
                    <span
                      className={`incident-dot ${incident.severity === "CRITICAL"
                        ? "critical-dot"
                        : "warning-dot"
                        }`}
                    ></span>

                    <div>
                      <strong>{incident.title}</strong>

                      <small>
                        {incident.affectedService?.name || "Unknown Service"}
                      </small>
                    </div>
                  </div>

                  <span
                    className={`severity ${incident.severity === "CRITICAL"
                      ? "critical"
                      : "high"
                      }`}
                  >
                    {incident.severity}
                  </span>

                  <span className="incident-status">
                    {incident.status}
                  </span>

                </div>
              ))
          )}
        </section>
      </main>
    </div>
  );
}

export default Dashboard;