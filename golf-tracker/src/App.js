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

    //total money = number of golfers * 10 (for gambling)
    const gamblingMoney = 10;
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
              <td>Per Skin: {perSkin} (${toSkins} / {SkinDetails.length})</td>
              <td>1st: ${firstTeam} (60% of ${toTeams})</td>
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
  console.log("Is this where we're at?", props.stats)

  return(
    <table className="card">
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
      <tr className="hcprow">
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
      <tr className="holerow">
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
       <tr key={index} className="cardrow">
         <td><button id={player.PlayerNumber} onClick={props.handleClick}>X</button></td>
         <td className="playerinfo">{player.Name}</td>
         <td className="score">{Math.round(player.Hcp)}</td>
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

function App() {
  //COURSE SIDES: 1 - FRONT, 2 - BACK

  /*UNCOMMENT WHEN WEB API WORKS AGAIN
  //removing web api calls since it doesnt work anymore
  //const [ players, setPlayers ] = useState([]);
  //const [ handicap, setHandicap ] = useState([]);
  //const [ schedule, setSchedule ] = useState([]);
  //const [ courseInfo, setCourseInfo ] = useState([]);
  //const [ st, setST ] = useState("");
  //const [ leagueDate, setLeagueDate ] = useState("");
  //const [ courseside, setCourseSide ] = useState("");
  */

 const [ golfers, setGolfers ] = useState([]);
 const [ skindetails, setSkinDetails ] = useState([]);
  
  const [ test, setTest ] = useState(0);
  const [ showMoney, setShowMoney ] = useState(false);
  let golferinfo = {};

useEffect(() => {
  /*
  let curr = [{
    "PlayerNumber":1,
    "Name":"Gordon Judge",
    "Hcp":16,
    "Strokes":0,
    "HStrokes":0,
    "TotalPoints":0,
    "Active":1,
    "Team":0,
    "ParScore":37,
    "Holes":[
      {"Hole":1,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":8,"RelativeHcp18":15,"Par":4,"Skin":0 },
      {"Hole":2,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":5,"RelativeHcp18":9,"Par":4,"Skin":0 },
      {"Hole":3,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":9,"RelativeHcp18":17,"Par":4,"Skin":0 },
      {"Hole":4,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":4,"RelativeHcp18":7,"Par":3,"Skin":0 },
      {"Hole":5,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":7,"RelativeHcp18":13,"Par":5,"Skin":0 },
      {"Hole":6,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":1,"RelativeHcp18":1,"Par":5,"Skin":0 },
      {"Hole":7,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":2,"RelativeHcp18":3,"Par":4,"Skin":0 },
      {"Hole":8,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":3,"RelativeHcp18":5,"Par":4,"Skin":0 },
      {"Hole":9,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":6,"RelativeHcp18":11,"Par":4,"Skin":0 }
    ]
},
  {
      "PlayerNumber":2,
      "Name":"Thayne Mitrik",
      "Hcp":7,
      "Strokes":0,
      "HStrokes":0,
      "TotalPoints":0,
      "Active":1,
      "Team":0,
      "ParScore":37,
      "Holes":[
        {"Hole":1,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":8,"RelativeHcp18":15,"Par":4,"Skin":0 },
        {"Hole":2,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":5,"RelativeHcp18":9,"Par":4,"Skin":0 },
        {"Hole":3,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":9,"RelativeHcp18":17,"Par":4,"Skin":0 },
        {"Hole":4,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":4,"RelativeHcp18":7,"Par":3,"Skin":0 },
        {"Hole":5,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":7,"RelativeHcp18":13,"Par":5,"Skin":0 },
        {"Hole":6,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":1,"RelativeHcp18":1,"Par":5,"Skin":0 },
        {"Hole":7,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":2,"RelativeHcp18":3,"Par":4,"Skin":0 },
        {"Hole":8,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":3,"RelativeHcp18":5,"Par":4,"Skin":0 },
        {"Hole":9,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":6,"RelativeHcp18":11,"Par":4,"Skin":0 }
      ]
  },
  {
      "PlayerNumber":3,
      "Name":"Hal Reck",
      "Hcp":8,
      "Strokes":0,
      "HStrokes":0,
      "TotalPoints":0,
      "Active":1,
      "Team":0,
      "ParScore":37,
      "Holes":[
        {"Hole":1,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":8,"RelativeHcp18":15,"Par":4,"Skin":0 },
        {"Hole":2,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":5,"RelativeHcp18":9,"Par":4,"Skin":0 },
        {"Hole":3,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":9,"RelativeHcp18":17,"Par":4,"Skin":0 },
        {"Hole":4,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":4,"RelativeHcp18":7,"Par":3,"Skin":0 },
        {"Hole":5,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":7,"RelativeHcp18":13,"Par":5,"Skin":0 },
        {"Hole":6,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":1,"RelativeHcp18":1,"Par":5,"Skin":0 },
        {"Hole":7,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":2,"RelativeHcp18":3,"Par":4,"Skin":0 },
        {"Hole":8,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":3,"RelativeHcp18":5,"Par":4,"Skin":0 },
        {"Hole":9,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":6,"RelativeHcp18":11,"Par":4,"Skin":0 }
      ]
  },
{
    "PlayerNumber":4,
    "Name":"Tony Murajda",
    "Hcp":15,
    "Strokes":0,
    "HStrokes":0,
    "TotalPoints":0,
    "Active":1,
    "Team":0,
    "ParScore":37,
    "Holes":[
      {"Hole":1,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":8,"RelativeHcp18":15,"Par":4,"Skin":0 },
      {"Hole":2,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":5,"RelativeHcp18":9,"Par":4,"Skin":0 },
      {"Hole":3,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":9,"RelativeHcp18":17,"Par":4,"Skin":0 },
      {"Hole":4,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":4,"RelativeHcp18":7,"Par":3,"Skin":0 },
      {"Hole":5,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":7,"RelativeHcp18":13,"Par":5,"Skin":0 },
      {"Hole":6,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":1,"RelativeHcp18":1,"Par":5,"Skin":0 },
      {"Hole":7,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":2,"RelativeHcp18":3,"Par":4,"Skin":0 },
      {"Hole":8,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":3,"RelativeHcp18":5,"Par":4,"Skin":0 },
      {"Hole":9,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":6,"RelativeHcp18":11,"Par":4,"Skin":0 }
    ]
},
{
  "PlayerNumber":5,
  "Name":"Zack Steiner",
  "Hcp":8,
  "Strokes":0,
  "HStrokes":0,
  "TotalPoints":0,
  "Active":1,
  "Team":0,
  "ParScore":37,
    "Holes":[
      {"Hole":1,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":8,"RelativeHcp18":15,"Par":4,"Skin":0 },
      {"Hole":2,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":5,"RelativeHcp18":9,"Par":4,"Skin":0 },
      {"Hole":3,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":9,"RelativeHcp18":17,"Par":4,"Skin":0 },
      {"Hole":4,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":4,"RelativeHcp18":7,"Par":3,"Skin":0 },
      {"Hole":5,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":7,"RelativeHcp18":13,"Par":5,"Skin":0 },
      {"Hole":6,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":1,"RelativeHcp18":1,"Par":5,"Skin":0 },
      {"Hole":7,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":2,"RelativeHcp18":3,"Par":4,"Skin":0 },
      {"Hole":8,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":3,"RelativeHcp18":5,"Par":4,"Skin":0 },
      {"Hole":9,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":6,"RelativeHcp18":11,"Par":4,"Skin":0 }
    ]
},
{
    "PlayerNumber":6,
    "Name":"Hank Haddad",
    "Hcp":8,
    "Strokes":0,
    "HStrokes":0,
    "TotalPoints":0,
    "Active":1,
    "Team":0,
    "ParScore":37,
    "Holes":[
      {"Hole":1,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":8,"RelativeHcp18":15,"Par":4,"Skin":0 },
      {"Hole":2,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":5,"RelativeHcp18":9,"Par":4,"Skin":0 },
      {"Hole":3,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":9,"RelativeHcp18":17,"Par":4,"Skin":0 },
      {"Hole":4,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":4,"RelativeHcp18":7,"Par":3,"Skin":0 },
      {"Hole":5,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":7,"RelativeHcp18":13,"Par":5,"Skin":0 },
      {"Hole":6,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":1,"RelativeHcp18":1,"Par":5,"Skin":0 },
      {"Hole":7,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":2,"RelativeHcp18":3,"Par":4,"Skin":0 },
      {"Hole":8,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":3,"RelativeHcp18":5,"Par":4,"Skin":0 },
      {"Hole":9,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":6,"RelativeHcp18":11,"Par":4,"Skin":0 }
    ]
},
{
    "PlayerNumber":7,
    "Name":"Jim Gusky",
    "Hcp":17,
    "Strokes":0,
    "HStrokes":0,
    "TotalPoints":0,
    "Active":1,
    "Team":0,
    "ParScore":37,
    "Holes":[
      {"Hole":1,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":8,"RelativeHcp18":15,"Par":4,"Skin":0 },
      {"Hole":2,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":5,"RelativeHcp18":9,"Par":4,"Skin":0 },
      {"Hole":3,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":9,"RelativeHcp18":17,"Par":4,"Skin":0 },
      {"Hole":4,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":4,"RelativeHcp18":7,"Par":3,"Skin":0 },
      {"Hole":5,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":7,"RelativeHcp18":13,"Par":5,"Skin":0 },
      {"Hole":6,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":1,"RelativeHcp18":1,"Par":5,"Skin":0 },
      {"Hole":7,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":2,"RelativeHcp18":3,"Par":4,"Skin":0 },
      {"Hole":8,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":3,"RelativeHcp18":5,"Par":4,"Skin":0 },
      {"Hole":9,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":6,"RelativeHcp18":11,"Par":4,"Skin":0 }
    ]
},
{
  "PlayerNumber":8,
  "Name":"Greg Mitrik",
  "Hcp":11,
  "Strokes":0,
  "HStrokes":0,
  "TotalPoints":0,
  "Active":1,
  "Team":0,
  "ParScore":37,
    "Holes":[
      {"Hole":1,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":8,"RelativeHcp18":15,"Par":4,"Skin":0 },
      {"Hole":2,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":5,"RelativeHcp18":9,"Par":4,"Skin":0 },
      {"Hole":3,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":9,"RelativeHcp18":17,"Par":4,"Skin":0 },
      {"Hole":4,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":4,"RelativeHcp18":7,"Par":3,"Skin":0 },
      {"Hole":5,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":7,"RelativeHcp18":13,"Par":5,"Skin":0 },
      {"Hole":6,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":1,"RelativeHcp18":1,"Par":5,"Skin":0 },
      {"Hole":7,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":2,"RelativeHcp18":3,"Par":4,"Skin":0 },
      {"Hole":8,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":3,"RelativeHcp18":5,"Par":4,"Skin":0 },
      {"Hole":9,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":6,"RelativeHcp18":11,"Par":4,"Skin":0 }
    ]
},{
"PlayerNumber":9,
"Name":"Tray Cope",
"Hcp":15,
"Strokes":0,
"HStrokes":0,
"TotalPoints":0,
"Active":1,
"Team":0,
"ParScore":37,
    "Holes":[
      {"Hole":1,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":8,"RelativeHcp18":15,"Par":4,"Skin":0 },
      {"Hole":2,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":5,"RelativeHcp18":9,"Par":4,"Skin":0 },
      {"Hole":3,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":9,"RelativeHcp18":17,"Par":4,"Skin":0 },
      {"Hole":4,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":4,"RelativeHcp18":7,"Par":3,"Skin":0 },
      {"Hole":5,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":7,"RelativeHcp18":13,"Par":5,"Skin":0 },
      {"Hole":6,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":1,"RelativeHcp18":1,"Par":5,"Skin":0 },
      {"Hole":7,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":2,"RelativeHcp18":3,"Par":4,"Skin":0 },
      {"Hole":8,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":3,"RelativeHcp18":5,"Par":4,"Skin":0 },
      {"Hole":9,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":6,"RelativeHcp18":11,"Par":4,"Skin":0 }
    ]
},
{
  "PlayerNumber":10,
  "Name":"Amanda Steiner",
  "Hcp":21,
  "Strokes":0,
  "HStrokes":0,
  "TotalPoints":0,
  "Active":1,
  "Team":0,
  "ParScore":37,
    "Holes":[
      {"Hole":1,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":8,"RelativeHcp18":15,"Par":4,"Skin":0 },
      {"Hole":2,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":5,"RelativeHcp18":9,"Par":4,"Skin":0 },
      {"Hole":3,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":9,"RelativeHcp18":17,"Par":4,"Skin":0 },
      {"Hole":4,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":4,"RelativeHcp18":7,"Par":3,"Skin":0 },
      {"Hole":5,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":7,"RelativeHcp18":13,"Par":5,"Skin":0 },
      {"Hole":6,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":1,"RelativeHcp18":1,"Par":5,"Skin":0 },
      {"Hole":7,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":2,"RelativeHcp18":3,"Par":4,"Skin":0 },
      {"Hole":8,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":3,"RelativeHcp18":5,"Par":4,"Skin":0 },
      {"Hole":9,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":6,"RelativeHcp18":11,"Par":4,"Skin":0 }
    ]
},
{
  "PlayerNumber":11,
  "Name":"Dan Rohm",
  "Hcp":5,
  "Strokes":0,
  "HStrokes":0,
  "TotalPoints":0,
  "Active":1,
  "Team":0,
  "ParScore":37,
    "Holes":[
      {"Hole":1,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":8,"RelativeHcp18":15,"Par":4,"Skin":0 },
      {"Hole":2,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":5,"RelativeHcp18":9,"Par":4,"Skin":0 },
      {"Hole":3,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":9,"RelativeHcp18":17,"Par":4,"Skin":0 },
      {"Hole":4,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":4,"RelativeHcp18":7,"Par":3,"Skin":0 },
      {"Hole":5,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":7,"RelativeHcp18":13,"Par":5,"Skin":0 },
      {"Hole":6,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":1,"RelativeHcp18":1,"Par":5,"Skin":0 },
      {"Hole":7,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":2,"RelativeHcp18":3,"Par":4,"Skin":0 },
      {"Hole":8,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":3,"RelativeHcp18":5,"Par":4,"Skin":0 },
      {"Hole":9,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":6,"RelativeHcp18":11,"Par":4,"Skin":0 }
    ]
},
{
"PlayerNumber":12,
"Name":"Shawn Stevens",
"Hcp":9,
"Strokes":0,
"HStrokes":0,
"TotalPoints":0,
"Active":1,
"Team":0,
"ParScore":37,
    "Holes":[
      {"Hole":1,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":8,"RelativeHcp18":15,"Par":4,"Skin":0 },
      {"Hole":2,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":5,"RelativeHcp18":9,"Par":4,"Skin":0 },
      {"Hole":3,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":9,"RelativeHcp18":17,"Par":4,"Skin":0 },
      {"Hole":4,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":4,"RelativeHcp18":7,"Par":3,"Skin":0 },
      {"Hole":5,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":7,"RelativeHcp18":13,"Par":5,"Skin":0 },
      {"Hole":6,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":1,"RelativeHcp18":1,"Par":5,"Skin":0 },
      {"Hole":7,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":2,"RelativeHcp18":3,"Par":4,"Skin":0 },
      {"Hole":8,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":3,"RelativeHcp18":5,"Par":4,"Skin":0 },
      {"Hole":9,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":6,"RelativeHcp18":11,"Par":4,"Skin":0 }
    ]
},
{
"PlayerNumber":13,
"Name":"Eddie Vinay",
"Hcp":6,
"Strokes":0,
"HStrokes":0,
"TotalPoints":0,
"Active":1,
"Team":0,
"ParScore":37,
    "Holes":[
      {"Hole":1,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":8,"RelativeHcp18":15,"Par":4,"Skin":0 },
      {"Hole":2,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":5,"RelativeHcp18":9,"Par":4,"Skin":0 },
      {"Hole":3,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":9,"RelativeHcp18":17,"Par":4,"Skin":0 },
      {"Hole":4,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":4,"RelativeHcp18":7,"Par":3,"Skin":0 },
      {"Hole":5,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":7,"RelativeHcp18":13,"Par":5,"Skin":0 },
      {"Hole":6,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":1,"RelativeHcp18":1,"Par":5,"Skin":0 },
      {"Hole":7,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":2,"RelativeHcp18":3,"Par":4,"Skin":0 },
      {"Hole":8,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":3,"RelativeHcp18":5,"Par":4,"Skin":0 },
      {"Hole":9,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":6,"RelativeHcp18":11,"Par":4,"Skin":0 }
    ]
},
{
  "PlayerNumber":14,
  "Name":"Luke Hils",
  "Hcp":7,
  "Strokes":0,
  "HStrokes":0,
  "TotalPoints":0,
  "Active":1,
  "Team":0,
  "ParScore":37,
    "Holes":[
      {"Hole":1,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":8,"RelativeHcp18":15,"Par":4,"Skin":0 },
      {"Hole":2,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":5,"RelativeHcp18":9,"Par":4,"Skin":0 },
      {"Hole":3,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":9,"RelativeHcp18":17,"Par":4,"Skin":0 },
      {"Hole":4,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":4,"RelativeHcp18":7,"Par":3,"Skin":0 },
      {"Hole":5,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":7,"RelativeHcp18":13,"Par":5,"Skin":0 },
      {"Hole":6,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":1,"RelativeHcp18":1,"Par":5,"Skin":0 },
      {"Hole":7,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":2,"RelativeHcp18":3,"Par":4,"Skin":0 },
      {"Hole":8,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":3,"RelativeHcp18":5,"Par":4,"Skin":0 },
      {"Hole":9,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":6,"RelativeHcp18":11,"Par":4,"Skin":0 }
    ]
},
{
  "PlayerNumber":15,
  "Name":"Sam Briski",
  "Hcp":14,
  "Strokes":0,
  "HStrokes":0,
  "TotalPoints":0,
  "Active":1,
  "Team":0,
  "ParScore":37,
    "Holes":[
      {"Hole":1,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":8,"RelativeHcp18":15,"Par":4,"Skin":0 },
      {"Hole":2,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":5,"RelativeHcp18":9,"Par":4,"Skin":0 },
      {"Hole":3,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":9,"RelativeHcp18":17,"Par":4,"Skin":0 },
      {"Hole":4,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":4,"RelativeHcp18":7,"Par":3,"Skin":0 },
      {"Hole":5,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":7,"RelativeHcp18":13,"Par":5,"Skin":0 },
      {"Hole":6,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":1,"RelativeHcp18":1,"Par":5,"Skin":0 },
      {"Hole":7,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":2,"RelativeHcp18":3,"Par":4,"Skin":0 },
      {"Hole":8,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":3,"RelativeHcp18":5,"Par":4,"Skin":0 },
      {"Hole":9,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":6,"RelativeHcp18":11,"Par":4,"Skin":0 }
    ]
},
{
"PlayerNumber":16,
"Name":"Jake Babyak",
"Hcp":10,
"Strokes":0,
"HStrokes":0,
"TotalPoints":0,
"Active":1,
"Team":0,
"ParScore":37,
    "Holes":[
      {"Hole":1,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":8,"RelativeHcp18":15,"Par":4,"Skin":0 },
      {"Hole":2,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":5,"RelativeHcp18":9,"Par":4,"Skin":0 },
      {"Hole":3,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":9,"RelativeHcp18":17,"Par":4,"Skin":0 },
      {"Hole":4,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":4,"RelativeHcp18":7,"Par":3,"Skin":0 },
      {"Hole":5,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":7,"RelativeHcp18":13,"Par":5,"Skin":0 },
      {"Hole":6,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":1,"RelativeHcp18":1,"Par":5,"Skin":0 },
      {"Hole":7,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":2,"RelativeHcp18":3,"Par":4,"Skin":0 },
      {"Hole":8,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":3,"RelativeHcp18":5,"Par":4,"Skin":0 },
      {"Hole":9,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":6,"RelativeHcp18":11,"Par":4,"Skin":0 }
    ]
},
{
"PlayerNumber":17,
"Name":"Sal Gori",
"Hcp":2,
"Strokes":0,
"HStrokes":0,
"TotalPoints":0,
"Active":1,
"Team":0,
"ParScore":37,
    "Holes":[
      {"Hole":1,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":8,"RelativeHcp18":15,"Par":4,"Skin":0 },
      {"Hole":2,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":5,"RelativeHcp18":9,"Par":4,"Skin":0 },
      {"Hole":3,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":9,"RelativeHcp18":17,"Par":4,"Skin":0 },
      {"Hole":4,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":4,"RelativeHcp18":7,"Par":3,"Skin":0 },
      {"Hole":5,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":7,"RelativeHcp18":13,"Par":5,"Skin":0 },
      {"Hole":6,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":1,"RelativeHcp18":1,"Par":5,"Skin":0 },
      {"Hole":7,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":2,"RelativeHcp18":3,"Par":4,"Skin":0 },
      {"Hole":8,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":3,"RelativeHcp18":5,"Par":4,"Skin":0 },
      {"Hole":9,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":6,"RelativeHcp18":11,"Par":4,"Skin":0 }
    ]
},
{
  "PlayerNumber":18,
  "Name":"Ryan Hixon",
  "Hcp":8,
  "Strokes":0,
  "HStrokes":0,
  "TotalPoints":0,
  "Active":1,
  "Team":0,
  "ParScore":37,
    "Holes":[
      {"Hole":1,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":8,"RelativeHcp18":15,"Par":4,"Skin":0 },
      {"Hole":2,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":5,"RelativeHcp18":9,"Par":4,"Skin":0 },
      {"Hole":3,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":9,"RelativeHcp18":17,"Par":4,"Skin":0 },
      {"Hole":4,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":4,"RelativeHcp18":7,"Par":3,"Skin":0 },
      {"Hole":5,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":7,"RelativeHcp18":13,"Par":5,"Skin":0 },
      {"Hole":6,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":1,"RelativeHcp18":1,"Par":5,"Skin":0 },
      {"Hole":7,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":2,"RelativeHcp18":3,"Par":4,"Skin":0 },
      {"Hole":8,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":3,"RelativeHcp18":5,"Par":4,"Skin":0 },
      {"Hole":9,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":6,"RelativeHcp18":11,"Par":4,"Skin":0 }
    ]
},
{
  "PlayerNumber":19,
  "Name":"Tom Michael",
  "Hcp":15,
  "Strokes":0,
  "HStrokes":0,
  "TotalPoints":0,
  "Active":1,
  "Team":0,
  "ParScore":37,
    "Holes":[
      {"Hole":1,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":8,"RelativeHcp18":15,"Par":4,"Skin":0 },
      {"Hole":2,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":5,"RelativeHcp18":9,"Par":4,"Skin":0 },
      {"Hole":3,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":9,"RelativeHcp18":17,"Par":4,"Skin":0 },
      {"Hole":4,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":4,"RelativeHcp18":7,"Par":3,"Skin":0 },
      {"Hole":5,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":7,"RelativeHcp18":13,"Par":5,"Skin":0 },
      {"Hole":6,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":1,"RelativeHcp18":1,"Par":5,"Skin":0 },
      {"Hole":7,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":2,"RelativeHcp18":3,"Par":4,"Skin":0 },
      {"Hole":8,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":3,"RelativeHcp18":5,"Par":4,"Skin":0 },
      {"Hole":9,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":6,"RelativeHcp18":11,"Par":4,"Skin":0 }
    ]
},
{
"PlayerNumber":20,
"Name":"John Siweckyj",
"Hcp":11,
"Strokes":0,
"HStrokes":0,
"TotalPoints":0,
"Active":1,
"Team":0,
"ParScore":37,
    "Holes":[
      {"Hole":1,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":8,"RelativeHcp18":15,"Par":4,"Skin":0 },
      {"Hole":2,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":5,"RelativeHcp18":9,"Par":4,"Skin":0 },
      {"Hole":3,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":9,"RelativeHcp18":17,"Par":4,"Skin":0 },
      {"Hole":4,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":4,"RelativeHcp18":7,"Par":3,"Skin":0 },
      {"Hole":5,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":7,"RelativeHcp18":13,"Par":5,"Skin":0 },
      {"Hole":6,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":1,"RelativeHcp18":1,"Par":5,"Skin":0 },
      {"Hole":7,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":2,"RelativeHcp18":3,"Par":4,"Skin":0 },
      {"Hole":8,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":3,"RelativeHcp18":5,"Par":4,"Skin":0 },
      {"Hole":9,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":6,"RelativeHcp18":11,"Par":4,"Skin":0 }
    ]
},
{
"PlayerNumber":21,
"Name":"Allen Blazevich",
"Hcp":13,
"Strokes":0,
"HStrokes":0,
"TotalPoints":0,
"Active":1,
"Team":0,
"ParScore":37,
    "Holes":[
      {"Hole":1,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":8,"RelativeHcp18":15,"Par":4,"Skin":0 },
      {"Hole":2,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":5,"RelativeHcp18":9,"Par":4,"Skin":0 },
      {"Hole":3,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":9,"RelativeHcp18":17,"Par":4,"Skin":0 },
      {"Hole":4,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":4,"RelativeHcp18":7,"Par":3,"Skin":0 },
      {"Hole":5,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":7,"RelativeHcp18":13,"Par":5,"Skin":0 },
      {"Hole":6,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":1,"RelativeHcp18":1,"Par":5,"Skin":0 },
      {"Hole":7,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":2,"RelativeHcp18":3,"Par":4,"Skin":0 },
      {"Hole":8,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":3,"RelativeHcp18":5,"Par":4,"Skin":0 },
      {"Hole":9,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":6,"RelativeHcp18":11,"Par":4,"Skin":0 }
    ]
},
{
  "PlayerNumber":22,
  "Name":"Jim Lorenzi",
  "Hcp":14,
  "Strokes":0,
  "HStrokes":0,
  "TotalPoints":0,
  "Active":1,
  "Team":0,
  "ParScore":37,
    "Holes":[
      {"Hole":1,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":8,"RelativeHcp18":15,"Par":4,"Skin":0 },
      {"Hole":2,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":5,"RelativeHcp18":9,"Par":4,"Skin":0 },
      {"Hole":3,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":9,"RelativeHcp18":17,"Par":4,"Skin":0 },
      {"Hole":4,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":4,"RelativeHcp18":7,"Par":3,"Skin":0 },
      {"Hole":5,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":7,"RelativeHcp18":13,"Par":5,"Skin":0 },
      {"Hole":6,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":1,"RelativeHcp18":1,"Par":5,"Skin":0 },
      {"Hole":7,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":2,"RelativeHcp18":3,"Par":4,"Skin":0 },
      {"Hole":8,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":3,"RelativeHcp18":5,"Par":4,"Skin":0 },
      {"Hole":9,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":6,"RelativeHcp18":11,"Par":4,"Skin":0 }
    ]
},
{
  "PlayerNumber":23,
  "Name":"Steve Barron",
  "Hcp":5,
  "Strokes":0,
  "HStrokes":0,
  "TotalPoints":0,
  "Active":1,
  "Team":0,
  "ParScore":37,
    "Holes":[
      {"Hole":1,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":8,"RelativeHcp18":15,"Par":4,"Skin":0 },
      {"Hole":2,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":5,"RelativeHcp18":9,"Par":4,"Skin":0 },
      {"Hole":3,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":9,"RelativeHcp18":17,"Par":4,"Skin":0 },
      {"Hole":4,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":4,"RelativeHcp18":7,"Par":3,"Skin":0 },
      {"Hole":5,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":7,"RelativeHcp18":13,"Par":5,"Skin":0 },
      {"Hole":6,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":1,"RelativeHcp18":1,"Par":5,"Skin":0 },
      {"Hole":7,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":2,"RelativeHcp18":3,"Par":4,"Skin":0 },
      {"Hole":8,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":3,"RelativeHcp18":5,"Par":4,"Skin":0 },
      {"Hole":9,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":6,"RelativeHcp18":11,"Par":4,"Skin":0 }
    ]
},
{
"PlayerNumber":24,
"Name":"Tom Ondrey",
"Hcp":13,
"Strokes":0,
"HStrokes":0,
"TotalPoints":0,
"Active":1,
"Team":0,
"ParScore":37,
    "Holes":[
      {"Hole":1,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":8,"RelativeHcp18":15,"Par":4,"Skin":0 },
      {"Hole":2,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":5,"RelativeHcp18":9,"Par":4,"Skin":0 },
      {"Hole":3,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":9,"RelativeHcp18":17,"Par":4,"Skin":0 },
      {"Hole":4,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":4,"RelativeHcp18":7,"Par":3,"Skin":0 },
      {"Hole":5,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":7,"RelativeHcp18":13,"Par":5,"Skin":0 },
      {"Hole":6,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":1,"RelativeHcp18":1,"Par":5,"Skin":0 },
      {"Hole":7,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":2,"RelativeHcp18":3,"Par":4,"Skin":0 },
      {"Hole":8,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":3,"RelativeHcp18":5,"Par":4,"Skin":0 },
      {"Hole":9,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":6,"RelativeHcp18":11,"Par":4,"Skin":0 }
    ]
},
{
"PlayerNumber":25,
"Name":"Jim Shelton",
"Hcp":7,
"Strokes":0,
"HStrokes":0,
"TotalPoints":0,
"Active":1,
"Team":0,
"ParScore":37,
    "Holes":[
      {"Hole":1,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":8,"RelativeHcp18":15,"Par":4,"Skin":0 },
      {"Hole":2,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":5,"RelativeHcp18":9,"Par":4,"Skin":0 },
      {"Hole":3,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":9,"RelativeHcp18":17,"Par":4,"Skin":0 },
      {"Hole":4,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":4,"RelativeHcp18":7,"Par":3,"Skin":0 },
      {"Hole":5,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":7,"RelativeHcp18":13,"Par":5,"Skin":0 },
      {"Hole":6,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":1,"RelativeHcp18":1,"Par":5,"Skin":0 },
      {"Hole":7,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":2,"RelativeHcp18":3,"Par":4,"Skin":0 },
      {"Hole":8,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":3,"RelativeHcp18":5,"Par":4,"Skin":0 },
      {"Hole":9,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":6,"RelativeHcp18":11,"Par":4,"Skin":0 }
    ]
},
{
  "PlayerNumber":26,
  "Name":"Eddie Vinay Jr",
  "Hcp":11,
  "Strokes":0,
  "HStrokes":0,
  "TotalPoints":0,
  "Active":1,
  "Team":0,
  "ParScore":37,
    "Holes":[
      {"Hole":1,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":8,"RelativeHcp18":15,"Par":4,"Skin":0 },
      {"Hole":2,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":5,"RelativeHcp18":9,"Par":4,"Skin":0 },
      {"Hole":3,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":9,"RelativeHcp18":17,"Par":4,"Skin":0 },
      {"Hole":4,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":4,"RelativeHcp18":7,"Par":3,"Skin":0 },
      {"Hole":5,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":7,"RelativeHcp18":13,"Par":5,"Skin":0 },
      {"Hole":6,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":1,"RelativeHcp18":1,"Par":5,"Skin":0 },
      {"Hole":7,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":2,"RelativeHcp18":3,"Par":4,"Skin":0 },
      {"Hole":8,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":3,"RelativeHcp18":5,"Par":4,"Skin":0 },
      {"Hole":9,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":6,"RelativeHcp18":11,"Par":4,"Skin":0 }
    ]
},
{
  "PlayerNumber":27,
  "Name":"Jeff Volk",
  "Hcp":15,
  "Strokes":0,
  "HStrokes":0,
  "TotalPoints":0,
  "Active":1,
  "Team":0,
  "ParScore":37,
    "Holes":[
      {"Hole":1,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":8,"RelativeHcp18":15,"Par":4,"Skin":0 },
      {"Hole":2,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":5,"RelativeHcp18":9,"Par":4,"Skin":0 },
      {"Hole":3,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":9,"RelativeHcp18":17,"Par":4,"Skin":0 },
      {"Hole":4,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":4,"RelativeHcp18":7,"Par":3,"Skin":0 },
      {"Hole":5,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":7,"RelativeHcp18":13,"Par":5,"Skin":0 },
      {"Hole":6,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":1,"RelativeHcp18":1,"Par":5,"Skin":0 },
      {"Hole":7,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":2,"RelativeHcp18":3,"Par":4,"Skin":0 },
      {"Hole":8,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":3,"RelativeHcp18":5,"Par":4,"Skin":0 },
      {"Hole":9,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":6,"RelativeHcp18":11,"Par":4,"Skin":0 }
    ]
},
{
"PlayerNumber":28,
"Name":"Frenchy Cousineau",
"Hcp":20,
"Strokes":0,
"HStrokes":0,
"TotalPoints":0,
"Active":1,
"Team":0,
"ParScore":37,
    "Holes":[
      {"Hole":1,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":8,"RelativeHcp18":15,"Par":4,"Skin":0 },
      {"Hole":2,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":5,"RelativeHcp18":9,"Par":4,"Skin":0 },
      {"Hole":3,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":9,"RelativeHcp18":17,"Par":4,"Skin":0 },
      {"Hole":4,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":4,"RelativeHcp18":7,"Par":3,"Skin":0 },
      {"Hole":5,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":7,"RelativeHcp18":13,"Par":5,"Skin":0 },
      {"Hole":6,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":1,"RelativeHcp18":1,"Par":5,"Skin":0 },
      {"Hole":7,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":2,"RelativeHcp18":3,"Par":4,"Skin":0 },
      {"Hole":8,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":3,"RelativeHcp18":5,"Par":4,"Skin":0 },
      {"Hole":9,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":6,"RelativeHcp18":11,"Par":4,"Skin":0 }
    ]
},
{
"PlayerNumber":29,
"Name":"Tony Volk",
"Hcp":9,
"Strokes":0,
"HStrokes":0,
"TotalPoints":0,
"Active":1,
"Team":0,
"ParScore":37,
    "Holes":[
      {"Hole":1,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":8,"RelativeHcp18":15,"Par":4,"Skin":0 },
      {"Hole":2,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":5,"RelativeHcp18":9,"Par":4,"Skin":0 },
      {"Hole":3,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":9,"RelativeHcp18":17,"Par":4,"Skin":0 },
      {"Hole":4,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":4,"RelativeHcp18":7,"Par":3,"Skin":0 },
      {"Hole":5,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":7,"RelativeHcp18":13,"Par":5,"Skin":0 },
      {"Hole":6,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":1,"RelativeHcp18":1,"Par":5,"Skin":0 },
      {"Hole":7,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":2,"RelativeHcp18":3,"Par":4,"Skin":0 },
      {"Hole":8,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":3,"RelativeHcp18":5,"Par":4,"Skin":0 },
      {"Hole":9,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":6,"RelativeHcp18":11,"Par":4,"Skin":0 }
    ]
},
{
  "PlayerNumber":30,
  "Name":"Scott Levin",
  "Hcp":7,
  "Strokes":0,
  "HStrokes":0,
  "TotalPoints":0,
  "Active":1,
  "Team":0,
  "ParScore":37,
    "Holes":[
      {"Hole":1,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":8,"RelativeHcp18":15,"Par":4,"Skin":0 },
      {"Hole":2,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":5,"RelativeHcp18":9,"Par":4,"Skin":0 },
      {"Hole":3,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":9,"RelativeHcp18":17,"Par":4,"Skin":0 },
      {"Hole":4,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":4,"RelativeHcp18":7,"Par":3,"Skin":0 },
      {"Hole":5,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":7,"RelativeHcp18":13,"Par":5,"Skin":0 },
      {"Hole":6,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":1,"RelativeHcp18":1,"Par":5,"Skin":0 },
      {"Hole":7,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":2,"RelativeHcp18":3,"Par":4,"Skin":0 },
      {"Hole":8,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":3,"RelativeHcp18":5,"Par":4,"Skin":0 },
      {"Hole":9,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":6,"RelativeHcp18":11,"Par":4,"Skin":0 }
    ]
},
{
  "PlayerNumber":31,
  "Name":"Brandon Grady",
  "Hcp":13,
  "Strokes":0,
  "HStrokes":0,
  "TotalPoints":0,
  "Active":1,
  "Team":0,
  "ParScore":37,
    "Holes":[
      {"Hole":1,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":8,"RelativeHcp18":15,"Par":4,"Skin":0 },
      {"Hole":2,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":5,"RelativeHcp18":9,"Par":4,"Skin":0 },
      {"Hole":3,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":9,"RelativeHcp18":17,"Par":4,"Skin":0 },
      {"Hole":4,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":4,"RelativeHcp18":7,"Par":3,"Skin":0 },
      {"Hole":5,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":7,"RelativeHcp18":13,"Par":5,"Skin":0 },
      {"Hole":6,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":1,"RelativeHcp18":1,"Par":5,"Skin":0 },
      {"Hole":7,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":2,"RelativeHcp18":3,"Par":4,"Skin":0 },
      {"Hole":8,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":3,"RelativeHcp18":5,"Par":4,"Skin":0 },
      {"Hole":9,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":6,"RelativeHcp18":11,"Par":4,"Skin":0 }
    ]
},
{
"PlayerNumber":32,
"Name":"Jeff Steele",
"Hcp":12,
"Strokes":0,
"HStrokes":0,
"TotalPoints":0,
"Active":1,
"Team":0,
"ParScore":37,
    "Holes":[
      {"Hole":1,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":8,"RelativeHcp18":15,"Par":4,"Skin":0 },
      {"Hole":2,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":5,"RelativeHcp18":9,"Par":4,"Skin":0 },
      {"Hole":3,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":9,"RelativeHcp18":17,"Par":4,"Skin":0 },
      {"Hole":4,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":4,"RelativeHcp18":7,"Par":3,"Skin":0 },
      {"Hole":5,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":7,"RelativeHcp18":13,"Par":5,"Skin":0 },
      {"Hole":6,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":1,"RelativeHcp18":1,"Par":5,"Skin":0 },
      {"Hole":7,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":2,"RelativeHcp18":3,"Par":4,"Skin":0 },
      {"Hole":8,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":3,"RelativeHcp18":5,"Par":4,"Skin":0 },
      {"Hole":9,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":6,"RelativeHcp18":11,"Par":4,"Skin":0 }
    ]
},
{
"PlayerNumber":33,
"Name":"Mark McNeil",
"Hcp":10,
"Strokes":0,
"HStrokes":0,
"TotalPoints":0,
"Active":1,
"Team":0,
"ParScore":37,
    "Holes":[
      {"Hole":1,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":8,"RelativeHcp18":15,"Par":4,"Skin":0 },
      {"Hole":2,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":5,"RelativeHcp18":9,"Par":4,"Skin":0 },
      {"Hole":3,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":9,"RelativeHcp18":17,"Par":4,"Skin":0 },
      {"Hole":4,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":4,"RelativeHcp18":7,"Par":3,"Skin":0 },
      {"Hole":5,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":7,"RelativeHcp18":13,"Par":5,"Skin":0 },
      {"Hole":6,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":1,"RelativeHcp18":1,"Par":5,"Skin":0 },
      {"Hole":7,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":2,"RelativeHcp18":3,"Par":4,"Skin":0 },
      {"Hole":8,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":3,"RelativeHcp18":5,"Par":4,"Skin":0 },
      {"Hole":9,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":6,"RelativeHcp18":11,"Par":4,"Skin":0 }
    ]
},
{
  "PlayerNumber":34,
  "Name":"Ed Tozzi",
  "Hcp":8,
  "Strokes":0,
  "HStrokes":0,
  "TotalPoints":0,
  "Active":1,
  "Team":0,
  "ParScore":37,
    "Holes":[
      {"Hole":1,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":8,"RelativeHcp18":15,"Par":4,"Skin":0 },
      {"Hole":2,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":5,"RelativeHcp18":9,"Par":4,"Skin":0 },
      {"Hole":3,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":9,"RelativeHcp18":17,"Par":4,"Skin":0 },
      {"Hole":4,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":4,"RelativeHcp18":7,"Par":3,"Skin":0 },
      {"Hole":5,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":7,"RelativeHcp18":13,"Par":5,"Skin":0 },
      {"Hole":6,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":1,"RelativeHcp18":1,"Par":5,"Skin":0 },
      {"Hole":7,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":2,"RelativeHcp18":3,"Par":4,"Skin":0 },
      {"Hole":8,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":3,"RelativeHcp18":5,"Par":4,"Skin":0 },
      {"Hole":9,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":6,"RelativeHcp18":11,"Par":4,"Skin":0 }
    ]
},
{
  "PlayerNumber":35,
  "Name":"Darrin Fentres",
  "Hcp":15,
  "Strokes":0,
  "HStrokes":0,
  "TotalPoints":0,
  "Active":1,
  "Team":0,
  "ParScore":37,
    "Holes":[
      {"Hole":1,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":8,"RelativeHcp18":15,"Par":4,"Skin":0 },
      {"Hole":2,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":5,"RelativeHcp18":9,"Par":4,"Skin":0 },
      {"Hole":3,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":9,"RelativeHcp18":17,"Par":4,"Skin":0 },
      {"Hole":4,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":4,"RelativeHcp18":7,"Par":3,"Skin":0 },
      {"Hole":5,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":7,"RelativeHcp18":13,"Par":5,"Skin":0 },
      {"Hole":6,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":1,"RelativeHcp18":1,"Par":5,"Skin":0 },
      {"Hole":7,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":2,"RelativeHcp18":3,"Par":4,"Skin":0 },
      {"Hole":8,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":3,"RelativeHcp18":5,"Par":4,"Skin":0 },
      {"Hole":9,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":6,"RelativeHcp18":11,"Par":4,"Skin":0 }
    ]
},
{
"PlayerNumber":36,
"Name":"Dave Critchfield",
"Hcp":22,
"Strokes":0,
"HStrokes":0,
"TotalPoints":0,
"Active":1,
"Team":0,
"ParScore":37,
    "Holes":[
      {"Hole":1,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":8,"RelativeHcp18":15,"Par":4,"Skin":0 },
      {"Hole":2,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":5,"RelativeHcp18":9,"Par":4,"Skin":0 },
      {"Hole":3,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":9,"RelativeHcp18":17,"Par":4,"Skin":0 },
      {"Hole":4,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":4,"RelativeHcp18":7,"Par":3,"Skin":0 },
      {"Hole":5,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":7,"RelativeHcp18":13,"Par":5,"Skin":0 },
      {"Hole":6,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":1,"RelativeHcp18":1,"Par":5,"Skin":0 },
      {"Hole":7,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":2,"RelativeHcp18":3,"Par":4,"Skin":0 },
      {"Hole":8,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":3,"RelativeHcp18":5,"Par":4,"Skin":0 },
      {"Hole":9,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":6,"RelativeHcp18":11,"Par":4,"Skin":0 }
    ]
},
{
"PlayerNumber":37,
"Name":"Dave Kukulka",
"Hcp":11,
"Strokes":0,
"HStrokes":0,
"TotalPoints":0,
"Active":1,
"Team":0,
"ParScore":37,
    "Holes":[
      {"Hole":1,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":8,"RelativeHcp18":15,"Par":4,"Skin":0 },
      {"Hole":2,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":5,"RelativeHcp18":9,"Par":4,"Skin":0 },
      {"Hole":3,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":9,"RelativeHcp18":17,"Par":4,"Skin":0 },
      {"Hole":4,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":4,"RelativeHcp18":7,"Par":3,"Skin":0 },
      {"Hole":5,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":7,"RelativeHcp18":13,"Par":5,"Skin":0 },
      {"Hole":6,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":1,"RelativeHcp18":1,"Par":5,"Skin":0 },
      {"Hole":7,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":2,"RelativeHcp18":3,"Par":4,"Skin":0 },
      {"Hole":8,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":3,"RelativeHcp18":5,"Par":4,"Skin":0 },
      {"Hole":9,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":6,"RelativeHcp18":11,"Par":4,"Skin":0 }
    ]
},
{
  "PlayerNumber":38,
  "Name":"Lonnell Becoate",
  "Hcp":23,
  "Strokes":0,
  "HStrokes":0,
  "TotalPoints":0,
  "Active":1,
  "Team":0,
  "ParScore":37,
    "Holes":[
      {"Hole":1,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":8,"RelativeHcp18":15,"Par":4,"Skin":0 },
      {"Hole":2,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":5,"RelativeHcp18":9,"Par":4,"Skin":0 },
      {"Hole":3,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":9,"RelativeHcp18":17,"Par":4,"Skin":0 },
      {"Hole":4,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":4,"RelativeHcp18":7,"Par":3,"Skin":0 },
      {"Hole":5,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":7,"RelativeHcp18":13,"Par":5,"Skin":0 },
      {"Hole":6,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":1,"RelativeHcp18":1,"Par":5,"Skin":0 },
      {"Hole":7,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":2,"RelativeHcp18":3,"Par":4,"Skin":0 },
      {"Hole":8,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":3,"RelativeHcp18":5,"Par":4,"Skin":0 },
      {"Hole":9,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":6,"RelativeHcp18":11,"Par":4,"Skin":0 }
    ]
},
{
  "PlayerNumber":39,
  "Name":"Jamison Judge",
  "Hcp":12,
  "Strokes":0,
  "HStrokes":0,
  "TotalPoints":0,
  "Active":1,
  "Team":0,
  "ParScore":37,
    "Holes":[
      {"Hole":1,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":8,"RelativeHcp18":15,"Par":4,"Skin":0 },
      {"Hole":2,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":5,"RelativeHcp18":9,"Par":4,"Skin":0 },
      {"Hole":3,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":9,"RelativeHcp18":17,"Par":4,"Skin":0 },
      {"Hole":4,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":4,"RelativeHcp18":7,"Par":3,"Skin":0 },
      {"Hole":5,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":7,"RelativeHcp18":13,"Par":5,"Skin":0 },
      {"Hole":6,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":1,"RelativeHcp18":1,"Par":5,"Skin":0 },
      {"Hole":7,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":2,"RelativeHcp18":3,"Par":4,"Skin":0 },
      {"Hole":8,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":3,"RelativeHcp18":5,"Par":4,"Skin":0 },
      {"Hole":9,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":6,"RelativeHcp18":11,"Par":4,"Skin":0 }
    ]
},
{
"PlayerNumber":40,
"Name":"Donny Fast",
"Hcp":9,
"Strokes":0,
"HStrokes":0,
"TotalPoints":0,
"Active":1,
"Team":0,
"ParScore":37,
"Holes":[
  {"Hole":1,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":8,"RelativeHcp18":15,"Par":4,"Skin":0 },
  {"Hole":2,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":5,"RelativeHcp18":9,"Par":4,"Skin":0 },
  {"Hole":3,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":9,"RelativeHcp18":17,"Par":4,"Skin":0 },
  {"Hole":4,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":4,"RelativeHcp18":7,"Par":3,"Skin":0 },
  {"Hole":5,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":7,"RelativeHcp18":13,"Par":5,"Skin":0 },
  {"Hole":6,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":1,"RelativeHcp18":1,"Par":5,"Skin":0 },
  {"Hole":7,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":2,"RelativeHcp18":3,"Par":4,"Skin":0 },
  {"Hole":8,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":3,"RelativeHcp18":5,"Par":4,"Skin":0 },
  {"Hole":9,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":6,"RelativeHcp18":11,"Par":4,"Skin":0 }
]
},
];
*/


let curr = [{
  "PlayerNumber":1,
  "Name":"Gordon Judge",
  "Hcp":13,
  "Strokes":0,
  "HStrokes":0,
  "TotalPoints":0,
  "Active":1,
  "Team":0,
  "ParScore":34,
"Holes":[
{"Hole":10,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":5,"RelativeHcp18":10,"Par":4,"Skin":0 },
{"Hole":11,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":3,"RelativeHcp18":6,"Par":3,"Skin":0 },
{"Hole":12,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":6,"RelativeHcp18":12,"Par":4,"Skin":0 },
{"Hole":13,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":7,"RelativeHcp18":14,"Par":4,"Skin":0 },
{"Hole":14,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":9,"RelativeHcp18":18,"Par":3,"Skin":0 },
{"Hole":15,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":8,"RelativeHcp18":16,"Par":3,"Skin":0 },
{"Hole":16,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":1,"RelativeHcp18":2,"Par":5,"Skin":0 },
{"Hole":17,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":4,"RelativeHcp18":8,"Par":4,"Skin":0 },
{"Hole":18,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":2,"RelativeHcp18":4,"Par":4,"Skin":0 }
]
},
{
    "PlayerNumber":2,
    "Name":"Thayne Mitrik",
    "Hcp":5,
    "Strokes":0,
    "HStrokes":0,
    "TotalPoints":0,
    "Active":1,
    "Team":0,
    "ParScore":34,
"Holes":[
{"Hole":10,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":5,"RelativeHcp18":10,"Par":4,"Skin":0 },
{"Hole":11,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":3,"RelativeHcp18":6,"Par":3,"Skin":0 },
{"Hole":12,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":6,"RelativeHcp18":12,"Par":4,"Skin":0 },
{"Hole":13,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":7,"RelativeHcp18":14,"Par":4,"Skin":0 },
{"Hole":14,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":9,"RelativeHcp18":18,"Par":3,"Skin":0 },
{"Hole":15,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":8,"RelativeHcp18":16,"Par":3,"Skin":0 },
{"Hole":16,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":1,"RelativeHcp18":2,"Par":5,"Skin":0 },
{"Hole":17,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":4,"RelativeHcp18":8,"Par":4,"Skin":0 },
{"Hole":18,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":2,"RelativeHcp18":4,"Par":4,"Skin":0 }
]
},
{
    "PlayerNumber":3,
    "Name":"Hal Reck",
    "Hcp":7,
    "Strokes":0,
    "HStrokes":0,
    "TotalPoints":0,
    "Active":1,
    "Team":0,
    "ParScore":34,
"Holes":[
{"Hole":10,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":5,"RelativeHcp18":10,"Par":4,"Skin":0 },
{"Hole":11,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":3,"RelativeHcp18":6,"Par":3,"Skin":0 },
{"Hole":12,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":6,"RelativeHcp18":12,"Par":4,"Skin":0 },
{"Hole":13,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":7,"RelativeHcp18":14,"Par":4,"Skin":0 },
{"Hole":14,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":9,"RelativeHcp18":18,"Par":3,"Skin":0 },
{"Hole":15,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":8,"RelativeHcp18":16,"Par":3,"Skin":0 },
{"Hole":16,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":1,"RelativeHcp18":2,"Par":5,"Skin":0 },
{"Hole":17,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":4,"RelativeHcp18":8,"Par":4,"Skin":0 },
{"Hole":18,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":2,"RelativeHcp18":4,"Par":4,"Skin":0 }
]
},
{
  "PlayerNumber":4,
  "Name":"Tony Murajda",
  "Hcp":13,
  "Strokes":0,
  "HStrokes":0,
  "TotalPoints":0,
  "Active":1,
  "Team":0,
  "ParScore":34,
"Holes":[
{"Hole":10,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":5,"RelativeHcp18":10,"Par":4,"Skin":0 },
{"Hole":11,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":3,"RelativeHcp18":6,"Par":3,"Skin":0 },
{"Hole":12,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":6,"RelativeHcp18":12,"Par":4,"Skin":0 },
{"Hole":13,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":7,"RelativeHcp18":14,"Par":4,"Skin":0 },
{"Hole":14,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":9,"RelativeHcp18":18,"Par":3,"Skin":0 },
{"Hole":15,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":8,"RelativeHcp18":16,"Par":3,"Skin":0 },
{"Hole":16,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":1,"RelativeHcp18":2,"Par":5,"Skin":0 },
{"Hole":17,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":4,"RelativeHcp18":8,"Par":4,"Skin":0 },
{"Hole":18,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":2,"RelativeHcp18":4,"Par":4,"Skin":0 }
]
},
{
"PlayerNumber":5,
"Name":"Zack Steiner",
"Hcp":7,
"Strokes":0,
"HStrokes":0,
"TotalPoints":0,
"Active":1,
"Team":0,
"ParScore":34,
"Holes":[
{"Hole":10,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":5,"RelativeHcp18":10,"Par":4,"Skin":0 },
{"Hole":11,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":3,"RelativeHcp18":6,"Par":3,"Skin":0 },
{"Hole":12,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":6,"RelativeHcp18":12,"Par":4,"Skin":0 },
{"Hole":13,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":7,"RelativeHcp18":14,"Par":4,"Skin":0 },
{"Hole":14,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":9,"RelativeHcp18":18,"Par":3,"Skin":0 },
{"Hole":15,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":8,"RelativeHcp18":16,"Par":3,"Skin":0 },
{"Hole":16,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":1,"RelativeHcp18":2,"Par":5,"Skin":0 },
{"Hole":17,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":4,"RelativeHcp18":8,"Par":4,"Skin":0 },
{"Hole":18,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":2,"RelativeHcp18":4,"Par":4,"Skin":0 }
]
},
{
  "PlayerNumber":6,
  "Name":"Hank Haddad",
  "Hcp":6,
  "Strokes":0,
  "HStrokes":0,
  "TotalPoints":0,
  "Active":1,
  "Team":0,
  "ParScore":34,
"Holes":[
{"Hole":10,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":5,"RelativeHcp18":10,"Par":4,"Skin":0 },
{"Hole":11,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":3,"RelativeHcp18":6,"Par":3,"Skin":0 },
{"Hole":12,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":6,"RelativeHcp18":12,"Par":4,"Skin":0 },
{"Hole":13,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":7,"RelativeHcp18":14,"Par":4,"Skin":0 },
{"Hole":14,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":9,"RelativeHcp18":18,"Par":3,"Skin":0 },
{"Hole":15,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":8,"RelativeHcp18":16,"Par":3,"Skin":0 },
{"Hole":16,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":1,"RelativeHcp18":2,"Par":5,"Skin":0 },
{"Hole":17,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":4,"RelativeHcp18":8,"Par":4,"Skin":0 },
{"Hole":18,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":2,"RelativeHcp18":4,"Par":4,"Skin":0 }
]
},
{
  "PlayerNumber":7,
  "Name":"Jim Gusky",
  "Hcp":15,
  "Strokes":0,
  "HStrokes":0,
  "TotalPoints":0,
  "Active":1,
  "Team":0,
  "ParScore":34,
"Holes":[
{"Hole":10,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":5,"RelativeHcp18":10,"Par":4,"Skin":0 },
{"Hole":11,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":3,"RelativeHcp18":6,"Par":3,"Skin":0 },
{"Hole":12,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":6,"RelativeHcp18":12,"Par":4,"Skin":0 },
{"Hole":13,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":7,"RelativeHcp18":14,"Par":4,"Skin":0 },
{"Hole":14,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":9,"RelativeHcp18":18,"Par":3,"Skin":0 },
{"Hole":15,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":8,"RelativeHcp18":16,"Par":3,"Skin":0 },
{"Hole":16,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":1,"RelativeHcp18":2,"Par":5,"Skin":0 },
{"Hole":17,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":4,"RelativeHcp18":8,"Par":4,"Skin":0 },
{"Hole":18,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":2,"RelativeHcp18":4,"Par":4,"Skin":0 }
]
},
{
"PlayerNumber":8,
"Name":"Greg Mitrik",
"Hcp":9,
"Strokes":0,
"HStrokes":0,
"TotalPoints":0,
"Active":1,
"Team":0,
"ParScore":34,
"Holes":[
{"Hole":10,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":5,"RelativeHcp18":10,"Par":4,"Skin":0 },
{"Hole":11,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":3,"RelativeHcp18":6,"Par":3,"Skin":0 },
{"Hole":12,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":6,"RelativeHcp18":12,"Par":4,"Skin":0 },
{"Hole":13,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":7,"RelativeHcp18":14,"Par":4,"Skin":0 },
{"Hole":14,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":9,"RelativeHcp18":18,"Par":3,"Skin":0 },
{"Hole":15,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":8,"RelativeHcp18":16,"Par":3,"Skin":0 },
{"Hole":16,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":1,"RelativeHcp18":2,"Par":5,"Skin":0 },
{"Hole":17,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":4,"RelativeHcp18":8,"Par":4,"Skin":0 },
{"Hole":18,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":2,"RelativeHcp18":4,"Par":4,"Skin":0 }
]
},{
"PlayerNumber":9,
"Name":"Tray Cope",
"Hcp":13,
"Strokes":0,
"HStrokes":0,
"TotalPoints":0,
"Active":1,
"Team":0,
"ParScore":34,
"Holes":[
{"Hole":10,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":5,"RelativeHcp18":10,"Par":4,"Skin":0 },
{"Hole":11,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":3,"RelativeHcp18":6,"Par":3,"Skin":0 },
{"Hole":12,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":6,"RelativeHcp18":12,"Par":4,"Skin":0 },
{"Hole":13,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":7,"RelativeHcp18":14,"Par":4,"Skin":0 },
{"Hole":14,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":9,"RelativeHcp18":18,"Par":3,"Skin":0 },
{"Hole":15,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":8,"RelativeHcp18":16,"Par":3,"Skin":0 },
{"Hole":16,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":1,"RelativeHcp18":2,"Par":5,"Skin":0 },
{"Hole":17,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":4,"RelativeHcp18":8,"Par":4,"Skin":0 },
{"Hole":18,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":2,"RelativeHcp18":4,"Par":4,"Skin":0 }
]
},
{
"PlayerNumber":10,
"Name":"Amanda Steiner",
"Hcp":17,
"Strokes":0,
"HStrokes":0,
"TotalPoints":0,
"Active":1,
"Team":0,
"ParScore":34,
"Holes":[
{"Hole":10,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":5,"RelativeHcp18":10,"Par":4,"Skin":0 },
{"Hole":11,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":3,"RelativeHcp18":6,"Par":3,"Skin":0 },
{"Hole":12,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":6,"RelativeHcp18":12,"Par":4,"Skin":0 },
{"Hole":13,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":7,"RelativeHcp18":14,"Par":4,"Skin":0 },
{"Hole":14,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":9,"RelativeHcp18":18,"Par":3,"Skin":0 },
{"Hole":15,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":8,"RelativeHcp18":16,"Par":3,"Skin":0 },
{"Hole":16,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":1,"RelativeHcp18":2,"Par":5,"Skin":0 },
{"Hole":17,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":4,"RelativeHcp18":8,"Par":4,"Skin":0 },
{"Hole":18,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":2,"RelativeHcp18":4,"Par":4,"Skin":0 }
]
},
{
"PlayerNumber":11,
"Name":"Dan Rohm",
"Hcp":3,
"Strokes":0,
"HStrokes":0,
"TotalPoints":0,
"Active":1,
"Team":0,
"ParScore":34,
"Holes":[
{"Hole":10,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":5,"RelativeHcp18":10,"Par":4,"Skin":0 },
{"Hole":11,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":3,"RelativeHcp18":6,"Par":3,"Skin":0 },
{"Hole":12,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":6,"RelativeHcp18":12,"Par":4,"Skin":0 },
{"Hole":13,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":7,"RelativeHcp18":14,"Par":4,"Skin":0 },
{"Hole":14,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":9,"RelativeHcp18":18,"Par":3,"Skin":0 },
{"Hole":15,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":8,"RelativeHcp18":16,"Par":3,"Skin":0 },
{"Hole":16,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":1,"RelativeHcp18":2,"Par":5,"Skin":0 },
{"Hole":17,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":4,"RelativeHcp18":8,"Par":4,"Skin":0 },
{"Hole":18,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":2,"RelativeHcp18":4,"Par":4,"Skin":0 }
]
},
{
"PlayerNumber":12,
"Name":"Shawn Stevens",
"Hcp":8,
"Strokes":0,
"HStrokes":0,
"TotalPoints":0,
"Active":1,
"Team":0,
"ParScore":34,
"Holes":[
{"Hole":10,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":5,"RelativeHcp18":10,"Par":4,"Skin":0 },
{"Hole":11,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":3,"RelativeHcp18":6,"Par":3,"Skin":0 },
{"Hole":12,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":6,"RelativeHcp18":12,"Par":4,"Skin":0 },
{"Hole":13,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":7,"RelativeHcp18":14,"Par":4,"Skin":0 },
{"Hole":14,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":9,"RelativeHcp18":18,"Par":3,"Skin":0 },
{"Hole":15,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":8,"RelativeHcp18":16,"Par":3,"Skin":0 },
{"Hole":16,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":1,"RelativeHcp18":2,"Par":5,"Skin":0 },
{"Hole":17,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":4,"RelativeHcp18":8,"Par":4,"Skin":0 },
{"Hole":18,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":2,"RelativeHcp18":4,"Par":4,"Skin":0 }
]
},
{
"PlayerNumber":13,
"Name":"Eddie Vinay",
"Hcp":6,
"Strokes":0,
"HStrokes":0,
"TotalPoints":0,
"Active":1,
"Team":0,
"ParScore":34,
"Holes":[
{"Hole":10,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":5,"RelativeHcp18":10,"Par":4,"Skin":0 },
{"Hole":11,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":3,"RelativeHcp18":6,"Par":3,"Skin":0 },
{"Hole":12,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":6,"RelativeHcp18":12,"Par":4,"Skin":0 },
{"Hole":13,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":7,"RelativeHcp18":14,"Par":4,"Skin":0 },
{"Hole":14,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":9,"RelativeHcp18":18,"Par":3,"Skin":0 },
{"Hole":15,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":8,"RelativeHcp18":16,"Par":3,"Skin":0 },
{"Hole":16,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":1,"RelativeHcp18":2,"Par":5,"Skin":0 },
{"Hole":17,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":4,"RelativeHcp18":8,"Par":4,"Skin":0 },
{"Hole":18,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":2,"RelativeHcp18":4,"Par":4,"Skin":0 }
]
},
{
"PlayerNumber":14,
"Name":"Luke Hils",
"Hcp":6,
"Strokes":0,
"HStrokes":0,
"TotalPoints":0,
"Active":1,
"Team":0,
"ParScore":34,
"Holes":[
{"Hole":10,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":5,"RelativeHcp18":10,"Par":4,"Skin":0 },
{"Hole":11,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":3,"RelativeHcp18":6,"Par":3,"Skin":0 },
{"Hole":12,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":6,"RelativeHcp18":12,"Par":4,"Skin":0 },
{"Hole":13,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":7,"RelativeHcp18":14,"Par":4,"Skin":0 },
{"Hole":14,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":9,"RelativeHcp18":18,"Par":3,"Skin":0 },
{"Hole":15,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":8,"RelativeHcp18":16,"Par":3,"Skin":0 },
{"Hole":16,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":1,"RelativeHcp18":2,"Par":5,"Skin":0 },
{"Hole":17,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":4,"RelativeHcp18":8,"Par":4,"Skin":0 },
{"Hole":18,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":2,"RelativeHcp18":4,"Par":4,"Skin":0 }
]
},
{
"PlayerNumber":15,
"Name":"Sam Briski",
"Hcp":11,
"Strokes":0,
"HStrokes":0,
"TotalPoints":0,
"Active":1,
"Team":0,
"ParScore":34,
"Holes":[
{"Hole":10,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":5,"RelativeHcp18":10,"Par":4,"Skin":0 },
{"Hole":11,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":3,"RelativeHcp18":6,"Par":3,"Skin":0 },
{"Hole":12,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":6,"RelativeHcp18":12,"Par":4,"Skin":0 },
{"Hole":13,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":7,"RelativeHcp18":14,"Par":4,"Skin":0 },
{"Hole":14,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":9,"RelativeHcp18":18,"Par":3,"Skin":0 },
{"Hole":15,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":8,"RelativeHcp18":16,"Par":3,"Skin":0 },
{"Hole":16,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":1,"RelativeHcp18":2,"Par":5,"Skin":0 },
{"Hole":17,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":4,"RelativeHcp18":8,"Par":4,"Skin":0 },
{"Hole":18,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":2,"RelativeHcp18":4,"Par":4,"Skin":0 }
]
},
{
"PlayerNumber":16,
"Name":"Jake Babyak",
"Hcp":9,
"Strokes":0,
"HStrokes":0,
"TotalPoints":0,
"Active":1,
"Team":0,
"ParScore":34,
"Holes":[
{"Hole":10,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":5,"RelativeHcp18":10,"Par":4,"Skin":0 },
{"Hole":11,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":3,"RelativeHcp18":6,"Par":3,"Skin":0 },
{"Hole":12,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":6,"RelativeHcp18":12,"Par":4,"Skin":0 },
{"Hole":13,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":7,"RelativeHcp18":14,"Par":4,"Skin":0 },
{"Hole":14,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":9,"RelativeHcp18":18,"Par":3,"Skin":0 },
{"Hole":15,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":8,"RelativeHcp18":16,"Par":3,"Skin":0 },
{"Hole":16,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":1,"RelativeHcp18":2,"Par":5,"Skin":0 },
{"Hole":17,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":4,"RelativeHcp18":8,"Par":4,"Skin":0 },
{"Hole":18,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":2,"RelativeHcp18":4,"Par":4,"Skin":0 }
]
},
{
"PlayerNumber":17,
"Name":"Sal Gori",
"Hcp":2,
"Strokes":0,
"HStrokes":0,
"TotalPoints":0,
"Active":1,
"Team":0,
"ParScore":34,
"Holes":[
{"Hole":10,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":5,"RelativeHcp18":10,"Par":4,"Skin":0 },
{"Hole":11,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":3,"RelativeHcp18":6,"Par":3,"Skin":0 },
{"Hole":12,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":6,"RelativeHcp18":12,"Par":4,"Skin":0 },
{"Hole":13,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":7,"RelativeHcp18":14,"Par":4,"Skin":0 },
{"Hole":14,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":9,"RelativeHcp18":18,"Par":3,"Skin":0 },
{"Hole":15,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":8,"RelativeHcp18":16,"Par":3,"Skin":0 },
{"Hole":16,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":1,"RelativeHcp18":2,"Par":5,"Skin":0 },
{"Hole":17,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":4,"RelativeHcp18":8,"Par":4,"Skin":0 },
{"Hole":18,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":2,"RelativeHcp18":4,"Par":4,"Skin":0 }
]
},
{
"PlayerNumber":18,
"Name":"Ryan Hixon",
"Hcp":5,
"Strokes":0,
"HStrokes":0,
"TotalPoints":0,
"Active":1,
"Team":0,
"ParScore":34,
"Holes":[
{"Hole":10,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":5,"RelativeHcp18":10,"Par":4,"Skin":0 },
{"Hole":11,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":3,"RelativeHcp18":6,"Par":3,"Skin":0 },
{"Hole":12,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":6,"RelativeHcp18":12,"Par":4,"Skin":0 },
{"Hole":13,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":7,"RelativeHcp18":14,"Par":4,"Skin":0 },
{"Hole":14,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":9,"RelativeHcp18":18,"Par":3,"Skin":0 },
{"Hole":15,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":8,"RelativeHcp18":16,"Par":3,"Skin":0 },
{"Hole":16,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":1,"RelativeHcp18":2,"Par":5,"Skin":0 },
{"Hole":17,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":4,"RelativeHcp18":8,"Par":4,"Skin":0 },
{"Hole":18,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":2,"RelativeHcp18":4,"Par":4,"Skin":0 }
]
},
{
"PlayerNumber":19,
"Name":"Tom Michael",
"Hcp":12,
"Strokes":0,
"HStrokes":0,
"TotalPoints":0,
"Active":1,
"Team":0,
"ParScore":34,
"Holes":[
{"Hole":10,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":5,"RelativeHcp18":10,"Par":4,"Skin":0 },
{"Hole":11,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":3,"RelativeHcp18":6,"Par":3,"Skin":0 },
{"Hole":12,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":6,"RelativeHcp18":12,"Par":4,"Skin":0 },
{"Hole":13,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":7,"RelativeHcp18":14,"Par":4,"Skin":0 },
{"Hole":14,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":9,"RelativeHcp18":18,"Par":3,"Skin":0 },
{"Hole":15,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":8,"RelativeHcp18":16,"Par":3,"Skin":0 },
{"Hole":16,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":1,"RelativeHcp18":2,"Par":5,"Skin":0 },
{"Hole":17,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":4,"RelativeHcp18":8,"Par":4,"Skin":0 },
{"Hole":18,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":2,"RelativeHcp18":4,"Par":4,"Skin":0 }
]
},
{
"PlayerNumber":20,
"Name":"John Siweckyj",
"Hcp":10,
"Strokes":0,
"HStrokes":0,
"TotalPoints":0,
"Active":1,
"Team":0,
"ParScore":34,
"Holes":[
{"Hole":10,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":5,"RelativeHcp18":10,"Par":4,"Skin":0 },
{"Hole":11,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":3,"RelativeHcp18":6,"Par":3,"Skin":0 },
{"Hole":12,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":6,"RelativeHcp18":12,"Par":4,"Skin":0 },
{"Hole":13,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":7,"RelativeHcp18":14,"Par":4,"Skin":0 },
{"Hole":14,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":9,"RelativeHcp18":18,"Par":3,"Skin":0 },
{"Hole":15,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":8,"RelativeHcp18":16,"Par":3,"Skin":0 },
{"Hole":16,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":1,"RelativeHcp18":2,"Par":5,"Skin":0 },
{"Hole":17,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":4,"RelativeHcp18":8,"Par":4,"Skin":0 },
{"Hole":18,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":2,"RelativeHcp18":4,"Par":4,"Skin":0 }
]
},
{
"PlayerNumber":21,
"Name":"Allen Blazevich",
"Hcp":11,
"Strokes":0,
"HStrokes":0,
"TotalPoints":0,
"Active":1,
"Team":0,
"ParScore":34,
"Holes":[
{"Hole":10,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":5,"RelativeHcp18":10,"Par":4,"Skin":0 },
{"Hole":11,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":3,"RelativeHcp18":6,"Par":3,"Skin":0 },
{"Hole":12,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":6,"RelativeHcp18":12,"Par":4,"Skin":0 },
{"Hole":13,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":7,"RelativeHcp18":14,"Par":4,"Skin":0 },
{"Hole":14,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":9,"RelativeHcp18":18,"Par":3,"Skin":0 },
{"Hole":15,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":8,"RelativeHcp18":16,"Par":3,"Skin":0 },
{"Hole":16,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":1,"RelativeHcp18":2,"Par":5,"Skin":0 },
{"Hole":17,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":4,"RelativeHcp18":8,"Par":4,"Skin":0 },
{"Hole":18,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":2,"RelativeHcp18":4,"Par":4,"Skin":0 }
]
},
{
"PlayerNumber":22,
"Name":"Jim Lorenzi",
"Hcp":12,
"Strokes":0,
"HStrokes":0,
"TotalPoints":0,
"Active":1,
"Team":0,
"ParScore":34,
"Holes":[
{"Hole":10,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":5,"RelativeHcp18":10,"Par":4,"Skin":0 },
{"Hole":11,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":3,"RelativeHcp18":6,"Par":3,"Skin":0 },
{"Hole":12,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":6,"RelativeHcp18":12,"Par":4,"Skin":0 },
{"Hole":13,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":7,"RelativeHcp18":14,"Par":4,"Skin":0 },
{"Hole":14,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":9,"RelativeHcp18":18,"Par":3,"Skin":0 },
{"Hole":15,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":8,"RelativeHcp18":16,"Par":3,"Skin":0 },
{"Hole":16,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":1,"RelativeHcp18":2,"Par":5,"Skin":0 },
{"Hole":17,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":4,"RelativeHcp18":8,"Par":4,"Skin":0 },
{"Hole":18,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":2,"RelativeHcp18":4,"Par":4,"Skin":0 }
]
},
{
"PlayerNumber":23,
"Name":"Steve Barron",
"Hcp":4,
"Strokes":0,
"HStrokes":0,
"TotalPoints":0,
"Active":1,
"Team":0,
"ParScore":34,
"Holes":[
{"Hole":10,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":5,"RelativeHcp18":10,"Par":4,"Skin":0 },
{"Hole":11,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":3,"RelativeHcp18":6,"Par":3,"Skin":0 },
{"Hole":12,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":6,"RelativeHcp18":12,"Par":4,"Skin":0 },
{"Hole":13,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":7,"RelativeHcp18":14,"Par":4,"Skin":0 },
{"Hole":14,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":9,"RelativeHcp18":18,"Par":3,"Skin":0 },
{"Hole":15,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":8,"RelativeHcp18":16,"Par":3,"Skin":0 },
{"Hole":16,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":1,"RelativeHcp18":2,"Par":5,"Skin":0 },
{"Hole":17,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":4,"RelativeHcp18":8,"Par":4,"Skin":0 },
{"Hole":18,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":2,"RelativeHcp18":4,"Par":4,"Skin":0 }
]
},
{
"PlayerNumber":24,
"Name":"Tom Ondrey",
"Hcp":11,
"Strokes":0,
"HStrokes":0,
"TotalPoints":0,
"Active":1,
"Team":0,
"ParScore":34,
"Holes":[
{"Hole":10,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":5,"RelativeHcp18":10,"Par":4,"Skin":0 },
{"Hole":11,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":3,"RelativeHcp18":6,"Par":3,"Skin":0 },
{"Hole":12,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":6,"RelativeHcp18":12,"Par":4,"Skin":0 },
{"Hole":13,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":7,"RelativeHcp18":14,"Par":4,"Skin":0 },
{"Hole":14,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":9,"RelativeHcp18":18,"Par":3,"Skin":0 },
{"Hole":15,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":8,"RelativeHcp18":16,"Par":3,"Skin":0 },
{"Hole":16,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":1,"RelativeHcp18":2,"Par":5,"Skin":0 },
{"Hole":17,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":4,"RelativeHcp18":8,"Par":4,"Skin":0 },
{"Hole":18,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":2,"RelativeHcp18":4,"Par":4,"Skin":0 }
]
},
{
"PlayerNumber":25,
"Name":"Jim Shelton",
"Hcp":6,
"Strokes":0,
"HStrokes":0,
"TotalPoints":0,
"Active":1,
"Team":0,
"ParScore":34,
"Holes":[
{"Hole":10,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":5,"RelativeHcp18":10,"Par":4,"Skin":0 },
{"Hole":11,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":3,"RelativeHcp18":6,"Par":3,"Skin":0 },
{"Hole":12,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":6,"RelativeHcp18":12,"Par":4,"Skin":0 },
{"Hole":13,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":7,"RelativeHcp18":14,"Par":4,"Skin":0 },
{"Hole":14,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":9,"RelativeHcp18":18,"Par":3,"Skin":0 },
{"Hole":15,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":8,"RelativeHcp18":16,"Par":3,"Skin":0 },
{"Hole":16,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":1,"RelativeHcp18":2,"Par":5,"Skin":0 },
{"Hole":17,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":4,"RelativeHcp18":8,"Par":4,"Skin":0 },
{"Hole":18,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":2,"RelativeHcp18":4,"Par":4,"Skin":0 }
]
},
{
"PlayerNumber":26,
"Name":"Eddie Vinay Jr",
"Hcp":9,
"Strokes":0,
"HStrokes":0,
"TotalPoints":0,
"Active":1,
"Team":0,
"ParScore":34,
"Holes":[
{"Hole":10,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":5,"RelativeHcp18":10,"Par":4,"Skin":0 },
{"Hole":11,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":3,"RelativeHcp18":6,"Par":3,"Skin":0 },
{"Hole":12,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":6,"RelativeHcp18":12,"Par":4,"Skin":0 },
{"Hole":13,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":7,"RelativeHcp18":14,"Par":4,"Skin":0 },
{"Hole":14,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":9,"RelativeHcp18":18,"Par":3,"Skin":0 },
{"Hole":15,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":8,"RelativeHcp18":16,"Par":3,"Skin":0 },
{"Hole":16,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":1,"RelativeHcp18":2,"Par":5,"Skin":0 },
{"Hole":17,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":4,"RelativeHcp18":8,"Par":4,"Skin":0 },
{"Hole":18,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":2,"RelativeHcp18":4,"Par":4,"Skin":0 }
]
},
{
"PlayerNumber":27,
"Name":"Jeff Volk",
"Hcp":12,
"Strokes":0,
"HStrokes":0,
"TotalPoints":0,
"Active":1,
"Team":0,
"ParScore":34,
"Holes":[
{"Hole":10,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":5,"RelativeHcp18":10,"Par":4,"Skin":0 },
{"Hole":11,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":3,"RelativeHcp18":6,"Par":3,"Skin":0 },
{"Hole":12,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":6,"RelativeHcp18":12,"Par":4,"Skin":0 },
{"Hole":13,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":7,"RelativeHcp18":14,"Par":4,"Skin":0 },
{"Hole":14,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":9,"RelativeHcp18":18,"Par":3,"Skin":0 },
{"Hole":15,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":8,"RelativeHcp18":16,"Par":3,"Skin":0 },
{"Hole":16,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":1,"RelativeHcp18":2,"Par":5,"Skin":0 },
{"Hole":17,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":4,"RelativeHcp18":8,"Par":4,"Skin":0 },
{"Hole":18,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":2,"RelativeHcp18":4,"Par":4,"Skin":0 }
]
},
{
"PlayerNumber":28,
"Name":"Frenchy Cousineau",
"Hcp":17,
"Strokes":0,
"HStrokes":0,
"TotalPoints":0,
"Active":1,
"Team":0,
"ParScore":34,
"Holes":[
{"Hole":10,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":5,"RelativeHcp18":10,"Par":4,"Skin":0 },
{"Hole":11,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":3,"RelativeHcp18":6,"Par":3,"Skin":0 },
{"Hole":12,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":6,"RelativeHcp18":12,"Par":4,"Skin":0 },
{"Hole":13,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":7,"RelativeHcp18":14,"Par":4,"Skin":0 },
{"Hole":14,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":9,"RelativeHcp18":18,"Par":3,"Skin":0 },
{"Hole":15,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":8,"RelativeHcp18":16,"Par":3,"Skin":0 },
{"Hole":16,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":1,"RelativeHcp18":2,"Par":5,"Skin":0 },
{"Hole":17,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":4,"RelativeHcp18":8,"Par":4,"Skin":0 },
{"Hole":18,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":2,"RelativeHcp18":4,"Par":4,"Skin":0 }
]
},
{
"PlayerNumber":29,
"Name":"Tony Volk",
"Hcp":7,
"Strokes":0,
"HStrokes":0,
"TotalPoints":0,
"Active":1,
"Team":0,
"ParScore":34,
"Holes":[
{"Hole":10,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":5,"RelativeHcp18":10,"Par":4,"Skin":0 },
{"Hole":11,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":3,"RelativeHcp18":6,"Par":3,"Skin":0 },
{"Hole":12,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":6,"RelativeHcp18":12,"Par":4,"Skin":0 },
{"Hole":13,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":7,"RelativeHcp18":14,"Par":4,"Skin":0 },
{"Hole":14,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":9,"RelativeHcp18":18,"Par":3,"Skin":0 },
{"Hole":15,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":8,"RelativeHcp18":16,"Par":3,"Skin":0 },
{"Hole":16,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":1,"RelativeHcp18":2,"Par":5,"Skin":0 },
{"Hole":17,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":4,"RelativeHcp18":8,"Par":4,"Skin":0 },
{"Hole":18,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":2,"RelativeHcp18":4,"Par":4,"Skin":0 }
]
},
{
"PlayerNumber":30,
"Name":"Scott Levin",
"Hcp":6,
"Strokes":0,
"HStrokes":0,
"TotalPoints":0,
"Active":1,
"Team":0,
"ParScore":34,
"Holes":[
{"Hole":10,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":5,"RelativeHcp18":10,"Par":4,"Skin":0 },
{"Hole":11,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":3,"RelativeHcp18":6,"Par":3,"Skin":0 },
{"Hole":12,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":6,"RelativeHcp18":12,"Par":4,"Skin":0 },
{"Hole":13,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":7,"RelativeHcp18":14,"Par":4,"Skin":0 },
{"Hole":14,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":9,"RelativeHcp18":18,"Par":3,"Skin":0 },
{"Hole":15,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":8,"RelativeHcp18":16,"Par":3,"Skin":0 },
{"Hole":16,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":1,"RelativeHcp18":2,"Par":5,"Skin":0 },
{"Hole":17,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":4,"RelativeHcp18":8,"Par":4,"Skin":0 },
{"Hole":18,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":2,"RelativeHcp18":4,"Par":4,"Skin":0 }
]
},
{
"PlayerNumber":31,
"Name":"Brandon Grady",
"Hcp":10,
"Strokes":0,
"HStrokes":0,
"TotalPoints":0,
"Active":1,
"Team":0,
"ParScore":34,
"Holes":[
{"Hole":10,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":5,"RelativeHcp18":10,"Par":4,"Skin":0 },
{"Hole":11,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":3,"RelativeHcp18":6,"Par":3,"Skin":0 },
{"Hole":12,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":6,"RelativeHcp18":12,"Par":4,"Skin":0 },
{"Hole":13,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":7,"RelativeHcp18":14,"Par":4,"Skin":0 },
{"Hole":14,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":9,"RelativeHcp18":18,"Par":3,"Skin":0 },
{"Hole":15,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":8,"RelativeHcp18":16,"Par":3,"Skin":0 },
{"Hole":16,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":1,"RelativeHcp18":2,"Par":5,"Skin":0 },
{"Hole":17,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":4,"RelativeHcp18":8,"Par":4,"Skin":0 },
{"Hole":18,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":2,"RelativeHcp18":4,"Par":4,"Skin":0 }
]
},
{
"PlayerNumber":32,
"Name":"Jeff Steele",
"Hcp":10,
"Strokes":0,
"HStrokes":0,
"TotalPoints":0,
"Active":1,
"Team":0,
"ParScore":34,
"Holes":[
{"Hole":10,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":5,"RelativeHcp18":10,"Par":4,"Skin":0 },
{"Hole":11,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":3,"RelativeHcp18":6,"Par":3,"Skin":0 },
{"Hole":12,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":6,"RelativeHcp18":12,"Par":4,"Skin":0 },
{"Hole":13,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":7,"RelativeHcp18":14,"Par":4,"Skin":0 },
{"Hole":14,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":9,"RelativeHcp18":18,"Par":3,"Skin":0 },
{"Hole":15,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":8,"RelativeHcp18":16,"Par":3,"Skin":0 },
{"Hole":16,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":1,"RelativeHcp18":2,"Par":5,"Skin":0 },
{"Hole":17,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":4,"RelativeHcp18":8,"Par":4,"Skin":0 },
{"Hole":18,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":2,"RelativeHcp18":4,"Par":4,"Skin":0 }
]
},
{
"PlayerNumber":33,
"Name":"Mark McNeil",
"Hcp":8,
"Strokes":0,
"HStrokes":0,
"TotalPoints":0,
"Active":1,
"Team":0,
"ParScore":34,
"Holes":[
{"Hole":10,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":5,"RelativeHcp18":10,"Par":4,"Skin":0 },
{"Hole":11,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":3,"RelativeHcp18":6,"Par":3,"Skin":0 },
{"Hole":12,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":6,"RelativeHcp18":12,"Par":4,"Skin":0 },
{"Hole":13,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":7,"RelativeHcp18":14,"Par":4,"Skin":0 },
{"Hole":14,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":9,"RelativeHcp18":18,"Par":3,"Skin":0 },
{"Hole":15,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":8,"RelativeHcp18":16,"Par":3,"Skin":0 },
{"Hole":16,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":1,"RelativeHcp18":2,"Par":5,"Skin":0 },
{"Hole":17,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":4,"RelativeHcp18":8,"Par":4,"Skin":0 },
{"Hole":18,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":2,"RelativeHcp18":4,"Par":4,"Skin":0 }
]
},
{
"PlayerNumber":34,
"Name":"Ed Tozzi",
"Hcp":6,
"Strokes":0,
"HStrokes":0,
"TotalPoints":0,
"Active":1,
"Team":0,
"ParScore":34,
"Holes":[
{"Hole":10,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":5,"RelativeHcp18":10,"Par":4,"Skin":0 },
{"Hole":11,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":3,"RelativeHcp18":6,"Par":3,"Skin":0 },
{"Hole":12,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":6,"RelativeHcp18":12,"Par":4,"Skin":0 },
{"Hole":13,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":7,"RelativeHcp18":14,"Par":4,"Skin":0 },
{"Hole":14,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":9,"RelativeHcp18":18,"Par":3,"Skin":0 },
{"Hole":15,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":8,"RelativeHcp18":16,"Par":3,"Skin":0 },
{"Hole":16,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":1,"RelativeHcp18":2,"Par":5,"Skin":0 },
{"Hole":17,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":4,"RelativeHcp18":8,"Par":4,"Skin":0 },
{"Hole":18,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":2,"RelativeHcp18":4,"Par":4,"Skin":0 }
]
},
{
"PlayerNumber":35,
"Name":"Darrin Fentres",
"Hcp":13,
"Strokes":0,
"HStrokes":0,
"TotalPoints":0,
"Active":1,
"Team":0,
"ParScore":34,
"Holes":[
{"Hole":10,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":5,"RelativeHcp18":10,"Par":4,"Skin":0 },
{"Hole":11,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":3,"RelativeHcp18":6,"Par":3,"Skin":0 },
{"Hole":12,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":6,"RelativeHcp18":12,"Par":4,"Skin":0 },
{"Hole":13,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":7,"RelativeHcp18":14,"Par":4,"Skin":0 },
{"Hole":14,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":9,"RelativeHcp18":18,"Par":3,"Skin":0 },
{"Hole":15,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":8,"RelativeHcp18":16,"Par":3,"Skin":0 },
{"Hole":16,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":1,"RelativeHcp18":2,"Par":5,"Skin":0 },
{"Hole":17,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":4,"RelativeHcp18":8,"Par":4,"Skin":0 },
{"Hole":18,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":2,"RelativeHcp18":4,"Par":4,"Skin":0 }
]
},
{
"PlayerNumber":36,
"Name":"Dave Critchfield",
"Hcp":19,
"Strokes":0,
"HStrokes":0,
"TotalPoints":0,
"Active":1,
"Team":0,
"ParScore":34,
"Holes":[
{"Hole":10,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":5,"RelativeHcp18":10,"Par":4,"Skin":0 },
{"Hole":11,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":3,"RelativeHcp18":6,"Par":3,"Skin":0 },
{"Hole":12,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":6,"RelativeHcp18":12,"Par":4,"Skin":0 },
{"Hole":13,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":7,"RelativeHcp18":14,"Par":4,"Skin":0 },
{"Hole":14,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":9,"RelativeHcp18":18,"Par":3,"Skin":0 },
{"Hole":15,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":8,"RelativeHcp18":16,"Par":3,"Skin":0 },
{"Hole":16,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":1,"RelativeHcp18":2,"Par":5,"Skin":0 },
{"Hole":17,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":4,"RelativeHcp18":8,"Par":4,"Skin":0 },
{"Hole":18,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":2,"RelativeHcp18":4,"Par":4,"Skin":0 }
]
},
{
"PlayerNumber":37,
"Name":"Dave Kukulka",
"Hcp":9,
"Strokes":0,
"HStrokes":0,
"TotalPoints":0,
"Active":1,
"Team":0,
"ParScore":34,
"Holes":[
{"Hole":10,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":5,"RelativeHcp18":10,"Par":4,"Skin":0 },
{"Hole":11,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":3,"RelativeHcp18":6,"Par":3,"Skin":0 },
{"Hole":12,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":6,"RelativeHcp18":12,"Par":4,"Skin":0 },
{"Hole":13,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":7,"RelativeHcp18":14,"Par":4,"Skin":0 },
{"Hole":14,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":9,"RelativeHcp18":18,"Par":3,"Skin":0 },
{"Hole":15,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":8,"RelativeHcp18":16,"Par":3,"Skin":0 },
{"Hole":16,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":1,"RelativeHcp18":2,"Par":5,"Skin":0 },
{"Hole":17,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":4,"RelativeHcp18":8,"Par":4,"Skin":0 },
{"Hole":18,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":2,"RelativeHcp18":4,"Par":4,"Skin":0 }
]
},
{
"PlayerNumber":38,
"Name":"Lonnell Becoate",
"Hcp":19,
"Strokes":0,
"HStrokes":0,
"TotalPoints":0,
"Active":1,
"Team":0,
"ParScore":34,
"Holes":[
{"Hole":10,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":5,"RelativeHcp18":10,"Par":4,"Skin":0 },
{"Hole":11,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":3,"RelativeHcp18":6,"Par":3,"Skin":0 },
{"Hole":12,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":6,"RelativeHcp18":12,"Par":4,"Skin":0 },
{"Hole":13,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":7,"RelativeHcp18":14,"Par":4,"Skin":0 },
{"Hole":14,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":9,"RelativeHcp18":18,"Par":3,"Skin":0 },
{"Hole":15,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":8,"RelativeHcp18":16,"Par":3,"Skin":0 },
{"Hole":16,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":1,"RelativeHcp18":2,"Par":5,"Skin":0 },
{"Hole":17,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":4,"RelativeHcp18":8,"Par":4,"Skin":0 },
{"Hole":18,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":2,"RelativeHcp18":4,"Par":4,"Skin":0 }
]
},
{
"PlayerNumber":39,
"Name":"Jamison Judge",
"Hcp":10,
"Strokes":0,
"HStrokes":0,
"TotalPoints":0,
"Active":1,
"Team":0,
"ParScore":34,
"Holes":[
{"Hole":10,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":5,"RelativeHcp18":10,"Par":4,"Skin":0 },
{"Hole":11,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":3,"RelativeHcp18":6,"Par":3,"Skin":0 },
{"Hole":12,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":6,"RelativeHcp18":12,"Par":4,"Skin":0 },
{"Hole":13,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":7,"RelativeHcp18":14,"Par":4,"Skin":0 },
{"Hole":14,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":9,"RelativeHcp18":18,"Par":3,"Skin":0 },
{"Hole":15,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":8,"RelativeHcp18":16,"Par":3,"Skin":0 },
{"Hole":16,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":1,"RelativeHcp18":2,"Par":5,"Skin":0 },
{"Hole":17,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":4,"RelativeHcp18":8,"Par":4,"Skin":0 },
{"Hole":18,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":2,"RelativeHcp18":4,"Par":4,"Skin":0 }
]
},
{
"PlayerNumber":40,
"Name":"Donny Fast",
"Hcp":7,
"Strokes":0,
"HStrokes":0,
"TotalPoints":0,
"Active":1,
"Team":0,
"ParScore":34,
"Holes":[
{"Hole":10,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":5,"RelativeHcp18":10,"Par":4,"Skin":0 },
{"Hole":11,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":3,"RelativeHcp18":6,"Par":3,"Skin":0 },
{"Hole":12,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":6,"RelativeHcp18":12,"Par":4,"Skin":0 },
{"Hole":13,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":7,"RelativeHcp18":14,"Par":4,"Skin":0 },
{"Hole":14,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":9,"RelativeHcp18":18,"Par":3,"Skin":0 },
{"Hole":15,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":8,"RelativeHcp18":16,"Par":3,"Skin":0 },
{"Hole":16,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":1,"RelativeHcp18":2,"Par":5,"Skin":0 },
{"Hole":17,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":4,"RelativeHcp18":8,"Par":4,"Skin":0 },
{"Hole":18,"Score":0,"HScore":0,"Points":0,"Strokes":0,"RelativeHcp9":2,"RelativeHcp18":4,"Par":4,"Skin":0 }
]
},
];

console.log(curr);
  setGolfers(curr);
}, [])

  let holeinfo = [];

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
        if(playerHcp == 9){
          currentHole.HScore = currentHole.Strokes - 1;
        }
        else if(currentHole.RelativeHcp9 <= hcpHoles){
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
        else if (hcpHoles == 0 && hcpMultiplyer > 0){  //case when person hcp is a multiple of nine
          currentHole.HScore = currentHole.Strokes - hcpMultiplyer;
        }
        else{
          currentHole.HScore = currentHole.Strokes - hcpMultiplyer;
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

    console.log("second spot");
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

    console.log("third spot");
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

    console.log("fourth spot");
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

  //const side = "Front";
  const side = "Back"; 
  console.log("GOLFERS", golfers)
  return (
    <div className="App">
      <header className="App-header">
      {/*<LeagueDate weeks={ schedule }></LeagueDate>*/}
        <GolfersToAdd stats={golfers} handleChange={(e) => ReAddPlayer(e)} />
        <WeeklyGolfers stats={golfers} handleClick={(e) => handlePlayerMove(e)} handleChange={(e) => handleScoreUpdate(e)} handleTeamChange={(e) => handleTeamChange(e)}/>

        <Skins stats={golfers} />
        <BlindTeams stats={golfers} />
        
      </header>
    </div>
  );
}

export default App;