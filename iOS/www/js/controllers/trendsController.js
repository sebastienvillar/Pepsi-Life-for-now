var requireArray = [
	"controllers/controller",
	"views/tableView",
	"views/trendsCell",
	"helpers/serverRequest",
	"models/post"
];


define(requireArray, function(Controller, TableView, TrendsCell, ServerRequest, Post) {
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
	this.tableView.setCellsSpacing("8px");
	this.tableView.setBackgroundColor("#124c8f");
	this.tableView.setPadding("8px");
	this.tableView.$container.attr("id", "trendsController-tableView")
	this.tableView.$container.appendTo(this.$container);
	this.postsRemaining = true;
	this.posts = [];

	this.currentSearchTag = null;

	//Event Handlers
	this.tableView.on("didScrollToBottom", this._didScrollToBottom.bind(this));
	this.tableView.on("didSelectRow", this._didSelectRow.bind(this));
	this.$searchForm.on("submit", this._didSearch.bind(this));


	this.init();
};

TrendsController.prototype = new Controller();

TrendsController.prototype.init = function() {
	this.pushNewCells();
};

TrendsController.prototype.pushNewCells = function() {
	var request = new ServerRequest();
	request.method = "GET";
	request.path = "posts/";
	if (this.posts.length != 0)
		request.data["last_id"] = this.posts[this.posts.length - 1].id;
	if (this.currentSearchTag)
		request.data["tag"] = this.currentSearchTag;

	request.onSuccess = function(json) {
		this.tableView.exitLoadingMode();
		var posts = json.posts;
		this.postsRemaining = posts.length == 10;
		console.log("remaining:", this.postsRemaining);
		for (var i in posts) {
			var post = Post.postFromJSONObject(posts[i]);
			var cell = new TrendsCell(post);

			cell.on("didClickLike", this._didClickLike.bind(this, this.posts.length, cell));
			cell.on("didClickComment", this._didClickComment.bind(this, this.posts.length, cell));
			cell.on("didClickTag", this._didClickTag.bind(this));

			this.tableView.pushCell(cell);
			this.posts.push(post);
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
		this.tableView.enterLoadingMode();
		this.pushNewCells();
	}
};

TrendsController.prototype._didSelectRow = function(row) {

};

TrendsController.prototype._didClickLike = function(row, cell) {
	var post = this.posts[row];
	var request = new ServerRequest();
	request.path = "posts/" + post.id + "/likes";
	request.method = "POST";
	request.onSuccess = function(json) {
		cell.setLikesCount(cell.getLikesCount() + 1);
	}.bind(this);
	request.onError = function(status, message) {
		if (statusCode != 403)
			alert("Error in TrendsController post like request: " + statusCode + ": " + message);
	}.bind(this);
	request.execute();
};

TrendsController.prototype._didClickComment = function(row, cell) {

};

TrendsController.prototype._didClickTag = function(tag) {
	this.$searchField.val(tag);
	this._didSearch();
}

TrendsController.prototype._didSearch = function() {
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
	this.tableView.enterLoadingMode();
	this.pushNewCells();
}

return TrendsController;
});