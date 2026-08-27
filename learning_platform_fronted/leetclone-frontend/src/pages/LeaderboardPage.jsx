import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import axiosClient from "../api/axiosClient";
import "../styles/LeaderboardPage.css";

function LeaderboardPage() {
    const [leaderboard, setLeaderboard] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        fetchLeaderboard();
    }, []);

    const fetchLeaderboard = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await axiosClient.get("leaderboard/");

            setLeaderboard(response.data?.leaderboard || []);
        } catch (err) {
            console.error("Leaderboard error:", err);

            if (err.response?.status === 401) {
                setError("Please log in to view the leaderboard.");
            } else {
                setError("Unable to load the leaderboard.");
            }
        } finally {
            setLoading(false);
        }
    };

    const currentUsername = localStorage.getItem("username");

    const currentUser = useMemo(() => {
        return leaderboard.find(
            (user) => user.username === currentUsername
        );
    }, [leaderboard, currentUsername]);

    const getInitial = (username) => {
        return username?.charAt(0).toUpperCase() || "U";
    };

    const getRankLabel = (rank) => {
        if (rank === 1) return "01";
        if (rank === 2) return "02";
        if (rank === 3) return "03";

        return String(rank).padStart(2, "0");
    };

    const getRankClass = (rank) => {
        if (rank === 1) return "rank-one";
        if (rank === 2) return "rank-two";
        if (rank === 3) return "rank-three";

        return "";
    };

    if (loading) {
        return (
            <div className="leaderboard-loading-page">
                <div className="leaderboard-loader"></div>
                <p>Loading rankings...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="leaderboard-message-page">
                <div className="leaderboard-message-card">
                    <div className="message-icon">!</div>

                    <h2>Leaderboard unavailable</h2>

                    <p>{error}</p>

                    <button
                        type="button"
                        className="retry-button"
                        onClick={fetchLeaderboard}
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="leaderboard-page">

            <div className="leaderboard-content">

                {/* Header */}
                <section className="leaderboard-hero">

                    <div>
                        <div className="eyebrow">
                            LEARNER COMMUNITY
                        </div>

                        <h1>
                            Coding Leaderboard
                        </h1>

                        <p>
                            Track your progress, compare your results,
                            and keep pushing your coding skills forward.
                        </p>
                    </div>

                    <div className="leaderboard-total-card">
                        <span>ACTIVE LEARNERS</span>
                        <strong>{leaderboard.length}</strong>
                    </div>

                </section>

                {/* Main layout */}
                <div className="leaderboard-main">

                    {/* Rankings */}
                    <section className="rankings-card">

                        <div className="rankings-topbar">

                            <div>
                                <h2>Global Rankings</h2>

                                <p>
                                    Ranked by solved problems and accepted
                                    submissions.
                                </p>
                            </div>

                            <button
                                type="button"
                                className="refresh-button"
                                onClick={fetchLeaderboard}
                            >
                                ↻ Refresh
                            </button>

                        </div>

                        {leaderboard.length === 0 ? (
                            <div className="leaderboard-empty">
                                <div className="empty-icon">#</div>

                                <h3>No rankings yet</h3>

                                <p>
                                    Start solving problems to appear
                                    on the leaderboard.
                                </p>

                                <Link to="/problems">
                                    Explore Problems →
                                </Link>
                            </div>
                        ) : (
                            <div className="ranking-list">

                                {leaderboard.map((user) => (
                                    <div
                                        key={user.username}
                                        className={`ranking-row ${getRankClass(
                                            user.rank
                                        )} ${
                                            currentUsername ===
                                            user.username
                                                ? "current-user"
                                                : ""
                                        }`}
                                    >

                                        <div className="rank-number">
                                            {getRankLabel(user.rank)}
                                        </div>

                                        <div className="rank-user">

                                            <div className="rank-avatar">
                                                {getInitial(
                                                    user.username
                                                )}
                                            </div>

                                            <div className="rank-user-info">

                                                <div className="rank-name-line">

                                                    <strong>
                                                        {user.username}
                                                    </strong>

                                                    {currentUsername ===
                                                        user.username && (
                                                        <span className="you-tag">
                                                            YOU
                                                        </span>
                                                    )}

                                                </div>

                                                <span>
                                                    {user.solved_problems}{" "}
                                                    problems solved
                                                </span>

                                            </div>

                                        </div>

                                        <div className="rank-stat">
                                            <span>SOLVED</span>
                                            <strong>
                                                {user.solved_problems}
                                            </strong>
                                        </div>

                                        <div className="rank-stat">
                                            <span>ACCEPTED</span>
                                            <strong>
                                                {user.accepted_submissions}
                                            </strong>
                                        </div>

                                        <div className="rank-stat success">
                                            <span>SUCCESS</span>
                                            <strong>
                                                {user.success_rate}%
                                            </strong>
                                        </div>

                                    </div>
                                ))}

                            </div>
                        )}

                    </section>

                    {/* Side panel */}
                    <aside className="leaderboard-side">

                        {currentUser ? (
                            <div className="your-rank-card">

                                <div className="your-rank-label">
                                    YOUR POSITION
                                </div>

                                <div className="your-rank-number">
                                    #{currentUser.rank}
                                </div>

                                <div className="your-rank-profile">

                                    <div className="your-avatar">
                                        {getInitial(
                                            currentUser.username
                                        )}
                                    </div>

                                    <div>
                                        <strong>
                                            {currentUser.username}
                                        </strong>

                                        <span>
                                            Keep going 🚀
                                        </span>
                                    </div>

                                </div>

                                <div className="your-stats">

                                    <div>
                                        <span>Solved</span>
                                        <strong>
                                            {
                                                currentUser.solved_problems
                                            }
                                        </strong>
                                    </div>

                                    <div>
                                        <span>Accepted</span>
                                        <strong>
                                            {
                                                currentUser.accepted_submissions
                                            }
                                        </strong>
                                    </div>

                                    <div>
                                        <span>Success</span>
                                        <strong>
                                            {currentUser.success_rate}%
                                        </strong>
                                    </div>

                                </div>

                                <Link
                                    to="/problems"
                                    className="practice-link"
                                >
                                    Solve More Problems →
                                </Link>

                            </div>
                        ) : (
                            <div className="your-rank-card guest-rank-card">

                                <div className="guest-icon">
                                    ★
                                </div>

                                <h3>
                                    Want to appear here?
                                </h3>

                                <p>
                                    Start solving problems and
                                    build your ranking.
                                </p>

                                <Link
                                    to="/problems"
                                    className="practice-link"
                                >
                                    Start Practicing →
                                </Link>

                            </div>
                        )}

                        <div className="leaderboard-tip-card">

                            <div className="tip-label">
                                RANKING SYSTEM
                            </div>

                            <h3>
                                How ranking works
                            </h3>

                            <p>
                                More solved problems move you higher.
                                Accepted submissions break ties.
                            </p>

                            <div className="ranking-rule">
                                <span>01</span>
                                <div>
                                    <strong>Problems solved</strong>
                                    <small>Primary ranking</small>
                                </div>
                            </div>

                            <div className="ranking-rule">
                                <span>02</span>
                                <div>
                                    <strong>Accepted submissions</strong>
                                    <small>Tie breaker</small>
                                </div>
                            </div>

                            <div className="ranking-rule">
                                <span>03</span>
                                <div>
                                    <strong>Success rate</strong>
                                    <small>Final tie breaker</small>
                                </div>
                            </div>

                        </div>

                    </aside>

                </div>

            </div>

        </div>
    );
}

export default LeaderboardPage;