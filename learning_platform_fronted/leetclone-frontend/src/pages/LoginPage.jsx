import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axiosClient from "../api/axiosClient";
import "../styles/LoginPage.css";

function LoginPage() {
    const navigate = useNavigate();

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const handleLogin = async (e) => {
        e.preventDefault();

        setError("");
        setLoading(true);

        try {
            const response = await axiosClient.post(
                "users/login/",
                {
                    username,
                    password,
                }
            );

            localStorage.setItem(
                "access_token",
                response.data.access
            );

            localStorage.setItem(
                "refresh_token",
                response.data.refresh
            );

            navigate("/dashboard");

        } catch (error) {
            console.error(error);

            setError(
                error.response?.data?.detail ||
                "Invalid username or password."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-page">

            <div className="login-background-shape shape-one"></div>
            <div className="login-background-shape shape-two"></div>

            <div className="login-container">

                {/* Left Side */}
                <div className="login-info">

                    <div className="brand">
                        <div className="brand-icon">&lt;/&gt;</div>
                        <span>Learner</span>
                    </div>

                    <div className="login-info-content">
                        <h1>
                            Code.
                            <br />
                            Learn.
                            <br />
                            <span>Grow.</span>
                        </h1>

                        <p>
                            Practice coding problems, improve your
                            programming skills, and track your progress
                            in one place.
                        </p>

                        <div className="feature-list">
                            <div className="feature-item">
                                <span>✓</span>
                                <p>Practice coding problems</p>
                            </div>

                            <div className="feature-item">
                                <span>✓</span>
                                <p>Run Python, C++ and Java</p>
                            </div>

                            <div className="feature-item">
                                <span>✓</span>
                                <p>Track your learning progress</p>
                            </div>
                        </div>
                    </div>

                    <div className="login-info-footer">
                        © 2026 Learner Platform
                    </div>

                </div>

                {/* Right Side */}
                <div className="login-card-wrapper">

                    <div className="login-card">

                        <div className="login-header">
                            <h2>Welcome back 👋</h2>

                            <p>
                                Sign in to continue learning.
                            </p>
                        </div>

                        <form onSubmit={handleLogin}>

                            <div className="input-group">
                                <label htmlFor="username">
                                    Username
                                </label>

                                <input
                                    id="username"
                                    type="text"
                                    value={username}
                                    onChange={(e) =>
                                        setUsername(e.target.value)
                                    }
                                    placeholder="Enter your username"
                                    required
                                />
                            </div>

                            <div className="input-group">
                                <div className="password-label">
                                    <label htmlFor="password">
                                        Password
                                    </label>

                                    <span>
                                        Forgot password?
                                    </span>
                                </div>

                                <div className="password-wrapper">

                                    <input
                                        id="password"
                                        type={
                                            showPassword
                                                ? "text"
                                                : "password"
                                        }
                                        value={password}
                                        onChange={(e) =>
                                            setPassword(e.target.value)
                                        }
                                        placeholder="Enter your password"
                                        required
                                    />

                                    <button
                                        type="button"
                                        className="show-password"
                                        onClick={() =>
                                            setShowPassword(
                                                !showPassword
                                            )
                                        }
                                    >
                                        {showPassword ? "Hide" : "Show"}
                                    </button>

                                </div>
                            </div>

                            {error && (
                                <div className="login-error">
                                    {error}
                                </div>
                            )}

                            <button
                                type="submit"
                                className="login-button"
                                disabled={loading}
                            >
                                {loading
                                    ? "Signing in..."
                                    : "Sign In"}
                            </button>

                        </form>

                        <div className="divider">
                            <span>OR</span>
                        </div>

                        <div className="register-text">
                            Don't have an account?

                            <Link to="/register">
                                Create account
                            </Link>
                        </div>

                    </div>

                </div>

            </div>
        </div>
    );
}

export default LoginPage;