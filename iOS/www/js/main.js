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
            request.path = "/users/";
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
            navigator.geolocation.getCurrentPosition(function(position) {
                window._currentPosition = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
                var request = new ServerRequest();
                request.method = "PUT";
                request.path = "/me/geolocation"
                request.body = JSON.stringify({
                    coordinates: {
                        lat: position.coords.latitude,
                        long: position.coords.longitude
                    }
                });
                request.execute();
            }, null, {enableHighAccuracy: true});
            window.notificationCenter = new EventEmitter();
            var tabBarController = new TabBarController(isNewUser);
            $("body").append(tabBarController.$container);
        }
    });
};
});
});