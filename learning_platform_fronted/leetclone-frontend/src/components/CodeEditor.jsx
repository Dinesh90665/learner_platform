import Editor from "@monaco-editor/react";
import { useState } from "react";
import axiosClient from "../api/axiosClient";
import "../styles/CodeEditor.css";

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

function CodeEditor({ problemId }) {
    const [language, setLanguage] = useState("python");

    const [sourceCode, setSourceCode] = useState(
        starterCode.python
    );

    const [status, setStatus] = useState("");
    const [output, setOutput] = useState("");
    const [error, setError] = useState("");
    const [executionTime, setExecutionTime] = useState(null);

    const [isRunning, setIsRunning] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const busy = isRunning || isSubmitting;

    const clearResult = () => {
        setStatus("");
        setOutput("");
        setError("");
        setExecutionTime(null);
    };

    const handleLanguageChange = (event) => {
        const selectedLanguage = event.target.value;

        setLanguage(selectedLanguage);
        setSourceCode(starterCode[selectedLanguage]);

        clearResult();
    };

    const resetCode = () => {
        setSourceCode(starterCode[language]);

        clearResult();
    };

    const runCode = async () => {
        if (!sourceCode.trim()) {
            setError("Please write some code first.");
            return;
        }

        setIsRunning(true);

        setStatus("running");
        setOutput("");
        setError("");
        setExecutionTime(null);

        console.log("RUN REQUEST:", {
            problem: problemId,
            language,
            source_code: sourceCode,
        });

        try {
            const response = await axiosClient.post(
                "submissions/run/",
                {
                    problem: problemId,
                    language: language,
                    source_code: sourceCode,
                }
            );

            console.log(
                "RUN RESPONSE:",
                response.data
            );

            const data = response.data;

            setStatus(data.status || "");
            setOutput(data.output || "");
            setError(data.error || "");

            setExecutionTime(
                data.execution_time ?? null
            );

        } catch (err) {
            console.error(
                "RUN ERROR:",
                err
            );

            setStatus("");

            setError(
                err.response?.data?.detail ||
                "Unable to run your code."
            );
        } finally {
            console.log("RUN FINISHED");

            setIsRunning(false);
        }
    };

    const submitCode = async () => {
        if (!sourceCode.trim()) {
            setError("Please write some code first.");
            return;
        }

        setIsSubmitting(true);

        setStatus("running");
        setOutput("");
        setError("");
        setExecutionTime(null);

        console.log("SUBMIT REQUEST:", {
            problem: problemId,
            language,
            source_code: sourceCode,
        });

        try {
            const response = await axiosClient.post(
                "submissions/",
                {
                    problem: problemId,
                    language: language,
                    source_code: sourceCode,
                }
            );

            console.log(
                "SUBMIT RESPONSE:",
                response.data
            );

            const data = response.data;

            setStatus(data.status || "");
            setOutput(data.output || "");
            setError(data.error || "");

            setExecutionTime(
                data.execution_time ?? null
            );

        } catch (err) {
            console.error(
                "SUBMIT ERROR:",
                err
            );

            setStatus("");

            setError(
                err.response?.data?.detail ||
                "Unable to submit your code."
            );
        } finally {
            console.log("SUBMIT FINISHED");

            setIsSubmitting(false);
        }
    };

    const getMonacoLanguage = () => {
        switch (language) {
            case "cpp":
                return "cpp";

            case "java":
                return "java";

            case "python":
            default:
                return "python";
        }
    };

    const getStatusText = () => {
        switch (status) {
            case "accepted":
                return "✓ Accepted";

            case "wrong_answer":
                return "Wrong Answer";

            case "runtime_error":
                return "Runtime Error";

            case "compilation_error":
                return "Compilation Error";

            case "time_limit":
                return "Time Limit Exceeded";

            case "running":
                return "Running...";

            default:
                return status
                    ? status
                          .replaceAll("_", " ")
                          .replace(/\b\w/g, (char) =>
                              char.toUpperCase()
                          )
                    : "";
        }
    };

    return (
        <div className="code-editor-card">

            {/* Toolbar */}
            <div className="editor-toolbar">

                <div className="editor-left-controls">

                    <div className="editor-tab">
                        <span className="editor-file-dot"></span>

                        solution
                    </div>

                    <select
                        value={language}
                        onChange={handleLanguageChange}
                        className="language-select"
                        disabled={busy}
                    >
                        <option value="python">
                            Python
                        </option>

                        <option value="cpp">
                            C++
                        </option>

                        <option value="java">
                            Java
                        </option>
                    </select>

                </div>

                <div className="editor-actions">

                    <button
                        type="button"
                        className="reset-button"
                        onClick={resetCode}
                        disabled={busy}
                    >
                        Reset
                    </button>

                    <button
                        type="button"
                        className="run-button"
                        onClick={runCode}
                        disabled={busy}
                    >
                        {isRunning
                            ? "Running..."
                            : "▶ Run"}
                    </button>

                    <button
                        type="button"
                        className="submit-button"
                        onClick={submitCode}
                        disabled={busy}
                    >
                        {isSubmitting
                            ? "Submitting..."
                            : "Submit"}
                    </button>

                </div>

            </div>

            {/* Monaco Editor */}
            <div className="monaco-wrapper">

                <Editor
                    height="500px"
                    language={getMonacoLanguage()}
                    theme="vs-dark"
                    value={sourceCode}
                    onChange={(value) => {
                        setSourceCode(value || "");
                    }}
                    options={{
                        fontSize: 14,
                        minimap: {
                            enabled: false,
                        },
                        automaticLayout: true,
                        tabSize: 4,
                        insertSpaces: true,
                        wordWrap: "on",
                        scrollBeyondLastLine: false,
                        lineNumbers: "on",
                        cursorBlinking: "smooth",
                        padding: {
                            top: 16,
                            bottom: 16,
                        },
                    }}
                />

            </div>

            {/* Result */}
            <div className="result-panel">

                <div className="result-header">

                    <span>
                        Test Result
                    </span>

                    {status && (
                        <div
                            className={`result-status ${status}`}
                        >
                            {getStatusText()}
                        </div>
                    )}

                </div>

                {/* Accepted */}
                {status === "accepted" && (
                    <div className="success-result">

                        <div className="success-icon">
                            ✓
                        </div>

                        <div>
                            <strong>
                                All test cases passed
                            </strong>

                            {executionTime !== null && (
                                <span>
                                    {executionTime.toFixed(3)}s
                                </span>
                            )}

                        </div>

                    </div>
                )}

                {/* Wrong Answer */}
                {status === "wrong_answer" && (
                    <div className="wrong-result">

                        <strong>
                            Wrong Answer
                        </strong>

                        {output && (
                            <pre>
                                {output}
                            </pre>
                        )}

                    </div>
                )}

                {/* Other output */}
                {output &&
                    status !== "accepted" &&
                    status !== "wrong_answer" && (
                        <div className="result-output">

                            <span>
                                Output
                            </span>

                            <pre>
                                {output}
                            </pre>

                        </div>
                    )}

                {/* Error */}
                {error && (
                    <div className="result-error">

                        <span>
                            Error
                        </span>

                        <pre>
                            {error}
                        </pre>

                    </div>
                )}

                {/* Empty */}
                {!status &&
                    !output &&
                    !error && (
                        <div className="empty-result">
                            Run your code to see the result here.
                        </div>
                    )}

            </div>

        </div>
    );
}

export default CodeEditor;