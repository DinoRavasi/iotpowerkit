/**
 * Master Controller
 */

angular.module('RDash')

    .factory("socket", function (globals, $rootScope) {

        console.log("socketservice")

        var socketService = {
            socket: {}
        };

        socketService.socket = io.connect(globals.rooturl);

        socketService.connect = function () {

            var url = globals.rooturl;
            console.log("connect to " + url);
            socketService.socket = io.connect(url);
        }




        socketService.socket.on('getclientspecs', function (msg) {
            console.log("socket getclientspecs from the server", msg);
            //$rootScope.$broadcast("refreshChatUsers","");
        });

        socketService.socket.on('iot_deviceevent', function (msg) {
            // console.log("iot events received from socket server in sockservice", msg);
            $rootScope.$broadcast("iotbuffer", msg);
        });

        socketService.socket.on('dashdata', function (msg) {
            console.log("iot events received from socket server", msg);
            $rootScope.$broadcast("dashdata", msg);
        });





        return socketService;
    })
    .factory("iotchart", function () {
        var iotchart = {};



        iotchart.charts = charts;

        iotchart.getRandomData = function (n) {
            var arr = [];
            for (var i = 0; i < n; i++) {
                arr.push(Math.floor((Math.random() * 10) + 1));
            }
            return arr;
        }

        iotchart.mapIot = function (args, $scope) {

            iotchart.charts.forEach(function (item, idx) {
                item.charttype = "chart chart-" + item.chart.type;

                if (item.evtype.toLowerCase() == args.evtype.toLowerCase()) {
                    //console.log("iotbuffer " + args.evtype + " in iotchart service", args);
                    if (item.chart.labels.length == 0) {

                        for (var i = 0; i < item.steps; i++) {
                            item.chart.labels.push(parseInt(i, 10) + 1);
                        }
                        //console.log("item.chart.labels",item.chart.labels)

                    }
                    var fields = item.fields;
                    fields.forEach(function (fitem, fidx) {

                        if (!item.chart.data[fidx]) {
                            // console.log("nun ce sta")
                            //if (!item.chart.data[fidx]) {

                            var arr = [];
                            for (var i = 0; i < item.steps; i++) {

                                arr.push[i];

                            }

                            item.chart.data.push(arr);
                            //console.log("creating data array", item.chart.data.length, item.chart.data);
                        }
                        if (args.events[0][fitem]) {
                            if (item.chart.data[fidx].length == 0) {
                                for (var i = 0; i < item.steps; i++) {
                                    item.chart.data[fidx].push(0);
                                }
                            }

                            if (item.chart.series.indexOf(fitem) == -1) item.chart.series.push(fitem);
                            var eventvalue = args.events[0][fitem].replace(",", ".");
                            // console.log("found field idx " + fidx + " " + fitem + " in events, value", eventvalue, item.chart.data);
                            //console.log("item.chart.data.length",item.chart.data.length,"fidx",fix);



                            if (item.chart.data[fidx].length == item.steps) item.chart.data[fidx].shift();

                            item.chart.data[fidx].push(parseFloat(eventvalue));


                            $scope.$digest();
                            // console.log("item.chart.data[" + fidx + "]", item.chart.data[fidx]);


                        } else {
                            // console.log("field " + fitem + " not found in events");
                        }

                    })
                    // if (item.chart.data.length == item.chart.steps) item.chart.data.length
                }
            })

            $scope.$digest();

        }










        return iotchart;




    })


    .controller('MasterCtrl', ['$scope', '$cookieStore', 'socket','globals', 'iotchart', MasterCtrl]);



function MasterCtrl($scope, $cookieStore, socket, globals,iotchart) {
    /**
     * Sidebar Toggle & Cookie Control
     */
    $scope.charts=[];

    $scope.manzo = {

        chart: {
            title: "titolo",
            type: "bar",
            data: [3, 4, 5, 6, 7],
            labels: [1, 2, 3, 4],
            series: [],
        },
        evtype: "sensormeasurement.json",
        fields: ["Value", "rinoceronte", "fagiano"],
        steps: 7
    }

    $scope.$on("iotbuffer", function (event, args) {

        console.log("iotbuffer",args)
        iotchart.mapIot(args, $scope);

    });

    $scope.init=function(){
        $scope.charts = iotchart.charts;
        console.log($scope.charts);

    }

    var mobileView = 992;

    console.log("ddd", socket, globals)
    //socket.connect();

    $scope.getWidth = function () {
        return window.innerWidth;
    };

    $scope.$watch($scope.getWidth, function (newValue, oldValue) {
        if (newValue >= mobileView) {
            if (angular.isDefined($cookieStore.get('toggle'))) {
                $scope.toggle = !$cookieStore.get('toggle') ? false : true;
            } else {
                $scope.toggle = true;
            }
        } else {
            $scope.toggle = false;
        }

    });

    $scope.toggleSidebar = function () {
        console.log("eccoci");
        $scope.toggle = !$scope.toggle;
        $cookieStore.put('toggle', $scope.toggle);
    };

    window.onresize = function () {
        $scope.$apply();
    };
}