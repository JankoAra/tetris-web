const positionMap = {
    "I": {
        "rotation": {
            0: [[1, -1], [1, 0], [1, 1], [1, 2]],
            1: [[0, 1], [1, 1], [2, 1], [3, 1]],
            2: [[2, -1], [2, 0], [2, 1], [2, 2]],
            3: [[0, 0], [1, 0], [2, 0], [3, 0]]
        }
    },
    "T": {
        "rotation": {
            0: [[1, 0], [0, 1], [1, 1], [1, 2]],
            1: [[0, 1], [1, 1], [2, 1], [1, 2]],
            2: [[1, 0], [1, 1], [1, 2], [2, 1]],
            3: [[0, 1], [1, 1], [2, 1], [1, 0]]
        }
    },
    "O": {
        "rotation": {
            0: [[0, 0], [1, 0], [1, 1], [0, 1]],
            1: [[0, 0], [1, 0], [1, 1], [0, 1]],
            2: [[0, 0], [1, 0], [1, 1], [0, 1]],
            3: [[0, 0], [1, 0], [1, 1], [0, 1]]
        }
    },
    "Z": {
        "rotation": {
            0: [[0, 0], [0, 1], [1, 1], [1, 2]],
            1: [[0, 2], [1, 1], [1, 2], [2, 1]],
            2: [[1, 0], [1, 1], [2, 1], [2, 2]],
            3: [[0, 1], [1, 0], [1, 1], [2, 0]]
        }
    },
    "S": {
        "rotation": {
            0: [[0, 1], [1, 0], [1, 1], [0, 2]],
            1: [[0, 1], [1, 1], [1, 2], [2, 2]],
            2: [[2, 0], [2, 1], [1, 1], [1, 2]],
            3: [[0, 0], [1, 0], [1, 1], [2, 1]]
        }
    },
    "L": {
        "rotation": {
            0: [[0, 0], [1, 0], [2, 0], [2, 1]],
            1: [[0, 0], [0, 1], [0, 2], [1, 0]],
            2: [[0, 1], [0, 2], [1, 2], [2, 2]],
            3: [[2, 0], [2, 1], [2, 2], [1, 2]]
        }
    },
    "J": {
        "rotation": {
            0: [[0, 2], [1, 2], [2, 2], [2, 1]],
            1: [[1, 0], [2, 0], [2, 1], [2, 2]],
            2: [[0, 1], [2, 0], [1, 0], [0, 0]],
            3: [[0, 0], [0, 1], [0, 2], [1, 2]]
        }
    }
}
let types = window.localStorage.getItem("tetris-shapes").split(",");
const difficulty = window.localStorage.getItem("tetris-difficulty");

class TetrisShape {
    static colors = ["red", "green", "blue", "yellow", "purple", "orange", "cyan"];
    constructor() {
        this.type = types[Math.floor(Math.random() * types.length)];
        this.rotation = 0;
        this.center = new Array(spawnPoint[0], spawnPoint[1]);
        this.blocks = null;
        this.calculateBlocks();
        this.color = TetrisShape.colors[Math.floor(Math.random() * TetrisShape.colors.length)];
    }

    calculateBlocks() {
        let offsets = positionMap[this.type]["rotation"][this.rotation];
        this.blocks = []
        offsets.forEach(element => {
            this.blocks.push([this.center[0] + element[0], this.center[1] + element[1]]);
        });
        return this.blocks;
    }

    clone() {
        let shape = new TetrisShape();
        shape.type = this.type;
        shape.rotation = this.rotation;
        shape.center = Array.from(this.center);
        shape.blocks = arrayDeepCopy(this.blocks);
        shape.color = this.color;
        return shape;
    }


}

function playSoundtrack() {
    let soundHTML = `<audio autoplay loop>
    <source src="tetris-dodatno/tetris-ost-2.mp3" type="audio/mpeg">
    Your browser does not support the audio element.
</audio>`;
    let enabled = window.localStorage.getItem("tetris-sound");
    if (enabled === "false" || enabled === null) return;
    $("body").append(soundHTML);
}

function renderScoreboard() {
    //let scoreboard = JSON.parse(window.localStorage.getItem("tetris-scoreboard"));
    const RESULTS_TO_SHOW = 5;
    const scoreboardElement = $("div#leaderboard");
    for (let i = 1; i <= RESULTS_TO_SHOW; i++) {
        let scoreDict = scoreboard[i];
        let pill = $("<div></div>").addClass("pill");
        pill.append($("<div></div>").addClass("place").addClass("text-start").text(i));
        pill.append($("<div></div>").addClass("name").text(scoreDict["name"]));
        pill.append($("<div></div>").addClass("score").addClass("ms-auto")
            .addClass("text-end").text(scoreDict["score"]));
        scoreboardElement.append(pill);
    }
}

