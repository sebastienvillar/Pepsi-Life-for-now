define(["controllers/controller"], function(Controller) {
function TabBarController(controllers) {
	Controller.call(this);

	this.$container.attr("id", "tabbarController");
	this.childControllers = controllers;
	this.currentChildController = null;
	this.$content = $("<div>", {id: "tabbar-content"});
	this.$container.append(this.$content);
	this.$footer = $("<footer>", {id: "tabbar-footer"});
	this.$container.append(this.$footer);
	this.buttons = [];
	this.buttons.push($("<button>", {id: "tabbar-trends-button", type: "button"}));
	this.buttons.push($("<button>", {id: "tabbar-locate-button", type: "button"}));
	this.buttons.push($("<button>", {id: "tabbar-camera-button", type: "button"}));
	this.buttons.push($("<button>", {id: "tabbar-friends-button", type: "button"}));
	this.buttons.push($("<button>", {id: "tabbar-me-button", type: "button"}));

	//Position the buttons and add listeners
	for (var i in this.buttons) {
		var $button = this.buttons[i];

		//Preload images
		var $preloadDiv = $("<div>", {"id": $button.attr("id") + "-preload"});
		$preloadDiv.appendTo($("body"));
		///////////////

		var $div = $("<div>", {class: "tabbar-stretch"});
		$div.appendTo(this.$footer);
		$button.appendTo($div);
		(function(j) {
			$button.on("tap", function() {
				this.setCurrentChildController(this.childControllers[j]);
			}.bind(this));
		}).bind(this)(i);
	}
	this.setCurrentChildController(this.childControllers[0]);
}

////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////

TabBarController.prototype = new Controller();

TabBarController.prototype.setCurrentChildController = function(childController) {
	if (childController != this.currentChildController) {
		if (this.currentChildController) {
			var index = this.childControllers.indexOf(this.currentChildController);
			this.buttons[index].toggleClass("selected");
			this.currentChildController.$container.remove();
		}
		this.$content.append(childController.$container);
		var index = this.childControllers.indexOf(childController);
		this.buttons[index].toggleClass("selected");
		this.currentChildController = childController;
	}
};

return TabBarController;
});