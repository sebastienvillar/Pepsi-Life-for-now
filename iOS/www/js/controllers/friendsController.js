var requireArray = [
	"controllers/controller",
	"views/tableView",
	"views/imageCell",
	"helpers/serverRequest",
	"models/post"
];


define(requireArray, function(Controller, TableView, ImageCell, ServerRequest, Post) {
var FriendsController = function() {
	Controller.call(this);

	this.$container.attr("id", "friendsController");
	this.tableView = new TableView();
	this.tableView.setCellsSpacing("12px");
	this.tableView.setPadding("8px");
	this.tableView.$container.attr("id", "tableView")
	this.tableView.$container.appendTo(this.$container);
	this.postsRemaining = true;
	this.posts = [];
	this.seenPosts = {};

	//Event Handlers
	this.tableView.on("didScrollToBottom", this._didScrollToBottom.bind(this));
	this.tableView.on("didSelectRow", this._didSelectRow.bind(this));
	this.tableView.on("rowIsVisible", this._rowIsVisible.bind(this));

	this.init();
};

FriendsController.prototype = new Controller();

FriendsController.prototype.init = function() {
	this.pushNewCells();
};

FriendsController.prototype.pushNewCells = function() {
	this.tableView.enterLoadingMode();
	var request = new ServerRequest();
	request.method = "GET";
	request.path = "posts/";
	request.queryParameters["only_friends"] = true;
	if (this.posts.length != 0)
		request.queryParameters["last_id"] = this.posts[this.posts.length - 1].id;

	request.onSuccess = function(json) {
		this.tableView.exitLoadingMode();
		var posts = json.posts;
		this.postsRemaining = posts.length == 10;
		for (var i in posts) {
			var post = Post.postFromJSONObject(posts[i]);
			var cell = new ImageCell(post);
			cell.setFriend(true);

			cell.on("didClickLike", this._didClickLike.bind(this, this.posts.length));
			cell.on("didClickComment", this._didClickComment.bind(this, this.posts.length));

			this.tableView.pushCell(cell);
			this.posts.push(post);
		}
	}.bind(this);
	request.onError = function(statusCode, message) {
		this.tableView.exitLoadingMode();
		alert("Error in FriendsController get posts request: " + statusCode + ": " + message);
	}.bind(this);
	request.execute();
};


///////////////////////////////
// Private
//////////////////////////////

FriendsController.prototype._didScrollToBottom = function() {
	if (!this.tableView.loading && this.postsRemaining) {
		this.pushNewCells();
	}
};

FriendsController.prototype._didSelectRow = function(row) {

};

FriendsController.prototype._didClickLike = function(row) {
	var post = this.posts[row];
	var cell = this.tableView.cellForRow(row);
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

FriendsController.prototype._didClickComment = function(row) {

};

FriendsController.prototype._rowIsVisible = function(row) {
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

return FriendsController;
});