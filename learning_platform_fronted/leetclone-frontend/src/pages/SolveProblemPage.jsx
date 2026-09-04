import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import axiosClient from "../api/axiosClient";
import AIAssistant from "../components/AiAssistant";
import CodeEditor from "../components/CodeEditor";
import "../styles/SolveProblemPage.css";

const starterCode = {
    python: `def solve():
    # Write your solution here
    pass

solve()
`,

    cpp: `#include <iostream>
using namespace std;

int main() {
    // Write your solution here

    return 0;
}
`,

    java: `public class Main {
    public static void main(String[] args) {
        // Write your solution here
    }
}
`,
};

function SolveProblemPage() {
    const { slug } = useParams();

    const [problem, setProblem] = useState(null);

    const [language, setLanguage] = useState("python");

    const [sourceCode, setSourceCode] = useState(
        starterCode.python
    );

    const [lastError, setLastError] = useState("");

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
            console.error("Problem loading error:", err);

            setError(
                err.response?.status === 404
                    ? "Problem not found."
                    : "Unable to load problem."
            );
        } finally {
            setLoading(false);
        }
    };

    const handleLanguageChange = (newLanguage) => {
        setLanguage(newLanguage);

        setSourceCode(
            starterCode[newLanguage]
        );

        setLastError("");
    };

    const handleCodeChange = (newCode) => {
        setSourceCode(newCode);
    };

    const handleResult = (result) => {
        if (!result) {
            return;
        }

        setLastError(result.error || "");
    };

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
            <div className="solve-error-page">

                <div className="solve-error-card">

                    <div className="solve-error-icon">
                        !
                    </div>

                    <h2>
                        {error || "Problem not found"}
                    </h2>

                    <Link to="/problems">
                        ← Back to Problems
                    </Link>

                </div>

            </div>
        );
    }

    return (
        <div className="solve-page">

            {/* =================================
                HEADER
            ================================= */}

            <header className="solve-header">

                <Link
                    to={`/problems/${problem.slug}`}
                    className="solve-back"
                >
                    ← Back to Problem
                </Link>

                <div className="solve-title">

                    <div
                        className={`solve-difficulty ${
                            problem.difficulty?.toLowerCase()
                        }`}
                    >
                        {problem.difficulty}
                    </div>

                    <h1>
                        {problem.title}
                    </h1>

                </div>

            </header>

            {/* =================================
                MAIN
            ================================= */}

            <main className="solve-layout">

                {/* =================================
                    LEFT PROBLEM
                ================================= */}

                <section className="solve-problem-panel">

                    <div className="solve-content">

                        {problem.description && (
                            <section>
                                <h2>Description</h2>

                                <p>
                                    {problem.description}
                                </p>
                            </section>
                        )}

                        {problem.input_format && (
                            <section>
                                <h2>Input</h2>

                                <pre>
                                    {problem.input_format}
                                </pre>
                            </section>
                        )}

                        {problem.output_format && (
                            <section>
                                <h2>Output</h2>

                                <pre>
                                    {problem.output_format}
                                </pre>
                            </section>
                        )}

                        {problem.constraints && (
                            <section>
                                <h2>Constraints</h2>

                                <pre>
                                    {problem.constraints}
                                </pre>
                            </section>
                        )}

                        {problem.sample_input && (
                            <section>

                                <h2>Example</h2>

                                <div className="solve-example">

                                    <div>
                                        <span>Input</span>

                                        <pre>
                                            {problem.sample_input}
                                        </pre>
                                    </div>

                                    <div>
                                        <span>Output</span>

                                        <pre>
                                            {problem.sample_output}
                                        </pre>
                                    </div>

                                </div>

                            </section>
                        )}

                        {problem.explanation && (
                            <section>
                                <h2>Explanation</h2>

                                <p>
                                    {problem.explanation}
                                </p>
                            </section>
                        )}

                    </div>

                </section>

                {/* =================================
                    RIGHT
                ================================= */}

                <section className="solve-right-panel">

                    <CodeEditor
                        problemId={problem.id}
                        language={language}
                        sourceCode={sourceCode}
                        onLanguageChange={
                            handleLanguageChange
                        }
                        onCodeChange={
                            handleCodeChange
                        }
                        onResult={
                            handleResult
                        }
                    />

                    <AIAssistant
                        problemId={problem.id}
                        language={language}
                        sourceCode={sourceCode}
                        error={lastError}
                    />

                </section>

            </main>

        </div>
    );
}

export default SolveProblemPage;