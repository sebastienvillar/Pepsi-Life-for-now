define(function() {
	function Controller() {
		this.$container = $("<div>");
		this.$container.addClass("full-size");
	};

	Controller.prototype = {
		"didAppear": function() {
			console.log("did appear");
		},
		"didDisappear": function() {
			console.log("did disappear");
		}
	}

	return Controller;
});