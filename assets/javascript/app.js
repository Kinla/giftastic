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
    var queryURL = "http://api.giphy.com/v1/gifs/search?q=" + search + "&api_key=" + apikey + "&limit=10";
    console.log(queryURL);
});
