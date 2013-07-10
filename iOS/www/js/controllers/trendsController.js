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

	this.$container.addClass("full-size");
	this.tableView = new TableView();
	this.tableView.setCellsSpacing("8px");
	this.tableView.setBackgroundColor("#124c8f");
	this.tableView.setPadding("8px");
	this.tableView.$container.appendTo(this.$container);
	this.postsRemaining = true;
	this.posts = [];

	//Event Handlers
	this.tableView.on("didScrollToBottom", didScrollToBottom.bind(this));
	this.tableView.on("didSelectRow", didSelectRow.bind(this));

	this.init();
};

TrendsController.prototype = new Controller();

TrendsController.prototype.init = function() {
	this.pushNewCells();
};

TrendsController.prototype.pushNewCells = function() {
	var request = new ServerRequest();
	request.method = "GET";
	request.path = "posts";
	if (this.posts.length != 0)
		request.data = {"last_id": this.posts[this.posts.length - 1].id};
	request.onSuccess = function(json) {
		this.tableView.exitLoadingMode();
		var posts = json.posts;
		this.postsRemaining = posts.length != 0;
		for (var i in posts) {
			var post = Post.postFromJSONObject(posts[i]);
			var cell = new TrendsCell(post);
			this.tableView.pushCell(cell);
			this.posts.push(post);
		}
	}.bind(this);
	request.onError = function(statusCode, message) {
		this.tableView.exitLoadingMode();
		alert("Error in TrendsController server request: " + statusCode + ": " + message);
	}.bind(this);
	request.execute();
};

return TrendsController;
});