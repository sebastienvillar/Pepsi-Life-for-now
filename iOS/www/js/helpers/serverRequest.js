
define(["helpers/constants"], function(Constants) {
	var ServerRequest = function(){
		this.path = null;
		this.method = "GET";
		this.onSuccess = null;
		this.onError = null;
		this.data = null;
	};

	ServerRequest.prototype.execute = function() {
		if (this.path && this.method && this.onSuccess && this.onError) {
			var ajaxRequest = {
				url: Constants.SERVER_URL + this.path + "?api_key=" + Constants.SERVER_API_KEY,
				type: this.method,
				success: this.onSuccess,
				error: function(request, message, exception) {this.onError(request.status, message)}.bind(this),
				data: this.data,
				cache: false,
				contentType: "application/json",
				dataType: "json",
				username: "testuser",
				password: "testuser"
			};
			$.ajax(ajaxRequest);
		}
	}

	return ServerRequest;
});