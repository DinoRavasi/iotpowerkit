var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var WIoT = require("ibmiotf");
var socketio=require('socket.io');

var routes = require('./routes/index');
var users = require('./routes/users');
var dbs = require('./routes/dbs');
var fdbs = require('./routes/filedbs');
var dashboard = require('./routes/dashboard');
var simulation = require('./routes/simulation');
var login = require('./routes/login');
var iot = require('./routes/iot');
var dash = require("./lib/dashlib");
var utils = require("./lib/utils");
var db2 = require("./lib/dashdb");


var app = express();


var sock;

/*
var apikey = "a-qc7qlc-7x4vfeo0i6";
var apitoken = "VIDMNZUlj6mzm(QyQ6";

var buffersize=5;
var evbuffersize=10;
var eventbuffer=[];
var buffercount=0;
var evbuffercount=0;

var iot={};
iot.APIKey = apikey;
iot.AuthToken = apitoken;
iot.OrgId = "qc7qlc";
var totcount=0;

var appClient = new WIoT.IotfApplication({
        "org": iot.OrgId,
        "id": Date.now() + "",
        "domain": "internetofthings.ibmcloud.com",
        "auth-key": iot.APIKey,
        "auth-token": iot.AuthToken
      })
appClient.connect();

appClient.on("connect", function () {
 
   //console.log("connected to Watson IoT !");
   appClient.subscribeToDeviceEvents();
});

appClient.on("error", function (err) {
    console.log("Error : "+err);
});

appClient.on("deviceEvent", function (deviceType, deviceId, eventType, format, payload) {
 
    
	buffercount++;
	evbuffercount++;
	totcount++;
	utils.colog(buffercount+" - Device Event from :: "+deviceType+" : "+deviceId+" of event "+eventType+" with payload : "+payload);
	var pl=JSON.parse(payload);
	if (eventbuffer.length==10){
		eventbuffer.shift();
	}
	eventbuffer.push(pl.d.acceleration_x);
	//eventbuffer.push(totcount);
	if (buffercount==buffersize){
		io.emit('iot_deviceevent',{events: eventbuffer});
		//io.emit('iot_deviceevent',{pl: pl});

		buffercount=0;
		//eventbuffer=[];

	}

	





});

*/


//events retrieve event



// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
	extended: false
}));
app.use(cookieParser());
//app.use(express.static(path.join(__dirname, 'public_ion')));
app.use(express.static(path.join(__dirname, 'public_dino')));
//Exposing scripts to the web app
app.use(express.static(path.join(__dirname, 'node_modules/angular')));
//app.use(express.static(path.join(__dirname ,'node_modules/angular-nvd3' )));//
//app.use(express.static(path.join(__dirname ,'node_modules/angular-ui-router' )));
app.use(express.static(path.join(__dirname, 'node_modules/ibmiotf/dist')));

app.use('/', routes);
app.use('/users', users);
app.use('/dashboard', dashboard);
app.use('/simulation', simulation);
app.use('/iot', iot);
app.use('/login', login);


app.get("/device/:dbname", function (req, res) {
	var dbname = req.params.dbname;
	dbs.list(dbname, function (data) {
		utils.colog("got db " + dbname + ", rows", data.rows.length);
		res.send(data);


	})

})

app.get("/setdashtimer/:status",function(req,res){
    var status=req.params.status.toLowerCase().trim();
    var retvalue={
        msg: "DashTimer has been turned ON - interval setted to "+dashTimer.interval
    }
    if (status=="on") {
		setDashTimer(true);
		utils.colog(retvalue.msg);
	}
    if (status=="off") {
        setDashTimer(false);
        retvalue.msg="DashTimer has been turned OFF";
		utils.colog(retvalue.msg);
    }
	res.send(retvalue);

})


app.get("/importcsv2/:csvfilename/:start/:buffersize",function(req,res){
	var csvfilename = req.params.csvfilename;
	var start=req.params.start;
	var buffersize=req.params.buffersize;


	for (var i=0; i<100; i++) {
		var startrec=i*buffersize;
		console.log("startrec",startrec);

	fdbs.readCsvBuffer("data/"+csvfilename,startrec,buffersize,function(data,cm){
		console.log(data);
		data.rowlength=data.rows.length;
		setTimeout(function(){}, 3000);
		dbs.insert_bulk("lu30bis",data.rows,function(dbdata){
			console.log("bulk insert completed");
		})
		
	})

	setTimeout(function(){}, 3000);

}
res.send("done");

})


