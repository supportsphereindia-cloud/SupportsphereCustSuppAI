import "./LandingPage.css";
import { Link } from "react-router-dom";

const features = [
  {
    number: "01",
    icon: "✳",
    title: "AI-powered ticket analysis",
    description:
      "Analyze customer issues with AI to understand the problem and identify actionable next steps.",
  },
  {
    number: "02",
    icon: "⌕",
    title: "Company Knowledge",
    description:
      "Turn company documents into searchable knowledge and let AI answer questions using relevant information.",
  },
  {
    number: "03",
    icon: "▤",
    title: "Organized ticket management",
    description:
      "Create, track, update, and resolve support tickets from one centralized workspace.",
  },
  {
    number: "04",
    icon: "⌘",
    title: "Multi-organization support",
    description:
      "Keep organizations, memberships, and company knowledge separated with role-based access.",
  },
  {
    number: "05",
    icon: "◷",
    title: "Audit logs",
    description:
      "Track important organization activities to improve accountability and visibility.",
  },
  {
    number: "06",
    icon: "⛨",
    title: "Secure by design",
    description:
      "Use authentication, permissions, and organization-scoped access to protect your workspace.",
  },
];

function LandingPage() {
  return (
    <div className="landing-page">
      <header className="landing-nav">
        <Link to="/" className="landing-brand">
          <span className="brand-mark">S</span>
          <span>SupportSphere</span>
        </Link>

        <nav className="landing-nav-links">
          <a href="#features">Features</a>
          <a href="#how-it-works">How it works</a>
        </nav>

        <div className="landing-nav-actions">
          <Link to="/login" className="nav-login">
            Log in
          </Link>
          <Link to="/register" className="button-primary nav-cta">
            Get started <span aria-hidden="true">↗</span>
          </Link>
        </div>
      </header>

      <main>
        <section className="landing-hero">
          <div className="hero-copy">
            <div className="hero-eyebrow">
              <span className="status-dot" />
              CUSTOMER SUPPORT, REIMAGINED
            </div>

            <h1>
              Support that feels
              <br />
              <span>effortless.</span>
            </h1>

            <p className="hero-description">
              Bring customer conversations, company knowledge, and AI-powered
              assistance together in one workspace built for better support.
            </p>

            <div className="hero-actions">
              <Link to="/register" className="button-primary hero-button">
                Get started for free <span aria-hidden="true">→</span>
              </Link>
              <a href="#how-it-works" className="button-secondary hero-button">
                Explore the platform <span aria-hidden="true">↓</span>
              </a>
            </div>

            <div className="hero-trust">
              <div className="trust-avatars" aria-hidden="true">
                <span>A</span>
                <span>S</span>
                <span>✓</span>
              </div>
              <p>
                <strong>One workspace.</strong> Smarter support.
              </p>
            </div>
          </div>

          <div className="hero-visual" aria-label="SupportSphere dashboard preview">
            <div className="visual-glow" />

            <div className="dashboard-window">
              <div className="window-topbar">
                <div className="window-dots">
                  <span />
                  <span />
                  <span />
                </div>
                <div className="window-address">app.supportsphere.com</div>
                <div className="window-status">
                  <span className="status-dot" /> Live workspace
                </div>
              </div>

              <div className="preview-layout">
                <aside className="preview-sidebar">
                  <div className="preview-logo">
                    <span className="brand-mark small-mark">S</span>
                    <span>SupportSphere</span>
                  </div>

                  <div className="preview-workspace">
                    <span className="workspace-icon">N</span>
                    <span>
                      <strong>Northstar Inc.</strong>
                      <small>Workspace</small>
                    </span>
                    <span className="sidebar-chevron">⌄</span>
                  </div>

                  <div className="sidebar-label">WORKSPACE</div>
                  <div className="sidebar-item active">
                    <span>▦</span> Overview
                  </div>
                  <div className="sidebar-item">
                    <span>▤</span> Company Knowledge
                  </div>
                  <div className="sidebar-item">
                    <span>＋</span> Create Ticket
                  </div>

                  <div className="sidebar-bottom">
                    <div className="sidebar-label">YOUR ACCOUNT</div>
                    <div className="preview-user">
                      <span className="user-avatar">AY</span>
                      <span>
                        <strong>Alex Young</strong>
                        <small>Customer</small>
                      </span>
                    </div>
                  </div>
                </aside>

                <div className="preview-content">
                  <div className="preview-heading">
                    <div>
                      <span className="preview-kicker">MONDAY, 28 OCTOBER</span>
                      <h3>Good morning, Alex 👋</h3>
                      <p>What can we help you with today?</p>
                    </div>
                    <span className="preview-bell">♧</span>
                  </div>

                  <div className="preview-stat-grid">
                    <div className="preview-stat">
                      <span>Open tickets</span>
                      <strong>08</strong>
                      <small><span className="stat-blue-dot" /> Needs attention</small>
                    </div>
                    <div className="preview-stat">
                      <span>Resolved</span>
                      <strong>24</strong>
                      <small className="stat-positive">↑ Looking good</small>
                    </div>
                  </div>

                  <div className="preview-section-heading">
                    <strong>Your support workspace</strong>
                    <span>Explore →</span>
                  </div>

                  <div className="preview-action-card">
                    <div className="action-icon knowledge-icon">✳</div>
                    <div>
                      <strong>Company Knowledge</strong>
                      <p>Find answers in your company documents.</p>
                      <span className="preview-tag">AI ASSISTANT</span>
                    </div>
                    <span className="action-arrow">↗</span>
                  </div>

                  <div className="preview-action-card">
                    <div className="action-icon ticket-icon">＋</div>
                    <div>
                      <strong>Create a ticket</strong>
                      <p>Tell us what's going on. We're here to help.</p>
                      <span className="preview-tag">SUPPORT REQUEST</span>
                    </div>
                    <span className="action-arrow">↗</span>
                  </div>

                  <div className="preview-ai-note">
                    <span className="ai-sparkle">✳</span>
                    <span>
                      <strong>Your AI assistant is ready.</strong>
                      <small>Get answers from your company's knowledge base.</small>
                    </span>
                    <span className="ai-online-dot" />
                  </div>
                </div>
              </div>
            </div>

            <div className="floating-chip chip-top">
              <span className="chip-check">✓</span>
              AI assistance, built in
            </div>

            <div className="floating-chip chip-bottom">
              <span className="chip-purple">✳</span>
              Answers grounded in your knowledge
            </div>
          </div>
        </section>

        <section className="landing-proof">
          <p>EVERYTHING YOUR SUPPORT WORKFLOW NEEDS</p>
          <div className="proof-items">
            <span>✳ AI assistance</span>
            <span>⌕ Knowledge search</span>
            <span>▤ Ticket management</span>
            <span>⛨ Access control</span>
          </div>
        </section>

        <section className="landing-features" id="features">
          <div className="section-heading">
            <span className="section-eyebrow">BUILT FOR BETTER SUPPORT</span>
            <h2>
              Less searching.
              <br />
              <span>More solving.</span>
            </h2>
            <p>
              The essential tools your team needs to turn scattered information
              into a more connected support experience.
            </p>
          </div>

          <div className="feature-grid">
            {features.map((feature) => (
              <article className="feature-card" key={feature.number}>
                <div className="feature-card-top">
                  <span className="feature-icon">{feature.icon}</span>
                  <span className="feature-number">{feature.number}</span>
                </div>
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
                <span className="feature-decoration" aria-hidden="true">
                  ↗
                </span>
              </article>
            ))}
          </div>
        </section>

        <section className="landing-workflow" id="how-it-works">
          <div className="workflow-copy">
            <span className="section-eyebrow">KNOWLEDGE MEETS AI</span>
            <h2>
              Answers from your
              <br />
              <span>company's knowledge.</span>
            </h2>
            <p>
              Give your team and customers a smarter way to find information.
              SupportSphere combines document-based knowledge with AI-powered
              retrieval to help surface relevant answers.
            </p>

            <div className="workflow-points">
              <div>
                <span>✓</span>
                Upload company PDF documents
              </div>
              <div>
                <span>✓</span>
                Search relevant information with AI
              </div>
              <div>
                <span>✓</span>
                Keep knowledge scoped to each organization
              </div>
            </div>

            <Link to="/login" className="workflow-link">
              Explore Company Knowledge <span>→</span>
            </Link>
          </div>

          <div className="knowledge-preview">
            <div className="knowledge-preview-header">
              <div>
                <span className="knowledge-header-icon">✳</span>
                <span>
                  <strong>Knowledge Assistant</strong>
                  <small>Northstar Inc. · AI workspace</small>
                </span>
              </div>
              <span className="online-pill">
                <span className="status-dot" /> Ready
              </span>
            </div>

            <div className="knowledge-document">
              <span className="document-icon">PDF</span>
              <span>
                <strong>Employee Handbook.pdf</strong>
                <small>Company document · Available to search</small>
              </span>
              <span className="document-check">✓</span>
            </div>

            <div className="chat-message user-message">
              Where can I find the company's leave policy?
            </div>

            <div className="chat-answer">
              <div className="answer-heading">
                <span className="answer-sparkle">✳</span>
                <strong>SupportSphere AI</strong>
              </div>
              <p>
                You can find the leave policy in your Employee Handbook. Look
                for the section covering time off and leave procedures.
              </p>
              <div className="answer-source">
                <span>↗</span>
                Source: Employee Handbook.pdf
              </div>
            </div>

            <div className="chat-input-preview">
              <span>Ask a question about your company...</span>
              <span className="chat-send">↑</span>
            </div>
            <p className="knowledge-disclaimer">
              Illustrative preview · AI responses should be verified against
              source documents.
            </p>
          </div>
        </section>

        <section className="landing-cta">
          <div className="cta-orb cta-orb-one" />
          <div className="cta-orb cta-orb-two" />
          <span className="section-eyebrow">A BETTER SUPPORT EXPERIENCE STARTS HERE</span>
          <h2>
            Make every support
            <br />
            interaction count.
          </h2>
          <p>
            Bring your tickets, knowledge, and AI assistance into one workspace.
          </p>
          <Link to="/register" className="button-primary cta-button">
            Get started with SupportSphere <span>→</span>
          </Link>
        </section>
      </main>

      <footer className="landing-footer">
        <Link to="/" className="landing-brand">
          <span className="brand-mark">S</span>
          <span>SupportSphere</span>
        </Link>
        <p>Smarter support. Better experiences.</p>
        <div className="footer-links">
          <Link to="/login">Log in</Link>
          <Link to="/register">Create account</Link>
        </div>
        <span className="footer-copyright">
          © {new Date().getFullYear()} SupportSphere
        </span>
      </footer>
    </div>
  );
}

export default LandingPage;
