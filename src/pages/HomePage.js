import React from 'react';
import '../css/HomePage.css';
import Button from "../components/Button"; // Import the Button component
import { Link } from "react-router-dom";
import '../css/default.css'


function HomePage() {
  return (
      <div className="App">
        <header className="App-header">
          <h1>Welcome</h1>
          <h2>To</h2>
          <h2>Coeus</h2>
          <Link to="/user-page">
            <Button
              color="var(--main)"
              label="Get Started"
              onClick={() => console.log("Button clicked!")}
            />{" "}
          </Link>
        </header>
      </div>
  );
}

export default HomePage;
