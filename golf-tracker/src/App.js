import golftracker from './services/api-calls'
import React, { useState, useEffect } from 'react'
import './App.css';

const TestRow = (props) => {
  //REDUX should be needed for this portion so that we can maintain the state of the golfer information
  //see if we can update a value in the props.stats
  console.log(props.stats)
  const [ rowdata, setRowData ] = useState({
    Name: "Ryan", 
    Hcp: 6.22, 
    Holes: [{
      Hole: 1, 
      Par: 4, 
      Strokes: 2
    }, 
    {
      Hole: 2, 
      Par: 4, 
      Strokes: 3
    }], 
    Strokes: 0, 
    Points: 0, 
  });

  if(props.stats != undefined && props.stats.length > 0){
    //update something here
    //convert to JSON object JSON.parse()
    //update value
    //setGolfData(JSON.stringify())
    //const currinfo = JSON.parse(props.stats);
    //console.log("currinfo as json string: ", currinfo);

    //props.stats = JSON.stringify(currinfo);
  }

  /*
  const handleScoreChange = (event) => {
    //copy state
    const newState = rowdata;

    //update value
    const hole = newState.Holes[0].Strokes;
    const strokes = parseInt(event.target.value);
    newState.Holes[event.target.id - 1].Strokes = strokes;
    newState.Strokes = newState.Holes.reduce(
      (prev, curr) => prev + curr.Strokes, 0
    )
    //const updatedvalue = {rowdata: strokes};
    //setRowData({...rowdata, [event.target.id]: strokes});
    //setRowData({...rowdata, updatedvalue});
    //setRowData(...rowdata, {rowdata.Holes[0].Strokes = parseInt(event.target.value)});
    console.log("Changed to: ", event.target.value);

    //push state back
    setRowData(newState)
    console.log('new state: ', rowdata);
  }
  */

  return(
    <table>
      <PlayerRow playerstats={props.stats} handleChange={props.handleChange} />
    </table>
  )
}

const PlayerRow = (props) => {
  if(props.playerstats != undefined && props.playerstats.length > 0){
    console.log("playerrow strokes: ", props.playerstats.Strokes);
    return (
      <tr>
          <td>{props.playerstats[0].Name}</td>
          <td>{props.playerstats[0].Hcp}</td>
          {props.playerstats[0].Holes.map((item, index) =>
            <HoleInfo key={index} details={item} handleChange={props.handleChange} /> 
          )}
          <td>Sum:{props.playerstats[0].Strokes}</td>
        </tr>
    )
  }
  else{
    return(<div></div>)
  }
}

