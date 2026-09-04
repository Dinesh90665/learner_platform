import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import axiosClient from "../api/axiosClient";
import "../styles/ProblemPage.css";

function ProblemPage() {
    const [problems, setProblems] = useState([]);
    const [solvedProblemIds, setSolvedProblemIds] = useState([]);
    const [favoriteProblemIds, setFavoriteProblemIds] = useState([]);

    const [search, setSearch] = useState("");
    const [difficulty, setDifficulty] = useState("All");
    const [topic, setTopic] = useState("All");
    const [statusFilter, setStatusFilter] = useState("All");

    const [loading, setLoading] = useState(true);
    const [progressLoading, setProgressLoading] = useState(true);
    const [favoriteLoading, setFavoriteLoading] = useState(false);

    const [error, setError] = useState("");

    useEffect(() => {
        fetchProblems();
        fetchProgress();
        fetchFavorites();
    }, []);

    /* =========================================
       LOAD PROBLEMS
    ========================================= */

    const fetchProblems = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await axiosClient.get(
                "problems/"
            );

            const data = response.data;

            if (Array.isArray(data)) {
                setProblems(data);
            } else if (Array.isArray(data?.results)) {
                setProblems(data.results);
            } else {
                setProblems([]);
            }
        } catch (err) {
            console.error("Problems error:", err);

            if (err.response?.status === 401) {
                setError(
                    "Please log in to view problems."
                );
            } else {
                setError(
                    "Unable to load problems."
                );
            }
        } finally {
            setLoading(false);
        }
    };

    /* =========================================
       LOAD SOLVED PROBLEMS
    ========================================= */

    const fetchProgress = async () => {
        try {
            setProgressLoading(true);

            const response = await axiosClient.get(
                "submissions/progress/"
            );

            setSolvedProblemIds(
                response.data?.solved_problem_ids || []
            );
        } catch (err) {
            console.error(
                "Progress error:",
                err
            );

            setSolvedProblemIds([]);
        } finally {
            setProgressLoading(false);
        }
    };

    /* =========================================
       LOAD FAVORITES
    ========================================= */

    const fetchFavorites = async () => {
        try {
            const response = await axiosClient.get(
                "problems/favorites/"
            );

            const favoriteIds = (
                Array.isArray(response.data)
                    ? response.data
                    : []
            ).map(
                (favorite) => favorite.problem
            );

            setFavoriteProblemIds(
                favoriteIds
            );
        } catch (err) {
            console.error(
                "Favorites error:",
                err
            );

            setFavoriteProblemIds([]);
        }
    };

    /* =========================================
       CHECK SOLVED
    ========================================= */

    const isSolved = (problemId) => {
        return solvedProblemIds.includes(
            problemId
        );
    };

    /* =========================================
       CHECK FAVORITE
    ========================================= */

    const isFavorite = (problemId) => {
        return favoriteProblemIds.includes(
            problemId
        );
    };

    /* =========================================
       TOGGLE FAVORITE
    ========================================= */

    const toggleFavorite = async (
        event,
        problemId
    ) => {
        event.preventDefault();
        event.stopPropagation();

        if (favoriteLoading) {
            return;
        }

        try {
            setFavoriteLoading(true);

            const response =
                await axiosClient.post(
                    `problems/${problemId}/favorite/`
                );

            const saved =
                response.data?.saved;

            setFavoriteProblemIds(
                (previous) => {
                    if (saved) {
                        if (
                            previous.includes(
                                problemId
                            )
                        ) {
                            return previous;
                        }

                        return [
                            ...previous,
                            problemId,
                        ];
                    }

                    return previous.filter(
                        (id) =>
                            id !== problemId
                    );
                }
            );
        } catch (err) {
            console.error(
                "Toggle favorite error:",
                err
            );

            if (
                err.response?.status === 401
            ) {
                setError(
                    "Please log in to save problems."
                );
            }
        } finally {
            setFavoriteLoading(false);
        }
    };

    /* =========================================
       TOPICS
    ========================================= */

    const topics = useMemo(() => {
        const topicSet = new Set();

        problems.forEach((problem) => {
            if (
                typeof problem.topic === "string" &&
                problem.topic.trim()
            ) {
                topicSet.add(
                    problem.topic.trim()
                );
            }

            if (
                Array.isArray(
                    problem.topics
                )
            ) {
                problem.topics.forEach(
                    (item) => {
                        if (
                            typeof item ===
                                "string" &&
                            item.trim()
                        ) {
                            topicSet.add(
                                item.trim()
                            );
                        }
                    }
                );
            }

            if (
                Array.isArray(
                    problem.tags
                )
            ) {
                problem.tags.forEach(
                    (item) => {
                        if (
                            typeof item ===
                                "string" &&
                            item.trim()
                        ) {
                            topicSet.add(
                                item.trim()
                            );
                        }
                    }
                );
            }
        });

        return Array.from(
            topicSet
        ).sort();
    }, [problems]);

    /* =========================================
       FILTER PROBLEMS
    ========================================= */

    const filteredProblems = useMemo(() => {
        const query = search
            .trim()
            .toLowerCase();

        return problems.filter((problem) => {
            const title =
                problem.title?.toLowerCase() ||
                "";

            const slug =
                problem.slug?.toLowerCase() ||
                "";

            const description =
                problem.description?.toLowerCase() ||
                "";

            /* Search */

            const matchesSearch =
                !query ||
                title.includes(query) ||
                slug.includes(query) ||
                description.includes(query);

            /* Difficulty */

            const matchesDifficulty =
                difficulty === "All" ||
                problem.difficulty ===
                    difficulty;

            /* Topic */

            let matchesTopic = true;

            if (topic !== "All") {
                const problemTopics = [];

                if (
                    typeof problem.topic ===
                    "string"
                ) {
                    problemTopics.push(
                        problem.topic
                    );
                }

                if (
                    Array.isArray(
                        problem.topics
                    )
                ) {
                    problemTopics.push(
                        ...problem.topics
                    );
                }

                if (
                    Array.isArray(
                        problem.tags
                    )
                ) {
                    problemTopics.push(
                        ...problem.tags
                    );
                }

                matchesTopic =
                    problemTopics.some(
                        (item) =>
                            String(item)
                                .toLowerCase()
                                .trim() ===
                            topic
                                .toLowerCase()
                                .trim()
                    );
            }

            /* Status */

            const solved =
                isSolved(problem.id);

            const favorite =
                isFavorite(problem.id);

            let matchesStatus = true;

            if (
                statusFilter === "Solved"
            ) {
                matchesStatus = solved;
            }

            if (
                statusFilter === "Unsolved"
            ) {
                matchesStatus = !solved;
            }

            if (
                statusFilter === "Saved"
            ) {
                matchesStatus = favorite;
            }

            return (
                matchesSearch &&
                matchesDifficulty &&
                matchesTopic &&
                matchesStatus
            );
        });
    }, [
        problems,
        search,
        difficulty,
        topic,
        statusFilter,
        solvedProblemIds,
        favoriteProblemIds,
    ]);

    /* =========================================
       RESET FILTERS
    ========================================= */

    const clearFilters = () => {
        setSearch("");
        setDifficulty("All");
        setTopic("All");
        setStatusFilter("All");
    };

    /* =========================================
       DIFFICULTY CLASS
    ========================================= */

    const getDifficultyClass = (value) => {
        switch (value) {
            case "Easy":
                return "difficulty-easy";

            case "Medium":
                return "difficulty-medium";

            case "Hard":
                return "difficulty-hard";

            default:
                return "";
        }
    };

    /* =========================================
       LOADING
    ========================================= */

    if (loading) {
        return (
            <div className="problems-loading">

                <div className="problems-spinner"></div>

                <p>
                    Loading problems...
                </p>

            </div>
        );
    }

    /* =========================================
       PAGE
    ========================================= */

    return (
        <div className="problems-page">

            <div className="problems-container">

                {/* =================================
                    HEADER
                ================================= */}

                <header className="problems-header">

                    <div>

                        <p className="problems-label">
                            PRACTICE
                        </p>

                        <h1>
                            Coding Problems
                        </h1>

                        <p className="problems-subtitle">
                            Sharpen your programming skills,
                            one problem at a time.
                        </p>

                    </div>

                    <div className="problem-count">

                        <strong>
                            {
                                filteredProblems.length
                            }
                        </strong>

                        <span>
                            {filteredProblems.length ===
                            1
                                ? "Problem"
                                : "Problems"}
                        </span>

                    </div>

                </header>

                {/* =================================
                    CONTROLS
                ================================= */}

                <section className="problem-controls">

                    {/* Search */}

                    <div className="problem-search">

                        <span className="search-icon">
                            ⌕
                        </span>

                        <input
                            type="text"
                            placeholder="Search by title or keyword..."
                            value={search}
                            onChange={(event) =>
                                setSearch(
                                    event.target
                                        .value
                                )
                            }
                        />

                        {search && (
                            <button
                                type="button"
                                className="clear-search"
                                onClick={() =>
                                    setSearch("")
                                }
                                aria-label="Clear search"
                            >
                                ×
                            </button>
                        )}

                    </div>

                    {/* Difficulty */}

                    <div className="filter-group">

                        <span className="filter-label">
                            Difficulty
                        </span>

                        <div className="difficulty-filters">

                            {[
                                "All",
                                "Easy",
                                "Medium",
                                "Hard",
                            ].map(
                                (item) => (
                                    <button
                                        type="button"
                                        key={item}
                                        className={
                                            difficulty ===
                                            item
                                                ? "difficulty-filter active"
                                                : "difficulty-filter"
                                        }
                                        onClick={() =>
                                            setDifficulty(
                                                item
                                            )
                                        }
                                    >
                                        {item}
                                    </button>
                                )
                            )}

                        </div>

                    </div>

                    {/* Status */}

                    <div className="filter-group">

                        <span className="filter-label">
                            Status
                        </span>

                        <div className="status-filters">

                            {[
                                "All",
                                "Solved",
                                "Unsolved",
                                "Saved",
                            ].map(
                                (item) => (
                                    <button
                                        type="button"
                                        key={item}
                                        className={
                                            statusFilter ===
                                            item
                                                ? "status-filter active"
                                                : "status-filter"
                                        }
                                        onClick={() =>
                                            setStatusFilter(
                                                item
                                            )
                                        }
                                    >
                                        {item ===
                                        "Solved"
                                            ? "✓ Solved"
                                            : item ===
                                              "Saved"
                                            ? "★ Saved"
                                            : item}
                                    </button>
                                )
                            )}

                        </div>

                    </div>

                    {/* Topic */}

                    {topics.length > 0 && (
                        <div className="filter-group">

                            <span className="filter-label">
                                Topic
                            </span>

                            <select
                                value={topic}
                                onChange={(event) =>
                                    setTopic(
                                        event.target
                                            .value
                                    )
                                }
                                className="topic-select"
                            >
                                <option value="All">
                                    All Topics
                                </option>

                                {topics.map(
                                    (item) => (
                                        <option
                                            key={item}
                                            value={item}
                                        >
                                            {item}
                                        </option>
                                    )
                                )}
                            </select>

                        </div>
                    )}

                </section>

                {/* =================================
                    ACTIVE FILTERS
                ================================= */}

                {(search ||
                    difficulty !== "All" ||
                    topic !== "All" ||
                    statusFilter !== "All") && (
                    <div className="active-filters">

                        <span>
                            Showing{" "}
                            <strong>
                                {
                                    filteredProblems.length
                                }
                            </strong>{" "}
                            result
                            {filteredProblems.length !==
                            1
                                ? "s"
                                : ""}
                        </span>

                        <button
                            type="button"
                            onClick={clearFilters}
                        >
                            Clear filters
                        </button>

                    </div>
                )}

                {/* =================================
                    ERROR
                ================================= */}

                {error && (
                    <div className="problems-error">

                        <span>
                            {error}
                        </span>

                        <button
                            type="button"
                            onClick={() => {
                                setError("");
                                fetchProblems();
                                fetchProgress();
                                fetchFavorites();
                            }}
                        >
                            Try Again
                        </button>

                    </div>
                )}

                {/* =================================
                    PROBLEMS
                ================================= */}

                <div className="problems-card">

                    {/* Header */}

                    <div className="problem-table-header">

                        <span className="col-status">
                            Status
                        </span>

                        <span className="col-number">
                            #
                        </span>

                        <span className="col-title">
                            Problem
                        </span>

                        <span className="col-topic">
                            Topic
                        </span>

                        <span className="col-difficulty">
                            Difficulty
                        </span>

                        <span className="col-favorite">
                            Save
                        </span>

                        <span className="col-action">
                        </span>

                    </div>

                    {/* Empty */}

                    {filteredProblems.length ===
                    0 ? (
                        <div className="empty-problems">

                            <div className="empty-icon">
                                ?
                            </div>

                            <h3>
                                No problems found
                            </h3>

                            <p>
                                Try another keyword
                                or clear your filters.
                            </p>

                            <button
                                type="button"
                                onClick={clearFilters}
                            >
                                Clear Filters
                            </button>

                        </div>
                    ) : (
                        filteredProblems.map(
                            (problem, index) => {
                                const solved =
                                    isSolved(
                                        problem.id
                                    );

                                const favorite =
                                    isFavorite(
                                        problem.id
                                    );

                                const problemTopic =
                                    problem.topic ||
                                    (Array.isArray(
                                        problem.topics
                                    )
                                        ? problem
                                              .topics[0]
                                        : null) ||
                                    (Array.isArray(
                                        problem.tags
                                    )
                                        ? problem
                                              .tags[0]
                                        : null);

                                return (
                                    <Link
                                        key={
                                            problem.id
                                        }
                                        to={`/problems/${problem.slug}`}
                                        className={`problem-row ${
                                            solved
                                                ? "problem-row-solved"
                                                : ""
                                        }`}
                                    >

                                        {/* Status */}

                                        <span className="col-status">

                                            {solved ? (
                                                <span
                                                    className="solved-icon"
                                                    title="Solved"
                                                >
                                                    ✓
                                                </span>
                                            ) : (
                                                <span
                                                    className="unsolved-icon"
                                                    title="Not solved"
                                                ></span>
                                            )}

                                        </span>

                                        {/* Number */}

                                        <span className="col-number problem-number">
                                            {index +
                                                1}
                                        </span>

                                        {/* Title */}

                                        <span className="col-title problem-title-cell">

                                            <strong>
                                                {
                                                    problem.title
                                                }
                                            </strong>

                                            <small>
                                                {
                                                    problem.slug
                                                }
                                            </small>

                                        </span>

                                        {/* Topic */}

                                        <span className="col-topic problem-topic-cell">

                                            {problemTopic ? (
                                                <span className="topic-badge">
                                                    {
                                                        problemTopic
                                                    }
                                                </span>
                                            ) : (
                                                <span className="no-topic">
                                                    —
                                                </span>
                                            )}

                                        </span>

                                        {/* Difficulty */}

                                        <span className="col-difficulty">

                                            <span
                                                className={`difficulty-badge ${getDifficultyClass(
                                                    problem.difficulty
                                                )}`}
                                            >
                                                {
                                                    problem.difficulty
                                                }
                                            </span>

                                        </span>

                                        {/* Favorite */}

                                        <button
                                            type="button"
                                            className={`col-favorite favorite-button ${
                                                favorite
                                                    ? "favorite-active"
                                                    : ""
                                            }`}
                                            onClick={(event) =>
                                                toggleFavorite(
                                                    event,
                                                    problem.id
                                                )
                                            }
                                            disabled={
                                                favoriteLoading
                                            }
                                            title={
                                                favorite
                                                    ? "Remove from saved"
                                                    : "Save problem"
                                            }
                                        >
                                            {favorite
                                                ? "★"
                                                : "☆"}
                                        </button>

                                        {/* Arrow */}

                                        <span className="col-action">
                                            →
                                        </span>

                                    </Link>
                                );
                            }
                        )
                    )}

                </div>

                {/* Progress loading */}

                {progressLoading && (
                    <p className="progress-loading-text">
                        Updating your progress...
                    </p>
                )}

            </div>

        </div>
    );
}

export default ProblemPage;