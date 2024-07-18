import React from "react";
import "./App.css";
import Button from "./Button"; // Import the Button component

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Welcome</h1>
        <h2>To</h2>
        <h2>Coeus</h2>
        <Button color="var(--main)" label="Get Started" OnClick={() => console.log("Button clicked!")} />{" "}
      </header>
    </div>
  );
}

export default App;
