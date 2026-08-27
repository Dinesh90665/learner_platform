import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axiosClient from "../api/axiosClient";
import "../styles/SubmissionHistoryPage.css";

function SubmissionHistoryPage() {
    const [submissions, setSubmissions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        fetchSubmissions();
    }, []);

    const fetchSubmissions = async () => {
        try {
            const response = await axiosClient.get(
                "submissions/history/"
            );

            setSubmissions(response.data);
        } catch (err) {
            console.error(err);

            if (err.response?.status === 401) {
                setError("Please log in to view your submissions.");
            } else {
                setError("Unable to load submission history.");
            }
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (date) => {
        return new Date(date).toLocaleString();
    };

    const getStatusClass = (status) => {
        switch (status) {
            case "accepted":
                return "history-status accepted";

            case "wrong_answer":
                return "history-status wrong";

            case "runtime_error":
                return "history-status error";

            case "compilation_error":
                return "history-status error";

            case "time_limit":
                return "history-status error";

            default:
                return "history-status";
        }
    };

    const getStatusText = (status) => {
        switch (status) {
            case "accepted":
                return "Accepted";

            case "wrong_answer":
                return "Wrong Answer";

            case "runtime_error":
                return "Runtime Error";

            case "compilation_error":
                return "Compilation Error";

            case "time_limit":
                return "Time Limit";

            default:
                return status.replaceAll("_", " ");
        }
    };

    const getLanguageName = (language) => {
        switch (language) {
            case "cpp":
                return "C++";

            case "java":
                return "Java";

            case "python":
                return "Python";

            default:
                return language;
        }
    };

    if (loading) {
        return (
            <div className="history-loading">
                <div className="history-spinner"></div>
                <p>Loading submissions...</p>
            </div>
        );
    }

    return (
        <div className="history-page">
            <div className="history-container">

                <div className="history-header">
                    <div>
                        <p className="history-label">
                            ACTIVITY
                        </p>

                        <h1>
                            Submission History
                        </h1>

                        <p className="history-subtitle">
                            Review your previous coding attempts,
                            results, and execution times.
                        </p>
                    </div>

                    <div className="history-count">
                        <strong>
                            {submissions.length}
                        </strong>

                        <span>
                            Submissions
                        </span>
                    </div>
                </div>

                {error && (
                    <div className="history-error">
                        {error}
                    </div>
                )}

                {!error && submissions.length === 0 && (
                    <div className="history-empty">
                        <div className="history-empty-icon">
                            ↗
                        </div>

                        <h2>
                            No submissions yet
                        </h2>

                        <p>
                            Solve a problem and your attempts will
                            appear here.
                        </p>

                        <Link to="/problems">
                            Explore Problems →
                        </Link>
                    </div>
                )}

                {!error && submissions.length > 0 && (
                    <div className="history-card">

                        <div className="history-table-head">
                            <span>Problem</span>
                            <span>Language</span>
                            <span>Status</span>
                            <span>Execution</span>
                            <span>Date</span>
                        </div>

                        {submissions.map((submission) => (
                            <div
                                className="history-row"
                                key={submission.id}
                            >
                                <div className="history-problem">
                                    <Link to={`/problems/${submission.problem_slug}`}>
                                     {submission.problem_title}
                                </Link>

                                    <small>
                                        Submission #{submission.id}
                                    </small>
                                </div>

                                <div className="history-language">
                                    {getLanguageName(
                                        submission.language
                                    )}
                                </div>

                                <div>
                                    <span
                                        className={getStatusClass(
                                            submission.status
                                        )}
                                    >
                                        {getStatusText(
                                            submission.status
                                        )}
                                    </span>
                                </div>

                                <div className="history-time">
                                    {submission.execution_time !==
                                    null
                                        ? `${submission.execution_time.toFixed(
                                              3
                                          )}s`
                                        : "—"}
                                </div>

                                <div className="history-date">
                                    {formatDate(
                                        submission.created_at
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}

            </div>
        </div>
    );
}

export default SubmissionHistoryPage;