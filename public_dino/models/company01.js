
var machines= [
  {
    name: "Machine01",
    description: "Machine01",
    type: "",
	bkcolor: "#e0e0e0"
  },
  {
    name: "Machine02",
    description: "Machine02",
    type: "buffer",
	bkcolor: "#ffc107"
	
  },
  {
    name: "Machine03",
    description: "Machine03",
    type: "",
	bkcolor: "#e0e0e0"
  },
  {
    name: "Machine04",
    description: "Machine04",
    type: "",
	bkcolor: "#e0e0e0"
  },
  {
    name: "Machine05",
    description: "Machine05",
    type: "",
	bkcolor: "#e0e0e0"
  },
  {
    name: "Machine06",
    description: "Machine06",
    type: "buffer",
	bkcolor: "#ffc107"
  },
  {
    name: "Machine07",
    description: "Machine07",
    type: "",
	bkcolor: "#e0e0e0"
  },
  {
    name: "Machine08",
    description: "Machine08",
    type: "buffer",
	bkcolor: "#ffc107"
  },
  {
    name: "Machine09",
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
        name: "PL01",
        machines: machines
      }
    ];


var plants=[
  {
    customer: "Customer01",
    location: "Location01",
    lines: ['PL01','PL02']
  }
]
