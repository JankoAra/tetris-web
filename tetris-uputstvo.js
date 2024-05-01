const types = ["Z", "S", "O", "I", "L", "J", "T"];

$(document).ready(function () {
    let tdsWithShape = $("td").filter(function () {
        let classes = $(this).attr("class").split(" ");
        return classes.some(element => element.length == 1);
    });

    $("button").click(startGame);

    tdsWithShape.click(function () {
        let shape = $(this).attr("class").split(" ").find(element => element.length == 1);
        if (!shape) return;
        let checkbox = $("input[type=checkbox][value=" + shape + "]");
        $(checkbox).prop("checked", !$(checkbox).prop("checked"));
    });

    tdsWithShape.hover(function () {
        $(this).css("cursor", "pointer");
    });


    $("label").click(function () {
        let radio = $("input[type=radio][value=" + $(this).attr("for") + "]");
        $(radio).prop("checked", true);
    })

    $("label").hover(function () {
        $(this).css("cursor", "pointer");
    })


    function startGame() {
        let checked = $("input[type=checkbox]:checked");
        let shapes = [];
        checked.each(function () {
            shapes.push($(this).val());
        });

        window.localStorage.setItem("tetris-shapes", shapes);

        let difficulty = $("input[type=radio]:checked").val();
        window.localStorage.setItem("tetris-difficulty", difficulty);

        window.location.href = "tetris-igra.html";
    }
});
