//set up gif list
var topics = ["Star Trek", "Friends", "I Love Lucy", "Game of Thrones", "Stargate SG-1", "Firefly", "Sherlock"];

//ready page
$(document).ready(function(){
    sessionStorage.removeItem("url");

    makeBtn();

    if(sessionStorage.length > 0) {
        sessionFav();
    };

});

//make the buttons from gif list
function makeBtn(){
    $("#gifBtns").empty();
    for (i = 0; i < topics.length; i++){
        $("<button>").addClass("topic btn btn-warning m-2").text(topics[i]).appendTo($("#gifBtns"));
    };    
};

//fill fav section with sessionStorage info
function sessionFav(){
    var count = sessionStorage.getItem("count")

    for (var i = 0; i < count ; i++){
        if (sessionStorage.getItem( "fav-" + i) !== null) {
            var favStr = sessionStorage.getItem( "fav-" + i);
            var favObj = JSON.parse(favStr);

            var still = favObj.still;
            var animate = favObj.animate;

            var div = $("<div>")
                .addClass("card").addClass("mb-2");
            var img = $("<img>")
                .addClass("gif card-image favImg")
                .attr({
                    "src": still,
                    "data-still": still,
                    "data-animate": animate,
                    "data-state": "still",
                });

            var overlay =  $("<div>").addClass("card-img-overlay p-2 text-right overlay");
            
            var favorite = $("<a>")
            .addClass("fas fa-heart mx-1 text-warning heartFull")
            .attr({
                "role": "button",
                "data-fav": i
            });
    
    
            $("#favs")
            .append(div
                .append(img)
                .append(overlay
                    .append(favorite)
                )
    
            );
        };


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

        var newBTN = $(this).parent().parent().find(".topic").last();
        newBTN.click();
        
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

//removing the string "GIF" and everything after from title
String.prototype.removeWord = function(searchWord){
    var str = this;
    var n = str.search(searchWord);
    while(str.search(searchWord) > -1){
        n = str.search(searchWord);
        str = str.substring(0, n);
    }
    return str.trim();
}

//display API results when button clicked
$("body").on("click", ".topic", function(){

    //parameters for giphy + other APIs
    var apikey = "Ysk8hAo1O9ZJOdm0aKEeWGJeYeP3KT7M";
    var search = $(this).text().trim().split(" ").join("+");
    var name = $(this).text();
    var queryURL = "https://api.giphy.com/v1/gifs/search?q=" + search + "&api_key=" + apikey + "&limit=10&offset=";

    //use session storage to save URL
    sessionStorage.removeItem("url");
    sessionStorage.setItem("url", queryURL);

    //reset more value to 10 for the gimme more button
    more = 10;

    //reset div
    $("#gifs").empty();

    //tryig OMDB again
    var apikeyOMDB = "3182e777";
    var queryURLOMDB = "https://www.omdbapi.com/?t=" + search + "&apikey=" + apikeyOMDB + "&plot=short&type=series";

    $.ajax({
        url: queryURLOMDB,
        method: "GET"
    })
    .then(function(response) {

        var description = response.Plot;
        var actors = response.Actors;
        var rating = response.imdbRating;
        var genre = response.Genre;
        var year = response.Year;
        var rated = response.Rated;
        var imdbID = response.imdbID;
        var imdbURL = "https://www.imdb.com/title/" + imdbID;

        if (response.Response === "True"){
            //creating the DOM elements
            var jumbotron = $("<div>").addClass("jumbotron mt-2").attr({"id": "jumbo", "response": response.Response});
            var title = $("<h1>").addClass("display-4").text(name);
            var meta = $("<p>").text(rated + " | " + genre + " | TV Series (" + year + ") | IMDB Rating " + rating);
            var star = $("<p>").attr("id", "star").text("Staring: " + actors);
            var content = $("<p>").addClass("lead").text(description);
            var imdb = $("<a>").addClass("btn btn-warning mt-2").text("More on IMDB")
                .attr({
                    "href": imdbURL,
                    "target": "_blank",
                    "role": "button"
                });
    
            $("#omdb").empty();
    
            $("#omdb")
            .append(jumbotron
                .append(title)
                .append(meta)
                .append(content)
                .append(star)
                .append(imdb)      
            );
        } else {
            var jumbotron = $("<div>").addClass("jumbotron mt-2").attr({"id": "jumbo", "response": response.Response});
            var title = $("<h1>").addClass("display-4").text("Oops! This is not a TV show!");
            var content = $("<p>").addClass("lead").html("Sorry, no customized button for you. Perhaps you will still find some fun GIFs?");

            $("#omdb").empty();
    
            $("#omdb")
            .append(jumbotron
                .append(title)
                .append(content)
            );

            //delete from array + button
            topics.pop();
            makeBtn();

        }
    });
    
    //adding google knowledge search graph api
    var apikeyGoogle = "AIzaSyDRjr7I7-G47aLjMpSaFl27trUzUNIyYd0";
    var types = "TVSeries";
    var queryURLGoogle = "https://kgsearch.googleapis.com/v1/entities:search?query=" + search + "&key=" + apikeyGoogle + "&types=" + types;

    $.ajax({
        url: queryURLGoogle,
        method: "GET"
    })
    .then(function(response) {

        var officialSite = response.itemListElement[0].result.url
        if ($("#jumbo").attr("response") === "True"){
            //creating the DOM elements
            var site = $("<a>").addClass("btn btn-warning mt-2 mr-3").text("Official Website")
            .attr({
                "href": officialSite,
                "target": "_blank",
                "role": "button"
            });
    
    
            if (officialSite){
                site.insertAfter("#star")
            };


        } else {};

    });
    
    //the ajax call for giphy
    $.ajax({
        url: queryURL,
        method: "GET"
    })
    .then(function(response) {
        giphyJsonDisplay(response);
    });

});


//function to get and display stuff from Giphy
function giphyJsonDisplay(response){
    var giphy = response.data;

    for (var i = 0; i < 10; i++){
        var stillGIF = giphy[i].images.fixed_width_still.url;
        var animateGIF = giphy[i].images.fixed_width.url;
        var rating = giphy[i].rating.toUpperCase();
        var title = giphy[i].title.removeWord("GIF").toProperCase();

        var card = $("<div>").addClass("card text-center");
        var img = $("<img>")
            .addClass("card-img-top gif")
            .attr({
                "src": stillGIF,
                "data-still": stillGIF,
                "data-animate": animateGIF,
                "data-state": "still",
            });
        var overlay =  $("<div>").addClass("card-img-overlay p-2 text-right overlay");
        var cardBody = $("<div>").addClass("card-body");
        var showTitle = $("<h5>").addClass("card-title").html(title);
        var download =$("<a>")
            .addClass("fas fa-download mx-1 save text-warning")
            .attr({
                "data-href": animateGIF,
                "data-title": title.split(" ").join("_"),
                "role": "button"
            });
        var favorite = $("<a>")
            .addClass("far fa-heart mx-1 text-warning favorite")
            .attr({
                "role": "button"
            });
        var gifRating = $("<h6>").addClass("card-subtitle text-muted").text("GIF rating: " + rating);

        $("#gifs")
        .prepend(card
            .append(img)
            .append(overlay
                .append(favorite)
                .append(download)
            )
            .append(cardBody
                .append(showTitle)
                .append(gifRating)
                )

        );
    
    };
};

//toggle still/animate version of GIF
$("body").on("click", ".overlay", function(){
    var parent = $(this).parent();
    var gif = parent.find(".gif");
    var state = gif.attr("data-state");

    if (state === "still"){
        gif.attr("src", gif.attr("data-animate")).attr("data-state", "animate");
      } else {
        gif.attr("src", gif.attr("data-still")).attr("data-state", "still");
      };

});

//Set up for 10 more gif
var more = 10;

//click event to call for 10 more gifs
$("#more").on("click", function(){
    var queryURL = sessionStorage.getItem("url") + more;

    $.ajax({
        url: queryURL,
        method: "GET"
    })
    .then(function(response) {
        giphyJsonDisplay(response);
    });
    //increment by 10 per click
    more += 10;

});

//trigger download on click for .save
$("body").on("click", ".save", function(event){
    event.stopPropagation();
    var filename = $(this).attr("data-title");
    fetch($(this).attr("data-href"), {
        headers: new Headers({
            'Origin': location.origin
        }),
        mode: 'cors'
        })
        .then(function(response) { return response.blob() })
        .then(function(blob) {
        var blobUrl = window.URL.createObjectURL(blob);
        forceDownload(blobUrl, filename);
        })
        .catch(function(e) { return console.error(e) });   
});

//set up forceDownload function
function forceDownload(blob, filename) {
    var a = document.createElement('a');
    a.download = filename;
    a.href = blob;
    document.body.appendChild(a);
    a.click();
    a.remove();
  }

//set fav counter
var favIdCount = 0;

//saving to favorite on click .favorite
$("body").on("click", ".favorite", function(event){
    event.stopPropagation();
    var gif = $(this).parent().parent().find(".gif");

    if (sessionStorage.getItem("count")){
        favIdCount = sessionStorage.getItem("count");
    } else {
        favIdCount = 0;
    };

    if ($(this).hasClass("fas") === false){
        //change to solid heart
        $(this).removeClass("far")
            .addClass("fas")
            .attr({
                "data-fav": favIdCount,
                "id": "heart-" + favIdCount 
            });

        //get the 2 URLs
        var still = gif.attr("data-still");
        var animate = gif.attr("data-animate");

        //Create object for sessionStorage
        var favGIF = {
            "still": still,
            "animate": animate
        };

        var favGIFStr = JSON.stringify(favGIF);
        sessionStorage.setItem("fav-" + favIdCount, favGIFStr);

        //Set the DOM elements
        var div = $("<div>")
            .addClass("card").addClass("mb-2").attr("id", "favID-" + favIdCount);
        var img = $("<img>")
            .addClass("gif card-image favImg")
            .attr({
                "src": still,
                "data-still": still,
                "data-animate": animate,
                "data-state": "still"
            });

        var overlay =  $("<div>").addClass("card-img-overlay p-2 text-right overlay");

        var favorite = $("<a>")
        .addClass("fas fa-heart mx-1 text-warning heartFull")
        .attr({
            "role": "button",
            "data-fav": favIdCount
        });


        $("#favs")
        .append(div
            .append(img)
            .append(overlay
                .append(favorite)
            )

        );
    
        
    } else {
        $(this).removeClass("fas").addClass("far");
        var count = $(this).attr("data-fav")
        $("#favID-" + count).remove();

        sessionStorage.removeItem("fav-" + count);

    }

    favIdCount++;

    // favIdCount in session storage
    sessionStorage.setItem("count", favIdCount);

});

//remove favorite from favorite list
$("body").on("click", ".heartFull", function(){
    $(this).parent().parent().remove();
    var count = $(this).attr("data-fav");
    $("#heart-" + count).removeClass("fas").addClass("far");
    
    sessionStorage.removeItem("fav-" + count);
});
