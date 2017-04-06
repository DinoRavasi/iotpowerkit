sensor: {
    deviceId: "",
    timestamp: "",
    value: "",
    unitofmeasure: "",
    type: ""
}


component: {
  id: "",
  machinetype: "",
  model: "",
  sn: "",
  seonsors: []
  productor: "YAMAHA",

}

subarea: {
    id: "",
    description: "",
    components: []
}


area: {
    id: "",
    description: "",
    subarea: []
}

machine: {

    id: "",
    description: "",
    areas: []
}

productionline: {
    id: "";
    description: "",
    machine: []
}

plant: {
    id: "",
    description: "",
    productionLines: []
}

country; {
    id: "",
    description "",
    plants: []


}


customer: {
    id: "",
    description: "",
    countries: []
}

error: {
    source: "",
    code: "",
    description: "",

}


