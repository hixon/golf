import logo from './logo.svg';
import golftracker from './services/api-calls'
import React, { useState, useEffect } from 'react'
import './App.css';

function App() {
  const [accesstoken, setAccessToken ] = useState('')

  useEffect(() => {
    golftracker
      .authenticate()
      .then(response => {
        setAccessToken(response.data)
      })
  }, [])

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
  <h2>{ accesstoken }</h2>
      </header>
    </div>
  );
}

export default App;

