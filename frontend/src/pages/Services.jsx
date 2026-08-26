import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Services.css";
import { API_BASE_URL } from "../api";

function Services() {
  const navigate = useNavigate();

  const [services, setServices] = useState([]);
  const [metricsByService, setMetricsByService] = useState({});
  const [incidents, setIncidents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadServicesPage = async () => {
      try {
        const servicesResponse = await fetch(
          `${API_BASE_URL}/api/services`
        );

        const incidentsResponse = await fetch(
          `${API_BASE_URL}/api/incidents`
        );

        const servicesData = await servicesResponse.json();
        const incidentsData = await incidentsResponse.json();

        setServices(servicesData);
        setIncidents(incidentsData);

        const metricsMap = {};

        for (const service of servicesData) {
          try {
            const metricsResponse = await fetch(
              `${API_BASE_URL}/api/metrics/service/${service.id}`
            );

            const metricsData = await metricsResponse.json();

            metricsMap[service.id] = metricsData[0] || null;
          } catch (error) {
            console.error(
              `Failed to load metrics for service ${service.id}`,
              error
            );

            metricsMap[service.id] = null;
          }
        }

        setMetricsByService(metricsMap);
      } catch (error) {
        console.error("Failed to load services page:", error);
      } finally {
        setLoading(false);
      }
    };

    loadServicesPage();
  }, []);

  const getIncidentCount = (serviceId) => {
    return incidents.filter(
      (incident) => incident.affectedService?.id === serviceId
    ).length;
  };

  const getHealthClass = (status) => {
    if (status === "HEALTHY") return "healthy";
    if (status === "DEGRADED") return "degraded";
    if (status === "DOWN") return "down";

    return "unknown";
  };

  if (loading) {
    return (
      <div className="services-page">
        <div className="services-content">
          <p className="loading-text">Loading monitored services...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="services-page">
      <aside className="services-sidebar">
        <div className="sidebar-brand">
          <div className="sidebar-brand-icon">A</div>

          <div>
            <strong>AEGIS</strong>
            <span>Incident Intelligence</span>
          </div>
        </div>

        <nav className="services-nav">
          <button onClick={() => navigate("/dashboard")}>
            Overview
          </button>

          <button className="active">
            Services
          </button>

          <button onClick={() => navigate("/incidents")}>
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

      <main className="services-content">
        <div className="services-header">
          <div>
            <span className="section-label">MONITORED SERVICES</span>

            <h1>Services</h1>

            <p>
              Monitor live application health, service metrics and incident
              activity.
            </p>
          </div>

          <div className="service-count-badge">
            {services.length} monitored
          </div>
        </div>

        {services.length === 0 ? (
          <div className="empty-services">
            <h2>No monitored services</h2>

            <p>
              Add a service through the AEGIS API to begin monitoring.
            </p>
          </div>
        ) : (
          <div className="services-grid">
            {services.map((service) => {
              const metric = metricsByService[service.id];

              return (
                <article
                  className="service-card"
                  key={service.id}
                >
                  <div className="service-card-top">
                    <div>
                      <span className="service-id">
                        SERVICE #{service.id}
                      </span>

                      <h2>{service.name}</h2>

                      <p>
                        {service.description || "No service description"}
                      </p>
                    </div>

                    <span
                      className={`service-status ${getHealthClass(
                        service.status
                      )}`}
                    >
                      {service.status || "UNKNOWN"}
                    </span>
                  </div>

                  <div className="service-stats">
                    <div>
                      <span>Latency</span>

                      <strong>
                        {metric
                          ? `${metric.latency?.toFixed?.(0) ?? metric.latency} ms`
                          : "--"}
                      </strong>
                    </div>

                    <div>
                      <span>Error Rate</span>

                      <strong>
                        {metric
                          ? `${metric.errorRate?.toFixed?.(1) ?? metric.errorRate}%`
                          : "--"}
                      </strong>
                    </div>

                    <div>
                      <span>CPU</span>

                      <strong>
                        {metric
                          ? `${metric.cpuUsage?.toFixed?.(1) ?? metric.cpuUsage}%`
                          : "--"}
                      </strong>
                    </div>

                    <div>
                      <span>Memory</span>

                      <strong>
                        {metric
                          ? `${metric.memoryUsage?.toFixed?.(1) ?? metric.memoryUsage}%`
                          : "--"}
                      </strong>
                    </div>
                  </div>

                  <div className="service-card-footer">
                    <div>
                      <span>Incidents</span>

                      <strong>{getIncidentCount(service.id)}</strong>
                    </div>

                    <div>
                      <span>Last Metric</span>

                      <strong>
                        {metric?.recordedAt
                          ? new Date(metric.recordedAt).toLocaleString()
                          : "No data"}
                      </strong>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}

export default Services;