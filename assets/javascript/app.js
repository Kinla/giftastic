//set up gif list
var topics = ["Star Trek", "Friends", "I Love Lucy", "Game of Thrones", "Stargate SG-1", "Firefly", "Sherlock"];

//ready page
$(document).ready(function(){
    sessionStorage.clear();
    makeBtn();
    $("#google").empty()

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
    var search = $(this).text().trim().split(" ").join("+");
    var name = $(this).text();
    var queryURL = "http://api.giphy.com/v1/gifs/search?q=" + search + "&api_key=" + apikey + "&limit=10&offset=";

    //use session storage to save URL
    sessionStorage.clear();
    sessionStorage.setItem("url", queryURL);

    //adding google knowledge search graph api
    var apikeyGoogle = "AIzaSyDRjr7I7-G47aLjMpSaFl27trUzUNIyYd0"
    var types = "TVSeries"
    var queryURLGoogle = "https://kgsearch.googleapis.com/v1/entities:search?query=" + search + "&key=" + apikeyGoogle + "&types=" + types
    console.log(queryURLGoogle)

    $.ajax({
        url: queryURLGoogle,
        method: "GET"
    })
    .then(function(response) {
        
        var description = response.itemListElement[0].result.detailedDescription.articleBody
        var wikiURL = response.itemListElement[0].result.detailedDescription.url
        var officialSite = response.itemListElement[0].result.url
        console.log(description, wikiURL, officialSite)
        
        //creating the DOM elements
        var jumbotron = $("<div>").addClass("jumbotron mt-2").attr("id", "jumbo");
        var title = $("<h3>").addClass("display-4").text(name);
        var content = $("<p>").addClass("lead").text(description);
        var wiki = $("<a>").addClass("btn btn-warning mr-3").text("Wikipedia Page")
            .attr({
                "href": wikiURL,
                "target": "_blank",
                "role": "button"
            });
        var site = $("<a>").addClass("btn btn-warning").text("Official Website")
        .attr({
            "href": officialSite,
            "target": "_blank",
            "role": "button"
        });

        $("#google").empty()

        $("#google")
        .append(jumbotron
            .append(title)
            .append(content)
            .append(wiki)
        
        )

        if (officialSite){
            $("#jumbo").append(site)
        }

    });

    //reset more value to 10 for the gimme more button
    more = 10;

    //reset div
    $("#gifs").empty();

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
    console.log(giphy);

    for (var i = 0; i < 10; i++){
        var stillGIF = giphy[i].images.fixed_width_still.url;
        var animateGIF = giphy[i].images.fixed_width.url;
        var rating = giphy[i].rating.toUpperCase();
        var title = giphy[i].title.removeWord("GIF").toProperCase();

        var card = $("<div>").addClass("card text-center")
        var img = $("<img>")
            .addClass("card-img-top gif")
            .attr({
                "src": stillGIF,
                "data-still": stillGIF,
                "data-animate": animateGIF,
                "data-state": "still",
            });

        var cardBody = $("<div>").addClass("card-body");
        var showTitle = $("<h5>").addClass("card-title").html(title);
        var download =$("<i>")
            .addClass("fas fa-download mx-1 save text-warning")
            .attr({
                "data-href": animateGIF,
                "data-title": title.split(" ").join("_")
            });
        var favorite = $("<i>")
            .addClass("far fa-heart mx-1 text-warning")
            .attr({
                "data-href": animateGIF,
                "favorite": false,
                "role": "button"
            });
        var gifRating = $("<h6>").addClass("card-subtitle text-muted").text("GIF rating: " + rating);

        $("#gifs")
        .append(card
            .append(img)
            .append(cardBody
                .append(showTitle)
                .append(gifRating)
                .append(favorite)
                .append(download)
            )

        )
    
    }
};



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

//trigger download on click for <a> save
$("body").on("click", ".save", function(){
        var filename = $(this).attr("data-title");
        console.log(filename)
        fetch($(this).attr("data-href"), {
            headers: new Headers({
              'Origin': location.origin
            }),
            mode: 'cors'
          })
          .then(response => response.blob())
          .then(blob => {
            let blobUrl = window.URL.createObjectURL(blob);
            forceDownload(blobUrl, filename);
          })
          .catch(e => console.error(e));      
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