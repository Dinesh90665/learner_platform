// import React from "react"; //it imports react library 
import ReactDOM from "react-dom/client"; //React create components and ReactDOM takes that components and displays them inside the HTML Page
import { BrowserRouter } from "react-router-dom"; //it tells routing in your in your application.it listens the browser's url and tells react which page is display
import App from "./App"; // i am importing my main component ... it is the root component which contains the rest of the ui applications


ReactDOM.createRoot(document.getElementById("root")).render(  //React finds div inside index.html it creates the root where your entire a
// applications appear .. this tells react render the following componets inside root 
  <BrowserRouter>    
  <App/>
  </BrowserRouter>
);
//App component is wrapped inside the browserRouter so that means the every component inside the app can use React Router features





// ReactDOM.createRoot(document.getElementById("root")).render(
//   <BrowserRouter>
//     <App />
//   </BrowserRouter>
// );