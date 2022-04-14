import golftracker from './services/api-calls'
import React, { useState, useEffect } from 'react'
import './App.css';

const BlindTeams = (props) => {
  if(props.stats != undefined && props.stats.length > 0){
    //filter by each team number
    //and create a new object array that looks like
    //{Golfer1: x, Golfer2: y, Points1: a, Points2: b, Total: z}...

    const golfers = props.stats;

    let TeamScores = [];
    let distinctTeams = [];
    golfers.forEach(item => {
      if(item.Team > 0){
        if(!distinctTeams.includes(item.Team)){
          distinctTeams.push(item.Team);
          const curr = { Team: item.Team, Golfer1: "", Score1: 0, Golfer2: "", Score2: 0, Total: 0 };
          TeamScores.push(curr);
        }
      }
    })

    golfers.forEach(golfer => {
      if(golfer.Strokes > 0 && golfer.Team > 0){
        let currTeam = TeamScores.find(team => team.Team == golfer.Team);
        if(currTeam.Golfer1 == ""){
          //first value for team
          currTeam.Golfer1 = golfer.Name; 
          currTeam.Score1 = golfer.TotalPoints;
          currTeam.Total = currTeam.Score1;
        }
        else{
          //second value for team, find where the team is
          currTeam.Golfer2 = golfer.Name; 
          currTeam.Score2 = golfer.TotalPoints;
          currTeam.Total = currTeam.Score1 + currTeam.Score2;
        }
      }
    })

    return(
      <table>
        <thead>
          <tr>
            <th>Golfer</th>
            <th>Points</th>
            <th>Golfer</th>
            <th>Points</th>
            <th>Total Points</th>
          </tr>
        </thead>
        <tbody>
            {TeamScores.map((item, index) => {
              return <tr key={index}>
                <td>{item.Golfer1}</td>
                <td>{item.Score1}</td>
                <td>{item.Golfer2}</td>
                <td>{item.Score2}</td>
                <td>{item.Total}</td>
              </tr>
            })}
        </tbody>
      </table>
    )
  }
  else{
    return (
      <div></div>
    )
  }
}

const Skins = (props) => {
  if(props.stats != undefined && props.stats.length > 0){
    const totalNumberOfGolfers = props.stats.filter(item => item.Active == 1).length;

    //total money = number of golfers * 25 (15 for golf 10 for gambling)
    const proshopMoney = 20;
    const gamblingMoney = 10;
    const totalMoney = totalNumberOfGolfers * (proshopMoney + gamblingMoney);
    const toTerry = totalNumberOfGolfers * proshopMoney;
    const toSkins = totalNumberOfGolfers * (gamblingMoney / 2);
    const toTeams = totalNumberOfGolfers * (gamblingMoney / 2);

    //money per skin
    //const perSkin = toSkins/NumberOfSkins

    //team payouts
    const firstTeam = toTeams * .6;
    const secondTeam = toTeams * .4;

    const golfinfo = props.stats;

    let SkinDetails = [];
    golfinfo[0].Holes.filter((item, index) => {
      const holeIndex = index;
      let PerHoleSkins = []
      let currScore = 999;
      golfinfo.filter(golfer => {
        if(golfer.Strokes > 0 && golfer.Active == 1){
          //loop through golfers only if they have a score and are active
          const HoleData = golfer.Holes[holeIndex];
          if(HoleData.Strokes > 0){
            if(HoleData.HScore < currScore){
              if(PerHoleSkins.length > 0){
                PerHoleSkins.pop();
              }
              const holeSkinInfo = {PlayerName: golfer.Name, PlayerId: golfer.PlayerNumber, HoleIndex: holeIndex, Hole: HoleData.Hole, Score: HoleData.Strokes, HScore: HoleData.HScore };
              PerHoleSkins.push(holeSkinInfo);
              currScore = HoleData.HScore;
            }
            else if (HoleData.HScore == currScore){
              if(PerHoleSkins.length > 0){
                PerHoleSkins.pop();
              }
            }
          }
        }
      });

      if(PerHoleSkins.length == 1){
        SkinDetails.push(PerHoleSkins);
      }
    })

    let perSkin = 0; 
    if(SkinDetails.length > 0){
      perSkin = (toSkins/SkinDetails.length).toLocaleString('en-US', {
        style: 'currency',
        currency: 'USD',
      });
    }
    
    console.log("Skin Info: ", SkinDetails);

    return (
      <div>
        <table className="table table-striped">
          <tbody>
            <tr>
              <td>Number of golfers: {totalNumberOfGolfers}</td>
              <td>Skins: ${toSkins} ({totalNumberOfGolfers} * ${gamblingMoney/2})</td>
              <td>Blind Teams: ${toTeams} ({totalNumberOfGolfers} * ${gamblingMoney/2})</td>
            </tr>
            <tr>
              <td>Total money: ${totalMoney} ({totalNumberOfGolfers} * ${proshopMoney} + ${gamblingMoney})</td>
              <td>Per Skin: {perSkin} (${toSkins} / {SkinDetails.length})</td>
              <td>1st: ${firstTeam} (60% of ${toTeams})</td>
            </tr>
            <tr>
              <td>Terry: ${toTerry} ({totalNumberOfGolfers} * ${proshopMoney})</td>
              <td></td>
              <td>2nd: ${secondTeam} (40% of ${toTeams})</td>
            </tr>
          </tbody>
        </table>

        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Hole</th>
              <th>Gross</th>
              <th>Net</th>
            </tr>
          </thead>          
          <SkinScores skins={SkinDetails} />          
        </table>
      </div>
    )
  }
  else{
    <div></div>
  }

  return (
    <div></div>
  )
}

