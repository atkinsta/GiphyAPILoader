var timeoutId; //used to remove buttons on click-and-hold
var currentSearch;
var hoverOn = true; //sets the trigger option for playing gifs, hoverOn is recommended! click is lame.
var buttonArray;
var queryURL;
var baseURL = "https://api.giphy.com/v1/gifs/search?api_key=BDU3KiPFpEdQOmsEDOWmrTfIrkdzo4Ji&limit=25&offset=0&rating=PG&lang=en&q="
if (localStorage.getItem("buttonArray") == null) {                          //If local storage doesn't have a buttonArray already saved...
    buttonArray = ["Cats", "Dogs", "Television", "Movies", "Anything"];
}
else {
    buttonArray = JSON.parse(localStorage.getItem("buttonArray"));          //Parse the array from local storage to keep favorites
}

$(document).ready(function () { //Always display the buttons from favorites
    localStorage.setItem("buttonArray", JSON.stringify(buttonArray)); // adding this here just for safety. It does update this localstorage variable in other places, but I figure
    displayButtons();                                                 // it's safer to just initialize it at the start.  
})

function displayButtons() { //Simple loop to append the buttons to the sidebar. 
    buttonArray.forEach(topic => {
        var newButton = $("<button>");
        newButton.addClass("search btn btn-secondary");
        newButton.attr("id", topic);
        newButton.text(topic);
        $("#buttonholder").append(newButton);
    });
}

function ajaxCall() { //I called this twice in the program so I figured I'd throw it in a function.
    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function (response) {
        var data = response.data;
        for (var i = 0; i < 25; i++) {          //Create image containers for each item in the array, each of which has an image and a span. The span is layered on top of the image.
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
}

$("#submit").on("click", function () {
    $("#contentholder").empty();
    var searchTerm = $("#searchterm").val();
    currentSearch = searchTerm; //saves the current search so the user can add it to favorites.
    queryURL = baseURL + searchTerm;
    ajaxCall();
});

$(".controls").on("click", function () { //Sets the hover option. 
    if ($(this).val() === "click") {
        hoverOn = false;
    }
    else if ($(this).val() === "hover") {
        hoverOn = true;
    }
});

$("#favorite").on("click", function () { //Adds a button, adds the search term to the buttonArray, updates the local storage variable. 
    var newButton = $("<button>");
    newButton.addClass("search btn btn-secondary");
    newButton.text(currentSearch);
    $("#buttonholder").append(newButton); //THIS was the problem with removing favorites. It was set to #sidebar append.
    buttonArray.push(currentSearch);
    localStorage.setItem("buttonArray", JSON.stringify(buttonArray));
});

$(document).on('mousedown', ".search", function() {       //On mousedown (click and hold), set a timer for 1.5 seconds. Delete the item from the array and update the buttons. 
    var locator = $(this).text();                         //WOW, this took a while to figure out. Have to save the value of this.text BEFORE the timeout. Because "this" changes meaning
    timeoutId = setTimeout(function() {                   //when its INSIDE the timeout function. WEW LADS, spend some TIME on this. Works now tho so we're good.
        $("#buttonholder").empty();                       //There is still a bug where a ghost button MIGHT remain after you delete a favorite, but it goes away on refresh. Idk what that is. 
        buttonArray.splice(buttonArray.indexOf(locator), 1); //Not going to work it out.   UPDATE: found it. Line 75.... I feel dumb
        localStorage.setItem("buttonArray", JSON.stringify(buttonArray));   //Update localstorage variable to use in the displayButtons call. 
        displayButtons();
    }, 1500);
}).on('mouseup mouseleave', function() {                    //On mouseup (release the hold), clear the timer and don't delete the item.
    clearTimeout(timeoutId);
});

$(document).on("click", ".search", function () {
    $("#contentholder").empty();
    var searchTerm = $(this).text();
    queryURL = baseURL + searchTerm;
    ajaxCall();
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
