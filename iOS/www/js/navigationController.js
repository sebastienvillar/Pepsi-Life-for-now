define(["controller"], function(Controller) {
	function NavigationController() {
		Controller.call(this);
	}

	NavigationController.prototype = new Controller();
	_prototype = NavigationController.prototype;
	_prototype.pushController = function(controller, animated) {
		animated = typeof animated === "undefined" ? true : animated;
		controller.navigationController = this;
		$childContainer = controller.$container;
		this.$container.append($childContainer);
		if (animated) {
			$childContainer.css({
				"position": "absolute",
				"top": "0",
				"left": "100%"});
			$childContainer.animate({
				"left": 0
			}, 300);
		}

		else {
			$childContainer.css("left", 0);
		}
	};

	return NavigationController;
});