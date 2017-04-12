var dbs = require("../routes/dbs");
var fdbs = require("../routes/filedbs");
var utils = require("../lib/utils");
var db2 = require("../lib/dashdb");
var fmodel = require("../lib/factorymodel");
var boxf = require("../lib/boxfiles");

var moment = require('moment');



//BOX FILES

//OEE2.csv --> https://ibm.box.com/shared/static/c3eoy1fzlxcg1jb8f3e9xzu4di30qnmq.json
//LU30_equipment_anomaly_count--> https://ibm.box.com/shared/static/wskc6micxfrvkmgjn9ngmwlcmsg7k0qx.json
//LU30_production_defect_count --> https://ibm.box.com/shared/static/xh8r7a115hh7ptbry3p53qloe7tx134b.json
//faults.csv --> https://ibm.box.com/shared/static/at4sdt6rcnh6hqopqschfatjjoi91yx0.json

//pre-stops --> https://ibm.box.com/shared/static/jkwdqxx9w9im3cc8bg0uikrvlipymwl0.json
//post-stops --> https://ibm.box.com/shared/static/adp6l3apkukd0mxfsp54ybegwx96nren.json


//Dashboard retrieves library


function getPreFaults(options,callback){

    var line=options.line;
    var machine=options.machine;

     fdbs.readJsonFileRemoteHttps("/shared/static/jkwdqxx9w9im3cc8bg0uikrvlipymwl0.json", function (data) {

        var arr=[];
        var rows=data.rows;
        rows.forEach(function(item,idx){
            if ((item.Macchina.toLowerCase()==machine.toLowerCase()) && (item.Line.toLowerCase()==line.toLowerCase())){
                arr.push(item);
            }



        })


        callback(arr);

     })




}


function getPostFaults(options,callback){

    var line=options.line;
    var machine=options.machine;
    var fname=boxf.getBoxFile("poststops");

     fdbs.readJsonFileRemoteHttps(fname, function (data) {

        var arr=[];
        var rows=data.rows;
        rows.forEach(function(item,idx){
            if ((item.Macchina.toLowerCase()==machine.toLowerCase()) && (item.Line.toLowerCase()==line.toLowerCase())){
                arr.push(item);
            }



        })


        callback(arr);

     })




}






function getFaults(options,callback){

    var line=options.line;
    var machine=options.machine;
    var fname=boxf.getBoxFile("faults");

//read faults.csv
     fdbs.readJsonFileRemoteHttps(fname, function (data) {

        var arr=[];
        var rows=data.rows;
        rows.forEach(function(item,idx){
            if ((item.Machine.toLowerCase()==machine.toLowerCase()) && (item.line.toLowerCase()==line.toLowerCase())){
                arr.push(item);
            }



        })


        callback(arr);

     })




}



function getOperationShutdownTime(options, callback) {

    var tftype = "";
    var tfdate = "";
    var machine = "";
    var linea="X01_Line";

    if (options.tftype) tftype=options.tftype;
    if (options.tfdate) tfdate=options.tfdate;
    if (options.machine) machine=options.machine;
    if (options.linea) linea=options.linea;
    
    



    var useTimeFrame = false;



    if (tftype != "") useTimeFrame = true;


    if (tfdate.trim() == "") {
        tfdate = moment("24-10-2016", "DD-MM-YYYY");
    } else {
        tfdate = moment(tfdate, "DD-MM-YYYY");
    }




    //console.log("operationshutdowntime tftype", tftype, "tfdate", tfdate.toDate()), "machine", machine);





    var q = "select * from TimeHistory_H1000_LU30";

    var t1 = new Date();

    //db2.query(q,function(data){

     var fname=boxf.getBoxFile("oee2");       


    fdbs.readJsonFileRemoteHttps(fname, function (data) { //OEE2.csv
        //fdbs.readJsonFileRemoteHttps("/shared/static/479glx1xkf89m3a9bcb3qxai4h7ybv31.json", function (data) {
        //fdbs.readJsonFile("data/TimeHistory_H1000_LU30.json", function (data) {
        //dbs.list("lu30", function (data) {
        var t2 = new Date();
        var diff = t2 - t1;
        console.log("query time: ", diff);

        var productioncount = 0;
        var waitcount = 0;
        var stopcount = 0;
        var total = 0;
        var durtime = [];

        data.rows.forEach(function (item, idx) {

            var datarecord = utils.getSafeField(item, "Date");
            var macchina = utils.getSafeField(item, "Machine");
            //var truestartday = datarecord.substring(3, 5) + "-" + datarecord.substring(0, 2) + "-20" + datarecord.substring(6, 8);
            var truestartday=moment(datarecord, "DD/MM/YYYY").format("MM-DD-YYYY");
            //console.log(truestartday);
            var itemlinea = utils.getSafeField(item, "Line");

            var doIt = false;

            if (itemlinea.toLowerCase().trim() == linea.toLowerCase().trim()) {
                if (machine.trim() != "") {
                    if (machine.toLowerCase().trim() == macchina.toLowerCase().trim()) doIt = true;
                } else {
                    doIt = true;

                }
               
            }

            if (doIt) {

                //console.log(item);

                var tsday = moment(truestartday, "MM-DD-YYYY").toDate();
                //console.log(tsday)
                var issame = true;
                if (useTimeFrame) {
                    console.log("tfdate",tfdate,"tsday",tsday)
                    issame = moment(tfdate).isSame(tsday, tftype);

                }




                //issame=true;
                //console.log("truestart", truestart, "tsday", tsday, "issame", issame);
                if (issame) {
                    total++;
                    //var tipo = item.type.toLowerCase().trim();
                    var tipo = utils.getSafeField(item, "Type").toLowerCase().trim();
                    var true_duration = utils.getSafeField(item, "Total");
                    console.log(true_duration)
                    //var td = parseInt(item.True_duration.trim());
                    //console.log("True_duration",utils.getSafeField(item,"True_duration"));
                    var td = parseInt(true_duration.trim(), 10);
                    if (tipo == "wait") waitcount += td;

                    if (tipo == "production") productioncount += td;
                    if (tipo == "stop") stopcount += td;
                    if (total < 100) durtime.push(parseInt(td, 10));
                }


            }


        })

        callback({
            total: total,
            stop: stopcount,
            wait: waitcount,
            production: productioncount,
            true_duration_time_hist: durtime

        })

    })


}