function drawNextShapePreview() {
    let table = document.getElementById('nextShapePreview');
    table.innerHTML = "";
    for (let i = 0; i < 5; i++) {
        let tr = document.createElement('tr');
        for (let j = 0; j < 5; j++) {
            let td = document.createElement('td');
            $(td).addClass("col" + j).addClass("row" + i).addClass("preview");
            tr.appendChild(td);
        }
        table.appendChild(tr);
    }
    let preview = nextShape.clone();
    preview.center = [1, 1];
    if (preview.type === "I") preview.rotation = 1;
    preview.calculateBlocks();
    preview.blocks.forEach(element => {
        let td = document.querySelector(".col" + element[1] + ".row" + element[0] + ".preview");
        $(td).addClass(preview.color);
    });
}

let scoreboard = window.localStorage.getItem("tetris-scoreboard");
if (scoreboard === null) scoreboard = {
    1: { "name": "A", "score": 0 },
    2: { "name": "B", "score": 0 },
    3: { "name": "C", "score": 0 },
    4: { "name": "D", "score": 0 },
    5: { "name": "E", "score": 0 }
};
else scoreboard = JSON.parse(scoreboard);

const ROWS = 20;
const COLS = 10;
let activeShape = null;
let nextShape = null;
let ghostShape = null;
const spawnPoint = [0, 4];
let gameRunning = false;
let intervalGravityInterval = null;
let intervalTime;
let ghostShapeAvailable = window.localStorage.getItem("tetris-ghost");

switch (difficulty) {
    case "easy":
        intervalTime = 1500;
        break;
    case "medium":
        intervalTime = 1000;
        break;
    case "hard":
        intervalTime = 700;
        break;
}

let spaceInterval = null;
let points = 0;
let totalLinesCleared = 0;
let level = 1;
let pointsToLevelUp = 300;
let minIntervalTime = 200;
function updatePointDisplay() {
    document.getElementById("points").innerHTML = Math.floor(points);
    if (points >= level * pointsToLevelUp) {
        level++;
        updateLevelDisplay();
        intervalTime = Math.max(intervalTime - 100, minIntervalTime);
        if (intervalGravityInterval !== null) clearInterval(intervalGravityInterval);
        intervalGravityInterval = setInterval(() => {
            document.dispatchEvent(new KeyboardEvent('keydown', { 'key': 'ArrowDown' }));
        }, intervalTime);
    }
}
function updateLinesClearedDisplay() {
    document.getElementById("linesCleared").innerHTML = totalLinesCleared;
}
function updateLevelDisplay() {
    document.getElementById("level").innerHTML = level;
}

$(document).ready(function () {
    initTable();
    playSoundtrack();
    renderScoreboard();
    points = 0;
    totalLinesCleared = 0;
    level = 1;
    activeShape = new TetrisShape();
    nextShape = new TetrisShape();

    moveShape(0, 0);
    gameRunning = true;
    dropGhostShape();
    drawNextShapePreview();
    $(document).keydown(function (event) {
        if (!gameRunning) return;
        //clearGhostShape();
        switch (event.key) {
            case 'ArrowUp':
                // Handle arrow up key press
                // console.log('Arrow Up pressed');
                //moveShape(-1, 0);
                if (spaceInterval !== null) break;
                rotateClockwise();
                break;
            case 'ArrowDown':
                // Handle arrow down key press
                // console.log('Arrow Down pressed');
                let moved = moveShape(1, 0);
                if (!moved) {
                    ghostShape = null;
                    if (spaceInterval !== null) {
                        clearInterval(spaceInterval);
                        spaceInterval = null;
                    }
                    // blok ima nesto ispod sebe
                    activeShape.blocks.forEach(element => {
                        let td = document.querySelector(".col" + element[1] + ".row" + element[0]);
                        $(td).addClass("ground");
                        $(td).addClass(activeShape.color);
                    });
                    clearRows();
                    if (checkGameOver()) {
                        gameRunning = false;
                        if (intervalGravityInterval !== null) {
                            clearInterval(intervalGravityInterval);
                            intervalGravityInterval = null;
                        }
                        setTimeout(() => {
                            points = Math.floor(points);
                            let name = prompt("Game over. Osvojen broj poena: " + points +
                                ". Unesite ime za scoreboard: ");
                            if (name === null || /^\s*$/.test(name)) {
                                name = 'Unknown';
                            }
                            else {
                                name = name.trim();
                                if (name.length > 20)
                                    name = name.slice(0, 20) + "...";
                            }
                            let place = updateScoreboard(name, points);
                            window.localStorage.setItem("tetris-last-game",
                                JSON.stringify({ "name": name, "score": points, "place": place }));
                            window.location.href = "tetris-rezultati.html";
                        }, 20);

                        return;
                    }
                    activeShape = nextShape;
                    nextShape = new TetrisShape();
                    moveShape(0, 0);
                    drawNextShapePreview();
                }
                else {
                    points += 0.5;
                    updatePointDisplay();
                }
                break;
            case 'ArrowLeft':
                // Handle arrow left key press
                // console.log('Arrow Left pressed');
                if (spaceInterval !== null) break;
                moveShape(0, -1);
                break;
            case 'ArrowRight':
                // Handle arrow right key press
                // console.log('Arrow Right pressed');
                if (spaceInterval !== null) break;
                moveShape(0, 1);
                break;
            case ' ':
                if (spaceInterval === null) {
                    spaceInterval = setInterval(() => {
                        document.dispatchEvent(new KeyboardEvent('keydown', { 'key': 'ArrowDown' }));
                    }, 10);
                }
                return;
            default:
                break;
        }
        dropGhostShape();
    });

    intervalGravityInterval = setInterval(() => {
        document.dispatchEvent(new KeyboardEvent('keydown', { 'key': 'ArrowDown' }));
    }, intervalTime);

});

