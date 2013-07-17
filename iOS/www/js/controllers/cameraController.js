var requireArray = [
	"controllers/controller",
	"views/spinner"
];

define(requireArray, function(Controller, Spinner) {
var CameraController = function() {
	Controller.call(this);

	this.$container.attr("id", "cameraController");
	this.$background = null;
	this.firstLaunch = true;
	this.photoWasTaken = false;

	this.filters = [];
	this.filterCanvasContainers = [];

	this.$filtersBar = $("<div>", {"id": "filtersBar"});

	for (var i = 0; i < 5; i++) {
		var $filterCanvasContainer = $("<button>");
		$filterCanvasContainer.addClass("filterCanvasContainer");
		$filterCanvasContainer.appendTo(this.$filtersBar);
		if (i == 0)
			$filterCanvasContainer.addClass("extremeLeft");
		else if (i == 4)
			$filterCanvasContainer.addClass("extremeRight");
		$filterCanvasContainer.on("tap", this.didSelectFilter.bind(this, i));
		this.filterCanvasContainers.push($filterCanvasContainer);
		this.filters.push({
			effect: "coloradjust",
			value: {red:0.5,green:0,blue:0}
		});
	}
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

CameraController.prototype.didAppear = function() {
	if (this.firstLaunch) {
		this.showCamera();
		this.firstLaunch = false;
	}
};

CameraController.prototype.didDisappear = function() {
};

CameraController.prototype.fillCanvas = function($canvas, image, cut) {
	var widthRatio = image.width / $canvas.width();
	var heightRatio = image.height / $canvas.height();
	if (cut) 
		var ratio = widthRatio < heightRatio ? widthRatio : heightRatio;
	else 
		var ratio = widthRatio > heightRatio ? widthRatio : heightRatio;

	var xOffset = ($canvas.width() - (image.width / ratio)) / 2;
	var yOffset = ($canvas.height() - (image.height / ratio)) / 2;

	var context = $canvas[0].getContext("2d");
	context.drawImage(image, xOffset, yOffset, image.width / ratio, image.height / ratio);
};

CameraController.prototype.showCamera = function() {
	var cameraOptions = { 
		destinationType: Camera.DestinationType.FILE_URI,
		sourcetype: Camera.PictureSourceType.CAMERA,
		targetWidth: 1000,
		targetHeight: 1000
	}
	var onCameraSuccess = function(fileURI) {
		clearTimeout(this.timer);
		var image = new Image();

		this.$mainCanvasContainer = $("<div>");
		this.$mainCanvasContainer.addClass("mainCanvasContainer");
		this.$mainCanvasContainer.appendTo(this.$container);
		this.$mainCanvas = $("<canvas>");
		this.$mainCanvas.attr("width", this.$mainCanvasContainer.width());
		this.$mainCanvas.attr("height", this.$mainCanvasContainer.height());
		this.$mainCanvas.appendTo(this.$mainCanvasContainer);
		this.$mainCanvas.css("opacity", "0");

		image.onload = function() {
			this.fillCanvas(this.$mainCanvas, image, false);
			this.$originalMainCanvas = null;
			this.$filtersBar.css("opacity", "0");
			this.$filtersBar.appendTo(this.$container);

			//Show when everything's loaded
			var pixasticCallback = function() {
				pixasticCallback._currentCount += 1;
				if (pixasticCallback._currentCount == this.filterCanvasContainers.length) {
					this.$mainCanvas.css("opacity", "1");
					this.$filtersBar.css("opacity", "1");
					this.$retakeButton = $("<button>");
					this.$retakeButton.addClass("retakeButton");
					this.$retakeButton.text("RETAKE");
					this.$retakeButton.on("tap", this.showCamera.bind(this));
					this.$retakeButton.appendTo(this.$mainCanvasContainer);
					if (this.$spinnerContainer)
						this.$spinnerContainer.remove();
					this.photoWasTaken = true;
				}
					
			}.bind(this);
			pixasticCallback._currentCount = 0;

			//Add filters
			for (var i in this.filterCanvasContainers) {
				var $container = this.filterCanvasContainers[i];
				//Remove old canvas
				$container.empty();

				var $canvas = $("<canvas>");
				$canvas.appendTo($container);
				$canvas.attr("width", $container.width());
				$canvas.attr("height", $container.height());
				this.fillCanvas($canvas, image, true);
				Pixastic.process($canvas[0], "coloradjust", {red:0.5,green:0,blue:0}, pixasticCallback);
			}
		}.bind(this);
		image.src = fileURI;

	}.bind(this);

	var onError = function() {
		clearTimeout(this.timer);
		var $newMainCanvasContainer = null;
		if (!this.photoWasTaken) {
			//Create a new canvas and add retake button
			this.$mainCanvasContainer = $("<div>");
			this.$mainCanvasContainer.addClass("mainCanvasContainer");
			this.$retakeButton = $("<button>");
			this.$retakeButton.addClass("retakeButton");
			this.$retakeButton.text("RETAKE");
			this.$retakeButton.appendTo(this.$mainCanvasContainer);
		}
		this.$filtersBar.detach();
		this.$container.empty();
		this.$retakeButton.on("tap", this.showCamera.bind(this));
		this.$mainCanvasContainer.appendTo(this.$container);
		if (this.photoWasTaken)
			this.$filtersBar.appendTo(this.$container);
	}.bind(this);

	navigator.camera.getPicture(onCameraSuccess, onError, cameraOptions);

	this.timer = setTimeout(function() {
		//Detach filters bar to avoid handlers deletion
		this.$filtersBar.detach();

		//Remove background, main canvas
		this.$container.empty();

		//Reattach handler
		if (this.$retakeButton)
			this.$retakeButton.on("tap", this.showCamera.bind(this));

		//Show spinner
		this.$spinnerContainer = $("<div>");
		this.$spinnerContainer.addClass("spinnerContainer");
		this.spinner = new Spinner();
		this.spinner.$container.appendTo(this.$spinnerContainer);
		this.$spinnerContainer.appendTo(this.$container);

	}.bind(this), 4000);
};

CameraController.prototype.didSelectFilter = function(i) {
	console.log("start");
	if (!this.photoWasTaken)
		return;

	console.log("after photo");
	if (!this.$originalMainCanvas) {
		console.log("in original");
		this.$originalMainCanvas = this.$mainCanvas;
	}
	console.log("after original");
	var filter = this.filters[i];

	var $spinnerContainer = $("<div>");
	$spinnerContainer.addClass("spinnerContainer");
	var spinner = new Spinner();
	spinner.$container.appendTo($spinnerContainer);
	$spinnerContainer.appendTo(this.$mainCanvasContainer);
	Pixastic.process(this.$originalMainCanvas[0], filter.effect, filter.value, function() {
		$spinnerContainer.remove();
	});
	console.log("after process");
};

return CameraController;

});

