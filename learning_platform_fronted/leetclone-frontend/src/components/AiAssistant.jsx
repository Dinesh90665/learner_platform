import { useState } from "react";
import axiosClient from "../api/axiosClient";
import "../styles/AIAssistant.css";

function AIAssistant({
    problemId,
    language,
    sourceCode,
    error,
}) {
    const [message, setMessage] = useState("");
    const [messages, setMessages] = useState([]);

    const [loading, setLoading] = useState(false);
    const [requestError, setRequestError] = useState("");

    const askAI = async (question = null) => {
    const text = (question ?? message).trim();

    if (!text || loading) {
        return;
    }

    const userMessage = {
        role: "user",
        content: text,
    };

    const updatedMessages = [
        ...messages,
        userMessage,
    ];

    setMessages(updatedMessages);
    setMessage("");
    setRequestError("");
    setLoading(true);

    try {
        const response = await axiosClient.post(
            "ai-assistant/chat/",
            {
                message: text,
                problem_id: problemId,
                language,
                source_code: sourceCode,
                error: error || "",

                // Send previous conversation
                history: updatedMessages,
            }
        );

        const answer =
            response.data?.answer ||
            "I couldn't generate a response.";

        setMessages((previous) => [
            ...previous,
            {
                role: "assistant",
                content: answer,
            },
        ]);

    } catch (err) {
        console.error(
            "AI Assistant error:",
            err
        );

        const errorMessage =
            err.response?.data?.detail ||
            "Unable to connect to AI Tutor.";

        setRequestError(errorMessage);

        setMessages((previous) => [
            ...previous,
            {
                role: "assistant",
                content:
                    `Sorry, I couldn't process that request.\n\n${errorMessage}`,
            },
        ]);
    } finally {
        setLoading(false);
    }
      };

    const handleKeyDown = (event) => {
        if (
            event.key === "Enter" &&
            !event.shiftKey
        ) {
            event.preventDefault();
            askAI();
        }
    };

    const clearChat = () => {
        setMessages([]);
        setRequestError("");
        setMessage("");
    };

    return (
        <div className="ai-assistant">

            {/* Header */}
            <div className="ai-header">

                <div className="ai-title">

                    <div className="ai-icon">
                        AI
                    </div>

                    <div>
                        <strong>
                            AI Tutor
                        </strong>

                        <span>
                            Your coding assistant
                        </span>
                    </div>

                </div>

                {messages.length > 0 && (
                    <button
                        type="button"
                        className="ai-clear-button"
                        onClick={clearChat}
                        disabled={loading}
                    >
                        Clear
                    </button>
                )}

            </div>

            {/* Quick Actions */}
            <div className="ai-quick-actions">

                <button
                    type="button"
                    onClick={() =>
                        askAI(
                            "Give me a hint for this problem without giving me the complete solution."
                        )
                    }
                    disabled={loading}
                >
                    💡 Hint
                </button>

                <button
                    type="button"
                    onClick={() =>
                        askAI(
                            "Explain this problem in simple terms."
                        )
                    }
                    disabled={loading}
                >
                    📘 Explain
                </button>

                <button
                    type="button"
                    onClick={() =>
                        askAI(
                            "Review my current code and tell me what I should improve."
                        )
                    }
                    disabled={loading}
                >
                    🔍 Review
                </button>

                <button
                    type="button"
                    onClick={() =>
                        askAI(
                            "Explain the current error in my code and tell me how to fix it."
                        )
                    }
                    disabled={loading}
                >
                    ⚠ Error Help
                </button>

            </div>

            {/* Context */}
            <div className="ai-context">

                <span className="ai-context-item">
                    {language === "cpp"
                        ? "C++"
                        : language === "java"
                        ? "Java"
                        : "Python"}
                </span>

                {error && (
                    <span className="ai-context-error">
                        Error detected
                    </span>
                )}

            </div>

            {/* Messages */}
            <div className="ai-messages">

                {messages.length === 0 && (
                    <div className="ai-welcome">

                        <div className="ai-welcome-icon">
                            ✦
                        </div>

                        <h3>
                            How can I help?
                        </h3>

                        <p>
                            Ask for a hint, explanation,
                            code review, or help with an error.
                        </p>

                    </div>
                )}

                {messages.map((item, index) => (
                    <div
                        key={`${item.role}-${index}`}
                        className={`ai-message ${
                            item.role === "user"
                                ? "user-message"
                                : "assistant-message"
                        }`}
                    >

                        <div className="ai-message-label">
                            {item.role === "user"
                                ? "You"
                                : "AI Tutor"}
                        </div>

                        <div className="ai-message-content">
                            {item.content}
                        </div>

                    </div>
                ))}

                {loading && (
                    <div className="ai-message assistant-message">

                        <div className="ai-message-label">
                            AI Tutor
                        </div>

                        <div className="ai-typing">
                            Thinking
                            <span>.</span>
                            <span>.</span>
                            <span>.</span>
                        </div>

                    </div>
                )}

            </div>

            {/* Error */}
            {requestError && (
                <div className="ai-error">
                    {requestError}
                </div>
            )}

            {/* Input */}
            <div className="ai-input-area">

                <textarea
                    value={message}
                    onChange={(event) =>
                        setMessage(event.target.value)
                    }
                    onKeyDown={handleKeyDown}
                    placeholder="Ask AI Tutor anything..."
                    rows={2}
                    disabled={loading}
                />

                <button
                    type="button"
                    onClick={() => askAI()}
                    disabled={
                        loading ||
                        !message.trim()
                    }
                    aria-label="Send message"
                >
                    {loading ? "..." : "→"}
                </button>

            </div>

            <div className="ai-input-hint">
                Press Enter to send • Shift + Enter for a new line
            </div>

        </div>
    );
}

export default AIAssistant;