function initTable() {
    let table = document.getElementById('playArea');
    for (let i = 0; i < ROWS; i++) {
        let tr = document.createElement('tr');
        $(tr).addClass("row" + i)
        for (let j = 0; j < COLS; j++) {
            let td = document.createElement('td');
            $(td).addClass("col" + j).addClass("row" + i);
            tr.appendChild(td);
        }
        table.appendChild(tr);
    }
}

function dropGhostShape() {
    if (!gameRunning || !ghostShapeAvailable || ghostShapeAvailable === "false") return;
    ghostShape = activeShape.clone();
    while (!checkShapeOverlap(ghostShape)) {
        ghostShape.center[0]++;
        ghostShape.calculateBlocks();
    }
    ghostShape.center[0]--;
    ghostShape.calculateBlocks();
    ghostShape.blocks.forEach(element => {
        let td = document.querySelector(".col" + element[1] + ".row" + element[0]);
        for (let i = 0; i < activeShape.blocks.length; i++) {
            if (element[0] === activeShape.blocks[i][0] && element[1] === activeShape.blocks[i][1]) {
                return;
            }
        }
        $(td).addClass("ghost");
        $(td).addClass(ghostShape.color);
    });
}

function clearGhostShape() {
    if (!ghostShapeAvailable || ghostShapeAvailable === "false") return;
    if (ghostShape !== null) {
        ghostShape.blocks.forEach(element => {
            let td = document.querySelector(".col" + element[1] + ".row" + element[0]);
            $(td).removeClass(ghostShape.color);
            $(td).removeClass("ghost");
        });
    }
}


function moveShape(deltaRow, deltaCol, shape = activeShape) {
    if (checkSideCollision(deltaCol)) return true;
    if (deltaRow > 0 && checkBottomCollision(shape)) return false;
    clearGhostShape();
    shape.blocks.forEach(element => {
        let td = document.querySelector(".col" + element[1] + ".row" + element[0]);
        $(td).removeClass(shape.color);
    });
    shape.center[0] += deltaRow;
    shape.center[1] += deltaCol;
    shape.calculateBlocks();
    shape.blocks.forEach(element => {
        let td = document.querySelector(".col" + element[1] + ".row" + element[0]);
        $(td).addClass(shape.color);
    });
    return true;
}

function checkBottomCollision(shape = activeShape) {
    let collision = false;
    shape.blocks.forEach(element => {
        if (element[0] + 1 >= ROWS) collision = true;
        else {
            let td = document.querySelector(".col" + element[1] + ".row" + (element[0] + 1));
            if ($(td).hasClass("ground")) collision = true;
        }
    });
    return collision;
}
function checkSideCollision(deltaCol) {
    let collision = false;
    activeShape.blocks.forEach(element => {
        if (element[1] + deltaCol < 0 || element[1] + deltaCol >= COLS) {
            collision = true;
        }
        else {
            let td = document.querySelector(".col" + (element[1] + deltaCol) + ".row" + element[0]);
            if ($(td).hasClass("ground")) collision = true;
        }
    });
    return collision;
}

