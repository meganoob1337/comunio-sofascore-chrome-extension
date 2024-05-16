const express = require('express');
const path = require('path');
const Fuse = require('fuse.js');
const playersWithRating = require('./playersWithRating.json');
const cors = require('cors'); // Import the cors package

const app = express();
const port = 7777;

// Convert the object to an array
const playersArray = Object.values(playersWithRating);

// Create Fuse.js options
const options = {
    keys: ['name'],
    threshold: 0.7 // Adjust this value to control the fuzziness
};

// Create a Fuse.js instance
const fuse = new Fuse(playersArray, options);
app.use(cors());
// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// API endpoint to search for players by name
app.get('/search', (req, res) => {
    const searchTerm = req.query.search;
    if (!searchTerm) {
        return res.status(400).send({ error: 'Search term is required' });
    }

    const result = fuse.search(searchTerm);
    const players = result.map(item => item.item);

    res.send(players);
});

// Serve the index.html file for the root path
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
