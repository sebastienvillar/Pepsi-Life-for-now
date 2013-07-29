var requireArray = [
	"controllers/controller",
	"views/tableView",
	"helpers/serverRequest",
	"views/imageCell",
	"models/post",
	"controllers/editMeController"
]

define(requireArray, function(Controller, TableView, ServerRequest, ImageCell, Post, EditMeController) {
var MeController = function() {
	Controller.call(this);

	this.$container.attr("id", "meController");

	this.tableView = new TableView();
	this.tableView.$container.attr("id", "tableView");
	this.tableView.$cellsContainer.attr("id", "cellsContainer");
	this.tableView.$container.appendTo(this.$container);
	this.tableView.setCellsSpacing("12px");

	this.$header = $("<div>", {"id": "header"});
	this.tableView.setHeader(this.$header);

	this.$avatarWrapper = $("<div>", {"id": "avatarWrapper"});
	this.$avatarWrapper.appendTo(this.$header);

	this.$avatar = $("<div>", {"id": "avatar"});
	this.$avatar.appendTo(this.$avatarWrapper);

	this.$username = $("<p>", {"id": "username"});
	this.$username.appendTo(this.$header);
	this.$username.text("PAUL WALKER");

	this.$description = $("<p>", {"id": "description"});
	this.$description.appendTo(this.$header);
	this.$description.text("Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse imperdiet libero id neque fringilla, in.");

	this.$postsRect = $("<div>", {"id": "postsRect"});
	this.$postsRect.appendTo(this.$header);

	this.$postsCount = $("<span>", {"id": "postsCount"});
	this.$postsCount.text("54");
	this.$postsCount.addClass("rectText");
	this.$postsCount.appendTo(this.$postsRect);

	this.$postsText = $("<span>", {"id": "postsText"});
	this.$postsText.text("POSTS");
	this.$postsText.addClass("rectText");
	this.$postsText.appendTo(this.$postsRect);

	this.$likesRect = $("<div>", {"id": "likesRect"});
	this.$likesRect.appendTo(this.$header);

	this.$likesCount = $("<span>", {"id": "likesCount"});
	this.$likesCount.appendTo(this.$likesRect);
	this.$likesCount.addClass("rectText");
	this.$likesCount.text("134");

	this.$likesText = $("<span>", {"id": "likesText"});
	this.$likesText.appendTo(this.$likesRect);
	this.$likesText.addClass("rectText");
	this.$likesText.text("LIKES");

	this.$editButton = $("<button>");
	this.$editButton.text("EDIT");
	this.$editButton.on("tap", this._didClickEditButton.bind(this));
	this.$editButton.appendTo(this.$header);

	this.postsRemaining = true;
	this.posts = [];

	this.init();

	//Event Handlers
	this.tableView.on("didScrollToBottom", this._didScrollToBottom.bind(this));
	this.tableView.on("didSelectRow", this._didSelectRow.bind(this));
	this.tableView.on("rowIsVisible", this._rowIsVisible.bind(this));
	
}

MeController.prototype = new Controller();

MeController.prototype.init = function() {
	var request = new ServerRequest();
	request.method = "GET";
	request.path = "me/";
	request.onSuccess = function(json) {
		console.log("json:", json);
		this.$username.text(json.name);
		this.$description.text(json.description);
		if (json.image_url)
			this.$avatar.css("background-image", "url(" + json.image_url + ")");
	}.bind(this);
	request.onError = function(status, message) {
		alert(status + ":" + message);
	};
	request.execute();

	this.pushNewCells();
};

MeController.prototype.pushNewCells = function() {
	this.tableView.enterLoadingMode();
	var request = new ServerRequest();
	request.method = "GET";
	request.path = "me/posts";
	if (this.posts.length != 0)
		request.queryParameters["last_id"] = this.posts[this.posts.length - 1].id

	request.onSuccess = function(json) {
		this.tableView.exitLoadingMode();
		var posts = json.posts;
		this.postsRemaining = posts.length == 10;
		for (var i in posts) {
			var post = Post.postFromJSONObject(posts[i]);
			this.posts.push(post);
			var cell = new ImageCell(post);
			cell.setFriend(true);

			cell.on("didClickLike", this._didClickLike.bind(this, cell, post));
			cell.on("didClickComment", this._didClickComment.bind(this, cell, post));

			this.tableView.pushCell(cell);
		}
	}.bind(this);
	request.onError = function(statusCode, message) {
		this.tableView.exitLoadingMode();
		alert("Error in MeController get posts request: " + statusCode + ": " + message);
	}.bind(this);
	request.execute();
};


////////////////
// Private
///////////////

MeController.prototype._didScrollToBottom = function() {
	if (!this.tableView.loading && this.postsRemaining) {
		this.pushNewCells();
	}
};

MeController.prototype._didSelectRow = function(row) {

};

MeController.prototype._didClickLike = function(cell, post) {
	if (post.liked)
		return;

	post.liked = true;
	var request = new ServerRequest();
	request.path = "posts/" + post.id + "/likes";
	request.method = "POST";
	request.onSuccess = function(json) {
		cell.setLikesCount(cell.getLikesCount() + 1);
	}.bind(this);
	request.onError = function(status, message) {
		if (statusCode != 403) {
			post.like = false;
			alert("Error in Friends post like request: " + statusCode + ": " + message);
		}
	}.bind(this);
	request.execute();
};

MeController.prototype._didClickComment = function(cell, post) {

};

MeController.prototype._rowIsVisible = function(row) {
	var post = this.posts[row];
	var cell = this.tableView.cellForRow(row);
	if (post.seen)
		return

	post.seen = true;
	var request = new ServerRequest();
	request.path = "posts/" + post.id + "/seens";
	request.method = "POST";
	request.onSuccess = function(json) {
		cell.setSeensCount(cell.getSeensCount() + 1);
	}.bind(this);
	request.onError = function(status, message) {
		if (statusCode != 403) {
			alert("Error in Friends post seen request: " + statusCode + ": " + message);
			post.seen = false;
		}
	}.bind(this);
	request.execute();
};

MeController.prototype._didClickEditButton = function(event) {
	event.preventDefault();
	this.$editButton.off("tap");
	editMeController = new EditMeController();
	editMeController.$container.on("webkitAnimationEnd animationEnd", function() {
		editMeController.$container.off("webkitAnimationEnd animationEnd")
		editMeController.$container.removeClass("slideUp");
	}.bind(this));
	editMeController.$container.addClass("slideUp");
	editMeController.$container.appendTo(this.$container);
	editMeController.on("meWasUpdated", function(newData) {
		if (newData) {
			this.$username.text(newData.name);
			this.$description.text(newData.description);
			if (newData.image_url)
				this.$avatar.css("background-image", "url(" + newData.image_url + ")");
		}

		editMeController.$container.on("webkitAnimationEnd animationEnd", function() {
			editMeController.$container.remove();
			this.$editButton.on("tap", this._didClickEditButton.bind(this));
		}.bind(this));
		editMeController.$container.addClass("slideDown");
	}.bind(this));
};

return MeController;
});