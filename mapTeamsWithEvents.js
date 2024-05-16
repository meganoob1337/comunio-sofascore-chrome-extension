const teamsWithEvents = require('./teamsWithEvents.json');
const fs = require('fs');
const playersWithScore = []
const res = teamsWithEvents.map(({name, slug, id, eventsWithLineups}) => {
    return {
        name, slug, id, lineups: eventsWithLineups.map(event => {
            event.lineup.players.forEach(({ player: {name, firstName, lastName, country, id}, substitute,statistics}) => {
                if(!statistics?.rating  ) {
                    console.log(name);
                } else {

                    playersWithScore.push({ name, firstName, lastName, country, substitute: substitute ? 1 : 0, rating: statistics?.rating, id })
                }
            })
            return event.lineup.players
        })
    }
})
const playersWithAggregatedScores = playersWithScore.reduce((acc,  { rating, substitute, ...player } ) => {
// const playersWithAggregatedScores = playersWithScore.reduce((acc, player) => {
    // console.log(player)
    // return acc;
    if(!acc[player?.id]) {
        acc[player?.id] = {...player, ratings: [rating], substitutes: [substitute ? 1 : 0]}
    } else {
        acc[player?.id] = { ...player, ratings: [...acc[player?.id].ratings, rating], substitutes: [...acc[player?.id].substitutes, substitute] }
        acc[player?.id].rating = acc[player?.id].ratings.reduce((acc, rating) => acc + rating, 0);
        acc[player?.id].rating = acc[player?.id].rating / acc[player?.id].ratings.length;
        acc[player?.id].substitute = acc[player?.id].substitutes.reduce((acc, substitute) => acc + substitute, 0);
        acc[player?.id].substitute = acc[player?.id].substitute / acc[player?.id].substitutes.length;
    }
    return acc;
}, {})
fs.writeFileSync('playersWithRating.json', JSON.stringify(playersWithAggregatedScores, null, 2))