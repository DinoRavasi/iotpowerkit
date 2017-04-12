var express = require('express');
var router = express.Router();
var dbs = require("../routes/dbs");
var fdbs = require("../routes/filedbs");
var dash = require("../lib/dashlib");
var utils = require("../lib/utils");
var boxf = require("../lib/boxfiles");


var WIoT = require("ibmiotf");

var deviceClientConnected = false;





//anomalylog --- > https://ibm.box.com/shared/static/hssd2rp19ub03rrps71c1zh23kpxfyu1.json
//conditionindicators ---> https://ibm.box.com/shared/static/ivl2djnv5yqhbnj528wjrrnxhziauchj.json
//sensormeasurement ---> https://ibm.box.com/shared/static/p13iiwphchgkouxmc6xeb2azt11gopj3.json
//sensor_x1 --> https://ibm.box.com/shared/static/ym6k4jng8nlbkeaubmssnhlwvaue5n4q.json
//sensor_v2 --> https://ibm.box.com/shared/static/dq9vewly61r7oqhrqd53133q7d757tii.json
//sensor_x3 --> https://ibm.box.com/shared/static/pehv9nkgzwpvx03kn0d4hwbvu03uu32a.json
//equipmentanomalylog --> https://ibm.box.com/shared/static/ckbsutwujpk9vc09qyllvyvhw7d0d6qz.json
//equipmentfailuremodel --> https://ibm.box.com/shared/static/gy7j9ci5apj1wcps6530ii2wl6wpxubx.json
//measurement_profile --> https://ibm.box.com/shared/static/igio7p0yfy1hy2c5o8fwjp0zzi2yxcci.json
//measurment:profile_new --> https://ibm.box.com/shared/static/ng9y3dc7r4qptrcpv5xr9gkrxl6hncmd.json
//healthscore --> https://ibm.box.com/shared/static/s01a6a1yyfji3rax93aeslxvr0odfamf.json
//healthscoretrend --> https://ibm.box.com/shared/static/b0uvluvjwxpunbwrd06hu9nbashcbdep.json
//equipmentavailability --> https://ibm.box.com/shared/static/jo33sa5y17t4ynlz64wr4if7pll1zeba.json

var simulationactive = true;

