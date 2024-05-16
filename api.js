const axios = require('axios');

/**
 * Fetches performance data for a given team.
 * @param {string} teamId - The ID of the team.
 * @returns {Promise<Object>} - The team performance data.
 */
const getTeamPerformance = async (teamId) => {
    try {
        const response = await axios.get(`https://www.sofascore.com/api/v1/team/${teamId}/performance`);
        return response.data;
    } catch (error) {
        console.error('Error fetching team performance:', error);
        throw error;
    }
};

/**
 * Fetches lineup data for a given event.
 * @param {string} eventId - The ID of the event.
 * @returns {Promise<Object>} - The event lineups data.
 */
const getEventLineups = async (eventId) => {
    try {
        const response = await axios.get(`https://www.sofascore.com/api/v1/event/${eventId}/lineups`);
        return response.data;
    } catch (error) {
        console.error('Error fetching event lineups:', error);
        throw error;
    }
};

module.exports = {
    getTeamPerformance,
    getEventLineups,
};
