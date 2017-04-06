var express = require('express');
var https = require("https");
var request = require("request");
var querystring = require('querystring');
var router = express.Router();
var dbs = require("../routes/dbs");
var utils = require("../lib/utils");
var uuid = require('node-uuid');
var jwt = require('jsonwebtoken');
var superSecret = "inespugnabile"
var tokenExpireMinutes = 60;
var dbname = "users";

var blueclient_id = "ZDY4MTVjODItMjdlMi00";
var blueclient_secret = "ZWZhOTI0ZDQtZmU3ZS00";



router.post('/', function (req, res) {


	//utils.colog(JSON.stringify(req.body));

	var email = req.body.email;
	var psw = "";

	if (req.body.password) psw = req.body.password;

	utils.colog("login attempt by user " + email)

	var logginuser = {}

	var loggedin = false;
	var sessionid = req.query.sessionId;

	var role = "";
	var company = "";
	var customers = "";
	var customer = "";
	var firstname = "";
	var lastname = "";
	var userid = "";


	dbs.list("user_starter_kit", function (data) {

		utils.colog("data",data);
        
		if (data.error) {

			res.send(data.error);
			return;


		} else {

			if (data.rows) {

				for (var i = 0; i < data.rows.length; i++) {
					var user = data.rows[i].doc;
					var row = data.rows[i].doc;

					console.log(user)
					var password = "";
					if (user.password) password = user.password;


					var validUser = false;

					//console.log(user.email+" - "+user.password+" - "+user.useractive)

					if ((email.trim() == user.email.trim()) && (psw.trim() == password.trim()) ) validUser = true;
					if (validUser) {
						loggedin = true;
						if (row.nome) nome=row.nome;
					    if (row.cognome) cognome=row.cognome;
						if (row.maximoactivation) maximoactivation = row.maximoactivation ;					
					}
				}
			}

			if (loggedin) {
				utils.consolog("User " + email + " successfully logged in to application");
			
				res.send({
					"loggedin": "true",
					"email": email,
					"nome": nome,
					"cognome": cognome,
					"maximoactivation": maximoactivation
				});
			} else {
				console.log("Login failed for user " + email);
				res.send({
					"loggedin": "false"
				});
			}


		}
	});

});



router.post("/blueid_old", function (req, res) {

	var email = req.query.email;
	var psw = req.query.psw;

	var host = "idaas.iam.ibm.com";
	var path = "/idaas/oidc/endpoint/default/token";
	var url = "https://" + host + path;
	var auth = 'Basic ' + new Buffer(blueclient_id + ':' + blueclient_secret).toString('base64');

	var post_data = {
		grant_type: "password",
		scope: "openid",
		username: email,
		password: psw

	}

	var pdata = querystring.stringify(post_data);

	var headers = {
		'Content-Type': 'application/x-www-form-urlencoded',
		'Content-Length': Buffer.byteLength(pdata),
		'Authorization': auth
	}



	var post_options = {
		host: host,
		path: path,
		method: 'POST',
		headers: headers,
		body: post_data
	};

	request({
		url: url,
		method: "POST",
		headers: headers,
		body: querystring.stringify(post_data)
	}, function (error, response, body) {

		var bdy = JSON.parse(body);

		if (error) {
			console.log("error in request to " + url)
			console.log(error)
			res.send(error);
			return;
		} else {

			utils.consolog("request done !");
			utils.consolog(bdy);
			utils.consolog(bdy.access_token)
			//res.send(body)

			if (bdy.access_token) {
				utils.consolog("got valid access token");
				utils.consolog(email + " is a valid IBM ID, checking for application access")
				var tk = bdy.access_token;
				var usr = {
					email: email,
					psw: psw,
					bluetoken: bdy.access_token,
					bluerefreshtoken: bdy.refresh_token
				}
				checkValidUser(usr, function (data) {

					utils.consolog(data);
					res.send(data);
				})

			} else {
				utils.consolog(email + " is NOT a valid IBM ID");
				res.send(bdy);
			}

		}

	});


})


