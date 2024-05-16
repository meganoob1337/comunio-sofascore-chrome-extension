const rounds = require('./rounds.json');
const fs = require('fs');
let teams = []
rounds.standings.forEach(tournament => {
    tournament.rows.forEach(team => {
        teams.push(team.team)
    })
})
fs.writeFileSync('teams.json', JSON.stringify(teams, null, 2))