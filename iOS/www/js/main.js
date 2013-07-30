require(["lib/domReady"], function(domReady) {

domReady(function() {
document.addEventListener("deviceready", onDeviceReady, false);

function onDeviceReady() {

    console.log("device ready");
    var requireArray = [
        "controllers/tabBarController",
        "controllers/navigationController",
        "controllers/controller",
        "views/tableView",
        "views/trendsCell",
        "controllers/trendsController",
        "controllers/cameraController",
        "controllers/friendsController",
        "controllers/meController",
        "controllers/locateController",
        "helpers/constants",
        "helpers/serverRequest"
    ];

    require(requireArray, function(TabBarController, NavigationController, Controller, TableView, TrendsCell, TrendsController, CameraController, FriendsController, MeController, LocateController, Constants, ServerRequest) {

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
                start();
            };
            request.onError = function(status, message) {
                alert(status + ":" + message);
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