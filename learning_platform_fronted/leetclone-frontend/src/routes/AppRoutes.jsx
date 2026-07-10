import { Route, Routes } from "react-router-dom";
//These come from React Router.
// Routes → A container that holds all the routes.
// Route → Defines one route.
import DashboardPage from "../pages/DashboardPage";
import HomePage from "../pages/HomePage";
import LeaderboardPage from "../pages/LeaderboardPage";
import LoginPage from "../pages/LoginPage";
import ProblemPage from "../pages/ProblemPage";
import ProfilePage from "../pages/ProfilePage";
import RegisterPage from "../pages/RegisterPage";
// Each import represents a React component.




function AppRoutes()  //This is just another React component.
{
    return(
        <Routes>
            <Route path="/" element={<HomePage/>}/>
            <Route path="/login" element={<LoginPage/>}/>
            <Route path="/register" element={<RegisterPage/>}/>
            <Route path="/problems" element={<ProblemPage/>}/>
            <Route path="/dashboard" element={<DashboardPage/>}/>
            <Route path="/leaderboard" element={<LeaderboardPage/>} />
            <Route path="/profile" element={<ProfilePage/>}/>
        </Routes>
    );
}
export default AppRoutes;

//Think of it as a security guard.

// Whenever the URL changes, it asks:

// "Which page matches this URL?"

// Then it displays the matching page.
// IF URL == "/"

// SHOW

{/* <HomePage /> */}