var jsonfile = require('jsonfile')
var utils = require("../lib/utils");
var http = require("http");
//var https = require("https");
var https = require('follow-redirects').https;


var file = '/tmp/data.json'
var reqid = 0;



function readJsonFile(fname, callback) {

	jsonfile.readFile(fname, function (err, obj) {
		//console.dir(obj)
		if (err) {

			console.log("error", err);
			if (callback) callback(err);
			return;
		}
		//console.log("read " + obj.rows.length + " rows from file " + fname);
		if (callback) callback(obj);
	})

}


function readJsonLine(fname, idx, callback) {
	var output = {
		rows: []
	}
	if (fname.toLowerCase().indexOf(".json") == -1) {
		if (fname.toLowerCase().indexOf(".csv") > -1) fname = fname.replace(".csv", "");
		fname += ".json";
	}
	jsonfile.readFile(fname, function (err, obj) {
		//console.dir(obj)
		if (err) {

			console.log("error", err);
			if (callback) callback(err);
			return;
		}

		//console.log("read " + obj.rows.length + " rows from file " + fname);
		var found = false;
		var reset = false;
		obj.rows.forEach(function (item, rowindex) {
			var docjson = item;
			if (rowindex == idx) {
				//console.log("row:",rowindex,"docjson",docjson);
				output.rows.push(docjson);
				found = true;
			}


		})
		if (!found) {
			output.rows.push(obj.rows[0]);
			reset = true;


		}
		if (callback) callback(output, reset);
	})

}


function readJsonBuffer(fname, idx, buffersize, callback) {
	var output = {
		rows: []
	}
	if (fname.toLowerCase().indexOf(".json") == -1) {
		if (fname.toLowerCase().indexOf(".csv") > -1) fname = fname.replace(".csv", "");
		fname += ".json";
	}
	jsonfile.readFile(fname, function (err, obj) {
		//console.dir(obj)
		if (err) {

			console.log("error", err);
			if (callback) callback(err);
			return;
		}

		//console.log("read " + obj.rows.length + " rows from file " + fname);
		var found = false;
		var reset = false;
		var pushbuffer = false;
		var endindex = idx + buffersize - 1;
		var sindex = -1;
		var eindex = -1;
		obj.rows.forEach(function (item, rowindex) {
			var docjson = item;

			if (rowindex == idx) {
				sindex = rowindex;
				pushbuffer = true;
				//console.log("row:",rowindex,"docjson",docjson);

			}


			if (pushbuffer) {
				//utils.colog("pushing row");
				output.rows.push(docjson);
				found = true;
			}
			if (rowindex == endindex) {
				pushbuffer = false;
				eindex = rowindex;
			}





		})
		if (!found) {
			output.rows.push(obj.rows[0]);
			reset = true;


		}
		if (output.rows.length < buffersize) reset = true;
		//utils.colog("outputting "+output.rows.length+" rows from index "+sindex+" to "+eindex,"reset",reset);
		if (callback) callback(output, reset);
	})

}



