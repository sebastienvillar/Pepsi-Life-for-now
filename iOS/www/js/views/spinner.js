
define(function() {
var Spinner = function() {
	this.$container = $("<div>", {"id": "floatingBarsG"});
	for (var i = 1; i <= 8; i++) {
		var div = $("<div>", {"id": "rotateG_0" + i});
		div.addClass("blockG");
		div.appendTo(this.$container);
	}
};

return Spinner;
});