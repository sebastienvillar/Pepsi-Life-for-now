
define(["helpers/constants"], function(Constants) {
	var ServerRequest = function(){
		this.path = null;
		this.method = "GET";
		this.onSuccess = null;
		this.onError = null;
		this.data = {};
	};

	ServerRequest.prototype.execute = function() {
		var username = "testuser";
		var password = "testuser";
		if (this.path && this.method && this.onSuccess && this.onError) {
			var ajaxRequest = {
				url: "https://" + username + ":" + password + "@" + Constants.SERVER_URL + this.path + "?api_key=" + Constants.SERVER_API_KEY + "&method=" + this.method,
				success: function(json) {
					if (json.status == 200) {
						this.onSuccess(json.body);
					}
					else {
						this.onError(json.status, json.message);
					}
				}.bind(this),
				error: function(request, message, exception) {this.onError(request.status, message)}.bind(this),
				data: this.data,
				cache: false,
				contentType: "application/json",
				dataType: "jsonp",
				crossDomain: true
			};
			$.ajax(ajaxRequest);
		}
	}

	return ServerRequest;
});