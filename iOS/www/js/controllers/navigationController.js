define(["controllers/controller"], function(Controller) {
function NavigationController(controller) {
	Controller.call(this);
	this.$container.attr("id", "navigationController");
	this.controllers = [];
	this.controllersBackButtons = []
	this.pushController(controller, false);
}

////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////

NavigationController.prototype = new Controller();

NavigationController.prototype.pushController = function(controller, animated) {
	animated = typeof animated === "undefined" ? true : animated;

	var $controllerContainer = controller.$container;

	if (this.controllers.length > 0) {
		var $backButton = $("<button>", {class: "navigationController-back-button", type: "button"});
		$backButton.on("tap", function() {
			this.popController(animated);
		}.bind(this));
		$controllerContainer.append($backButton);
		this.controllersBackButtons.push($backButton);
	}

	if (animated) {
		$controllerContainer.addClass("navigationController-slidein");
		$controllerContainer.on("webkitAnimationEnd mozAnimationEnd oAnimationEnd animationEnd", function(){
			$controllerContainer.removeClass("navigationController-slidein");
			$controllerContainer.off("webkitAnimationEnd mozAnimationEnd oAnimationEnd animationEnd")
		}); 
	}
	this.$container.append($controllerContainer);
	controller.navigationController = this;
	this.controllers.push(controller);
};

NavigationController.prototype.popController = function(animated) {
	if (this.controllers.length <= 1) {
		return;
	}
	var controller = this.controllers.pop();
	var $controllerContainer = controller.$container;
	var $backButton = this.controllersBackButtons.pop();
	if (animated) {
	 	$controllerContainer.addClass("navigationController-slideout");
	 	$controllerContainer.on("webkitAnimationEnd mozAnimationEnd oAnimationEnd animationEnd", function(){
			$controllerContainer.removeClass("navigationController-slideout");
			$controllerContainer.off("webkitAnimationEnd mozAnimationEnd oAnimationEnd animationEnd");
			$backButton.remove();
			$controllerContainer.remove();
		});
	 }

};

return NavigationController;
});