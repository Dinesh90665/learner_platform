

//This tells React:

// "Whenever someone uses <HomePage />,
//  display an <h1> element with the text 'Home Page'."


import { Link } from "react-router-dom";
import "../styles/HomePage.css";

function HomePage() {
    return (
        <div className="home-page">

            {/* Hero Section */}
            <section className="hero-section">

                <div className="hero-content">

                    <div className="hero-badge">
                        <span className="badge-dot"></span>
                        Learn. Practice. Improve.
                    </div>

                    <h1>
                        Master coding
                        <br />
                        <span>one problem at a time.</span>
                    </h1>

                    <p className="hero-description">
                        Build strong programming skills through practical
                        coding problems, instant feedback, and consistent
                        practice.
                    </p>

                    <div className="hero-actions">
                        <Link
                            to="/problems"
                            className="primary-hero-button"
                        >
                            Start Coding
                            <span>→</span>
                        </Link>

                        <Link
                            to="/register"
                            className="secondary-hero-button"
                        >
                            Create Free Account
                        </Link>
                    </div>

                    <div className="hero-note">
                        <span>✓</span>
                        Practice Python, C++ and Java
                    </div>

                </div>

                {/* Code Preview */}
                <div className="hero-code-wrapper">

                    <div className="code-window">

                        <div className="code-window-header">

                            <div className="window-dots">
                                <span></span>
                                <span></span>
                                <span></span>
                            </div>

                            <div className="code-file">
                                solution.py
                            </div>

                            <div className="code-status">
                                <span></span>
                                Ready
                            </div>

                        </div>

                        <div className="code-editor-preview">

                            <div className="line-number">1</div>
                            <div className="code-line">
                                <span className="keyword">def</span>{" "}
                                <span className="function">
                                    solve
                                </span>
                                <span>(nums):</span>
                            </div>

                            <div className="line-number">2</div>
                            <div className="code-line">
                                &nbsp;&nbsp;&nbsp;&nbsp;
                                <span className="keyword">
                                    return
                                </span>{" "}
                                <span className="function">
                                    max
                                </span>
                                (nums)
                            </div>

                            <div className="line-number">3</div>
                            <div className="code-line">
                                &nbsp;
                            </div>

                            <div className="line-number">4</div>
                            <div className="code-line">
                                <span className="function">
                                    print
                                </span>
                                (
                                <span className="string">
                                    "Ready to learn!"
                                </span>
                                )
                            </div>

                        </div>

                        <div className="code-output">

                            <div className="output-title">
                                Output
                            </div>

                            <div className="output-result">
                                <span className="success-check">
                                    ✓
                                </span>

                                Accepted

                                <span className="output-time">
                                    0.12s
                                </span>
                            </div>

                        </div>

                    </div>

                </div>

            </section>

            {/* Stats */}
            <section className="stats-section">

                <div className="stat-card">
                    <strong>100+</strong>
                    <span>Coding Problems</span>
                </div>

                <div className="stat-card">
                    <strong>3</strong>
                    <span>Languages</span>
                </div>

                <div className="stat-card">
                    <strong>24/7</strong>
                    <span>Practice Anytime</span>
                </div>

                <div className="stat-card">
                    <strong>∞</strong>
                    <span>Learning Opportunities</span>
                </div>

            </section>

            {/* Features */}
            <section className="features-section">

                <div className="section-heading">
                    <span>WHY LEARNER?</span>

                    <h2>
                        Everything you need to become
                        a better programmer.
                    </h2>

                    <p>
                        Practice with a simple workflow designed
                        to keep you focused on learning.
                    </p>
                </div>

                <div className="feature-grid">

                    <div className="feature-card">

                        <div className="feature-icon blue">
                            &lt;/&gt;
                        </div>

                        <h3>
                            Practice Real Problems
                        </h3>

                        <p>
                            Solve carefully designed programming
                            problems from easy to hard.
                        </p>

                    </div>

                    <div className="feature-card">

                        <div className="feature-icon green">
                            ✓
                        </div>

                        <h3>
                            Instant Feedback
                        </h3>

                        <p>
                            Run your code and immediately see
                            whether your solution passes the tests.
                        </p>

                    </div>

                    <div className="feature-card">

                        <div className="feature-icon purple">
                            ↗
                        </div>

                        <h3>
                            Track Progress
                        </h3>

                        <p>
                            Monitor your solved problems and
                            keep improving your programming skills.
                        </p>

                    </div>

                </div>

            </section>

            {/* CTA */}
            <section className="cta-section">

                <div className="cta-content">

                    <span className="cta-label">
                        READY TO START?
                    </span>

                    <h2>
                        Your next coding problem
                        is waiting.
                    </h2>

                    <p>
                        Start practicing today and build your
                        programming skills one solution at a time.
                    </p>

                    <Link
                        to="/problems"
                        className="cta-button"
                    >
                        Explore Problems
                        <span>→</span>
                    </Link>

                </div>

            </section>

        </div>
    );
}

export default HomePage;