function rotateClockwise() {
    let copy = activeShape.clone();
    copy.rotation = (copy.rotation + 3) % 4;
    copy.calculateBlocks();
    if (checkShapeOverlap(copy)) {
        copy.center[1]--;
        copy.calculateBlocks();
        if (checkShapeOverlap(copy)) {
            copy.center[1] += 2;
            copy.calculateBlocks();
            if (checkShapeOverlap(copy)) {
                copy.center[1]--;
                copy.center[0]--;
                copy.calculateBlocks();
                if (checkShapeOverlap(copy)) {
                    console.log("ne moze se rotirati");
                    return;
                }
            }
        }
    }
    clearGhostShape();

    activeShape.blocks.forEach(element => {
        let td = document.querySelector(".col" + element[1] + ".row" + element[0]);
        $(td).removeClass(activeShape.color);
    });

    activeShape = copy;

    activeShape.blocks.forEach(element => {
        let td = document.querySelector(".col" + element[1] + ".row" + element[0]);
        $(td).addClass(activeShape.color);
    });
}

function checkGameOver() {
    let gameOver = false;
    nextShape.blocks.forEach(element => {
        let td = document.querySelector(".col" + element[1] + ".row" + element[0]);
        if ($(td).hasClass("ground")) gameOver = true;
    })
    return gameOver;
}

function checkShapeOverlap(shape) {
    let overlap = false;
    shape.blocks.forEach(element => {
        if (element[1] < 0 || element[1] >= COLS || element[0] < 0 || element[0] >= ROWS) {
            overlap = true;
            return;
        }
        let td = document.querySelector(".col" + element[1] + ".row" + element[0]);
        if ($(td).hasClass("ground")) overlap = true;
    })
    return overlap;
}

function arrayDeepCopy(arr) {
    return arr.map(innerArray => Array.from(innerArray));
}

function clearRows() {
    //ciscenje redova
    let numCleared = 0;
    rowloop: for (let i = ROWS - 1; i >= 0; i--) {
        for (let j = 0; j < COLS; j++) {
            if (!$(document.querySelector(".col" + j + ".row" + i)).hasClass("ground")) {
                continue rowloop;
            }
        }
        console.log("row " + (ROWS - i) + " cleared");
        numCleared++;
        for (let j = 0; j < COLS; j++) {
            let td = document.querySelector(".col" + j + ".row" + i);
            $(td).attr("class", "col" + j + " row" + i);
        }
    }
    if(numCleared > 0) {
        points += Math.pow(2, numCleared) * COLS;
    }
    totalLinesCleared += numCleared;
    updatePointDisplay();
    updateLinesClearedDisplay();
    //spustanje preostalih redova
    let test = 1;
    for (let i = ROWS - 1; i >= test; i--) {
        if (rowEmpty(i)) {
            let nonEmpty = 0;
            for (let j = i - 1; j >= test; j--) {
                if (!rowEmpty(j)) {
                    nonEmpty = j;
                    break;
                }
            }
            for (let j = 0; j < COLS; j++) {
                let currentTD = document.querySelector(".col" + j + ".row" + i);
                let nextTD = document.querySelector(".col" + j + ".row" + nonEmpty);
                let temp = currentTD.getAttribute("class");
                $(currentTD).attr("class", nextTD.getAttribute("class"));
                $(currentTD).removeClass("row" + nonEmpty);
                $(currentTD).addClass("row" + i);
                $(nextTD).attr("class", temp);
                $(nextTD).removeClass("row" + i);
                $(nextTD).addClass("row" + nonEmpty);
            }
        }
    }
}

function rowEmpty(rowIndex) {
    for (let j = 0; j < COLS; j++) {
        let td = document.querySelector(".col" + j + ".row" + rowIndex);
        if ($(td).hasClass("ground")) return false;
    }
    return true;
}

function updateScoreboard(newName, newScore) {
    let maxPlaces = 5;
    let order = 6;
    for (let i = 1; i <= maxPlaces; i++) {
        let currentScore = scoreboard[i]["score"];
        if (newScore > currentScore) {
            for (let j = maxPlaces; j > i; j--) {
                scoreboard[j] = scoreboard[j - 1];
            }
            scoreboard[i] = { "name": newName, "score": newScore };
            order = i;
            break;
        }
    }
    window.localStorage.setItem("tetris-scoreboard", JSON.stringify(scoreboard));
    return order;
}