/*
var simuls = [{

        intervalTimer: null,
        interval: 10000,
        status_on: true,
        filename: "productionoutputwithtarget.json",
        filesource: "https",
        boxfilename: "productionoutputwithtarget",
        httpsurl: boxf.getBoxFile("productionoutputwithtarget"),
        shttpsurl: "/shared/static/uj676p6rs32j7q6eid70rgdslqd56q1u.json",
        evtype: "productionoutputwithtarget.json",
        rowindex: -1,
        buffer: [],
        fields: "Production",
        buffersize: 1000,
    },
    {

        intervalTimer: null,
        interval: 4000,
        status_on: true,
        filename: "LU_measurement_profile",
        filesource: "https",
        boxfilename: "measurement_profile_new",
        httpsurl: boxf.getBoxFile("measurement_profile_new"),
        //httpsurl: "/shared/static/ng9y3dc7r4qptrcpv5xr9gkrxl6hncmd.json",
        evtype: "measurementprofile.json",
        rowindex: -1,
        buffer: [],
        fields: "Machine,Timestamp,Good_Production,Machine_Speed,Rejected",
        buffersize: 1000,



    },
    {

        intervalTimer: null,
        interval: 3000,
        status_on: true,
        filename: "HealthyScoreTrend.json",
        filesource: "https",
        boxfilename: "healthscoretrend",
        httpsurl: boxf.getBoxFile("healthscoretrend"),
        shttpsurl: "/shared/static/b0uvluvjwxpunbwrd06hu9nbashcbdep.json",
        evtype: "TimeHistory_H1000_LU30.json",
        rowindex: -1,
        buffer: [],
        fields: "Macchina,Timestamp,Health_score",
        buffersize: 1000,



    }, {
        intervalTimer: null,
        interval: 1500,
        status_on: true,
        //filename: "LU30_Energy_Paker_TH.json",
        filename: "MAKER_Scarti_sigarette.json",
        boxfilename: "equipmentavailability",
        httpsurl: boxf.getBoxFile("equipmentavailability"),
        shttpsurl: "/shared/static/jo33sa5y17t4ynlz64wr4if7pll1zeba.json",
        filesource: "https",

        dfilename: "MessageHistory_121P_LU30_TH2.json",
        evtype: "MAKER_Scarti_sigarette.json",
        buffer: [],
        buffersize: 5000,
        rowindex: -1,
        fields: "Availability",
    },

    {
        descr: "anomalylog",
        intervalTimer: null,
        interval: 5000,
        status_on: true,
        filename: "anomalylog.json",
        filesource: "https",
        boxfilename: "anomalylog",
        httpsurl: boxf.getBoxFile("anomalylog"),
        shttpsurl: "/shared/static/hssd2rp19ub03rrps71c1zh23kpxfyu1.json",
        evtype: "anomalylog.json",
        rowindex: -1,
        buffer: [],
        fields: "glossary,path,typology,True_start",
        buffersize: 2,



    },
    {
        descr: "conditionindicators",
        intervalTimer: null,
        interval: 2000,
        status_on: true,
        filename: "conditionindicators.json",
        filesource: "https",
        boxfilename: "conditionindicators",
        httpsurl: boxf.getBoxFile("conditionindicators"),
        shttpsurl: "/shared/static/ivl2djnv5yqhbnj528wjrrnxhziauchj.json",
        evtype: "conditionindicators.json",
        rowindex: -1,
        buffer: [],
        fields: "Nome,Value,Timestamp",
        buffersize: 1000,



    },
    {
        descr: "sensormeasurement",
        intervalTimer: null,
        interval: 2000,
        status_on: true,
        filename: "sensor_x1.json",
        filesource: "https",
        boxfilename: "sensor_x1",
        httpsurl: boxf.getBoxFile("sensor_x1"),
        shttpsurl: "/shared/static/ym6k4jng8nlbkeaubmssnhlwvaue5n4q.json",
        evtype: "sensormeasurement.json",
        rowindex: -1,
        buffer: [],
        fields: "Name,Value,Timestamp",
        buffersize: 1000,
    },
    {
        descr: "sensormeasurement",
        intervalTimer: null,
        interval: 4500,
        status_on: true,
        filename: "sensor_x2.json",
        filesource: "https",
        boxfilename: "sensor_x2",
        httpsurl: boxf.getBoxFile("sensor_x2"),
        shttpsurl: "/shared/static/dq9vewly61r7oqhrqd53133q7d757tii.json",
        evtype: "sensormeasurement.json",
        rowindex: -1,
        buffer: [],
        fields: "Name,Value,Timestamp",
        buffersize: 1000,



    },
    {
        descr: "sensormeasurement",
        intervalTimer: null,
        interval: 2200,
        status_on: true,
        filename: "sensor_x3.json",
        filesource: "https",
        boxfilename: "sensor_x3",
        httpsurl: boxf.getBoxFile("sensor_x3"),
        shttpsurl: "/shared/static/pehv9nkgzwpvx03kn0d4hwbvu03uu32a.json",
        evtype: "sensormeasurement.json",
        rowindex: -1,
        buffer: [],
        fields: "Name,Value,Timestamp",
        buffersize: 1000,



    },
    {
        descr: "equipmentanomalylog",
        intervalTimer: null,
        interval: 3100,
        status_on: true,
        filename: "LU30_Event Log.json",
        filesource: "https",
        boxfilename: "equipmentanomalylog",
        httpsurl: boxf.getBoxFile("equipmentanomalylog"),
        shttpsurl: "/shared/static/ckbsutwujpk9vc09qyllvyvhw7d0d6qz.json",
        evtype: "equipmentanomalylog.json",
        rowindex: -1,
        buffer: [],
        fields: "Machine,Timestamp,Glossary",
        buffersize: 1000,



    },
    {
        descr: "equipmentfailuremodel",
        intervalTimer: null,
        interval: 4300,
        status_on: true,
        filename: "EquipmentFailurModel.json",
        boxfilename: "equipmentfailuremodel",
        filesource: "https",
        httpsurl: boxf.getBoxFile("equipmentfailuremodel"),
        shttpsurl: "/shared/static/gy7j9ci5apj1wcps6530ii2wl6wpxubx.json",
        evtype: "equipmentfailurmodel.json",
        rowindex: -1,
        buffer: [],
        fields: "Machine,Model_ID,Model_Name,Score,Execution_Date",
        buffersize: 1000,



    }

];
*/

