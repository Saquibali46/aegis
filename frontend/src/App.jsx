import { Link } from "react-router-dom";
import { ShieldCheck, Brain, Activity, ArrowRight } from "lucide-react";
import "./App.css";

function LandingPage() {
  return (
    <div className="landing-page">
      <header className="navbar">
        <div className="brand">
          <ShieldCheck size={28} />
          <span>AEGIS</span>
        </div>

        <nav>
          <a href="#features">Features</a>
          <a href="#how">How It Works</a>
          <Link to="/dashboard" className="nav-button">
            Dashboard
          </Link>
        </nav>
      </header>

      <section className="hero">
        <div className="hero-content">
          <div className="badge">AI-Powered Incident Intelligence</div>

          <h1>
            Detect problems.
            <br />
            Understand the cause.
            <br />
            Resolve faster.
          </h1>

          <p>
            AEGIS monitors application metrics, detects abnormal behavior using
            machine learning, and generates AI-powered root-cause analysis for
            engineering teams.
          </p>

          <div className="hero-actions">
            <Link to="/dashboard" className="primary-button">
              View Live Dashboard
              <ArrowRight size={18} />
            </Link>

            <a href="#how" className="secondary-button">
              See How It Works
            </a>
          </div>
        </div>

        <div className="hero-card">
          <div className="card-header">
            <span>Payment Service</span>
            <span className="status-critical">CRITICAL</span>
          </div>

          <div className="metric-row">
            <span>Latency</span>
            <strong>3200 ms</strong>
          </div>

          <div className="metric-row">
            <span>Error Rate</span>
            <strong>24%</strong>
          </div>

          <div className="metric-row">
            <span>CPU Usage</span>
            <strong>95%</strong>
          </div>

          <div className="ai-box">
            <Brain size={20} />
            <div>
              <strong>AI Root Cause</strong>
              <p>
                Resource saturation detected. High CPU and memory usage are
                strongly correlated with increased latency and errors.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section id="features" className="section">
        <p className="section-label">CORE CAPABILITIES</p>
        <h2>From telemetry to explanation</h2>

        <div className="feature-grid">
          <div className="feature-card">
            <Activity size={30} />
            <h3>ML Anomaly Detection</h3>
            <p>
              Learns normal service behavior and identifies unusual metric
              patterns automatically.
            </p>
          </div>

          <div className="feature-card">
            <Brain size={30} />
            <h3>AI Root-Cause Analysis</h3>
            <p>
              Local GenAI analyzes abnormal metrics and generates technical
              explanations and recommended actions.
            </p>
          </div>

          <div className="feature-card">
            <ShieldCheck size={30} />
            <h3>Incident Intelligence</h3>
            <p>
              Automatically creates incidents and stores investigation context
              for engineering teams.
            </p>
          </div>
        </div>
      </section>

      <section id="how" className="section how-section">
        <p className="section-label">HOW IT WORKS</p>
        <h2>One intelligent incident pipeline</h2>

        <div className="flow">
          <div className="flow-step">
            <span>01</span>
            <h3>Collect Metrics</h3>
            <p>Latency, CPU, memory, errors and throughput.</p>
          </div>

          <div className="flow-arrow">→</div>

          <div className="flow-step">
            <span>02</span>
            <h3>Detect Anomaly</h3>
            <p>Isolation Forest flags unusual service behavior.</p>
          </div>

          <div className="flow-arrow">→</div>

          <div className="flow-step">
            <span>03</span>
            <h3>Investigate with AI</h3>
            <p>Llama generates root cause and recommendations.</p>
          </div>

          <div className="flow-arrow">→</div>

          <div className="flow-step">
            <span>04</span>
            <h3>Create Incident</h3>
            <p>Spring Boot stores the incident and intelligence.</p>
          </div>
        </div>
      </section>

      <footer>
        <div className="brand">
          <ShieldCheck size={24} />
          <span>AEGIS</span>
        </div>

        <p>AI-Powered Incident Intelligence Platform</p>
      </footer>
    </div>
  );
}

function DashboardPlaceholder() {
  return (
    <div className="dashboard-placeholder">
      <h1>AEGIS Dashboard</h1>
      <p>Dashboard is coming next.</p>
      <Link to="/">Back to landing page</Link>
    </div>
  );
}

function App() {
  return <LandingPage />;
}

export default App;