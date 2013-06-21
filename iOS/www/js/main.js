require(["tabBarController", "navigationController"], function(t, n) {
	controllers = [];
	for (var i = 0; i < 5; i++) {
		navigationController = new n();
		controllers.push(navigationController);
	}

	tabBarController = new t(controllers);

	newController = new n();
	newController.$container.css("background-color", "green");
	setTimeout(function() {
		controllers[0].pushController(newController, false);
	}, 3000);
	$("body").append(tabBarController.$container);

	/*var A = function() {
		this.a = 1;
	};

	var a = new A();
	var b = Object.create(a);
	console.log(a === b.prototype);*/

	/*function Parent() {
		this.a = 0;
	};

	function Child() {
		Parent.call(this);
	}

	Child.prototype = new Parent();

	parent = new Parent();
	child = new Child();
	child2 = new Child();
	parent.a = 1;
	child.a = 2;
	child2.a = 3;

	console.log(parent.a);
	console.log(child.a);
	console.log(child2.a);*/
});