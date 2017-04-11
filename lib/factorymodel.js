
var machines= [
  {
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



var companydescr = [{
        name: "PL01",
        
        machines: machines
      }
    ];


    
var productionlines = [{
        name: "X01_line",
        machines: machines
      }
    ];


var plants=[
  {
    customer: "Customer01",
    location: "Location01",
    lines: ['X01_line','X02_line']
  }
]


var companydescr = [{
        name: "X01_line",
        smachines: ["121P", "H1000","W1000BV"],
        machines: machines
      }
    ];



exports.machines=machines;
exports.linee=companydescr;