
var machines= [
  {
    name: "121P",
    description: "Maker",
    type: ""
  },
  {
    name: "BUFFER-121B",
    description: "Buffer",
    type: "buffer"
  },
  {
    name: "H1000",
    description: "Packer",
    type: ""
  },
  {
    name: "CH",
    description: "Cellophane pacchetto",
    type: ""
  },
  {
    name: "BV",
    description: "Steccatrice-cartonatrice",
    type: ""
  },
  {
    name: "BUFFER-BV",
    description: "Buffer",
    type: "buffer"
  },
  {
    name: "I",
    description: "Inscatolatrice",
    type: ""
  },
  {
    name: "BUFFER-I",
    description: "Buffer",
    type: "buffer"
  },
  {
    name: "P",
    description: "Pallettizzazione",
    type: ""
  },
];    



var companydescr = [{
        name: "LU30",
        smachines: ["121P", "H1000","W1000BV"],
        machines: machines
      }
    ];



exports.machines=machines;
exports.linee=companydescr;