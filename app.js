var currentSearch;
var hoverOn = true;
var buttonArray;
var baseURL = "https://api.giphy.com/v1/gifs/search?api_key=BDU3KiPFpEdQOmsEDOWmrTfIrkdzo4Ji&limit=25&offset=0&rating=PG&lang=en&q="
if (localStorage.getItem("buttonArray") == null){
    buttonArray = ["Cats", "Dogs", "Television", "Movies", "Anything"];
}
else {
    buttonArray = JSON.parse("buttonArray")
}

$(document).ready(function() {
    displayButtons();
})

function displayButtons() {
    buttonArray.forEach(topic => {
        var newButton = $("<button>");
        newButton.addClass("search btn btn-secondary");
        newButton.text(topic);
        $("#sidebar").append(newButton);
    });
}

$("#submit").on("click", function () {
    $("#contentholder").empty();
    var searchTerm = $("#searchterm").val();
    currentSearch = searchTerm; //saves the current search so the user can add it to favorites.
    var queryURL = baseURL + searchTerm;
    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function (response) {
        console.log(response);
        var data = response.data;
        for (var i = 0; i < 25; i++) {
            var imgContainer = $("<div>");
            imgContainer.addClass("imgContainer");
            var imgSpan = $("<span>");
            imgSpan.addClass("rating");
            imgSpan.text("Rating: " + data[i].rating)
            var newImage = $("<img>");
            newImage.addClass("content");
            newImage.attr("src", data[i].images.fixed_height_still.url);
            newImage.attr("data-still", data[i].images.fixed_height_still.url);
            newImage.attr("data-animated", data[i].images.fixed_height.url);
            newImage.attr("data-playing", "no");
            imgContainer.append(newImage, imgSpan);
            $("#contentholder").append(imgContainer);
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

$("#favorite").on("click", function() {
    var newButton = $("<button>");
    newButton.addClass("search btn btn-secondary");
    newButton.text(currentSearch);
    $("#sidebar").append(newButton);
    buttonArray.push(currentSearch.toString());
    localStorage.setItem("buttonArray", JSON.stringify(buttonArray));
});

$(document).on("mouseover", ".content", function () {
    if (hoverOn) { //Alows the user to choose which trigger they would like to use to play the gifs. Ignores mouseover if hoverOn is true. 
        $(this).attr("src", $(this).attr("data-animated"));
        $(document).on("mouseout", ".content", function () {
            if (hoverOn) { //Had to add this check again for some reason. Else mouseout would play with then click setting was on. 
                $(this).attr("src", $(this).attr("data-still"));
            }
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
            $(this).attr("data-playing", "no");
        }
    }
});
