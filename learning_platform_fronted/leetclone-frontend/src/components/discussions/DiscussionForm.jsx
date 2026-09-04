import { useState } from "react";
import axiosClient from "../../api/axiosClient";

function DiscussionForm({
    problemId,
    onCreated,
    onCancel,
}) {
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!title.trim()) {
            setError("Please enter a discussion title.");
            return;
        }

        if (!content.trim()) {
            setError("Please write some content.");
            return;
        }

        try {
            setLoading(true);
            setError("");

            const response = await axiosClient.post(
                `discussions/problem/${problemId}/`,
                {
                    title: title.trim(),
                    content: content.trim(),
                }
            );

            setTitle("");
            setContent("");

            onCreated(response.data);
        } catch (err) {
            console.error("Create discussion error:", err);

            if (err.response?.status === 401) {
                setError("Please log in before creating a discussion.");
            } else if (err.response?.data) {
                const data = err.response.data;

                const messages = Object.entries(data)
                    .map(([field, value]) => {
                        const message = Array.isArray(value)
                            ? value.join(", ")
                            : value;

                        return `${field}: ${message}`;
                    })
                    .join("\n");

                setError(
                    messages || "Unable to create discussion."
                );
            } else {
                setError("Unable to connect to the server.");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <form
            className="discussion-form"
            onSubmit={handleSubmit}
        >

            <div className="discussion-form-header">
                <h3>
                    Start a discussion
                </h3>

                <p>
                    Ask a question or share your approach.
                </p>
            </div>

            <div className="discussion-field">
                <label htmlFor="discussion-title">
                    Title
                </label>

                <input
                    id="discussion-title"
                    type="text"
                    value={title}
                    onChange={(event) =>
                        setTitle(event.target.value)
                    }
                    placeholder="What would you like to discuss?"
                    maxLength={200}
                    disabled={loading}
                />
            </div>

            <div className="discussion-field">
                <label htmlFor="discussion-content">
                    Message
                </label>

                <textarea
                    id="discussion-content"
                    value={content}
                    onChange={(event) =>
                        setContent(event.target.value)
                    }
                    placeholder="Write your question, idea, or explanation..."
                    rows={6}
                    disabled={loading}
                />
            </div>

            {error && (
                <div className="discussion-form-error">
                    {error}
                </div>
            )}

            <div className="discussion-form-actions">

                <button
                    type="button"
                    className="discussion-cancel-button"
                    onClick={onCancel}
                    disabled={loading}
                >
                    Cancel
                </button>

                <button
                    type="submit"
                    className="discussion-post-button"
                    disabled={loading}
                >
                    {loading
                        ? "Posting..."
                        : "Post Discussion"}
                </button>

            </div>

        </form>
    );
}

export default DiscussionForm;