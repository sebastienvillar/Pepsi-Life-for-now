define(["controller"], function(Controller) {
	function TabBarController(controllers) {
		Controller.call(this);

		_childControllers = controllers;
		_currentChildController = _childControllers[0];

		_content = $("<div>");
		_content.addClass("full-size");
		this.$container.append(_content);
		_footer = $("<footer>");
		this.$container.append(_footer);

		_buttons = [];
		_buttons.push($("<button>", {id: "trends_button", type: "button"}));
		_buttons.push($("<button>", {id: "locate_button", type: "button"}));
		_buttons.push($("<button>", {id: "camera_button", type: "button"}));
		_buttons.push($("<button>", {id: "friends_button", type: "button"}));
		_buttons.push($("<button>", {id: "me_button", type: "button"}));

		_buttons.forEach(function($b, i) {
			div = $("<div>", {class: "stretch"});
			div.appendTo(_footer);
			$b.appendTo(div)
			$b.on("click", function() {
				if (this != _currentChildController) {
					_currentChildController.$container.remove();
					_currentChildController.didDisappear();
					_currentChildController = _childControllers[i];
					_content.append(_currentChildController.$container);
					_currentChildController.didAppear();
				}
			});
		});

		_content.append(_currentChildController.$container);
	}

	TabBarController.prototype = new Controller();

	return TabBarController;
});