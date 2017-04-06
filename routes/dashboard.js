var express = require('express');
var router = express.Router();
var dbs = require("../routes/dbs");
var fdbs = require("../routes/filedbs");
var dash = require("../lib/dashlib");
var utils = require("../lib/utils");


var inprog = {
    operationshutdowntime: false,
    productdefectcount: false,
    productionoutputwithtarget: false,
    equipmentanomalycount: false

}


var dashtimer = {
    intervalTimer: null,
    interval: 20000,
    status_on: false
}
setDashTimer(false);
//getDashData(new Date());
/*


var simultimer = {
    intervalTimer: null,
    interval: 800,
    status_on: false,
    rowindex: 0
}
setSimulOn(true);


function setSimulOn(tf) {
    simultimer.status_on = tf;
    if (tf) {
        simultimer.intervalTimer = setInterval(simulIntervalFunc, simultimer.interval, new Date());

    } else {
        clearInterval(simultimer.intervalTimer);
    }
}

function simulIntervalFunc() {
    console.log("SimulIntervalFunc");
    simultimer.rowindex++;
    var fname = "TimeHistory_H1000_LU30.csv";
    fdbs.readCsvLine("data/" + fname, simultimer.rowindex, function (data) {
        console.log("emmitting line simulation from file "+fname);
        var io = global.io;
        io.emit('dashdata', {
            operation: "filesimulation",
            filename: fname,
            line: simultimer.rowindex,
            data: data.rows[0]
        });
    });


}
*/
function setDashTimer(tf) {
    dashtimer.status_on = tf;
    if (tf) {
        dashtimer.intervalTimer = setInterval(getDashData, dashtimer.interval, new Date());
        //getDashData();

    } else {
        clearInterval(dashtimer.intervalTimer);
    }
}


//Dashboard timer simulator



function getDashData(arg) {
    utils.colog("dashboard getdashdata interval function", arg);
    var io = global.io;
    //return;


    if (inprog.operationshutdowntime == false) {
        inprog.operationshutdowntime = true;

        var options={
            tfdate: "",
            tftype: "",
        }
        
        dash.getOperationShutdownTime(options,function (data) {
            // console.log("getOperationShutdownTime",data);
            io.emit('dashdata', {
                operation: "operationshutdowntime",
                data: data
            });
            inprog.operationshutdowntime = false;

        })

    }


    if (inprog.productdefectcount == false) {
        inprog.productdefectcount = true;
        dash.getProductDefectCount("","",function (data) {
            console.log("getProductDefectCount", data);
            io.emit('dashdata', {
                operation: "productdefectcount",
                data: data
            });
            inprog.productdefectcount = false;
        })


    }

    if (inprog.productionoutputwithtarget == false) {
        inprog.productionoutputwithtarget = true;
        dash.getProductionOutputWithTarget("","",function (data) {
            console.log("getProductionOutputWithTarget", data);
            io.emit('dashdata', {
                operation: "productionoutputwithtarget",
                data: data
            });
            inprog.productionoutputwithtarget = false;
        })


    }

     if (inprog.equipmentanomalycount == false) {
        inprog.equipmentanomalycount = true;
        dash.getEquipmentAnomalyCount("","",function (data) {
            console.log("getEquipmentAnomalyCount", data);
            io.emit('dashdata', {
                operation: "equipmentanomalycount",
                data: data
            });
            inprog.equipmentanomalycount = false;
        })


    }


}


