
angular
    .module('RDash')
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

 