import golftracker from './services/api-calls'
import React, { useState, useEffect } from 'react'
import './App.css';

const WeeklyGolfers = (props) => {
  return (
    <table>
      <thead>
        <tr>
          <th></th><th>Name</th><th>Handicap</th>
          <th>1</th><th>2</th><th>3</th>
          <th>4</th><th>5</th><th>6</th>
          <th>7</th><th>8</th><th>9</th>
          <th>Total</th>
        </tr>
      </thead>
      <tbody>
    { props.people.map(item => 
      <tr key={item.PlayerNumber}>
        <td><button>X</button></td>
        <td>{item.FirstNameLastName}</td>
        <td>{item.CurrentHandicap}</td>
        <td><input type="number" className="scoreinput"></input></td><td><input type="number" className="scoreinput"></input></td>
        <td><input type="number" className="scoreinput"></input></td><td><input type="number" className="scoreinput"></input></td>
        <td><input type="number" className="scoreinput"></input></td><td><input type="number" className="scoreinput"></input></td>
        <td><input type="number" className="scoreinput"></input></td><td><input type="number" className="scoreinput"></input></td>
        <td><input type="number" className="scoreinput"></input></td><td><input type="text" className="scoreinput"></input></td>
        <td></td>
      </tr>
    )}  
    </tbody>
    </table>
  )
}

function App() {
  //COURSE SIDES: 1 - FRONT, 2 - BACK

  const [ players, setPlayers ] = useState([])
  const [ schedule, setSchedule ] = useState([])
  const [ courseInfo, setCourseInfo ] = useState([])
  const [ st, setST ] = useState("")
  const [ leagueDate, setLeagueDate ] = ("")
  let golferinfo = []
  let holeinfo = []
  //login initially to get an access token
  //token will be used later for other web api calls
  useEffect(() => {
    golftracker
      .authenticate()
      
      .then(atoken => {
        setST(atoken)
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

  useEffect(() =>{
    if(schedule.length > 0){
      golftracker
      .courseinfo(st, schedule[0].Course.CourseNumber)
      .then(response => {
        console.log("course info: ", response.data)
        setCourseInfo(response.data)
        //.then(SetGolfObject())
        //SetGolfObject()
      })
    }
  }, [schedule])

  useEffect(() => {
    SetGolfObject()
  }, [courseInfo])


  const getCurrentWeekSide = () => {
    const currDate = new Date()
    currDate.getDay()
  }

  const SetCourseObject = () => {
    let coursedata = {}

    let Holes = {}
    courseInfo.TeeBoxes[0].Holes.map(course => {
        coursedata.HoleNumber = course.HoleNumber
        coursedata.Handicap = course.RelativeHandicap18
        coursedata.SideHandicap = course.RelativeHandicap9
        coursedata.push(Holes)
    })
      holeinfo.push(coursedata)
      console.log(holeinfo)
  }

  const SetGolfObject = () => {
    let currdetails = {};
    players.map(player => {
      currdetails.Name = player.FirstNameLastName
      currdetails.Hcp = player.CurrentHandicap
      currdetails.Strokes = 0
      currdetails.TotalScore = 0
      currdetails.TotalPoints = 0

      let holeinfo = []
      courseInfo.TeeBoxes[0].Holes.map((course, index) => {
        //per hole details
        if(index < 9){
          let hole = {}
          hole.Hole = course.HoleNumber
          hole.Score = 0
          hole.HScore = 0
          hole.Points = 0
          hole.Swings = 0
          holeinfo.push(hole)
        }
      })

      currdetails.Holes = holeinfo
      golferinfo.push(currdetails)
      console.log(golferinfo)
      
      //clear the object again
      currdetails = {}
    })
  }

  const getLeagueDate = () => {
    const currDay = new Date()
    const TUESDAY = 2
    const WEEK = 7
    let leagueDate = ""

    if(currDay.getDay() != TUESDAY){
      //here we need to do some math to get the right league date
      if(currDay.getDay() > TUESDAY){
        setLeagueDate(currDay.getMonth() + "/" + currDay.getDate() - currDay.getDay() - TUESDAY) 
      }
    }
  }

  return (
    <div className="App">
      <header className="App-header">
      <h3>Golf League 2022 : {leagueDate}</h3>
        <WeeklyGolfers people={players} />  

         Schedule: 
         <ul>
           {schedule.map((item, index) => <li key={index}>{item.CourseSide} {item.MatchDate}</li>)}
         </ul>
        
      </header>
    </div>
  );
}

export default App;