$(document).ready(function () {
    let scoreboard = JSON.parse(window.localStorage.getItem("tetris-scoreboard"));
    let lastGame = JSON.parse(window.localStorage.getItem("tetris-last-game"));
    const RESULTS_TO_SHOW = 5;

    renderScoreboard();

    $("#backToBeginning").click(function () {
        window.location.href = "tetris-uputstvo.html";
    });


    function renderScoreboard() {
        let top5 = false;
        const scoreboardElement = $("div.scoreboard");
        for (let i = 1; i <= RESULTS_TO_SHOW; i++) {
            let scoreDict = scoreboard[i];
            let pill = $("<div></div>").addClass("pill");
            pill.append($("<span></span>").addClass("place").text(i));
            pill.append($("<span></span>").addClass("name").text(scoreDict["name"]));
            pill.append($("<span></span>").addClass("score").text(scoreDict["score"]));
            if (i === lastGame.place) {
                top5 = true;
                pill.addClass("myscore");
            }
            scoreboardElement.append(pill);
        }
        if (!top5) {
            scoreboardElement.append($("<hr>"));
            let pill = $("<div></div>").addClass("pill");
            pill.append($("<span></span>").addClass("place"));
            pill.append($("<span></span>").addClass("name").text(lastGame.name));
            pill.append($("<span></span>").addClass("score").text(lastGame.score));
            pill.addClass("myscore");
            scoreboardElement.append(pill);
        }
    }
})