import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axiosClient from "../api/axiosClient";
import "../styles/ProfilePage.css";

function ProfilePage() {
    const navigate = useNavigate();

    const [profile, setProfile] = useState(null);

    const [formData, setFormData] = useState({
        first_name: "",
        last_name: "",
        email: "",
        bio: "",
    });

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [editing, setEditing] = useState(false);

    const [success, setSuccess] = useState("");
    const [error, setError] = useState("");

    useEffect(() => {
        loadProfile();
    }, []);

    const loadProfile = async () => {
        try {
            const response = await axiosClient.get(
                "users/profile/"
            );

            const data = response.data;

            setProfile(data);

            setFormData({
                first_name: data.user?.first_name || "",
                last_name: data.user?.last_name || "",
                email: data.user?.email || "",
                bio: data.bio || "",
            });

        } catch (err) {
            console.error(err);

            if (err.response?.status === 401) {
                localStorage.removeItem("access_token");
                localStorage.removeItem("refresh_token");
                localStorage.removeItem("username");

                navigate("/login");
            } else {
                setError("Unable to load profile.");
            }
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (event) => {
        const { name, value } = event.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));

        setSuccess("");
        setError("");
    };

    const handleUpdate = async (event) => {
        event.preventDefault();

        setSaving(true);
        setSuccess("");
        setError("");

        try {
            const response = await axiosClient.patch(
                "users/profile/update/",
                formData
            );

            setProfile(response.data);

            setFormData({
                first_name:
                    response.data.user?.first_name || "",
                last_name:
                    response.data.user?.last_name || "",
                email:
                    response.data.user?.email || "",
                bio:
                    response.data.bio || "",
            });

            setEditing(false);
            setSuccess("Profile updated successfully.");

        } catch (err) {
            console.error(err);

            if (err.response?.data) {
                const messages = Object.entries(
                    err.response.data
                )
                    .map(([field, value]) => {
                        const message = Array.isArray(value)
                            ? value.join(", ")
                            : value;

                        return `${field}: ${message}`;
                    })
                    .join("\n");

                setError(messages || "Unable to update profile.");
            } else {
                setError("Unable to connect to the server.");
            }
        } finally {
            setSaving(false);
        }
    };

    const cancelEditing = () => {
        setEditing(false);
        setSuccess("");
        setError("");

        setFormData({
            first_name:
                profile?.user?.first_name || "",
            last_name:
                profile?.user?.last_name || "",
            email:
                profile?.user?.email || "",
            bio:
                profile?.bio || "",
        });
    };

    const getInitial = () => {
        return (
            profile?.user?.first_name?.charAt(0) ||
            profile?.user?.username?.charAt(0) ||
            "U"
        ).toUpperCase();
    };

    if (loading) {
        return (
            <div className="profile-loading">
                <div className="profile-loading-spinner"></div>
                <span>Loading profile...</span>
            </div>
        );
    }

    if (error && !profile) {
        return (
            <div className="profile-error-page">
                <h2>Unable to load profile</h2>
                <p>{error}</p>

                <button onClick={loadProfile}>
                    Try Again
                </button>
            </div>
        );
    }

    const fullName =
        `${profile?.user?.first_name || ""} ${
            profile?.user?.last_name || ""
        }`.trim() ||
        profile?.user?.username ||
        "User";

    return (
        <div className="profile-page">

            <div className="profile-wrapper">

                {/* HEADER */}

                <div className="profile-top">

                    <div>
                        <p className="profile-kicker">
                            ACCOUNT
                        </p>

                        <h1>
                            Profile
                        </h1>

                        <p className="profile-description">
                            Manage your account information and
                            coding identity.
                        </p>
                    </div>

                    <Link
                        to="/dashboard"
                        className="profile-dashboard-link"
                    >
                        ← Dashboard
                    </Link>

                </div>

                {/* PROFILE HEADER */}

                <section className="profile-identity">

                    <div className="identity-left">

                        <div className="profile-avatar">
                            {getInitial()}
                        </div>

                        <div className="identity-details">

                            <h2>
                                {fullName}
                            </h2>

                            <p>
                                @{profile?.user?.username}
                            </p>

                            <span>
                                {profile?.user?.email}
                            </span>

                        </div>

                    </div>

                    {!editing && (
                        <button
                            className="edit-profile-button"
                            onClick={() => setEditing(true)}
                        >
                            Edit Profile
                        </button>
                    )}

                </section>

                {/* TABS */}

                <div className="profile-tabs">

                    <button className="profile-tab active">
                        Overview
                    </button>

                    <Link
                        to="/submissions"
                        className="profile-tab"
                    >
                        Submissions
                    </Link>

                    <Link
                        to="/problems"
                        className="profile-tab"
                    >
                        Problems
                    </Link>

                </div>

                {/* MESSAGE */}

                {success && (
                    <div className="profile-success">
                        ✓ {success}
                    </div>
                )}

                {error && (
                    <div className="profile-error">
                        <pre>{error}</pre>
                    </div>
                )}

                {/* FORM */}

                <section className="profile-section">

                    <div className="profile-section-header">

                        <div>
                            <h2>
                                Personal information
                            </h2>

                            <p>
                                Your basic account information.
                            </p>
                        </div>

                    </div>

                    <form onSubmit={handleUpdate}>

                        <div className="profile-grid">

                            <div className="profile-field">
                                <label>
                                    First name
                                </label>

                                {editing ? (
                                    <input
                                        type="text"
                                        name="first_name"
                                        value={
                                            formData.first_name
                                        }
                                        onChange={handleChange}
                                    />
                                ) : (
                                    <div className="profile-value">
                                        {formData.first_name ||
                                            "Not provided"}
                                    </div>
                                )}
                            </div>

                            <div className="profile-field">
                                <label>
                                    Last name
                                </label>

                                {editing ? (
                                    <input
                                        type="text"
                                        name="last_name"
                                        value={
                                            formData.last_name
                                        }
                                        onChange={handleChange}
                                    />
                                ) : (
                                    <div className="profile-value">
                                        {formData.last_name ||
                                            "Not provided"}
                                    </div>
                                )}
                            </div>

                        </div>

                        <div className="profile-field">
                            <label>
                                Email address
                            </label>

                            {editing ? (
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                />
                            ) : (
                                <div className="profile-value">
                                    {formData.email ||
                                        "Not provided"}
                                </div>
                            )}
                        </div>

                        <div className="profile-field">
                            <label>
                                Username
                            </label>

                            <div className="profile-value disabled-field">
                                @{profile?.user?.username}
                            </div>

                            <small>
                                Username cannot be changed here.
                            </small>
                        </div>

                        <div className="profile-field">
                            <label>
                                Bio
                            </label>

                            {editing ? (
                                <textarea
                                    name="bio"
                                    rows="5"
                                    value={formData.bio}
                                    onChange={handleChange}
                                    placeholder="Tell us about yourself..."
                                />
                            ) : (
                                <div className="profile-value profile-bio">
                                    {formData.bio ||
                                        "No bio added yet."}
                                </div>
                            )}
                        </div>

                        {editing && (
                            <div className="profile-actions">

                                <button
                                    type="button"
                                    className="cancel-button"
                                    onClick={cancelEditing}
                                    disabled={saving}
                                >
                                    Cancel
                                </button>

                                <button
                                    type="submit"
                                    className="save-button"
                                    disabled={saving}
                                >
                                    {saving
                                        ? "Saving..."
                                        : "Save Changes"}
                                </button>

                            </div>
                        )}

                    </form>

                </section>

            </div>
        </div>
    );
}

export default ProfilePage;