function getProductionOutputWithTarget(tftype, tfdate, callback) {


    var useTimeFrame = false;
    //tftype = tftype.toLowerCase().trim();


    if (tftype != "") useTimeFrame = true;

    if (tfdate.trim() == "") {
        tfdate = moment("30-09-2016", "DD-MM-YYYY");


    } else {
        tfdate = moment(tfdate, "DD-MM-YYYY");

    }



    console.log("getproductionoutputwithtarget tftype", tftype, "tfdate", tfdate.toDate());


    var fname=boxf.getBoxFile("productionoutputwithtarget");

    //https://ibm.box.com/shared/static/uj676p6rs32j7q6eid70rgdslqd56q1u.json
    fdbs.readJsonFileRemoteHttps(fname, function (data) {
    //fdbs.readJsonFileRemoteHttps("/shared/static/uj676p6rs32j7q6eid70rgdslqd56q1u.json", function (data) {
        //fdbs.readJsonFile("data/productionoutputwithtarget.json", function (data) {
        var tot = 0;
        console.log("li ho letti !!");
        //console.log(data);

        var maxpaker = 0;

        data.rows.forEach(function (item, idx) {
            //console.log(item);
            var truestart = item.Timestamp;
            var truestartday = truestart.split(" ")[0];
            var tsday = moment(truestartday, "MM-DD-YYYY").toDate();

            var issame = true;
            if (useTimeFrame) {
                issame = moment(tfdate).isSame(tsday, tftype);

            }




            if (issame) {
          
                var paker1 = parseFloat(item.Production);
                if (paker1 > maxpaker) {
                    tot = paker1;
                    maxpager = paker1;
                }
                //tot += paker1;
            }
        });
        callback({
            paker1: tot

        })





    });


}


function getProductDefectCount(tftype, tfdate, callback) {


    // calcolo del valore più vicino in termini di timestamp, non somma

    var useTimeFrame = false;
    //tftype = tftype.toLowerCase().trim();


    if (tftype != "") useTimeFrame = true;

    if (tfdate.trim() == "") {
        tfdate = moment("30-09-2016", "DD-MM-YYYY");

    } else {
        tfdate = moment(tfdate, "DD-MM-YYYY");

    }



    console.log("productdefectcount tftype", tftype, "tfdate", tfdate.toDate());

   
var fname=boxf.getBoxFile("LU30_production_defect_count");

fdbs.readJsonFileRemoteHttps(fname, function (pakerdata) {
    //fdbs.readJsonFileRemoteHttps("/shared/static/h0yolwwdywdjju9bzym7kbrvmlonqxxe.json", function (pakerdata) {
        //fdbs.readJsonFile("data/LU30_Energy_Paker_TH.json", function (pakerdata) {
        var totpaker = 0;
        console.log("paker rows: ", pakerdata.rows.length);

        var maxpaker=0;
        var maxmaker=0;
        var machines=[];

        pakerdata.rows.forEach(function (item, idx) {
            //console.log(item);

            var macchina=utils.getSafeField(item,"Macchina");
            var count=utils.getSafeField(item,"Count");
            console.log("macchina",macchina);

            machines.push({
                machine: macchina,
                count: count
            })



            var issame=true;



            if (issame) {

                if (macchina=="121P"){

                    if (count>maxpaker){
                        maxpaker=count;
                    }

                }
                if (macchina=="H1000"){
                    if (count>maxmaker){
                        maxmaker=count;
                    }


                }
                var paker1 = parseFloat(item.Paker_4);
                totpaker += paker1;
            }
        });


        //sort by factorymodel
        
        var newmachines=[];


        //console.log(fmodel.getCompanyConfig());

        var ffmodel=fmodel.getCompanyConfig().plants[0].productionlines[0];

        ffmodel.machines.forEach(function(item,idx){
            var mname=item.name;
            machines.forEach(function(mitem,midx){
                   if (mitem.machine.toLowerCase()==mname.toLowerCase()){
                       newmachines.push(mitem);
                   }


            })


        })



        callback({
                paker: maxpaker,
                maker: maxmaker,
                machines: newmachines

            })




    });

}

