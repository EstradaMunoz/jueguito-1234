const box = document.getElementById("box");
const door = document.getElementById("door");
const message = document.getElementById("message");

const triquiContainer = document.getElementById("triqui-container");
const board = document.getElementById("board");
const statusText = document.getElementById("status");

let hasKey = false;
let gameActive = true;
let currentPlayer = "X"; // jugador
let cells = [];

const winCond = [
    [0,1,2],[3,4,5],[6,7,8],
    [0,3,6],[1,4,7],[2,5,8],
    [0,4,8],[2,4,6]
];

// 🔑 Encontrar llave
box.addEventListener("click", () => {
    if (!hasKey) {
        hasKey = true;
        message.textContent = "🔑 Encontraste una llave!";
        box.textContent = "📦 (vacía)";
    }
});

// 🚪 Puerta
door.addEventListener("click", () => {
    if (!hasKey) {
        message.textContent = "La puerta está cerrada. Necesitas una llave.";
        return;
    }

    message.textContent = "La puerta tiene un sistema... gana el triqui.";
    triquiContainer.classList.remove("hidden");
});

// Crear tablero
function createBoard() {
    board.innerHTML = "";
    cells = [];

    for (let i = 0; i < 9; i++) {
        let cell = document.createElement("div");
        cell.classList.add("cell");
        cell.addEventListener("click", () => playerMove(i));
        board.appendChild(cell);
        cells.push(cell);
    }
}

// Movimiento jugador
function playerMove(index) {
    if (!gameActive || cells[index].textContent !== "") return;

    cells[index].textContent = "X";

    if (checkWin("X")) {
        statusText.textContent = "🎉 Ganaste!";
        unlockDoor();
        gameActive = false;
        return;
    }

    if (isDraw()) {
        statusText.textContent = "Empate";
        gameActive = false;
        return;
    }

    aiMove();
}

// 🤖 IA simple
function aiMove() {
    let move = bestMove();

    if (move !== null) {
        cells[move].textContent = "O";
    }

    if (checkWin("O")) {
        statusText.textContent = "💀 Perdiste";
        gameActive = false;
        return;
    }

    if (isDraw()) {
        statusText.textContent = "Empate";
        gameActive = false;
    }
}

// IA intenta ganar o bloquear
function bestMove() {
    // 1. Intentar ganar
    for (let cond of winCond) {
        let [a,b,c] = cond;
        let vals = [cells[a], cells[b], cells[c]].map(c => c.textContent);

        if (vals.filter(v => v === "O").length === 2 && vals.includes("")) {
            return [a,b,c][vals.indexOf("")];
        }
    }

    // 2. Bloquear jugador
    for (let cond of winCond) {
        let [a,b,c] = cond;
        let vals = [cells[a], cells[b], cells[c]].map(c => c.textContent);

        if (vals.filter(v => v === "X").length === 2 && vals.includes("")) {
            return [a,b,c][vals.indexOf("")];
        }
    }

    // 3. Centro
    if (cells[4].textContent === "") return 4;

    // 4. Aleatorio
    let empty = cells
        .map((c, i) => c.textContent === "" ? i : null)
        .filter(v => v !== null);

    return empty.length ? empty[Math.floor(Math.random() * empty.length)] : null;
}

function checkWin(player) {
    return winCond.some(cond => {
        return cond.every(i => cells[i].textContent === player);
    });
}

function isDraw() {
    return cells.every(c => c.textContent !== "");
}

function resetGame() {
    gameActive = true;
    statusText.textContent = "";
    createBoard();
}

// 🚪 Abrir puerta
function unlockDoor() {
    door.textContent = "🚪 ABIERTA";
    door.style.background = "green";
    message.textContent = "Escapaste!";
}

// iniciar
createBoard();
