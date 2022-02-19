# golf
react app to help with weekly games

# workflow
- useeffect to get all info from web api and pack into JSON object
- display weekly info as header
- show table with all players and inputs for scores
  - dynamically update chart when data is entered
  - stagger the event handler by a few 100 milliseconds just in case it's two digits

- passing in data to table as

[ golfers: 
  {
    PlayerNumber: 123,
    PlayerName: "",
    Hcp: 123, 
    Score: 0, 
    Points: 0,
    Holes:[
      { Hole: 1, Score: 0, RelativeHcp: 1, Points: 0, HcpScore: 0, Par: 4}, 
      { Hole: 2, Score: 0, RelativeHcp: 5, Points: 0, HcpScore: 0, Par: 3}, 
      ...
    ]
  }
   ...
]

--to display 
golfers.map(player => {
  <td>player.PlayerName</td>
  <td>player.Hcp</td>
  item.Holes.map(hole => {
    <td><input id={player.PlayerNumber + "_" + hole.Hole} placeholder={hole.Par} onChange={(e) = handleChange(e)}> </input></td>
    ...
  })
  <td>{player.Score}</td>
})

handleChange(event)
- get the score that was added
- golfers.filter(item => { if (item.PlayerNumber == event.PlayerNumber) { update state to save that new score; item.Score = reduce(item.Holes.Score)} })
- we can probably add logic to update the other fields too (Points, HcpScore, and Overall Points)

--how to update and keep state correct?