function readJsonBufferRemote(fname, idx, buffersize, callback) {
	var url = "http://demym.altervista.org";
	var output = {
		rows: []
	}
	if (fname.toLowerCase().indexOf(".json") == -1) {
		if (fname.toLowerCase().indexOf(".csv") > -1) fname = fname.replace(".csv", "");
		fname += ".json";
	}
	http.get({
		host: url.replace("http://", ""),
		path: '/idata/' + fname
	}, function (response) {

		var body = '';
		response.on('data', function (d) {
			body += d;
		});
		response.on('end', function () {
			//console.log("got response from "+url);
			// Data reception is done, do whatever with it!
			var parsed = JSON.parse(body);
			var obj = parsed;
			//console.log("read " + obj.rows.length + " rows from " + url + "/idata/" + fname);

			var found = false;
			var reset = false;
			var pushbuffer = false;
			var endindex = idx + buffersize - 1;
			var sindex = -1;
			var eindex = -1;

			obj.rows.forEach(function (item, rowindex) {
				var docjson = item;

				if (rowindex == idx) {
					sindex = rowindex;
					pushbuffer = true;
					//console.log("row:",rowindex,"docjson",docjson);

				}


				if (pushbuffer) {
					//utils.colog("pushing row");
					output.rows.push(docjson);
					found = true;
				}
				if (rowindex == endindex) {
					pushbuffer = false;
					eindex = rowindex;
				}





			})
			if (!found) {
				output.rows.push(obj.rows[0]);
				reset = true;


			}
			if (output.rows.length < buffersize) reset = true;
			//utils.colog("outputting "+output.rows.length+" rows from index "+sindex+" to "+eindex,"reset",reset);
			if (callback) callback(output, reset);
			return;
		});

	});

	return;


	jsonfile.readFile(fname, function (err, obj) {
		//console.dir(obj)
		if (err) {

			console.log("error", err);
			if (callback) callback(err);
			return;
		}

		//console.log("read " + obj.rows.length + " rows from file " + fname);
		var found = false;
		var reset = false;
		var pushbuffer = false;
		var endindex = idx + buffersize - 1;
		var sindex = -1;
		var eindex = -1;
		obj.rows.forEach(function (item, rowindex) {
			var docjson = item;

			if (rowindex == idx) {
				sindex = rowindex;
				pushbuffer = true;
				//console.log("row:",rowindex,"docjson",docjson);

			}


			if (pushbuffer) {
				//utils.colog("pushing row");
				output.rows.push(docjson);
				found = true;
			}
			if (rowindex == endindex) {
				pushbuffer = false;
				eindex = rowindex;
			}





		})
		if (!found) {
			output.rows.push(obj.rows[0]);
			reset = true;


		}
		if (output.rows.length < buffersize) reset = true;
		//utils.colog("outputting "+output.rows.length+" rows from index "+sindex+" to "+eindex,"reset",reset);
		if (callback) callback(output, reset);
	})

}


function readJsonBufferRemoteHttps(url, idx, buffersize, callback) {

	//	var url = "http://demym.altervista.org";

	var output = {
		rows: []
	}

	/*	if (fname.toLowerCase().indexOf(".json") == -1) {
			if (fname.toLowerCase().indexOf(".csv") > -1) fname = fname.replace(".csv", "");
			fname += ".json";
		}*/

	var options = {
		host: 'ibm.box.com',
		port: 443,
		path: url,
		method: 'GET'
	}

	//making the https get call
	var hdata;
	var datacount = 0;
	var getReq = https.request(options, function (res) {
		//console.log("status code: ", res.statusCode);
		res.on('data', function (data) {
			//console.log(data);
			var udata = data.toString('utf8');
			hdata += udata;
			datacount++;
			//console.log("datacount",datacount);
		});

		res.on('end', function () {

			//console.log('end');
			//console.log("got https ");
			hdata = hdata.replace("undefined", "");

			var isValid = utils.isJson(hdata);
			//console.log("isValidJson", isValid);

			if (isValid) {


				var json = JSON.parse(hdata);
				var obj = json;
				//console.log("read " + obj.rows.length + " rows from " + url);

				var found = false;
				var reset = false;
				var pushbuffer = false;
				var endindex = idx + buffersize - 1;
				var sindex = -1;
				var eindex = -1;

				obj.rows.forEach(function (item, rowindex) {
					var docjson = item;

					if (rowindex == idx) {
						sindex = rowindex;
						pushbuffer = true;
						//console.log("row:",rowindex,"docjson",docjson);

					}


					if (pushbuffer) {
						//utils.colog("pushing row");
						output.rows.push(docjson);
						found = true;
					}
					if (rowindex == endindex) {
						pushbuffer = false;
						eindex = rowindex;
					}





				})
				if (!found) {
					output.rows.push(obj.rows[0]);
					reset = true;


				}
				if (output.rows.length < buffersize) reset = true;
				//utils.colog("outputting "+output.rows.length+" rows from index "+sindex+" to "+eindex,"reset",reset);
				if (callback) callback(output, reset);

				callback(json);
			} else {

				console.log("not valid json returned from https !!! url: ",url);
				var ret = {
					error: "Remote https file " + url + " is not valid JSON",
					rows: []

				}
				callback(ret);


			}
		});

	});

	//end the request
	getReq.end();


	getReq.on('error', function (err) {
		console.log("Error: ", err);
		callback(err);
	});


	/*

		http.get({
			host: url.replace("http://", ""),
			path: '/idata/' + fname
		}, function (response) {
			
			var body = '';
			response.on('data', function (d) {
				body += d;
			});
			response.on('end', function () {
				//console.log("got response from "+url);
				// Data reception is done, do whatever with it!
				var parsed = JSON.parse(body);
				var obj=parsed;
				console.log("read " + obj.rows.length + " rows from " + url+"/idata/"+fname);
				
				var found = false;
				var reset = false;
				var pushbuffer = false;
				var endindex = idx + buffersize - 1;
				var sindex = -1;
				var eindex = -1;
				
				obj.rows.forEach(function (item, rowindex) {
					var docjson = item;

					if (rowindex == idx) {
						sindex = rowindex;
						pushbuffer = true;
						//console.log("row:",rowindex,"docjson",docjson);

					}


					if (pushbuffer) {
						//utils.colog("pushing row");
						output.rows.push(docjson);
						found = true;
					}
					if (rowindex == endindex) {
						pushbuffer = false;
						eindex = rowindex;
					}





				})
				if (!found) {
					output.rows.push(obj.rows[0]);
					reset = true;


				}
				if (output.rows.length < buffersize) reset = true;
				//utils.colog("outputting "+output.rows.length+" rows from index "+sindex+" to "+eindex,"reset",reset);
				if (callback) callback(output, reset);
				return;
			});

		});

		return;

	  */
}







