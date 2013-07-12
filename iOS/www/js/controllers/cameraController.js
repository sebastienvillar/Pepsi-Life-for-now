var requireArray = [
	"controllers/controller",
	"views/spinner"
];

define(requireArray, function(Controller, Spinner) {
var CameraController = function() {
	Controller.call(this);

	this.$container.attr("id", "cameraController");
	this.$background = null;
	this.$imageContainer = null;
	this.$image = null;
	this.$spinnerContainer = $("<div>", {"id": "cameraController-spinnerContainer"});
	this.spinner = new Spinner();
	this.spinner.$container.appendTo(this.$spinnerContainer);
	this.$retakeButton = $("<button>", {"id": "cameraController-retakeButton"});
	this.$retakeButton.text("RETAKE");
	this.$retakeButton.on("tap", this.showCamera.bind(this));
};

CameraController.prototype = new Controller();

CameraController.prototype.setBackground = function($background) {
	if (!this.$image) {
		if (this.$background)
		this.$background.remove();
		this.$background = $background;
		this.$background.appendTo(this.$container);
	}
};

CameraController.prototype.removeBackground = function() {
	if (this.$background)
		this.$background.remove();
};

CameraController.prototype.addSpinner = function() {
	this.$spinnerContainer.appendTo(this.$container);
};

CameraController.prototype.removeSpinner = function() {
	this.$spinnerContainer.remove();
};

CameraController.prototype.didAppear = function() {
	if (!this.$image)
		this.showCamera();
};

CameraController.prototype.addImage = function() {
	if (this.$image && this.$imageContainer) {
		this.$image.appendTo(this.$imageContainer);
		this.$imageContainer.appendTo(this.$container);
	}
};

CameraController.prototype.removeImage = function() {
	if (this.$image && this.$imageContainer) {
		this.$image.detach();
		this.$imageContainer.detach();
	}
};

CameraController.prototype.addRetakeButton = function() {
	this.$retakeButton.appendTo(this.$container);
};

CameraController.prototype.removeRetakeButton = function() {
	this.$retakeButton.detach();
};

CameraController.prototype.didDisappear = function() {
};

CameraController.prototype.showCamera = function() {
	var cameraOptions = { 
		destinationType: Camera.DestinationType.DATA_URL,
		sourcetype: Camera.PictureSourceType.CAMERA
	}
	var onCameraSuccess = function(dataURL) {
		this.$imageContainer = $("<div>");
		this.$imageContainer.addClass("cameraController-pictureContainer");

		this.$image = $("<img>");
		this.$image.on("load", function() {
			if (this.$image.width() > this.$image.height()) {
				this.$image.addClass("cameraController-picture-landscape");
				this.$image.css("margin-top", "-" + this.$image.height() / 2 + "px");
			}
			else
				this.$image.addClass("cameraController-picture-portrait");

			this.$image.removeClass("cameraController-picture-preload");
			this.removeSpinner();
		}.bind(this));
		this.$image.attr("src", "data:image/jpeg;base64," + dataURL);
		this.$image.addClass("cameraController-picture-preload")
		this.addImage();
		this.addRetakeButton();
	}.bind(this);

	var onError = function() {
		if (this.timerFired) {
			this.addImage();
			this.addRetakeButton();
			this.removeSpinner();
		}
		else {
			clearTimeout(this.timer);
			if (!this.$image) {
				this.removeBackground();
				this.addRetakeButton();
			}
		}
	}.bind(this);

	this.timerFired = false;
	navigator.camera.getPicture(onCameraSuccess, onError, cameraOptions);

	this.timer = setTimeout(function() {
		this.resetScreen();
		this.addSpinner();
		this.timerFired = true;
	}.bind(this), 1000);
};

CameraController.prototype.resetScreen = function() {
	this.removeBackground();
	this.removeSpinner();
	this.removeImage();
	this.removeRetakeButton();
};

return CameraController;

});

