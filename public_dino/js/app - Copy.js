angular.module('iotapp', [
	'ionic',
	'chart.js',
	'ngAnimate',
	'ngMaterial',
	'ngMdIcons'
])

  .factory("globals", function ($ionicLoading) {
    var globalsService = {};

   //globalsService.rooturl = "http://localhost:3000";
	//globalsService.rooturl = "http://iotindustry40.mybluemix.net";
	globalsService.rooturl = "http://9.71.212.149:3000";

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


  .factory("ChartService", function () {
    var chartService = {};

    chartService.defaultoptions = {
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
          },
          'menuRight': {
            templateUrl: "templates/menu.html"
          }

        }
      })
      .state('app.dash', {
        url: "/dash",
        views: {
          'menuContent': {
            templateUrl: "templates/dashboard.html",
            controller: "DashCtrl"
          },
          'menuRight': {
            templateUrl: "templates/menuright_dash.html",
            controller: "DashCtrl"
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

  .controller('AppCtrl', function ($scope, socket, $ionicSideMenuDelegate) {
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
    $scope.toggleRight = function () {
      $ionicSideMenuDelegate.toggleRight();
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

  .controller('HomeCtrl', function ($scope, $state) {
    //var iot;

    /*$scope.main = {
      EventLog: iot.EventLog
    }*/

    /*$scope.iotconnect = function () {
      console.log("connecting");
      iot.connect(function () {
        console.log("connected to iot !!");
        $state.go("app.dash");
      });
    }*/


  })
  
 
.controller("LoadFromMaximoCtrl", function ($timeout, $scope, dbs, wfe, ChartService, globals, backend, $ionicLoading) {
	

	$scope.loadContent = function () {
	
		$scope.tasks = [];
		$scope.spareparts = [];

		globals.loadingShow();
		dbs.get("tasks", function (data) {
    
			console.log("tasks", data);

			$timeout(function () {
				console.log(data.rows);
				$scope.tasks = data.rows;
				globals.LoadingHide();
			});

		})
	

	}
	
})
  
  .controller("SwitchPeriodCtrl", function ($timeout, $scope, dbs, ChartService, globals, backend, $ionicLoading) {
	$scope.intervall = {
		period1: true,
		period2: false,
		period3: false
	};
	$scope.onChange = function(cbState,periodo) {
		if(periodo=="day"){
			$scope.messagetimeframe = "Day"
			$scope.intervall = {
				period1: true,
				period2: false,
				period3: false
			}
		}
		if(periodo=="month"){
			$scope.messagetimeframe = "Month"
			$scope.intervall = {
				period1: false,
				period2: true,
				period3: false
			}
		} 
		if(periodo=="year"){
			$scope.messagetimeframe = "Year"
			$scope.intervall = {
				period1: false,
				period2: false,
				period3: true
			}
		} 
	}	  
  })
  
  .controller("DashCtrl", function ($timeout, $scope, dbs, ChartService, globals, backend, $ionicLoading) {

    var chartservice = ChartService;

    $scope.gauges=[1,2,3,4,5,6,7,8]  
		
	 $scope.showtimeframe = function (frame) {
		 if(frame=='Day'){
			 $scope.messagetimeframe = frame + " DAY "
			$scope.timeframes = [
				{   period: "Day",  checked: true  },
				{   period: "Month", checked: false},
				{   period: "Year", checked: false }
			]; 
		 }
		 if(frame=='Month'){
			 $scope.messagetimeframe = frame + " MONTH "
			$scope.timeframes = [
				{   period: "Day",  checked: false },
				{   period: "Month", checked: true},
				{   period: "Year", checked: false }
			]; 
		 }
		 if(frame=='Year'){
			 $scope.messagetimeframe = frame + " YEAR "
			$scope.timeframes = [
				{   period: "Day",  checked: false  },
				{   period: "Month", checked: false},
				{   period: "Year", checked: true }
			]; 
		 }		 
	 }	
	
    $scope.dashboard = {
      timeframe: "Day",
      activeriquadro: 0,
    }

    $scope.setDash=function(idx){
      console.log("setDash",idx);
      $scope.dashboard.activeriquadro=idx;
	  if(idx=="3"){
		$scope.tasks = [];
		$scope.spareparts = [];

		globals.loadingShow();
		dbs.get("tasks", function (data) {
    
			console.log("tasks", data);

			$timeout(function () {
				console.log(data.rows);
				$scope.tasks = data.rows;
				globals.LoadingHide();
			});

		})
		  
	  }
	  
      //$scope.$digest();

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
      descr: ""
    }

    $scope.linecampo = "True_duration";
    $scope.line2campo = "acceleration_x";

    $scope.eventlog = [];
    $scope.eventlog2 = [];
    $scope.linedata = [
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    ];
    $scope.linelabels = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

    $scope.phases = companydescr;
    console.log("phases", $scope.phases);

    $scope.prodoutput = 100;
    $scope.totoutput = 800;

    $scope.dohnutdata = [65, 59, 80, 81, 56, 55, 40];

    $scope.pie = chartservice.pie();

    var line2data = [];
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
        line2data,
        line2databis
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
      data: [85, 15]
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
          maxFontSize: 256,
        }
      }


    }

    $scope.gauge = chartservice.doughnot({
      labels: ["a", "b"],
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
      responsive: true,
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

    //$scope.colors = ['#45b7cd', '#ff6384', '#ff8e72'];
    $scope.colors = ["green", "red", "yellow", "orange", "blue"];

    $scope.numevents = 0;
    $scope.buffersize = 10;
    $scope.buffersteps = 1;
    $scope.buffercount = 0;
    $scope.buffer = [];
    $scope.simulstatus = false;

    $scope.init = function () {
      //iot.connect();
      console.log("dounot", $scope.doughnot.data);
      backend.get(globals.rooturl+"/simulation/getsimulstatus", function (data) {
        $timeout(function () {
          $scope.simulstatus = data.simulstatus;
          console.log($scope.simulstatus);

        })

      })
      return;
      $scope.getOperationShutdownTime();
      $scope.getProductionOutputWithTarget();
      $scope.getProductionDefectCount();
      $scope.getEquipmentAnomalyCount();

      //createBubbleChart();
    }

    $scope.selectMachine = function (machine) {
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
    }


    $scope.getOperationShutdownTime = function () {
      backend.get("/dashboard/operationshutdowntime", function (data) {
        console.log("operationshutdowntime", data)


        /* $scope.pie2 = chartservice.pie();*/
        /*$scope.linedata=[
         [1,4,34,55,66,77,666,55]
        ];*/


        /*$scope.linelabels = [];
        $scope.linedata = [];
        var arr = [];
        var th = data.true_duration_time_hist;
        th.forEach(function (item, idx) {
          if (idx<10) $scope.linelabels.push("")
          if (idx<10) arr.push(item);


        })
       $scope.linedata[0] = arr;*/

        /*
          $scope.linelabels=[];
            $scope.linedata = [[15, 23, 45, 67]];
            for (var i=0; i<60; i++){
              $scope.linelabels.push("")
            }*/
        // $scope.linelabels=["a","b","c","d","e","e","e"]
        var lab = []

        //   $scope.linelabels=$scope.linedata;

        //$scope.linelabels.push(lab);


        // Configure only this instance
        $scope.lineoptions = {
          legend: {
            display: false
          }
        };

        var options = chartservice.defaultoptions;
        //console.log("options",options);



        var prodperc = parseInt(data.production / data.total * 100.10);
        var stopperc = parseInt(data.stop / data.total * 100, 10);
        var waitperc = parseInt(data.wait / data.total * 100);

        $scope.pie2 = chartservice.pie({
          labels: ["Production", "Stop", "Wait"],
          series: ["Production", "Stop", "Wait"],


          data: [prodperc, stopperc, waitperc],
          options: options
        })



      })
    }
    $scope.getProductionOutputWithTarget = function () {
      backend.get("/dashboard/productionoutputwithtarget", function (data) {
        console.log("productionooutpuwithtarget", data);
        $scope.prodoutput = data.paker1;
      });
    }
    $scope.getProductionDefectCount = function () {
      backend.get("/dashboard/productdefectcount", function (data) {
        console.log("productdefectcount", data);
        $scope.defectbar = chartservice.bars({
          labels: [""],
          series: ['Packer', 'Maker'],
          data: [
            [data.paker],
            [data.maker]


          ]

        });
        /*$scope.defectbar.options = {
          responsive: true,
          scales: {
            xAxes: [{
              stacked: false,
              barThickness: 80
            }],
            yAxes: [{
              stacked: true
            }]
          }
        }*/


      });
    }

    $scope.getEquipmentAnomalyCount = function () {
      backend.get("/dashboard/equipmentanomalycount", function (data) {
        console.log("equipmentanomalycount", data);
        $scope.equipmentanomaly = chartservice.bars({
          labels: [""],
          series: ['Maker'],
          data: [
            [data.maker]


          ]

        });
      });
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

      var field = args.field;
      var td = args.events[0];




      $scope.linedata[0].shift();
      $scope.lineseries = [field]; //$scope.linecampo;
      if ($scope.eventlog.length >= 20) $scope.eventlog.shift();
      $scope.eventlog.push(field + " - " + td);


      /* $timeout(function () {*/
      $scope.linedata[0].push(td);
      $scope.$digest();
    }

    $scope.$on("iotbuffer", function (event, args) {
      var events = args.events;
      var iotindex = args.iotindex;



      //console.log("iotindex",iotindex);

      var labels = [];
      var arr = [];
      console.log("iotbuffer received from socket server", args);
      if (iotindex == 2) {
        $scope.populateHealthy(args);
        return;

      }
      //return;
      var count = 0;
      events.forEach(function (item, idx) {
        count++;

        /*labels.push(count)item
        arr.push(item);*/

        $scope.line2.data[iotindex].shift();
        $scope.line2.data[iotindex].push(item);
        $scope.line2.series[iotindex] = args.field;

        //$scope.line2.labels[iotindex]=args.field;

        var evstring = args.field + ": " + item;
        if ($scope.eventlog2.length >= 20) $scope.eventlog2.shift();
        $scope.eventlog2.push(evstring);



      })
      $scope.$digest();



    })


    $scope.$on("dashdata", function (event, args) {
      console.log("dashdata received from socket server", event, args);
      var op = args.operation;
      var data = args.data;
      var simulindex = args.simulation_index;
      //console.log("operation", op);
      if (op == "operationshutdowntime") {
        //console.log("operationshutdowntime", data)


        /* $scope.pie2 = chartservice.pie();*/
        /*$scope.linedata=[
         [1,4,34,55,66,77,666,55]
        ];*/
        /* $scope.linelabels = [];
         $scope.linedata = [];
         var arr = [];
         var th = data.true_duration_time_hist;
         th.forEach(function (item, idx) {
           if (idx<10) $scope.linelabels.push("")
           if (idx<10) arr.push(item);


         })
         $scope.linedata[0] = arr;*/

        /*
          $scope.linelabels=[];
            $scope.linedata = [[15, 23, 45, 67]];
            for (var i=0; i<60; i++){
              $scope.linelabels.push("")
            }*/
        // $scope.linelabels=["a","b","c","d","e","e","e"]
        var lab = []

        //   $scope.linelabels=$scope.linedata;

        //$scope.linelabels.push(lab);


        // Configure only this instance
        $scope.lineoptions = {
          legend: {
            display: false
          }
        };

        var options = chartservice.defaultoptions;
        //console.log("options",options);



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
        //console.log("productdefectcount", data);
        $timeout(function () {
          $scope.defectbar = chartservice.bars({
            labels: [""],
            series: ['Packer', 'Maker'],
            data: [
              [data.paker],
              [data.maker]


            ]

          });

        })




      }


      if (op == "equipmentanomalycount") {
        //console.log("equipmentanomalycount", data);
        $timeout(function () {
          $scope.equipmentanomaly = chartservice.bars({
            labels: [""],
            series: ['Maker'],
            data: [
              [data.maker]


            ]

          });

        })

      }


      if (op == "filesimulation") {

        //console.log("simulindex", simulindex, "data", data);
        //$scope.simulstatus = true;
        if (simulindex == 0) {
          var field = "True_duration";
          var td = data[field];




          $scope.linedata[0].shift();
          $scope.lineseries = [field]; //$scope.linecampo;
          if ($scope.eventlog.length >= 20) $scope.eventlog.shift();
          $scope.eventlog.push(field + " - " + td);


          /* $timeout(function () {*/
          $scope.linedata[0].push(td);

          //console.log($scope.linedata[0]);

          // });
        }


        if (simulindex == 1) {
          var field = "Paker_64";
          var td = data[field];
          //console.log(td);




          $scope.line2.data[0].shift();
          $scope.line2.series = field; //$scope.linecampo;
          if ($scope.eventlog2.length >= 20) $scope.eventlog2.shift();
          $scope.eventlog2.push(field + " - " + td);


          /*$timeout(function () {*/
          $scope.line2.data[0].push(td);
          //console.log($scope.linedata[0]);

          // });
        }

        $scope.$digest();


      }
    })





    $scope.toggleCsvSimulation = function () {
      backend.get("/simulation/setsimul/toggle", function (data) {
        console.log(data);
        $scope.simulstatus = data.simulstatus;
        console.log($scope.simulstatus);
        var newstate = "ON";
        if ($scope.simulstatus == false) newstate = "OFF";
        $ionicLoading.show({
          template: 'CSV simulation has been turned ' + newstate,
          noBackdrop: true,
          duration: 2000
        });
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





;