function getDashDataApi(options,callback) {

    var tftype="";
    var tfdate="";

    if (options.tftype) tftype=options.tftype;
    if (options.tfdate) tfdate=options.tfdate;




    utils.colog("dashboard getdashdata interval function", arg);
    var io = global.io;
    //return;


    if (inprog.operationshutdowntime == false) {
        inprog.operationshutdowntime = true;
        var opts=options;
        opts.linea="LU30";
        dash.getOperationShutdownTime(options,function (data) {
            // console.log("getOperationShutdownTime",data);
            io.emit('dashdata', {
                operation: "operationshutdowntime",
                data: data
            });
            inprog.operationshutdowntime = false;

        })

    }


    if (inprog.productdefectcount == false) {
        inprog.productdefectcount = true;
        dash.getProductDefectCount(tftype,tfdate,function (data) {
            console.log("getProductDefectCount", data);
            io.emit('dashdata', {
                operation: "productdefectcount",
                data: data
            });
            inprog.productdefectcount = false;
        })


    }

    if (inprog.productionoutputwithtarget == false) {
        inprog.productionoutputwithtarget = true;
        dash.getProductionOutputWithTarget(tftype,tfdate,function (data) {
            console.log("getProductionOutputWithTarget", data);
            io.emit('dashdata', {
                operation: "productionoutputwithtarget",
                data: data
            });
            inprog.productionoutputwithtarget = false;
        })


    }

     if (inprog.equipmentanomalycount == false) {
        inprog.equipmentanomalycount = true;
        dash.getEquipmentAnomalyCount(tftype,tfdate,function (data) {
            console.log("getEquipmentAnomalyCount", data);
            io.emit('dashdata', {
                operation: "equipmentanomalycount",
                data: data
            });
            inprog.equipmentanomalycount = false;
        })


    }

    callback();


}



/*


router.get("/getsimulstatus",function(req,res){
    res.send({simulstatus: simultimer.status_on});
})

router.get("/setsimul/:status", function (req, res) {
    var status = req.params.status.toLowerCase().trim();
    var retvalue = {
        msg: "Simulator has been turned ON - interval setted to " + simultimer.interval
    }
    if (status == "on") {
        setSimulOn(true);
        console.log(retvalue.msg);
    }
    if (status == "off") {
        setSimulOn(false);
        retvalue.msg = "Simulator has been turned OFF";
        
        console.log(retvalue.msg);
    }
    if (status == "toggle") {
        var st=simultimer.status_on;
        st=!st;
        setSimulOn(st);
        var parola="ON";
        if (simultimer.status_on==false) parola="OFF";
        retvalue.msg = "Simulator has been turned "+parola;
        retvalue.simulstatus=st;
        console.log(retvalue.msg);
    }
    res.send(retvalue);

})

*/

/* GET users listing. */


router.get('/operationshutdowntime', function (req, res, next) {

    var tftype="";
    var tfdate="";
    var machine="";
    var linea="";

    if (req.query.tftype) tftype=req.query.tftype;
    if (req.query.tfdate) tfdate=req.query.tfdate;
    if (req.query.machine) machine=req.query.machine;
    if (req.query.linea) linea=req.query.linea;

    var options={
        tftype: tftype,
        tfdate: tfdate,
        machine: machine,
        linea: linea

    }

    dash.getOperationShutdownTime(options,function(data) {
        res.send(data);
    })

});



router.get("/productionoutputwithtarget", function (req, res) {

     var tftype="";
    var tfdate="";

    if (req.query.tftype) tftype=req.query.tftype;
    if (req.query.tfdate) tfdate=req.query.tfdate;

    dash.getProductionOutputWithTarget(tftype,tfdate,function (data) {
        res.send(data);
    })
})

router.get("/stops/:machine",function(req,res){
    var machine=req.params.machine;
    dash.getStops(function(data){

        var odata={
            rows:[]
        }
        data.rows.forEach(function(item,idx){

            var mac=item.MACCHINA;
            if (mac.toLowerCase()==machine.toLowerCase()){
                odata.rows.push(item)
            }


        })

        res.send(odata);
    })

})

router.get("/productdefectcount", function (req, res) {

     var tftype="";
    var tfdate="";

    if (req.query.tftype) tftype=req.query.tftype;
    if (req.query.tfdate) tfdate=req.query.tfdate;

  

    dash.getProductDefectCount(tftype,tfdate,function (data) {
        res.send(data);
    })

})


router.get("/equipmentanomalycount", function (req, res) {

      var tftype="";
    var tfdate="";

    if (req.query.tftype) tftype=req.query.tftype;
    if (req.query.tfdate) tfdate=req.query.tfdate;

    dash.getEquipmentAnomalyCount(tftype,tfdate,function (data) {
        res.send(data);
    })

})

