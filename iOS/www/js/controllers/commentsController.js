var requireArray = [
	"controllers/controller",
	"views/commentCell",
	"views/tableView",
	"helpers/serverRequest",
	"models/comment"
];

define(requireArray, function(Controller, CommentCell, TableView, ServerRequest, Comment) {
var CommentsController = function(post) {
	Controller.call(this);

	this.post = post;
	this.$container.attr("id", "commentsController");
	this.tableView = new TableView();
	this.tableView.setCellsSpacing("12px");
	this.tableView.$container.attr("id", "tableView")
	this.tableView.$cellsContainer.attr("id", "cellsContainer");
	this.tableView.$container.appendTo(this.$container);
	this.commentsRemaining = true;
	this.comments = [];
	this.commentsByIds = {};

	//Event Handlers
	this.tableView.on("didScrollToBottom", this._didScrollToBottom.bind(this));

	this.pushNewCells();
};

CommentsController.prototype = new Controller();


CommentsController.prototype.pushNewCells = function() {
	this.tableView.enterLoadingMode();
	var request = new ServerRequest();
	request.method = "GET";
	request.path = "posts/" + this.post.id + "/comments/";
	if (this.comments.length != 0)
		request.queryParameters["last_id"] = this.comments[this.comments.length - 1].id;

	request.onSuccess = function(json) {
		this.tableView.exitLoadingMode();
		var comments = json.comments;
		this.commentsRemaining = comments.length == 10;
		for (var i in comments) {
			var comment = Comment.commentFromJSONObject(comments[i]);
			this.comments.push(comment);
			this.commentsByIds[comment.id] = comment;
			var cell = new CommentCell(comment);

			this.tableView.pushCell(cell);
		}
	}.bind(this);
	request.onError = function(statusCode, message) {
		this.tableView.exitLoadingMode();
		alert("Error in CommentsController get comments request: " + statusCode + ": " + message);
	}.bind(this);
	request.execute();
};

/////////////////
/////////////////

CommentsController.prototype._didScrollToBottom = function() {
	if (!this.tableView.loading && this.postsRemaining) {
		this.pushNewCells();
	}
};

return CommentsController;
});