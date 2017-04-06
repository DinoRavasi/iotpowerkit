
var express = require('express');
var js2xmlparser = require("js2xmlparser");
var request = require('request');
var fs=require("fs");
var xml2js = require('xml2js');
var parser = new xml2js.Parser();
var router = express.Router();
var debug=true;
var writelog=true;
var dbs=require("../routes/dbs");

var uuid=require("uuid");
var jwt=require('jsonwebtoken');

var superSecret="inespugnabile"
var tokenExpireMinutes=60;
var tokenExpireSeconds="3600";


var colog = function () {
	var dbg = debug;
	if (!dbg) return;
	console.log.apply(console, arguments);
}

var conslog = function () {
	var dbg = debug;
	//if (!dbg) return;
	console.log.apply(console, arguments);
}


/*
function colog(txt){
	
  if (debug) console.log(txt);
 
}*/


function json2xml(json,roottag) {
	
	if (!roottag) roottag="root";
	
	var xml=js2xmlparser(roottag, json)
	
  return xml;	
}


function consolog(){

	
	
	if (debug) console.log.apply(console, arguments);
	
		if (writelog){
	var logtxt="";
	for (var i=0; i<arguments.length; i++){
		
		var addtext=arguments[i];
		//console.log(arguments[i]);
		//console.log(isObject(addtext));
		if (isObject(arguments[i])) addtext=JSON.stringify(arguments[i]);
		logtxt+=addtext+"\r\n";
	}

	fs.appendFile('public/log.txt', logtxt, function (err) {

    });
	}
	
}



function clearlog() {
	
	fs.writeFileSync("public/log.txt","");
}



function getJulian(data) {
    
   if (!data) data=new Date();	
   
   var yyyy = data.getFullYear().toString();
   var MM = (data.getMonth()+1).toString(); // getMonth() is zero-based
   var dd  = data.getDate().toString();
   var hh = data.getHours();
   var mm = data.getMinutes();
   var ss = data.getSeconds();
   var ms = data.getMilliseconds(); 
   
   var n=2;
   var jdate=yyyy+padZeros(MM,n)+padZeros(dd,n)+padZeros(hh,n)+padZeros(mm,n)+padZeros(ss,n);
   //consolog("jdate: "+jdate);
   
   //var jdate=yyyy+(MM[1]?MM:"0"+MM[0]) + (dd[1]?dd:"0"+dd[0]) + (hh[1]?hh:"0"+hh[0]) + (mm[1]?mm:"0"+mm[0]) + (ss[1]?ss:"0"+ss[0]);
   return jdate; // padding

	
}

function getJulianLong(data) {
    
   if (!data) data=new Date();	
   
   var yyyy = data.getFullYear().toString();
   var MM = (data.getMonth()+1).toString(); // getMonth() is zero-based
   var dd  = data.getDate().toString();
   var hh = data.getHours();
   var mm = data.getMinutes();
   var ss = data.getSeconds();
   var ms = data.getMilliseconds(); 
   
   var n=2;
   var jdate=yyyy+padZeros(MM,n)+padZeros(dd,n)+padZeros(hh,n)+padZeros(mm,n)+padZeros(ss,n)+padZeros(ms,3);
   //consolog("jdate: "+jdate);
   
   //var jdate=yyyy+(MM[1]?MM:"0"+MM[0]) + (dd[1]?dd:"0"+dd[0]) + (hh[1]?hh:"0"+hh[0]) + (mm[1]?mm:"0"+mm[0]) + (ss[1]?ss:"0"+ss[0]);
   return jdate; // padding

	
}



function isObject (item) {
 //return typeof var === 'object' && var	
 return (typeof item === "object" && !Array.isArray(item) && item !== null);
}


 
 function padZeros(theNumber, max) {
    var numStr = String(theNumber);
    
    while ( numStr.length < max) {
        numStr = '0' + numStr;
    }
    
    return numStr;
}
	
	 function getNormalDate(data)
	{
	 //data=data.substring(0,8);
	 //console.log("getNormalDate "+data);
	 var retvalue=data.substring(6)+data.substring(3,5)+data.substring(0,2);
	 
	 return retvalue;
	
	}


	

