var express 	= require('express');
var app 		= express();
var bodyParser 	= require('body-parser');
var expressWs 	= require('express-ws')(app);
var baseRoutes 	= require('./routes/base.js');
var userRoutes 	= require('./routes/users.js');
var exRoutes	= require('./routes/explorer.js');


// Setup the views
app.set('view engine', 'jade');
app.set('views', './views'); 

// The public asset directory
app.use(express.static('public'));
	
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


// Setup routes for our app
app.use('/app', baseRoutes);
app.use('/user', userRoutes);
app.use('/ex', exRoutes);


app.get('/', function(req, res, next){
	res.redirect('/app/');
});
 

app.ws('/', function(ws, req) {
  ws.on('message', function(msg) {
    console.log(msg);
  });
  console.log('socket', req.testing);
});
 

// Start the app
var port = process.port || 3000;
app.listen(port);