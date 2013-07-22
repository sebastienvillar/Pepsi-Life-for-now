var requireArray = [
	"helpers/eventEmitter",
	"views/spinner"
];

define(requireArray, function(EventEmitter, Spinner) {
function TableView() {
	EventEmitter.call(this);

	this.$container = $("<div>");
	this.$container.css({"overflow": "scroll", "-webkit-overflow-scrolling": "touch"});
	this.loading = false;
	this.spinner = new Spinner();
	this.spinner.$container.css({"margin": "0 auto 20px auto"});
	this.spacing = 0;
	this.selectedCell = null;
	this.cells = [];

	//Events
	this.$container.scroll(function(e) {
		var $element = this.$container;
		if ($element.outerHeight() + $element.scrollTop() == $element[0].scrollHeight) {
			this.trigger("didScrollToBottom");
		}
	}.bind(this));
}

TableView.prototype = new EventEmitter();

TableView.prototype.setCellsSpacing = function(spacing) {
	for (var i in this.cells) {
		var cell = this.cells[i];
		if (i != 0)
			cell.$container.css("margin-top", spacing);
	}
	this.spacing = spacing;
};

TableView.prototype.pushCell = function(cell) {
	cell.$container.appendTo(this.$container);
	//cell.$container.on("tap", didSelectCell.bind(this, cell));
	if (this.cells.length != 0) {
		cell.$container.css("margin-top", this.spacing);
	}
	this.cells.push(cell);
};

TableView.prototype.removeRowAtIndex = function(i) {
	if (i < this.cells.length) {
		if (this.selectedCell = this.cells[i])
			this.selectedCell = null;
		this.cells[i].$container.remove();
		this.cells.splice(i, 1);
	}
};

TableView.prototype.removeAllRows = function() {
	for (var i = 0 in this.cells) {
		var cell = this.cells[i];
		cell.$container.remove();
	}
	this.selectedCell = null;
	this.cells = [];
};

TableView.prototype.enterLoadingMode = function() {
	this.loading = true;
	this.spinner.$container.css("margin-top", this.spacing);
	this.spinner.$container.appendTo(this.$container);
};

TableView.prototype.exitLoadingMode = function() {
	this.spinner.$container.remove();
	this.loading = false;
};	

TableView.prototype.setPadding = function(padding) {
	this.$container.css({"padding": padding})
};

///////////////////////////////
// Private
//////////////////////////////

function didSelectCell(cell, event) {
	var row = this.cells.indexOf(cell);
	if (row == -1 || cell == this.selectedCell)
		return;
	if (cell.setSelected)
		cell.setSelected(true);
	if (this.selectedCell && this.selectedCell.setSelected)
		this.selectedCell.setSelected(false);
	this.selectedCell = cell;
	this.trigger("didSelectRow", row);
}

return TableView;
});

