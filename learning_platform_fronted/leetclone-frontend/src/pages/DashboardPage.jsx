import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axiosClient from "../api/axiosClient";
import "../styles/DashboardPage.css";

function DashboardPage() {
    const [dashboard, setDashboard] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        fetchDashboard();
    }, []);

    const fetchDashboard = async () => {
        try {
            const response = await axiosClient.get(
                "submissions/dashboard/"
            );

            setDashboard(response.data);
        } catch (err) {
            console.error(err);

            if (err.response?.status === 401) {
                setError("Your session has expired. Please log in again.");
            } else {
                setError("Unable to load dashboard.");
            }
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (date) => {
        return new Date(date).toLocaleString();
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

    const getStatusClass = (status) => {
        switch (status) {
            case "accepted":
                return "dashboard-status accepted";

            case "wrong_answer":
                return "dashboard-status wrong";

            case "runtime_error":
            case "compilation_error":
            case "time_limit":
                return "dashboard-status error";

            default:
                return "dashboard-status";
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

    if (loading) {
        return (
            <div className="dashboard-loading">
                <div className="dashboard-spinner"></div>
                <p>Loading dashboard...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="dashboard-error-page">
                <h2>{error}</h2>

                <Link to="/login">
                    Go to Login
                </Link>
            </div>
        );
    }

    const stats = dashboard.statistics;
    const difficulty = dashboard.difficulty;

    const totalSolved =
        difficulty.easy +
        difficulty.medium +
        difficulty.hard;

    return (
        <div className="dashboard-page">

            <div className="dashboard-container">

                {/* Header */}
                <div className="dashboard-header">

                    <div>
                        <p className="dashboard-label">
                            OVERVIEW
                        </p>

                        <h1>
                            Welcome back, {dashboard.username} 👋
                        </h1>

                        <p className="dashboard-subtitle">
                            Keep practicing and build your programming
                            skills one problem at a time.
                        </p>
                    </div>

                    <Link
                        to="/problems"
                        className="dashboard-practice-button"
                    >
                        Practice Problems →
                    </Link>

                </div>

                {/* Statistics */}
                <div className="dashboard-stats">

                    <div className="dashboard-stat-card">

                        <div className="dashboard-stat-icon blue">
                            ✓
                        </div>

                        <div>
                            <span>
                                Problems Solved
                            </span>

                            <strong>
                                {stats.solved_problems}
                            </strong>
                        </div>

                    </div>

                    <div className="dashboard-stat-card">

                        <div className="dashboard-stat-icon purple">
                            #
                        </div>

                        <div>
                            <span>
                                Total Submissions
                            </span>

                            <strong>
                                {stats.total_submissions}
                            </strong>
                        </div>

                    </div>

                    <div className="dashboard-stat-card">

                        <div className="dashboard-stat-icon green">
                            %
                        </div>

                        <div>
                            <span>
                                Success Rate
                            </span>

                            <strong>
                                {stats.success_rate}%
                            </strong>
                        </div>

                    </div>

                    <div className="dashboard-stat-card">

                        <div className="dashboard-stat-icon orange">
                            !
                        </div>

                        <div>
                            <span>
                                Wrong Answers
                            </span>

                            <strong>
                                {stats.wrong_answers}
                            </strong>
                        </div>

                    </div>

                </div>

                {/* Main dashboard grid */}
                <div className="dashboard-grid">

                    {/* Difficulty */}
                    <section className="dashboard-card">

                        <div className="dashboard-card-header">

                            <div>
                                <h2>
                                    Problem Progress
                                </h2>

                                <p>
                                    Your solved problems by difficulty.
                                </p>
                            </div>

                            <Link to="/problems">
                                View Problems
                            </Link>

                        </div>

                        <div className="difficulty-total">
                            <strong>
                                {totalSolved}
                            </strong>

                            <span>
                                total solved
                            </span>
                        </div>

                        <div className="difficulty-bars">

                            <div className="difficulty-row">

                                <div className="difficulty-row-head">
                                    <span className="difficulty-name easy-text">
                                        Easy
                                    </span>

                                    <strong>
                                        {difficulty.easy}
                                    </strong>
                                </div>

                                <div className="progress-track">
                                    <div
                                        className="progress-fill easy-fill"
                                        style={{
                                            width: `${
                                                totalSolved
                                                    ? (difficulty.easy /
                                                          totalSolved) *
                                                      100
                                                    : 0
                                            }%`,
                                        }}
                                    ></div>
                                </div>

                            </div>

                            <div className="difficulty-row">

                                <div className="difficulty-row-head">
                                    <span className="difficulty-name medium-text">
                                        Medium
                                    </span>

                                    <strong>
                                        {difficulty.medium}
                                    </strong>
                                </div>

                                <div className="progress-track">
                                    <div
                                        className="progress-fill medium-fill"
                                        style={{
                                            width: `${
                                                totalSolved
                                                    ? (difficulty.medium /
                                                          totalSolved) *
                                                      100
                                                    : 0
                                            }%`,
                                        }}
                                    ></div>
                                </div>

                            </div>

                            <div className="difficulty-row">

                                <div className="difficulty-row-head">
                                    <span className="difficulty-name hard-text">
                                        Hard
                                    </span>

                                    <strong>
                                        {difficulty.hard}
                                    </strong>
                                </div>

                                <div className="progress-track">
                                    <div
                                        className="progress-fill hard-fill"
                                        style={{
                                            width: `${
                                                totalSolved
                                                    ? (difficulty.hard /
                                                          totalSolved) *
                                                      100
                                                    : 0
                                            }%`,
                                        }}
                                    ></div>
                                </div>

                            </div>

                        </div>

                    </section>

                    {/* Success Rate */}
                    <section className="dashboard-card">

                        <div className="dashboard-card-header">

                            <div>
                                <h2>
                                    Submission Accuracy
                                </h2>

                                <p>
                                    How often your submissions succeed.
                                </p>
                            </div>

                        </div>

                        <div className="accuracy-content">

                            <div
                                className="accuracy-ring"
                                style={{
                                    "--accuracy":
                                        `${stats.success_rate}%`,
                                }}
                            >
                                <div className="accuracy-ring-inner">
                                    <strong>
                                        {stats.success_rate}%
                                    </strong>

                                    <span>
                                        Success
                                    </span>
                                </div>
                            </div>

                            <div className="accuracy-details">

                                <div>
                                    <span>Accepted</span>
                                    <strong>
                                        {stats.accepted_submissions}
                                    </strong>
                                </div>

                                <div>
                                    <span>Wrong</span>
                                    <strong>
                                        {stats.wrong_answers}
                                    </strong>
                                </div>

                                <div>
                                    <span>Total</span>
                                    <strong>
                                        {stats.total_submissions}
                                    </strong>
                                </div>

                            </div>

                        </div>

                    </section>

                </div>

                {/* Recent submissions */}
                <section className="dashboard-card recent-submissions">

                    <div className="dashboard-card-header">

                        <div>
                            <h2>
                                Recent Submissions
                            </h2>

                            <p>
                                Your latest coding activity.
                            </p>
                        </div>

                        <Link to="/submissions">
                            View All
                        </Link>

                    </div>

                    {dashboard.recent_submissions.length === 0 ? (
                        <div className="dashboard-empty">

                            <div className="dashboard-empty-icon">
                                ↗
                            </div>

                            <h3>
                                No submissions yet
                            </h3>

                            <p>
                                Solve your first problem to see your
                                activity here.
                            </p>

                            <Link to="/problems">
                                Start Practicing →
                            </Link>

                        </div>
                    ) : (
                        <div className="recent-table">

                            <div className="recent-table-head">
                                <span>Problem</span>
                                <span>Language</span>
                                <span>Status</span>
                                <span>Time</span>
                                <span>Date</span>
                            </div>

                            {dashboard.recent_submissions.map(
                                (submission) => (
                                    <div
                                        className="recent-row"
                                        key={submission.id}
                                    >

                                        <div className="recent-problem">
                                            <Link
                                                to={`/problems/${submission.problem_slug}`}
                                            >
                                                {submission.problem}
                                            </Link>

                                            <small>
                                                Submission #
                                                {submission.id}
                                            </small>
                                        </div>

                                        <div className="recent-language">
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

                                        <div className="recent-time">
                                            {submission.execution_time !==
                                            null
                                                ? `${submission.execution_time.toFixed(
                                                      3
                                                  )}s`
                                                : "—"}
                                        </div>

                                        <div className="recent-date">
                                            {formatDate(
                                                submission.created_at
                                            )}
                                        </div>

                                    </div>
                                )
                            )}

                        </div>
                    )}

                </section>

            </div>

        </div>
    );
}

export default DashboardPage;