function getElibrary(obj,callback){
	colog("getReachMe for the following object:")
	colog(obj)
	var elib=[];
	var role=obj.role.trim().toLowerCase();
	var email=obj.email;
	
	var retvalue={
		users: [],
		elibrary: [],
		shares: []
	}
	
	var users=[];
	
 dbs.list("shares",function(sdata){
	 
	 if (String(sdata.error)=="true") callback(sdata);
	 
	 for (var x=0; x<sdata.rows.length; x++) {
		 
		 var doc=sdata.rows[x].doc;
		 if (doc.what.trim().toLowerCase()=="elibrary") retvalue.shares.push(doc);
		 
	 }
	 //retvalue.shares=sdata.rows;
 
	
 dbs.list("users",function(udata){
	     
		//if (String(udata.error)=="true") callback(udata); 
	    
		colog("listed users")
		//colog(data);
		if (udata.error) {
			console.log("error: ",udata.errormsg);
			callback(udata);
			
		} else {
           retvalue.users=udata.rows;
		   users=udata.rows;
		   
		   if (role=="ibm_salesrep") { 
	
	
	
	dbs.list("elibrary",function(data){
		colog("listed elibrary")
		//colog(data);
		if (data.error) {
			console.log("error: ",data.errormsg);
			callback(data);
			
		} else {
			
			//console.log(data);
			for (var i=0; i<data.rows.length; i++){
				var doc=data.rows[i].doc;
				if (!doc.tipo) doc.tipo="video";
				doc.imgurl="img/"+doc.tipo+".png";
				doc.sharewith=getSharesForDoc(doc._id,retvalue.shares);
				retvalue.elibrary.push(doc);
				
			}
			//retvalue.elibrary=data.rows;
			//elib=data.rows;
			
			
		} 
		colog("found "+retvalue.elibrary.length+" documents in elibrary")
		if (callback) callback(retvalue);
	});
	
	} 
	else 
	{ //NOT ROLE IBM_SALESREP
	
	  colog("listing elibrary for non ibm_salesrep user (shares)") 
     
			
			//console.log(data);
			
			for (var i=0; i<sdata.rows.length; i++){
				
				var doc=sdata.rows[i].doc;
				if (!doc.tipo) {
					doc.tipo="video";
				}
				doc.imgurl="img/"+doc.tipo+".png";
				
				var what=doc.what;
				var sharewith=doc.sharewith;
				
				
				if ((sharewith.trim()!="") && (what.trim().toLowerCase()=="elibrary")) {
				colog("what: "+what+" - sharewith: "+sharewith)
				var arrs=sharewith.split(",");
				
				for (var j=0; j<arrs.length; j++){
					
					var sw=arrs[j];
					
					
					var user=getUserById(users,sw);
				//g.colog(user);
				var uemail=user.email;
				
				//g.colog("email:"+uemail)
				
				var doIt=false;
				
				if (uemail==email) doIt=true;
				
				if (doIt){
				    
					doc.shareobject.sharewith=sharewith;
					retvalue.elibrary.push(doc.shareobject)
					
					
				}
					
				}
				
				
				}
				
			}
			
			//elib=data.rows;
			colog("found "+retvalue.elibrary.length+" elibrary type shares in shares")
		if (callback) callback(retvalue);
	
		} 
		
		
		
	}
		   

       
 });		
	
	
})	
	
}
	


