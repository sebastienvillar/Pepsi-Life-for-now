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
	this.$originalCanvas = $("<canvas>");
	this.$background = null;
	this.firstLaunch = true;
	this.photoWasTaken = false;
	this.applyingFilter = false;
	this.appliedFilterIndex = 2;

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

	this.filters.push([
		{
			effect: "desaturate",
			value: {average: false}
		}
	]);

	this.filters.push([
		{
			effect: "sharpen",
			value: {amount: 0.7}
		},
		{
			effect: "brightness",
			value: {brightness:40, contrast:0.7}
		}
	]);

	this.filters.push([]);

	this.filters.push([
		{
			effect: "glow",
			value: {amount:0.5, radius:1.0}
		},
		{
			effect: "coloradjust",
			value: {red:0, green:0, blue:0.6}
		}
	]);

	this.filters.push([
		{
			effect: "hsl",
			value: {hue:180, saturation:25, lightness:0}
		},
		{
			effect: "coloradjust",
			value: {red:0.5, green:0, blue:0}
		}
	]);
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

CameraController.prototype.showCamera = function(event) {
	if (event)
		event.preventDefault();
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

		this.$mainContainer.empty();
		this.$mainCanvasContainer = $("<div>");
		this.$mainCanvasContainer.addClass("mainCanvasContainer");
		this.$mainCanvasContainer.appendTo(this.$mainContainer);
		this.$mainCanvas = $("<canvas>");
		this.$mainCanvas.attr("width", this.$mainCanvasContainer.width());
		this.$mainCanvas.attr("height", this.$mainCanvasContainer.height());
		this.$mainCanvas.appendTo(this.$mainCanvasContainer);
		this.$mainCanvas.css("opacity", "0");

		image.onload = function() {
			this.$originalCanvas.attr("width", image.width);
			this.$originalCanvas.attr("height", image.height);
			this.$originalCanvas.css({"width": image.width, "height": image.height});
			this.fillCanvas(this.$originalCanvas, image, false);
			this.fillCanvas(this.$mainCanvas, image, false);
			this.$originalMainCanvas = null;
			this.$filtersBar.css("opacity", "0");
			this.$filtersBar.appendTo(this.$mainContainer);

			//Show when everything's loaded
			var pixasticCallback = function() {
				pixasticCallback._currentCount += 1;
				if (pixasticCallback._currentCount == this.filters.length) {
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

					if (this.spinner)
						this.spinner.$container.remove();
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
				$canvas.attr("width", $container.width());
				$canvas.attr("height", $container.height());
				$canvas.appendTo($container);
				this.fillCanvas($canvas, image, true);

				var filters = this.filters[i];
				this.applyFilters($canvas, filters);
				pixasticCallback();
			}
		}.bind(this);
		image.src = fileURI;

	}.bind(this);

	var onError = function() {
		clearTimeout(this.timer);
		this.clearMainContainer();

		this.$retakeButton = $("<button>");
		this.$retakeButton.addClass("whiteButton");
		this.$retakeButton.text("RETAKE");
		this.$retakeButton.appendTo(this.$mainContainer);
		this.$retakeButton.on("tap", this.showCamera.bind(this));

		if (!this.photoWasTaken) {
			//Create a new canvas and add retake button
			this.$mainCanvasContainer = $("<div>");
			this.$mainCanvasContainer.addClass("mainCanvasContainer");
		}

		else {
			this.$filtersBar.appendTo(this.$mainContainer);
			this.$nextButton = $("<button>");
			this.$nextButton.addClass("redButton");
			this.$nextButton.text("NEXT");
			this.$nextButton.on("tap", this.showTextArea.bind(this));
			this.$nextButton.appendTo(this.$mainContainer);
		}

		this.$mainCanvasContainer.insertBefore(this.$retakeButton);
		if (this.spinner)
			this.spinner.$container.remove();
	}.bind(this);

	navigator.camera.getPicture(onCameraSuccess, onError, cameraOptions);

	this.timer = setTimeout(function() {
		this.clearMainContainer();

		//Show spinner
		this.spinner = new Spinner();
		this.spinner.$container.addClass("spinner");
		this.spinner.$container.appendTo(this.$mainContainer);
	}.bind(this), 700);
};

CameraController.prototype.clearMainContainer = function() {
	this.removeBackground();
	this.$filtersBar.detach();
	if (this.$mainCanvasContainer)
		this.$mainCanvasContainer.detach();
	if (this.$retakeButton)
		this.$retakeButton.remove();
	if (this.$nextButton)
		this.$nextButton.remove();
};

