var requireArray = [
	"controllers/controller",
    "helpers/serverRequest",
    "views/marker"
];

define(requireArray, function(Controller, ServerRequest, Marker) {
var LocateController = function() {
	Controller.call(this);

	this.$container.attr("id", "locateController");
	this.$map = $("<div>", {"id": "map"});
	this.$map.appendTo(this.$container);
    this.currentPositionMVC = new google.maps.MVCObject();
    this.currentPositionMVC.set("position", new google.maps.LatLng(-21.115141, 55.536384));
    this.markers = [];
    navigator.geolocation.getCurrentPosition(this._didUpdatePosition.bind(this), this._didFailToUpdatePosition.bind(this), null);
};


LocateController.prototype = new Controller();

LocateController.prototype.init = function() {
    var mapOptions = {
        zoom: 8,
        center: this.currentPositionMVC.get("position"),
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        disableDefaultUI: true,
        maxZoom: 12,
        minZoom: 4
    };

    this.map = new google.maps.Map(this.$map[0], mapOptions);

    var currentPositionMarker = new google.maps.Marker({
        position: mapOptions.center,
        map: this.map,
        icon: "img/map/pin-current-position.png"
    });

    currentPositionMarker.bindTo("position", this.currentPositionMVC);

    google.maps.event.addListener(this.map, 'bounds_changed', this._didChangeBounds.bind(this));
};

///////////////
// Private
//////////////

LocateController.prototype._didUpdatePosition = function(position) {
    this.currentPositionMVC.set("position", new google.maps.LatLng(position.coords.latitude, position.coords.longitude));
};

LocateController.prototype._didFailToUpdatePosition = function(position) {
    alert("Fail to get your position");
};

LocateController.prototype._didChangeBounds = function() {
    var bounds = this.map.getBounds();
    var ne = bounds.getNorthEast();
    var sw = bounds.getSouthWest();

    var request = new ServerRequest();
    request.method = "GET";
    request.path = "users/";
    request.queryParameters["from_lat"] = sw.lat();
    request.queryParameters["to_lat"] = ne.lat();
    request.queryParameters["from_long"] = sw.lng();
    request.queryParameters["to_long"] = ne.lng();

    request.onSuccess = function(json) {
        for (var i in this.markers)
            this.markers[i].setMap(null);

        var users = json.users;
        for (var i in users) {
            var user = users[i];
            var coordinate = user.coordinate;
            var marker = new Marker(new google.maps.LatLng(coordinate.latitude, coordinate.longitude), "yellow");
            marker.setMap(this.map);
            this.markers.push(marker);
        }
    }.bind(this);
    request.onError = function(statusCode, message) {
        alert("Error in LocateController get users request: " + statusCode + ": " + message);
    }.bind(this);
    request.execute();
};

return LocateController;
});