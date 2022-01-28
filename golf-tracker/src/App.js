import logo from './logo.svg';
import golftracker from './services/api-calls'
import React, { useState, useEffect } from 'react'
import axios from 'axios'
import './App.css';

function App() {
  const [ players, setPlayers ] = useState([])
  const [ schedule, setSchedule ] = useState([])
  //login initially to get an access token
  //token will be used later for other web api calls
  useEffect(() => {
    golftracker
      .authenticate()
      
      .then(atoken => {
        console.log("getting players:", atoken)
        golftracker
        .players(atoken)
        .then(response => {
          setPlayers(response.data)
        })

        console.log("getting schedule: ", atoken)
        golftracker
        .sched(atoken)
        .then(response => {
          setSchedule(response.data.ReportData)
        })
      })
      
  }, [])

  return (
    <div className="App">
      <header className="App-header">
        Players:
        <ul>
        { players.map((item, index) => <li key={index}>{item.FirstNameLastName}</li>)}  
        </ul>     

         Schedule: 
         <ul>
           {schedule.map((item, index) => <li key={index}>{item.CourseSide} {item.MatchDate}</li>)}
         </ul>
        
      </header>
    </div>
  );
}

export default App;

