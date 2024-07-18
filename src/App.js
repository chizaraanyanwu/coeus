import React from 'react'

import { BrowserRouter as Router, Route, Routes, Switch } from 'react-router-dom';

// We will create these two pages in a moment

import HomePage from './pages/HomePage.js'

import UserPage from './pages/UserPage.js'
import Button from './Button.js'

function App() {

  return (
    // <div className="App">
    //   <header className="App-header">
    //     <h1>Welcome</h1>
    //     <h2>To</h2>
    //     <h2>Coeus</h2>
    //     <Button
    //       color="var(--main)"
    //       label="Get Started"
    //       OnClick={() => console.log("Button clicked!")}
    //     />{" "}
    //   </header>
    // </div>
    <Router>
      <Routes>
        <Route exact path="/" component={HomePage } />
        <Route path="/user-page" component={UserPage } />
      </Routes>
    </Router>
  );

}

export default App;

