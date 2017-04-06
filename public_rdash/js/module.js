angular.module('RDash', ['ui.bootstrap', 'ui.router', 'ngCookies','chart.js'])



    .factory("globals", function () {
        var globalsService = {};


        globalsService.rooturl = "http://localhost:3000";
        //globalsService.rooturl = "http://iotindustry40.mybluemix.net";
        //globalsService.rooturl = "http://9.71.213.181:3000";



        return globalsService;

    })