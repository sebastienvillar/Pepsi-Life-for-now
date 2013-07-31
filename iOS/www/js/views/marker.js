var requireArray = [
];

define(requireArray, function() {

var Marker = function(position, color, imageUrl) {
	this.position = position;
    this.$marker = $("<div>", {"id": "marker"});
    this.$marker.addClass(color);
    this.$image = $("<div>", {"id": "image"});
    this.$image.appendTo(this.$marker);
    if (imageUrl)
    	this.$image.css("background-image", "url(" + imageUrl + ")");
}

Marker.prototype = new google.maps.OverlayView;
Marker.prototype.onAdd = function() {
	var $pane = $(this.getPanes().overlayImage);
	this.$marker.appendTo($pane);
};

Marker.prototype.onRemove = function() {
	this.$marker.remove();
};

Marker.prototype.draw = function() {
	var projection = this.getProjection();
	var position = projection.fromLatLngToDivPixel(this.position);
	position.x -= 21;
	position.y -= 64;
	this.$marker.css({left: position.x + "px", top: position.y + "px"});
};

return Marker;

});