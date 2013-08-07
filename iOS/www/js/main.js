require(["lib/domReady"], function(domReady) {

domReady(function() {
document.addEventListener("deviceready", onDeviceReady, false);

function onDeviceReady() {
    var requireArray = [
        "controllers/tabBarController",
        "controllers/controller",
        "views/tableView",
        "views/trendsCell",
        "controllers/trendsController",
        "controllers/cameraController",
        "controllers/friendsController",
        "controllers/meController",
        "controllers/locateController",
        "helpers/constants",
        "helpers/serverRequest",
        "helpers/eventEmitter",
    ];

    require(requireArray, function(TabBarController, Controller, TableView, TrendsCell, TrendsController, CameraController, FriendsController, MeController, LocateController, Constants, ServerRequest, EventEmitter) {

        //Get username and password
        // var username = localStorage.getItem("username");
        // var password = localStorage.getItem("password");

        var username = "testuser";
        var password = "testuser";
        if (!username || !password) {
            var request = new ServerRequest();
            request.method = "POST";
            request.path = "/users/";
            request.onSuccess = function(json) {
                console.log("success");
                localStorage.setItem("username", json.username);
                localStorage.setItem("password", json.password);
                Constants.credentials = {
                    username: json.username,
                    password: json.password
                };
                start();
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
            start();
        }

        function start() {
            window.notificationCenter = new EventEmitter();
            var controllers = [];
            var controller1 = new TrendsController();
            controllers.push(controller1);

            var controller2 = new LocateController();
            controllers.push(controller2);

            var controller3 = new CameraController();
            controllers.push(controller3);

            var controller4 = new FriendsController();
            controllers.push(controller4);

            var controller5 = new MeController();
            controllers.push(controller5);

            var tabBarController = new TabBarController(controllers);
            $("body").append(tabBarController.$container);
        }
    });
};
});
});