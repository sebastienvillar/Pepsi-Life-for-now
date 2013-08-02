var requireArray = [
	"controllers/controller",
	"helpers/serverRequest",
	"views/spinner",
	"helpers/eventEmitter"
];

define(requireArray, function(Controller, ServerRequest, Spinner, EventEmitter) {

var EditMeController = function(name, description) {
	Controller.call(this);
	EventEmitter.call(this);

	this.$container.attr("id", "editMeController");

	this.$form = $("<form>");
	this.$form.appendTo(this.$container);
	this.$form.on("submit", function() {
		this.$doneButton.trigger('tapone');
		return false;
	}.bind(this));

	this.$nameInput = $("<input>", {"id": "nameInput", "type": "text"});
	this.$nameInput.appendTo(this.$form);
	this.$nameInput.attr("placeholder", "Name");
	this.$nameInput.val(name);

	this.$descriptionInput = $("<input>", {"id": "descriptionInput", "type": "text"});
	this.$descriptionInput.appendTo(this.$form);
	this.$descriptionInput.attr("placeholder", "Description. Max 100 characters")
	this.$descriptionInput.val(description);

	this.$imageButton = $("<button>", {"id": "imageButton"});
	this.$imageButton.appendTo(this.$form);
	this.$imageButton.text("Choose your image");
	this.$imageButton.on("tapone", this._didClickImageButton.bind(this));

	this.$doneButton = $("<button>");
	this.$doneButton.text("DONE");
	this.$doneButton.appendTo(this.$container);
	this.$doneButton.on("tapone", this._didClickDoneButton.bind(this));
};

EditMeController.prototype = $.extend({}, Controller.prototype, EventEmitter.prototype, EditMeController.prototype);

///////////////
// Private
///////////////

EditMeController.prototype._didClickImageButton = function() {
	var cameraOptions = { 
		destinationType: Camera.DestinationType.FILE_URI,
		sourcetype: Camera.PictureSourceType.CAMERA,
		targetWidth: 400,
		targetHeight: 400
	}

	var onCameraSuccess = function(fileURI) {
		this.imageURI = fileURI;
	}.bind(this);

	navigator.camera.getPicture(onCameraSuccess, null, cameraOptions);
};

EditMeController.prototype._didClickDoneButton = function() {
	var spinner = new Spinner();
	spinner.setBlue();
	spinner.$container.addClass("spinner");
	spinner.$container.appendTo(this.$container);
	this.$doneButton.off("tapone");

	var finish = function(newData) {
		spinner.$container.remove();
		this.trigger("meWasUpdated", newData);
	}.bind(this);

	var updateMe = function(imageURL) {
		var newData = {
			name: this.$nameInput.val(),
			description: this.$descriptionInput.val()
		};
		if (imageURL)
			newData["image_url"] = imageURL
		console.log("name:",newData.name);
		console.log("description:",newData.description);
		console.log("url:",newData.image_url);

		var request = new ServerRequest();
		request.method = "PATCH";
		request.path = "me/";
		request.body = JSON.stringify(newData);
		request.onSuccess = function(json) {
			console.log("success");
			newData.image_url = this.imageURI;
			finish(newData)
		}.bind(this);
		request.onError = function(status, message) {
			finish(null);
			alert(status + ":" + message);
		};
		request.execute();
	}.bind(this);

	if (this.imageURI) {
		var image = new Image();
		image.onload = function() {
			var $canvas = $("<canvas>");
			$canvas.attr("width", image.width);
			$canvas.attr("height", image.height);
			var context = $canvas[0].getContext("2d");
			context.drawImage(image, 0, 0);

			var dataURL = $canvas[0].toDataURL();
			var request = new ServerRequest();
			request.method = "POST";
			request.path = "images/";
			request.jsonHeader = false;
			request.body = dataURL;
			request.onSuccess = function(json) {
				updateMe(json.image_url);
			}.bind(this);
			request.onError = function(status, message) {
				finish(null);
				alert(status + ":" + message);
			};
			request.execute();
		}.bind(this);
		image.src = this.imageURI;
	}
	else
		updateMe(null);
};

return EditMeController;
});