/**
 * Created by izabela on 5/12/15.
 */
var financialapp =angular.module("FinancialService", []);

financialapp.factory('socket', ['$rootScope', function ($rootScope){
    var socket = io.connect('http://localhost:3000');
    console.log('Socket created');

    return {
        on: function (eventName, callback) {
            function wrapper() {
                var args = arguments;
                $rootScope.$apply(function () {
                    callback.apply(socket, args);
                });
            }

            socket.on(eventName, wrapper);

            return function () {
                socket.removeListener(eventName, wrapper);
            };
        },

        emit: function (eventName, data, callback) {
            socket.emit(eventName, data, function () {
                var args = arguments;
                $rootScope.$apply(function () {
                    if(callback) {
                        callback.apply(socket, args);
                    }
                });
            });
        }
    };


}]);


financialapp.controller('mainCtrl', function ($scope, socket){
    $scope.stocks = [];

    socket.on('dbChange', function (data) {
         debugger;
         if (data.symbol!=undefined){
             for (var i = 0; i<$scope.stocks.length; i++ ){
                 if ($scope.stocks[i].symbol===data.symbol){
                     $scope.stocks.splice(i, 1);
                 }
             }
         }

         $scope.stocks.push(data);

     });

})




























