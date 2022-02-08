import golftracker from './services/api-calls'
import React, { useState, useEffect } from 'react'
import './App.css';

const LeagueDate = (props) => {
  //const [ dates, setDates ] = useState([])

  if (props.weeks != undefined && props.weeks.length > 0){
    console.log(props.weeks)

    const getLeagueDate = (dates) => {
      let previous = ""
      const today = new Date()
      return dates.filter(item => {
        const curr = new Date(item.MatchDate)
        if(curr === today){
          return item.MatchDate
        }
        else if (today > previous && today < curr){
          return item.MatchDate
        }
        else{
          previous = curr
        }
      })
    }

    const side = getLeagueDate(props.weeks)[0].CourseSide == 1? "Front" : "Back"
    return (
    <h3>Golf League 2022 : { getLeagueDate(props.weeks)[0].MatchDate } Playing: { side } 9</h3>
    )
  }
  else {
    return (
      <div></div>
    )
  }
}
const WeeklyGolfers = (props) => {
  console.log("11 called weekly golfer component")
  if((props.people.length === undefined && props.stats.length === undefined) || (props.people.length > 0 && props.stats.length > 0)){
    //need to get the following working better based on side
    //also dynamically show the holes based on the side
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
          { props.stats.map((item, index) => {
            if(index < 9){
              return <td key={index}><input type="number" className="scoreinput" hole={item.Hole} score={item.Score} placeholder="4"></input></td>
            }
          })}
          <td><input className="scoreinput" score={item.Strokes}></input></td>
        </tr>
      )}  
      </tbody>
      </table>
    )
  }
  else{
    return(
      <div></div>
    )
  }
  
}

function App() {
  //COURSE SIDES: 1 - FRONT, 2 - BACK

  const [ players, setPlayers ] = useState([])
  const [ schedule, setSchedule ] = useState([])
  const [ courseInfo, setCourseInfo ] = useState([])
  const [ st, setST ] = useState("")
  const [ leagueDate, setLeagueDate ] = useState("")
  const [ golfers, setGolfers ] = useState([])
  let golferinfo = []
  let holeinfo = []

  //login initially to get an access token
  //token will be used later for other web api calls
  useEffect(() => {
    console.log("1 auth")
    golftracker
      .authenticate()
      
      .then(atoken => {
        console.log("2 save auth token")
        setST(atoken)
        console.log("3 getting players:", atoken)
        golftracker
        .players(atoken)
        .then(response => {
          console.log("4 save players")
          setPlayers(response.data)
        })

        console.log("5 getting schedule: ", atoken)
        golftracker
        .sched(atoken)
        .then(response => {
          console.log("6 save schedule", response.data.ReportData)
          setSchedule(response.data.ReportData)
        })
      })
      
  }, [])

  useEffect(() =>{
    console.log("7 get course info")
    if(schedule.length > 0){
      console.log("8 course info actually")
      golftracker
      .courseinfo(st, schedule[0].Course.CourseNumber)
      .then(response => {
        console.log("9 course info: ", response.data)
        setCourseInfo(response.data)
      })
    }
    
    /*
    //set the week
    let previous = ""
    const today = new Date()
    const alldates = schedule.filter(item => {
      const curr = new Date(item.MatchDate)
      if(curr === today){
        return item.MatchDate
      }
      else if (today > previous && today < curr){
        return item.MatchDate
      }
      else{
        previous = curr
      }
    })

    setLeagueDate(alldates[0])
    */

  }, [st, schedule])
  
  useEffect(() => {
    console.log("10 set golf object")
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
      
      //clear the object again
      currdetails = {}
    })
    console.log(golferinfo)
    setGolfers(golferinfo)
  }, [courseInfo])
  

  /*
  if(courseInfo.length > 0){
    setGolfers(SetGolfObject())
  }
  */

  const GetCurrentWeekSide = () => {
    const TUESDAY = 2

    /*
    loop through weeks and see if anything matches today if so return just that date
    otherwise keep the previous date and see where it changes
    */
    let previous = ""
    const today = new Date()
    const alldates = schedule.MatchDate.filter(item => {
      const curr = new Date(item)
      if(curr === today){
        return item
      }
      else if (today > previous && today < curr){
        return item
      }
      else{
        previous = curr
      }
    })

    setLeagueDate(alldates[0])
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
      
      //clear the object again
      currdetails = {}
    })
    console.log(golferinfo)
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
        <LeagueDate weeks={ schedule }></LeagueDate>
        <WeeklyGolfers people={players} stats={golfers} />  

         Schedule: 
         <ul>
           {schedule.map((item, index) => <li key={index}>{item.CourseSide} {item.MatchDate}</li>)}
         </ul>
        
      </header>
    </div>
  );
}

export default App;