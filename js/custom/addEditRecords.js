/**
 * Created by pawankumarsingh on 21/3/15.
 * this controller is used to add and edit record in custom entity
 */

app.controller('addEditrecordCtrl', ['$scope' , '$rootScope' , '$location'  , '$routeParams', '$http', 'getEntityFields' , function ($scope, $rootScope, $location, $routeParams, $http, getEntityFields) {
    $scope.entityname = $routeParams.entityname;
    $scope.showRecords =true;
    $http.get('/entity/fields/' + $scope.entityname).success(function (fields) {
        $scope.fields = fields;

    }, function (error) {
        $scope.error = error;
    });
    $scope.addRecord = function () {
        console.log($scope.data);
        $http.post('/entity/entityRecord', {data: $scope.data, entityName: $scope.entityname }).success(function (res) {
            $scope.getRecord();
            $scope.data= {};
            $scope.showRecords =true;
        });
    };
    $scope.getRecord = function () {
        $scope.loader =true;
        $http.get('/entity/getRecords/' + $scope.entityname).success(function (response) {
            $scope.response = response;
            $scope.loader =false;
        })
    };

    $scope.deleteRecord = function (id) {
        $http.delete('/entity/deleteRecords/'+$scope.entityname+'/'+id).success(function (response) {
            $scope.response = response;
            $scope.getRecord();
        })
    };
    $scope.addNew = function(){
        $scope.showRecords =false;
    };
    $scope.getRecord();
}]);
/*app.directive("loadMore",['$window','$location', function ($window, $location ) {
    console.log('================')
    return function(scope, element, attrs) {

        return {
            restrict: "EA",
            replace: true,
            scope: {model:'='},

            link: function (scope, element, attrs) {
                var scrollHeight = 350 ;
                var yLeftToGo = angular.element(document.getElementById('body'))[0].offsetHeight - (this.pageYOffset + this.innerHeight);
                if (yLeftToGo < scrollHeight) {
                    scope.model[limit] = 20;
                    scope.$apply();                }

            }


        };

    };
}]);*/