const SkinScores = (props) => {
  if (props.skins.length > 0 && props.skins != undefined){
    console.log("write skins:", props.skins);
    return(
      <tbody>
      {props.skins.map((item,index) => {
        return <tr key={index}>
          <td>{item[0].PlayerName}</td>
          <td>{item[0].Hole}</td>
          <td>{item[0].Score}</td>
          <td>{item[0].HScore}</td>
        </tr>
      }
      )}
      </tbody>
    )
  }
  else{
    return(
      <tbody>
        <tr>
          <td>No Skins</td>
        </tr>
      </tbody>
    )
  }
}

const GolfersToAdd = (props) => {
  if (props.stats != undefined && props.stats.length > 0){
    const inactiveplayers = props.stats.filter(item => item.Active == 0);
    return (
      <select onChange={props.handleChange}>test
        <option>(Choose One)</option>
        {inactiveplayers.map(item => {
          return <option id={item.PlayerNumber}>{item.Name}</option>
        }
       )}
      </select>
    )
  }
  else{
    return(<div></div>)
  }
}

const WeeklyGolfers = (props) => {
  //REDUX should be needed for this portion so that we can maintain the state of the golfer information
  //see if we can update a value in the props.stats
  console.log(props.stats)

  return(
    <table>
      <thead>
        <InputHeader headerinfo={props.stats} />
        <HCPHeader headerinfo={props.stats} />
      </thead>
        <PlayerRow playerstats={props.stats} handleClick={props.handleClick} handleChange={props.handleChange} handleTeamChange={props.handleTeamChange} />
    </table>
  )
}

const HCPHeader = (props) => {
  if(props.headerinfo != undefined && props.headerinfo.length > 0){
    return(
      <tr>
          <th></th><th></th><th>Handicap</th>
            {props.headerinfo[0].Holes.map((item, index) => {
              return <th key={index}>{item.RelativeHcp9}</th>
            }
            )}
          <th></th><th></th>
      </tr>  
    )
  }
  else{
    return(
      <div></div>
    )
  }
}

const InputHeader = (props) => {
  if(props.headerinfo != undefined && props.headerinfo.length > 0){
    return(
      <tr>
          <th></th><th>Name</th><th>Hole #</th>
            {props.headerinfo[0].Holes.map((item, index) => {
              return <th key={index}>{item.Hole}</th>
            }
            )}
          <th>Total<sub>hcp</sub><sup>pts</sup></th><th>Team #</th>
      </tr>  
    )
  }
  else{
    return(
      <div></div>
    )
  }
}

