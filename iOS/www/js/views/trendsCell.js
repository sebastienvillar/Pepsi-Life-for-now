define(function() {
function TrendsCell(post) {
	this.$container = $("<div>");
	this.$container.addClass("trendsCell-container");

	//Header
	this.$header = $("<header>");
	this.$header.addClass("trendsCell-header");
	this.$header.appendTo(this.$container);

	this.$headerSeparationLine = $("<div>");
	this.$headerSeparationLine.addClass("trendsCell-headerSeparationLine");
	this.$headerSeparationLine.appendTo(this.$header);

	this.$avatarWrapper = $("<div>");
	this.$avatarWrapper.addClass("trendsCell-avatarWrapper");
	this.$avatarWrapper.addClass("friend");
	this.$avatarWrapper.appendTo(this.$header);

	this.$avatar = $("<img>");
	this.$avatar.appendTo(this.$avatarWrapper);
	this.$avatar.addClass("trendsCell-avatar");
	this.$avatar.attr("src", "img/common/photo-substitute.png");

	this.$username = $("<p>");
	this.$username.addClass("trendsCell-username");
	this.$username.appendTo(this.$header);

	this.$date = $("<p>");
	this.$date.addClass("trendsCell-date");
	this.$date.appendTo(this.$header);

	this.$likesButton = $("<div>");
	this.$likesButton.addClass("trendsCell-likesButton");
	this.$likesButton.appendTo(this.$header);

	this.$likesCount = $("<p>");
	this.$likesCount.addClass("trendsCell-likesCount");
	this.$likesCount.appendTo(this.$header);

	this.$commentsButton = $("<div>");
	this.$commentsButton.addClass("trendsCell-commentsButton");
	this.$commentsButton.appendTo(this.$header);

	this.$commentsCount = $("<p>");
	this.$commentsCount.addClass("trendsCell-commentsCount");
	this.$commentsCount.appendTo(this.$header);

	//Separation
	this.$separationLine = $("<div>");
	this.$separationLine.addClass("trendsCell-separationLine");
	this.$separationLine.appendTo(this.$container);

	//Body
	this.$body = $("<div>");
	this.$body.addClass("trendsCell-body");
	this.$body.appendTo(this.$container);

	this.$text = $("<p>");
	this.$text.addClass("trendsCell-text");
	this.$text.appendTo(this.$body);

	this.$tags = $("<span>");
	this.$tags.addClass("trendsCell-tags");
	this.$tags.appendTo(this.$body);

	//Footer
	this.$footer = $("<footer>");
	this.$footer.addClass("trendsCell-footer");
	this.$footer.appendTo(this.$container);

	this.$leftFooterPart = $("<div>");
	this.$leftFooterPart.addClass("trendsCell-leftFooterPart");
	this.$leftFooterPart.appendTo(this.$footer);

	this.$rightFooterPart = $("<div>");
	this.$rightFooterPart.addClass("trendsCell-rightFooterPart");
	this.$rightFooterPart.appendTo(this.$footer);

	this.$centerFooterPart = $("<div>");
	this.$centerFooterPart.addClass("trendsCell-centerFooterPart");
	this.$centerFooterPart.appendTo(this.$footer);

	if (post) {
		this.setLikesCount(post.likesCount);
		//this.setCommentsCount(post.commentsCount);
		this.setUsername(post.ownerName);
		this.setDate(post.creationDate);
		this.setText(post.text);
		this.setTags(post.tags);
	}
}

TrendsCell.prototype.setAvatarBorderColor = function(color) {
	this.$avatarWrapper.css("background-color", color);
};

TrendsCell.prototype.setLikesCount = function(count) {
	count = count > 999 ? 999 : count;
	this.$likesCount.text(count.toString());
};

TrendsCell.prototype.setCommentsCount = function(count) {
	count = count > 999 ? 999 : count;
	this.$commentsCount.text(count.toString());
};

TrendsCell.prototype.setUsername = function(username) {
	this.$username.text("By " + username.toUpperCase());
};

TrendsCell.prototype.setDate = function(date) {
	var now = new Date();
	if (now.getDate() == date.getDate() && now.getMonth() == date.getMonth() && now.getYear() == date.getYear()) {
		var hours = date.getHours();
		var minutes = date.getMinutes();
		var minutesString = minutes.toString();
		if (minutes < 10)
			minutesString = "0" + minutesString;
		if (hours <= 12)
			var text = hours + ":" + minutesString + " AM";
		else 
			var text = hours - 12 + ":" + minutesString + " PM";
	}
	else {
		now.setHours(23);
		now.setMinutes(59);
		now.setSeconds(59);
		var msDifference = now - date.getTime();
		var daysDifference = Math.floor(msDifference / (1000.0 * 3600.0 * 24.0));
		var text = daysDifference + " JOUR";
		if (daysDifference != 1)
			text += "S";
	}
	this.$date.text(text);
};

TrendsCell.prototype.setText = function(text) {
	if (text.length > 300) {
		text = text.slice(0, 300);
		text += "...";
	}
	this.$text.text(text);
};

TrendsCell.prototype.setTags = function(tags) {
	for (var i in tags) {
		var $link = $("<a>");
		$link.text(tags[i]);
		$link.appendTo(this.$tags);
	}
};

return TrendsCell;

});