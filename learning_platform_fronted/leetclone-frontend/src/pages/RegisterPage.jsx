import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axiosClient from "../api/axiosClient";
import "../styles/RegisterPage.css";

function RegisterPage() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        username: "",
        email: "",
        first_name: "",
        last_name: "",
        password: "",
        password2: "",
    });

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleRegister = async (e) => {
        e.preventDefault();

        setError("");

        if (formData.password !== formData.password2) {
            setError("Passwords do not match.");
            return;
        }

        setLoading(true);

        try {
            await axiosClient.post("users/register/", formData);

            navigate("/login", {
                state: {
                    message: "Account created successfully. Please log in.",
                },
            });
        } catch (error) {
            console.error(error);

            if (error.response?.data) {
                const data = error.response.data;

                const messages = Object.entries(data)
                    .map(([field, message]) => {
                        const text = Array.isArray(message)
                            ? message.join(", ")
                            : message;

                        return `${field}: ${text}`;
                    })
                    .join("\n");

                setError(messages || "Registration failed.");
            } else {
                setError("Unable to connect to the backend server.");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="register-page">

            <div className="register-background-shape register-shape-one"></div>
            <div className="register-background-shape register-shape-two"></div>

            <div className="register-container">

                {/* Left section */}
                <div className="register-info">

                    <div className="register-brand">
                        <div className="register-brand-icon">
                            &lt;/&gt;
                        </div>

                        <span>Learner</span>
                    </div>

                    <div className="register-info-content">

                        <div className="register-badge">
                            START YOUR JOURNEY
                        </div>

                        <h1>
                            Build skills.
                            <br />
                            <span>Build your future.</span>
                        </h1>

                        <p>
                            Create your account and start solving
                            programming problems, learning new concepts,
                            and improving every day.
                        </p>

                        <div className="register-features">

                            <div className="register-feature">
                                <div className="register-feature-icon">
                                    ✓
                                </div>

                                <div>
                                    <strong>Practice every day</strong>
                                    <p>
                                        Solve coding problems at your own pace.
                                    </p>
                                </div>
                            </div>

                            <div className="register-feature">
                                <div className="register-feature-icon">
                                    ✓
                                </div>

                                <div>
                                    <strong>Multiple languages</strong>
                                    <p>
                                        Practice with Python, C++ and Java.
                                    </p>
                                </div>
                            </div>

                            <div className="register-feature">
                                <div className="register-feature-icon">
                                    ✓
                                </div>

                                <div>
                                    <strong>Track your progress</strong>
                                    <p>
                                        See how your coding skills improve.
                                    </p>
                                </div>
                            </div>

                        </div>

                    </div>

                    <div className="register-footer">
                        © 2026 Learner Platform
                    </div>

                </div>

                {/* Right section */}
                <div className="register-card-wrapper">

                    <div className="register-card">

                        <div className="register-header">
                            <h2>Create your account</h2>

                            <p>
                                Join the learning platform and start coding.
                            </p>
                        </div>

                        <form onSubmit={handleRegister}>

                            {/* Name */}
                            <div className="register-row">

                                <div className="register-input-group">
                                    <label htmlFor="first_name">
                                        First name
                                    </label>

                                    <input
                                        id="first_name"
                                        name="first_name"
                                        type="text"
                                        value={formData.first_name}
                                        onChange={handleChange}
                                        placeholder="Dinesh"
                                    />
                                </div>

                                <div className="register-input-group">
                                    <label htmlFor="last_name">
                                        Last name
                                    </label>

                                    <input
                                        id="last_name"
                                        name="last_name"
                                        type="text"
                                        value={formData.last_name}
                                        onChange={handleChange}
                                        placeholder="Aidee"
                                    />
                                </div>

                            </div>

                            {/* Username */}
                            <div className="register-input-group">
                                <label htmlFor="username">
                                    Username
                                </label>

                                <input
                                    id="username"
                                    name="username"
                                    type="text"
                                    value={formData.username}
                                    onChange={handleChange}
                                    placeholder="Choose a username"
                                    required
                                />
                            </div>

                            {/* Email */}
                            <div className="register-input-group">
                                <label htmlFor="email">
                                    Email address
                                </label>

                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder="you@example.com"
                                    required
                                />
                            </div>

                            {/* Password */}
                            <div className="register-input-group">
                                <label htmlFor="password">
                                    Password
                                </label>

                                <div className="register-password-wrapper">

                                    <input
                                        id="password"
                                        name="password"
                                        type={
                                            showPassword
                                                ? "text"
                                                : "password"
                                        }
                                        value={formData.password}
                                        onChange={handleChange}
                                        placeholder="Create a password"
                                        required
                                    />

                                    <button
                                        type="button"
                                        className="register-show-password"
                                        onClick={() =>
                                            setShowPassword(!showPassword)
                                        }
                                    >
                                        {showPassword ? "Hide" : "Show"}
                                    </button>

                                </div>
                            </div>

                            {/* Confirm password */}
                            <div className="register-input-group">
                                <label htmlFor="password2">
                                    Confirm password
                                </label>

                                <div className="register-password-wrapper">

                                    <input
                                        id="password2"
                                        name="password2"
                                        type={
                                            showConfirmPassword
                                                ? "text"
                                                : "password"
                                        }
                                        value={formData.password2}
                                        onChange={handleChange}
                                        placeholder="Repeat your password"
                                        required
                                    />

                                    <button
                                        type="button"
                                        className="register-show-password"
                                        onClick={() =>
                                            setShowConfirmPassword(
                                                !showConfirmPassword
                                            )
                                        }
                                    >
                                        {showConfirmPassword
                                            ? "Hide"
                                            : "Show"}
                                    </button>

                                </div>
                            </div>

                            {error && (
                                <div className="register-error">
                                    {error}
                                </div>
                            )}

                            <button
                                type="submit"
                                className="register-button"
                                disabled={loading}
                            >
                                {loading
                                    ? "Creating account..."
                                    : "Create Account"}
                            </button>

                        </form>

                        <div className="register-login-text">
                            Already have an account?

                            <Link to="/login">
                                Sign in
                            </Link>
                        </div>

                    </div>

                </div>

            </div>
        </div>
    );
}

export default RegisterPage;