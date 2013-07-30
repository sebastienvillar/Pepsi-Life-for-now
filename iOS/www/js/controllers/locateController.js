var requireArray = [
	"controllers/controller"
];

define(requireArray, function(Controller) {
	var LocateController = function() {
		Controller.call(this);

		this.$container.attr("id", "locateController");
		this.$map = $("<div>", {"id": "map"});
		this.$map.appendTo(this.$container);
	};


	LocateController.prototype = new Controller();

	LocateController.prototype.init = function() {
		var mapOptions = {
    		zoom: 8,
    		center: new google.maps.LatLng(-34.397, 150.644),
    		mapTypeId: google.maps.MapTypeId.ROADMAP
  		};
  		var map = new google.maps.Map(this.$map[0], mapOptions);
	};

	return LocateController;
});