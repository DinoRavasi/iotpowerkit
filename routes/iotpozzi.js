var express = require('express');
var router = express.Router();
var dbs = require("../routes/dbs");
var fdbs = require("../routes/filedbs");
var dash = require("../lib/dashlib");
var utils = require("../lib/utils");

var WIoT = require("ibmiotf");


var apikey = "a-qc7qlc-7x4vfeo0i6";
var apitoken = "VIDMNZUlj6mzm(QyQ6";

var buffersize=10;
var evbuffersize=10;
var eventbuffer=[];
var buffercount=0;
var evbuffercount=0;

var iotevents = [{
    intervalTimer: null,
    interval: 1000,
    fields: "Paker_64",
    status_on: false,
    evtype: "Test_Energy_data_and_TH.csv",
    rowindex: -1,
    buffer: [],
    buffersize: 5,
    buffercount: 0
},{
    intervalTimer: null,
    interval: 1000,
    fields: "Paker_4",
    status_on: false,
    evtype: "Test_Energy_data_and_TH.csv",
    rowindex: -1,
    buffer: [],
    buffersize: 2,
    buffercount: 0
}];



//ibm-industry4.eu-gb





var iot={};
iot.APIKey = apikey;
iot.AuthToken = apitoken;
iot.OrgId = "qc7qlc";
iot.active=false;
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
 
 if (!iot.active) return;

 iotevents.forEach(function(iotitem,idx){


    
    //var idx=getIotIndex(eventType);
    //console.log("iotindex",idx);
    if (idx==-1) return;
    var iotevent=iotevents[idx];

	iotevent.rowindex++;
	iotevent.buffercount++;
	//totcount++;
    var pl=JSON.parse(payload);
    console.log(pl)
	utils.colog("iotevents["+idx+"] "+iotevent.buffercount+" - devtypeid: "+deviceType+":"+deviceId+", event "+eventType);
	
    
    var field=iotevent.fields;
    var evtype=eventType;

    var iotvalue="";

    for (var k in pl.d){
        //console.log(k,pl.d[k]);
        var arrk=k.split("|");
        var arrv=pl.d[k].split("|");

        arrk.forEach(function(item,idx){
            if (item.toLowerCase().trim()==field.toLowerCase().trim()){
                iotvalue=arrv[idx];
            }

        })


    }


    
	/*if (iotevent.buffer.length==iotevent.buffersize){
		iotevent.buffer.shift();
	}*/
	iotevent.buffer.push(iotvalue);
	//eventbuffer.push(totcount);
	if (iotevent.buffer.length==iotevent.buffersize){
        utils.conslog("buffercount="+iotevent.buffersize+", emitting socket iot-deviceevent for evtype "+iotevent.evtype);

        var emitdata={
            events: iotevent.buffer, 
            evtype: iotevent.evtype,
            iotindex: idx,
            field: field

        }
		io.emit('iot_deviceevent',emitdata);
		//io.emit('iot_deviceevent',{pl: pl});

		iotevent.buffercount=0;
        iotevent.buffer=[];
		//eventbuffer=[];

	}

	


 })


});



function getIotIndex(evtype){
    var retvalue=-1;
    //console.log("getIotIndex "+evtype);
    iotevents.forEach(function(item,idx){
        //console.log(evtype,item.evtype);
        if (evtype.toLowerCase().trim()==item.evtype.toLowerCase().trim()){
            //console.log("è uguale !!",idx);
            retvalue=idx;
            return retvalue;
        }
    })
    return retvalue;
}



router.get("/test",function(req,res){

//var url="https://ibm.box.com/shared/static/479glx1xkf89m3a9bcb3qxai4h7ybv31.json";
var url="/shared/static/479glx1xkf89m3a9bcb3qxai4h7ybv31.json";
//url="/shared/static/5zvhbwrl790ltwnj4kf3xkfiumgsul5e.jpg";

   // var url="/d/1/COyeVsYXr5gVOToPf_qyuUEPmWzs9llshmOsu89HnMh0UtbfY3KitPh3trtXfM29zRiufIU5YrzgdOGzuZQ9txrggRt0b2qhrxKUvxLDVUdrLxHXrq1hael0bxEbG1olBa8dzhN7Z_WEp0MXoMb82jH8ffI2gg16Em-wZa8vUXu_c3tLIQPo9iUlV-oaTAxm2yfTTWAvTHJEBr6_5-rme3eL5EzB1AivXSlShhQHVhHP6WTPKMgWhWobZo1qxl-PqA3fO4V8QVd-VnrfkCOeGZBNm8mYKQjfpWLA3wsJsG42SAIsmQQIIp22WfM-igcleE45PqtEkFfDm2C0ajUb7KPMtE4FreEksteV5VKkVtxD-PBEMF9s3c3HVF-g8NVICUO5poExt-H-Lx35FtDDV4uCGNBJ07MiOJ0oLiNfxaQQLYIrLJcK1C4K4e3vl7KfKdbkwilwCmps1qToikoZfas0qecot6ue6hczxNmVKpR8oSdqa1yuvKBSDFbRv7OOA20QqIRSD_rVKkeJguO_bAWD6HiiN5TJlQMOrTTIa_dsmkXaVcngtwrkqmeq6P8fxU1kMtBixgqFmaHzwZ8ZU9pVwudIFNO6uBbuLoP0Bi3AORdP7fFTARrHvHVO5b1dGciQnD_0tu5ZKtNmeEU-gZ0vs4qlFFPZYJ2xbyFHTPuXFIdGaJkE-JqWCIsGTrLvUPPSoDdTa4V2YWhbxm4D0T9LaZzjssKVUqCfDkR1Nhtzs9r-1e-Tu9oI8Zahg_Q8NNiEEW4mFLnXk3FtNDBGHYicRTL1irAWA1CPPUcQR6-eNCpOEIbowirzrkApYuZMdTzKnG9oBgiWw9NIALCP-izSIgYJA_ytJGH1M86wbF7nq9aBjjJqgQQ2lMBQt3oQxE_XkbiTg-7xWyDb_3i2w1NnjKd_kXRzENZ7qdm2AEYhzCjp424wm61bSgUPOkpqmtExwvB0bvf-nE8f6BrwZxlsjvO363cgfY4sHIWPBbr6h89nFGF9g9uSUecOOTV-qBitUv0QHIePGUElI4BiWAOGKNlRz4UxO8t3LsNTXW_bPjnYvXeUZM5WNa07JiwGWsso-VrSxHEPMlP9iEWzyeVZB17ULTJt4637TCnIT_uE9-Z5J7rr6Uw7SRg7FK_UDZjlV3IUMK2i5XnRF-oTs0YVSX1PHCuFVNcO/download";
 fdbs.readJsonBufferRemoteHttps(url,0,10,function(data){
    console.log("rows",data.rows.length);
    res.send(data);

 })

});

module.exports = router;