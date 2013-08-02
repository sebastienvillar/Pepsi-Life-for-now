var requireArray = [
	"helpers/eventEmitter"
];

define(requireArray, function(EventEmitter) {

var Marker = function(position, color, imageUrl) {
	google.maps.OverlayView.call(this);
	EventEmitter.call(this);

	this.position = position;
	this.$container = $("<div>", {"id": "marker"});

	this.$pin = $("<div>", {"id": "pin"});
    this.$pin.addClass(color);
    this.$pin.on("tapone", this._didClick.bind(this));
    this.$pin.appendTo(this.$container);

    this.$image = $("<div>", {"id": "image"});
    this.$image.appendTo(this.$container);
    this.$image.on("tapone", this._didClick.bind(this));
    if (imageUrl)
    	this.$image.css("background-image", "url(" + imageUrl + ")");
}

Marker.prototype = $.extend({}, google.maps.OverlayView.prototype, EventEmitter.prototype, Marker.prototype);
Marker.prototype.onAdd = function() {
	var $pane = $(this.getPanes().overlayImage);
	this.$container.appendTo($pane);
};

Marker.prototype.onRemove = function() {
	this.$container.remove();
};

Marker.prototype.draw = function() {
	var projection = this.getProjection();
	var pixelPosition = projection.fromLatLngToDivPixel(this.position);
	pixelPosition.x = Math.round(pixelPosition.x) - 22;
	pixelPosition.y = Math.round(pixelPosition.y) - 64;
	this.$container.css({left: pixelPosition.x + "px", top: pixelPosition.y + "px"});
};

Marker.prototype.addBubble = function(postsCount, name) {
	if (this.bubble)
		return;
	this.$bubble = $("<div>");
	this.$bubble.addClass("bubble");
	this.$bubbleLeft = $("<div>");
	this.$bubbleLeft.addClass("bubbleLeft");
	this.$bubbleLeft.appendTo(this.$bubble);
	this.$bubbleCenter = $("<div>");
	this.$bubbleCenter.addClass("bubbleCenter");
	this.$bubbleCenter.appendTo(this.$bubble);
	this.$bubbleRight = $("<div>");
	this.$bubbleRight.addClass("bubbleRight");
	this.$bubbleRight.appendTo(this.$bubble);

	this.$row = $("<div>");
	this.$row.addClass("row");
	this.$postsCount = $("<div>");
	this.$postsCount.addClass("postsCount");
	this.$postsCount.text(postsCount);
	this.$postsCount.appendTo(this.$row);
	this.$cameraIcon = $("<div>");
	this.$cameraIcon.appendTo(this.$row);
	this.$cameraIcon.addClass("cameraIcon");
	this.$name = $("<div>");
	this.$name.text(name);
	this.$name.addClass("name");
	this.$name.appendTo(this.$row);
	this.$disclosureArrow = $("<div>");
	this.$disclosureArrow.appendTo(this.$row);
	this.$disclosureArrow.addClass("disclosureArrow");

	this.$row.appendTo(this.$bubble);
	this.$bubble.on("tapone", this._didClickBubble.bind(this));
	this.$bubble.appendTo(this.$container);
}

Marker.prototype.removeBubble = function() {
	if (this.$bubble)
		this.$bubble.remove();
	this.$bubble = null;
}

/////////////////

Marker.prototype._didClick = function() {
	if (this.$bubble)
		return;

	this.trigger("click");
}

Marker.prototype._didClickBubble = function() {
	this.trigger("clickBubble");
}

return Marker;

});