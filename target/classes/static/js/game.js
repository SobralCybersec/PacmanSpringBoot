const canvas = document.getElementById("canvas");
const canvasContext = canvas.getContext("2d");
const pacmanFrames = document.getElementById("animation");
const ghostFrames = document.getElementById("ghosts");

let createRect = (x, y, width, height, color) => {
    canvasContext.fillStyle = color;
    canvasContext.fillRect(x, y, width, height);
};

const DIRECTION_RIGHT = 4;
const DIRECTION_UP = 3;
const DIRECTION_LEFT = 2;
const DIRECTION_BOTTOM = 1;
let lives = 3;
let ghostCount = 4;
let playerName = "Player";
let eatSound = null;
let deathSound = null;
let powerUpActive = false;
let powerUpTimer = 0;
let cherryPosition = null;
let ghostImageLocations = [
    { x: 0, y: 0 },
    { x: 176, y: 0 },
    { x: 0, y: 121 },
    { x: 176, y: 121 },
];

let fps = 30;
let pacman;
let oneBlockSize = 20;
let score = 0;
let ghosts = [];
let wallSpaceWidth = oneBlockSize / 1.6;
let wallOffset = (oneBlockSize - wallSpaceWidth) / 2;
let wallInnerColor = "black";

const originalMap = [
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1],
    [1, 2, 1, 1, 1, 2, 1, 1, 1, 2, 1, 2, 1, 1, 1, 2, 1, 1, 1, 2, 1],
    [1, 2, 1, 1, 1, 2, 1, 1, 1, 2, 1, 2, 1, 1, 1, 2, 1, 1, 1, 2, 1],
    [1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1],
    [1, 2, 1, 1, 1, 2, 1, 2, 1, 1, 1, 1, 1, 2, 1, 2, 1, 1, 1, 2, 1],
    [1, 2, 2, 2, 2, 2, 1, 2, 2, 2, 1, 2, 2, 2, 1, 2, 2, 2, 2, 2, 1],
    [1, 1, 1, 1, 1, 2, 1, 1, 1, 2, 1, 2, 1, 1, 1, 2, 1, 1, 1, 1, 1],
    [0, 0, 0, 0, 1, 2, 1, 2, 2, 2, 2, 2, 2, 2, 1, 2, 1, 0, 0, 0, 0],
    [1, 1, 1, 1, 1, 2, 1, 2, 1, 1, 2, 1, 1, 2, 1, 2, 1, 1, 1, 1, 1],
    [2, 2, 2, 2, 2, 2, 2, 2, 1, 2, 2, 2, 1, 2, 2, 2, 2, 2, 2, 2, 2],
    [1, 1, 1, 1, 1, 2, 1, 2, 1, 2, 2, 2, 1, 2, 1, 2, 1, 1, 1, 1, 1],
    [0, 0, 0, 0, 1, 2, 1, 2, 1, 1, 1, 1, 1, 2, 1, 2, 1, 0, 0, 0, 0],
    [0, 0, 0, 0, 1, 2, 1, 2, 2, 2, 2, 2, 2, 2, 1, 2, 1, 0, 0, 0, 0],
    [1, 1, 1, 1, 1, 2, 2, 2, 1, 1, 1, 1, 1, 2, 2, 2, 1, 1, 1, 1, 1],
    [1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1],
    [1, 2, 1, 1, 1, 2, 1, 1, 1, 2, 1, 2, 1, 1, 1, 2, 1, 1, 1, 2, 1],
    [1, 2, 2, 2, 1, 2, 2, 2, 2, 2, 1, 2, 2, 2, 2, 2, 1, 2, 2, 2, 1],
    [1, 1, 2, 2, 1, 2, 1, 2, 1, 1, 1, 1, 1, 2, 1, 2, 1, 2, 2, 1, 1],
    [1, 2, 2, 2, 2, 2, 1, 2, 2, 2, 1, 2, 2, 2, 1, 2, 2, 2, 2, 2, 1],
    [1, 2, 1, 1, 1, 1, 1, 1, 1, 2, 1, 2, 1, 1, 1, 1, 1, 1, 1, 2, 1],
    [1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
];

