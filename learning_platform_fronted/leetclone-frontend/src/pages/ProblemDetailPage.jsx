import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import axiosClient from "../api/axiosClient";
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
            console.error(err);

            if (err.response?.status === 404) {
                setError("Problem not found.");
            } else {
                setError("Unable to load this problem.");
            }
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="problem-detail-loading">
                <div className="problem-detail-spinner"></div>
                <p>Loading problem...</p>
            </div>
        );
    }

    if (error || !problem) {
        return (
            <div className="problem-detail-error-page">
                <h2>
                    {error || "Problem not found."}
                </h2>

                <Link to="/problems">
                    ← Back to Problems
                </Link>
            </div>
        );
    }

    return (
        <div className="problem-detail-page">

            <div className="problem-detail-container">

                {/* Back */}
                <Link
                    to="/problems"
                    className="back-to-problems"
                >
                    ← Back to Problems
                </Link>

                {/* Header */}
                <div className="problem-detail-header">

                    <div>

                        <div className="problem-detail-meta">

                            <span className="problem-number">
                                Problem
                            </span>

                            <span className="meta-dot">
                                •
                            </span>

                            <span
                                className={`detail-difficulty ${
                                    problem.difficulty?.toLowerCase()
                                }`}
                            >
                                {problem.difficulty}
                            </span>

                        </div>

                        <h1>
                            {problem.title}
                        </h1>

                    </div>

                </div>

                {/* Main */}
                <div className="problem-detail-grid">

                    {/* Problem Content */}
                    <article className="problem-content-card">

                        {/* Description */}
                        <section>
                            <h2>
                                Description
                            </h2>

                            <p className="problem-description">
                                {problem.description}
                            </p>
                        </section>

                        {/* Input */}
                        {problem.input_format && (
                            <section>
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
                            <section>
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
                            <section>
                                <h2>
                                    Constraints
                                </h2>

                                <div className="problem-text-box constraints-box">
                                    {problem.constraints}
                                </div>
                            </section>
                        )}

                        {/* Example */}
                        {problem.sample_input && (
                            <section>

                                <h2>
                                    Example
                                </h2>

                                <div className="example-box">

                                    <div className="example-block">

                                        <div className="example-label">
                                            Input
                                        </div>

                                        <pre>
                                            {problem.sample_input}
                                        </pre>

                                    </div>

                                    <div className="example-block">

                                        <div className="example-label">
                                            Output
                                        </div>

                                        <pre>
                                            {problem.sample_output}
                                        </pre>

                                    </div>

                                </div>

                            </section>
                        )}

                        {/* Explanation */}
                        {problem.explanation && (
                            <section>

                                <h2>
                                    Explanation
                                </h2>

                                <p className="problem-description">
                                    {problem.explanation}
                                </p>

                            </section>
                        )}

                    </article>

                    {/* Right Side */}
                    <aside className="problem-side-card">

                        {/* Difficulty */}
                        <div className="side-card-section">

                            <span className="side-label">
                                DIFFICULTY
                            </span>

                            <div
                                className={`side-difficulty ${
                                    problem.difficulty?.toLowerCase()
                                }`}
                            >
                                {problem.difficulty}
                            </div>

                        </div>

                        <div className="side-divider"></div>

                        {/* Solve */}
                        <div className="side-card-section">

                            <span className="side-label">
                                WHAT'S NEXT?
                            </span>

                            <p>
                                Ready to solve this problem?
                            </p>

                            <Link
                                to={`/problems/${problem.slug}/solve`}
                                className="solve-button"
                            >
                                Solve Problem
                                <span>→</span>
                            </Link>

                        </div>

                    </aside>

                </div>

            </div>

        </div>
    );
}

export default ProblemDetailPage;