var simuls = [];



//SIMULATION

var simultimer = {
    intervalTimer: null,
    interval: 900,
    status_on: false,
    rowindex: 0
}

loadSimulations(function (data) {
    simuls.forEach(function(item,idx){

        item.intervalTimer=null;
        item.rowindex=-1;
        item.buffer=[];
    })
    setSimulOn(simulationactive);
})






function setAllSimulsOn(tf) {
    simuls.forEach(function (item, idx) {
        item.status_on = tf;
        item.requestinprogress = false;
    })
    if (tf) {
        simuls.forEach(function (item, idx) {
            if (item.status_on) item.intervalTimer = setInterval(simulIntervalFunc, item.interval, idx);
        })


    } else {
        simuls.forEach(function (item, idx) {
            clearInterval(item.intervalTimer);
        });
    }

}

function setSimulOn(tf) {
    simultimer.status_on = tf;
    simulationactive = tf;
    simuls.forEach(function (item, idx) {
        //item.status_on = tf;
        item.requestinprogress = false;
    })
    if (tf) {
        var activesimulscount = 0;
        simuls.forEach(function (item, idx) {
            if (item.status_on) {
                item.intervalTimer = setInterval(simulIntervalFunc, item.interval, idx);
                activesimulscount++;
            }
        })
        console.log(activesimulscount + " simulations have been turned ON");


    } else {
        var activesimulscount = 0;
        simuls.forEach(function (item, idx) {
            clearInterval(item.intervalTimer);
            if (item.status_on) {

                activesimulscount++;
            }
        });
        console.log(activesimulscount + " simulations have been turned OFF");
    }
}


function setSimulTimer(idx) {
    var item = simuls[idx];

    item.intervalTimer = setInterval(simulIntervalFunc, item.interval, idx);

}


function simulIntervalFunc(args) {

    //console.log("SimulIntervalFunc", args);

    var simultimer = simuls[args];
    //console.log("simultimer ",simultimer.evtype,simultimer.status_on);
    //if (simultimer.status_on==false) return;

    if (simultimer.filesource) {
        //console.log("filesource",simultimer.filesource);
        if (simultimer.filesource == "local") {
            simulIntervalFuncLocal(args);
            return;
        }
        if (simultimer.filesource == "https") {
            simulIntervalFuncHttps(args);
            return;
        }
    }
    //var simultimer = simulitem;
    var fname = simultimer.filename;
    var warnings = [];
    //console.log("simultimer buffer length",simultimer.buffer.length);
    if (simultimer.buffer.length == 0) {
        if (simultimer.requestinprogress == true) return;




        simultimer.rowindex++;
        var fields = simultimer.fields;


        //utils.colog("FROM FILE simulation id "+args+", emitting line " + simultimer.rowindex + " from file " + fname);
        //return;
        //fdbs.readJsonLine("data/" + fname, simultimer.rowindex, function (data, reset) {
        //fdbs.readJsonBuffer("data/" + fname, simultimer.rowindex, simultimer.buffersize,function (data, reset) {
        simultimer.requestinprogress = true;
        fdbs.readJsonBufferRemote(fname, simultimer.rowindex, simultimer.buffersize, function (data, reset) {

            var buf = [];
            //console.log("rows",data.rows.length)
            data.rows.forEach(function (item, idx) {

                fields.split(",").forEach(function (fitem, fidx) {
                    //console.log(item);
                    var fieldfound = false;
                    if (item.hasOwnProperty(fitem)) {
                        //console.log("found field ",fitem);
                        buf.push(item[fitem]);
                        fieldfound = true;
                    } else fieldfound = false;
                    if (!fieldfound) {
                        warnings.push("Warning: field " + fitem + " not found !");
                        console.log("Warning: field " + fitem + " not found !");
                    }

                })



            })

            //console.log("buf",buf);

            //simultimer.buffer=data.rows;
            simultimer.buffer = buf;


            /*
            var io = global.io;
            io.emit('dashdata', {
                operation: "filesimulation",
                filename: fname,
                simulation_index: args,
                line: simultimer.rowindex,
                data: simultimer.buffer[0]
            });
            */
            //dutils.colog("reset",reset);


            //simultimer.buffer.shift();
            // simultimer.rowindex++;
            utils.colog("FROM HTTP simulation id " + args, "fname", fname, "bufferlength", simultimer.buffer.length, simultimer.rowindex, "reset", reset);
            // sendToIot();
            if (reset) simultimer.rowindex = -1;
            //console.log("before calling",simultimer.rowindex);
            simultimer.requestinprogress = false;
            simulIntervalFunc(args);
        });

    } else {
        var io = global.io;

        /*io.emit('dashdata', {
            operation: "filesimulation",
            filename: fname,
            simulation_index: args,
            line: simultimer.rowindex,
            data: simultimer.buffer[0]
        });*/

        var field = simultimer.fields;
        var events = [simultimer.buffer[0]];
        var emitdata = {
            events: events,
            evtype: simultimer.evtype,
            iotindex: args,
            field: field,
            warnings: warnings,
            interval: simultimer.interval,
            buffersize: simultimer.buffersize

        }
        console.log(simultimer.evtype);
        io.emit('iot_deviceevent', emitdata);
        //utils.colog("FROM BUFFER simid " + args + ", emitline " + simultimer.rowindex + ",urlfile " + fname, "bufsize", simultimer.buffer.length);
        simultimer.buffer.shift();
        //dutils.colog("reset",reset);
        simultimer.rowindex++;
    }




}






