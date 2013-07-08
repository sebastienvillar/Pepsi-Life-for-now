// define(function() {
// 	function TableView() {
// 		this._classes = {};
// 		this.delegate = null;
// 	}

// 	_prototype = TableView.prototype;
// 	_prototype.registerCell = function(Class) {
// 		if (typeof this._classes.Class.name === "undefined") {
// 			this._classes[Class.name] = Class;
// 		}
// 	};

// 	_prototype.cellForClassName = function(className) {
// 		return this._classes[className].new();
// 	}

// 	_prototype.pushCells = function(cells) {

// 	}

// 	_prototype.removeCells = function(cells) {
// 		if (typeof cells === "undefined") {
// 			//remove all
// 		}
// 		else {
// 			//remove only those in the array provided
// 		}
// 	}

// 	//delegate
// 	//didSelectRowAtIndex
// 	//didScrollToBottom
// });