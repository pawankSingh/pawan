/**
 * Created by pawankumarsingh on 15/3/15.
 */
var app = angular.module('App', ['ngRoute']);

app.controller('userCtrl', ['$scope' , '$rootScope' , '$http', function ($scope, $rootScope, $http) {
    $scope.showForm = false;
    $scope.data = {};
    $scope.showUserForm = function(){
        $scope.showForm = true;

    };
    $scope.addUser = function () {

        $http.post('/user/addusers', {data: $scope.data}).success(function (data) {
            if (data) {
                $scope.getUser();

            }
        });
    };

    $scope.getUser = function () {
        $http.get('/user/getusers').success(function(data){
            $scope.showForm = false;
            $scope.users= data;
        })

    };

    $scope.deleteUser = function (id) {
      $http.delete('/user/removeusers/'+id).success(function(res){
         if(res){
             $scope.getUser();
         }
      });

    };
$scope.getUser();

}]);


