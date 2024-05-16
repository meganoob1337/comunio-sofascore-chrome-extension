// content.js

(async function () {
    // Function to search for a player's rating
    async function fetchPlayerRating(playerName) {
        try {
            const response = await fetch(`http://localhost:7777/search?search=${encodeURIComponent(playerName)}`);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            return data.length > 0 ? data[0] : null;
        } catch (error) {
            console.error('Error fetching player rating:', error);
            return null;
        }
    }

    // Function to show the overlay with player details
    function showOverlay(player, event) {
        let overlay = document.querySelector('.player-overlay');
        if (!overlay) {
            overlay = document.createElement('div');
            overlay.className = 'player-overlay';
            overlay.style.position = 'fixed';
            overlay.style.backgroundColor = 'white';
            overlay.style.border = '1px solid black';
            overlay.style.padding = '10px';
            overlay.style.borderRadius = '5px';
            overlay.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.1)';
            overlay.style.zIndex = '10000';
            document.body.appendChild(overlay);
        }

        const { name, rating, substitute, country, ratings } = player;
        overlay.innerHTML = `
            <strong>Name:</strong> ${name} <br>
            <strong>Rating:</strong> ${rating?.toFixed(2) ?? 'N/A'} <br>
            <strong>Substitute:</strong> ${substitute} <br>
            <strong>Played:</strong> ${ratings?.length || 0} <br>
            <strong>Country:</strong> ${country.name}
        `;
        overlay.style.top = `${event.clientY + 10}px`;
        overlay.style.left = `${event.clientX + 10}px`;
        overlay.style.display = 'block';
    }

    // Function to hide the overlay
    function hideOverlay() {
        const overlay = document.querySelector('.player-overlay');
        if (overlay) {
            overlay.style.display = 'none';
        }
    }

    // Function to add hover event listeners to player names
    async function addPlayerRatings() {
        const playerElementsTransfer = document.querySelectorAll('.csspt-name .text-to-slide');
        const extraPlayers = document.querySelectorAll('.cs_player_name a')
        const playerElements = [...playerElementsTransfer, ...extraPlayers];
        for (const playerElement of playerElements) {
            const playerName = playerElement.textContent.trim();
            const playerData = await fetchPlayerRating(playerName);

            if (playerData) {
                playerElement.addEventListener('mouseenter', (event) => showOverlay(playerData, event));
                playerElement.addEventListener('mouseleave', hideOverlay);
            }
        }
    }

    // Function to create and add the button to the page
    function addButton() {
        const button = document.createElement('button');
        button.textContent = 'Fetch SofaScore Ratings';
        button.style.position = 'fixed';
        button.style.top = '10px';
        button.style.right = '10px';
        button.style.padding = '10px 20px';
        button.style.fontSize = '16px';
        button.style.zIndex = '1000';
        button.style.backgroundColor = '#4CAF50';
        button.style.color = 'white';
        button.style.border = 'none';
        button.style.borderRadius = '5px';
        button.style.cursor = 'pointer';
        button.addEventListener('click', addPlayerRatings);
        document.body.appendChild(button);
    }

    // Wait for the DOM to fully load and then add the button
    window.addEventListener('load', addButton);
})();
