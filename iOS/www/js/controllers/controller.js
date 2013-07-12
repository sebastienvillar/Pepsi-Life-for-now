define(function() {
	function Controller() {
		this.$container = $("<div>");
	};
	
	Controller.prototype.didAppear = function(){};

	Controller.prototype.didDisappear = function(){};

	return Controller;
});