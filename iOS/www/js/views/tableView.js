define(function() {
function TableView() {
	this.$container = $("<div>");
	this.$container.addClass("full-size");
	this.$container.css("overflow", "scroll");
	this.spacing = 0;
	this.cells = [];
}

TableView.prototype.setBackgroundColor = function(color) {
	this.$container.css("background-color", color);
};

TableView.prototype.setCellsSpacing = function(spacing) {
	for (var i in this.cells) {
		var cell = this.cells[i];
		cell.$container.css("margin-top", spacing);
	}
	this.spacing = spacing;
};

TableView.prototype.pushCell = function(cell) {
	this.$container.append(cell.$container);
	cell.$container.css("margin-top", this.spacing);
	this.cells.push(cell);
};

TableView.prototype.removeCell = function(cell) {
	cell.$container.remove();
};

//didSelectRowAtIndex
//didScrollToBottom
return TableView;
});