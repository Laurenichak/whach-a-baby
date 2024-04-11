document.addEventListener('DOMContentLoaded', () => {
    const holes = document.querySelectorAll('.hole');
    const scoreBoard = document.querySelector('.score');
    let lastHole;
    let timeUp = false;
    let score = 0;

    function randomTime(min, max) {
        return Math.round(Math.random() * (max - min) + min);
    }

    function randomHole(holes) {
        const idx = Math.floor(Math.random() * holes.length);
        const hole = holes[idx];
        if (hole === lastHole) {
            return randomHole(holes);
        }
        lastHole = hole;
        return hole;
    }
    //window.addEventListener('keydown', (e) => {
    //    if ((e.code === 'Space' || e.code === 'Enter') && !gameStarted) {
    //        startCountdown();
    //    }
    //});
    startCountdown();
    function peep() {
        let time = randomTime(800, 1500); // Start slower
        // As the score increases, decrease the max time making the game harder
        if (score > 4) {
            time = randomTime(600, 1200);
        }
        if (score > 8) {
            time = randomTime(400, 1000);
        }
        if (score > 15) {
            time = randomTime(350, 800);
        }
        const hole = randomHole(holes);
        hole.querySelector('.mole').style.display = 'block';
        setTimeout(() => {
            hole.querySelector('.mole').style.display = 'none';
            hole.querySelector('.mole').style.display = 'none';
            if (!timeUp) peep();
        }, time);
    }

    let gameStarted = false; // A flag to check if the game has started

    function startCountdown() {
        let countdown = 3;
        const countdownModal = document.querySelector('.countdown-modal');
        const countdownContent = document.querySelector('.countdown-content');
        countdownModal.style.display = 'flex'; // Show the countdown modal

        countdownContent.textContent = 'Starting in ' + countdown;
        let countdownTimer = setInterval(function () {
            countdown--;
            countdownContent.textContent = 'Starting in ' + countdown;
            if (countdown <= 0) {
                clearInterval(countdownTimer);
                countdownModal.style.display = 'none'; // Hide the countdown modal
                startGame(); // Start the game after the countdown
            }
        }, 1200);

    }


    function startGame() {
        // Initial setup
        if (gameStarted) return; // Prevents the game from starting again if it's already started
        gameStarted = true; // Set the flag to true as the game starts
        scoreBoard.textContent = 0;
        timeUp = false;
        score = 0;
        let timeLeft = 20; // Starting time
        document.querySelector('.time-left').textContent = timeLeft; // Initial display
        document.getElementById('restart-btn').style.display = 'none';

        const timerId = setInterval(() => {
            timeLeft--;
            document.querySelector('.time-left').textContent = timeLeft;
            if (timeLeft <= 0) {
                clearInterval(timerId);
                timeUp = true;
                showEndGameModal(); // call this function instead of using alert
            }

        }, 1000); // Update every second

        peep(); // Start showing moles
    }
    function showEndGameModal() {
        document.querySelector('.endgame-modal').style.display = 'flex';
        document.querySelector('.final-score').textContent = score;

        // Clear previous content
        const modalContent = document.querySelector('.endgame-modal');
        modalContent.innerHTML = `<div class="endgame-content">Game over! Your final score is: <span class="final-score">${score}</span></div>`;

        // Create RESTART button
        const closeButton = document.createElement('button');
        closeButton.textContent = 'RESTART';
        closeButton.addEventListener('click', closeEndGameModal);
        modalContent.appendChild(closeButton);
    }


    function whack(e) {
        if (!e.isTrusted) return; // Cheater!
        score++;
        this.style.display = 'none'; // Hide the mole
        const scoreBoard = document.querySelector('.score');
        scoreBoard.textContent = score;
        scoreBoard.classList.add('score-pop'); // Add the class to trigger the animation
        // Remove the class after the animation completes to allow it to be re-added next time.
        setTimeout(() => scoreBoard.classList.remove('score-pop'), 500);
    }


    function closeEndGameModal() {
        document.querySelector('.endgame-modal').style.display = 'none';
        resetGame();
        startCountdown();
    }

    document.getElementById('restart-btn').addEventListener('click', function () {
        document.querySelector('.endgame-modal').style.display = 'none';
        gameStarted = false; // Reset the game started flag
        score = 0; // Reset the score
        document.querySelector('.score').textContent = 'Score: 0';
        startCountdown(); // Start the countdown before restarting the game
    });

    function resetGame() {
        gameStarted = false; // Allow the game to start again
        score = 0; // Reset score
        timeUp = false; // Reset the game over flag
        // Reset the score display
        document.querySelector('.score').textContent = 'Score: 0';
        // Optionally, clear other game state variables
    }

    document.getElementById('submit-score').addEventListener('click', function () {
        const username = document.getElementById('username').value.trim();
        if (username) {
            // Directly use the 'score' variable which holds the final game score
            updateLeaderboard(username, score);
        }
    });


    function updateLeaderboard(username, finalScore) {
        // Retrieve the existing leaderboard from localStorage or initialize a new one
        const leaderboard = JSON.parse(localStorage.getItem('leaderboard')) || [];

        // Add the new score
        leaderboard.push({ username, score: finalScore });

        // Sort the leaderboard by score in descending order
        leaderboard.sort((a, b) => b.score - a.score);

        // Keep only the top 10 scores
        leaderboard.splice(10);

        // Save the updated leaderboard back to localStorage
        localStorage.setItem('leaderboard', JSON.stringify(leaderboard));

        // Update the leaderboard display
        displayLeaderboard();
    }


    function displayLeaderboard() {
        const leaderboard = JSON.parse(localStorage.getItem('leaderboard')) || [];
        const leaderboardTableBody = document.querySelector('#leaderboard-table tbody');
        leaderboardTableBody.innerHTML = ''; // Clear existing leaderboard entries

        // Populate the table with the top scores
        leaderboard.forEach((entry, index) => {
            const row = leaderboardTableBody.insertRow();
            const rankCell = row.insertCell(0);
            const nameCell = row.insertCell(1);
            const scoreCell = row.insertCell(2);

            rankCell.textContent = index + 1;
            nameCell.textContent = entry.username;
            scoreCell.textContent = entry.score;
        });
    }


    // Call displayLeaderboard on page load to show existing leaderboard
    document.addEventListener('DOMContentLoaded', () => {
        // Your existing DOMContentLoaded code here...

        displayLeaderboard();
    });



    holes.forEach(hole => hole.querySelector('.mole').addEventListener('click', whack));
});


