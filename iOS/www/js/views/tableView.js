var requireArray = [
	"helpers/eventEmitter",
	"views/spinner"
];

define(requireArray, function(EventEmitter, Spinner) {
function TableView() {
	EventEmitter.call(this);

	this.$container = $("<div>");
	this.$container.css({"overflow": "scroll", "-webkit-overflow-scrolling": "touch"});
	this.$cellsContainer = $("<div>");
	this.$cellsContainer.appendTo(this.$container);
	this.loading = false;
	this.spinner = new Spinner();
	this.spinner.$container.css({"margin": "0 auto 20px auto"});
	this.spacing = 0;
	this.selectedCell = null;
	this.cells = [];
	this.firstVisibleRow = 0;

	//Events

	this.$cellsContainer.scroll(function(e) {
		if (this.$cellsContainer.outerHeight() + this.$cellsContainer.scrollTop() == this.$cellsContainer[0].scrollHeight) {
			this.trigger("didScrollToBottom");
		}

		var top = $(window).scrollTop();
    	var bottom = top + $(window).height();

    	var firstVisibleCellSeen = false;
    	var firstIndex = this.firstVisibleRow > 0 ? this.firstVisibleRow - 1 : 0
		for (var i = firstIndex; i < this.cells.length; i++) {
			var cell = this.cells[i];
			var cellTop = cell.$container.offset().top;
    		var cellBottom = cellTop + cell.$container.outerHeight();
    		if ((cellBottom <= bottom) && (cellTop >= top)) {
    			if (firstVisibleCellSeen = false)
    				this.firstVisibleRow = i;
    			firstVisibleCellSeen = true;
    			this.trigger("rowIsVisible", i)
    		}
    		else if (firstVisibleCellSeen)
    			return;

		}
	}.bind(this));
}

TableView.prototype = new EventEmitter();

TableView.prototype.setHeader = function($header) {
	this.$container.prepend($header);
};

TableView.prototype.setCellsSpacing = function(spacing) {
	for (var i in this.cells) {
		var cell = this.cells[i];
		if (i != 0)
			cell.$container.css("margin-top", spacing);
	}
	this.spacing = spacing;
};

TableView.prototype.pushCell = function(cell) {
	cell.$container.appendTo(this.$cellsContainer);
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
	this.spinner.$container.appendTo(this.$cellsContainer);
};

TableView.prototype.exitLoadingMode = function() {
	this.spinner.$container.remove();
	this.loading = false;
};	

TableView.prototype.cellForRow = function(row) {
	if (row >= 0 && row < this.cells.length)
		return this.cells[row];
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

