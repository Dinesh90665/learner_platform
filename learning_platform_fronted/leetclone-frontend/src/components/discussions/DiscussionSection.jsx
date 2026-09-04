import { useEffect, useState } from "react";
import axiosClient from "../../api/axiosClient";
import "../../styles/Discussions.css";
import DiscussionCard from "./DiscussionCard";
import DiscussionForm from "./DiscussionForm";

function DiscussionSection({ problemId }) {
    const [discussions, setDiscussions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [showForm, setShowForm] = useState(false);

    useEffect(() => {
        fetchDiscussions();
    }, [problemId]);

    const fetchDiscussions = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await axiosClient.get(
                `discussions/problem/${problemId}/`
            );

            setDiscussions(response.data || []);
        } catch (err) {
            console.error("Discussion error:", err);

            if (err.response?.status === 401) {
                setError("Please log in to view discussions.");
            } else {
                setError("Unable to load discussions.");
            }
        } finally {
            setLoading(false);
        }
    };

    const handleCreated = (discussion) => {
        setDiscussions((previous) => [
            discussion,
            ...previous,
        ]);

        setShowForm(false);
    };

    return (
        <section className="discussion-section">

            <div className="discussion-header">

                <div>
                    <p className="discussion-eyebrow">
                        COMMUNITY
                    </p>

                    <h2>
                        Discussions
                    </h2>

                    <p>
                        Ask questions, share ideas, and learn
                        from other programmers.
                    </p>
                </div>

                <button
                    type="button"
                    className="new-discussion-button"
                    onClick={() => setShowForm((previous) => !previous)}
                >
                    {showForm ? "Cancel" : "+ New Discussion"}
                </button>

            </div>

            {showForm && (
                <DiscussionForm
                    problemId={problemId}
                    onCreated={handleCreated}
                    onCancel={() => setShowForm(false)}
                />
            )}

            {loading && (
                <div className="discussion-message">
                    <div className="discussion-loader"></div>
                    <span>Loading discussions...</span>
                </div>
            )}

            {!loading && error && (
                <div className="discussion-error">
                    {error}

                    <button
                        type="button"
                        onClick={fetchDiscussions}
                    >
                        Try Again
                    </button>
                </div>
            )}

            {!loading &&
                !error &&
                discussions.length === 0 && (
                    <div className="discussion-empty">

                        <div className="discussion-empty-icon">
                            💬
                        </div>

                        <h3>
                            No discussions yet
                        </h3>

                        <p>
                            Be the first person to start
                            a discussion about this problem.
                        </p>

                        <button
                            type="button"
                            onClick={() => setShowForm(true)}
                        >
                            Start a Discussion
                        </button>

                    </div>
                )}

            {!loading &&
                !error &&
                discussions.length > 0 && (
                    <div className="discussion-list">

                        {discussions.map((discussion) => (
                            <DiscussionCard
                                key={discussion.id}
                                discussion={discussion}
                                onUpdated={fetchDiscussions}
                            />
                        ))}

                    </div>
                )}

        </section>
    );
}

export default DiscussionSection;