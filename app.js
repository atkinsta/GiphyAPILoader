var hoverOn = true;
var baseURL = "https://api.giphy.com/v1/gifs/search?api_key=BDU3KiPFpEdQOmsEDOWmrTfIrkdzo4Ji&limit=25&offset=0&rating=PG&lang=en&q="

$("#submit").on("click", function () {
    $("#contentholder").empty();
    var searchTerm = $("#searchterm").val();
    var queryURL = baseURL + searchTerm;
    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function (response) {
        console.log(response);
        var data = response.data;
        for (var i = 0; i < 25; i++) {
            var newImage = $("<img>");
            newImage.attr("class", "content");
            newImage.attr("src", data[i].images.fixed_height_still.url);
            newImage.attr("data-still", data[i].images.fixed_height_still.url);
            newImage.attr("data-animated", data[i].images.fixed_height.url);
            newImage.attr("data-playing", "no");
            $("#contentholder").append(newImage);
        }
    });
});

$(".controls").on("click", function () {
    console.log($(this).val());
    if ($(this).val() === "click") {
        hoverOn = false;
        console.log(hoverOn);
    }
    else if ($(this).val() === "hover") {
        hoverOn = true;
        console.log(hoverOn);
    }
});


$(document).on("mouseover", ".content", function () {
    if (hoverOn) { //Alows the user to choose which trigger they would like to use to play the gifs. Ignores mouseover if hoverOn is true. 
        $(this).attr("src", $(this).attr("data-animated"));
        $(document).on("mouseout", ".content", function () {
            $(this).attr("src", $(this).attr("data-still"));
        });
    }
});

$(document).on("click", ".content", function () {
    if (!hoverOn) { //same function as above, but ignores clicks if hoverOn is false. 
        if ($(this).attr("data-playing") == "no") {
            $(this).attr("data-playing", "yes");
            $(this).attr("src", $(this).attr("data-animated"));
        }
        else {
            $(this).attr("src", $(this).attr("data-still"));
        }
    }
});
