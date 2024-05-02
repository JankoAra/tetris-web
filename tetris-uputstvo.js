$(document).ready(function () {
    let tdsWithShape = $("[data-shape]");

    $("button").click(startGame);

    tdsWithShape.click(function () {
        let shape = $(this).attr("data-shape");
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
        let checked = $("input[type=checkbox][name=oblik]:checked");
        let shapes = [];
        checked.each(function () {
            shapes.push($(this).val());
        });

        window.localStorage.setItem("tetris-shapes", shapes);
        let ghostOn = $("input[type=checkbox][name=ghost]").prop("checked");
        window.localStorage.setItem("tetris-ghost", ghostOn);

        let difficulty = $("input[type=radio]:checked").val();
        window.localStorage.setItem("tetris-difficulty", difficulty);

        setTimeout(() => {
            window.location.href = "tetris-igra.html";
        }, 30);
    }
});
