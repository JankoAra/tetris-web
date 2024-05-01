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

const ROWS = 20;
const COLS = 10;
let activeShape = null;
let nextShape = null;
const spawnPoint = [0, 4];
let gameRunning = false;
let intervalGravityInterval = null;
let intervalTime;
switch (difficulty) {
    case "easy":
        intervalTime = 2000;
        break;
    case "medium":
        intervalTime = 1000;
        break;
    case "hard":
        intervalTime = 500;
        break;
}

let spaceInterval = null;


$(document).ready(function () {
    initTable();
    activeShape = new TetrisShape();
    nextShape = new TetrisShape();
    moveShape(0, 0);
    gameRunning = true;
    $(document).keydown(function (event) {
        if (!gameRunning) return;
        switch (event.key) {
            case 'ArrowUp':
                // Handle arrow up key press
                // console.log('Arrow Up pressed');
                //moveShape(-1, 0);
                rotateClockwise();
                break;
            case 'ArrowDown':
                // Handle arrow down key press
                // console.log('Arrow Down pressed');
                let moved = moveShape(1, 0);
                if (!moved) {
                    if (spaceInterval !== null) {
                        clearInterval(spaceInterval);
                        spaceInterval = null;
                    }
                    // blok ima nesto ispod sebe
                    activeShape.blocks.forEach(element => {
                        let td = document.querySelector(".col" + element[1] + ".row" + element[0]);
                        $(td).removeClass("shapeCovering");
                        $(td).addClass("ground");
                    });
                    clearRows();
                    if (checkGameOver()) {
                        gameRunning = false;
                        if (intervalGravityInterval !== null) {
                            clearInterval(intervalGravityInterval);
                            intervalGravityInterval = null;
                        }
                        setTimeout(() => {
                            alert("Game over");
                        }, 20);
                        return;
                    }
                    activeShape = nextShape;
                    nextShape = new TetrisShape();
                    moveShape(0, 0);
                }
                break;
            case 'ArrowLeft':
                // Handle arrow left key press
                // console.log('Arrow Left pressed');
                moveShape(0, -1);
                break;
            case 'ArrowRight':
                // Handle arrow right key press
                // console.log('Arrow Right pressed');
                moveShape(0, 1);
                break;
            case ' ':
                if (spaceInterval === null) {
                    spaceInterval = setInterval(() => {
                        document.dispatchEvent(new KeyboardEvent('keydown', { 'key': 'ArrowDown' }));
                    }, 10);
                }
                break;
            default:
                break;
        }
    });

    intervalGravityInterval = setInterval(() => {
        document.dispatchEvent(new KeyboardEvent('keydown', { 'key': 'ArrowDown' }));
    }, intervalTime);

});

function initTable() {
    let table = document.getElementsByTagName('table')[0];
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


function moveShape(deltaRow, deltaCol) {
    if (checkSideCollision(deltaCol)) return true;
    if (deltaRow > 0 && checkBottomCollision()) return false;
    activeShape.blocks.forEach(element => {
        let td = document.querySelector(".col" + element[1] + ".row" + element[0]);
        $(td).removeClass(activeShape.color);
    });
    activeShape.center[0] += deltaRow;
    activeShape.center[1] += deltaCol;
    activeShape.calculateBlocks();
    activeShape.blocks.forEach(element => {
        let td = document.querySelector(".col" + element[1] + ".row" + element[0]);
        $(td).addClass(activeShape.color);
    });
    return true;
}

function checkBottomCollision() {
    let collision = false;
    activeShape.blocks.forEach(element => {
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
    copy.rotation = (copy.rotation + 1) % 4;
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
                    return;
                }
            }
        }
    }

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
    rowloop: for (let i = ROWS - 1; i >= 0; i--) {
        for (let j = 0; j < COLS; j++) {
            if (!$(document.querySelector(".col" + j + ".row" + i)).hasClass("ground")) {
                continue rowloop;
            }
        }
        console.log("row " + (ROWS - i) + " cleared");
        for (let j = 0; j < COLS; j++) {
            let td = document.querySelector(".col" + j + ".row" + i);
            $(td).attr("class", "col" + j + " row" + i);
        }
    }

    //spustanje preostalih redova
    for (let i = ROWS - 1; i >= 3; i--) {
        if (rowEmpty(i)) {
            let nonEmpty = 0;
            for (let j = i - 1; j >= 3; j--) {
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
