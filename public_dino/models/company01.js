
var machines= [
  {
    name: "121P",
    description: "Maker",
    type: "",
	bkcolor: "#e0e0e0"
  },
  {
    name: "BUFFER-121B",
    description: "Buffer",
    type: "buffer",
	bkcolor: "#ffc107"
	
  },
  {
    name: "H1000",
    description: "Packer",
    type: "",
	bkcolor: "#e0e0e0"
  },
  {
    name: "CH",
    description: "Cellophane pacchetto",
    type: "",
	bkcolor: "#e0e0e0"
  },
  {
    name: "BV",
    description: "Steccatrice-cartonatrice",
    type: "",
	bkcolor: "#e0e0e0"
  },
  {
    name: "BUFFER-BV",
    description: "Buffer",
    type: "buffer",
	bkcolor: "#ffc107"
  },
  {
    name: "I",
    description: "Inscatolatrice",
    type: "",
	bkcolor: "#e0e0e0"
  },
  {
    name: "BUFFER-I",
    description: "Buffer",
    type: "buffer",
	bkcolor: "#ffc107"
  },
  {
    name: "P",
    description: "Pallettizzazione",
    type: "",
	bkcolor: "#e0e0e0"
  },
];    



var companydescr = [{
        name: "LU30",
        smachines: ["121P", "H1000","W1000BV"],
        machines: machines
      }
    ];


    
var productionlines = [{
        name: "LU30",
        smachines: ["121P", "H1000","W1000BV"],
        machines: machines
      }
    ];


var plants=[
  {
    customer: "YYY",
    location: "Izmir",
    lines: ['LU30','XXX']
  }
]
