
define(function() {
var Spinner = function() {
	this.$container = $("<div>", {"id": "floatingBarsG"});
	for (var i = 1; i <= 8; i++) {
		var div = $("<div>", {"id": "rotateG_0" + i});
		div.addClass("blockG");
		div.appendTo(this.$container);
	}
	// this.$container.html("<div id="floatingBarsG">\
	// 	<div class="blockG" id="rotateG_01">\
	// 	</div>\
	// 	<div class="blockG" id="rotateG_02">\
	// 	</div>\
	// 	<div class="blockG" id="rotateG_03">\
	// 	</div>\
	// 	<div class="blockG" id="rotateG_04">\
	// 	</div>\
	// 	<div class="blockG" id="rotateG_05">\
	// 	</div>\
	// 	<div class="blockG" id="rotateG_06">\
	// 	</div>\
	// 	<div class="blockG" id="rotateG_07">\
	// 	</div>\
	// 	<div class="blockG" id="rotateG_08">\
	// 	</div>\
	// 	</div>");
};

return Spinner;
});