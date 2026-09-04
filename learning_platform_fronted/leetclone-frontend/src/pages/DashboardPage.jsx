import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axiosClient from "../api/axiosClient";
import "../styles/DashboardPage.css";

function DashboardPage() {
    const [dashboard, setDashboard] = useState(null);
    const [streak, setStreak] = useState({
        current_streak: 0,
        longest_streak: 0,
        last_solved_date: null,
    });

    const [loading, setLoading] = useState(true);
    const [streakLoading, setStreakLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        fetchDashboard();
        fetchStreak();
    }, []);

    /* =========================================
       DASHBOARD
    ========================================= */

    const fetchDashboard = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await axiosClient.get(
                "submissions/dashboard/"
            );

            setDashboard(response.data);
        } catch (err) {
            console.error(
                "Dashboard error:",
                err
            );

            if (err.response?.status === 401) {
                setError(
                    "Your session has expired. Please log in again."
                );
            } else {
                setError(
                    "Unable to load dashboard."
                );
            }
        } finally {
            setLoading(false);
        }
    };

    /* =========================================
       STREAK
    ========================================= */

    const fetchStreak = async () => {
        try {
            setStreakLoading(true);

            const response = await axiosClient.get(
                "users/streak/"
            );

            setStreak(
                response.data || {
                    current_streak: 0,
                    longest_streak: 0,
                    last_solved_date: null,
                }
            );
        } catch (err) {
            console.error(
                "Streak error:",
                err
            );

            // Don't break the dashboard
            // if the streak endpoint fails.
            setStreak({
                current_streak: 0,
                longest_streak: 0,
                last_solved_date: null,
            });
        } finally {
            setStreakLoading(false);
        }
    };

    /* =========================================
       FORMATTERS
    ========================================= */

    const formatDate = (date) => {
        if (!date) {
            return "—";
        }

        const parsedDate = new Date(date);

        if (Number.isNaN(parsedDate.getTime())) {
            return date;
        }

        return parsedDate.toLocaleString();
    };

    const formatSolvedDate = (date) => {
        if (!date) {
            return "No problem solved yet";
        }

        const parsedDate = new Date(`${date}T00:00:00`);

        if (Number.isNaN(parsedDate.getTime())) {
            return date;
        }

        return parsedDate.toLocaleDateString(
            undefined,
            {
                year: "numeric",
                month: "short",
                day: "numeric",
            }
        );
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
                return language || "—";
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
                return status
                    ? status
                          .replaceAll("_", " ")
                          .replace(
                              /\b\w/g,
                              (char) =>
                                  char.toUpperCase()
                          )
                    : "Unknown";
        }
    };

    /* =========================================
       LOADING
    ========================================= */

    if (loading) {
        return (
            <div className="dashboard-loading">

                <div className="dashboard-spinner"></div>

                <p>
                    Loading dashboard...
                </p>

            </div>
        );
    }

    /* =========================================
       ERROR
    ========================================= */

    if (error) {
        return (
            <div className="dashboard-error-page">

                <h2>
                    {error}
                </h2>

                <Link to="/login">
                    Go to Login
                </Link>

            </div>
        );
    }

    /* =========================================
       SAFE DATA
    ========================================= */

    const stats =
        dashboard?.statistics || {
            solved_problems: 0,
            total_submissions: 0,
            accepted_submissions: 0,
            wrong_answers: 0,
            success_rate: 0,
        };

    const difficulty =
        dashboard?.difficulty || {
            easy: 0,
            medium: 0,
            hard: 0,
        };

    const recentSubmissions =
        dashboard?.recent_submissions || [];

    const totalSolved =
        Number(difficulty.easy || 0) +
        Number(difficulty.medium || 0) +
        Number(difficulty.hard || 0);

    const currentStreak =
        Number(streak.current_streak || 0);

    const longestStreak =
        Number(streak.longest_streak || 0);

    return (
        <div className="dashboard-page">

            <div className="dashboard-container">

                {/* =================================
                    HEADER
                ================================= */}

                <div className="dashboard-header">

                    <div>

                        <p className="dashboard-label">
                            OVERVIEW
                        </p>

                        <h1>
                            Welcome back,{" "}
                            {dashboard.username} 👋
                        </h1>

                        <p className="dashboard-subtitle">
                            Keep practicing and build your
                            programming skills one problem
                            at a time.
                        </p>

                    </div>

                    <Link
                        to="/problems"
                        className="dashboard-practice-button"
                    >
                        Practice Problems →
                    </Link>

                </div>

                {/* =================================
                    MAIN STATISTICS
                ================================= */}

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

                {/* =================================
                    STREAK
                ================================= */}

                <section className="dashboard-streak-card">

                    <div className="dashboard-streak-main">

                        <div className="dashboard-streak-icon">
                            🔥
                        </div>

                        <div>

                            <p className="dashboard-streak-label">
                                CURRENT STREAK
                            </p>

                            <div className="dashboard-streak-number">
                                {streakLoading
                                    ? "..."
                                    : currentStreak}
                            </div>

                            <span className="dashboard-streak-days">
                                {currentStreak === 1
                                    ? "day"
                                    : "days"}
                            </span>

                        </div>

                    </div>

                    <div className="dashboard-streak-divider"></div>

                    <div className="dashboard-streak-info">

                        <div>
                            <span>
                                Longest streak
                            </span>

                            <strong>
                                {streakLoading
                                    ? "..."
                                    : `${longestStreak} ${
                                          longestStreak ===
                                          1
                                              ? "day"
                                              : "days"
                                      }`}
                            </strong>
                        </div>

                        <div>
                            <span>
                                Last solved
                            </span>

                            <strong>
                                {streakLoading
                                    ? "..."
                                    : formatSolvedDate(
                                          streak.last_solved_date
                                      )}
                            </strong>
                        </div>

                    </div>

                    <Link
                        to="/problems"
                        className="dashboard-streak-button"
                    >
                        Keep the streak →
                    </Link>

                </section>

                {/* =================================
                    MAIN GRID
                ================================= */}

                <div className="dashboard-grid">

                    {/* Difficulty */}

                    <section className="dashboard-card">

                        <div className="dashboard-card-header">

                            <div>
                                <h2>
                                    Problem Progress
                                </h2>

                                <p>
                                    Your solved problems
                                    by difficulty.
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

                    {/* Accuracy */}

                    <section className="dashboard-card">

                        <div className="dashboard-card-header">

                            <div>
                                <h2>
                                    Submission Accuracy
                                </h2>

                                <p>
                                    How often your
                                    submissions succeed.
                                </p>
                            </div>

                        </div>

                        <div className="accuracy-content">

                            <div
                                className="accuracy-ring"
                                style={{
                                    "--accuracy": `${stats.success_rate}%`,
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
                                    <span>
                                        Accepted
                                    </span>

                                    <strong>
                                        {
                                            stats.accepted_submissions
                                        }
                                    </strong>
                                </div>

                                <div>
                                    <span>
                                        Wrong
                                    </span>

                                    <strong>
                                        {stats.wrong_answers}
                                    </strong>
                                </div>

                                <div>
                                    <span>
                                        Total
                                    </span>

                                    <strong>
                                        {stats.total_submissions}
                                    </strong>
                                </div>

                            </div>

                        </div>

                    </section>

                </div>

                {/* =================================
                    RECENT SUBMISSIONS
                ================================= */}

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

                    {recentSubmissions.length === 0 ? (
                        <div className="dashboard-empty">

                            <div className="dashboard-empty-icon">
                                ↗
                            </div>

                            <h3>
                                No submissions yet
                            </h3>

                            <p>
                                Solve your first problem
                                to see your activity here.
                            </p>

                            <Link to="/problems">
                                Start Practicing →
                            </Link>

                        </div>
                    ) : (
                        <div className="recent-table">

                            <div className="recent-table-head">
                                <span>
                                    Problem
                                </span>

                                <span>
                                    Language
                                </span>

                                <span>
                                    Status
                                </span>

                                <span>
                                    Time
                                </span>

                                <span>
                                    Date
                                </span>
                            </div>

                            {recentSubmissions.map(
                                (submission) => (
                                    <div
                                        className="recent-row"
                                        key={
                                            submission.id
                                        }
                                    >

                                        <div className="recent-problem">

                                            <Link
                                                to={`/problems/${submission.problem_slug}`}
                                            >
                                                {
                                                    submission.problem
                                                }
                                            </Link>

                                            <small>
                                                Submission #
                                                {
                                                    submission.id
                                                }
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
                                            null &&
                                            submission.execution_time !==
                                                undefined
                                                ? `${Number(
                                                      submission.execution_time
                                                  ).toFixed(3)}s`
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