function getPlanner(obj,callback) {
	
	console.log("getPlanner",obj);
	
	
	var retvalue={
		
	   planner: {	
		rows: [],
		events_rssibm: {},
			
		events_rsspp: {},
		events_global: {}
	   },
	   shares:[],
	   users: []
	}
	
	
	
 dbs.list("shares",function(sdata){
	 
	 if (String(sdata.error)=="true") {
		 callback(sdata);
		 return;
	 }	 
	 
	 for (var x=0; x<sdata.rows.length; x++) {
		 
		 var doc=sdata.rows[x].doc;
		 if (doc.what.trim().toLowerCase()=="event") retvalue.shares.push(doc);
		 
	 }	
	
 dbs.list("users",function(udata){
	     
		//if (String(udata.error)=="true") callback(udata); 
	    
		colog("listed users")
		//colog(data);
		if (udata.error) {
			console.log("error: ",udata.errormsg);
			callback(udata);
			
		} else {
           retvalue.users=udata.rows;
		   users=udata.rows;

          /* if (obj.role!="IBM_SALESREP") {
			   
			   retvalue.planner.rows=retvalue.shares;
			   callback(retvalue);
			   return;
		   }*/		   
	
	
	//first, get Client365 defined events from Cloudant
	dbs.list("eventcalendar",function(data){
		
		if (data.rows)
		{
		console.log("got ibm365 events type, rows: "+data.rows.length);
		
		
		for (var i=0; i<data.rows.length; i++){
				var doc=data.rows[i].doc;
				//if (!doc.tipo) doc.tipo="video";
				//doc.imgurl="img/"+doc.tipo+".png";
				doc.sharewith=getSharesForDoc(doc._id,retvalue.shares);
				retvalue.planner.rows.push(doc);
				
			}
		
		
		//retvalue.planner.rows=data.rows;
		
		//second, get RSS events from IBM global events feedtitle
		
		getFeeds(obj.rssibm_url,function(idata) {
			
			console.log("got rssibm feeds from "+obj.rssibm_url);
			console.log(idata);
			retvalue.planner.events_rssibm=idata;
			
			dbs.find("globalevents",{"OwningTeamCountry":"Italy"},function(sdata){
				
				console.log("got global events");
				//console.log(sdata);
				retvalue.planner.events_global=sdata;
				
				var srows=[];
				var d=new Date();
				var jd=d.yyyymmdd();
				for (var j=0; j<sdata.rows.length; j++){
					var doc=sdata.rows[j].doc;
					var sdate=doc.StartDate;
					var jdata=sdate.substring(6,10)+sdate.substring(3,5)+sdate.substring(0,2);
					//console.log(jd+" - "+sdate+" - "+jdata)
					var ndoc={doc: doc};
					if (jdata>=jd) srows.push(ndoc);
					
					
				}
				
				retvalue.planner.events_global={rows: srows};
				
				
				
				callback(retvalue)
				
				
			})
			
			
			//retvalue.events_rsspp=idata;
			/*
			getFeeds(rsspp_url,function(pdata) {
				console.log("got rsspp feeds from "+rsspp_url);
				retvalue.events_rsspp=pdata;
				res.send(retvalue)
				res_sent=true;
			});*/
			
			
		});
		} else {
			retvalue.error="true";
			retvalue.msg="no data was returned by /listallevents";
			callback(retvalue)
		}
	});
		
						
		}
 });
	
	
 });
}
	
function getSharesForDoc(id,shares){
	
	colog("getSharesForDoc "+id);
	for (var i=0; i<shares.length; i++) {
		
		var row=shares[i];
		colog(row._id);
		if (row.shareobject) {
			colog(row._id);
			var shid="";
			if (row.shareobject.id) shid=row.shareobject.id;
			if (row.shareobject._id) shid=row.shareobject._id;
			
			if (id==shid) return row.sharewith;
			
		}
		
	}
	
	var rettext="";
	return rettext;
	
}	




function getFeeds(url,callback){
	
colog("getting feeds from url "+url)	

var format="xml"; 


request.get(url, function (error, response, body) {
    if (!error && response.statusCode == 200) {
		
		if (format.trim().toLowerCase()=="xml")
		{
			parser.parseString(body, function (err, result) {
             
		      if (err) {
				  colog("Error parsing XML: "+err);
				  callback({"error":true,"msg":err.message})
				  return;
				  
			  }
			  
			  callback(result);
			  
			  
		    });
		//console.log(result);
          return;
			
		}
		
		callback(body);
		return;
    }
	if (error)
	{
	 colog("error reading remote file: "+error.message);
     callback({"error":true,"msg":error.message})
		return;
	}
});
	
	
	
}


