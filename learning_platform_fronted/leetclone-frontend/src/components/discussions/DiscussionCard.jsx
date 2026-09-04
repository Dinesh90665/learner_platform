import { useState } from "react";
import axiosClient from "../../api/axiosClient";

function DiscussionCard({
    discussion,
    onUpdated,
}) {
    const [showReplies, setShowReplies] = useState(false);

    const [replies, setReplies] = useState(
        discussion.replies || []
    );

    const [replyText, setReplyText] = useState("");
    const [replyLoading, setReplyLoading] = useState(false);
    const [replyError, setReplyError] = useState("");

    const getInitial = (username) => {
        return (
            username?.charAt(0).toUpperCase() || "U"
        );
    };

    const handleReply = async (event) => {
        event.preventDefault();

        if (!replyText.trim()) {
            setReplyError("Please write a reply.");
            return;
        }

        try {
            setReplyLoading(true);
            setReplyError("");

            const response = await axiosClient.post(
                `discussions/${discussion.id}/reply/`,
                {
                    content: replyText.trim(),
                }
            );

            setReplies((previous) => [
                ...previous,
                response.data,
            ]);

            setReplyText("");
            setShowReplies(true);

            if (onUpdated) {
                onUpdated();
            }
        } catch (err) {
            console.error("Reply error:", err);

            if (err.response?.status === 401) {
                setReplyError(
                    "Please log in before replying."
                );
            } else {
                setReplyError("Unable to post reply.");
            }
        } finally {
            setReplyLoading(false);
        }
    };

    return (
        <article className="discussion-card">

            {/* Header */}
            <div className="discussion-card-header">

                <div className="discussion-user">

                    <div className="discussion-avatar">
                        {getInitial(discussion.username)}
                    </div>

                    <div className="discussion-user-info">

                        <strong>
                            {discussion.username}
                        </strong>

                        <span>
                            {new Date(
                                discussion.created_at
                            ).toLocaleString()}
                        </span>

                    </div>

                </div>

            </div>

            {/* Content */}
            <div className="discussion-card-body">

                <h3>
                    {discussion.title}
                </h3>

                <p>
                    {discussion.content}
                </p>

            </div>

            {/* Footer */}
            <div className="discussion-card-footer">

                <button
                    type="button"
                    className="discussion-replies-button"
                    onClick={() =>
                        setShowReplies((previous) => !previous)
                    }
                >
                    💬 {replies.length}

                    {replies.length === 1
                        ? " Reply"
                        : " Replies"}

                    <span>
                        {showReplies ? "↑" : "↓"}
                    </span>
                </button>

            </div>

            {/* Replies */}
            {showReplies && (
                <div className="discussion-replies">

                    {replies.length > 0 && (
                        <div className="reply-list">

                            {replies.map((reply) => (
                                <div
                                    className="reply-item"
                                    key={reply.id}
                                >

                                    <div className="reply-avatar">
                                        {getInitial(
                                            reply.username
                                        )}
                                    </div>

                                    <div className="reply-content">

                                        <div className="reply-meta">
                                            <strong>
                                                {reply.username}
                                            </strong>

                                            <span>
                                                {new Date(
                                                    reply.created_at
                                                ).toLocaleString()}
                                            </span>
                                        </div>

                                        <p>
                                            {reply.content}
                                        </p>

                                    </div>

                                </div>
                            ))}

                        </div>
                    )}

                    {/* Reply Form */}
                    <form
                        className="reply-form"
                        onSubmit={handleReply}
                    >

                        <input
                            type="text"
                            value={replyText}
                            onChange={(event) =>
                                setReplyText(
                                    event.target.value
                                )
                            }
                            placeholder="Write a reply..."
                            disabled={replyLoading}
                        />

                        <button
                            type="submit"
                            disabled={replyLoading}
                        >
                            {replyLoading
                                ? "..."
                                : "Reply"}
                        </button>

                    </form>

                    {replyError && (
                        <div className="reply-error">
                            {replyError}
                        </div>
                    )}

                </div>
            )}

        </article>
    );
}

export default DiscussionCard;