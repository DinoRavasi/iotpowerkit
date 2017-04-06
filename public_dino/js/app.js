var debug = false;

//var rooturl = "http://localhost:3000";
//var rooturl = "http://iotindustry40.mybluemix.net";
//var rooturl = "http://gd-demo-dashboard.mybluemix.net";
//var rooturl = "http://9.71.213.181:3000";
var rooturl = "https://ibm-industry4-dashboard.eu-gb.mybluemix.net";

var linktoMaximo = false;
var datatobeused = "23-09-2016"



$(document).ready(function () {


})

var colog = function () {
  var dbg = debug;
  if (!dbg) return;
  console.log.apply(console, arguments);
}

var numberWithCommas = function (x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function rightLabels(th, n) {
  //console.log("rightLabels", n);
  if (!n) n = 225;
  // render the value of the chart above the bar
  var ctx = th.chart.ctx;
  ctx.font = Chart.helpers.fontString(Chart.defaults.global.defaultFontSize, 'bold', Chart.defaults.global.defaultFontFamily);
  ctx.fillStyle = th.chart.config.options.defaultFontColor;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'bottom';
  th.data.datasets.forEach(function (dataset) {
    for (var i = 0; i < dataset.data.length; i++) {
      var model = dataset._meta[Object.keys(dataset._meta)[0]].data[i]._model;


      //ctx.fillText(dataset.data[i], model.x, model.y - 5);
      ctx.fillText(numberWithCommas(dataset.data[i]), n, model.y + 6);
    }
  });
}

function rightLabelsPercent(th, n) {
  //console.log("rightLabels", n);
  if (!n) n = 225;
  // render the value of the chart above the bar
  var ctx = th.chart.ctx;
  ctx.font = Chart.helpers.fontString(Chart.defaults.global.defaultFontSize, 'bold', Chart.defaults.global.defaultFontFamily);
  ctx.fillStyle = th.chart.config.options.defaultFontColor;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'bottom';
  th.data.datasets.forEach(function (dataset) {
    for (var i = 0; i < dataset.data.length; i++) {
      var model = dataset._meta[Object.keys(dataset._meta)[0]].data[i]._model;
      //ctx.fillText(dataset.data[i], model.x, model.y - 5);
      ctx.fillText(dataset.data[i] + "%", n, model.y + 6);
    }
  });
}


angular.module('iotapp', [
    /*'ionic',*/
    'ui.router',
    'chart.js',
    'ngAnimate',
    'ngMaterial',
    'ngMdIcons',
    'ridge-speedometer'
  ])
  /*
    .directive("grafico", function ($compile) {

      var controller = ['$scope', function ($scope) {



        $scope.refresh = function () {

          console.log("bravo!!")
        }


      }];



      return {
        restrict: "E",

        template: '<div style="border:2px solid blue; height: 300; width: 300"><canvas style="{{canvasstyle}}" sheight="canvasheight" id="line"  class="chart chart-line" chart-data="grafdata" chart-labels="graflabels" chart-legend="true" chart-series="grafseries" chart-options="grafoptions"></canvas></div>',
        scope: {
          datasource: "=",
          fields: "=",
          charttype: "@charttype"
        },
        link: function (scope, element, attributes) {

          scope.$watch('datasource', function (val) {
            console.log("datasource changed", val)
          });



          scope.title = "prova";



          scope.hi = function () {
            compile = false;
            console.log("HI");
            scope.link(false);
          }

          scope.link = function (c) {
            console.log(scope.datasource);

            var compile = false;
            if (c) {
              if (String(c) == "true") compile = true;
            }
            console.log("compile", compile)
            var steps = 10;
            if (scope.datasource) {
              if (scope.datasource.steps) steps = scope.datasource.steps;
            }

            var cl = "chart chart-bar";

            if (scope.datasource) {
              if (scope.datasource.chart) {
                if (scope.datasource.chart.type) {

                  cl = "chart chart-" + scope.datasource.chart.type;
                }
              }
            }

            console.log("cl", cl);
            element.find("canvas").attr("class", cl)
            var firstElement = {};
            console.log("linkfunction", scope.datasource);
            scope.fagiano = "fagiano";
            //scope.charttype = "chart-line";
            scope.divstyle = "border: 3px solid yellow;"
            scope.canvasstyle = "border: 3px solid lightblue;"

            scope.canvasheight = "50";
            scope.divwidth = "600";
            scope.divheight = "350";
            //scope.fields=["marzotto","fallotto"];

            scope.grafdata = []
            scope.grafseries = [];

            var fields = scope.fields;
            if (scope.datasource) {
              if (scope.datasource.fields) {
                fields = scope.datasource.fields;
              }
            }

            fields.forEach(function (item, idx) {
              var arr = [];
              for (var i = 0; i < 10; i++) {
                arr.push(Math.floor((Math.random() * 10) + 1));
              }

              if (scope.grafdata.length == steps) scope.grafdata.shift();
              scope.grafdata.push(arr);
              scope.grafseries.push(item);
            });

            scope.graflabels = [];
            for (var i = 0; i < steps; i++) {
              if (scope.graflabels.length == steps) scope.graflabels.shift();
              scope.graflabels.push(parseInt(i, 10) + 1);
            }
            //scope.graflabels=[1,2,3,4,5,6,7,8,9,10];

            scope.grafoptions = {
              showTooltips: true,
              legend: {
                display: true
              }
            };

            $compile(element.contents())(scope);

          }

          scope.link(true);
        }
      };
    })

    */

  .factory('secured', function ($rootScope, globals, $state) {

    var securedService = {};


    securedService.checkAuth = function () {

      var cook = getCookie('iotpowerkit');

      console.log(">>>>>>>>>>>>>>>>> secured service, iotpowerkit cookie")
      console.log(cook)
      //alert("Secured")
      if (!cook) {
        // location.href=globals.rooturl+"/#/login";
        $state.go("login");
        return false;
      } else {
        console.log("cook", cook);
        var jcook = JSON.parse(cook);
        var ju = jcook.user.email;
        console.log("iotpowerkit cookie user email", ju);
        globals.nome = jcook.user.nome
        globals.cognome = jcook.user.cognome
        globals.maximoactivation = jcook.user.maximoactivation
        //globals.user=ju;
        return true;
        //colog("globalsin secured",globals);
      }
    }

    return securedService;
  })


  .factory('login', function (globals, $http, $rootScope, socket) {

    var loginService = {};


    console.log(".factory(login loginService in services.js")

    loginService.checklogin = function (callback) {
      console.log("CHECK user is already loggedin in services.js")
      //alert("checklogin")

      if (globals.loggedin == true) {
        colog("user is already loggedin");
        console.log("user is already loggedin in services.js")
        //alert("user is already loggedin");
        socket.socket.emit("loggedin", globals.user);

        callback({
          loggedin: true
        });
        return;

      }

      //alert("user NOT loggedin");
      var loggedin = false;

      //globals.Loading();


      //var ucookie=getCookie("user");
      var ucookie = getCookie("iotpowerkit");
      colog("usercookie iotpowerkit: " + ucookie);

      console.log("usercookie iotpowerkit: " + ucookie);

      //alert("usercookie ucookie: "+ucookie);
      if (ucookie != null) {
        //alert("usercookie ucookie:   !=null ")
        var c = JSON.parse(ucookie);
        colog("usercookie is not NULL");
        colog(c);

        //set global user vars

        globals.username = c.firstname + " " + c.lastname;
        globals.useremail = c.email;
        globals.userrole = c.userrole;
        globals.usercompany = c.company;
        globals.usercustomers = c.customers;
        globals.usergroups = c.usergroups;
        globals.roles = c.roles;
        globals.loggedin = true;

        globals.user = c;

        //console.log("globals.user",globals.user)
        //$rootScope.$broadcast('user:updated',globals.user);
        callback({
          loggedin: true
        })
        return;

      } else {
        //alert("usercookie ucookie:   =null - Loggedin FALSE")
        globals.loggedin = false;
        callback({
          loggedin: false
        })
        return;

      }


    }

    loginService.login = function (callback) {

      var loggedin = false;

      //globals.Loading();

      var ucookie = getCookie("dbg_user");

      // alert("loginService.login")

      console.log("loginservice login, usercookie: " + ucookie);
      if (ucookie != null) {
        var c = JSON.parse(ucookie);
        colog("usercookie is not NULL");

        //set global user vars

        globals.username = c.firstname + " " + c.lastname;
        globals.useremail = c.email;
        globals.userrole = c.userrole;
        globals.usercompany = c.company;
        globals.usercustomers = c.customers;
        globals.roles = c.roles;

        globals.user = c;

        colog("globals.user", globals.user)

        callback({
          loggedin: true
        })
        return;

      }

      console.log("NO COOKIES-1 in services.js")
      location.href = globals.rooturl + "/w3login"
      return;

    }

    loginService.doLogout = function () {

      socket.socket.emit("loggedout", globals.user);

    }


    return loginService;

  })


  .directive("iotchart", function ($compile) {

    return {
      restrict: "E",

      stemplate: '<div class="card" style="margin: 1px; "><div class="item item-divider"><span>{{datasource.evtype}}</span><div style="display:none;"><select ng-change="changeChartType()" ng-model="chartType"><option>line</option><option>bar</option><option>horizontal-bar</option><option>pie</option></select></div></div> <div class="item item-text-wrap" style="text-align: center; vertical-align: middle"><canvas style="{{canvasstyle}}" sheight="canvasheight" id="line"  class="" chart-data="datasource.chart.data" chart-labels="datasource.chart.labels" chart-legend="true" chart-series="datasource.chart.series" chart-options="datasource.chart.options"></canvas></div></div>',
      template: '<div sstyle="height: {{canvasheight}}" ><canvas sstyle="{{canvasstyle}}" sheight="canvasheight" id="line"  class="" chart-data="datasource.chart.data" chart-labels="datasource.chart.labels" chart-legend="true" chart-series="datasource.chart.series" chart-options="datasource.chart.options"></canvas></div>',

      scope: {
        datasource: "=",
        eventtype: "@evtype",
        fields: "=",
        charttype: "@charttype"
      },
      /*
            link: function (scope, element, attributes) {
              console.log("LINK",scope.classe);
              var chtype = scope.datasource.chart.type;
              var cl = "chart chart-" + chtype;
              element.find("canvas").attr("class", cl);
              scope.datasource.chart.options={
                legend: {
                  display: true
                }
              }
              $compile(element.contents())(scope);
            },*/
      compile: function (element, attributes) {

        return {
          pre: function (scope, element, attributes, controller, transcludeFn) {

            //console.log("COMPILEPRE", scope.classe, scope.canvasheight);

            var cl = "chart chart-" + scope.classe;
            element.find("canvas").attr("class", cl);
            element.find("canvas").attr("height", scope.canvasheight);
            //element.find("canvas").prepend("<h1>esticazzi</h1>");





          },
          post: function (scope, element, attributes, controller, transcludeFn) {
            //console.log("COMPILEPOST", element.html());

            var contents = element.contents();


            $compile(element.contents())(scope);
            //$compile(contents)(scope);


          }
        }
      },
      controller: function ($scope, $element, $compile) {
        console.log("CONTROLLER", $scope.datasource);

        console.log("chart eventtype", $scope.eventtype);
        var evtype = "";
        if ($scope.eventtype) evtype = $scope.eventtype;

        if (!$scope.datasource.evtype) $scope.datasource.evtype = evtype;


        if (!$scope.datasource.chart) {
          $scope.datasource.chart = {
            type: "line",
            hasCard: false
          }
        }

        $scope.classe = $scope.datasource.chart.type;
        $scope.hasCard = $scope.datasource.chart.hasCard;
        $scope.chartType = $scope.classe;
        $scope.canvasheight = "150";

        $scope.getTemplate = function () {
          return "<b>prova</b>"

        }

        $scope.changeChartType = function () {
          //console.log($scope.chartType)
          var cl = "chart chart-" + $scope.chartType;
          $element.find("canvas").removeAttr("class");
          $element.find("canvas").attr("class", cl);
          $compile($element.contents())($scope);
          return;

        }




      }
    }


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
      var charts = iotchart.charts;
      //console.log("mapIot service event", args);
      //check if there is a defined evtype equal to the buffered ones
      var foundiot = false;
      var iotindex = -1;
      charts.forEach(function (iotitem, iotidx) {
        if (iotitem.evtype.toLowerCase() == args.evtype.toLowerCase()) {
          foundiot = true;
          iotindex = iotidx;

        }

      })
      if (!foundiot) {
        console.log("no iotcharts with evtype " + args.evtype + " found, exiting");
        return;
      }
      var chart = iotchart.charts[iotindex];

      if (!chart.chart) {
        chart.chart = {
          title: chart.evtype,
          type: "line",
          options: {
            responsive: true,
            legend: {
              display: true
            }
          }
        }
      }

      //check and create series for chart
      if (!chart.chart.series) chart.chart.series = [];
      //check and create labels for chart
      if (!chart.chart.labels) chart.chart.labels = [];
      //check and create data for chart
      if (!chart.chart.data) chart.chart.data = [];
      //check and create steps for chart
      if (!chart.steps) chart.steps = 10;
      if (chart.chart.labels.length > 0) chart.steps = chart.chart.labels.length;
      //check and create fields for chart
      if (!chart.fields) chart.fields = [];

      var treatAsArray = false;
      var treatAsArrayLength = 1;

      if (chart.fields.length == 0) {
        var ev0 = args.events[0];
        for (var k in ev0) {
          chart.fields.push(k);
          if (angular.isArray(ev0[k])) {
            treatAsArray = true;
            treatAsArrayLength = ev0[k].length;
          }

        }
        console.log("no fields defined for chart " + chart.id + ", added fields " + chart.fields.join(",") + " basing on events received");
      }









      //create labels for chart
      if (chart.chart.labels.length == 0) {
        for (var i = 0; i < chart.steps; i++) {
          chart.chart.labels.push(parseInt(i, 10) + 1);
        }

      }

      if (treatAsArray) {
        chart.chart.labels = [];
        //chart.steps = chart.steps * treatAsArrayLength;
        chart.steps = 2 * treatAsArrayLength;

        for (var i = 0; i < chart.steps; i++) {
          var txt=parseInt(i, 10) + 1;
          if (chart.steps>30) txt=".";
          if ((i%10)==0) txt=parseInt(i, 10);
          chart.chart.labels.push(txt);
        }




      }



      args.events.forEach(function (evitem, evidx) {
        chart.fields.forEach(function (fitem, fidx) {
          //console.log("evitem["+fitem+"]="+evitem[fitem]);
          if (evitem.hasOwnProperty(fitem)) {
            //console.log("field " + fitem + " found in chart " + chart.id, evitem);

            var isarray = angular.isArray(evitem[fitem]);
            if (isarray) {
              console.log("field " + fitem + " in event is an array, length", evitem[fitem].length);
              //var eventvalue = String(evitem[fitem]).replace(",", ".");
              var eventvalue = evitem[fitem];
              fillAsArray(chart, eventvalue, fitem, fidx);

            } else {
              var eventvalue = String(evitem[fitem]).replace(",", ".");
              fillAsValue(chart, eventvalue, fitem, fidx);


            }


            // console.log("chartseries",chart.chart.series,chart.chart.data);

            //console.log("scope.chart.data[" + fidx + "]", chart.chart.data[fidx]);


          } else {
            console.log("no fields " + fitem + " found in iotchart with id " + chart.id);


          }


        })


        $scope.$digest();

      });

    }


    var fillAsValue = function (chart, eventvalue, fitem, fidx) {

      //var eventvalue = String(evitem[fitem]).replace(",", ".");
      //console.log("eventvalue", eventvalue);

      //initialize data to 0 if no data found
      if (!chart.chart.data[fidx]) chart.chart.data.push([]);
      if (chart.chart.data[fidx].length == 0) {


        for (var i = 0; i < chart.steps; i++) {
          chart.chart.data[fidx].push(0);
        }


      }


      if (chart.chart.data[fidx].length == chart.steps) chart.chart.data[fidx].shift();
      chart.chart.data[fidx].push(parseFloat(eventvalue));

      if (chart.chart.series.indexOf(fitem) == -1) chart.chart.series.push(fitem);


    }

    var fillAsArray = function (chart, eventvalue, fitem, fidx) {

      //var eventvalue = String(evitem[fitem]).replace(",", ".");
      //console.log("eventvalue", eventvalue);

      //initialize data to 0 if no data found

      /*
      chart.steps = chart.steps * eventvalue.length;
      console.log("chart.steps", chart.steps);



      for (var i = 0; i < chart.steps; i++) {
        chart.chart.labels.push(parseInt(i, 10) + 1);
      }


      */

      eventvalue.forEach(function (item, idx) {

        if (!chart.chart.data[fidx]) chart.chart.data.push([]);
        if (chart.chart.data[fidx].length == 0) {


          for (var i = 0; i < chart.steps; i++) {
            chart.chart.data[fidx].push(0);
          }


        }


        if (chart.chart.data[fidx].length == chart.steps) chart.chart.data[fidx].shift();
        chart.chart.data[fidx].push(parseFloat(eventvalue));

        if (chart.chart.series.indexOf(fitem) == -1) chart.chart.series.push(fitem);



      })



    }

    iotchart.mapIotOld = function (args, $scope) {

      iotchart.charts.forEach(function (item, idx) {
        item.charttype = "chart chart-" + item.chart.type;
        console.log("item.evtype", item.evtype, "args.evtype", args.evtype)

        if (item.evtype.toLowerCase() == args.evtype.toLowerCase()) {
          console.log("iotbuffer " + args.evtype + " in iotchart service", args);
          if (item.chart.labels.length == 0) {

            for (var i = 0; i < item.steps; i++) {
              item.chart.labels.push(parseInt(i, 10) + 1);
            }

          }
          var fields = item.fields;
          fields.forEach(function (fitem, fidx) {

            if (!item.chart.data[fidx]) {


              var arr = [];
              for (var i = 0; i < item.steps; i++) {

                arr.push[i];

              }

              item.chart.data.push(arr);


            }





            args.events.forEach(function (evitem, evidx) {
              var eventvalue = evitem[fitem].replace(",", ".");
              console.log("eventvalue", eventvalue);
              if (item.chart.data[fidx].length == item.steps) item.chart.data[fidx].shift();
              item.chart.data[fidx].push(parseFloat(eventvalue));



              console.log("scope.chart.data[" + fidx + "]", item.chart.data[fidx]);

              $scope.$digest();

            });











          })

        }
      })

      $scope.$digest();

    }










    return iotchart;




  })

  .controller('GraficiCtrl', function ($scope, socket /*, $ionicSideMenuDelegate*/ , $compile, iotchart) {

    function chunk(arr, size) {
  var newArr = [];
  for (var i=0; i<arr.length; i+=size) {
    newArr.push(arr.slice(i, i+size));
  }
  console.log("newArr")
  return newArr;

}

function tileArr(arr,size){
  var newrow={
      cols: []
    }
  
  var rows=[newrow];
  var row=0;
  var col=-1;
  arr.forEach(function(item,idx){
    rows[row].cols.push(item);
    console.log("idx",idx);
    
    if (((idx+1)%size)==0){
      console.log("splitting")
      col=-1;
      row++;  
      rows.push(newrow);
      
      
    }
   
    
  })
   console.log("rows",rows);
   return rows;

}



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

      iotchart.mapIot(args, $scope);

    });

    $scope.init = function () {
      $scope.charts = iotchart.charts;
      $scope.chartrows = tileArr($scope.charts,2);//chunk($scope.charts, 3);

    }


  })


  .factory("globals", function ( /*$ionicLoading*/ ) {
    var globalsService = {
      timeframe: "year",
      timeframedate: datatobeused
    };

    globalsService.rooturl = rooturl;
    globalsService.user = {
      email: 'b2bitalia@it.ibm.com'
    };
    globalsService.linktoMaximo = linktoMaximo

    //globalsService.rooturl = "http://localhost:3000";
    //globalsService.rooturl = "http://iotindustry40.mybluemix.net";
    //globalsService.rooturl = "http://9.71.213.181:3000";





    return globalsService;

  })
  /*
    .factory('WatsonIoT', function () {
      return IBMIoTF.IotfApplication;
    })
    */

  .factory("backend", function ($http) {
    var backend = {};

    backend.get = function (path, callback) {
      $http.get(path)
        .success(function (data) {
          //console.log("SUCCESS got " + path + "!", data);
          if (callback) callback(data);
        })
        .error(function (data) {
          console.log("ERROR in getting path", path);
          if (callback) callback(data);
        });
    }


    backend.post = function (url, data, callback) {
      $http.post(url, data)
        .success(function (data) {
          //console.log("SUCCESS got " + path + "!", data);
          if (callback) callback(data);
        })
        .error(function (data) {
          console.log("ERROR in getting path", path);
          if (callback) callback(data);
        });

    }


    return backend;

  })

  .factory("dbs", function ($http) {
    var dbs = {};

    dbs.get = function (dbname, callback) {
      $http.get("/device/" + dbname, {
          params: {
            "key1": "value1",
            "key2": "value2"
          }
        })
        .success(function (data) {
          console.log("SUCCESS DB " + dbname + "!", data);
          if (callback) callback(data);
        })
        .error(function (data) {
          console.log("ERROR in getting db", dbname);
          if (callback) callback(data);
        });
    }





    return dbs;

  })

  /*
    .factory("iot", function (WatsonIoT, $rootScope) {
      var iot = {};


      var WIoT = WatsonIoT;
      var apikey = "a-qc7qlc-7x4vfeo0i6";
      var apitoken = "VIDMNZUlj6mzm(QyQ6";

      iot.APIKey = apikey;
      iot.AuthToken = apitoken;
      iot.OrgId = "qc7qlc"
      iot.EventLog = ""
      iot.connectionstatus = "disconnected";
      var appClient = null;

      iot.connect = function (callback) {
        return;


        iot.connectionstatus = "connecting....";
        console.log("connecting to iot");
        iot.EventLog = ""
        appClient = new WIoT({
          "org": iot.OrgId,
          "id": Date.now() + "",
          "domain": "©",
          "auth-key": iot.APIKey,
          "auth-token": iot.AuthToken
        })
        appClient.connect();
        appClient.on("error", function (err) {
          console.log(err)
        });
        appClient.on("connect", function () {


          console.log("iot onconnect");
          iot.connectionstatus = "CONNECTED";
          //$scope.$digest();
          appClient.subscribeToDeviceEvents();
          //$state.go("app.chart");
          $rootScope.$broadcast("iotConnected");
          if (callback) callback();
        });
        window.onbeforeunload = function () {
          appClient.disconnect();
          // handle the exit event
        };
        appClient.on("deviceEvent", function (deviceType, deviceId, eventType, format, payload) {
          iot.EventLog = ("Device Event from :: " + deviceType + " : " + deviceId + " of event " + eventType + " with payload : " + payload) + '\n' + iot.EventLog;
          var pl = JSON.parse(payload);
          var event = {
            deviceType: deviceType,
            deviceId: deviceId,
            eventType: eventType,
            format: format,
            payload: pl
          }
          $rootScope.$broadcast("iotDeviceEvent", event);
          //console.log("Device Event from :: "+deviceType+" : "+deviceId+" of event "+eventType+" with payload "+payload);
          //$scope.$digest();

          //console.log(pl);
        });
      }



      return iot;
    })

  */
  .factory("socket", function (globals, $rootScope) {
    var socketService = {
      socket: {}
    };

    socketService.socket = io.connect(globals.rooturl);






    socketService.socket.on('getclientspecs', function (msg) {
      colog("socket getclientspecs from the server", msg);
      //$rootScope.$broadcast("refreshChatUsers","");
    });

    socketService.socket.on('iot_deviceevent', function (msg) {
      colog("iot events received from socket server", msg);
      $rootScope.$broadcast("iotbuffer", msg);
    });

    socketService.socket.on('dashdata', function (msg) {
      //console.log("iot events received from socket server", msg);
      $rootScope.$broadcast("dashdata", msg);
    });





    return socketService;
  })


  .factory("ChartService", function () {
    var chartService = {};

    chartService.defaultoptions = {
      responsive: true,
      legend: {
        display: true,
        position: "bottom",
        fullWidth: true,
        labels: {
          fontSize: 10,
          usePointStyle: true
        }
      },
      showAllTooltips: false,
      tooltipTemplate: "<%= value %>",
      tooltips: {
        backgroundColor: "rgba(0,0,0,1)",
        displayColors: true,
        bodyFontColor: "rgba(255,255,255,0.8)",
        mode: 'label',
        intersect: false,
        pointHitDetectionRadius: "1",
        position: "average"

      },
      scaleShowLabels: true,
      showScale: true

    }



    Chart.pluginService.register({
      beforeRender: function (chart) {
        if (chart.config.options.showAllTooltips) {
          // create an array of tooltips
          // we can't use the chart tooltip because there is only one tooltip per chart
          chart.pluginTooltips = [];
          chart.config.data.datasets.forEach(function (dataset, i) {
            chart.getDatasetMeta(i).data.forEach(function (sector, j) {
              chart.pluginTooltips.push(new Chart.Tooltip({
                _chart: chart.chart,
                _chartInstance: chart,
                _data: chart.data,
                _options: chart.options.tooltips,
                _active: [sector]
              }, chart));
            });
          });

          // turn off normal tooltips
          chart.options.tooltips.enabled = false;
        }
      },
      afterUpdate: function (chart) {
        if (chart.config.options.elements.center) {
          var helpers = Chart.helpers;
          var centerConfig = chart.config.options.elements.center;
          var globalConfig = Chart.defaults.global;
          var ctx = chart.chart.ctx;

          var fontStyle = helpers.getValueOrDefault(centerConfig.fontStyle, globalConfig.defaultFontStyle);
          var fontFamily = helpers.getValueOrDefault(centerConfig.fontFamily, globalConfig.defaultFontFamily);

          if (centerConfig.fontSize)
            var fontSize = centerConfig.fontSize;
          // figure out the best font size, if one is not specified
          else {
            ctx.save();
            var fontSize = helpers.getValueOrDefault(centerConfig.minFontSize, 1);
            var maxFontSize = helpers.getValueOrDefault(centerConfig.maxFontSize, 256);
            var maxText = helpers.getValueOrDefault(centerConfig.maxText, centerConfig.text);

            do {
              ctx.font = helpers.fontString(fontSize, fontStyle, fontFamily);
              var textWidth = ctx.measureText(maxText).width;

              // check if it fits, is within configured limits and that we are not simply toggling back and forth
              if (textWidth < chart.innerRadius * 2 && fontSize < maxFontSize)
                fontSize += 1;
              else {
                // reverse last step
                fontSize -= 1;
                break;
              }
            } while (true)
            ctx.restore();
          }

          // save properties
          chart.center = {
            font: helpers.fontString(fontSize, fontStyle, fontFamily),
            fillStyle: helpers.getValueOrDefault(centerConfig.fontColor, globalConfig.defaultFontColor)
          };
        }
      },
      afterDraw: function (chart, easing) {
        if (chart.config.options.showAllTooltips) {
          // we don't want the permanent tooltips to animate, so don't do anything till the animation runs atleast once
          if (!chart.allTooltipsOnce) {
            if (easing !== 1)
              return;
            chart.allTooltipsOnce = true;
          }

          // turn on tooltips
          chart.options.tooltips.enabled = true;
          Chart.helpers.each(chart.pluginTooltips, function (tooltip) {
            //console.log("tooltip",tooltip);
            tooltip.initialize();
            tooltip.update();
            // we don't actually need this since we are not animating tooltips
            tooltip.pivot();
            tooltip.transition(easing).draw();
          });
          chart.options.tooltips.enabled = false;
        }
        if (chart.center) {
          var centerConfig = chart.config.options.elements.center;
          var ctx = chart.chart.ctx;

          ctx.save();
          ctx.font = chart.center.font;
          ctx.fillStyle = chart.center.fillStyle;
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          var centerX = (chart.chartArea.left + chart.chartArea.right) / 2;
          var centerY = (chart.chartArea.top + chart.chartArea.bottom) / 2;
          ctx.fillText(centerConfig.text, centerX, centerY);
          ctx.restore();
        }



      }
    })

    chartService.chartSquareOptions = {
      // Boolean - Whether to animate the chart
      animation: true,
      // Number - Number of animation steps
      animationSteps: 20,
      // String - Animation easing effect
      animationEasing: "easeOutQuart",
      // Boolean - If we should show the scale at all
      showScale: true,
      // Boolean - If we want to override with a hard coded scale
      scaleOverride: false,
      // ** Required if scaleOverride is true **
      // Number - The number of steps in a hard coded scale
      scaleSteps: null,
      // Number - The value jump in the hard coded scale
      scaleStepWidth: null,
      // Number - The scale starting value
      scaleStartValue: null,
      // String - Colour of the scale line
      scaleLineColor: "rgba(0,0,0,.1)",
      // Number - Pixel width of the scale line
      scaleLineWidth: 1,
      // Boolean - Whether to show labels on the scale
      scaleShowLabels: false,
      // Interpolated JS string - can access value
      scaleLabel: "<%=value%>",
      sscaleLabel: "",
      // Boolean - Whether the scale should stick to integers, not floats even if drawing space is there
      scaleIntegersOnly: true,
      // Boolean - Whether the scale should start at zero, or an order of magnitude down from the lowest value
      scaleBeginAtZero: false,
      // String - Scale label font declaration for the scale label
      scaleFontFamily: "'Helvetica Neue', 'Helvetica', 'Arial', sans-serif",
      // Number - Scale label font size in pixels
      scaleFontSize: 10,
      // String - Scale label font weight style
      scaleFontStyle: "normal",
      // String - Scale label font colour
      scaleFontColor: "#666",
      // Boolean - whether or not the chart should be responsive and resize when the browser does.
      responsive: true,
      maintainAspectRatio: true,
      // Boolean - Determines whether to draw tooltips on the canvas or not
      showTooltips: true,
      // Array - Array of string names to attach tooltip events
      tooltipEvents: ["mousemove", "touchstart", "touchmove"],
      // String - Tooltip background colour
      tooltipFillColor: "rgba(0,0,0,0.8)",

      // String - Tooltip label font declaration for the scale label
      tooltipFontFamily: "'Helvetica Neue', 'Helvetica', 'Arial', sans-serif",

      // Number - Tooltip label font size in pixels
      tooltipFontSize: 14,
      // String - Tooltip font weight style
      tooltipFontStyle: "normal",
      // String - Tooltip label font colour
      tooltipFontColor: "#fff",
      // String - Tooltip title font declaration for the scale label
      tooltipTitleFontFamily: "'Helvetica Neue', 'Helvetica', 'Arial', sans-serif",
      // Number - Tooltip title font size in pixels
      tooltipTitleFontSize: 14,
      // String - Tooltip title font weight style
      tooltipTitleFontStyle: "bold",
      // String - Tooltip title font colour
      tooltipTitleFontColor: "#fff",
      // Number - pixel width of padding around tooltip text
      tooltipYPadding: 6,
      // Number - pixel width of padding around tooltip text
      tooltipXPadding: 6,
      // Number - Size of the caret on the tooltip
      tooltipCaretSize: 8,
      // Number - Pixel radius of the tooltip border
      tooltipCornerRadius: 6,
      // Number - Pixel offset from point x to tooltip edge
      tooltipXOffset: 10,
      // String - Template string for single tooltips
      tooltipTemplate: "<%if (label){%><%=label%>: <%}%><%= value %>",
      // String - Template string for single tooltips
      multiTooltipTemplate: "<%= value %>",
      // Function - Will fire on animation progression.
      showAllTooltips: true,
      onAnimationProgress: function () {},
      // Function - Will fire on animation completion.
      onAnimationComplete: function () {}
    };

    chartService.chartRoundOptions = {
      // Boolean - Whether to animate the chart
      animation: true,
      // Number - Number of animation steps
      animationSteps: 20,
      // String - Animation easing effect
      animationEasing: "easeOutQuart",
      // Boolean - If we should show the scale at all
      showScale: true,
      // Boolean - If we want to override with a hard coded scale
      scaleOverride: false,
      // ** Required if scaleOverride is true **
      // Number - The number of steps in a hard coded scale
      scaleSteps: null,
      // Number - The value jump in the hard coded scale
      scaleStepWidth: null,
      // Number - The scale starting value
      scaleStartValue: null,
      // String - Colour of the scale line
      scaleLineColor: "rgba(0,0,0,.1)",
      // Number - Pixel width of the scale line
      scaleLineWidth: 1,
      // Boolean - Whether to show labels on the scale
      scaleShowLabels: false,
      // Interpolated JS string - can access value
      scaleLabel: "<%=value%>",
      sscaleLabel: "",
      // Boolean - Whether the scale should stick to integers, not floats even if drawing space is there
      scaleIntegersOnly: true,
      // Boolean - Whether the scale should start at zero, or an order of magnitude down from the lowest value
      scaleBeginAtZero: false,
      // String - Scale label font declaration for the scale label
      scaleFontFamily: "'Helvetica Neue', 'Helvetica', 'Arial', sans-serif",
      // Number - Scale label font size in pixels
      scaleFontSize: 10,
      // String - Scale label font weight style
      scaleFontStyle: "normal",
      // String - Scale label font colour
      scaleFontColor: "#666",
      // Boolean - whether or not the chart should be responsive and resize when the browser does.
      responsive: true,
      maintainAspectRatio: true,
      // Boolean - Determines whether to draw tooltips on the canvas or not
      showTooltips: true,
      // Array - Array of string names to attach tooltip events
      tooltipEvents: ["mousemove", "touchstart", "touchmove"],
      // String - Tooltip background colour
      tooltipFillColor: "rgba(0,0,0,0.8)",

      // String - Tooltip label font declaration for the scale label
      tooltipFontFamily: "'Helvetica Neue', 'Helvetica', 'Arial', sans-serif",

      // Number - Tooltip label font size in pixels
      tooltipFontSize: 14,
      // String - Tooltip font weight style
      tooltipFontStyle: "normal",
      // String - Tooltip label font colour
      tooltipFontColor: "#fff",
      // String - Tooltip title font declaration for the scale label
      tooltipTitleFontFamily: "'Helvetica Neue', 'Helvetica', 'Arial', sans-serif",
      // Number - Tooltip title font size in pixels
      tooltipTitleFontSize: 14,
      // String - Tooltip title font weight style
      tooltipTitleFontStyle: "bold",
      // String - Tooltip title font colour
      tooltipTitleFontColor: "#fff",
      // Number - pixel width of padding around tooltip text
      tooltipYPadding: 6,
      // Number - pixel width of padding around tooltip text
      tooltipXPadding: 6,
      // Number - Size of the caret on the tooltip
      tooltipCaretSize: 8,
      // Number - Pixel radius of the tooltip border
      tooltipCornerRadius: 6,
      // Number - Pixel offset from point x to tooltip edge
      tooltipXOffset: 10,
      // String - Template string for single tooltips
      tooltipTemplate: "<%if (label){%><%=label%>: <%}%><%= value %>",
      // String - Template string for single tooltips
      multiTooltipTemplate: "<%= value %>",
      // Function - Will fire on animation progression.
      showAllTooltips: true,
      onAnimationProgress: function () {},
      // Function - Will fire on animation completion.
      onAnimationComplete: function () {}
    };

    chartService.pie = function (params) {
      if (!params) {
        params = {
          labels: ["Download Sales", "In-Store Sales", "Mail-Order Sales"],
          data: [300, 500, 100],
          options: chartService.chartRoundOptions
        }
      }
      return params;
    }

    chartService.radar = function (params) {
      if (!params) {
        params = {
          labels: ["Download Sales", "In-Store Sales", "Mail-Order Sales"],
          data: [300, 500, 100],
          options: chartService.chartRoundOptions
        }
      }
      return params;
    }

    chartService.bubble = function (params) {
      if (!params) {
        params = {
          labels: ["Download Sales", "In-Store Sales", "Mail-Order Sales"],
          data: [{
            x: 300,
            y: 500,
            z: 100
          }],
          options: chartService.chartRoundOptions
        }
      }
      return params;
    }

    chartService.doughnot = function (params) {
      if (!params) {
        params = {
          labels: ["Download Sales", "In-Store Sales", "Mail-Order Sales"],
          data: [30, 50, 20]
        }
      }
      return params;
    }


    chartService.line = function (params) {
      if (!params) {
        params = {
          labels: ["January", "February", "March", "April", "May", "June", "July"],
          series: ['Average Spent Effort', 'Average Estimated Effort', 'Average Remainning Effort'],
          sdata: [
            [65, 59, 80, 81, 56, 55, 40],
            [28, 48, 40, 19, 86, 27, 90],
            [18, 38, 40, 49, 81, 43, 77]
          ],
          data: [
            [],
            [],
            []
          ],
          options: chartService.chartSquareOptions
        }

      }
      return params;


    }


    chartService.bars = function (params) {
      if (!params) {
        params = {
          labels: ['2006', '2007', '2008', '2009', '2010', '2011', '2012'],
          series: ['Packer', 'Maker'],
          data: [
            [65, 59, 80, 81, 56, 55, 40],
            [28, 48, 40, 19, 86, 27, 90]
          ],
          options: chartService.chartSquareOptions

        }
      }

      return params;
    }


    return chartService;

  })



  .config(function ($stateProvider, $urlRouterProvider) {

    $stateProvider
      .state('home', {
        url: '/home',
        templateUrl: 'templates/home.html',
        controller: "HomeCtrl"
      })

      .state('login', {
        url: '/login',
        templateUrl: 'templates/login.html',
        controller: "LoginCtrl"
      })

      // ABOUT PAGE AND MULTIPLE NAMED VIEWS =================================
      .state('dash', {
        url: '/dash',
        templateUrl: 'templates/dashboard.html',
        controller: "DashCtrl"
      })
      .state('grafici', {
        url: '/grafici',
        templateUrl: 'templates/grafici.html',
        controller: "GraficiCtrl"
      });

    $urlRouterProvider.otherwise('/login');


  })

  .controller('AppCtrl', function ($scope, socket, $timeout, $mdSidenav, $log /*, $ionicSideMenuDelegate*/ ) {
    $scope.attendees = [{
        firstname: 'Nicolas',
        lastname: 'Cage'
      },
      {
        firstname: 'Jean-Claude',
        lastname: 'Van Damme'
      },
      {
        firstname: 'Keanu',
        lastname: 'Reeves'
      },
      {
        firstname: 'Steven',
        lastname: 'Seagal'
      }
    ];
    $scope.toggleLeft = buildDelayedToggler('left');
    $scope.toggleRight = buildToggler('right');
    $scope.isOpenRight = function () {
      return $mdSidenav('right').isOpen();
    };
    $scope.isOpenLeft = function () {
      return $mdSidenav('left').isOpen();
    };

    /**
     * Supplies a function that will continue to operate until the
     * time is up.
     */
    function debounce(func, wait, context) {
      var timer;

      return function debounced() {
        var context = $scope,
          args = Array.prototype.slice.call(arguments);
        $timeout.cancel(timer);
        timer = $timeout(function () {
          timer = undefined;
          func.apply(context, args);
        }, wait || 10);
      };
    }

    /**
     * Build handler to open/close a SideNav; when animation finishes
     * report completion in console
     */
    function buildDelayedToggler(navID) {
      return debounce(function () {
        // Component lookup should always be available since we are not using `ng-if`
        $mdSidenav(navID)
          .toggle()
          .then(function () {
            $log.debug("toggle " + navID + " is done");
          });
      }, 200);
    }

    function buildToggler(navID) {
      return function () {
        // Component lookup should always be available since we are not using `ng-if`
        $mdSidenav(navID)
          .toggle()
          .then(function () {
            $log.debug("toggle " + navID + " is done");
          });
      };
    }
  })

  .controller('MainCtrl', function ($scope /*, $ionicSideMenuDelegate*/ ) {
    $scope.attendees = [{
        firstname: 'Nicolas',
        lastname: 'Cage'
      },
      {
        firstname: 'Jean-Claude',
        lastname: 'Van Damme'
      },
      {
        firstname: 'Keanu',
        lastname: 'Reeves'
      },
      {
        firstname: 'Steven',
        lastname: 'Seagal'
      }
    ];

    $scope.toggleLeft = function () {
      /*$ionicSideMenuDelegate.toggleLeft();*/
    };
  })

  .controller('CheckinCtrl', function ($scope) {
    $scope.showForm = true;

    $scope.shirtSizes = [{
        text: 'Large',
        value: 'L'
      },
      {
        text: 'Medium',
        value: 'M'
      },
      {
        text: 'Small',
        value: 'S'
      }
    ];

    $scope.attendee = {};
    $scope.submit = function () {
      if (!$scope.attendee.firstname) {
        alert('Info required');
        return;
      }
      $scope.showForm = false;
      $scope.attendees.push($scope.attendee);
    };

  })

  .controller('AttendeesCtrl', function ($scope) {

    $scope.activity = [];
    $scope.arrivedChange = function (attendee) {
      var msg = attendee.firstname + ' ' + attendee.lastname;
      msg += (!attendee.arrived ? ' has arrived, ' : ' just left, ');
      msg += new Date().getMilliseconds();
      $scope.activity.push(msg);
      if ($scope.activity.length > 3) {
        $scope.activity.splice(0, 1);
      }
    };

  })
  .controller('sHomeCtrl', function ($scope, $state) {
    /*
        var WIoT = WatsonIoT;
        var apikey = "a-qc7qlc-7x4vfeo0i6";
        var apitoken = "VIDMNZUlj6mzm(QyQ6";

        $scope.main = {}
        $scope.main.APIKey = apikey;
        $scope.main.AuthToken = apitoken;
        $scope.main.OrgId = "qc7qlc"
        $scope.main.EventLog = ""
        $scope.main.connectionstatus = "disconnected";
        var appClient = null;

        $scope.main.connect = function () {


          $scope.main.connectionstatus = "connecting....";
          console.log("connecting to iot");
          $scope.main.EventLog = ""
          appClient = new WIoT({
            "org": $scope.main.OrgId,
            "id": Date.now() + "",
            "domain": "internetofthings.ibmcloud.com",
            "auth-key": $scope.main.APIKey,
            "auth-token": $scope.main.AuthToken
          })
          appClient.connect();
          appClient.on("connect", function () {


            console.log("iot onconnect");
            $scope.main.connectionstatus = "CONNECTED";
            $scope.$digest();
            appClient.subscribeToDeviceEvents();
            $state.go("app.dash");
          });
          window.onbeforeunload = function () {
            appClient.disconnect();
            // handle the exit event
          };
          appClient.on("deviceEvent", function (deviceType, deviceId, eventType, format, payload) {
            $scope.main.EventLog = ("Device Event from :: " + deviceType + " : " + deviceId + " of event " + eventType + " with payload : " + payload) + '\n' + $scope.main.EventLog;

            //console.log("Device Event from :: "+deviceType+" : "+deviceId+" of event "+eventType+" with payload "+payload);
            $scope.$digest();
            var pl = JSON.parse(payload);
            console.log(pl);
          });
        }
    */

  })

  .controller('HomeCtrl', function ($scope, $state, login, secured, globals) {


    $scope.init = function () {

      console.log("INIT HOMEPAGE")
      secured.checkAuth()
      console.log("##############")
      console.log(globals.nome + " - " + globals.cognome)
      $scope.FullName = globals.nome + " " + globals.cognome;

      return;
      login.checklogin(function (data) {

        colog("checklogin,data");

        console.log("HomepageCTRL Init")
        console.log(data)

        console.log(data.loggedin)

        if (data.loggedin) {

          //	$scope.chat = Chats.get($stateParams.chatId);
          //alert($scope.username + " " + $scope.userrole)
          colog("homepage init done");
          console.log("##############")
          console.log(globals.nome + " " + globals.cognome)
          console.log($scope.username + " " + $scope.userrole)
          var user = globals.user;
          console.log(user)
          colog("user");
          colog(user);

          $timeout(function () {
            colog("globals.userrole", globals.user.userrole);
            if (globals.user.userrole == "ADMIN") $scope.admin = true;
            $scope.initAccountMenu();

          });
        }

      });


    }


  })


  .controller("SwitchPeriodCtrl", function ($timeout, $scope, dbs, ChartService, globals, backend /*, $ionicLoading*/ ) {

  })

  .controller('LeftCtrl', function ($scope, $timeout, $mdSidenav, $log) {
    $scope.close = function () {
      // Component lookup should always be available since we are not using `ng-if`
      $mdSidenav('left').close()
        .then(function () {
          $log.debug("close LEFT is done");
        });

    };
  })
  .controller('RightCtrl', function ($scope, $timeout, $mdSidenav, $log) {
    $scope.close = function () {
      // Component lookup should always be available since we are not using `ng-if`
      $mdSidenav('right').close()
        .then(function () {
          $log.debug("close RIGHT is done");
        });
    };
  })

  .controller('LoginCtrl', function ($state, $scope, $timeout, $mdSidenav, backend, $log, globals) {


    $scope.data = {
      username: "",
      password: ""
    }

    var checkcookiedexists = getCookie('iotpowerkit')
    if (checkcookiedexists) {
      $scope.userlogged = "Already Logged";
      $state.go("home")
    }
    console.log(checkcookiedexists)


    $scope.login = function () {



      console.log("LOGIN")
      var logindata = {
        email: $scope.data.username,
        password: $scope.data.password
      }
      var url = rooturl + "/login";
      backend.post(url, logindata, function (data) {
        $scope.userlogged = ""
        console.log("***************")
        console.log(data);
        console.log("***************")
        if (String(data.loggedin) == 'true') {
          var cook = {
            user: {
              email: data.email,
              nome: data.nome,
              cognome: data.cognome,
              maximoactivation: data.maximoactivation
            }
          }
          globals.user = cook.user
          setCookie('iotpowerkit', JSON.stringify(cook))
          $state.go("home")
        } else {
          $scope.userlogged = "This user is not authorized. Please check UserID and/or Passaword."
          $state.go("login")
        }

      })


    }

  })

  .controller("DashCtrl", function ($timeout, $scope, dbs, ChartService, globals, $http, backend /*, $ionicLoading*/ , $mdDialog, socket, secured) {

    $scope.FullName = globals.nome + " " + globals.cognome;
    $scope.maximoactivation = globals.maximoactivation;
    if (String($scope.maximoactivation) == 'true') {
      $scope.showmaximoactivation = true
    } else {
      $scope.showmaximoactivation = false
    }
    $scope.linktoMaximo = globals.linktoMaximo
    $scope.datadiriferimento = globals.timeframedate.substring(6)

    $scope.selectedLine = {
      name: "LU30"
    };
    $scope.LastWOMaximoCreated = ""
    $scope.CreationWOMaximo = false
    $scope.SearchWOPlanned = false
    $scope.SearchTaskWOPlanned = false
    $scope.SearchSpearPartsWOPlanned = false
    $scope.dashLoading = {
      operationshutdown: false,
      operationshutdownmachine: false,
      equipmenthealth: false,
      productionoutput: false,
      rejectcount: false,
      equipmentstops: false
    }



    $scope.numberWithCommas = function (x) {
      return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }

    $scope.intervall = {
      period1: false,
      period2: false,
      period3: true
    };
    $scope.messagetimeframe = "Year";

    $scope.MaximoActivation = function (cbState) {
      globals.linktoMaximo = cbState
      $scope.linktoMaximo = cbState

      console.log("MaximoActivation");
    }

    $scope.onChange = function (cbState, periodo) {
      console.log("onchange");
      if (periodo == "day") {
        $scope.datadiriferimento = globals.timeframedate;
        $scope.messagetimeframe = "Day"
        $scope.intervall = {
          period1: true,
          period2: false,
          period3: false
        }
      }
      if (periodo == "month") {
        $scope.datadiriferimento = globals.timeframedate.substring(3)
        $scope.messagetimeframe = "Month"
        $scope.intervall = {
          period1: false,
          period2: true,
          period3: false
        }
      }
      if (periodo == "year") {
        $scope.datadiriferimento = globals.timeframedate.substring(6)
        $scope.messagetimeframe = "Year"
        $scope.intervall = {
          period1: false,
          period2: false,
          period3: true
        }
      }
      globals.timeframe = $scope.messagetimeframe;

      //console.log(globals.timeframe);
      $scope.getUpperDash();
    }



    $scope.activedash = 0;

    $scope.manzo = {

      chart: {
        title: "titolo",
        type: "bar",
        data: [],
        labels: [],
        series: [],
      },
      evtype: "evento01",
      fields: ["cavallo", "rinoceronte", "fagiano"],
      steps: 7
    }

    $scope.inputvariablekeys = inputvariablekeys;

    var chartservice = ChartService;
    $scope.equipmentfailuremodel = [];

    $scope.showAddWOMaximo = function (ev, machine) {
      // Appending dialog to document.body to cover sidenav in docs app
      console.log("machine", machine);
      var confirm = $mdDialog.confirm()
        .title('Warning on ' + machine)
        .textContent('3° wheel pusher of machine ' + machine + ', line ' + productionlines[0].name + ', ' + plants[0].location + '  plant has reached a failure probability of 80% within 3 days. No maintenance activities planned. Do you want to create a new work order request ?')
        .ariaLabel('Lucky day')
        .targetEvent(ev)
        .ok('Yes')
        .cancel('No');

      $mdDialog.show(confirm).then(function () {
        $scope.CreationWOMaximo = true
        var NewWONumb = (Math.ceil(Math.random() * 9999)) + "_LU-PK"

        var urlmaximo = "http://172.17.196.115/maxrest/rest/os/MXWO?_lid=maxadmin&_lpwd=maxadmin&siteid=BEDFORD&wonum=" + NewWONumb + "&assetnum=GD-PK-10047&jpnum=GD-H1000-MON&targstartdate=2017-03-23T18:30:00-01:00&status=WSCH"

        if (!$scope.linktoMaximo) {
          $scope.CreationWOMaximo = false
          $scope.LastWOMaximoCreated = NewWONumb
          $mdDialog.show(
            $mdDialog.alert()
            .clickOutsideToClose(true)
            .title('Maximo WO Creation')
            .textContent('A new Virtual WO is created in Maximo. The WONumber is ' + NewWONumb)
            .ariaLabel('Alert Dialog')
            .ok('OK')
          )
          return;
        }
        $http.post(urlmaximo)
          .success(function (data) {
            console.log("receveid data", data);
            $timeout(function () {
              //$scope.contentCreateWO = data;
              console.log(data);
              $scope.CreationWOMaximo = false
              $scope.LastWOMaximoCreated = NewWONumb
              $mdDialog.show(
                $mdDialog.alert()
                .clickOutsideToClose(true)
                .title('Maximo WO Creation')
                .textContent('A new WO is created in Maximo. The WONumber is ' + NewWONumb)
                .ariaLabel('Alert Dialog')
                .ok('OK')
              )
            });
          })
          .error(function (data) {
            //$scope.contentCreateWO = "ERRORE";
            console.log("Error:", data);
            $scope.CreationWOMaximo = false
            $scope.LastWOMaximoCreated = ""
            $mdDialog.show(
              $mdDialog.alert()
              .clickOutsideToClose(true)
              .title('Maximo WO Creation')
              .textContent('Error. There is a problem. The new WO cannot be created')
              .ariaLabel('Alert Dialog')
              .ok('OK')
            )
          })
      }, function () {
        $scope.status = '....';
      });
    };



    //
    $scope.ShowMobileScreen = function (ev, wotopass, selecmac) {
      $mdDialog.show({
          controller: MobileScreenController,
          controllerAs: 'Mobile',
          templateUrl: 'templates/TecnicalScreen.html',
          parent: angular.element(document.body),
          targetEvent: ev,
          locals: {
            dataToPass: selecmac,
            wotopass: wotopass
          },
          clickOutsideToClose: true,

          fullscreen: $scope.customFullscreen // Only for -xs, -sm breakpoints.
        })
        .then(function (answer) {
          $scope.status = '...';
        }, function () {
          $scope.status = '...';
        });
    };

    $scope.ShowMobileScreen2 = function (ev, macchina) {
      /*  backend.get("/dashboard/stops/" + $scope.selectedMachine.name, function (data) {
          console.log("stops", data);
          $scope.stops = data;*/

      var fname = "stops" + macchina + ".html";
      //alert(fname);

      $scope.customFullscreen = false
      $mdDialog.show({
          targetEvent: ev,
          locals: {
            parent: $scope
          },
          controller: angular.noop,
          controllerAs: 'ctrl',
          bindToController: true,
          templateUrl: 'templates/' + fname,
          clickOutsideToClose: true,
          fullscreen: $scope.customFullscreen // Only for -xs, -sm breakpoints.
        })
        .then(function (answer) {
          $scope.status = '...';
        }, function () {
          $scope.status = '...';
        });
      // });
    };

    $scope.faultsShown = false;
    $scope.faults = [];
    $scope.faultsLoading = false;

    $scope.showStops = function (ev) {

      // disabilitare la funzione che visualizza i dettagli se Timefram<>"ANNO"
      if ($scope.messagetimeframe == "Year") {

      } else {
        // POPUP FUNZION DISABILITATA

        $mdDialog.show(
          $mdDialog.alert()
          .clickOutsideToClose(true)
          .title('Warning')
          .textContent('This function is only available for year timeframe')
          .ariaLabel('Alert Dialog')
          .ok('OK')
        )

        return;
      }


      $scope.faultsShown = !$scope.faultsShown;
      if ($scope.faultsShown) {
        $scope.faultsLoading = true;
        var url = globals.rooturl + "/dashboard/getfaults?line=" + productionlines[0].name + "&machine=" + $scope.selectedMachine.name;
        backend.get(url, function (data) {
          $timeout(function () {
            $scope.faultsLoading = false;
            $scope.faults = data;

          })
        })
      } else {

      }




      return;


      $scope.ShowMobileScreen2(ev, $scope.selectedMachine.name);
      return;




    };




    function DialogController($scope, $mdDialog) {
      $scope.hide = function () {
        $mdDialog.hide();
      };

      $scope.cancel = function () {
        $mdDialog.cancel();
      };

      $scope.answer = function (answer) {
        $mdDialog.hide(answer);
      };
      $scope.closeDialog = function () {
        console.log("closeDialog");
        $mdDialog.hide();
      }
    }


    $scope.getPreFaults = function (line, machine) {

      $scope.PrePostventLoading = true
      var url = globals.rooturl + "/dashboard/getprefaults?line=" + line + "&machine=" + machine;
      backend.get(url, function (data) {
        $timeout(function () {
          //console.log(data)
          data2 = data
          data = sortJSON(data2, 'Support', 'disc') // SORT JSON asc = ascendente   disc= Discendente
          $scope.prefaults = data;
          $scope.PrePostventLoading = false;
          //$scope.faultsLoading = false;
          //$scope.faults = data;
          $mdDialog.show({
              clickOutsideToClose: true,
              scope: $scope,
              preserveScope: true,
              templateUrl: 'templates/prefaults.html',
              controller: function DialogController($scope, $mdDialog) {
                this.parent = $scope;
                $scope.closeDialog = function () {
                  $mdDialog.hide();
                }
              }
            })

            /*
                      $mdDialog.show({
                          locals: {
                            parent: $scope
                          },
                  
                          controllerAs: 'ctrl',
                          controller: function () {
                            this.parent = $scope;
                          },
                          templateUrl: 'templates/prefaults.html',
                          parent: angular.element(document.body),

                          clickOutsideToClose: true
                  
                        })*/
            .then(function (answer) {
              $scope.status = '...';
            }, function () {
              $scope.status = '...';
            });

        })



      })



    }


    $scope.getPostFaults = function (line, machine) {

      $scope.PrePostventLoading = true
      var url = globals.rooturl + "/dashboard/getpostfaults?line=" + line + "&machine=" + machine;
      backend.get(url, function (data) {
        $timeout(function () {
          data2 = data
          data = sortJSON(data2, 'Support', 'disc') // SORT JSON asc = ascendente   disc= Discendente
          $scope.postfaults = data;
          $scope.PrePostventLoading = false;
          //$scope.faultsLoading = false;
          //$scope.faults = data;
          $mdDialog.show({
              clickOutsideToClose: true,
              scope: $scope,
              preserveScope: true,
              templateUrl: 'templates/postfaults.html',
              controller: function DialogController($scope, $mdDialog) {
                this.parent = $scope;
                $scope.closeDialog = function () {
                  $mdDialog.hide();
                }
              }
            })

            /*
                      $mdDialog.show({
                          locals: {
                            parent: $scope
                          },
                        
                          controllerAs: 'ctrl',
                          controller: function () {
                            this.parent = $scope;
                          },
                          templateUrl: 'templates/postfaults.html',
                          parent: angular.element(document.body),
                       
                          clickOutsideToClose: true
                      
                        })*/
            .then(function (answer) {
              $scope.status = '...';
            }, function () {
              $scope.status = '...';
            });

        })



      })



    }





    function MobileScreenController($scope, $mdDialog, backend, $timeout, $http, dataToPass, wotopass) {

      $scope.ShowMaximoLoad = false
      $scope.SearchWOPlanned = false
      $scope.SearchTaskWOPlanned = false
      $scope.SearchSpearPartsWOPlanned = false
      $scope.SearchWOClosed = false

      $scope.macchinaselezionata = dataToPass
      $scope.WOSelected = wotopass
      $scope.UltimoWO = wotopass


      $scope.takehistorylog = function () {
        $scope.maximoload = true

        $scope.SearchWOClosed = true

        if (!$scope.linktoMaximo) {
          $scope.woClosed = [{
              "WONUM": "1606_LU-PK",
              "DESCRIPTION": "LU30_13000_HRS_PK_REPORTED",
              "LOCATION": "LU30",
              "ASSETNUM": "GD-PK-10047"
            },
            {
              "WONUM": "1609_LU-PK",
              "DESCRIPTION": "LU30_13000_HRS_PK_REPORTED",
              "LOCATION": "LU30",
              "ASSETNUM": "GD-PK-10047"
            },
            {
              "WONUM": "1610_LU-PK",
              "DESCRIPTION": "LU30_13500_HRS_PK_REPORTED",
              "LOCATION": "LU30",
              "ASSETNUM": "GD-PK-10047"
            },
            {
              "WONUM": "1608_LU-PK",
              "DESCRIPTION": "LU30_12250_HRS_PK_REPORTED",
              "LOCATION": "LU30",
              "ASSETNUM": "GD-PK-10047"
            },
            {
              "WONUM": "168B_LU-PK",
              "DESCRIPTION": "LU30_12500_HRS_PK_REPORTED",
              "LOCATION": "LU30",
              "ASSETNUM": "GD-PK-10047"
            },
            {
              "WONUM": "1703_LU-PK",
              "DESCRIPTION": "LU30_14500_HRS_PK_REPORTED",
              "LOCATION": "LU30",
              "ASSETNUM": "GD-PK-10047"
            },
            {
              "WONUM": "173A_LU-PK",
              "DESCRIPTION": "LU30_14500_HRS_PK_REPORTED",
              "LOCATION": "LU30",
              "ASSETNUM": "GD-PK-10047"
            }
          ]
          $scope.maximoload = false
          $scope.SearchWOClosed = false
          return;
        }

        var url = "http://172.17.196.115/maxrest/rest/mbo/workorder?_lid=maxadmin&_lpwd=maxadmin&_compact=True&_format=json&_urs=False&wonum=LU-PK&assetnum=gd&status=close"
        $http.get(url)
          .then(function (response) {
            $scope.content = response.data;
            $scope.statuscode = response.status;
            $scope.statustext = response.statustext;

            $scope.woClosed = [];
            angular.forEach(response.data.WORKORDERMboSet, function (wotemp) {
              angular.forEach(wotemp, function (wotempor) {
                $scope.woClosed.push(wotempor)
              })
            })

            $scope.maximoload = false
            $scope.SearchWOClosed = false
            console.log($scope.woClosed)
          });

      }


      //	WOACTIVITY.DESCRIPTION  = NC0059.00
      //http://172.17.196.115/maxrest/rest/mbo/WPMATERIAL?_lid=maxadmin&_lpwd=maxadmin&_format=json

      //http://172.17.196.115/maxrest/rest/os/MXWOACTIVITY?_lid=maxadmin&_lpwd=maxadmin&WOGROUP=~eq~5297_LU-PK&_format=json

      //http://172.17.196.115/maxrest/rest/os/MXWODETAIL?_lid=maxadmin&_lpwd=maxadmin&wonum=5297_LU-PK&_format=json

      //http://172.17.196.115/maxrest/rest/os/MXWOHIER?_lid=maxadmin&_lpwd=maxadmin&wonum=5297_LU-PK&_format=json

      // http://172.17.196.115/maxrest/rest/os/MXWWOMATERIAL?_lid=maxadmin&_lpwd=maxadmin&WONUM=~eq~5297_LU-PK&_format=xml

      //http://172.17.196.115/maxrest/rest/os/MXWOACTIVITY?_lid=maxadmin&_lpwd=maxadmin&DESCRIPTION=NG0037&_format=json


      // WPMATERIAL.ITEMNUM : 2NGBMA1

      $scope.takeWOPlanned = function () {

        WONUMtoberetrive = wotopass
        $scope.WONotDefined = false
        $scope.WODefined = WONUMtoberetrive

        if (WONUMtoberetrive == "") {
          $scope.WONotDefined = true
          $scope.WODefined = ""
          return;
        }


        $scope.SearchWOPlanned = true

        if (!$scope.linktoMaximo) {
          $scope.woPlanned = [{
              "Attributes": {
                "TASKID": {
                  "content": 1
                },
                "DESCRIPTION": {
                  "content": "Cleaning"
                },
                "ESTDUR": {
                  "content": 1
                }
              }
            },
            {
              "Attributes": {
                "TASKID": {
                  "content": 10
                },
                "DESCRIPTION": {
                  "content": "NG0037.00 - Check of cigarette pusher"
                },
                "ESTDUR": {
                  "content": 3
                }
              }
            },
            {
              "Attributes": {
                "TASKID": {
                  "content": 20
                },
                "DESCRIPTION": {
                  "content": "NC0025.01 - Grease of first wheel equipments spherical joints"
                },
                "ESTDUR": {
                  "content": 6
                }
              }
            },
            {
              "Attributes": {
                "TASKID": {
                  "content": 30
                },
                "DESCRIPTION": {
                  "content": "NC0059.00 - Replace of Dynamic buffer contrast roller"
                },
                "ESTDUR": {
                  "content": 1
                }
              }
            },
            {
              "Attributes": {
                "TASKID": {
                  "content": 40
                },
                "DESCRIPTION": {
                  "content": "NC0012.00 - Replace of 2nd wheel kit pullouts"
                },
                "ESTDUR": {
                  "content": 4
                }
              }
            },
            {
              "Attributes": {
                "TASKID": {
                  "content": 1000
                },
                "DESCRIPTION": {
                  "content": "Run Up"
                },
                "ESTDUR": {
                  "content": 1
                }
              }
            }
          ]
          $scope.SearchWOPlanned = false
          return;
        }

        var url = "http://172.17.196.115/maxrest/rest/os/MXWOACTIVITY?_lid=maxadmin&_lpwd=maxadmin&WOGROUP=~eq~" + WONUMtoberetrive + "&_format=json"

        $http.get(url)
          .then(function (response) {
            $scope.content = response.data;
            $scope.statuscode = response.status;
            $scope.statustext = response.statustext;

            $scope.woPlanned = [];
            angular.forEach(response.data.QueryMXWOACTIVITYResponse.MXWOACTIVITYSet, function (wotemp) {
              angular.forEach(wotemp, function (wotempor) {
                $scope.woPlanned.push(wotempor)
              })
            })

            $scope.SearchWOPlanned = false
            console.log($scope.woPlanned)
          });

      }


      $scope.hide = function () {
        $mdDialog.hide();
      };

      $scope.cancel = function () {
        $mdDialog.cancel();
      };

      $scope.answer = function (answer) {
        $mdDialog.hide(answer);
      };
    }

    function StopsController($scope, $mdDialog, backend, $timeout, $http) {

      $scope.ShowMaximoLoad = false


      $scope.takehistorylog = function () {
        $scope.maximoload = true
        var url = "http://172.17.196.115/maxrest/rest/mbo/workorder?_lid=maxadmin&_lpwd=maxadmin&_compact=True&_format=json&_urs=False&wonum=LU&assetnum=gd&status=close"
        $http.get(url)
          .then(function (response) {
            $scope.content = response.data;
            $scope.statuscode = response.status;
            $scope.statustext = response.statustext;

            $scope.woClosed = [];
            angular.forEach(response.data.WORKORDERMboSet, function (wotemp) {
              angular.forEach(wotemp, function (wotempor) {
                $scope.woClosed.push(wotempor)
              })
            })

            $scope.maximoload = false
            console.log($scope.woClosed)
          });

      }

      $scope.hide = function () {
        $mdDialog.hide();
      };

      $scope.cancel = function () {
        $mdDialog.cancel();
      };

      $scope.answer = function (answer) {
        $mdDialog.hide(answer);
      };
    }


    $scope.showtimeframe = function (frame) {
      if (frame == 'Day') {
        $scope.messagetimeframe = frame + " DAY "
        $scope.timeframes = [{
            period: "Day",
            checked: true
          },
          {
            period: "Month",
            checked: false
          },
          {
            period: "Year",
            checked: false
          }
        ];
      }
      if (frame == 'Month') {
        $scope.messagetimeframe = frame + " MONTH "
        $scope.timeframes = [{
            period: "Day",
            checked: false
          },
          {
            period: "Month",
            checked: true
          },
          {
            period: "Year",
            checked: false
          }
        ];
      }
      if (frame == 'Year') {
        $scope.messagetimeframe = frame + " YEAR "
        $scope.timeframes = [{
            period: "Day",
            checked: false
          },
          {
            period: "Month",
            checked: false
          },
          {
            period: "Year",
            checked: true
          }
        ];
      }
    }


    $scope.showCustom = function (event) {
      $mdDialog.show({
        clickOutsideToClose: true,
        scope: $scope,
        preserveScope: true,
        templateUrl: 'templates/pictureoverlay.html',
        controller: function DialogController($scope, $mdDialog) {
          $scope.closeDialog = function () {
            $mdDialog.hide();
          }
        }
      });
    };



    $scope.showImageDialog = function (ev) {
      $mdDialog.show({
          //controller: DialogController,
          templateUrl: 'templates/pictureoverlay.html',
          parent: angular.element(document.body),
          targetEvent: ev,
          clickOutsideToClose: true
        })
        .then(function (answer) {
          //	$scope.status = 'You said the information was "' + answer + '".';
        }, function () {
          //	$scope.status = 'You cancelled the dialog.';
        });
    }


    $scope.dashboard = {
      timeframe: "Day",
      activeriquadro: 0,
    }

    $scope.timeframes = [{
        period: "Day",
        checked: true
      },
      {
        period: "Month",
        checked: false
      },
      {
        period: "Year",
        checked: false
      }
    ];


    $scope.selectedMachine = {
      name: "121P",
      description: "Maker",
      type: ""
    }

    $scope.linecampo = "True_duration";
    $scope.line2campo = "acceleration_x";

    $scope.eventlog = [];
    $scope.eventlog2 = [];
    $scope.linedata = [
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    ];
    $scope.linelabels = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    $scope.blanklinelabels = ['', '', '', '', '', '', '', '', '', ''];

    $scope.phases = companydescr;
    //console.log("phases", $scope.phases);

    $scope.prodoutput = 100;
    $scope.totoutput = "21.6M";

    $scope.dohnutdata = [65, 59, 80, 81, 56, 55, 40];

    $scope.pie = chartservice.pie();

    var line2data = [100];
    var line2databis = [];
    var line2labels = [];
    for (var i = 0; i < 50; i++) {
      line2data.push(0);
      line2databis.push(i + 30);
      line2labels.push("");

    }

    $scope.line2 = chartservice.line({
      //labels: ["January", "February", "March", "April", "May", "June", "July"],
      labels: line2labels,
      series: ["a", "b"],
      data: [
        line2data

        /*,
                [8, 22, 40, 19, 86, 27, 90],
                [1, 38, 40, 49, 81, 43, 77]*/
      ]
    });







    $scope.bubble = {};
    $scope.bubble.series = [];
    $scope.bubble.options = {
      scales: {
        xAxes: [{
          display: false,
          ticks: {
            max: 125,
            min: -125,
            stepSize: 10
          }
        }],
        yAxes: [{
          display: false,
          ticks: {
            max: 125,
            min: -125,
            stepSize: 10
          }
        }]
      }
    };

    //$scope.bubble.labels = ["1", "2", "3", "4", "5", "6"];

    var data = {
      labels: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
      datasets: [{
        label: "Prime and Fibonacci",
        fillColor: "rgba(220,220,220,0.2)",
        strokeColor: "rgba(220,220,220,1)",
        pointColor: "rgba(220,220,220,1)",
        pointStrokeColor: "#fff",
        pointHighlightFill: "#fff",
        pointHighlightStroke: "rgba(220,220,220,1)",
        data: [2]
      }, ]
    };

    $scope.healthyscoretrends = {
      data: [
        [1, 2, 3, 4, 5, 20],

      ],
      series: [
        ["MUZIO"],

      ],
      labels: [
        ["January", "February", "March", "April", "May", "June", "July"],

      ]
    }

    $scope.healthyscoretrends.options = {
      showTooltips: true,
      responsive: true,

    }

    $scope.radar = chartservice.radar({
      //labels: ["January", "February", "March", "April", "May", "June", "July"],
      labels: [],
      series: [],
      data: [
        [10, 11, 80, 81, 56, 55, 40]

      ]
    });
    $scope.doughnot = chartservice.doughnot({
      labels: ["a", "b"],
      data: [61, 39]
    });
    //$scope.doughnot.options=chartservice.defaultoptions;
    $scope.doughnot.options = {
      sanimation: {
        onComplete: function () {
          console.log("animation complete");
          var self = this,
            chartInstance = this.chart,
            ctx = chartInstance.ctx;

          ctx.font = '25px Arial';
          ctx.textAlign = "center";
          ctx.fillStyle = "#000000";

          Chart.helpers.each(self.data.datasets.forEach(function (dataset, datasetIndex) {
            var meta = self.getDatasetMeta(datasetIndex),
              total = 0, //total values to compute fraction
              labelxy = [],
              offset = Math.PI / 2, //start sector from top
              radius,
              centerx,
              centery,
              lastend = 0; //prev arc's end line: starting with 0

            for (var val in dataset.data) {
              total += val;
            }

            Chart.helpers.each(meta.data.forEach(function (element, index) {
              radius = 0.9 * element._model.outerRadius - element._model.innerRadius;
              centerx = element._model.x;
              centery = element._model.y;
              var thispart = dataset.data[index],
                arcsector = Math.PI * (2 * thispart / total);
              if (element.hasValue() && dataset.data[index] > 0) {
                labelxy.push(lastend + arcsector / 2 + Math.PI + offset);
              } else {
                labelxy.push(-1);
              }
              lastend += arcsector;
            }), self)

            var lradius = radius * 3 / 4;
            for (var idx in labelxy) {
              if (labelxy[idx] === -1) continue;
              var langle = labelxy[idx],
                dx = centerx + lradius * Math.cos(langle),
                dy = centery + lradius * Math.sin(langle),
                val = Math.round(dataset.data[idx] / total * 100);
              ctx.fillText(val + '%', dx, dy);
            }

          }), self);
        }
      },
      elements: {
        center: {
          // the longest text that could appear in the center
          maxText: '100%',
          text: '61%',
          fontColor: '#36A2EB',
          fontFamily: "'Helvetica Neue', 'Helvetica', 'Arial', sans-serif",
          fontStyle: 'normal',
          // fontSize: 12,
          // if a fontSize is NOT specified, we will scale (within the below limits) maxText to take up the maximum space in the center
          // if these are not specified either, we default to 1 and 256
          minFontSize: 1,
          maxFontSize: 100,
        }
      },
      responsive: true,
      maintainAspectRatio: false,
      legend: {
        display: false,
        position: "bottom",


        labels: {
          fontSize: 12,
          usePointStyle: true,
          //boxWidth: 0
        }
      },


    }



    $scope.gauges = [];
    var gaugelabels = [
      "Sensor X1",
      "Sensor X2",
      "Sensor X3",
      "Sensor X4",
      "Sensor X5",
      "Sensor X6",
      "Sensor X7",
      "Sensor X8"
    ];

    $scope.sensormeasurement = [];



    for (var i = 0; i < 8; i++) {

      var val = Math.floor(Math.random() * 100) + 1;
      var val2 = 100 - val;


      var newgauge = {
        id: i + 1,
        labels: [gaugelabels[i]],
        data: [val, val2],
        options: {
          legend: {
            display: false,
            position: "bottom",


            labels: {
              fontSize: 9,
              //usePointStyle: true,
              //boxWidth: 0
            }
          },
          rotation: 1 * Math.PI,
          circumference: 1 * Math.PI
        }
      }

      $scope.gauges.push(newgauge);


    }

    for (var i = 0; i < 3; i++) {
      var newgauge = {
        id: i + 1,
        labels: [],
        data: [
          []
        ],
        options: {
          legend: {
            display: false,
            position: "bottom",


            labels: {
              fontSize: 9,
              //usePointStyle: true,
              //boxWidth: 0
            }
          }
          /*,
                    rotation: 1 * Math.PI,
                    circumference: 1 * Math.PI*/
        }
      }

      $scope.sensormeasurement.push(newgauge);

    }



    /*$scope.anomalylog=[
      {
        date: new Date(),
        type: "TORQUE",
        indicator: "F1 Motor Torque on the load",
        value: 45

      },
      {
        date: new Date(),
        type: "TORQUE",
        indicator: "F1 Motor Torque on the load",
        value: 45

      },
      {
        date: new Date(),
        type: "TORQUE",
        indicator: "F1 Motor Torque on the load",
        value: 45

      },
      {
        date: new Date(),
        type: "TORQUE",
        indicator: "F1 Motor Torque on the load",
        value: 45

      },
      {
        date: new Date(),
        type: "TORQUE",
        indicator: "F1 Motor Torque on the load",
        value: 45

      },
      {
        date: new Date(),
        type: "TORQUE",
        indicator: "F1 Motor Torque on the load",
        value: 45

      },
      {
        date: new Date(),
        type: "TORQUE",
        indicator: "F1 Motor Torque on the load",
        value: 45

      },
      {
        date: new Date(),
        type: "TORQUE",
        indicator: "F1 Motor Torque on the load",
        value: 45

      }
    ]*/

    $scope.anomalylog = [];

    // 1, 2, 3, 4, 5, 6, 7, 8]


    $scope.gauge = chartservice.doughnot({
      labels: ["a"],
      data: [85, 15],
      options: {
        rotation: 1 * Math.PI,
        circumference: 1 * Math.PI
      }
    });




    $scope.line = chartservice.line({
      //labels: ["January", "February", "March", "April", "May", "June", "July"],
      labels: [],
      series: [],
      data: [
        [10, 11, 80, 81, 56, 55, 40]

      ]
    });

    $scope.bars = chartservice.bars();
    $scope.defectbar = chartservice.bars({
      labels: ['2010', '2011', '2012', '2013', '2014'],
      series: ['Packer', 'Maker'],
      data: [
        [10, 45],
        [10, 45],

      ]

    });
    $scope.defectbar.options = {
      //responsive: true,
      //maintainAspectRatio: false,    
      legend: {
        display: false
      },
      scales: {
        xAxes: [{
          stacked: false,
          barThickness: 80
        }],
        yAxes: [{
          stacked: true
        }]
      }
    }


    $scope.piedata = [65, 59, 80, 81, 56, 55, 40];
    $scope.polardata = [65, 59, 80, 81, 56, 55, 40];

    $scope.colors = ['#45b7cd', '#ff6384', '#ff8e72'];
    $scope.gaugecolors = $scope.colors;
    //$scope.colors = ["green", "red", "yellow", "orange", "blue"];

    $scope.numevents = 0;
    $scope.buffersize = 10;
    $scope.buffersteps = 1;
    $scope.buffercount = 0;
    $scope.buffer = [];
    $scope.simulstatus = false;

    $scope.init = function () {
      //iot.connect();
      //console.log("dounot", $scope.doughnot.data);
      if (!secured.checkAuth()) return;
      backend.get(globals.rooturl + "/simulation/getsimulstatus", function (data) {
        $timeout(function () {
          $scope.simulstatus = data.simulstatus;
          console.log($scope.simulstatus);

        })

      })
      $scope.getUpperDash();
      return;


      //createBubbleChart();
    }

    $scope.getUpperDash = function () {
      $scope.getOperationShutdownTime();
      $scope.getOperationShutdownTimeForMachine();
      //$scope.getProductionOutputWithTarget();
      $scope.getProductionDefectCount();
      $scope.getEquipmentAnomalyCount();
      $scope.getRiga400();
    }

    $scope.setDash = function (idx) {
      console.log("setDash", idx);
      $scope.dashboard.activeriquadro = idx;
      $scope.activedash = idx;
      return;

    }


    $scope.getChartById = function (id) {
      var retvalue = {};
      console.log("getchartsbyid " + id);
      dashcharts.forEach(function (item, idx) {
        if (item.id) {
          if (item.id.toLowerCase() == id.toLowerCase()) {
            console.log("found chart !", item);
            retvalue = item;
          }
        }
      })
      return retvalue;
    }




    $scope.selectMachine = function (machine) {
      $scope.faultsShown = false;
      $scope.faultsLoading = false;
      $scope.PrePostventLoading = false

      $scope.selectedMachine = machine;
      console.log("machine", machine);
      if (machine == "121P") {
        $scope.linecampo = "True_duration";
        $scope.line2campo = "acceleration_x";
      }
      if (machine == "H1000") {
        $scope.linecampo = "True_duration";
        $scope.line2campo = "acceleration_y";
      }
      if (machine == "W1000BV") {
        $scope.linecampo = "True_duration";
        $scope.line2campo = "acceleration_z";
      }
      $scope.getRiga400();
      $scope.getOperationShutdownTimeForMachine();
    }


    $scope.getOperationShutdownTime = function () {
      var timeframe = globals.timeframe;
      var tfdate = globals.timeframedate;
      //console.log(timeframe);
      var url = "/dashboard/operationshutdowntime?tftype=" + timeframe.toLowerCase() + "&tfdate=" + tfdate;
      $scope.dashLoading.operationshutdown = true;
      backend.get(url, function (data) {
        //console.log("operationshutdowntime", data)
        $scope.dashLoading.operationshutdown = false;
        var lab = []


        $scope.lineoptions = {
          legend: {
            display: false
          }
        };

        //var options = chartservice.defaultoptions;
        //console.log("options",options);
        var options = {
          events: false,
          showAllTooltips: false,
          legend: {
            display: true,
            position: "bottom",


            labels: {
              fontSize: 12,
              usePointStyle: true,
              //boxWidth: 0
            }
          },
          animation: {
            duration: 500,
            easing: "easeOutQuart",
            onComplete: function () {
              var ctx = this.chart.ctx;
              ctx.font = Chart.helpers.fontString(Chart.defaults.global.defaultFontFamily, 'normal', Chart.defaults.global.defaultFontFamily);
              ctx.textAlign = 'center';
              ctx.textBaseline = 'bottom';

              this.data.datasets.forEach(function (dataset) {

                for (var i = 0; i < dataset.data.length; i++) {
                  var model = dataset._meta[Object.keys(dataset._meta)[0]].data[i]._model,
                    total = dataset._meta[Object.keys(dataset._meta)[0]].total,
                    mid_radius = model.innerRadius + (model.outerRadius - model.innerRadius) / 2,
                    start_angle = model.startAngle,
                    end_angle = model.endAngle,
                    mid_angle = start_angle + (end_angle - start_angle) / 2;

                  var x = mid_radius * Math.cos(mid_angle);
                  var y = mid_radius * Math.sin(mid_angle);

                  ctx.fillStyle = '#000';
                  if (i == 3) { // Darker text color for lighter background
                    ctx.fillStyle = '#222';
                  }

                  var val = parseFloat(dataset.data[i]);
                  var percent = String((val / total * 100).toFixed(1)) + "%";

                  if (val != 0) {
                    //ctx.fillText(dataset.data[i], model.x + x, model.y + y);
                    // Display percent in another line, line break doesn't work for fillText
                    ctx.fillText(percent, model.x + x, model.y + y + 15);
                  }
                }
              });
            }
          },
          responsive: true,
          maintainAspectRatio: false


        }




        var total = parseFloat(data.production) + parseFloat(data.stop) + parseFloat(data.wait);
        var prodperc = parseFloat(data.production / total * 100);
        var stopperc = parseFloat(data.stop / total * 100);

        //var waitperc = parseInt(data.wait / total * 100,10);


        var waitperc = 100 - prodperc - stopperc;

        console.log("prodperc", prodperc, "stopperc", stopperc, "waitperc", waitperc);

        $scope.pie2 = chartservice.pie({
          labels: ["Prod", "Stop", "Wait"],
          series: ["Prod", "Stop", "Wait"],


          data: [prodperc.toFixed(1), stopperc.toFixed(1), waitperc.toFixed(1)],
          options: options
        })



      })
    }

    $scope.getOperationShutdownTimeForMachine = function () {
      var timeframe = globals.timeframe;
      var tfdate = globals.timeframedate;
      //console.log(timeframe);
      var url = "/dashboard/operationshutdowntime?tftype=" + timeframe.toLowerCase() + "&tfdate=" + tfdate + "&machine=" + $scope.selectedMachine.name;
      $scope.dashLoading.operationshutdownmachine = true;
      backend.get(url, function (data) {
        $scope.dashLoading.operationshutdownmachine = false;
        colog("operationshutdowntimeformachine", data)


        var lab = []

        // Configure only this instance
        $scope.lineoptions = {
          legend: {
            display: false
          }
        };

        var options = chartservice.defaultoptions;
        options.legend = {
          display: false


        }
        options.animation = {
          onComplete: function () {
            rightLabelsPercent(this, 200)
          }
        }
        //console.log("options",options);


        var total = parseFloat(data.production) + parseFloat(data.stop) + parseFloat(data.wait);
        var prodperc = parseFloat(data.production / total * 100);
        var stopperc = parseFloat(data.stop / total * 100);
        //var waitperc = parseInt(data.wait / total * 100,10);
        var waitperc = 100 - prodperc - stopperc;

        console.log("prodperc", prodperc, "stopperc", stopperc, "waitperc", waitperc);

        $scope.pie2machine = chartservice.pie({
          labels: ["Prod", "Stop", "Wait"],
          series: ["Prod", "Stop", "Wait"],


          data: [prodperc.toFixed(1), stopperc.toFixed(1), waitperc.toFixed(1)],
          options: options
        })



      })
    }
    $scope.getProductionOutputWithTarget = function () {
      var timeframe = globals.timeframe;
      var tfdate = globals.timeframedate;
      //console.log(timeframe);
      var url = "/dashboard/productionoutputwithtarget?tftype=" + timeframe.toLowerCase() + "&tfdate=" + tfdate;
      $scope.dashLoading.productionoutput = true;
      backend.get(url, function (data) {
        $scope.dashLoading.productionoutput = false;
        console.log("productionooutpuwithtarget", data);
        var po = (parseFloat(data.paker1) / 1000000).toFixed(2) + "M";
        $scope.prodoutput = po;
      });
    }
    $scope.getProductionDefectCount = function () {
      var timeframe = globals.timeframe;
      var tfdate = globals.timeframedate;
      //console.log(timeframe);
      var url = "/dashboard/productdefectcount?tftype=" + timeframe.toLowerCase() + "&tfdate=" + tfdate;
      $scope.dashLoading.rejectcount = true;
      backend.get(url, function (data) {
        $scope.dashLoading.rejectcount = false;
        console.log("productdefectcount", data);


        $scope.renderProductionDefectCount(data);

        /*
                var machines=data.machines;

                var dbar={
                  labels: [0,1,2,3,4,5,6,7,8,9,10],
                  series: [],
                  data: [
                    


                  ]

                }


                machines.forEach(function(item,idx){
                  var mname=item.machine;
                  var count=item.count;
                  var newarr=[];
                  newarr.push(count);
                  dbar.data.push(newarr);
                  dbar.series.push(mname);




                })

                $scope.defectbar=chartservice.bars(dbar);
        */
        /*$scope.defectbar = chartservice.bars({
          labels: [""],
          series: ['Packer', 'Maker'],
          data: [
            [data.paker],
            [data.maker]


          ]

        });*/


      });
    }
    $scope.renderProductionDefectCount = function (data) {

      var machines = data.machines;

      var dbar = {
        labels: [],
        series: [],
        data: [



        ]

      }

      var maxcount = 0;
      var arr = [];
      dbar.data.push(arr);
      machines.forEach(function (item, idx) {
        var mname = item.machine;
        var doIt = true;
        if (mname == "121P") doIt = true;
        if (mname == "H1000") doIt = true;
        if (doIt) {
          var count = parseInt(item.count, 10);
          if (count > maxcount) maxcount = count;
          var newarr = [];
          arr.push(count);
          //dbar.data.push(newarr);
          dbar.series.push(mname);
          dbar.labels.push(mname);
        }




      })

      /*dbar.data=[
        [0,1,2],
        [3,4]
      ]*/

      $scope.defectbar = chartservice.bars(dbar);
      $scope.defectbar.options = {
        responsive: true,
        legend: {
          display: false
        },
        showAllTooltips: false,
        scales: {
          xAxes: [{
            /*stacked: false,*/
            barThickness: 80
          }],
          yAxes: [{
            stacked: true
          }]
        },
        animation: {
          duration: 0,
          onComplete: function () {
            rightLabels(this);
          }
        }



      }
    }

    $scope.getRiga400 = function () {

      $scope.riga400 = [];
      riga400.rows.forEach(function (item, idx) {
        var mach = item.Macchina;
        // console.log(mach,$scope.selectedMachine.name);

        if (mach.toLowerCase() == $scope.selectedMachine.name.toLowerCase()) {
          for (s in item) {
            var el = {
              value: item[s],
              text: s
            }
            $scope.riga400.push(el);
          }

        }


      })

      // console.log("getriga400",$scope.riga400);

    }

    $scope.getEquipmentAnomalyCount = function () {
      var timeframe = globals.timeframe;
      var tfdate = globals.timeframedate;
      console.log(timeframe);
      var url = "/dashboard/equipmentanomalycount?tftype=" + timeframe.toLowerCase() + "&tfdate=" + tfdate;
      $scope.dashLoading.equipmentstops = true;
      backend.get(url, function (data) {
        $scope.dashLoading.equipmentstops = false;
        console.log("equipmentanomalycount", data);
        $scope.renderEquipmentAnomalyCount(data);

      });
    }

    $scope.renderEquipmentAnomalyCount = function (data) {

      var machines = data.machines;

      var eabars = {

        labels: [],
        series: [],
        data: [
          []


        ]

      }

      machines.forEach(function (item, idx) {
        eabars.data[0].push(item.count);
        eabars.labels.push(item.machine);



      })
      eabars.options = {
        scaleOverride: true,
        //scaleStartValue: 0,
        legend: {
          display: false
        },
        scales: {
          yAxes: [{
            ticks: {
              min: 0,
              beginAtZero: true
            }
          }]
        }
      }

      eabars.options = {
        responsive: true,
        legend: {
          display: false
        },
        showAllTooltips: false,
        scales: {
          xAxes: [{
            /*stacked: false,*/
            barThickness: 80
          }],
          yAxes: [{
            stacked: true
          }]
        },
        animation: {
          duration: 0,
          onComplete: function () {
            rightLabels(this);
          }
        }



      }


      // $scope.equipmentanomaly = chartservice.bars(eabars);
      $scope.equipmentanomaly = eabars;

    }



    $scope.getDeviceData = function () {
      globals.loadingShow();
      dbs.get("andro1212", function (data) {
        console.log("got andro1212", data);

        data.rows.forEach(function (item, idx) {
          if (idx < 100) {
            var args = item.doc;
            if (args.deviceId == "121212") {


              if ($scope.line.data[0].length == 6) {
                $scope.line.data[0].shift();

              }


              $scope.line.data[0].push(args.payload.d.acceleration_x);

              //console.log($scope.line.data[0]);
            }


          }
        })
        globals.LoadingHide();
        // $scope.$digest();

      })
    }

    $scope.$on("iotDeviceEvent", function (event, args) {
      return;
      //console.log("deviceevent!", args);
      var pay = args.payload.d;
      //plotAccel(pay.acceleration_x, pay.acceleration_y, pay.acceleration_z);
      $scope.numevents++;
      $scope.buffercount++;
      var evstring = "Device Event from " + args.deviceType + ":" + args.deviceId + " X:" + args.payload.d.acceleration_x + " Y:" + args.payload.d.acceleration_y + " Z:" + args.payload.d.acceleration_z;
      $scope.eventlog2.push(evstring);
      if (args.deviceId == "121212") {
        if ($scope.line.data[0].length == $scope.buffersize) {
          $scope.line.data[0].shift();


        }


        $scope.line.data[0] = [args.payload.d.acceleration_x];
        $scope.$digest();
      }
      return;
      $scope.buffer.push(args.payload.d.acceleration_x);
      if ($scope.buffercount < $scope.buffersize) {

        $scope.$digest()


      } else {
        console.log("buffer", $scope.buffer)
        if (args.deviceId == "121212") {



          $scope.line.data[0] = angular.copy($scope.buffer);
          $scope.$digest();
          //console.log($scope.line.data[0]);
        }
        $scope.buffercount = 0;
        $scope.buffer = [];
      }
      //console.log($scope.numevents);
      //$scope.$digest();
      //return;
      //console.log("deviceevent!",args);
      /*
            if (args.deviceId == "121212") {


              if ($scope.line.data[0].length == 6) {
                $scope.line.data[0].shift();

              }


              $scope.line.data[0].push(args.payload.d.acceleration_x);
              $scope.$digest();
              //console.log($scope.line.data[0]);
            }*/
    })

    $scope.populateHealthy = function (args) {

      //console.log("populatehealthy", args);
      var field = args.field;
      //var td = args.events[0].True_duration;
      var macchina = args.events[0].Macchina;
      var hs = parseFloat(args.events[0].Health_score.trim());




      $scope.linedata[0].shift();
      $scope.lineseries = [field]; //$scope.linecampo;
      //if ($scope.eventlog.length >= 20) $scope.eventlog.shift();
      //$scope.eventlog.push(field + " - " + td);



      $scope.linedata[0].push(hs.toFixed(2));

      //$scope.$digest();

    }

    $scope.iotMap = [{

        chart: {
          title: "titolo",
          type: "bar",
          data: [],
          labels: [],
          series: [],
        },
        evtype: "MAKER_Scarti_sigarette.json",
        fields: ["cavallo", "rinoceronte", "fagiano"],
        steps: 7
      }

    ]



    $scope.$on("iotbuffer", function (event, args) {
      var events = args.events;
      var iotindex = args.iotindex;

      //iotchart.mapIot(args,$scope);

      //$scope.mapIot(args);
      //console.log("iotindex",iotindex);

      var labels = [];
      var arr = [];
      var evtype = args.evtype;
      colog("iotbuffer received from socket server, eventtype " + evtype, args);

      if (evtype == "productionoutputwithtarget.json") {
        var ev = args.events[0];
        var po = (parseFloat(ev.Production) / 1000000).toFixed(2) + "M";
        $scope.prodoutput = po;
        return;

      }

      if (evtype == "anomalylog.json") {
        console.log("anomalylog",args);
        if ($scope.anomalylog.length == 30) $scope.anomalylog.shift();
        $scope.anomalylog.push(args.events[0]);
        //console.log($scope.anomalylog.length);
        //$scope.$digest();
        return;
      }

      if (evtype == "equipmentanomalylog.json") {
        if ($scope.eventlog2.length == 30) $scope.eventlog2.shift();
        var ev = args.events[0];
        var txt = ev.end + " - " + ev.MACCHINA + " - " + ev.glossary;
        $scope.eventlog2.push(ev);
        //console.log($scope.anomalylog.length);
        //$scope.$digest();
        return;
      }

      if (evtype == "conditionindicators.json") {
        var motore = args.events[0].Nome;
        var motoridx = parseInt(motore.split("_")[2], 10) - 1;


        //console.log("motoridx", motoridx);
        var val = args.events[0].Value;
        var val2 = 100 - parseInt(val, 10);
        var gauge = {
          id: motoridx + 1,
          labels: [gaugelabels[motoridx]],
          data: [val, val2],
          options: {
            legend: {
              display: false,
              position: "bottom",


              labels: {
                fontSize: 9,
                //usePointStyle: true,
                //boxWidth: 0
              }
            },
            rotation: 1 * Math.PI,
            circumference: 1 * Math.PI
          }
        }
        $scope.gauges[motoridx].data = gauge.data;

        //$scope.$digest();
        //return;
      }

      if (evtype == "sensormeasurement.json") {
        var ev = args.events[0];
        var sensorname = args.events[0].Name;
        var sensidx = parseInt(sensorname.toLowerCase().split("_")[1].replace("x", ""), 10) - 1;

        if (sensidx < 3) {

          //console.log("$scope.sensor[" + sensidx + "]", $scope.sensormeasurement[sensidx]);
          if ($scope.sensormeasurement[sensidx].data[0].length == 10) $scope.sensormeasurement[sensidx].data[0].shift();
          $scope.sensormeasurement[sensidx].data[0].push(parseInt(ev.Value, 10));
          if ($scope.sensormeasurement[sensidx].labels.length == 10) $scope.sensormeasurement[sensidx].labels.shift();
          $scope.sensormeasurement[sensidx].labels.push("|");
          $scope.sensormeasurement[sensidx].series = [sensorname];

          //$scope.line2.data[iotindex].shift();
          //$scope.$digest();
          //console.log("$scope.sensor",$scope.sensormeasurement);
          //return;
        }


      }

      if (evtype == "TimeHistory_H1000_LU30.json") {
        $scope.populateHealthy(args);
        //return;

      }

      if (evtype == "MAKER_Scarti_sigarette.json") {

        //return;
        var count = 0;
        events.forEach(function (item, idx) {
          count++;

          /*labels.push(count)item
          arr.push(item);*/

          /* $scope.line2.data[iotindex].shift();
           $scope.line2.data[iotindex].push(item.Maker_82);
           $scope.line2.series[iotindex] = args.field;*/
          var hs = parseFloat(item.Availability.replace(",", "."));
          colog("healthscore", hs);

          $scope.line2.data[0].shift();
          $scope.line2.data[0].push(hs);
          $scope.line2.series[0] = args.field;

          //$scope.line2.labels[iotindex]=args.field;

          //var evstring = args.field + ": " + item.Maker_82;
          //if ($scope.eventlog2.length >= 20) $scope.eventlog2.shift();
          //$scope.eventlog2.push(evstring);



        })
        //$scope.$digest();
        //return;
      }

      if (evtype == "equipmentfailurmodel.json") {
        if ($scope.equipmentfailuremodel.length == 10) $scope.equipmentfailuremodel.shift();
        var ev = args.events[0];
        // console.log(ev);



        var model = ev.Model_ID;

        var found = false;
        $scope.equipmentfailuremodel.forEach(function (item, idx) {
          var md = item.Model_ID;
          if (md == model) {
            found = true;
            item.Precision = ev.Precision;
            item.Recall = ev.Recall;

          }


        })


        if (!found) $scope.equipmentfailuremodel.push(ev);
        $scope.equipmentfailuremodel.sort(function (a, b) {
          var a1 = a.Model_ID;
          var b1 = b.Model_ID;
          if (a1 > b1) return 1;
          if (a1 < b1) return -1;
          return 0;

        })
        //console.log($scope.equipmentfailuremodel);
        // $scope.$digest();
        return;




      }

      if (evtype == "measurementprofile.json") {
        if ($scope.eventlog.length == 30) $scope.eventlog.shift();
        var ev = args.events[0];


        $scope.eventlog.push(ev);
        //console.log($scope.anomalylog.length);

        //$scope.$digest();
        return;




      }


      $scope.$digest();




    })

    $scope.activeEFM = -1;
    $scope.inputvariablefilter = "";

    $scope.clickEquipmentFailureModel = function (idx) {
      console.log(idx);
      $scope.activeEFM = idx;
      $scope.inputvariablefilter = $scope.equipmentfailuremodel[idx].Model_ID;

    }

    /*
        $scope.$on("dashdata", function (event, args) {
          colog("dashdata received from socket server", event, args);
          var op = args.operation;
          var data = args.data;
          var simulindex = args.simulation_index;
         
          if (op == "operationshutdowntime") {
         
            var lab = []

            $scope.lineoptions = {
              legend: {
                display: false
              }
            };

            var options = chartservice.defaultoptions;
        


            var prodperc = parseInt(data.production / data.total * 100.10);
            var stopperc = parseInt(data.stop / data.total * 100, 10);
            var waitperc = parseInt(data.wait / data.total * 100);
            $timeout(function () {
              $scope.pie2 = chartservice.pie({
                labels: ["Production", "Stop", "Wait"],
                series: ["Production", "Stop", "Wait"],


                data: [prodperc, stopperc, waitperc],
                options: options
              })

            })




          }

          if (op == "productionoutputwithtarget") {
            //console.log("productionooutpuwithtarget", data);
            $timeout(function () {
              $scope.prodoutput = data.paker1;
            })

          }

          if (op == "productdefectcount") {
            
            $timeout(function () {
              $scope.renderProductionDefectCount(data);
           

            })




          }


          if (op == "equipmentanomalycount") {
           
            $timeout(function () {
              $scope.renderEquipmentAnomalyCount(data);
             
            })

          }


          if (op == "filesimulation") {

            if (simulindex == 0) {
              var field = "True_duration";
              var td = data[field];




              $scope.linedata[0].shift();
              $scope.lineseries = [field]; //$scope.linecampo;
              
              $scope.linedata[0].push(td);

             
            }


            if (simulindex == 1) {
              var field = "Paker_64";
              var td = data[field];
           




              $scope.line2.data[0].shift();
              $scope.line2.series = field; //$scope.linecampo;
              if ($scope.eventlog2.length >= 20) $scope.eventlog2.shift();
              $scope.eventlog2.push(field + " - " + td);


            
              $scope.line2.data[0].push(td);
            
            }

            $scope.$digest();


          }
        })
        
    */




    $scope.toggleCsvSimulation = function () {
      backend.get("/simulation/setsimul/toggle", function (data) {
        console.log(data);
        $scope.simulstatus = data.simulstatus;
        console.log($scope.simulstatus);
        var newstate = "ON";
        if ($scope.simulstatus == false) newstate = "OFF";
        /*
        $ionicLoading.show({
          template: 'Simulation has been turned ' + newstate,
          noBackdrop: true,
          duration: 2000
        });
        */
      })

    }




  })


  .directive('groupedRadio', function () {
    return {
      restrict: 'A',
      require: 'ngModel',
      scope: {
        model: '=ngModel',
        value: '=groupedRadio'
      },
      link: function (scope, element, attrs, ngModelCtrl) {
        element.addClass('button');
        element.on('click', function (e) {
          scope.$apply(function () {
            ngModelCtrl.$setViewValue(scope.value);
          });
        });

        scope.$watch('model', function (newVal) {
          element.removeClass('button-positive');
          if (newVal === scope.value) {
            element.addClass('button-positive');
          }
        });
      }
    };
  })


  .directive('cxGauge', function () {
    return {
      restrict: 'E',
      scope: {
        value: '=gaugeValue',
        min: '=gaugeMin',
        max: '=gaugeMax',
        validTo: '=gaugeValid',
        warningTo: '=gaugeWarning',
        errorTo: '=gaugeError',
        tickInterval: '=gaugeTick'
      },
      template: '<div></div>',
      replace: true,
      link: function (scope, element) {

        var maxValue = 800;

        scope.ranges = {
          validTo: parseInt(scope.validTo) | 100,
          warningTo: parseInt(scope.validTo) | 400,
          errorTo: parseInt(scope.max) | 800
        };

        scope.scale = {
          startValue: scope.min | 0,
          endValue: scope.max | 100,
          tickInterval: scope.tickInterval | 100
        };

        // Create the second gauge
        element.dxCircularGauge({

          margin: {
            left: 10,
            right: 10,
            top: 10,
            bottom: 10
          },

          animationDuration: 200,
          animationEnabled: true,
          needles: [{
            offset: 5,
            indentFromCenter: 7,
            value: 0,
            color: '#999999'
          }],
          spindle: {
            color: '#999999'
          }
        });

        var gaugeInstance = element.dxCircularGauge('instance');


        scope.$watch('value', function (value) {

          if (!value) {
            value = 0;
          } else {
            value = parseInt(value);
          }

          gaugeInstance.needleValue(0, value);

        });

        scope.$watch('validTo', function (value) {
          if (!value) {
            return;
          }

          value = parseInt(value);
          scope.ranges.validTo = value;
        });

        scope.$watch('warningTo', function (value) {
          if (!value) {
            return;
          }

          value = parseInt(value);
          scope.ranges.warningTo = value;
        });

        scope.$watch('errorTo', function (value) {
          if (!value) {
            return;
          }

          value = parseInt(value);
          scope.ranges.errorTo = value;
        });


        scope.$watch('min', function (value) {
          if (!value) {
            return;
          }

          value = parseInt(value);
          scope.scale.startValue = value;
        });

        scope.$watch('max', function (value) {
          if (!value) {
            return;
          }

          value = parseInt(value);
          scope.scale.endValue = value;
        });

        scope.$watch('tickInterval', function (value) {
          if (!value) {
            return;
          }

          value = parseInt(value);
          scope.scale.tickInterval = value;
        });

        scope.$watch('scale', function (value) {
          gaugeInstance.option({

            scale: {
              startValue: value.startValue,
              endValue: value.endValue,
              majorTick: {
                tickInterval: value.tickInterval
              },
              label: {
                indentFromTick: 8
              }
            }

          });
        }, true);

        scope.$watch('ranges', function (value) {
          gaugeInstance.option({
            rangeContainer: {
              width: 4,
              backgroundColor: 'none',
              ranges: [

                // Error:
                {
                  startValue: 0,
                  endValue: value.errorTo,
                  color: '#E19094'
                },


                // Warning:
                {
                  startValue: 0,
                  endValue: value.warningTo,
                  color: '#FCBB69'
                },

                // Valid:
                {
                  startValue: 0,
                  endValue: value.validTo,
                  color: '#A6C567'
                }
              ]
            }
          });

        }, true);

      }

    };
  })


var isPhone = false;
var cookieDays = 1;
var storage;
var logactive = false;


function getCookie(c_name) {
  //colog("getcookie "+c_name)
  //colog("storage "+storage+ " - "+window.localStorage)

  var c_value;

  c_value = document.cookie;
  //console.log(c_value);
  var c_start = c_value.indexOf(" " + c_name + "=");
  if (c_start == -1) {
    c_start = c_value.indexOf(c_name + "=");
  }
  if (c_start == -1) {
    c_value = null;
  } else {
    c_start = c_value.indexOf("=", c_start) + 1;
    var c_end = c_value.indexOf(";", c_start);
    if (c_end == -1) {
      c_end = c_value.length;
    }
    c_value = unescape(c_value.substring(c_start, c_end));
  }

  return c_value;
}

function setCookie(c_name, value, exdays) {
  var exdate = new Date();
  exdate.setDate(exdate.getDate() + exdays);
  var c_value = escape(value) + ((exdays == null) ? "" : "; expires=" + exdate.toUTCString());
  document.cookie = c_name + "=" + c_value;
  // alert(getCookie(c_name));
}

var deleteCookie = function (name) {
  document.cookie = name + '=;expires=Thu, 01 Jan 1970 00:00:01 GMT;';
};


;