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
        "controllers/meController"
        ];

    require(requireArray, function(TabBarController, NavigationController, Controller, TableView, TrendsCell, TrendsController, CameraController, FriendsController, MeController) {
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
    });
};
});
});