function getEquipmentAnomalyCount(tftype, tfdate, callback) {

    var useTimeFrame = false;
    //tftype = tftype.toLowerCase().trim();


    if (tftype != "") useTimeFrame = true;

    if (tfdate.trim() == "") {
        tfdate = moment("30-09-2016", "DD-MM-YYYY");

    } else {
        tfdate = moment(tfdate, "DD-MM-YYYY");

    }



    console.log("equipmentanomalycount tftype", tftype, "tfdate", tfdate.toDate());



    //https://ibm.box.com/shared/static/gmix44hg9r83u6yzdtd8dunr9d0hw5z3.json

    var fname=boxf.getBoxFile("LU30_equipment_anomaly_count");

    fdbs.readJsonFileRemoteHttps(fname, function (data) { 
    //fdbs.readJsonFileRemoteHttps("/shared/static/wskc6micxfrvkmgjn9ngmwlcmsg7k0qx.json", function (data) { 
   // fdbs.readJsonFileRemoteHttps("/shared/static/gmix44hg9r83u6yzdtd8dunr9d0hw5z3.json", function (data) {
        //fdbs.readJsonFile("data/MessageHistory_H1000_LU30_TH.json", function (data) {
        var totmaker = 0;
        //console.log(data.rows.length);


        var arrmachines=[];

        data.rows.forEach(function (item, idx) {
            //console.log(item);

            var truestart = item.True_start;
            var truestartday = truestart.split(" ")[0];
            var tsday = moment(truestartday, "MM-DD-YYYY").toDate();
            var macchina=utils.getSafeField(item,"Machine");
           


            var issame = true;
            if (useTimeFrame) {
                var
                    issame = moment(tfdate).isSame(tsday, tftype);

            }


            if (issame) {

                var found=false;
                var machindex=-1;
                arrmachines.forEach(function(mitem,midx){
                    if (mitem.machine==macchina) {
                        machindex=midx;
                        found=true;    
                    }


                })
                if (!found){
                    arrmachines.push({
                        machine: macchina,
                        count: 0
                    })
                    machindex=arrmachines.length-1;
                }

                var isStop = item.isStop;
                if (String(isStop) == "TRUE") {
                    arrmachines[machindex].count++;
                   }


                /*var isStop = item.isStop;
                if (String(isStop) == "true") totmaker++;*/
            }

        });

            //sort by factorymodel
        
        var newmachines=[];

        
        //console.log(fmodel.getCompanyConfig());

        var ffmodel=fmodel.getCompanyConfig().plants[0].productionlines[0];

        ffmodel.machines.forEach(function(item,idx){
            var mname=item.name;
            arrmachines.forEach(function(mitem,midx){
                   if (mitem.machine.toLowerCase()==mname.toLowerCase()){
                       newmachines.push(mitem);
                   }


            })


        })


        callback({
            machines: newmachines

        })





    });


    //aggiungere messaghistory 121 corrispondente

}

function getSensorMeasurement(callback) {
    //https://ibm.box.com/shared/static/gmix44hg9r83u6yzdtd8dunr9d0hw5z3.json

    var fname=boxf.getBoxFile("sensormeasurement");

     fdbs.readJsonFileRemoteHttps(fname, function (data) {
   // fdbs.readJsonFileRemoteHttps("/shared/static/p13iiwphchgkouxmc6xeb2azt11gopj3.json", function (data) {
        //fdbs.readJsonFile("data/MessageHistory_H1000_LU30_TH.json", function (data) {
        var totmaker = 0;
        console.log(data.rows.length);
        callback(data.rows);




    });




}


function getStops(callback){

    var fname=boxf.getBoxFile("oee2");

  fdbs.readJsonFileRemoteHttps(fname, function (data){
     // fdbs.readJsonFileRemoteHttps("/shared/static/c3eoy1fzlxcg1jb8f3e9xzu4di30qnmq.json", function (data){



        callback(data);

      });


}

exports.getOperationShutdownTime = getOperationShutdownTime;
exports.getProductionOutputWithTarget = getProductionOutputWithTarget;
exports.getProductDefectCount = getProductDefectCount;
exports.getEquipmentAnomalyCount = getEquipmentAnomalyCount;
exports.getSensorMeasurement = getSensorMeasurement;
exports.getStops = getStops;
exports.getFaults=getFaults;
exports.getPreFaults=getPreFaults;
exports.getPostFaults=getPostFaults;