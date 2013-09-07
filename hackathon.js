var express = require('express'),
	app = express(),
	fs = require('fs'),
	middleware = require('./middleware'),
	engines = require('consolidate'),
	handlebars = require('handlebars'),
	portNum = 3000;

app.use('/static', express.static('static'));
//app.register('.html', require('handlebars'));

app.use(express.bodyParser());

app.use(express.methodOverride());

app.set('views', __dirname + '/templates');
app.set('view engine', 'html');
//app.set('view options', { layout: true });
app.engine('.html', engines.handlebars);

fs.readFile(__dirname + '/templates/navbar.html', function (err, data) {
	if (err) throw err;
	handlebars.registerPartial('navbar', data.toString());
});

fs.readFile(__dirname + '/templates/partials/headincludes.html', function (err, data) {
	if (err) throw err;
	handlebars.registerPartial('headincludes', data.toString());
});

fs.readFile(__dirname + '/templates/partials/footincludes.html', function (err, data) {
	if (err) throw err;
	handlebars.registerPartial('footincludes', data.toString());
});



app.use(app.router);

app.use(middleware.clientErrorHandler);

app.get('/', function(req, res, next) {
	res.render('test.html', {test: 'myparam'});
});

app.get('/test', function(req, res, next) {
	res.render('test.html', {test: 'myparam'});
});

app.get('/register', function(req, res, next) {
	res.render('register.html');
});

app.get('/submissions', function(req, res, next) {
	res.render('register.html');
});

app.get('/info', function(req, res, next) {
	res.render('info.html');
});


app.listen(portNum);
console.log('Listening on port', portNum);