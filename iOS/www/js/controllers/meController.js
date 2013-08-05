var requireArray = [
	"controllers/controller",
	"views/tableView",
	"helpers/serverRequest",
	"views/imageCell",
	"models/post",
	"controllers/editMeController",
	"controllers/commentsController"
]

define(requireArray, function(Controller, TableView, ServerRequest, ImageCell, Post, EditMeController, CommentsController) {
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
	this.$description.attr("maxlength", "100");

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
	this.$editButton.on("tapone", this._didClickEditButton.bind(this));
	this.$editButton.appendTo(this.$container);

	this.postsRemaining = true;
	this.posts = [];
	this.postsByIds = {};
	
	//Event Handlers
	this.tableView.on("didScrollToBottom", this._didScrollToBottom.bind(this));
	this.tableView.on("didSelectRow", this._didSelectRow.bind(this));
	this.tableView.on("rowIsVisible", this._rowIsVisible.bind(this));

	notificationCenter.on("postNotification", this._onPostNotification.bind(this));
	notificationCenter.on("likeNotification", this._onLikeNotification.bind(this));
	
	var request = new ServerRequest();
	request.method = "GET";
	request.path = "me/";
	request.onSuccess = function(json) {
		this.$username.text(json.name);
		this.$description.text(json.description);
		this.$likesCount.text(json.likes_count);
		this.$postsCount.text(json.posts_count);
		if (json.image_url)
			this.$avatar.css("background-image", "url(" + json.image_url + ")");
	}.bind(this);
	request.onError = function(status, message) {
		alert(status + ":" + message);
	};
	request.execute();

	this.pushNewCells();
}

MeController.prototype = new Controller();


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
			this.postsByIds[post.id] = post;
			var cell = new ImageCell(post);

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
		notificationCenter.trigger("likeNotification", {postId: post.id, notifier: this});
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
	if (this.commentsController)
		return;
	commentsController = new CommentsController(post);
	commentsController.$container.on("webkitAnimationEnd animationEnd", function() {
        commentsController.$container.off("webkitAnimationEnd animationEnd")
        commentsController.$container.removeClass("slideLeft");
        commentsController.init();
    });
    commentsController.$container.addClass("slideLeft");
    commentsController.$container.appendTo(this.$container);

    commentsController.on("clickBack", function() {
        commentsController.$container.on("webkitAnimationEnd animationEnd", function() {
            commentsController.$container.off("webkitAnimationEnd animationEnd")
            commentsController.$container.removeClass("slideRight");
            commentsController.$container.remove();
            this.commentsController = null;
        }.bind(this));
        commentsController.$container.addClass("slideRight");
    }.bind(this));
    this.commentsController = commentsController;
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
		notificationCenter.trigger("seenNotification", {postId: post.id, notifier: this});
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
	this.$editButton.off("tapone");
	editMeController = new EditMeController(this.$username.text(), this.$description.text());
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
			if (newData.image_url) {
				this.$avatar.css("background-image", "url(" + newData.image_url + ")");
				for (var i in this.posts) {
					var post = this.posts[i];
					post.imageUrl = image_url
					var cell = this.tableView.cellForRow(i);
					cell.setImage(post.imageUrl);
				}
			}
		}

		editMeController.$container.on("webkitAnimationEnd animationEnd", function() {
			editMeController.$container.remove();
			this.$editButton.on("tapone", this._didClickEditButton.bind(this));
		}.bind(this));
		editMeController.$container.addClass("slideDown");
	}.bind(this));
};

MeController.prototype._onPostNotification = function(notification) {
	var request = new ServerRequest();
	request.method = "GET";
	request.path = "posts/" + notification.postId;

	request.onSuccess = function(json) {
		var post = Post.postFromJSONObject(json);
		this.posts.splice(0, 0, post);
		this.postsByIds[post.id] = post;
		this.$postsCount.text(this.posts.length);

		var cell = new ImageCell(post);
		cell.on("didClickLike", this._didClickLike.bind(this, cell, post));
		cell.on("didClickComment", this._didClickComment.bind(this, cell, post));

		this.tableView.insertCellAtRow(cell, 0);
	}.bind(this);
	request.onError = function(statusCode, message) {
		alert("Error in MeController get post request: " + statusCode + ": " + message);
	}.bind(this);
	request.execute();
};

MeController.prototype._onLikeNotification = function(notification) {
	var likes = parseInt(this.$likesCount.text());
	this.$likesCount.text(likes + 1);
};

return MeController;
});