import axios from 'axios'
//base url
const baseurl = 'https://golfleaguetracker.com/gltwebapi'

//sub pages
const login = '/Login'
const player = '/Player'
const schedule = '/Schedule'
const score = '/Score'

//login creds
const currdate = new Date()
const user = process.env.REACT_APP_USERNAME
const pw = process.env.REACT_APP_PASSWORD

const authenticate = () => {
    const request = axios.get(baseurl + login + `/AuthenticateUser?yearnum=${currdate.getUTCFullYear()}&username=${user}&password=${pw}&minutes=30`)
    return request.then(response => response.data)
} 

const authvalid = (token) => {
    if(token != undefined){
        return axios.get(baseurl + login + `/IsTokenValid?st=${token}`) //returns t/f
    }
    else{
        return false
    }
}

const players = (token) => {
    return axios.get(baseurl + player + `/GetPlayers?st=${token}&includeSubs=false&includeActive=true`)
}

const sched = (token) => {
    return axios.get(baseurl + schedule + `/GetSchedule?st=${token}`)
}

export default{
    authenticate, 
    players, 
    sched
}