router.get("/getsimulstatus", function (req, res) {
    var count = 0;
    var total = simuls.length;
    simuls.forEach(function (item, idx) {
        if (item.status_on) count++;
    });

    var ret = getSimulations();
    ret.simulstatus = simulationactive;
    res.send(ret);
})

router.get("/setsimulid/:id/:status", function (req, res) {
    var id = req.params.id;
    var status = req.params.status;
    var active = false;
    if (status.toLowerCase() == "on") active = true;
    if (status.toLowerCase() == "off") active = false;
    simuls[id].status_on = active;
    var ret = {
        msg: "Simulation id " + id + " status_on=" + active + ", global simulation status=" + simulationactive,

    }

    if (simulationactive) {
        setSimulOn(true)
    }


    res.send(ret);
})

router.get("/setsimul/:status", function (req, res) {
    var status = req.params.status.toLowerCase().trim();
    var msg = "Simulator has been turned ON - interval setted to " + simultimer.interval

    if (status == "on") {
        simulationactive = true;
        setSimulOn(simulationactive);
        utils.colog(msg);
    }
    if (status == "off") {
        simulationactive = false;
        setSimulOn(simulationactive);
        msg = "Simulator has been turned OFF";

        utils.colog(msg);
    }
    if (status == "toggle") {
        var st = simulationactive;

        simulationactive = !simulationactive;
        setSimulOn(simulationactive);
        var parola = "ON";
        if (simulationactive == false) {
            parola = "OFF";
        }
        msg = "Simulator has been turned " + parola;

        utils.colog(msg);
    }

    retvalue = getSimulations();
    retvalue.simulstatus = simulationactive;
    retvalue.msg = msg;

    res.send(retvalue);

})


function getSimulations() {
    var retvalue = {
        activesimuls: 0,
        activesimulsdescr: [],
        inactivesimuls: 0,
        inactivesimulsdescr: [],
        totalsimuls: 0,

    }
    var count = 0;
    var total = simuls.length;
    simuls.forEach(function (item, idx) {
        if (item.status_on) {
            retvalue.activesimuls++;
            retvalue.activesimulsdescr.push(item.evtype);
        } else {
            retvalue.inactivesimuls++;
            retvalue.inactivesimulsdescr.push(item.evtype);
        }

    })
    retvalue.totalsimuls = total;
    return retvalue;
}


router.get("/setallsimuls/:status", function (req, res) {
    var status = req.params.status.toLowerCase().trim();
    var retvalue = {
        msg: "All simulations have been turned ON - interval setted to " + simultimer.interval
    }
    if (status == "on") {
        setAllSimulsOn(true);
        utils.colog(retvalue.msg);
    }
    if (status == "off") {
        setAllSimulsOn(false);
        retvalue.msg = "All simulations have been turned OFF";

        utils.colog(retvalue.msg);
    }
    if (status == "toggle") {
        var st = false;
        simuls.forEach(function (item, idx) {
            var simultimer = item;
            st = item.status_on;

        })
        //var st = simultimer.status_on;
        st = !st;
        setAllSimulsOn(st);
        var parola = "ON";
        if (st == false) parola = "OFF";
        retvalue.msg = "All simulations have been turned " + parola;
        retvalue.simulstatus = st;
        utils.colog(retvalue.msg);
    }
    res.send(retvalue);

})





