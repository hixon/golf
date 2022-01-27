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
const user = process.env.REACT_APP_PASSWORD
const pw = process.env.REACT_APP_PASSWORD

console.log({user})
console.log({pw})

const authenticate = (creds) => {
    return axios.get(baseurl + login + `/AuthenticateUser?yearnum=${currdate.getUTCFullYear()}&username=${user}&password=${pw}&minutes=30`
    )
} 

export default{
    authenticate
}