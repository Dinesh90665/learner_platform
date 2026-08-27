// import { Link } from "react-router-dom"; //Link is a component provided by React Router.
//<a href="/login">Login</a>

// The problem is that clicking this reloads the entire webpage.
// React applications don't want to reload the page. Instead, 
// they update only the part of the screen that changes.
// function Navbar()
// {
//     return(
//         <nav>
//         <Link to ="/">Home</Link> | {" "} 
//         <Link to ="/problems">Problems</Link>|{" "}
//         <Link to ="/leaderboard">Leaderboard</Link> | {" "}
//         <Link to ="/dashboard">Dashboard</Link>|{" "}
//         <Link to ="/profile">Profile</Link> | {" "}
//         <Link to ="/login">Login</Link> | {" "}
//         <Link to ="/register"></Link>
//         </nav>
//     );
// }
// export default Navbar;


//React Router changes the URL to:

// http://localhost:5173/

// Then AppRoutes checks the URL and renders:

{/* <a href="...">	<Link to="..."> */}
// Reloads the whole page	No full page reload
{/* Slower navigation	Faster navigation */}
{/* Browser requests the page again	React updates only the displayed component */}
// This is one of the key ideas behind a Single Page Application (SPA): the browser loads the app once, and React updates the visible
//  content as users navigate between routes

import { Link, useNavigate } from "react-router-dom";
import "../styles/Navbar.css";
import "../styles/SubmissionHistoryPage.css";
function Navbar({ sidebarOpen, setSidebarOpen }) {
    const navigate = useNavigate();

    const token = localStorage.getItem("access_token");
    const username = localStorage.getItem("username");

    const handleLogout = () => {
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        localStorage.removeItem("username");

        navigate("/login");
    };

    return (
        <header className="app-navbar">

            {/* Left: Logo + mobile menu */}
            <div className="navbar-left">

                {token && (
                    <button
                        className="mobile-menu-toggle"
                        onClick={() => setSidebarOpen(!sidebarOpen)}
                        aria-label="Toggle sidebar"
                    >
                        ☰
                    </button>
                )}

                <Link to="/" className="navbar-brand">
                    <div className="brand-logo">
                        <span>&lt;</span>
                        <span>/</span>
                        <span>&gt;</span>
                    </div>

                    <div className="brand-content">
                        <strong>Learner</strong>
                        <small>CODING PLATFORM</small>
                    </div>
                </Link>

            </div>

            {/* Your original navigation links */}
            <nav className="navbar-center">

                <Link to="/">
                    Home
                </Link>

                <Link to="/problems">
                    Problems
                </Link>

                <Link to="/leaderboard">
                    Leaderboard
                </Link>

                <Link to="/dashboard">
                    Dashboard
                </Link>

                <Link to="/profile">
                    Profile
                </Link>


                <Link to="/submissions">
                      Submissions
                </Link>

            </nav>

            {/* Right side */}
            <div className="navbar-right">

                {!token ? (
                    <>
                        <Link
                            to="/login"
                            className="navbar-login"
                        >
                            Login
                        </Link>

                        <Link
                            to="/register"
                            className="navbar-register"
                        >
                            Register
                        </Link>
                    </>
                ) : (
                    <>
                        <Link
                            to="/profile"
                            className="navbar-profile"
                        >
                            <div className="navbar-avatar">
                                {username
                                    ? username.charAt(0).toUpperCase()
                                    : "U"}
                            </div>

                            <span>
                                {username || "User"}
                            </span>
                        </Link>

                        <button
                            className="logout-button"
                            onClick={handleLogout}
                        >
                            Logout
                        </button>
                    </>
                )}

            </div>

        </header>
    );
}

export default Navbar;