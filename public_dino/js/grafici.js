/*var charts = [{
        id: "tempumid",
        chart: {
            title: "titolo",
            type: "line",
            sdata: [
               

            ],
            slabels: [],
            sseries: [],
            options: {
                responsive: true,
                legend: {
                    display: true
                }
            },

        },
        evtype: "temp",
        sfields: ["acceleration_x", "acceleration_y", "acceleration_z"],
        sfields: ["temp", "umid"],
        ssteps: 10
    },
    {
        id: "acceleration_x",
        chart: {
            title: "titolo",
            type: "line",
            sdata: [
             
            ],
            slabels: [],
            sseries: [],
            options: {
                responsive: true,
                legend: {
                    display: true
                }
            },

        },
        evtype: "accel",
        sfields: ["acceleration_x", "acceleration_y", "acceleration_z"],
        ssteps: 10
    }
];*/

/*var charts = [{
        id: "tempumid",
        schart: {
            title: "titolo",
            type: "bar",
            slabels: ["jan","feb","mar","apr","may","jun","jul","aug","sep","oct","nov","dic"],
            soptions: {
                responsive: true,
                legend: {
                    display: true
                }
            },
            

        },
        evtype: "temp",


     
    },
    {
        id: "acceleration_x",
        schart: {
            title: "titolo",
            type: "line",
       
            options: {
                responsive: true,
                legend: {
                    display: true
                }
            },

        },
        evtype: "accel",
      
    }
];*/

var charts=[{
    id: "pozzevent",
    evtype: "event",
    sfields: ["umid","temp"]
},
{
    id: "cialdevent",
    evtype: "temp",
    sfields: ["umid","temp"]
},
{
    id: "cialdevent2",
    evtype: "temp2",
    sfields: ["umid","temp"]
}]





var charts_old = [{
        id: "conditionindicators",
        chart: {
            title: "titolo",
            type: "bar",
            data: [
                [],
                [],
                []
                /*getRandomData(10)*/
            ],
            labels: [],
            series: [],
            options: {
                legend: {
                    display: false
                }
            }
        },
        evtype: "conditionindicators.json",
        fields: ["Value", "Packer_Motore_03", "fagiano"],
        steps: 10
    },
    {

        chart: {
            title: "titolo",
            type: "line",
            data: [
                [],
                [],
                []

            ],
            labels: [],
            series: [],
            options: {
                legend: {
                    display: false
                }
            }
        },
        evtype: "sensormeasurement.json",
        fields: ["Value", "rinoceronte", "fagiano"],

        steps: 15
    },
    {

        chart: {
            title: "titolo",
            type: "line",
            data: [
                [],
                [],
                []

            ],
            labels: [],
            series: [],
            options: {
                legend: {
                    display: false
                }
            }
        },
        evtype: "sensormeasurement.json",
        fields: ["Value", "rinoceronte", "fagiano"],

        steps: 12
    },
    {

        chart: {
            title: "titolo",
            type: "line",
            data: [
                [],
                [],
                []

            ],
            labels: [],
            series: [],
            options: {
                legend: {
                    display: false
                }
            }
        },
        evtype: "sensormeasurement.json",
        fields: ["Value", "rinoceronte", "fagiano"],

        steps: 12
    },
    {

        chart: {
            title: "titolo",
            type: "line",
            data: [
                [],
                [],
                []

            ],
            labels: [],
            series: [],
            options: {
                legend: {
                    display: false
                }
            }
        },
        evtype: "sensormeasurement.json",
        fields: ["Value", "rinoceronte", "fagiano"],

        steps: 12
    },
    {

        chart: {
            title: "titolo",
            type: "line",
            data: [
                [],
                [],
                []

            ],
            labels: [],
            series: [],
            options: {
                legend: {
                    display: false
                }
            }
        },
        evtype: "sensormeasurement.json",
        fields: ["Value", "rinoceronte", "fagiano"],

        steps: 12
    }


];


var dashcharts = [{
    id: "operationshutdowntime",
    chart: {
        title: "titolo",
        type: "pie",
        hasCard: true,
        data: [
            [],
            [],
            []
            /*getRandomData(10)*/
        ],
        labels: [],
        series: [],
        options: {
            legend: {
                display: false
            }
        }
    },
    evtype: "conditionindicators.json",
    fields: ["Value", "Packer_Motore_03", "fagiano"],
    steps: 10
}]