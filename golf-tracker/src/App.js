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
          <td>{props.playerstats[0].Strokes}<sub>{props.playerstats[0].TotalStrokes}</sub><sup>{props.playerstats[0].TotalPoints}</sup></td>
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
  <td className="inputfield"><input id={props.details.Hole} className="scoreinput" placeholder={props.details.Strokes} onChange={props.handleChange}></input><sub>{props.details.HScore}</sub><sup>{props.details.Points}</sup></td>
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
    //for the hole number we can just loop through one persons Holes array and display the Hole
    return (
      <table>
        <thead>
          <tr>
          <th></th><th>Name</th><th>Handicap</th>
            {props.stats[0].Holes.map((item, index) => {
              return <th key={index}>{item.Hole}</th>
            }
            )}
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
  const [ test, setTest ] = useState(0);
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
            hole.Strokes = 0
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

  const AddSkin = () => {
    //this will be used to keep track of all skins, if there are any
  }

  //this will be used in a bit once we can get all the skins and team data in
  const calculateMoney = () => {
    //used to calculate how much money we should have
    //how much goes to the club
    //how much goes towards each skin
    //how much goes towards blind teams

    //gets list of all Active golfers
    const totalNumberOfGolfers = golfers.reduce(function (total, curr) {
      if (curr.Active === 1) {
        total += 1;
      }

      return total;
    });

    //total money = number of golfers * 25 (15 for golf 10 for gambling)
    const totalMoney = totalNumberOfGolfers * 25;
    const toTerry = totalNumberOfGolfers * 15;
    const toSkins = totalNumberOfGolfers * 5;
    const toTeams = totalNumberOfGolfers * 5;

    //money per skin
    //const perSkin = toSkins/NumberOfSkins

    //team payouts
    const firstTeam = toTeams * .6;
    const secondTeam = toTeams * .4;
  }

  const getPointsFromScore = (golfScore) => {
    //1 on 5
    if (golfScore === -4 ){
      return 32;
    }
    //albatross
    else if (golfScore === -3 ){
      return 16;
    }
    //eagle
    else if (golfScore === -2 ){
      return 8;
    }
    //birdie
    else if (golfScore === -1 ){
      return 4;
    }
    //par
    else if(golfScore === 0){
      return 2;
    }
    //bogey
    else if(golfScore === 1){
      return 1;
    }
    else{
      return 0;
    }
  }

  const handleScoreUpdate = (event) => {
    console.log('score changed: ', event.target.value);

    //copy state
    const newState = golfers;

    //update value
    const hole = newState[0].Holes[0].Strokes;
    const strokes = parseInt(event.target.value);
    let currentHole = 0;
    if(event.target.id > 9){
      currentHole = newState[0].Holes[event.target.id % 9 - 1];
    }
    else{
      currentHole = newState[0].Holes[event.target.id - 1];
    }
    //log new score
    currentHole.Strokes = strokes;

    //update weighted score and points
    const hcpMultiplyer = parseInt(Math.round(newState[0].Hcp) / 9);
    const hcpHoles = parseInt(newState[0].Hcp % 9);
    if(currentHole.RelativeHcp9 <= hcpHoles){
      currentHole.HScore = currentHole.Strokes - (1 + hcpMultiplyer);
    }
    else{
      currentHole.HScore = currentHole.Strokes;
    }

    //gives back a golf number like -1 = birdie, -2 = eagle, 0 = par, 1 = bogey, etc...
    const golfScore = currentHole.HScore - currentHole.Par;
    currentHole.Points = getPointsFromScore(golfScore);

    //update total strokes for round
    newState[0].Strokes = newState[0].Holes.reduce(
      (prev, curr) => prev + curr.Strokes, 0
    )

    //update total points for round
    newState[0].TotalPoints = newState[0].Holes.reduce(
      (prev, curr) => prev + curr.Points, 0
    )

    //update total HScore for round
    newState[0].TotalStrokes = newState[0].Holes.reduce(
      (prev, curr) => prev + curr.HScore, 0
    )
    
    console.log("Changed to: ", event.target.value);

    //push state back
    //setRowData(newState)
    console.log('new state: ', golfers);

    setTest(test + 1);
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