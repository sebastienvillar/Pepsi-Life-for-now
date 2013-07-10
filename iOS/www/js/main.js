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

		// var tableView = new TableView();
		// tableView.setBackgroundColor("#124c8f");

		// controller1.$container.append(tableView.$container);
		// tableView.setCellsSpacing("8px");

		// for (var i = 0; i < 6; i++) {
		// 	var cell = new TrendsCell();
		// 	cell.setLikesCount(34);
		// 	cell.setCommentsCount(57);
		// 	cell.setUsername("Sebastien");
		// 	cell.setDate(new Date());
		// 	cell.setText("Donec at commodo erat, sit amet cursus ligula. Quisque dictum risus ante, vel venenatis libero malesuada a. Duis congue turpis quis nisi rhoncus tincidunt.");
		// 	cell.setTags(["#tag1", "#tag2", "#tag3"]);
		// 	tableView.pushCell(cell);
		// }

		var controller2 = new Controller();
		controllers.push(controller2);
		controller2.$container.addClass("full-size");
		controller2.$container.css({"background-color": "red"});

		var controller3 = new Controller();
		controllers.push(controller3);
		controller3.$container.addClass("full-size");
		controller3.$container.css({"background-color": "yellow"});

		var controller4 = new Controller();
		controllers.push(controller4);
		controller4.$container.addClass("full-size");
		controller4.$container.css({"background-color": "gray"});

		var controller5 = new NavigationController(controller1);

		controllers.push(controller5);
		setTimeout(function() {
			controller5.pushController(controller2, true);
		}, 3000)
		controller5.pushController(controller3, true);

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