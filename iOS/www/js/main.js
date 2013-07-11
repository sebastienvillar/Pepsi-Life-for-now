require(["lib/domReady"], function(domReady) {
	// document.ontouchstart = function(e){ 
 //    	e.preventDefault(); 
 //    }

domReady(function() {
	var requireArray = [
		"controllers/tabBarController",
	 	"controllers/navigationController",
	  	"controllers/controller",
	   	"views/tableView",
	    "views/trendsCell",
	    "controllers/trendsController"
	];

	require(requireArray, function(TabBarController, NavigationController, Controller, TableView, TrendsCell, TrendsController) {

		var controllers = [];
		var controller1 = new TrendsController();
		controllers.push(controller1);

		var controller2 = new Controller();
		controllers.push(controller2);
		controller2.$container.css({"position": "absolute", "left": 0, "top": 0, "right": 0, "bottom": 0});
		controller2.$container.css({"background-color": "red"});

		var controller3 = new Controller();
		controllers.push(controller3);
		controller3.$container.css({"position": "absolute", "left": 0, "top": 0, "right": 0, "bottom": 0});
		controller3.$container.css({"background-color": "yellow"});

		var controller4 = new Controller();
		controllers.push(controller4);
		controller4.$container.css({"position": "absolute", "left": 0, "top": 0, "right": 0, "bottom": 0});
		controller4.$container.css({"background-color": "gray"});

		var navigationControllerController1 = new Controller();
		navigationControllerController1.$container.css({"position": "absolute", "left": 0, "top": 0, "right": 0, "bottom": 0});
		navigationControllerController1.$container.css({"background-color": "green"});
		var controller5 = new NavigationController(navigationControllerController1);

		controllers.push(controller5);

		// setTimeout(function() {
			var newController = new Controller();
			newController.$container.css({"position": "absolute", "left": 0, "top": 0, "right": 0, "bottom": 0});
			newController.$container.css({"background-color": "gray"});
		 	controller5.pushController(newController, true);
		// }, 3000)
		// controller5.pushController(controller3, true);

		var tabBarController = new TabBarController(controllers);
		$("body").append(tabBarController.$container);
	});
	//document.addEventListener("deviceready", onDeviceReady, false);
	// controllers = [];
	// for (var i = 0; i < 5; i++) {
	// 	controller = new c();
	// 	controller.$container.css("background-color", "blue");
	// 	navigationController = new n(controller);
	// 	controllers.push(navigationController);
	// }
});



// function onDeviceReady() {
// 	cameraOptions = { 
// 		destinationType: Camera.DestinationType.FILE_URI,
// 		sourcetype: Camera.PictureSourceType.CAMERA
// 	}
// 	navigator.camera.getPicture(onSuccess, onFail, cameraOptions);
// }

// function onSuccess(fileURI) {
// 	$image = $("<img>");
// 	$image.attr("src", fileURI);
// 	$image.css("width", "500%")
// 	$image.css("height", "100%");
// 	$image.css("display", "inline-block");
// 	$image.css("position", "absolute");
// 	$image.css("top", 0);
// 	$image.css("left", 0);
// 	$("body").append($image);

// }

// function onFail(message) {
// 	alert('Please take a picture');
// }

});