app.get("/importcsv/:csvfilename", function (req, res) {
	var csvfilename = req.params.csvfilename;
	var separator="|";
	if (req.query.separator) separator=req.query.separator;

	if (csvfilename.indexOf(".csv")==-1) csvfilename=csvfilename+".csv";

	var fields = [];
	var inserted = 0;
	var linesread = 0;
	var output = {
		rows: []
	}

	var fs = require('fs'),
		readline = require('readline');

	var rd = readline.createInterface({
		input: fs.createReadStream('data/'+csvfilename),
		output: process.stdout,
		terminal: false
	});

	rd.on('line', function (line) {

		linesread++;
		if (linesread == 1) {
			console.log(line);
			fields = line.split(separator);

			console.log(fields.length + " fields found");



		} else {

			var values = line.split(separator);

			var docjson = {};
			var foundnonblank = false;

			values.forEach(function (item, idx) {
				var campo = fields[idx].replaceAll(" ","");
				//console.log(campo);
				var sitem = item;
				if (campo == "type") {
					//console.log("item",item);

					sitem=sitem.replaceAll('\"','');

					/*sitem = sitem.replace('\"', '');
					sitem = sitem.replace('\"', '');*/
				}
				docjson[campo] = sitem;

				if (item.trim() != "") foundnonblank = true;

			})
			if (foundnonblank) {
				inserted++;
				console.log(inserted);
				//console.log("values",values.length);
				if (inserted < 130000) output.rows.push(docjson);

			}


		}

	});

	rd.on("close", function () {
		console.log("firnuto, documents n.", inserted);
		//fs.writeFile('data/lu30.json', JSON.stringify(output,null, ' '));
		var jsonfilename=csvfilename.replace(".csv",".json");
		fs.writeFile('data/'+jsonfilename, JSON.stringify(output));
		res.send(output);
		/*dbs.insert_bulk("lu30",output.rows,function(data){
			console.log("bulk insert completed");
		})*/

	})
});


app.get("/importcsvtofile/:csvfilename", function (req, res) {

	var csvfilename = req.params.csvfilename;
	var fields = [];
	var inserted = 0;
	var linesread = 0;
	var output = {
		rows: []
	}

	var fs = require('fs'),
		readline = require('readline');

	var sout = '{ "rows": [';
	fs.writeFile('data/' + csvfilename + '.json', sout);



	var rd = readline.createInterface({
		input: fs.createReadStream('data/' + csvfilename + '.csv'),
		output: process.stdout,
		terminal: false
	});

	rd.on('line', function (line) {

		linesread++;
		if (linesread == 1) {
			console.log(line);
			fields = line.split("|");

			console.log(fields.length + " fields found");



		} else {

			var values = line.split("|");

			var docjson = {};
			var foundnonblank = false;

			values.forEach(function (item, idx) {
				var campo = fields[idx];
				//console.log(campo);
				var sitem = item;
				
					//console.log("item",item);

					sitem=sitem.replaceAll('\"','');
					/*sitem = sitem.replace('\"', '');
					sitem = sitem.replace('\"', '');
					sitem = sitem.replace('\"', '');
					sitem = sitem.replace('\"', '');
					sitem = sitem.replace('\"', '');*/
					
				
				docjson[campo] = sitem;

				if (item.trim() != "") foundnonblank = true;

			})
			if (foundnonblank) {
				inserted++;
				//console.log("values",values.length);


				console.log(inserted);
				var sj = JSON.stringify(docjson);

				//if (inserted<10) console.log(sj);

					var sout = "";
					if (sj.indexOf("{") == -1) sj = "{" + sj + "}";
					if (inserted > 1) sout += ",";
					sout += sj;
					fs.appendFileSync('data/' + csvfilename + '.json', sout);

		

				//output.rows.push(docjson);

			}


		}

	});

	rd.on("close", function () {
		sout += "]}";

		console.log("firnuto, documents n.", inserted);
		//fs.writeFile('data/lu30.json', JSON.stringify(output,null, ' '));
		//fs.writeFile('data/'+csvfilename+'.json', sout);
		fs.appendFileSync('data/' + csvfilename + '.json', "]}");
		res.send("done");
		/*dbs.insert_bulk("lu30",output.rows,function(data){
			console.log("bulk insert completed");
		})*/

	})
});

app.get("/readfile/:fname", function (req, res) {
	var fname = req.params.fname;
	if (fname.indexOf(".json")==-1) fname=fname+".json";
	fname = "data/" + fname;
	fdbs.readJsonFile(fname, function (data) {
		console.log(data.rows.length)
		res.send(data);

	})

})


app.get("/db2",function(req,res){

	db2.open(function(data){

		var q="select * from TimeHistory_H1000_LU30";
		//q="select * from attrib_cassonetto";
		db2.query(q,function(qdata){
			
			res.send(qdata);

		})

		

	})

})


// catch 404 and forward to error handler
app.use(function (req, res, next) {
	var err = new Error('Not Found');
	err.status = 404;
	next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
	app.use(function (err, req, res, next) {
		res.status(err.status || 500);
		res.render('error', {
			message: err.message,
			error: err
		});
	});
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
	res.status(err.status || 500);
	res.render('error', {
		message: err.message,
		error: {}
	});
});


var port = parseInt(process.env.VCAP_APP_PORT, 10) || 3000;
global.io = socketio.listen(app.listen(port,function(){

	  console.log("IBM DBGIoT Server ver. 1.0");
	  console.log("Listening on port "+port);
	  //app.set('socketio', io);
	  //console.log("utils.io",utils.io);

}));



io.sockets.on('connection', function (socket) {
	sock=socket;
	console.log("socket "+socket.id+" connected");
	socket.emit('getclientspecs', {id: socket.id});
});


String.prototype.replaceAll = function (find, replace) {
    var str = this;
    return str.replace(new RegExp(find, 'g'), replace);
};


module.exports = app;