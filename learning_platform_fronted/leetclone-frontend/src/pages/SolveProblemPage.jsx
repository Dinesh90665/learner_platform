import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import axiosClient from "../api/axiosClient";
import CodeEditor from "../components/CodeEditor";
import "../styles/SolveProblemPage.css";

function SolveProblemPage() {
    const { slug } = useParams();

    const [problem, setProblem] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
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
                    setError("Unable to load problem.");
                }
            } finally {
                setLoading(false);
            }
        };

        fetchProblem();
    }, [slug]);

    if (loading) {
        return (
            <div className="solve-loading">
                <div className="solve-loading-spinner"></div>
                <p>Loading problem...</p>
            </div>
        );
    }

    if (error || !problem) {
        return (
            <div className="solve-error">
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
        <div className="solve-page">

            {/* Header */}
            <header className="solve-header">

                <Link
                    to={`/problems/${problem.slug}`}
                    className="solve-back"
                >
                    ← Back to Problem
                </Link>

                <div className="solve-problem-title">

                    <span
                        className={`solve-difficulty ${
                            problem.difficulty?.toLowerCase()
                        }`}
                    >
                        {problem.difficulty}
                    </span>

                    <h1>
                        {problem.title}
                    </h1>

                </div>

            </header>

            {/* Main */}
            <main className="solve-layout">

                {/* LEFT: Problem */}
                <section className="solve-problem-panel">

                    <div className="solve-section">
                        <h2>
                            Description
                        </h2>

                        <p>
                            {problem.description}
                        </p>
                    </div>

                    {problem.input_format && (
                        <div className="solve-section">

                            <h2>
                                Input
                            </h2>

                            <pre>
                                {problem.input_format}
                            </pre>

                        </div>
                    )}

                    {problem.output_format && (
                        <div className="solve-section">

                            <h2>
                                Output
                            </h2>

                            <pre>
                                {problem.output_format}
                            </pre>

                        </div>
                    )}

                    {problem.constraints && (
                        <div className="solve-section">

                            <h2>
                                Constraints
                            </h2>

                            <pre>
                                {problem.constraints}
                            </pre>

                        </div>
                    )}

                    {problem.sample_input && (
                        <div className="solve-section">

                            <h2>
                                Example
                            </h2>

                            <div className="example-card">

                                <div className="example-block">

                                    <span>
                                        Input
                                    </span>

                                    <pre>
                                        {problem.sample_input}
                                    </pre>

                                </div>

                                <div className="example-block">

                                    <span>
                                        Output
                                    </span>

                                    <pre>
                                        {problem.sample_output}
                                    </pre>

                                </div>

                            </div>

                        </div>
                    )}

                    {problem.explanation && (
                        <div className="solve-section">

                            <h2>
                                Explanation
                            </h2>

                            <p>
                                {problem.explanation}
                            </p>

                        </div>
                    )}

                </section>

                {/* RIGHT: Editor */}
                <section className="solve-editor-panel">

                    <div className="solve-editor-header">

                        <div>
                            <span className="editor-label">
                                YOUR SOLUTION
                            </span>

                            <h2>
                                Write your code
                            </h2>
                        </div>

                        <span className="editor-hint">
                            Run your code before submitting.
                        </span>

                    </div>

                    <CodeEditor
                        problemId={problem.id}
                    />

                </section>

            </main>

        </div>
    );
}

export default SolveProblemPage;