import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import "./AIInsights.css";
import { API_BASE_URL } from "../api";

function AIInsights() {
    const navigate = useNavigate();

    const [incidents, setIncidents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedIncident, setSelectedIncident] = useState(null);

    useEffect(() => {
        const loadInsights = async () => {
            try {
                const response = await fetch(
                    `${API_BASE_URL}/api/incidents`
                );

                if (!response.ok) {
                    throw new Error(`HTTP error: ${response.status}`);
                }

                const data = await response.json();

                const sorted = [...data].sort(
                    (a, b) =>
                        new Date(b.startedAt || 0) -
                        new Date(a.startedAt || 0)
                );

                setIncidents(sorted);

                const firstWithAnalysis = sorted.find(
                    (incident) => incident.rootCause
                );

                setSelectedIncident(firstWithAnalysis || sorted[0] || null);
            } catch (error) {
                console.error("Failed to load AI insights:", error);
            } finally {
                setLoading(false);
            }
        };

        loadInsights();
    }, []);

    const analyzedIncidents = useMemo(
        () => incidents.filter((incident) => incident.rootCause),
        [incidents]
    );

    const highPriority = useMemo(
        () =>
            incidents.filter(
                (incident) =>
                    incident.severity === "HIGH" ||
                    incident.severity === "CRITICAL"
            ),
        [incidents]
    );

    const averageConfidence = useMemo(() => {
        if (!analyzedIncidents.length) return 0;

        const total = analyzedIncidents.reduce(
            (sum, incident) =>
                sum + Number(incident.confidenceScore || 0),
            0
        );

        return Math.round(
            (total / analyzedIncidents.length) * 100
        );
    }, [analyzedIncidents]);

    if (loading) {
        return (
            <div className="ai-page">
                <main className="ai-content">
                    <p>Loading AI intelligence...</p>
                </main>
            </div>
        );
    }

    return (
        <div className="ai-page">

            <aside className="ai-sidebar">
                <div className="ai-brand">
                    <div className="ai-brand-icon">A</div>

                    <div>
                        <strong>AEGIS</strong>
                        <span>Incident Intelligence</span>
                    </div>
                </div>

                <nav className="ai-nav">
                    <button onClick={() => navigate("/dashboard")}>
                        Overview
                    </button>

                    <button onClick={() => navigate("/services")}>
                        Services
                    </button>

                    <button onClick={() => navigate("/incidents")}>
                        Incidents
                    </button>

                    <button onClick={() => navigate("/metrics")}>
                        Metrics
                    </button>

                    <button className="active">
                        AI Insights
                    </button>
                </nav>
            </aside>

            <main className="ai-content">

                <header className="ai-header">
                    <div>
                        <span className="ai-eyebrow">
                            LOCAL INTELLIGENCE
                        </span>

                        <h1>AI Insights</h1>

                        <p>
                            AI-generated incident intelligence, root-cause
                            analysis and recommended remediation.
                        </p>
                    </div>

                    <div className="ai-online">
                        <span></span>
                        AI Engine Online
                    </div>
                </header>

                <section className="ai-stats">

                    <article>
                        <span>Analyzed Incidents</span>
                        <strong>{analyzedIncidents.length}</strong>
                        <small>AI investigations generated</small>
                    </article>

                    <article>
                        <span>High Priority</span>
                        <strong>{highPriority.length}</strong>
                        <small>High + critical incidents</small>
                    </article>

                    <article>
                        <span>Average Confidence</span>
                        <strong>{averageConfidence}%</strong>
                        <small>Across analyzed incidents</small>
                    </article>

                    <article>
                        <span>AI Model</span>
                        <strong className="model-name">
                            Llama 3.2
                        </strong>
                        <small>Local GenAI connected</small>
                    </article>

                </section>

                <div className="ai-workspace">

                    <section className="ai-incident-list">

                        <div className="ai-section-heading">
                            <span>INTELLIGENCE FEED</span>
                            <h2>Analyzed incidents</h2>
                        </div>

                        <div className="ai-list">

                            {incidents.length === 0 && (
                                <p className="ai-empty">
                                    No incidents available.
                                </p>
                            )}

                            {incidents.map((incident) => {

                                const active =
                                    selectedIncident?.id === incident.id;

                                return (
                                    <button
                                        key={incident.id}
                                        className={`ai-incident-item ${active ? "selected" : ""
                                            }`}
                                        onClick={() =>
                                            setSelectedIncident(incident)
                                        }
                                    >

                                        <div className="ai-incident-top">

                                            <span
                                                className={`ai-severity-dot ${incident.severity?.toLowerCase() ||
                                                    "normal"
                                                    }`}
                                            ></span>

                                            <span className="ai-incident-id">
                                                #{incident.id}
                                            </span>

                                        </div>

                                        <strong>{incident.title}</strong>

                                        <small>
                                            {incident.affectedService?.name ||
                                                "Unknown Service"}
                                        </small>

                                        <div className="ai-incident-bottom">

                                            <span
                                                className={`ai-severity ${incident.severity?.toLowerCase() ||
                                                    ""
                                                    }`}
                                            >
                                                {incident.severity || "UNKNOWN"}
                                            </span>

                                            <span>
                                                {incident.rootCause
                                                    ? "AI ANALYZED"
                                                    : "PENDING"}
                                            </span>

                                        </div>

                                    </button>
                                );
                            })}

                        </div>

                    </section>

                    <section className="ai-analysis-panel">

                        {selectedIncident ? (
                            <>
                                <div className="analysis-panel-header">

                                    <div>
                                        <span className="ai-eyebrow">
                                            AI ENGINE
                                        </span>

                                        <h2>Root Cause Analysis</h2>
                                    </div>

                                    <span className="generated-badge">
                                        AI Generated
                                    </span>

                                </div>

                                <div className="analysis-incident-title">

                                    <div>
                                        <small>
                                            INCIDENT #{selectedIncident.id}
                                        </small>

                                        <h3>
                                            {selectedIncident.title}
                                        </h3>
                                    </div>

                                    <span
                                        className={`ai-severity ${selectedIncident.severity?.toLowerCase() ||
                                            ""
                                            }`}
                                    >
                                        {selectedIncident.severity}
                                    </span>

                                </div>

                                <div className="analysis-meta">

                                    <div>
                                        <span>Service</span>

                                        <strong>
                                            {selectedIncident.affectedService?.name ||
                                                "Unknown"}
                                        </strong>
                                    </div>

                                    <div>
                                        <span>Status</span>

                                        <strong>
                                            {selectedIncident.status || "Unknown"}
                                        </strong>
                                    </div>

                                    <div>
                                        <span>Confidence</span>

                                        <strong>
                                            {Math.round(
                                                Number(
                                                    selectedIncident.confidenceScore || 0
                                                ) * 100
                                            )}
                                            %
                                        </strong>
                                    </div>

                                </div>

                                <div className="analysis-output">

                                    {selectedIncident.rootCause ? (
                                        <ReactMarkdown>
                                            {selectedIncident.rootCause}
                                        </ReactMarkdown>
                                    ) : (
                                        <div className="no-analysis">

                                            <span>AI ANALYSIS PENDING</span>

                                            <h3>
                                                No intelligence generated yet
                                            </h3>

                                            <p>
                                                AEGIS has recorded this incident, but
                                                root-cause analysis has not yet been
                                                generated.
                                            </p>

                                        </div>
                                    )}

                                </div>

                                <button
                                    className="open-incident-button"
                                    onClick={() =>
                                        navigate(
                                            `/incidents/${selectedIncident.id}`
                                        )
                                    }
                                >
                                    Open full incident →
                                </button>

                            </>
                        ) : (
                            <div className="no-analysis">
                                <h3>No incident selected</h3>
                            </div>
                        )}

                    </section>

                </div>

            </main>

        </div>
    );
}

export default AIInsights;