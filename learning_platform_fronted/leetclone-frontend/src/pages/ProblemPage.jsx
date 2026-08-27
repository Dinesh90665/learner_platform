import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import axiosClient from "../api/axiosClient";
import "../styles/ProblemPage.css";

function ProblemPage() {
    const [problems, setProblems] = useState([]);
    const [search, setSearch] = useState("");
    const [difficulty, setDifficulty] = useState("All");

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        fetchProblems();
    }, []);

    const fetchProblems = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await axiosClient.get(
                "problems/"
            );

            // Works with both normal DRF response and paginated response
            const data = response.data;

            if (Array.isArray(data)) {
                setProblems(data);
            } else if (Array.isArray(data.results)) {
                setProblems(data.results);
            } else {
                setProblems([]);
            }

        } catch (err) {
            console.error(err);
            setError("Unable to load problems.");
        } finally {
            setLoading(false);
        }
    };

    const filteredProblems = useMemo(() => {
        return problems.filter((problem) => {
            const matchesSearch =
                problem.title
                    ?.toLowerCase()
                    .includes(search.toLowerCase());

            const matchesDifficulty =
                difficulty === "All" ||
                problem.difficulty === difficulty;

            return matchesSearch && matchesDifficulty;
        });
    }, [problems, search, difficulty]);

    const getDifficultyClass = (value) => {
        if (value === "Easy") return "difficulty-easy";
        if (value === "Medium") return "difficulty-medium";
        if (value === "Hard") return "difficulty-hard";

        return "";
    };

    if (loading) {
        return (
            <div className="problems-loading">
                <div className="problems-spinner"></div>
                <p>Loading problems...</p>
            </div>
        );
    }

    return (
        <div className="problems-page">

            <div className="problems-container">

                {/* Header */}

                <div className="problems-header">

                    <div>
                        <p className="problems-label">
                            PRACTICE
                        </p>

                        <h1>
                            Coding Problems
                        </h1>

                        <p className="problems-subtitle">
                            Sharpen your programming skills by
                            solving problems from easy to hard.
                        </p>
                    </div>

                    <div className="problem-count">
                        <strong>
                            {filteredProblems.length}
                        </strong>
                        <span>
                            Problems
                        </span>
                    </div>

                </div>

                {/* Controls */}

                <div className="problem-controls">

                    <div className="problem-search">
                        <span className="search-icon">
                            ⌕
                        </span>

                        <input
                            type="text"
                            placeholder="Search problems..."
                            value={search}
                            onChange={(e) =>
                                setSearch(e.target.value)
                            }
                        />
                    </div>

                    <div className="difficulty-filters">

                        {["All", "Easy", "Medium", "Hard"].map(
                            (item) => (
                                <button
                                    key={item}
                                    className={
                                        difficulty === item
                                            ? "difficulty-filter active"
                                            : "difficulty-filter"
                                    }
                                    onClick={() =>
                                        setDifficulty(item)
                                    }
                                >
                                    {item}
                                </button>
                            )
                        )}

                    </div>

                </div>

                {/* Error */}

                {error && (
                    <div className="problems-error">
                        {error}
                    </div>
                )}

                {/* Table */}

                <div className="problems-card">

                    <div className="problem-table-header">

                        <span className="col-number">
                            #
                        </span>

                        <span className="col-title">
                            Problem
                        </span>

                        <span className="col-difficulty">
                            Difficulty
                        </span>

                        <span className="col-action">
                        </span>

                    </div>

                    {filteredProblems.length === 0 ? (
                        <div className="empty-problems">
                            <div className="empty-icon">
                                ?
                            </div>

                            <h3>
                                No problems found
                            </h3>

                            <p>
                                Try changing your search or
                                difficulty filter.
                            </p>
                        </div>
                    ) : (
                        filteredProblems.map(
                            (problem, index) => (
                                <Link
                                    key={problem.id}
                                    to={`/problems/${problem.slug}`}
                                    className="problem-row"
                                >

                                    <span className="col-number problem-number">
                                        {index + 1}
                                    </span>

                                    <span className="col-title">
                                        <strong>
                                            {problem.title}
                                        </strong>

                                        <small>
                                            {problem.slug}
                                        </small>
                                    </span>

                                    <span className="col-difficulty">
                                        <span
                                            className={`difficulty-badge ${getDifficultyClass(
                                                problem.difficulty
                                            )}`}
                                        >
                                            {problem.difficulty}
                                        </span>
                                    </span>

                                    <span className="col-action">
                                        →
                                    </span>

                                </Link>
                            )
                        )
                    )}

                </div>

            </div>

        </div>
    );
}

export default ProblemPage;