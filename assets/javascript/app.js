var topics = ["Star Trek", "Friends", "I Love Lucy", "Game of Thornes", "Stargate", "Firefly", "Sherlock"];

$(document).ready(function(){
        makeBtn();
});

function makeBtn(){
    $("#gifBtns").empty();
    for (i = 0; i < topics.length; i++){
        $("<button>").attr("id", "topic_" + i).addClass("topic btn btn-warning m-2").text(topics[i]).appendTo($("#gifBtns"));
    };    
};

$("body").on("click", ".topic", function(){
    var apikey = "Ysk8hAo1O9ZJOdm0aKEeWGJeYeP3KT7M";
    var search = $(this).text().trim().replace(" ", "+");
    var limit = 10;
    var queryURL = "http://api.giphy.com/v1/gifs/search?q=" + search + "&api_key=" + apikey + "&limit=" + limit;

    $.ajax({
        url: queryURL,
        method: "GET"
    })
    .then(function(response) {
        var giphy = response.data;
        $("#gifs").empty();

        for (var i = 0; i < limit; i++){
            var stillGIF = giphy[i].images.fixed_width_still.url;
            var animateGIF = giphy[i].images.fixed_width.url;
            var rating = giphy[i].rating;

            var card = $("<div>").addClass("card")
            var img = $("<img>")
            .addClass("card-img-top gif")
            .attr({
                "src": stillGIF,
                "data-still": stillGIF,
                "data-animate": animateGIF,
                "data-state": "still",
            });

            var cardBody = $("<div>").addClass("card-body");
            var gifRating = $("<p>").addClass("card-text text-center").text("GIF rating: " + rating);

            $("#gifs")
            .append(card
                .append(img)
                .append(cardBody
                    .append(gifRating)
                )
            )

        }
    });
    
});

$("body").on("click", ".gif", function(){
    var state = $(this).attr("data-state")

    if (state === "still"){
        $(this).attr("src", $(this).attr("data-animate")).attr("data-state", "animate");
      } else {
        $(this).attr("src", $(this).attr("data-still")).attr("data-state", "still");
      }

});

$("#submit").on("click", function(){
    event.preventDefault();
    
    if ($("#userShow").val() !== ""){
        var show = $("#userShow").val().trim().toProperCase();
        topics.push(show);
    
        makeBtn();
        $("#userShow").val("");

    } else {alert("Enter a TV Show name.")};
});

String.prototype.toProperCase = function() {
    var words = this.split(' ');
    var results = [];
    for (var i=0; i < words.length; i++) {
        var letter = words[i].charAt(0).toUpperCase();
        results.push(letter + words[i].slice(1).toLowerCase());
    }
    return results.join(' ');
  };