const PlayerRow = (props) => {
  if(props.playerstats != undefined && props.playerstats.length > 0){
    console.log("playerrow strokes: ", props.playerstats.Strokes);
    const activeplayers = props.playerstats.filter(item => item.Active == 1)
    return ( 
      <tbody>
      { activeplayers.map((player, index) => 
       <tr key={index}>
         <td><button id={player.PlayerNumber} onClick={props.handleClick}>X</button></td>
         <td>{player.Name}</td>
         <td>{Math.round(player.Hcp)}</td>
         {player.Holes.map((item, index) =>
           <HoleInfo key={index} player={player.PlayerNumber} details={item} handleChange={props.handleChange} /> 
         )}
         <td className="scoreTotals">{player.Strokes}<sub>{player.HStrokes}</sub><sup>{player.TotalPoints}</sup></td>
         <td><input id={player.PlayerNumber} className="scoreinput" onChange={props.handleTeamChange}></input></td>
       </tr> 
      )
      }
    </tbody>
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
  <td className="inputfield"><input id={props.player + '-' + props.details.Hole} className="scoreinput" placeholder={props.details.Par} onChange={props.handleChange}></input><sub>{props.details.HScore}</sub><sup>{props.details.Points}</sup></td>
  )
}

const LeagueDate = (props) => {
  //const [ dates, setDates ] = useState([])

  if (props.weeks != undefined && props.weeks.length > 0){
    console.log(props.weeks)

    const getLeagueDate = (dates) => {
      let previous = ""
    const today = new Date()
    today.setHours(0);
    today.setMinutes(0);
    today.setSeconds(0);
    today.setMilliseconds(0);

    //today.setDate(today.getDate() + 6);
    return dates.filter((item, index) => {
        const curr = new Date(item.MatchDate)
        let next;
        if(index < dates.length - 1){
          next = new Date(dates[index + 1].MatchDate);
        }
        else{
          next = new Date(dates[index].MatchDate);
        }
        if(curr === today){
          return item.MatchDate;
        }
        else if (today > previous && today < next){
          return item.MatchDate;
        }
        else{
          previous = curr;          
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

function App() {
  //COURSE SIDES: 1 - FRONT, 2 - BACK

  const [ players, setPlayers ] = useState([])
  const [ schedule, setSchedule ] = useState([])
  const [ courseInfo, setCourseInfo ] = useState([])
  const [ st, setST ] = useState("")
  const [ leagueDate, setLeagueDate ] = useState("")
  const [ golfers, setGolfers ] = useState([])
  const [ courseside, setCourseSide ] = useState("")
  const [ skindetails, setSkinDetails ] = useState([]);
  const [ test, setTest ] = useState(0);
  const [ showMoney, setShowMoney ] = useState(false);
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
      currdetails.PlayerNumber = player.PlayerNumber;
      currdetails.Name = player.FirstNameLastName;
      currdetails.Hcp = player.CurrentHandicap;
      currdetails.Strokes = 0;
      currdetails.HStrokes = 0;
      currdetails.TotalPoints = 0;
      currdetails.Active = 1;
      currdetails.Team = 0;

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
            hole.Skin = 0
  
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
            hole.Strokes = 0
            hole.RelativeHcp9 = course.RelativeDifficulty9
            hole.RelativeHcp18 = course.RelativeDifficulty18
            hole.Par = course.Par
            hole.Skin = 0
  
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
    today.setHours(0);
    today.setMinutes(0);
    today.setSeconds(0);
    today.setMilliseconds(0);

    //today.setDate(today.getDate() + 6);
    return dates.filter((item, index) => {
        const curr = new Date(item.MatchDate)
        let next;
        if(index < dates.length - 1){
          next = new Date(dates[index + 1].MatchDate);
        }
        else{
          next = new Date(dates[index].MatchDate);
        }
        if(curr === today){
          return item.MatchDate;
        }
        else if (today > previous && today < next){
          return item.MatchDate;
        }
        else{
          previous = curr;          
        }
    })
  }

  const AddSkin = () => {
    //this will be used to keep track of all skins, if there are any
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

  const handleTeamChange = (event) => {
    const playerId = event.target.id;
    const teamNum = parseInt(event.target.value);

    const newState = golfers;
    const playerdetails = newState.filter(item => item.PlayerNumber == playerId)[0];

    playerdetails.Team = teamNum;

    setTest(test + 1);
    setGolfers(newState);
  }

  const handleScoreUpdate = (event) => {
    console.log('score changed: ', event.target.value);
    const playerId = event.target.id.split('-')[0];
    const holeNum = event.target.id.split('-')[1];

    //copy state
    const newState = golfers;
    const playerdetails = newState.filter(item => item.PlayerNumber == playerId)[0];
    const playerHcp = parseInt(Math.round(playerdetails.Hcp));

    //update value
    //const hole = playerdetails.Holes[holeNum].Strokes;
    let strokes = 0;
    if(parseInt(event.target.value) > 0){
      strokes = parseInt(event.target.value);
    }
    let currentHole = 0;
      if(holeNum > 9){
        if(holeNum == 18){
          currentHole = playerdetails.Holes[8];
        }
        else{
          currentHole = playerdetails.Holes[holeNum % 9 - 1];
        }
      }
      else{
        currentHole = playerdetails.Holes[holeNum - 1];
      }
      //log new score
      currentHole.Strokes = strokes;

    if(strokes > 0){
      //update weighted score and points
      const hcpMultiplyer =  parseInt(playerHcp / 9);
      const hcpHoles = playerHcp % 9;
      if(playerHcp <= 9){
        if(currentHole.RelativeHcp9 <= hcpHoles){
          currentHole.HScore = currentHole.Strokes - (1 + hcpMultiplyer);
        }
        else{
          currentHole.HScore = currentHole.Strokes;
        }
      }
      else{
        if(currentHole.RelativeHcp9 <= hcpHoles){
          currentHole.HScore = currentHole.Strokes - (1 + hcpMultiplyer);
        }
        else{
          currentHole.HScore = currentHole.Strokes - 1;
        }
      }

      //gives back a golf number like -1 = birdie, -2 = eagle, 0 = par, 1 = bogey, etc...
      const golfScore = currentHole.HScore - currentHole.Par;
      currentHole.Points = getPointsFromScore(golfScore);
    }
    else{
      //if input is not a number or 0 reset everything so we dont get nan
      currentHole.HScore = strokes;
      currentHole.Points = strokes; 
    }

    //update total strokes for round
    playerdetails.Strokes = playerdetails.Holes.reduce(
      (prev, curr) => prev + curr.Strokes, 0
    )

    //update total points for round
    playerdetails.TotalPoints = playerdetails.Holes.reduce(
      (prev, curr) => prev + curr.Points, 0
    )

    //update total HScore for round
    playerdetails.HStrokes = playerdetails.Holes.reduce(
      (prev, curr) => prev + curr.HScore, 0
    )
    
    console.log("Changed to: ", event.target.value);

    //push state back
    //setRowData(newState)
    console.log('new state: ', golfers);

    //CheckSkins(newState);

    setTest(test + 1);
    setGolfers(newState);
  }

  const handlePlayerMove = (event) => {
    const playerId = event.target.id;

    //copy state
    const newState = golfers;

    //find golfer to flip active tag
    const playerdetails = newState.filter(item => item.PlayerNumber == playerId)[0];
    
    playerdetails.Active = 0;  

    setTest(test + 1);
    setGolfers(newState);
  }

  const toggleScores = () => {
    //flip the display on ScoreInput and MoneyStuff
    setShowMoney(wasShown => !wasShown);
    console.log("toggle divs: ", showMoney);
  }

  const ReAddPlayer = (event) => {
    const playerId = event.target[event.target.selectedIndex].id

    //copy state
    const newState = golfers;

    //find golfer to flip active tag
    const playerdetails = newState.filter(item => item.PlayerNumber == playerId)[0];
    
    playerdetails.Active = 1;  

    setTest(test + 1);
    setGolfers(newState);
  }

  const CheckSkins = (golfinfo) =>{
    //need to sort through each person and compare each hole one by one to get the 
    //min HScore only if there's one we care otherwise dont do anything
    //calculating how many skins to pay out
    let SkinDetails = [];
    golfinfo[0].Holes.filter((item, index) => {
      const holeIndex = index;
      let PerHoleSkins = []
      let currScore = 999;
      golfinfo.filter(golfer => {
        if(golfer.Strokes > 0 && golfer.Active == 1){
          //loop through golfers only if they have a score and are active
          const HoleData = golfer.Holes[holeIndex];
          if(HoleData.Strokes > 0){
            if(HoleData.HScore < currScore){
              const holeSkinInfo = {PlayerName: golfer.Name, PlayerId: golfer.PlayerNumber, HoleIndex: holeIndex, Hole: HoleData.Hole, Score: HoleData.Strokes, HScore: HoleData.HScore };
              PerHoleSkins.push(holeSkinInfo);
              currScore = HoleData.HScore;
            }
            else if (HoleData.HScore == currScore){
              if(PerHoleSkins.length > 0){
                PerHoleSkins.pop();
              }
            }
          }
        }
      });

      if(PerHoleSkins.length == 1){
        SkinDetails.push(PerHoleSkins);
        //setTest(test + 1);
        //setSkinDetails(skindetails.concat(PerHoleSkins));
      }
    })
    console.log("Skin Info: ", SkinDetails);
  }

  return (
    <div className="App">
      <header className="App-header">
        <LeagueDate weeks={ schedule }></LeagueDate>
        <GolfersToAdd stats={golfers} handleChange={(e) => ReAddPlayer(e)} />
        <WeeklyGolfers stats={golfers} handleClick={(e) => handlePlayerMove(e)} handleChange={(e) => handleScoreUpdate(e)} handleTeamChange={(e) => handleTeamChange(e)}/>

        <Skins stats={golfers} />
        <BlindTeams stats={golfers} />
        
      </header>
    </div>
  );
}

export default App;

/*
{
!showMoney ?
<div id="ScoreInput">
<GolfersToAdd stats={golfers} handleChange={(e) => ReAddPlayer(e)} />
<WeeklyGolfers stats={golfers} handleClick={(e) => handlePlayerMove(e)} handleChange={(e) => handleScoreUpdate(e)} handleTeamChange={(e) => handleTeamChange(e)}/>
</div>
: <></>
}

{
showMoney ? 
<div id="MoneyStuff">
<Skins stats={golfers} />
<BlindTeams stats={golfers} />
</div> : <></>
}

<button onClick={(e) => toggleScores()}>See Skins</button>
*/