function readCsvLine(fname, idx, callback) {


	var fields = [];
	var inserted = 0;
	var linesread = 0;
	var readindex = 0;
	var output = {
		rows: []
	}

	var fs = require('fs'),
		readline = require('readline');

	var rd = readline.createInterface({
		input: fs.createReadStream(fname),
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
				if (campo == "type") {
					//console.log("item",item);

					sitem = sitem.replace('\"', '');
					sitem = sitem.replace('\"', '');
				}
				docjson[campo] = sitem;

				if (item.trim() != "") foundnonblank = true;

			})
			if (foundnonblank) {
				readindex++;

				if (readindex == idx) {
					output.rows.push(docjson);
					rd.close();

				}
				inserted++;
				//console.log("values",values.length);
				//output.rows.push(docjson);

			}


		}

	});

	rd.on("close", function () {
		console.log("firnuto, documents n.", output.rows.length, "line index", idx);
		//fs.writeFile('data/lu30.json', JSON.stringify(output,null, ' '));
		//fs.writeFile('data/lu30.json', JSON.stringify(output));
		callback(output)
		/*dbs.insert_bulk("lu30",output.rows,function(data){
			console.log("bulk insert completed");
		})*/

	})
}

function readCsvBuffer(fname, idx, buffersize, callback) {

	var closedmanually = false;
	var fields = [];
	var inserted = 0;
	var linesread = 0;
	var readindex = 0;
	var csvrow = -1;
	var output = {
		rows: []
	}

	var fs = require('fs'),
		readline = require('readline');

	var rd = readline.createInterface({
		input: fs.createReadStream(fname),
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
				if (campo == "type") {
					//console.log("item",item);

					sitem = sitem.replace('\"', '');
					sitem = sitem.replace('\"', '');
				}
				docjson[campo] = sitem;

				if (item.trim() != "") foundnonblank = true;

			})
			if (foundnonblank) {
				csvrow++;
				var readIt = false;
				if (csvrow >= idx) readIt = true;
				if (readindex >= buffersize) {
					closedmanually = true;
					rd.close();

				}

				if (readIt) {
					readindex++;
					output.rows.push(docjson);
					//rd.close();
					inserted++;

				}




				//console.log("values",values.length);
				//output.rows.push(docjson);

			}


		}

	});

	rd.on("close", function () {
		console.log("firnuto, documents n.", output.rows.length, "line index", idx);
		//fs.writeFile('data/lu30.json', JSON.stringify(output,null, ' '));
		//fs.writeFile('data/lu30.json', JSON.stringify(output));
		callback(output, closedmanually)
		/*dbs.insert_bulk("lu30",output.rows,function(data){
			console.log("bulk insert completed");
		})*/

	})
}



function readCsvFile(fname, callback) {


	var fields = [];
	var inserted = 0;
	var linesread = 0;
	var output = {
		rows: []
	}

	var fs = require('fs'),
		readline = require('readline');

	var rd = readline.createInterface({
		input: fs.createReadStream(fname),
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
				if (campo == "type") {
					//console.log("item",item);

					sitem = sitem.replace('\"', '');
					sitem = sitem.replace('\"', '');
				}
				docjson[campo] = sitem;

				if (item.trim() != "") foundnonblank = true;

			})
			if (foundnonblank) {
				inserted++;
				//console.log("values",values.length);
				output.rows.push(docjson);

			}


		}

	});

	rd.on("close", function () {
		console.log("firnuto, documents n.", inserted);
		//fs.writeFile('data/lu30.json', JSON.stringify(output,null, ' '));
		//fs.writeFile('data/lu30.json', JSON.stringify(output));
		callback(output)
		/*dbs.insert_bulk("lu30",output.rows,function(data){
			console.log("bulk insert completed");
		})*/

	})
}


