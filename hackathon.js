var express = require('express'),
	app = express(),
	fs = require('fs'),
	middleware = require('./middleware'),
	engines = require('consolidate'),
	handlebars = require('handlebars'),
	redis = require('redis'),
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

app.post('/posttest', function(req, res, next) {
	res.send('500', 'post test not supported');
	return;
	if ( (req.body.name) && (req.body.netids) && (req.body.desc) ) {
		var uniqueId = new Date().getTime().toString(),
		    netIdSplit = req.body.netids.split(','),
		    netIdHash = {},
		    newNetIdSplit = [],
		    redisClient = redis.createClient();

		console.log('name', req.body.name, 'netids', req.body.netids, 'desc', req.body.desc);

		if (netIdSplit.length < 1) {
			res.send(500, 'no netids given');
			return;			
		}

		// Duplicate pruning
		for(var i = 0; i < netIdSplit.length; i++) {
			if (!(netIdSplit[i] in netIdHash)) {
				netIdHash[netIdSplit[i]] = true;
				newNetIdSplit.push(netIdSplit[i]);
			}
			
		}

		console.log('duplicate pruning is done', newNetIdSplit);


		for(var i = 0; i < newNetIdSplit.length; i++) {
			console.log('haha', newNetIdSplit[i]);
			redisClient.sismember('netids', 'ab', function (err, boolRes) {
				console.log('netid', newNetIdSplit[i], 'boolRes', boolRes);
				if (boolRes) {
					res.send(500, 'NetID is already added to an existing project');
					redisClient.quit();
					return;
				}
				else {
					redisClient.sadd('netids', newNetIdSplit[i]);
				}
			});
		}

		console.log('netid stuff', newNetIdSplit);

		redisClient.lpush('submissions', uniqueId);
		redisClient.lpush('submission:'+uniqueId+':name', req.body.name);
		for(var i = 0; i < newNetIdSplit.length; i++) {
			redisClient.lpush('submission:'+uniqueId+':netids', newNetIdSplit[i]);
		}
		redisClient.lpush('submission:'+uniqueId+':desc', req.body.desc);
		redisClient.quit();
		res.send('success');
	}
	else {
		res.send(500, 'Did not specify name, netids, and description properly!');
	}
});


app.listen(portNum);
console.log('Listening on port', portNum);