function clientErrorHandler(err, req, res, next) {
	res.send(500, "<h1>Error: " + err + "</h1>" + '<br />' + err.stack);
}

module.exports.clientErrorHandler = clientErrorHandler;