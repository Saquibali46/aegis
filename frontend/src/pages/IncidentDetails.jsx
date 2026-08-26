import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./IncidentDetails.css";
import ReactMarkdown from "react-markdown";
import { API_BASE_URL } from "../api";

function IncidentDetails() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [incident, setIncident] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const loadIncident = async () => {
            try {
                setLoading(true);
                setError("");

                const response = await fetch(
                    `${API_BASE_URL}/api/incidents/${id}`
                );

                if (!response.ok) {
                    throw new Error(`Incident request failed: ${response.status}`);
                }

                const data = await response.json();
                setIncident(data);
            } catch (err) {
                console.error("Failed to load incident:", err);
                setError("Unable to load incident.");
            } finally {
                setLoading(false);
            }
        };

        loadIncident();
    }, [id]);

    const resolveIncident = async () => {
        try {
            const response = await fetch(
                `${API_BASE_URL}/api/incidents/${id}/resolve`,
                {
                    method: "PUT",
                }
            );

            if (!response.ok) {
                throw new Error("Failed to resolve incident");
            }

            const updatedIncident = await response.json();
            setIncident(updatedIncident);
        } catch (error) {
            console.error("Failed to resolve incident:", error);
        }
    };

    if (loading) {
        return (
            <div className="incident-page">
                <p>Loading incident...</p>
            </div>
        );
    }

    if (error || !incident) {
        return (
            <div className="incident-page">
                <button
                    className="back-button"
                    onClick={() => navigate("/dashboard")}
                >
                    ← Back to Dashboard
                </button>

                <h2>Incident unavailable</h2>
                <p>{error}</p>
            </div>
        );
    }

    return (
        <div className="incident-page">

            <button
                className="back-button"
                onClick={() => navigate("/dashboard")}
            >
                ← Back to Dashboard
            </button>

            <div className="incident-heading">
                <div>
                    <span className="eyebrow">INCIDENT INTELLIGENCE</span>

                    <h1>{incident.title}</h1>

                    <p>
                        Incident #{incident.id} ·{" "}
                        {incident.affectedService?.name || "Unknown Service"}
                    </p>
                </div>

                <div className={`severity-badge ${incident.severity?.toLowerCase()}`}>
                    {incident.severity}
                </div>
            </div>

            <div className="incident-grid">

                <section className="detail-card">
                    <span className="card-label">STATUS</span>
                    <h3>{incident.status || "Unknown"}</h3>
                </section>

                <section className="detail-card">
                    <span className="card-label">SEVERITY</span>
                    <h3>{incident.severity || "Unknown"}</h3>
                </section>

                <section className="detail-card">
                    <span className="card-label">SERVICE</span>
                    <h3>
                        {incident.affectedService?.name || "Unknown Service"}
                    </h3>
                </section>

                <section className="detail-card">
                    <span className="card-label">CONFIDENCE</span>
                    <h3>
                        {incident.confidenceScore != null
                            ? `${Math.round(incident.confidenceScore * 100)}%`
                            : "N/A"}
                    </h3>
                </section>

            </div>

            <section className="analysis-card">
                <div className="analysis-header">
                    <div>
                        <span className="eyebrow">AI ENGINE</span>
                        <h2>Root Cause Analysis</h2>
                    </div>

                    <span className="ai-badge">AI Generated</span>
                </div>

                <div className="analysis-content">
                    {incident.rootCause ? (
                        <ReactMarkdown>{incident.rootCause}</ReactMarkdown>
                    ) : (
                        <p>AI analysis is not available for this incident.</p>
                    )}
                </div>
            </section>

            <section className="metadata-card">
                <h2>Incident Information</h2>

                <div className="metadata-row">
                    <span>Incident ID</span>
                    <strong>#{incident.id}</strong>
                </div>

                <div className="metadata-row">
                    <span>Started At</span>
                    <strong>
                        {incident.startedAt
                            ? new Date(incident.startedAt).toLocaleString()
                            : "N/A"}
                    </strong>
                </div>

                <div className="metadata-row">
                    <span>Resolved At</span>
                    <strong>
                        {incident.resolvedAt
                            ? new Date(incident.resolvedAt).toLocaleString()
                            : "Not resolved"}
                    </strong>
                </div>

            </section>

        </div>
    );
}

export default IncidentDetails;