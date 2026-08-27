

import Navbar from "./components/Navbar";
// React will display whatever is returned by Navbar.jsx.
import AppRoutes from "./routes/AppRoutes";
// AppRoutes usually contains all your application's routes using react-router-dom.
                 
function App()   //Defines the main App component.
// This is the root component that is rendered by main.jsx.
{
  return(
    <>   
    <Navbar/>
    <AppRoutes/>
  
    </>
  );
}
export default App;

//<></>//his is called a React Fragment.

// It lets you return multiple elements without adding an extra HTML element like <div>.

//Makes the App component available to other files.