let map = originalMap.map(row => row.slice());

let randomTargetsForGhosts = [
    { x: 1 * oneBlockSize, y: 1 * oneBlockSize },
    { x: 1 * oneBlockSize, y: (map.length - 2) * oneBlockSize },
    { x: (map[0].length - 2) * oneBlockSize, y: oneBlockSize },
    { x: (map[0].length - 2) * oneBlockSize, y: (map.length - 2) * oneBlockSize },
];

let createNewPacman = () => {
    pacman = new Pacman(oneBlockSize, oneBlockSize, oneBlockSize, oneBlockSize, oneBlockSize / 5);
};

let gameLoop = () => {
    update();
    draw();
};

let gameInterval = setInterval(gameLoop, 1000 / fps);

let resetMap = () => {
    map = originalMap.map(row => row.slice());
    spawnCherry();
};

let spawnCherry = () => {
    const emptySpots = [];
    for (let i = 0; i < map.length; i++) {
        for (let j = 0; j < map[0].length; j++) {
            if (map[i][j] == 2) emptySpots.push({x: j, y: i});
        }
    }
    if (emptySpots.length > 0) {
        cherryPosition = emptySpots[Math.floor(Math.random() * emptySpots.length)];
    }
};

let restartPacmanAndGhosts = () => {
    createNewPacman();
    createGhosts();
};

let onGhostCollision = () => {
    lives--;
    if (deathSound) deathSound.play().catch(() => {});
    if (lives == 0) {
        saveScore();
    } else {
        restartPacmanAndGhosts();
    }
};

let update = () => {
    if (lives > 0) {
        pacman.moveProcess();
        pacman.eat();
        updateGhosts();
        
        if (powerUpActive) {
            powerUpTimer--;
            if (powerUpTimer <= 0) {
                powerUpActive = false;
            }
        }
        
        if (pacman.checkGhostCollision(ghosts)) {
            if (powerUpActive) {
                eatGhost();
            } else {
                onGhostCollision();
            }
        }
    }
};

let eatGhost = () => {
    const startPositions = [
        {x: 10, y: 9},
        {x: 10, y: 9},
        {x: 9, y: 10},
        {x: 10, y: 10}
    ];
    for (let i = 0; i < ghosts.length; i++) {
        if (ghosts[i].getMapX() == pacman.getMapX() && ghosts[i].getMapY() == pacman.getMapY()) {
            score += 50;
            let pos = startPositions[i % 4];
            ghosts[i].x = pos.x * oneBlockSize;
            ghosts[i].y = pos.y * oneBlockSize;
            break;
        }
    }
};

let drawFoods = () => {
    for (let i = 0; i < map.length; i++) {
        for (let j = 0; j < map[0].length; j++) {
            if (map[i][j] == 2) {
                createRect(j * oneBlockSize + oneBlockSize / 3, i * oneBlockSize + oneBlockSize / 3, oneBlockSize / 3, oneBlockSize / 3, "#FEB897");
            }
        }
    }
    
    if (cherryPosition) {
        canvasContext.fillStyle = "red";
        canvasContext.beginPath();
        canvasContext.arc(cherryPosition.x * oneBlockSize + oneBlockSize / 2, cherryPosition.y * oneBlockSize + oneBlockSize / 2, oneBlockSize / 2, 0, 2 * Math.PI);
        canvasContext.fill();
    }
};

let drawRemainingLives = () => {
    canvasContext.font = "20px Emulogic";
    canvasContext.fillStyle = "white";
    canvasContext.fillText("Lives: ", 220, oneBlockSize * (map.length + 1));

    for (let i = 0; i < lives; i++) {
        canvasContext.drawImage(pacmanFrames, 2 * oneBlockSize, 0, oneBlockSize, oneBlockSize, 350 + i * oneBlockSize, oneBlockSize * map.length + 2, oneBlockSize, oneBlockSize);
    }
};

let drawScore = () => {
    canvasContext.font = "20px Emulogic";
    canvasContext.fillStyle = "white";
    canvasContext.fillText("Score: " + score, 0, oneBlockSize * (map.length + 1));
};