const HoleInfo = (props) => {
const handleChange = (event) => {
  console.log(event.target.value)
}

  return (
    <td><input id={props.details.Hole} className="scoreinput" placeholder={props.details.Strokes} onChange={props.handleChange}></input></td>
  )
}

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
      <div>
        <p>WWGC 2022</p>
        <p>Week { getLeagueDate(props.weeks)[0].MatchDate } </p>
        <p>Playing: { side } 9 </p>
      </div>
    )
  }
  else {
    return (
      <div></div>
    )
  }
}
const WeeklyGolfers = (props) => {
  const [scoreinfo, setScoreInfo] = useState();

  const handleScoreChange = (event) => {
    const rowId = event.target.id;
    const player_index = parseInt(rowId.split('-')[0]);
    const hole_index = parseInt(rowId.split('-')[1]) - 1;
    console.log("changing score: ", event.target.value);
    //props.stats[player_index].Holes[hole_index].Score = parseInt(event.target.value);
    setScoreInfo(...scoreinfo, scoreinfo[player_index].Holes[hole_index].Score = parseInt(event.target.value), 
    scoreinfo[player_index].Holes[hole_index].Strokes = props.stats[player_index].Holes.reduce(function (prev, curr) {
      return prev + curr.Strokes;
    }));
    
    //1. save inputted score to JSON object
    //2. loop through current player's holes and if score > 0 (added a score)
    //  const roundedhcp = Hcp.round()
    //  if(hole.Relative9 <= roundedhcp) 
    //  { 
    //    HScore = Score - 1 //need to do this with hcp's > 9 though too 
    //    // need to loop this for if you get 3/4 strokes on each hole
    //    if(roundedHcp > 9) //only give two strokes for valid holes{
    //      const smallerhcp = roundedHcp - 9
    //      if (hole.Relative9 <= smallerHcp){
    //        HScore = HScore - 1
    //      }   
    //    }
    //  }
    //3. items.Holes.reduce(to get total score and total points)
  }

  const handleGolferRemove = (event) => {
    console.log("remove: ", event.target.id);

    //set the golfer's Active flag back to 0
    scoreinfo.filter(item => { 
      if (item.Name == event.target.id){
        item.Active = 0;
        //set this componenet
      } 
    })
  }

  useEffect(() => {
    setScoreInfo(props.stats)
  }, [props.stats])

  console.log("stats set: ", scoreinfo);

  if((props.people.length === undefined && props.stats.length === undefined) || 
    (props.people.length > 0 && props.stats.length > 0)){
    let ParScore = 0
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
      
      { props.stats.map(item => 
        <tr key={item.PlayerNumber}>
        <td><button id={item.Name} onClick={(e) => handleGolferRemove(e)} >X</button></td>
        <td>{item.Name}</td>
        <td>{item.Hcp}</td>
        { item.Holes.map((item, index) => {            
          if(index < 9){              
            return <td key={index}><input id={index+"-"+item.Hole} type="number" onChange={(e) => handleScoreChange(e)} className="scoreinput" hole={item.Hole} score={item.Score} placeholder={item.Par}></input></td>
          }
        })}
        <td><input className="scoreinput" score={item.Strokes} placeholder={item.Holes.reduce(function(previousValue, currentValue)
          {
            return previousValue + currentValue.Par
          }, 0)} disabled="disabled"></input></td>          
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
  const [ courseside, setCourseSide ] = useState("")
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
      const courseside = getSideFromDate(schedule)[0].CourseSide == 1? "Front" : "Back"
      setCourseSide(courseside)
      console.log("8 course info actually")
      golftracker
      .courseinfo(st, schedule[0].Course.CourseNumber)
      .then(response => {
        console.log("9 course info: ", response.data)
        setCourseInfo(response.data)
      })
    }
  }, [st, schedule])
  
  useEffect(() => {
    console.log("10 set golf object")
    let currdetails = {};
    let parscore = 0;

    players.map(player => {
      currdetails.PlayerNumber = player.PlayerNumber
      currdetails.Name = player.FirstNameLastName
      currdetails.Hcp = player.CurrentHandicap
      currdetails.Strokes = 0
      currdetails.TotalScore = 0
      currdetails.TotalPoints = 0
      currdetails.Active = 1

      let holeinfo = []
      courseInfo.TeeBoxes[0].Holes.map((course, index) => {
        //per hole details
        if (courseside === "Front"){
          //front nine
          if(index < 9){
            let hole = {}
            hole.Hole = course.HoleNumber
            hole.Score = 0
            hole.HScore = 0
            hole.Points = 0
            hole.Swings = 0
            hole.RelativeHcp9 = course.RelativeDifficulty9
            hole.RelativeHcp18 = course.RelativeDifficulty18
            hole.Par = course.Par
  
            holeinfo.push(hole)
          }
        }
        else if (courseside === "Back"){
          //back nine
          if(index >= 9){
            let hole = {}
            hole.Hole = course.HoleNumber
            hole.Score = 0
            hole.HScore = 0
            hole.Points = 0
            hole.Swings = 0
            hole.RelativeHcp9 = course.RelativeDifficulty9
            hole.RelativeHcp18 = course.RelativeDifficulty18
            hole.Par = course.Par
  
            holeinfo.push(hole)
          }
        }
      })
      currdetails.ParScore = parscore;
      currdetails.Holes = holeinfo
      golferinfo.push(currdetails)
      
      //clear the object again
      currdetails = {}
    })
    console.log(JSON.stringify(golferinfo))
    //setGolfers(JSON.stringify(golferinfo))
    setGolfers(golferinfo);
  }, [courseInfo])
  
  const getSideFromDate = (dates) => {
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

  /*
  if(courseInfo.length > 0){
    setGolfers(SetGolfObject())
  }
  */

  /*
  const GetCurrentWeekSide = () => {
    const TUESDAY = 2

    //loop through weeks and see if anything matches today if so return just that date
    //otherwise keep the previous date and see where it changes
    
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
  */

  /*
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
  */

  /*
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
          hole.Par = course.Par
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
  */

  /*
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
  */

  const handleScoreUpdate = (event) => {
    console.log('score changed: ', event.target.value);

    //copy state
    const newState = golfers;

    //update value
    const hole = newState[0].Holes[0].Strokes;
    const strokes = parseInt(event.target.value);
    //log new score
    newState[0].Holes[event.target.id - 1].Strokes = strokes;

    //update weighted score and points
    //newState[0].Holes[event.target.id - 1].HScore = newState[0].Holes[event.target.id].RelativeHcp <= newState[0].Hcp? newState[0].Holes[event.target.id - 1].Score - 1: newState[0].Holes[event.target.id - 1].Score;
    //newState[0].Holes[event.target.id - 1].Points = 

    //update total strokes for round
    newState[0].Strokes = newState[0].Holes.reduce(
      (prev, curr) => prev + curr.Strokes, 0
    )
    
    console.log("Changed to: ", event.target.value);

    //push state back
    //setRowData(newState)
    console.log('new state: ', golfers);

    setGolfers(newState);
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
        
        <TestRow stats={golfers} handleChange={(e) => handleScoreUpdate(e)}/>
      </header>
    </div>
  );
}

export default App;