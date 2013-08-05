var requireArray = [
	"controllers/controller",
	"views/commentCell",
	"views/tableView",
	"helpers/serverRequest",
	"models/comment",
	"helpers/eventEmitter"
];

define(requireArray, function(Controller, CommentCell, TableView, ServerRequest, Comment, EventEmitter) {
var CommentsController = function(post) {
	Controller.call(this);

	this.post = post;
	this.$container.attr("id", "commentsController");
	this.tableView = new TableView();
	this.tableView.setCellsSpacing("12px");
	this.tableView.$container.attr("id", "tableView")
	this.tableView.$cellsContainer.attr("id", "cellsContainer");
	this.tableView.$container.appendTo(this.$container);
	this.tableView.$container.on("tapone", function() {
		this.$textInput.trigger("blur");
	}.bind(this));
	this.$textInput = $("<input>", {"id": "textInput"});
	this.$textInput.attr("type", "text");
	this.$textInput.attr("placeholder", "Type your comment here");
	this.$textInput.appendTo(this.$container);
	this.$textInput.on("tapone", function(e) {
		this.$textInput.trigger("focus");
	}.bind(this));
	this.$textInput.on("focus", function() {
		$("body").on("touchmove", function(e) {
			e.preventDefault();
		});
	});
	this.$textInput.on("blur", function() {
		$("body").off("touchemove");
	});
	this.$textInput.on("keydown", function(event) {
		if (event.which == 13) {
			event.preventDefault();
			this._didClickSend();
		}
	}.bind(this));

	this.$backButton = $("<button>", {"id": "backButton"});
	this.$backButton.appendTo(this.$container);
	this.$backButton.on("tapone", this._didClickBack.bind(this));

	this.commentsRemaining = true;
	this.comments = [];
	this.commentsByIds = {};

	//Event Handlers
	this.tableView.on("didScrollToBottom", this._didScrollToBottom.bind(this));

};

CommentsController.prototype = $.extend({}, EventEmitter.prototype, CommentsController.prototype);

CommentsController.prototype.init = function() {
	this.pushNewCells();
}


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

CommentsController.prototype._didClickBack = function() {
	this.trigger("clickBack");
};

CommentsController.prototype._didClickSend = function() {
	var text = this.$textInput.val();
	if (text == "")
		return;

	this.$textInput.trigger("blur");
	var request = new ServerRequest();
	request.method = "POST";
	request.path = "posts/" + this.post.id + "/comments/";
	request.body = JSON.stringify({
		text: text
	});

	request.onSuccess = function(json) {
		var comment = Comment.commentFromJSONObject(json);
		this.comments.splice(0, 0, comment);
		this.commentsByIds[comment.id] = comment;
		var cell = new CommentCell(comment);

		this.$textInput.val("");
		this.tableView.insertCellAtRow(cell, 0);
	}.bind(this);
	request.onError = function(statusCode, message) {
		alert("Error in CommentsController send comment request: " + statusCode + ": " + message);
	}.bind(this);
	request.execute();
};
return CommentsController;
});