router.post("/blueid", function (req, res) {

	var body = req.body;
	//console.log("body");
	//console.log(body);
	var auth = body.authorization;
	//console.log("auth: "+auth);

	var tmp = auth.split(' '); // Split on a space, the original auth looks like  "Basic Y2hhcmxlczoxMjM0NQ==" and we need the 2nd part
	var buf = new Buffer(tmp[1], 'base64'); // create a buffer and tell it the data coming in is base64
	var plain_auth = buf.toString(); // read it back out as a string
	//console.log("Decoded Authorization ", plain_auth);

	// At this point plain_auth = "username:password"
	var creds = plain_auth.split(':'); // split on a ':'
	var username = creds[0];
	var password = creds[1];

	var loggedin = false;
	var email = username;
	var psw = password;

	var host = "idaas.iam.ibm.com";
	var path = "/idaas/oidc/endpoint/default/token";
	var url = "https://" + host + path;
	var auth = 'Basic ' + new Buffer(blueclient_id + ':' + blueclient_secret).toString('base64');

	var post_data = {
		grant_type: "password",
		scope: "openid",
		username: email,
		password: psw

	}

	var pdata = querystring.stringify(post_data);

	var headers = {
		'Content-Type': 'application/x-www-form-urlencoded',
		'Content-Length': Buffer.byteLength(pdata),
		'Authorization': auth
	}



	var post_options = {
		host: host,
		path: path,
		method: 'POST',
		headers: headers,
		body: post_data
	};

	console.log("calling BlueID authentication system");
	request({
		url: url,
		method: "POST",
		headers: headers,
		body: querystring.stringify(post_data)
	}, function (error, response, body) {

		console.log(body);

		var bdy = JSON.parse(body);

		if (error) {
			console.log("error in request to " + url)
			console.log(error)
			res.send(error);
			return;
		} else {

			//console.log("request done !");
			//console.log(bdy);	
			//console.log(bdy.access_token)
			//res.send(body)

			if (bdy.access_token) {
				console.log("got valid access token");
				console.log(email + " is a valid IBM ID, checking for application access")
				var tk = bdy.access_token;
				var usr = {
					email: email,
					psw: psw,
					bluetoken: bdy.access_token,
					bluerefreshtoken: bdy.refresh_token
				}
				checkValidUser(usr, function (data) {

					//console.log(data);




					if (String(data.loggedin) == "true") {

						res.send(data);

					} else {

						res.send(data);


					}



					//res.send(data);
				})

			} else {
				console.log(email + " is NOT a valid IBM ID");
				res.send({
					"loggedin": "false",
					errordata: bdy
				});
				//return res.redirect("/login?msg=notauthorized");
			}

		}
	});

});



function checkValidUser(usr, callback) {

	var email = usr.email;
	var psw = usr.password;
	var bluetoken = usr.bluetoken;

	utils.colog("login attempt by user " + email)

	var logginuser = {}

	var loggedin = false;

	var role = "";
	var company = "";
	var customers = "";
	var customer = "";
	var firstname = "";
	var lastname = "";
	var userid = "";
	var usergroups = [];


	dbs.list("users", function (err, data) {

		//utils.colog(data);
		if (err) {

			utils.colog("ERROR: ");
			utils.colog(err);
			err.loggedin = "false";

			callback(err);
			return;
		}



		if (data.rows) {

			for (var i = 0; i < data.rows.length; i++) {
				var user = data.rows[i].doc;
				var row = data.rows[i].doc;

				var password = "";
				if (user.password) password = user.password;

				var validUser = false;

				//console.log(user.email+" - active: "+user.useractive)

				//if  ((email.trim()==user.email.trim()) && (psw.trim()==password.trim()) && (String(user.useractive)=="true")) validUser=true;
				if ((email.trim() == user.email.trim()) && (String(user.useractive) == "true")) validUser = true;
				if (validUser) {
					if (row.roles) roles = row.roles;
					if (row.company) company = row.company;
					if (row.customers) customers = row.customers;
					if (row.customer) customer = row.customers;
					if (row.firstname) firstname = row.firstname;
					if (row.lastname) lastname = row.lastname;
					if (row.usergroups) usergroups = row.usergroups;

					if (row._id) userid = row._id;

					//row.sessionid=sessionid;
					/*dbs.update("users",row,function(){
					 
					 console.log("sessionid stored for this user")
					 
				 })*/
					loggedin = true;
					logginuser = user.email;


				}


			}


		}

		if (loggedin) {
			utils.consolog("User " + email + " successfully logged in to application");
			//utils.consolog("req.user: "+req.user)
			var tokenv4 = uuid.v4();
			var token = jwt.sign(logginuser, superSecret, {
				expiresInMinutes: tokenExpireMinutes // expires in 24 hours
			});
			utils.consolog("created new token " + token)
			callback({
				"usergroups": usergroups,
				"loggedin": "true",
				"tokenv4": tokenv4,
				"token": token,
				"bluetoken": bluetoken,
				"roles": roles,
				"company": company,
				"customers": customers,
				"firstname": firstname,
				"lastname": lastname,
				"id": userid,
				"email": email
			});
		} else {
			console.log("Login failed for user " + email);
			callback({
				"loggedin": "false"
			});
		}

	});


}

module.exports = router;