var deviceClient;

function sendToIot(ev) {
    return;

    if (!deviceClientConnected) {
        var apikey = "a-qc7qlc-7x4vfeo0i6";
        var apitoken = "VIDMNZUlj6mzm(QyQ6";
        var iot = {};
        iot.APIKey = apikey;
        iot.AuthToken = apitoken;
        iot.OrgId = "qc7qlc";
        deviceClient = new WIoT.IotfDevice({
            "org": iot.OrgId,
            "id": "simulmax001",
            "domain": "internetofthings.ibmcloud.com",
            "use-client-certs": false,
            "auth-key": iot.APIKey,
            "auth-token": iot.AuthToken,
            "type": "Simulator",
            "auth-method": "token"
        })
        deviceClient.connect();

        deviceClient.on("connect", function () {
            deviceClientConnected = true;
            //console.log("connected to Watson IoT !");
            //deviceClient.subscribeToDeviceEvents();
        });

        deviceClient.on("error", function (err) {
            console.log("Error : " + err);
        });


    } else {
        deviceClient.publish("simulevent", "json", '{"d" : { "cpu" : 60, "mem" : 50 }}');
    }

}




function simulIntervalFuncLocal(args) {

    //console.log("SimulIntervalFunc", args);
    var simultimer = simuls[args];
    var fname = simultimer.filename;
    var warnings = [];
    //console.log("simultimer buffer length",simultimer.buffer.length);
    if (simultimer.buffer.length == 0) {
        if (simultimer.requestinprogress == true) return;




        simultimer.rowindex++;
        var fields = simultimer.fields;


        //utils.colog("FROM FILE simulation id "+args+", emitting line " + simultimer.rowindex + " from file " + fname);
        //return;
        //fdbs.readJsonLine("data/" + fname, simultimer.rowindex, function (data, reset) {
        simultimer.requestinprogress = true;
        fdbs.readJsonBuffer("data/" + fname, simultimer.rowindex, simultimer.buffersize, function (data, reset) {

            //fdbs.readJsonBuffer(fname, simultimer.rowindex, simultimer.buffersize, function (data, reset) {

            var buf = [];

            data.rows.forEach(function (item, idx) {

                fields.split(",").forEach(function (fitem, fidx) {
                    //console.log(item);
                    var fieldfound = false;
                    if (item.hasOwnProperty(fitem)) {
                        //console.log("found field ",fitem);
                        buf.push(item[fitem]);
                        fieldfound = true;
                    } else fieldfound = false;
                    if (!fieldfound) {
                        warnings.push("Warning: field " + fitem + " not found !");
                        console.log("Warning: field " + fitem + " not found !");
                    }

                })



            })

            //simultimer.buffer=data.rows;
            //console.log("buf",buf);
            simultimer.buffer = buf;


            /*
            var io = global.io;
            io.emit('dashdata', {
                operation: "filesimulation",
                filename: fname,
                simulation_index: args,
                line: simultimer.rowindex,
                data: simultimer.buffer[0]
            });
            */
            //dutils.colog("reset",reset);


            //simultimer.buffer.shift();
            // simultimer.rowindex++;
            utils.colog("FROM LOCAL simid " + args, "fname", fname, "bufflength", simultimer.buffer.length, simultimer.rowindex, "reset", reset);
            // sendToIot();
            if (reset) simultimer.rowindex = -1;
            //console.log("before calling",simultimer.rowindex);
            simultimer.requestinprogress = false;
            simulIntervalFuncLocal(args);
        });

    } else {
        var io = global.io;
        /*
                io.emit('dashdata', {
                    operation: "filesimulation",
                    filename: fname,
                    simulation_index: args,
                    line: simultimer.rowindex,
                    data: simultimer.buffer[0]
                });*/
        var field = simultimer.fields;
        var events = [simultimer.buffer[0]];
        var emitdata = {
            events: events,
            evtype: simultimer.evtype,
            iotindex: args,
            field: field,
            warnings: warnings,
            interval: simultimer.interval,
            buffersize: simultimer.buffersize

        }
        console.log(simultimer.evtype);
        io.emit('iot_deviceevent', emitdata);
        //utils.colog("FROM BUFFER simid " + args + ", emitline " + simultimer.rowindex + ", file " + fname, "bufsize", simultimer.buffer.length);
        simultimer.buffer.shift();
        //dutils.colog("reset",reset);
        simultimer.rowindex++;
    }

}


