var requireArray = [
	"helpers/eventEmitter",
	"views/spinner"
];

define(requireArray, function(EventEmitter, Spinner) {
function TableView() {
	EventEmitter.call(this);

	this.$container = $("<div>");
	this.$container.addClass("full-size");
	this.$container.css({"overflow": "scroll", "-webkit-overflow-scrolling": "touch"});
	this.loading = false;
	this.spinner = new Spinner();
	this.spinner
	this.spinner.$container.css({"margin": "0 auto 20px auto"});
	this.spacing = 0;
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

TableView.prototype.setBackgroundColor = function(color) {
	this.$container.css("background-color", color);
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
	cell.$container.appendTo(this.$container);
	if (this.cells.length != 0)
		cell.$container.css("margin-top", this.spacing);
	this.cells.push(cell);
};

TableView.prototype.removeRowAtIndex = function(i) {
	if (i < this.cells.length)
		this.cells[i].$container.remove();
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

//didSelectRowAtIndex
return TableView;
});