var requireArray = [
	"controllers/controller",
	"views/tableView"
]

define(requireArray, function(Controller, TableView) {
	var MeController = function() {
		Controller.call(this);

		this.$container.attr("id", "meController");

		this.tableView = new TableView();
		this.tableView.$container.attr("id", "tableView");
		this.tableView.$cellsContainer.attr("id", "cellsContainer");
		this.tableView.$container.appendTo(this.$container);

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
		
	}

	MeController.prototype = new Controller();
	return MeController;
});