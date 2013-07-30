define(function() {
	function Controller() {
		this.$container = $("<div>");
	};
	
	Controller.prototype.didAppear = function(){};

	Controller.prototype.didDisappear = function(){};

	Controller.prototype.init = function(){};

	return Controller;
});