function checkValidUser(usr,callback) {
	
	
	var isa_user="no";
	/*if (usr.isa_user) isa_user=usr.isa_user;
	console.log("isa_user",isa_user);*/
	var email=usr.email;
	var psw=usr.password;
	var bluetoken=usr.bluetoken;
	var bluerefreshtoken=usr.bluerefreshtoken;
	
	//console.log("checkValidUser",usr)
	
	var logginuser={}

	var loggedin=false;
	
	var role="";
	var roles="";
	var company="";
	var customers="";
	var customer="";
	var firstname="";
	var lastname="";
	var userid="";
	var email_me="";
	var userphoto="";

	
	dbs.list("users",function(data){
		console.log("listed users")
		//console.log(data);
		if (data.error) {
			console.log("error: ",data.errormsg);
			
		} else {
		
		if (data.rows){
			//console.log(data)
			for (var i=0; i<data.rows.length; i++){
				var user=data.rows[i].doc;
				var row=data.rows[i].doc;
				
				//console.log(row)
				
				
				var em="";
				var useractive="";
				
				if (user.email) em=user.email;
				if (user.useractive) useractive=user.useractive;
				
				var validUser=false;

				//console.log(em+" - "+useractive)
				
				if  ((email.trim()==em.trim()) && (String(useractive)=="true")) {
					console.log("user "+em+" found !!")
					validUser=true;
				}
				
			    if (validUser)		
				{
				 if (row.roles) roles=row.roles;
				 if (row.role) role=row.role;
				 if (row.company) company=row.company;
				 if (row.customers) customers=row.customers;
				 if (row.customer) customer=row.customers;
				 if (row.firstname) firstname=row.firstname;
                 if (row.email_me) email_me=row.email_me;
				 if (row.userphoto) userphoto=row.userphoto;
				 if (row.lastname) lastname=row.lastname;
				 if (row.isa_user) isa_user=row.isa_user;
				 
				 if (row._id) userid=row._id;
				 
				 //row.sessionid=sessionid;
				 /*dbs.update("users",row,function(){
					 
					 console.log("sessionid stored for this user")
					 
				 })*/
				 loggedin=true;	
				 logginuser=em;
				 
				 
				}
				
				
			}
			
			
		}
		
		if (loggedin)
		{
		 console.log("User "+email+" successfully logged in to application")	;
		 //console.log("req.user: "+req.user)
		 var tokenv4=uuid.v4();
		 var token = jwt.sign(logginuser, superSecret, {
                   expiresInMinutes: tokenExpireMinutes // expires in 24 hours
         });
		 console.log("created new token "+token)
		 
		 //var isa_user="no";
		 //if (row.isa_user) isa_user=row.isa_user;
		 callback({ "loggedin":"true","isa_user": isa_user, "tokenv4":tokenv4,"token": token,"bluetoken": bluetoken,"bluerefreshtoken":bluerefreshtoken,"roles": roles,"role":role,"company":company,"customers":customers,"firstname":firstname,"lastname":lastname,"id":userid,"email":email,"email_me":email_me,"userphoto": userphoto});	
		} else {
		 console.log("Login failed for user "+email)	;
		 callback({ "loggedin":"false"});	
		}
		
	
	    }
	});
	
	
}

 
function Left(str, n){
	if (n <= 0)
	    return "";
	else if (n > String(str).length)
	    return str;
	else
	    return String(str).substring(0,n);
}
function Right(str, n){
    if (n <= 0)
       return "";
    else if (n > String(str).length)
       return str;
    else {
       var iLen = String(str).length;
       return String(str).substring(iLen, iLen - n);
    }
}


function getSafeField(item,fieldname){
	var retvalue="";
	if (item.hasOwnProperty(fieldname)) retvalue=item[fieldname];
	if (item.hasOwnProperty(fieldname.toUpperCase())) retvalue=item[fieldname.toUpperCase()];
	return String(retvalue);



}


function isJson(str) {
    try {
        JSON.parse(str);
    } catch (e) {
        return false;
    }
    return true;
}
	

exports.colog=colog;
exports.conslog=conslog;
exports.clearlog=clearlog;
exports.consolog=consolog;
exports.getJulian=getJulian;
exports.getElibrary=getElibrary;
exports.getPlanner=getPlanner;
exports.getSharesForDoc=getSharesForDoc;
exports.getJulianLong=getJulianLong;
exports.getSafeField=getSafeField;
exports.json2xml=json2xml;
exports.checkValidUser=checkValidUser;
exports.Left=Left;
exports.Right=Right;
exports.isJson=isJson;