CameraController.prototype.showTextArea = function(event) {
	if (event)
		event.preventDefault();
	this.$textAreaContainer = $("<div>");
	this.$textAreaContainer.addClass("textAreaContainer");
	this.$textAreaContainer.appendTo(this.$container);
	this.$textArea = $("<textarea>");
	this.$textArea.attr("maxlength", 300);
	this.$textArea.attr("placeholder", "Max 300 characters");
	this.$textArea.on("focus", function() {
		setTimeout(function() {
			$("body").scrollTop(0); 
		}, 20);
	});

	this.$textArea.on("keydown", function(event) {
		if (event.which == 13)
     		event.preventDefault();
	});

	this.$retakeButton.detach();
	this.$nextButton.detach();

	this.$saveButton = $("<button>");
	this.$saveButton.addClass("redButton");
	this.$saveButton.text("SAVE");
	this.$saveButton.appendTo(this.$textAreaContainer);

	this.$backButton = $("<button>");
	this.$backButton.addClass("whiteButton backArrow");
	this.$backButton.appendTo(this.$textAreaContainer);

	this.$textArea.on("webkitAnimationEnd animationEnd", function(){
		this.$textArea.off("webkitAnimationEnd animationEnd")
		this.$textArea.removeClass("slideUp");
		document.body.addEventListener('touchmove', function(e) {
    		e.preventDefault();
		}, false);
		this.$saveButton.on("tap", this.didClickSave.bind(this));
		this.$backButton.on("tap", this.didClickBack.bind(this));
	}.bind(this)); 

	this.$textArea.addClass("textArea slideUp");
	this.$textArea.appendTo(this.$textAreaContainer);
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

	var spinner = new Spinner();
	spinner.$container.addClass("spinner");
	spinner.$container.appendTo(this.$mainContainer);

	this.appliedFilterIndex = i;
	var filters = this.filters[i];
	this.$mainCanvas = this.applyFilters(this.$mainCanvas, filters);
	spinner.$container.remove();
};

CameraController.prototype.didClickSave = function(event) {
	event.preventDefault();

	var spinner = new Spinner();
	spinner.$container.addClass("spinner");
	spinner.$container.appendTo(this.$container);
	var text = this.$textArea.val();

	////
	this.$saveButton.off("tap");
	this.$backButton.off("tap");

	this.$filtersBar.detach();
	this.$mainContainer.empty();
	this.$mainContainer.remove();

	this.$textAreaContainer.remove();
	this.$textAreaContainer = null;
	this.$saveButton = null;
	this.$backButton = null;
	this.$textArea = null;

	// this.$mainContainer.addClass("disappear");
	// this.$mainContainer.on("webkitAnimationEnd animationEnd", function() {
	// 	this.$mainContainer.off("webkitAnimationEnd animationEnd")
	// 	this.$filtersBar.detach();
	// 	this.$mainContainer.empty();
	// 	this.$mainContainer.remove();
	// 	this.$mainContainer.removeClass("disappear");
	// }.bind(this));

	// this.$textAreaContainer.addClass("disappear");
	// this.$textAreaContainer.on("webkitAnimationEnd animationEnd", function() {
	// 	this.$textAreaContainer.off("webkitAnimationEnd animationEnd")
	// 	this.$textAreaContainer.remove();
	// 	this.$textAreaContainer = null;
	// 	this.$saveButton = null;
	// 	this.$backButton = null;
	// 	this.$textArea = null;
	// }.bind(this));

	///

	var sendPost = function(image_url) {
		var regex = /\B(#\w*)/g;
		var tags = text.match(regex);
		text = text.replace(regex, "");
		tags = tags ? tags : [];

		var request = new ServerRequest();
		request.method = "POST";
		request.path = "posts/";
		request.body = JSON.stringify({
			text: text,
			tags: tags,
			image_url: image_url
		});
		request.onSuccess = function(json) {
			alert("Post successfully saved");
			spinner.$container.remove();
			this.photoWasTaken = false;
			this.$mainCanvasContainer = $("<div>");
			this.$mainCanvasContainer.addClass("mainCanvasContainer");
			this.$mainCanvasContainer.appendTo(this.$mainContainer)
			this.$retakeButton = $("<button>");
			this.$retakeButton.addClass("whiteButton");
			this.$retakeButton.text("RETAKE");
			this.$retakeButton.appendTo(this.$mainContainer);
			this.$retakeButton.on("tap", this.showCamera.bind(this));
			this.$mainContainer.appendTo(this.$container);
		}.bind(this);
		request.onError = function(status, message) {
			alert(status + ":" + message);
		};
		request.execute();
	}.bind(this);

	var sendCanvas = function(newCanvas) {
		var dataURL = newCanvas.toDataURL();
		var request = new ServerRequest();
		request.method = "POST";
		request.path = "images/";
		request.jsonHeader = false;
		request.body = dataURL;
		request.onSuccess = function(json) {
			sendPost(json.image_url);
		}.bind(this);
		request.onError = function(status, message) {
			alert(status + ":" + message);
		};
		request.execute();
	}.bind(this);

	var filters = this.filters[this.appliedFilterIndex];
	var $newCanvas = this.applyFilters(this.$originalCanvas, filters);
	sendCanvas($newCanvas[0]);
};

CameraController.prototype.didClickBack = function(event) {
	event.preventDefault();
	this.$textArea.on("webkitAnimationEnd animationEnd", function(){
		this.$textArea.off("webkitAnimationEnd animationEnd");
		this.$textAreaContainer.remove();
		this.$retakeButton.appendTo(this.$mainContainer);
		this.$nextButton.appendTo(this.$mainContainer);
	}.bind(this));
	this.$textArea.addClass("slideDown");
};

CameraController.prototype.applyFilters = function($canvas, filters) {
	this.applyingFilter = true;
	var newCanvas = $canvas[0];
	for (var i in filters) {
		var filterCopy = $.extend(true, {}, filters[i]);
		newCanvas = Pixastic.process(newCanvas, filterCopy.effect, filterCopy.value);
	}
	this.applyingFilter = false;
	return $(newCanvas);
};

return CameraController;

});

