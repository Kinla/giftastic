//set up gif list
var topics = ["Star Trek", "Friends", "I Love Lucy", "Game of Thornes", "Stargate", "Firefly", "Sherlock"];

//ready page
$(document).ready(function(){
        makeBtn();
});

//make the buttons from gif list
function makeBtn(){
    $("#gifBtns").empty();
    for (i = 0; i < topics.length; i++){
        $("<button>").attr("id", "topic_" + i).addClass("topic btn btn-warning m-2").text(topics[i]).appendTo($("#gifBtns"));
    };    
};

//let user create new button
$("#submit").on("click", function(){
    event.preventDefault();

    if ($("#userShow").val() !== ""){
        var show = $("#userShow").val().trim().toProperCase();
        topics.push(show);
    
        makeBtn();
        $("#userShow").val("");

    } else {alert("Enter a TV Show name.")};
});

//making sure text display of new button has title casing
String.prototype.toProperCase = function() {
    var words = this.split(' ');
    var results = [];
    for (var i=0; i < words.length; i++) {
        var letter = words[i].charAt(0).toUpperCase();
        results.push(letter + words[i].slice(1).toLowerCase());
    }
    return results.join(' ');
};

//removing GIF and everything after from title
String.prototype.removeWord = function(searchWord){
    var str = this;
    var n = str.search(searchWord);
    while(str.search(searchWord) > -1){
        n = str.search(searchWord);
        str = str.substring(0, n);
    }
    return str.trim();
}

//display GIF when button clicked
$("body").on("click", ".topic", function(){
    var apikey = "Ysk8hAo1O9ZJOdm0aKEeWGJeYeP3KT7M";
    var search = $(this).text().trim().replace(" ", "+");
    var queryURL = "http://api.giphy.com/v1/gifs/search?q=" + search + "&api_key=" + apikey + "&limit=10&offset=";

    //use session storage to save URL
    sessionStorage.clear();
    sessionStorage.setItem("url", queryURL);

    //reset more value in case users wants more
    more = 10;

    //the ajax call
    $.ajax({
        url: queryURL,
        method: "GET"
    })
    .then(function(response) {
        var giphy = response.data;

        for (var i = 0; i < 10; i++){
            var stillGIF = giphy[i].images.fixed_width_still.url;
            var animateGIF = giphy[i].images.fixed_width.url;
            var rating = giphy[i].rating.toUpperCase();
            var title = giphy[i].title.removeWord("GIF").toProperCase();

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
            var showTitle = $("<h5>").addClass("card-title text-center").html(title);
            var dlIcon = $("<i>").addClass("fas fa-download");
            var gifRating = $("<p>").addClass("card-text text-center").text("GIF rating: " + rating);

            $("#gifs")
            .append(card
                .append(img)
                .append(cardBody
                    .append(showTitle)
                    .append(gifRating)
                )
            )

        }
    });
    
});

//toggle still/animate version of GIF
$("body").on("click", ".gif", function(){
    var state = $(this).attr("data-state")

    if (state === "still"){
        $(this).attr("src", $(this).attr("data-animate")).attr("data-state", "animate");
      } else {
        $(this).attr("src", $(this).attr("data-still")).attr("data-state", "still");
      }

});

//Set up button for 10 more gif everytime clicked need to figure out if this can be DRY?
var more = 10;

$("#more").on("click", function(){
    var queryURL = sessionStorage.getItem("url", queryURL) + more;

    $.ajax({
        url: queryURL,
        method: "GET"
    })
    .then(function(response) {
        var giphy = response.data;

        for (var i = 0; i < 10; i++){
            var stillGIF = giphy[i].images.fixed_width_still.url;
            var animateGIF = giphy[i].images.fixed_width.url;
            var rating = giphy[i].rating.toUpperCase();
            var title = giphy[i].title.removeWord("GIF").toProperCase();

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
            var showTitle = $("<h5>").addClass("card-title text-center").html(title);
            var dlIcon = $("<i>").addClass("fas fa-download");
            var gifRating = $("<p>").addClass("card-text text-center").text("GIF rating: " + rating);

            $("#gifs")
            .append(card
                .append(img)
                .append(cardBody
                    .append(showTitle)
                    .append(gifRating)
                )
            )

        }
    });

    //increment by 10 per click
    more += 10;

});

