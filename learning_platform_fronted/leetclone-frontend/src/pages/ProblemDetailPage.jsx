import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import axiosClient from "../api/axiosClient";
import DiscussionSection from "../components/discussions/DiscussionSection";
import "../styles/ProblemDetailPage.css";

function ProblemDetailPage() {
    const { slug } = useParams();

    const [problem, setProblem] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        fetchProblem();
    }, [slug]);

    const fetchProblem = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await axiosClient.get(
                `problems/${slug}/`
            );

            setProblem(response.data);
        } catch (err) {
            console.error("Problem details error:", err);

            if (err.response?.status === 404) {
                setError("Problem not found.");
            } else if (err.response?.status === 401) {
                setError("Please log in to view this problem.");
            } else {
                setError("Unable to load this problem.");
            }
        } finally {
            setLoading(false);
        }
    };

    /* -----------------------------
       Loading
    ----------------------------- */

    if (loading) {
        return (
            <div className="problem-detail-loading">
                <div className="problem-detail-spinner"></div>

                <p>
                    Loading problem...
                </p>
            </div>
        );
    }

    /* -----------------------------
       Error
    ----------------------------- */

    if (error || !problem) {
        return (
            <div className="problem-detail-error-page">

                <div className="problem-detail-error-content">

                    <div className="problem-error-icon">
                        !
                    </div>

                    <h2>
                        {error || "Problem not found."}
                    </h2>

                    <p>
                        We couldn't load this problem.
                    </p>

                    <Link
                        to="/problems"
                        className="problem-error-back"
                    >
                        ← Back to Problems
                    </Link>

                </div>

            </div>
        );
    }

    const difficultyClass =
        problem.difficulty?.toLowerCase() || "";

    return (
        <div className="problem-detail-page">

            <div className="problem-detail-container">

                {/* =================================
                    BACK TO PROBLEMS
                ================================= */}

                <Link
                    to="/problems"
                    className="back-to-problems"
                >
                    ← Back to Problems
                </Link>

                {/* =================================
                    HEADER
                ================================= */}

                <header className="problem-detail-header">

                    <div className="problem-detail-meta">

                        <span className="problem-number">
                            Problem
                        </span>

                        <span className="meta-dot">
                            •
                        </span>

                        <span
                            className={`detail-difficulty ${difficultyClass}`}
                        >
                            {problem.difficulty}
                        </span>

                    </div>

                    <h1>
                        {problem.title}
                    </h1>

                    {problem.slug && (
                        <p className="problem-slug">
                            /problems/{problem.slug}
                        </p>
                    )}

                </header>

                {/* =================================
                    MAIN PROBLEM AREA
                ================================= */}

                <div className="problem-detail-grid">

                    {/* =================================
                        LEFT: PROBLEM CONTENT
                    ================================= */}

                    <article className="problem-content-card">

                        {/* Description */}

                        {problem.description && (
                            <section className="problem-section">

                                <h2>
                                    Description
                                </h2>

                                <p className="problem-description">
                                    {problem.description}
                                </p>

                            </section>
                        )}

                        {/* Input */}

                        {problem.input_format && (
                            <section className="problem-section">

                                <h2>
                                    Input
                                </h2>

                                <div className="problem-text-box">
                                    {problem.input_format}
                                </div>

                            </section>
                        )}

                        {/* Output */}

                        {problem.output_format && (
                            <section className="problem-section">

                                <h2>
                                    Output
                                </h2>

                                <div className="problem-text-box">
                                    {problem.output_format}
                                </div>

                            </section>
                        )}

                        {/* Constraints */}

                        {problem.constraints && (
                            <section className="problem-section">

                                <h2>
                                    Constraints
                                </h2>

                                <div className="problem-text-box constraints-box">
                                    {problem.constraints}
                                </div>

                            </section>
                        )}

                        {/* Example */}

                        {(problem.sample_input ||
                            problem.sample_output) && (
                            <section className="problem-section">

                                <h2>
                                    Example
                                </h2>

                                <div className="example-box">

                                    {/* Input */}

                                    {problem.sample_input && (
                                        <div className="example-block">

                                            <div className="example-label">
                                                Input
                                            </div>

                                            <pre>
                                                {problem.sample_input}
                                            </pre>

                                        </div>
                                    )}

                                    {/* Output */}

                                    {problem.sample_output && (
                                        <div className="example-block">

                                            <div className="example-label">
                                                Output
                                            </div>

                                            <pre>
                                                {problem.sample_output}
                                            </pre>

                                        </div>
                                    )}

                                </div>

                            </section>
                        )}

                        {/* Explanation */}

                        {problem.explanation && (
                            <section className="problem-section">

                                <h2>
                                    Explanation
                                </h2>

                                <p className="problem-description">
                                    {problem.explanation}
                                </p>

                            </section>
                        )}

                    </article>

                    {/* =================================
                        RIGHT: PROBLEM SIDEBAR
                    ================================= */}

                    <aside className="problem-side-card">

                        {/* Difficulty */}

                        <div className="side-card-section">

                            <span className="side-label">
                                DIFFICULTY
                            </span>

                            <div
                                className={`side-difficulty ${difficultyClass}`}
                            >
                                {problem.difficulty}
                            </div>

                        </div>

                        <div className="side-divider"></div>

                        {/* Solve */}

                        <div className="side-card-section">

                            <span className="side-label">
                                READY TO CODE?
                            </span>

                            <h3 className="side-title">
                                Solve this problem
                            </h3>

                            <p>
                                Write your solution using
                                Python, C++, or Java.
                            </p>

                            <Link
                                to={`/problems/${problem.slug}/solve`}
                                className="solve-button"
                            >
                                <span>
                                    Solve Problem
                                </span>

                                <span className="solve-arrow">
                                    →
                                </span>
                            </Link>

                        </div>

                        <div className="side-divider"></div>

                        {/* Problem information */}

                        <div className="side-card-section">

                            <span className="side-label">
                                PROBLEM INFO
                            </span>

                            <div className="problem-info-item">
                                <span>
                                    Difficulty
                                </span>

                                <strong>
                                    {problem.difficulty}
                                </strong>
                            </div>

                            <div className="problem-info-item">
                                <span>
                                    Problem ID
                                </span>

                                <strong>
                                    #{problem.id}
                                </strong>
                            </div>

                        </div>

                    </aside>

                </div>

                {/* =================================
                    DISCUSSIONS
                ================================= */}

                <DiscussionSection
                    problemId={problem.id}
                />

            </div>

        </div>
    );
}

export default ProblemDetailPage;