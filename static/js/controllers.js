'use strict';

/* Controllers */

function IndexController($scope, GameService, AuthService) {
    $scope.requests = [];
    $scope.myRequest = null;
    $scope.timeValues = [];
    $scope.languages = [];
    $scope.loggedIn = true;
    $scope.a = "Qregqeg";

    $scope.getStatus = function () {
        AuthService.status().then(function (status) {
            $scope.loggedIn = status
        });
    };

    $scope.getRequests = function () {
        GameService.getRequests().then(function (requests) {
            $scope.requests = requests;
            requests.forEach(function (item, i, arr) {
                if (item.my == true)
                    $scope.myRequest = item;
            });
        });
    };

    $scope.getGameConfigs = function () {
        GameService.gameConfigs().then(function (configs) {
            $scope.timeValues = configs[0];
            $scope.languages = configs[1];
            $scope.language = $scope.languages[0];
            $scope.moveTime = $scope.timeValues[0];
        });
    };
    $scope.getStatus();
    $scope.getGameConfigs();
    $scope.getRequests();

    $scope.addRequest = function () {
        GameService.addRequest($scope.moveTime, $scope.language).then(function (request) {
            request.my = true;
            $scope.myRequest = request;
            $scope.requests.splice(0, 0, request);
        });
    };
    $scope.cencelRequest = function () {
        GameService.cencelRequest().then(function (result) {
            var index = -1;
            if (result) {
                for (var i = 0, len = $scope.requests.length; i < len; i++) {
                    if ($scope.requests[i].my == true) {
                        index = i;
                        break;
                    }
                }
                $scope.myRequest = null;
                $scope.requests.splice(index, 1);
            }
        })
    };
    $scope.applyRequest = function (player) {
        alert("dvg");
        GameService.applyRequest(player).then(function (result) {
            if (result) window.location = "/game";
        })
    };
}

function GameController($scope, GameService) {
    $scope.words = [
        [null, null, null, null, null],
        [null, null, null, null, null],
        [null, null, null, null, null],
        [null, null, null, null, null],
        [null, null, null, null, null]
    ];
}

function AuthController($scope, $location, AuthService) {

    $scope.getStatus = function () {
        AuthService.status().then(function (status) {
            $scope.loggedIn = status
        });
    };
    $scope.getStatus();
    $scope.login = function () {
        AuthService.login($scope.username, $scope.password).then(function (result) {
            if (result) {
                $scope.loggedIn = true;
                $scope.loginError = null;
                window.location = "/";
            }
            else {
                $scope.loggedIn = false;
                $scope.loginError = true;
            }
        });
    };

    $scope.register = function () {
        AuthService.register($scope.username, $scope.password).then(function (result) {
            if (result == true) {
                 window.location = "/"
            }
            else {
                $scope.registerError = result;
            }
        });
    };
    $scope.logout = function () {
        AuthService.logout().then(function (result) {
            if (result == "success") {
                $scope.loggedIn = false;
                window.location = "/"
            }
            else $scope.loggedIn = true;
        });
    };
}