function simulIntervalFuncHttps(args) {


    var simultimer = simuls[args];

    var fname = simultimer.filename;
    var warnings = [];
    //console.log("simultimer buffer length",simultimer.buffer.length);
    //console.log("SimulIntervalFuncHttps", args, simultimer.evtype,simultimer.buffer.length,simultimer.requestinprogress);
    if (simultimer.buffer.length == 0) {
        if (simultimer.requestinprogress == true) return;





        simultimer.rowindex++;
        var fields = simultimer.fields;


        //utils.colog("FROM FILE simulation id "+args+", emitting line " + simultimer.rowindex + " from file " + fname);
        //return;
        //fdbs.readJsonLine("data/" + fname, simultimer.rowindex, function (data, reset) {
        //var url = simultimer.httpsurl;
        var url = boxf.getBoxFile(simultimer.boxfilename);
        simultimer.requestinprogress = true;
        fdbs.readJsonBufferRemoteHttps(url, simultimer.rowindex, simultimer.buffersize, function (data, reset) {

            //fdbs.readJsonBuffer(fname, simultimer.rowindex, simultimer.buffersize, function (data, reset) {

            var buf = [];

            data.rows.forEach(function (item, idx) {

                var ev = {};
                fields.split(",").forEach(function (fitem, fidx) {
                    //console.log(item);
                    var fieldfound = false;
                    if (item.hasOwnProperty(fitem)) {
                        //console.log("found field ",fitem);
                        ev[fitem] = item[fitem];
                        //buf.push(item[fitem]);
                        fieldfound = true;
                    } else fieldfound = false;
                    if (!fieldfound) {
                        warnings.push("Warning: field " + fitem + " not found !");
                        console.log("Warning: field " + fitem + " not found !");
                    }

                })
                buf.push(ev);



            })

            //simultimer.buffer=data.rows;
            //console.log("buf",buf);
            simultimer.buffer = buf;


            /*
            var io = global.io;
            io.emit('dashdata', {
                operation: "filesimulation",
                filename: fname,
                simulation_index: args,
                line: simultimer.rowindex,
                data: simultimer.buffer[0]
            });
            */
            //dutils.colog("reset",reset);


            //simultimer.buffer.shift();
            // simultimer.rowindex++;
            //utils.colog("FROM HTTPS simid " + args, "fname", fname, "bufflength", simultimer.buffer.length, simultimer.rowindex, "reset", reset);
            // sendToIot();
            if (reset) simultimer.rowindex = -1;
            //console.log("before calling",simultimer.rowindex);
            simultimer.requestinprogress = false;
            simulIntervalFuncHttps(args);
        });

    } else {
        var io = global.io;

        var field = simultimer.fields;
        var events = [simultimer.buffer[0]];
        var emitdata = {
            events: events,
            evtype: simultimer.evtype,
            boxfilename: simultimer.boxfilename,
            boxfileurl: boxf.getBoxFile(simultimer.boxfilename),
            iotindex: args,
            field: field,
            warnings: warnings,
            interval: simultimer.interval,
            buffersize: simultimer.buffersize

        }
        //if (simultimer.evtype.indexOf("anomaly")>-1) console.log(simultimer.evtype);
        io.emit('iot_deviceevent', emitdata);
        //utils.colog("FROM BUFFER simid " + args + ", emitline " + simultimer.rowindex + ", file " + fname, "bufsize", simultimer.buffer.length);
        simultimer.buffer.shift();
        //dutils.colog("reset",reset);
        simultimer.rowindex++;
    }

}



function loadSimulations(callback) {
    dbs.listByField("config", "name", "simulations", function (data) {
        //console.log(data.rows[0].doc);


        simuls = data.rows[0].doc.data;

        console.log(simuls.length + " simulations loaded");
        if (callback) callback(simuls);

    })
}


router.get("/reloadall", function (req, res) {
    loadSimulations(function (data) {
        setSimulOn(simulationactive);
        res.send(simuls.length+" simulations reloaded");
    })

})



module.exports = router;