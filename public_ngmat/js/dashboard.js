angular.module("RDash",["ui.bootstrap","ui.router","ngCookies"]);
"use strict";
angular.module("RDash")
.config(["$stateProvider","$urlRouterProvider",function(t,e){
    e.otherwise("/"),
    t.state("index",{url:"/",templateUrl:"templates/dashboard.html"})
    .state("minidash",{url:"/minidash",templateUrl:"templates/minidash.html"})
    .state("tables",{url:"/tables",templateUrl:"templates/tables.html"})}])

 .directive("iotchart", function ($compile) {

    return {
      restrict: "E",

      template: '<div class="card" style="margin: 1px; "><div class="item item-divider"><span>{{datasource.evtype}}</span><div style="display:none;"><select ng-change="changeChartType()" ng-model="chartType"><option>line</option><option>bar</option><option>horizontal-bar</option><option>pie</option></select></div></div> <div class="item item-text-wrap" style="text-align: center; vertical-align: middle"><canvas style="{{canvasstyle}}" sheight="canvasheight" id="line"  class="" chart-data="datasource.chart.data" chart-labels="datasource.chart.labels" chart-legend="true" chart-series="datasource.chart.series" chart-options="datasource.chart.options"></canvas></div></div>',
      scope: {
        datasource: "=",
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

            console.log("COMPILEPRE", scope.classe);
            var cl = "chart chart-" + scope.classe;
            element.find("canvas").attr("class", cl);





          },
          post: function (scope, element, attributes, controller, transcludeFn) {
            console.log("COMPILEPOST");
            $compile(element.contents())(scope);


          }
        }
      },
      controller: function ($scope, $element, $compile) {
        console.log("CONTROLLER", $scope.datasource);

        $scope.classe = $scope.datasource.chart.type;
        $scope.chartType = $scope.classe;

        $scope.changeChartType = function () {
          console.log($scope.chartType)
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
   .factory("globals", function () {
    var globalsService = {};


    globalsService.rooturl = "http://localhost:3000";
    //globalsService.rooturl = "http://iotindustry40.mybluemix.net";
    //globalsService.rooturl = "http://9.71.213.181:3000";


/*
    globalsService.loadingShow = function () {
      $ionicLoading.show({
        content: "Loading...",
        animation: 'fade-in',
        showBackdrop: true,
        maxWidth: 200,
        template: '<ion-spinner icon="ios"></ion-spinner>',

        showDelay: 0
      });
    };

    globalsService.LoadingHide = function () {
      $ionicLoading.hide();
    };

*/
    return globalsService;

  })
  .factory("socket", function (globals, $rootScope) {
    var socketService = {
      socket: {}
    };

    socketService.socket = io.connect(globals.rooturl);






    socketService.socket.on('getclientspecs', function (msg) {
      console.log("socket getclientspecs from the server", msg);
      //$rootScope.$broadcast("refreshChatUsers","");
    });

    socketService.socket.on('iot_deviceevent', function (msg) {
      //console.log("iot events received from socket server", msg);
      $rootScope.$broadcast("iotbuffer", msg);
    });

    socketService.socket.on('dashdata', function (msg) {
      //console.log("iot events received from socket server", msg);
      $rootScope.$broadcast("dashdata", msg);
    });





    return socketService;
  })


  .controller('GraficiCtrl', function ($scope, socket, $ionicSideMenuDelegate, $compile, iotchart) {


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

    }


  })



function AlertsCtrl(e){e.alerts=[{type:"success",msg:"Thanks for visiting! Feel free to create pull requests to improve the dashboard!"},{type:"danger",msg:"Found a bug? Create an issue with as many details as you can."}],e.addAlert=function(){e.alerts.push({msg:"Another alert!"})},e.closeAlert=function(t){e.alerts.splice(t,1)}}angular.module("RDash").controller("AlertsCtrl",["$scope",AlertsCtrl]);
function MasterCtrl(t,e){var g=992;t.getWidth=function(){return window.innerWidth},t.$watch(t.getWidth,function(o,n){o>=g?angular.isDefined(e.get("toggle"))?t.toggle=!!e.get("toggle"):t.toggle=!0:t.toggle=!1}),t.toggleSidebar=function(){t.toggle=!t.toggle,e.put("toggle",t.toggle)},window.onresize=function(){t.$apply()}}angular.module("RDash").controller("MasterCtrl",["$scope","$cookieStore",MasterCtrl]);
function rdLoading(){var d={restrict:"AE",template:'<div class="loading"><div class="double-bounce1"></div><div class="double-bounce2"></div></div>'};return d}angular.module("RDash").directive("rdLoading",rdLoading);
function rdWidgetBody(){var d={requires:"^rdWidget",scope:{loading:"=?",classes:"@?"},transclude:!0,template:'<div class="widget-body" ng-class="classes"><rd-loading ng-show="loading"></rd-loading><div ng-hide="loading" class="widget-content" ng-transclude></div></div>',restrict:"E"};return d}angular.module("RDash").directive("rdWidgetBody",rdWidgetBody);
function rdWidgetFooter(){var e={requires:"^rdWidget",transclude:!0,template:'<div class="widget-footer" ng-transclude></div>',restrict:"E"};return e}angular.module("RDash").directive("rdWidgetFooter",rdWidgetFooter);
function rdWidgetTitle(){var i={requires:"^rdWidget",scope:{title:"@",icon:"@"},transclude:!0,template:'<div class="widget-header"><div class="row"><div class="pull-left"><i class="fa" ng-class="icon"></i> {{title}} </div><div class="pull-right col-xs-6 col-sm-4" ng-transclude></div></div></div>',restrict:"E"};return i}angular.module("RDash").directive("rdWidgetHeader",rdWidgetTitle);
function rdWidget(){var d={transclude:!0,template:'<div class="widget" ng-transclude></div>',restrict:"EA"};return d}angular.module("RDash").directive("rdWidget",rdWidget);