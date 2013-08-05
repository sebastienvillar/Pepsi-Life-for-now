var requireArray = [
	"controllers/controller",
	"views/tableView",
	"views/trendsCell",
	"views/imageCell",
	"helpers/serverRequest",
	"models/post",
	"controllers/commentsController"
];


define(requireArray, function(Controller, TableView, TrendsCell, ImageCell, ServerRequest, Post, CommentsController) {
var TrendsController = function() {
	Controller.call(this);

	this.$container.attr("id", "trendsController");
	this.$searchForm = $("<form>");
	this.$searchForm.attr("id", "trendsController-searchForm");
	this.$searchForm.appendTo(this.$container);
	this.$searchField = $("<input>");
	this.$searchField.attr("id", "trendsController-searchField");
	this.$searchField.attr("type", "search");
	this.$searchField.attr("placeholder", "Search a tag");
	this.$searchField.appendTo(this.$searchForm);
	this.tableView = new TableView();
	this.tableView.setCellsSpacing("12px");
	this.tableView.$container.attr("id", "trendsController-tableView")
	this.tableView.$cellsContainer.attr("id", "cellsContainer");
	this.tableView.$container.appendTo(this.$container);
	this.postsRemaining = true;
	this.posts = [];
	this.postsByIds = {};

	this.currentSearchTag = null;

	//Event Handlers
	this.tableView.on("didScrollToBottom", this._didScrollToBottom.bind(this));
	this.tableView.on("didSelectRow", this._didSelectRow.bind(this));
	this.tableView.on("rowIsVisible", this._rowIsVisible.bind(this));
	this.$searchForm.on("submit", this._didSearch.bind(this));

	notificationCenter.on("likeNotification", this._onLikeNotification.bind(this));
	notificationCenter.on("seenNotification", this._onSeenNotification.bind(this));

	this.pushNewCells();
};

TrendsController.prototype = new Controller();

TrendsController.prototype.pushNewCells = function() {
	this.tableView.enterLoadingMode();
	var request = new ServerRequest();
	request.method = "GET";
	request.path = "posts/";
	if (this.posts.length != 0)
		request.queryParameters["last_id"] = this.posts[this.posts.length - 1].id;
	if (this.currentSearchTag)
		request.queryParameters["tag"] = this.currentSearchTag;

	request.onSuccess = function(json) {
		this.tableView.exitLoadingMode();
		var posts = json.posts;
		this.postsRemaining = posts.length == 10;
		for (var i in posts) {
			var post = Post.postFromJSONObject(posts[i]);
			this.posts.push(post);
			this.postsByIds[post.id] = post;
			if (this.currentSearchTag)
				var cell = new ImageCell(post);
			else
				var cell = new TrendsCell(post);

			cell.on("didClickLike", this._didClickLike.bind(this, cell, post));
			cell.on("didClickComment", this._didClickComment.bind(this, cell, post));
			cell.on("didClickTag", this._didClickTag.bind(this));

			this.tableView.pushCell(cell);
		}
	}.bind(this);
	request.onError = function(statusCode, message) {
		this.tableView.exitLoadingMode();
		alert("Error in TrendsController get posts request: " + statusCode + ": " + message);
	}.bind(this);
	request.execute();
};


///////////////////////////////
// Private
//////////////////////////////

TrendsController.prototype._didScrollToBottom = function() {
	if (!this.tableView.loading && this.postsRemaining) {
		this.pushNewCells();
	}
};

TrendsController.prototype._didSelectRow = function(row) {

};

TrendsController.prototype._didClickLike = function(cell, post) {
	if (post.liked)
		return;

	post.liked = true;
	var request = new ServerRequest();
	request.path = "posts/" + post.id + "/likes";
	request.method = "POST";
	request.onSuccess = function(json) {
		post.likesCount++;
		cell.setLikesCount(cell.getLikesCount() + 1);
		notificationCenter.trigger("likeNotification", {postId: post.id, notifier: this});
	}.bind(this);
	request.onError = function(status, message) {
		if (statusCode != 403) {
			post.liked = false;
			alert("Error in TrendsController post like request: " + statusCode + ": " + message);
		}
	}.bind(this);
	request.execute();
};

TrendsController.prototype._didClickComment = function(cell, post) {
	var commentsController = new CommentsController(post);
	commentsController.$container.appendTo(this.$container);
};

TrendsController.prototype._didClickTag = function(tag) {
	this.$searchField.val(tag);
	this._didSearch();
}

TrendsController.prototype._didSearch = function() {
	this.$searchField.blur();
	var tag = this.$searchField.val();
	if (tag.length == 0)
		tag = null;
	else if (tag.charAt(0) != "#") {
		tag = "#" + tag;
	}

	if (tag == this.currentSearchTag)
		return;

	this.currentSearchTag = tag;
	this.posts = [];
	this.tableView.removeAllRows();
	this.pushNewCells();
}

TrendsController.prototype._rowIsVisible = function(row) {
	var post = this.posts[row];
	var cell = this.tableView.cellForRow(row);
	if (post.seen)
		return

	post.seen = true;
	var request = new ServerRequest();
	request.path = "posts/" + post.id + "/seens";
	request.method = "POST";
	request.onSuccess = function(json) {
		post.seensCount++;
		if (cell.setSeensCount)
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

TrendsController.prototype._onLikeNotification = function(notification) {
	if (notification.notifier == this)
		return;
	var post = this.postsByIds[notification.postId];
	if (post && !post.liked) {
		post.liked = true;
		post.likesCount++;
		var cell = this.tableView.cellForRow(this.posts.indexOf(post));
		cell.setLikesCount(cell.getLikesCount() + 1);
	}
};

TrendsController.prototype._onSeenNotification = function(notification) {
	if (notification.notifier == this)
		return;
	var post = this.postsByIds[notification.postId];
	if (post && !post.seen) {
		post.seen = true;
		post.seensCount++;
		var cell = this.tableView.cellForRow(this.posts.indexOf(post));
		if (cell.setSeensCount)
			cell.setSeensCount(cell.getSeensCount() + 1);
	}
};

return TrendsController;
});