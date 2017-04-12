var dbs = require('../routes/dbs');

var companyconfig = {};
loadCompanyConfig(function (data) {
  console.log("");
  console.log("company config loading completed !!");
});



/*
var machines = [{
    name: "Machine_01",
    description: "Machine01",
    type: "",
    bkcolor: "#e0e0e0"
  },
  {
    name: "Machine_02",
    description: "Machine02",
    type: "buffer",
    bkcolor: "#ffc107"

  },
  {
    name: "Machine_03",
    description: "Machine03",
    type: "",
    bkcolor: "#e0e0e0"
  },
  {
    name: "Machine_04",
    description: "Machine04",
    type: "",
    bkcolor: "#e0e0e0"
  },
  {
    name: "Machine_05",
    description: "Machine05",
    type: "",
    bkcolor: "#e0e0e0"
  },
  {
    name: "Machine_06",
    description: "Machine06",
    type: "buffer",
    bkcolor: "#ffc107"
  },
  {
    name: "Machine_07",
    description: "Machine07",
    type: "",
    bkcolor: "#e0e0e0"
  },
  {
    name: "Machine_08",
    description: "Machine08",
    type: "buffer",
    bkcolor: "#ffc107"
  },
  {
    name: "Machine_09",
    description: "Machine09",
    type: "",
    bkcolor: "#e0e0e0"
  },
];

*/


/*
var companydescr = [{
  name: "PL01",

  machines: machines
}];



var productionlines = [{
  name: "X01_line",
  machines: machines
}];


var plants = [{
  customer: "Customer01",
  location: "Location01",
  lines: ['X01_line', 'X02_line']
}]


var companydescr = [{
  name: "X01_line",
  smachines: ["121P", "H1000", "W1000BV"],
  machines: machines
}];

*/

function loadCompanyConfig(callback) {

  dbs.listByField("config", "name", "companyconfig", function (data) {
      //console.log(data.rows[0].doc);


      var cdata = data.rows[0].doc.data;

      companyconfig = cdata;

      console.log("companyconfig loaded");
      console.log("company: " + cdata.customer);
      console.log("plants", cdata.plants.length);
      console.log("  ");

      cdata.plants.forEach(function (item, idx) {
        var plant = item;
        var num = parseInt(idx, 10) + 1;
        console.log(num + " plant", plant.name, "location", plant.location, "productionlines", plant.productionlines.length);

        plant.productionlines.forEach(function(plitem,plidx){

          var pl=plitem;
          var plnum = parseInt(plidx, 10) + 1;
          console.log("---- " + plnum + " productionline", pl.name, "machines", pl.machines.length);
          pl.machines.forEach(function (pitem, pidx) {
          var pnum = parseInt(pidx, 10) + 1;
          var machine = pitem;
          console.log("-------- " + pnum + " machine", machine.name, "descr", machine.description);

        })
        })


       

      })
   

    //write companyconfig for client in company.js

/*
    var fs = require('fs');

    var txt="var companyconfig="+JSON.stringify(cdata);
    var fname="companyconfig.js";

    fs.writeFile("./public_dino/models/"+fname, txt, function(err) {
    if(err) {
        return console.log(err);
    }

    

   
});   
*/


   
    if (callback) callback(cdata);

  })

}

function getCompanyConfig(){
  return companyconfig;
}


//exports.machines = machines;
//exports.linee = companydescr;
exports.getCompanyConfig=getCompanyConfig;
exports.companyconfig=companyconfig;
exports.loadCompanyConfig = loadCompanyConfig;