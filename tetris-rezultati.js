$(document).ready(function () {
    playSoundtrack();
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
            pill.append($("<div></div>").addClass("place").text(i));
            pill.append($("<div></div>").addClass("name").text(scoreDict["name"]));
            pill.append($("<div></div>").addClass("score").addClass("ms-auto").text(scoreDict["score"]));
            if (i === lastGame.place) {
                top5 = true;
                pill.addClass("myscore");
            }
            scoreboardElement.append(pill);
        }
        if (!top5) {
            scoreboardElement.append($("<hr>"));
            let pill = $("<div></div>").addClass("pill");
            pill.append($("<div></div>").addClass("place"));
            pill.append($("<div></div>").addClass("name").text(lastGame.name));
            pill.append($("<div></div>").addClass("score").addClass("ms-auto").text(lastGame.score));
            pill.addClass("myscore");
            scoreboardElement.append(pill);
        }
    }

    function playSoundtrack(){
        let soundHTML = `<audio autoplay>
        <source src="tetris-dodatno/tetris-ost-end.mp3" type="audio/mpeg">
        Your browser does not support the audio element.
    </audio>`;
        let enabled = window.localStorage.getItem("tetris-sound");
        if(enabled === "false" || enabled === null) return;
        $("body").append(soundHTML);
    }
});