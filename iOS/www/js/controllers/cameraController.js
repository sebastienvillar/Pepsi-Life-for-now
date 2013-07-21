var requireArray = [
	"controllers/controller",
	"views/spinner",
	"helpers/serverRequest"
];

define(requireArray, function(Controller, Spinner, ServerRequest) {
var CameraController = function() {
	Controller.call(this);

	this.$container.attr("id", "cameraController");
	this.$mainContainer = $("<div>", {"id": "mainContainer"});
	this.$mainContainer.appendTo(this.$container);
	this.$background = null;
	this.firstLaunch = true;
	this.photoWasTaken = false;
	this.applyingFilter = false;

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
	}

	this.filters.push({
		effect: "desaturate",
		value: {average: false}
	});

	this.filters.push({
		effect: "coloradjust",
		value: {red:0.4,green:0,blue:0.10}
	});

	this.filters.push({});

	this.filters.push({
		effect: "coloradjust",
		value: {red:0.10,green:0,blue:0.4}
	});

	this.filters.push({
		effect: "glow",
		value: {amount:0.63,radius:0.57}
	})
};

CameraController.prototype = new Controller();

CameraController.prototype.setBackground = function($background) {
	this.$background = $background;
};

CameraController.prototype.removeBackground = function() {
	if (this.$background)
		this.$background.detach();
	this.$background = null
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
		this.clearMainContainer();
		var image = new Image();

		this.$mainCanvasContainer = $("<div>");
		this.$mainCanvasContainer.addClass("mainCanvasContainer");
		this.$mainCanvasContainer.appendTo(this.$mainContainer);
		this.$mainCanvas = $("<canvas>");
		this.$mainCanvas.attr("width", this.$mainCanvasContainer.width());
		this.$mainCanvas.attr("height", this.$mainCanvasContainer.height());
		this.$mainCanvas.appendTo(this.$mainCanvasContainer);
		this.$mainCanvas.css("opacity", "0");

		image.onload = function() {
			this.fillCanvas(this.$mainCanvas, image, false);
			this.$originalMainCanvas = null;
			this.$filtersBar.css("opacity", "0");
			this.$filtersBar.appendTo(this.$mainContainer);

			//Show when everything's loaded
			var pixasticCallback = function() {
				pixasticCallback._currentCount += 1;
				if (pixasticCallback._currentCount == this.filters.length - 1) {
					this.$mainCanvas.css("opacity", "1");
					this.$filtersBar.css("opacity", "1");

					this.$retakeButton = $("<button>");
					this.$retakeButton.addClass("whiteButton");
					this.$retakeButton.text("RETAKE");
					this.$retakeButton.on("tap", this.showCamera.bind(this));
					this.$retakeButton.appendTo(this.$mainContainer);

					this.$nextButton = $("<button>");
					this.$nextButton.addClass("redButton");
					this.$nextButton.text("NEXT");
					this.$nextButton.on("tap", this.showTextArea.bind(this));
					this.$nextButton.appendTo(this.$mainContainer);

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

				if (i != 2) {
					var filter = this.filters[i];
					var filterCopy = $.extend(true, {}, filter);
					Pixastic.process($canvas[0], filterCopy.effect, filterCopy.value, pixasticCallback);
				}
			}
		}.bind(this);
		image.src = fileURI;

	}.bind(this);

	var onError = function() {
		clearTimeout(this.timer);
		this.clearMainContainer();
		if (!this.photoWasTaken) {
			//Create a new canvas and add retake button
			this.$mainCanvasContainer = $("<div>");
			this.$mainCanvasContainer.addClass("mainCanvasContainer");
			this.$retakeButton = $("<button>");
			this.$retakeButton.addClass("whiteButton");
			this.$retakeButton.text("RETAKE");
			this.$retakeButton.appendTo(this.$mainContainer);
			this.$retakeButton.on("tap", this.showCamera.bind(this));
		}

		else 
			this.$filtersBar.appendTo(this.$mainContainer);
		this.$mainCanvasContainer.insertBefore(this.$retakeButton);
		if (this.$spinnerContainer)
			this.$spinnerContainer.detach();
	}.bind(this);

	navigator.camera.getPicture(onCameraSuccess, onError, cameraOptions);

	this.timer = setTimeout(function() {
		this.clearMainContainer();

		//Show spinner
		this.$spinnerContainer = $("<div>");
		this.$spinnerContainer.addClass("spinnerContainer");
		this.spinner = new Spinner();
		this.spinner.$container.appendTo(this.$spinnerContainer);
		this.$spinnerContainer.appendTo(this.$mainContainer);
	}.bind(this), 700);
};

CameraController.prototype.clearMainContainer = function() {
	this.removeBackground();
	this.$filtersBar.detach();
	if (this.$mainCanvasContainer)
		this.$mainCanvasContainer.detach();
	
	this.$mainContainer.addClass("grayBackground");
};

CameraController.prototype.showTextArea = function() {
};

CameraController.prototype.didSelectFilter = function(i) {
	if (!this.photoWasTaken || this.applyingFilter)
		return;

	if (!this.$originalMainCanvas) {
		this.$originalMainCanvas = this.$mainCanvas;
	}

	this.$mainCanvas.remove();
	this.$mainCanvas = this.$originalMainCanvas;
	this.$mainCanvas.appendTo(this.$mainCanvasContainer);
	
	// var dataURL = this.$mainCanvas[0].toDataURL();
	// var request = new ServerRequest();
	// request.method = "POST";
	// request.path = "images/";
	// request.jsonHeader = false;
	// request.body = dataURL;
	// request.onSuccess = function(json) {
	// 	console.log(json.image_url);
	// };
	// request.execute();
	// var $spinnerContainer = $("<div>");
	// $spinnerContainer.addClass("spinnerContainer");
	// var spinner = new Spinner();
	// spinner.$container.appendTo($spinnerContainer);
	// $spinnerContainer.appendTo(this.$mainCanvasContainer);

	if (i != 2) {
		var filter = this.filters[i];
		var filterCopy = $.extend(true, {}, filter);
		this.applyingFilter = true;
		Pixastic.process(this.$mainCanvas[0], filterCopy.effect, filterCopy.value, function(newCanvas) {
			this.$mainCanvas = $(newCanvas);
			//$spinnerContainer.remove();
			this.applyingFilter = false;
		}.bind(this));
	}
};

return CameraController;

});

