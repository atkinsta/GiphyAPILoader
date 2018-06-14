var baseURL = "https://api.giphy.com/v1/gifs/search?api_key=BDU3KiPFpEdQOmsEDOWmrTfIrkdzo4Ji&limit=25&offset=0&rating=PG&lang=en&q="

$("#submit").on("click", function() {
    $("#contentholder").empty();
    var searchTerm = $("#searchterm").val();
    var queryURL = baseURL + searchTerm;
    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function (response) {
        console.log(response);
        var data = response.data;
        for (var i = 0; i < 25; i++){
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

$(document).on("mouseover", ".content", function() {
    $(this).attr("src", $(this).attr("data-animated"));
    $(document).on("mouseout", ".content", function() {
        $(this).attr("src", $(this).attr("data-still"));
    });
});