router.get("/sensormeasurement", function (req, res) {
    dash.getSensorMeasurement(function (data) {
        res.send(data);
    })

})


router.get('/getalldashdatafromfile', function (req, res, next) {
    fdbs.readJsonFile("data/lu30.json", function (data) {
        // dbs.list("lu30",function(data){
        var productioncount = 0;
        var waitcount = 0;
        var stopcount = 0;
        var total = 0;
        var durtime = [];

        data.rows.forEach(function (item, idx) {
            total++;

            var tipo = item.type.toLowerCase().trim();
            if (tipo == "wait") waitcount++;
            if (tipo == "production") productioncount++;
            if (tipo == "stop") stopcount++;
            if (total < 100) durtime.push(parseInt(item.True_duration_Time_Hist, 10));





        })

        res.send({
            total: total,
            stop: stopcount,
            wait: waitcount,
            production: productioncount,
            true_duration_time_hist: durtime

        })

    })

    //res.send('respond with a resource');
});





router.get("/getalldashdatafromcsv", function (req, res) {
    fdbs.readCsvFile("data/lu30_energypaker_h1000.csv", function (data) {
        // dbs.list("lu30",function(data){

        /*
         paker_1: pacchetti buoni,
         paker_4: pacchetti cattivi,
         maker_53: sigarette buone,
         maker_82: sigarette cattive    
         */


        var productioncount = 0;
        var waitcount = 0;
        var stopcount = 0;
        var total = 0;
        var durtime = [];

        data.rows.forEach(function (item, idx) {
            total++;

            var tipo = item.type.toLowerCase().trim();
            if (tipo == "wait") waitcount++;
            if (tipo == "production") productioncount++;
            if (tipo == "stop") stopcount++;
            if (total < 100) durtime.push(parseInt(item.True_duration_Time_Hist, 10));





        })

        res.send({
            total: total,
            stop: stopcount,
            wait: waitcount,
            production: productioncount,
            true_duration_time_hist: durtime

        })

    })
});



router.get('/getalldashdata_old', function (req, res, next) {

    dbs.list("lu30", function (data) {
        var productioncount = 0;
        var waitcount = 0;
        var stopcount = 0;
        var total = 0;
        var durtime = [];

        data.rows.forEach(function (item, idx) {
            total++;

            var tipo = item.doc.type.toLowerCase().trim();
            if (tipo == "wait") waitcount++;
            if (tipo == "production") productioncount++;
            if (tipo == "stop") stopcount++;
            if (total < 10) durtime.push(parseInt(item.doc.True_duration_Time_Hist, 10));





        })

        res.send({
            total: total,
            stop: stopcount,
            wait: waitcount,
            production: productioncount,
            true_duration_time_hist: durtime

        })

    })

    //res.send('respond with a resource');
});


router.get('/getalldashdata', function (req, res, next) {

    var tftype="";
    var tfdate="";
    var machine="";
    var linea="";

    if (req.query.tftype) tftype=req.query.tftype;
    if (req.query.tfdate) tfdate=req.query.tfdate;
    if (req.query.macine) machine=req.query.machine;
    if (req.query.linea) linea=req.query.linea;

    var options={
        tfdate: tfdate,
        tftype: ttype,
        machine: machine,
        linea: linea
    }

    getDashDataApi(options,function(){
        res.send("done");
    })

});


router.get("/getfaults",function(req,res){

   var line=req.query.line;
   var machine=req.query.machine;
   var options={
       line: line,
       machine: machine
   }
   dash.getFaults(options,function(data){
    res.send(data)

   })



})


router.get("/getprefaults",function(req,res){

   var line=req.query.line;
   var machine=req.query.machine;
   var options={
       line: line,
       machine: machine
   }
   dash.getPreFaults(options,function(data){
    res.send(data)

   })



})


router.get("/getPostfaults",function(req,res){

   var line=req.query.line;
   var machine=req.query.machine;
   var options={
       line: line,
       machine: machine
   }
   dash.getPostFaults(options,function(data){
    res.send(data)

   })



})

module.exports = router;