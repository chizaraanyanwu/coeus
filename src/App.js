import React from 'react'

import { BrowserRouter as Router, Route, Routes, Switch, BrowserRouter } from 'react-router-dom';


// We will create these two pages in a moment

import HomePage from './pages/HomePage.js'

import UserPage from './pages/UserPage.js'
import Button from './Button.js'
import './Button.css'
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/user" component={UserPage} />
        <Route exact path="/" component={HomePage} />
      </Routes>
    </BrowserRouter>
  );

}

export default App;

