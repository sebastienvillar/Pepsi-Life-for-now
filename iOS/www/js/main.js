require(["lib/domReady"], function(domReady) {
	// document.ontouchstart = function(e){ 
 //    	e.preventDefault(); 
 //    }

domReady(function() {
document.addEventListener("deviceready", onDeviceReady, false);

function onDeviceReady() {
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
        "helpers/constants",
        "helpers/serverRequest"
        ];

    require(requireArray, function(TabBarController, NavigationController, Controller, TableView, TrendsCell, TrendsController, CameraController, FriendsController, MeController, Constants, ServerRequest) {

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

            var controller2 = new Controller();
            controllers.push(controller2);
            controller2.$container.css({"position": "absolute", "left": 0, "top": 0, "right": 0, "bottom": 0});
            controller2.$container.css({"background-color": "red"});

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