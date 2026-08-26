import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Incidents.css";
import { API_BASE_URL } from "../api";

function Incidents() {
  const navigate = useNavigate();

  const [incidents, setIncidents] = useState([]);
  const [loading, setLoading] = useState(true);

  const [statusFilter, setStatusFilter] = useState("ALL");
  const [severityFilter, setSeverityFilter] = useState("ALL");

  useEffect(() => {
    const loadIncidents = async () => {
      try {
        const response = await fetch(
          `${API_BASE_URL}/api/incidents`
        );

        const data = await response.json();

        setIncidents(data);
      } catch (error) {
        console.error("Failed to load incidents:", error);
      } finally {
        setLoading(false);
      }
    };

    loadIncidents();
  }, []);

  const filteredIncidents = useMemo(() => {
    return incidents
      .filter((incident) => {
        if (
          statusFilter !== "ALL" &&
          incident.status !== statusFilter
        ) {
          return false;
        }

        if (
          severityFilter !== "ALL" &&
          incident.severity !== severityFilter
        ) {
          return false;
        }

        return true;
      })
      .slice()
      .reverse();
  }, [incidents, statusFilter, severityFilter]);

  const openCount = incidents.filter(
    (incident) => incident.status === "OPEN"
  ).length;

  const criticalCount = incidents.filter(
    (incident) => incident.severity === "CRITICAL"
  ).length;

  const highCount = incidents.filter(
    (incident) => incident.severity === "HIGH"
  ).length;

  if (loading) {
    return (
      <div className="incidents-page">
        <div className="incidents-content">
          <p>Loading incidents...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="incidents-page">

      <aside className="incidents-sidebar">
        <div className="sidebar-brand">
          <div className="sidebar-brand-icon">A</div>

          <div>
            <strong>AEGIS</strong>
            <span>Incident Intelligence</span>
          </div>
        </div>

        <nav className="incidents-nav">
          <button onClick={() => navigate("/dashboard")}>
            Overview
          </button>

          <button onClick={() => navigate("/services")}>
            Services
          </button>

          <button className="active">
            Incidents
          </button>

          <button onClick={() => navigate("/metrics")}>
            Metrics
          </button>

          <button onClick={() => navigate("/ai")}>
            AI Insights
          </button>
        </nav>
      </aside>

      <main className="incidents-content">

        <div className="incidents-header">
          <div>
            <span className="section-label">
              INCIDENT MANAGEMENT
            </span>

            <h1>Incidents</h1>

            <p>
              Investigate service incidents, severity, status and
              AI-generated root-cause analysis.
            </p>
          </div>
        </div>

        <div className="incident-summary-grid">

          <div className="summary-card">
            <span>Total Incidents</span>
            <strong>{incidents.length}</strong>
            <small>Recorded by AEGIS</small>
          </div>

          <div className="summary-card">
            <span>Open</span>
            <strong>{openCount}</strong>
            <small>Require attention</small>
          </div>

          <div className="summary-card">
            <span>Critical</span>
            <strong>{criticalCount}</strong>
            <small>Highest priority</small>
          </div>

          <div className="summary-card">
            <span>High Severity</span>
            <strong>{highCount}</strong>
            <small>Needs investigation</small>
          </div>

        </div>

        <section className="incidents-panel">

          <div className="incidents-toolbar">

            <div>
              <span className="panel-label">
                ALL INCIDENTS
              </span>

              <h2>
                Incident history
              </h2>
            </div>

            <div className="filters">

              <select
                value={statusFilter}
                onChange={(event) =>
                  setStatusFilter(event.target.value)
                }
              >
                <option value="ALL">
                  All Statuses
                </option>

                <option value="OPEN">
                  Open
                </option>

                <option value="RESOLVED">
                  Resolved
                </option>
              </select>

              <select
                value={severityFilter}
                onChange={(event) =>
                  setSeverityFilter(event.target.value)
                }
              >
                <option value="ALL">
                  All Severities
                </option>

                <option value="CRITICAL">
                  Critical
                </option>

                <option value="HIGH">
                  High
                </option>

                <option value="MEDIUM">
                  Medium
                </option>

                <option value="LOW">
                  Low
                </option>
              </select>

            </div>

          </div>

          {filteredIncidents.length === 0 ? (
            <div className="empty-incidents">
              No incidents match the selected filters.
            </div>
          ) : (
            <div className="incident-table">

              <div className="incident-table-header">
                <span>Incident</span>
                <span>Severity</span>
                <span>Status</span>
                <span>Confidence</span>
                <span>Started</span>
              </div>

              {filteredIncidents.map((incident) => (
                <div
                  key={incident.id}
                  className="incident-table-row"
                  onClick={() =>
                    navigate(`/incidents/${incident.id}`)
                  }
                >

                  <div className="incident-title-cell">

                    <span
                      className={`incident-dot ${
                        incident.severity === "CRITICAL"
                          ? "critical-dot"
                          : incident.severity === "HIGH"
                          ? "high-dot"
                          : "normal-dot"
                      }`}
                    ></span>

                    <div>
                      <strong>
                        {incident.title}
                      </strong>

                      <small>
                        {incident.affectedService?.name ||
                          "Unknown Service"}
                      </small>
                    </div>

                  </div>

                  <div>
                    <span
                      className={`severity-pill ${
                        incident.severity?.toLowerCase() ||
                        "unknown"
                      }`}
                    >
                      {incident.severity || "UNKNOWN"}
                    </span>
                  </div>

                  <div>
                    <span
                      className={`status-pill ${
                        incident.status?.toLowerCase() ||
                        "unknown"
                      }`}
                    >
                      {incident.status || "UNKNOWN"}
                    </span>
                  </div>

                  <div className="confidence-cell">
                    {incident.confidenceScore != null
                      ? `${Math.round(
                          incident.confidenceScore * 100
                        )}%`
                      : "N/A"}
                  </div>

                  <div className="started-cell">
                    {incident.startedAt
                      ? new Date(
                          incident.startedAt
                        ).toLocaleString()
                      : "N/A"}
                  </div>

                </div>
              ))}

            </div>
          )}

        </section>

      </main>

    </div>
  );
}

export default Incidents;