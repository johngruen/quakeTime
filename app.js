var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  , http = require('http')
  , path = require('path');
var fs = require('fs');
var csv = require('csv');

var app = express()
, server = require('http').createServer(app)
, io = require('socket.io').listen(server);

app.configure(function(){
app.set('host','localhost');
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.favicon(__dirname + '/public/images/favicon.ico')); 
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.cookieParser('your secret here'));
  app.use(express.session());
  app.use(app.router);
  app.use(require('stylus').middleware(__dirname + '/public'));
  app.use(express.static(path.join(__dirname, 'public')));
});

server.listen(3000)

app.configure('development', function(){
  app.use(express.errorHandler());
});

app.get('/', routes.index);
app.get('/users', user.list);


var dataSet = [];
var setDate = new Date();
var setDay = setDate.getDay();


console.log(__dirname);

function recreateVar() {
	var file = fs.createWriteStream(__dirname +"/data/quake.csv");
	var request = http.get("http://earthquake.usgs.gov/earthquakes/catalogs/eqs7day-M1.txt", function(response) {
	  response.pipe(file);	
	});
	setTimeout(function(){
	csv()
	.from.stream(fs.createReadStream(__dirname + '/data/quake.csv'))
	.on('record', function(row,index){
		if (index > 0) {
					//console.log(row[3].getDay());
		z = {
	
			src:row[0],
			date:row[3],
			lat:row[4],
			lon:row[5],
			mag:row[6],
			depth:row[7],
			nst:row[8],
			reg:row[9]
		}
		dataSet.push(z);
	}
	})
	.on('end',function(){
		console.log(dataSet.length);
	});
	},5000);
	
	setTimeout(recreateVar,3600*1000);
}

recreateVar();

io.sockets.on('connection', function (socket) { 
	socket.emit('entrance');
	socket.on('ready',function(){
		socket.emit('sendQuakeData',{data:dataSet});
	})
});


