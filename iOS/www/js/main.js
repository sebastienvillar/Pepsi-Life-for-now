require(["lib/domReady"], function(domReady) {

domReady(function() {
document.addEventListener("deviceready", onDeviceReady, false);

function onDeviceReady() {
    var requireArray = [
        "controllers/tabBarController",
        "helpers/constants",
        "helpers/serverRequest",
        "helpers/eventEmitter",
    ];

    require(requireArray, function(TabBarController, Constants, ServerRequest, EventEmitter) {

        //Get username and password
        var username = localStorage.getItem("username");
        var password = localStorage.getItem("password");

        if (!username || !password) {
            var request = new ServerRequest();
            request.method = "POST";
            request.path = "users/";
            request.onSuccess = function(json) {
                localStorage.setItem("username", json.username);
                localStorage.setItem("password", json.password);
                Constants.credentials = {
                    username: json.username,
                    password: json.password
                };
                start(true);
            };
            request.onError = function(status, message) {
                alert("Error", "Oups, something bad happened. Please check your internet connection and restart the application.");
            };
            request.execute();
        }
        else {
            Constants.credentials = {
                    username: username,
                    password: password
            };
            start(false);
        }

        function start(isNewUser) {
            window.notificationCenter = new EventEmitter();

            var tabBarController = new TabBarController();

            var request = new ServerRequest();
            request.method = "GET";
            request.path = "ad/";
            request.onSuccess = function(json) {
                var duration = Math.round(json.duration);
                var $ad = $("<div>");
                $ad.addClass("ad");
                var $counterContainer = $("<div>");
                $counterContainer.appendTo($ad);
                var $textContainer = $("<span>");
                $textContainer.appendTo($counterContainer);
                var $text = $("<span>");
                $text.addClass("text");
                $text.text("App in");
                $text.appendTo($textContainer);
                var $counter = $("<span>");
                $counter.addClass("counter");
                $counter.text(duration)
                $counter.appendTo($textContainer);
                var image = new Image;
                image.onload = function() {
                    $ad.css("background-image", "url(" + image.src + ")");
                    $ad.appendTo($("body"));
                    var counter = duration;
                    var interval = setInterval(function() {
                        counter--;
                        $counter.text(counter);
                    }, 1000);
                    setTimeout(function() {
                        $("body").append(tabBarController.$container);
                        $ad.remove();

                        navigator.geolocation.getCurrentPosition(function(position) {
                            window._currentPosition = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
                            var request = new ServerRequest();
                            request.method = "PUT";
                            request.path = "me/geolocation"
                            request.body = JSON.stringify({
                                coordinates: {
                                    lat: position.coords.latitude,
                                    long: position.coords.longitude
                                }
                            });
                            request.execute();
                        }, null, {enableHighAccuracy: true});
                        
                        clearInterval(interval);
                    }, duration * 1000);
                    navigator.splashscreen.hide();
                };
                image.src = json.image_url;
            };

            request.onError = function(status, message) {
                if (status == 404)
                    $("body").append(tabBarController.$container);
                else 
                    alert("Error", "Oups, something bad happened. Please check your internet connection and restart the application.");
                navigator.splashscreen.hide();
            };
            request.execute();

            tabBarController.init(isNewUser);
        }
    });
};
});
});