let draw = () => {
    canvasContext.clearRect(0, 0, canvas.width, canvas.height);
    createRect(0, 0, canvas.width, canvas.height, "black");
    drawWalls();
    drawFoods();
    drawGhosts();
    pacman.draw();
    drawScore();
    drawRemainingLives();
};

let drawWalls = () => {
    for (let i = 0; i < map.length; i++) {
        for (let j = 0; j < map[0].length; j++) {
            if (map[i][j] == 1) {
                createRect(j * oneBlockSize, i * oneBlockSize, oneBlockSize, oneBlockSize, "#342DCA");
                if (j > 0 && map[i][j - 1] == 1) {
                    createRect(j * oneBlockSize, i * oneBlockSize + wallOffset, wallSpaceWidth + wallOffset, wallSpaceWidth, wallInnerColor);
                }
                if (j < map[0].length - 1 && map[i][j + 1] == 1) {
                    createRect(j * oneBlockSize + wallOffset, i * oneBlockSize + wallOffset, wallSpaceWidth + wallOffset, wallSpaceWidth, wallInnerColor);
                }
                if (i < map.length - 1 && map[i + 1][j] == 1) {
                    createRect(j * oneBlockSize + wallOffset, i * oneBlockSize + wallOffset, wallSpaceWidth, wallSpaceWidth + wallOffset, wallInnerColor);
                }
                if (i > 0 && map[i - 1][j] == 1) {
                    createRect(j * oneBlockSize + wallOffset, i * oneBlockSize, wallSpaceWidth, wallSpaceWidth + wallOffset, wallInnerColor);
                }
            }
        }
    }
};

let createGhosts = () => {
    ghosts = [];
    const startPositions = [
        {x: 10, y: 9},
        {x: 10, y: 9},
        {x: 9, y: 10},
        {x: 10, y: 10}
    ];
    for (let i = 0; i < ghostCount; i++) {
        let pos = startPositions[i];
        let newGhost = new Ghost(pos.x * oneBlockSize, pos.y * oneBlockSize, oneBlockSize, oneBlockSize, pacman.speed / 2, ghostImageLocations[i % 4].x, ghostImageLocations[i % 4].y, 124, 116, 6 + i);
        ghosts.push(newGhost);
    }
};

let saveScore = async () => {
    try {
        await fetch('/api/scores', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ playerName, score })
        });
        loadScores();
        lives = 3;
        score = 0;
        resetMap();
        restartPacmanAndGhosts();
    } catch (error) {
        console.error('Error saving score:', error);
    }
};

let loadScores = async () => {
    try {
        const response = await fetch('/api/scores');
        const scores = await response.json();
        const scoreList = document.getElementById('scoreList');
        scoreList.innerHTML = scores.map((s, i) => 
            `<div class="score-item">${i + 1}. ${s.playerName}: ${s.score}</div>`
        ).join('');
    } catch (error) {
        console.error('Error loading scores:', error);
    }
};

document.addEventListener('DOMContentLoaded', () => {
    eatSound = document.getElementById('eatSound');
    deathSound = document.getElementById('deathSound');
    
    const nameInput = document.getElementById('playerNameInput');
    const savedName = localStorage.getItem('playerName');
    if (savedName) {
        nameInput.value = savedName;
        playerName = savedName;
    }
    
    nameInput.addEventListener('input', (e) => {
        const name = e.target.value.trim() || 'Player';
        playerName = name;
        localStorage.setItem('playerName', name);
    });
});

createNewPacman();
createGhosts();
spawnCherry();
gameLoop();
loadScores();

window.addEventListener("keydown", (event) => {
    let k = event.keyCode;
    if (k >= 37 && k <= 40) {
        event.preventDefault();
    }
    setTimeout(() => {
        if (k == 37 || k == 65) {
            pacman.nextDirection = DIRECTION_LEFT;
        } else if (k == 38 || k == 87) {
            pacman.nextDirection = DIRECTION_UP;
        } else if (k == 39 || k == 68) {
            pacman.nextDirection = DIRECTION_RIGHT;
        } else if (k == 40 || k == 83) {
            pacman.nextDirection = DIRECTION_BOTTOM;
        }
    }, 1);
});
