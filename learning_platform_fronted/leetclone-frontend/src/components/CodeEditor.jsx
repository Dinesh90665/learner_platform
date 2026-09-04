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

function CodeEditor({
    problemId,
    language,
    sourceCode,
    onLanguageChange,
    onCodeChange,
    onResult,
}) {
    const [status, setStatus] = useState("");

    const [output, setOutput] = useState("");

    const [error, setError] = useState("");

    const [executionTime, setExecutionTime] =
        useState(null);

    const [isRunning, setIsRunning] =
        useState(false);

    const [isSubmitting, setIsSubmitting] =
        useState(false);

    const busy =
        isRunning || isSubmitting;

    const clearResult = () => {
        setStatus("");
        setOutput("");
        setError("");
        setExecutionTime(null);

        if (onResult) {
            onResult({
                status: "",
                output: "",
                error: "",
            });
        }
    };

    const handleLanguageChange = (event) => {
        const selectedLanguage =
            event.target.value;

        onLanguageChange(
            selectedLanguage
        );

        clearResult();
    };

    const resetCode = () => {
        onCodeChange(
            starterCode[language]
        );

        clearResult();
    };

    const runCode = async () => {
        if (!sourceCode.trim()) {
            setError(
                "Please write some code first."
            );

            return;
        }

        setIsRunning(true);

        setStatus("running");
        setOutput("");
        setError("");
        setExecutionTime(null);

        try {
            const response =
                await axiosClient.post(
                    "submissions/run/",
                    {
                        problem: problemId,
                        language,
                        source_code:
                            sourceCode,
                    }
                );

            const data =
                response.data;

            setStatus(
                data.status || ""
            );

            setOutput(
                data.output || ""
            );

            setError(
                data.error || ""
            );

            setExecutionTime(
                data.execution_time ??
                    null
            );

            if (onResult) {
                onResult(data);
            }

        } catch (err) {
            console.error(
                "Run error:",
                err
            );

            const message =
                err.response?.data
                    ?.detail ||
                "Unable to run your code.";

            setStatus("");
            setError(message);

            if (onResult) {
                onResult({
                    status: "",
                    output: "",
                    error: message,
                });
            }

        } finally {
            setIsRunning(false);
        }
    };

    const submitCode = async () => {
        if (!sourceCode.trim()) {
            setError(
                "Please write some code first."
            );

            return;
        }

        setIsSubmitting(true);

        setStatus("running");
        setOutput("");
        setError("");
        setExecutionTime(null);

        try {
            const response =
                await axiosClient.post(
                    "submissions/",
                    {
                        problem: problemId,
                        language,
                        source_code:
                            sourceCode,
                    }
                );

            const data =
                response.data;

            setStatus(
                data.status || ""
            );

            setOutput(
                data.output || ""
            );

            setError(
                data.error || ""
            );

            setExecutionTime(
                data.execution_time ??
                    null
            );

            if (onResult) {
                onResult(data);
            }

        } catch (err) {
            console.error(
                "Submit error:",
                err
            );

            const message =
                err.response?.data
                    ?.detail ||
                "Unable to submit your code.";

            setStatus("");
            setError(message);

            if (onResult) {
                onResult({
                    status: "",
                    output: "",
                    error: message,
                });
            }

        } finally {
            setIsSubmitting(false);
        }
    };

    const getMonacoLanguage = () => {
        if (language === "cpp") {
            return "cpp";
        }

        if (language === "java") {
            return "java";
        }

        return "python";
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
                          .replaceAll(
                              "_",
                              " "
                          )
                          .replace(
                              /\b\w/g,
                              (char) =>
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
                        onChange={
                            handleLanguageChange
                        }
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

            {/* Monaco */}

            <div className="monaco-wrapper">

                <Editor
                    height="500px"
                    language={
                        getMonacoLanguage()
                    }
                    theme="vs-dark"
                    value={sourceCode}
                    onChange={(value) =>
                        onCodeChange(
                            value || ""
                        )
                    }
                    options={{
                        fontSize: 14,
                        minimap: {
                            enabled: false,
                        },
                        automaticLayout: true,
                        tabSize: 4,
                        insertSpaces: true,
                        wordWrap: "on",
                        scrollBeyondLastLine:
                            false,
                        lineNumbers: "on",
                        cursorBlinking:
                            "smooth",
                        padding: {
                            top: 16,
                            bottom: 16,
                        },
                    }}
                />

            </div>

            {/* Results */}

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

                {status === "accepted" && (
                    <div className="success-result">

                        <div className="success-icon">
                            ✓
                        </div>

                        <div>

                            <strong>
                                All test cases passed
                            </strong>

                            {executionTime !==
                                null && (
                                <span>
                                    {executionTime.toFixed(
                                        3
                                    )}
                                    s
                                </span>
                            )}

                        </div>

                    </div>
                )}

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

                {output &&
                    status !==
                        "accepted" &&
                    status !==
                        "wrong_answer" && (
                        <div className="result-output">

                            <span>
                                Output
                            </span>

                            <pre>
                                {output}
                            </pre>

                        </div>
                    )}

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