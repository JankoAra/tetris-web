$(document).ready(function () {
    let scoreboard = JSON.parse(window.localStorage.getItem("tetris-scoreboard"));
    let lastGame = JSON.parse(window.localStorage.getItem("tetris-last-game"));

    renderScoreboard(scoreboard);

    $("#backToBeginning").click(function () {
        window.location.href = "tetris-uputstvo.html";
    });


    function renderScoreboard(scores) {
        const scoreboardElement = document.getElementById("scoreboard");
        scoreboardElement.innerHTML = ""; // Clear previous scoreboard
        let lastGameInTop5 = false;
        let maxRows = 5;
        for (let i = 1; i <= maxRows; i++) {
            let score = scores[i];
            let tr = document.createElement("tr");
            tr.innerHTML = `
                <td>${i}.</td>
                <td>${score.name}</td>
                <td>${score.score}</td>
            `;
            if (i === lastGame.place) {
                tr.innerHTML += `<td><b>NEW</b></td>`
                lastGameInTop5 = true;
            }
            scoreboardElement.appendChild(tr);
        }
        if (!lastGameInTop5) {
            let tr = document.createElement("tr");
            tr.innerHTML = `
                <td></td>
                <td>${lastGame.name}</td>
                <td>${lastGame.score}</td>
                <td><b>NEW</b></td>
            `;
            scoreboardElement.appendChild(tr);

        }
    }
})