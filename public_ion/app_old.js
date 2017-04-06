angular.module('iotapp', ['ionic', 'chart.js'])

  .factory('WatsonIoT', function () {
    return IBMIoTF.IotfApplication;
  })

  .factory("iot",function(WatsonIoT,$rootScope){
    var iot={};


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


      iot.connectionstatus = "connecting....";
      console.log("connecting to iot");
      iot.EventLog = ""
      appClient = new WIoT({
        "org": iot.OrgId,
        "id": Date.now() + "",
        "domain": "internetofthings.ibmcloud.com",
        "auth-key": iot.APIKey,
        "auth-token": iot.AuthToken
      })
      appClient.connect();
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
        var event={
          deviceType: deviceType,
          deviceId: deviceId,
          eventType: eventType,
          format: format,
          payload: pl
        }
        $rootScope.$broadcast("iotDeviceEvent",event);
        //console.log("Device Event from :: "+deviceType+" : "+deviceId+" of event "+eventType+" with payload "+payload);
        //$scope.$digest();
       
        //console.log(pl);
      });
    }



    return iot;
  })


  .factory("ChartService", function () {
    var chartService = {};

    var chartOptions={
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
      scaleFontSize: 12,
      // String - Scale label font weight style
      scaleFontStyle: "normal",
      // String - Scale label font colour
      scaleFontColor: "#666",
      // Boolean - whether or not the chart should be responsive and resize when the browser does.
      responsive: true,
      // Boolean - Determines whether to draw tooltips on the canvas or not
      showTooltips: false,
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
      onAnimationProgress: function () {},
      // Function - Will fire on animation completion.
      onAnimationComplete: function () {}
    };

    chartService.pie = function (params) {
      if (!params) {
        params = {
          labels: ["Download Sales", "In-Store Sales", "Mail-Order Sales"],
          data: [300, 500, 100],
          options: chartOptions
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
          data: [[],[],[]],
          options: chartOptions
        }

      }
      return params;


    }


    chartService.bars = function (params) {
      if (!params) {
        params = {
          labels: ['2006', '2007', '2008', '2009', '2010', '2011', '2012'],
          series: ['Series A', 'Series B'],
          data: [
            [65, 59, 80, 81, 56, 55, 40],
            [28, 48, 40, 19, 86, 27, 90]
          ],
          options: chartOptions

        }
      }

      return params;
    }


    return chartService;

  })

  .config(function ($stateProvider, $urlRouterProvider) {

    $stateProvider
      .state('app', {
        url: "/app",
        abstract: true,
        cache: false,
        templateUrl: "menu.html",
        controller: 'AppCtrl'
      })
      .state('app.home', {
        url: "/home",
        cache: false,
        views: {
          'menuContent': {
            templateUrl: "templates/home.html",
            controller: "HomeCtrl"
          }
        }
      })
      .state('app.dash', {
        url: "/dash",
        views: {
          'menuContent': {
            templateUrl: "templates/playlist.html",
            controller: "HomeCtrl"
          }
        }
      })
      .state('app.chart', {
        url: "/chart",
        views: {
          'menuContent': {
            templateUrl: "templates/chart.html",
            controller: "ChartCtrl"
          }
        }
      })



    $urlRouterProvider.otherwise('/app/home');
  })

  .controller('AppCtrl', function ($scope, $ionicSideMenuDelegate) {
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
      $ionicSideMenuDelegate.toggleLeft();
    };
  })

  .controller('MainCtrl', function ($scope, $ionicSideMenuDelegate) {
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
      $ionicSideMenuDelegate.toggleLeft();
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
  .controller('sHomeCtrl', function ($scope, WatsonIoT, $state) {

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
        $state.go("app.chart");
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


  })

  .controller('HomeCtrl', function ($scope, iot, $state) {

    $scope.main={
      EventLog: iot.EventLog
    }

    $scope.iotconnect=function(){
      console.log("connecting");
      iot.connect(function(){
        console.log("connected to iot !!");
        $state.go("app.chart");
      });
    }

 
  })
  .controller("ChartCtrl", function ($scope, iot,ChartService) {

    var chartservice = ChartService;


    $scope.pie = chartservice.pie();
    $scope.pie2 = chartservice.pie();
    $scope.doughnot=chartservice.doughnot();

    

    $scope.line = chartservice.line();
    $scope.line2 = chartservice.line({
      labels: ["January", "February", "March", "April", "May", "June", "July"],
      series: ['A', 'B', 'C'],
      data: [
        [10, 11, 80, 81, 56, 55, 40],
        [8, 22, 40, 19, 86, 27, 90],
        [1, 38, 40, 49, 81, 43, 77]
      ]
    });
    $scope.bars = chartservice.bars();

    $scope.doughnutdata = [65, 59, 80, 81, 56, 55, 40];
    $scope.piedata = [65, 59, 80, 81, 56, 55, 40];
    $scope.polardata = [65, 59, 80, 81, 56, 55, 40];

    $scope.colors = ['#45b7cd', '#ff6384', '#ff8e72'];

    $scope.init=function(){
      console.log("init");
      iot.connect();
      console.log("doughnot",$scope.doughnot.data);
    }

    $scope.$on("iotDeviceEvent",function(event,args){
      //console.log("deviceevent!",args);

      if (args.deviceId=="121212"){


        if ($scope.line.data[0].length==6){
          $scope.line.data[0].shift();

        }
       
        
      $scope.line.data[0].push(args.payload.d.acceleration_x);
      $scope.$digest();
//console.log($scope.line.data[0]);
      }
    })
   
  })





;