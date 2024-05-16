const { default: axios } = require('axios');
const rounds = require('./rounds.json');
const fs = require('fs');
const { getTeamPerformance, getEventLineups } = require('./api');

let teams = [];
rounds.standings.forEach(tournament => {
    tournament.rows.forEach(team => {
        teams.push(team.team);
    });
});
fs.writeFileSync('teams.json', JSON.stringify(teams, null, 2));

async function processTeamsSequentially(teams) {
    let teamsWithEvents = [];
    for (const team of teams) {
        console.log(`Processing team: ${team.name} (ID: ${team.id})`);
        try {
            const { events } = await getTeamPerformance(team.id);
            let eventsWithLineups = [];
            for (const event of events) {
                console.log(`  Processing event: ${event.id} (Home: ${event.homeTeam.name}, Away: ${event.awayTeam.name})`);
                const isHomeTeam = event.homeTeam.id === team.id;
                try {
                    const lineups = await getEventLineups(event.id);
                    const lineup = lineups[isHomeTeam ? 'home' : 'away'];
                    eventsWithLineups.push({ ...event, lineup });
                } catch (error) {
                    if (error.response && error.response.status === 404) {
                        console.error(`    Lineup not found for event ID: ${event.id}`);
                    } else {
                        console.error(`    Error fetching lineup for event ID: ${event.id}:`, error.message);
                    }
                }
            }
            teamsWithEvents.push({ ...team, eventsWithLineups });
        } catch (error) {
            if (error.response && error.response.status === 404) {
                console.error(`  Performance data not found for team ID: ${team.id}`);
            } else {
                console.error(`  Error fetching performance data for team ID: ${team.id}:`, error.message);
            }
        }
    }
    return teamsWithEvents;
}

(async () => {
    console.log('Starting processing of teams...');
    const teamsWithEvents = await processTeamsSequentially(teams);
    fs.writeFileSync('teamsWithEvents.json', JSON.stringify(teamsWithEvents, null, 2));
    console.log('Processing complete. Data written to teamsWithEvents.json');
})();