function readJsonFileRemoteHttps(url, callback) {



	//	var url = "http://demym.altervista.org";

	var output = {
		rows: []
	}

	/*	if (fname.toLowerCase().indexOf(".json") == -1) {
			if (fname.toLowerCase().indexOf(".csv") > -1) fname = fname.replace(".csv", "");
			fname += ".json";
		}*/

	var options = {
		host: 'ibm.box.com',
		port: 443,
		path: url,
		method: 'GET'
	}

	//making the https get call
	var hdata;
	var datacount = 0;
	reqid++;
	var rid = reqid;
	console.log(new Date(), "https get request " + formatReqId(rid));
	var getReq = https.request(options, function (res) {
		//console.log("status code: ", res.statusCode);
		res.on('data', function (data) {
			//console.log(data);
			var udata = data.toString('utf8');
			hdata += udata;
			datacount++;
			if ((datacount % 5000) == 0) console.log("datacount for rid", formatReqId(rid), ":", datacount);
		});

		res.on('end', function () {

			//console.log('end');
			//console.log(new Date(), "https response for req", formatReqId(rid));
			hdata = hdata.replace("undefined", "");

			var isValid = utils.isJson(hdata);
			//console.log("isValidJson", isValid);

			if (isValid) {


				var json = JSON.parse(hdata);
				var obj = json;
				//console.log("read " + obj.rows.length + " rows from " + url);




				callback(json);
			} else {
				console.log("not valid json returned from https !! url",url);
				var ret = {
					error: "Remote https file " + url + " is not valid JSON",
					rows: []

				}
				callback(ret);
			}
		});

	});

	//end the request
	getReq.end();


	getReq.on('error', function (err) {
		console.log("Error: ", err);
		var ret = {
			error: err,
			rows: []

		}
		callback(ret);
	});


	/*

		http.get({
			host: url.replace("http://", ""),
			path: '/idata/' + fname
		}, function (response) {
			
			var body = '';
			response.on('data', function (d) {
				body += d;
			});
			response.on('end', function () {
				//console.log("got response from "+url);
				// Data reception is done, do whatever with it!
				var parsed = JSON.parse(body);
				var obj=parsed;
				console.log("read " + obj.rows.length + " rows from " + url+"/idata/"+fname);
				
				var found = false;
				var reset = false;
				var pushbuffer = false;
				var endindex = idx + buffersize - 1;
				var sindex = -1;
				var eindex = -1;
				
				obj.rows.forEach(function (item, rowindex) {
					var docjson = item;

					if (rowindex == idx) {
						sindex = rowindex;
						pushbuffer = true;
						//console.log("row:",rowindex,"docjson",docjson);

					}


					if (pushbuffer) {
						//utils.colog("pushing row");
						output.rows.push(docjson);
						found = true;
					}
					if (rowindex == endindex) {
						pushbuffer = false;
						eindex = rowindex;
					}





				})
				if (!found) {
					output.rows.push(obj.rows[0]);
					reset = true;


				}
				if (output.rows.length < buffersize) reset = true;
				//utils.colog("outputting "+output.rows.length+" rows from index "+sindex+" to "+eindex,"reset",reset);
				if (callback) callback(output, reset);
				return;
			});

		});

		return;

	  */
}



function formatReqId(reqid) {
	return utils.Right("000000" + reqid, 6);
}



exports.readJsonFile = readJsonFile;
exports.readJsonFileRemoteHttps = readJsonFileRemoteHttps;
exports.readJsonLine = readJsonLine;

exports.readJsonBuffer = readJsonBuffer;
exports.readJsonBufferRemote = readJsonBufferRemote;
exports.readJsonBufferRemoteHttps = readJsonBufferRemoteHttps;
exports.readCsvFile = readCsvFile;
exports.readCsvLine = readCsvLine;
exports.readCsvBuffer = readCsvBuffer;