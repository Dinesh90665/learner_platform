import { Link } from "react-router-dom"; //Link is a component provided by React Router.
//<a href="/login">Login</a>

// The problem is that clicking this reloads the entire webpage.
// React applications don't want to reload the page. Instead, 
// they update only the part of the screen that changes.
function Navbar()
{
    return(
        <nav>
        <Link to ="/">Home</Link> | {" "} 
        <Link to ="/problems">Problems</Link>|{" "}
        <Link to ="/leaderboard">Leaderboard</Link> | {" "}
        <Link to ="/dashboard">Dashboard</Link>|{" "}
        <Link to ="/profile">Profile</Link> | {" "}
        <Link to ="/login">Login</Link> | {" "}
        <Link to ="/register"></Link>
        </nav>
    );
}
export default Navbar;


//React Router changes the URL to:

// http://localhost:5173/

// Then AppRoutes checks the URL and renders:

{/* <a href="...">	<Link to="..."> */}
// Reloads the whole page	No full page reload
{/* Slower navigation	Faster navigation */}
{/* Browser requests the page again	React updates only the displayed component */}
// This is one of the key ideas behind a Single Page Application (SPA): the browser loads the app once, and React updates the visible
//  content as users navigate between routes