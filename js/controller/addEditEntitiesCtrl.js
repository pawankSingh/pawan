/**
 * Created by pawankumarsingh on 12/2/15.
 */


app.controller('addEditEntitiesCtrl', ['$scope', '$rootScope', '$http', '$location', '$window','$routeParams', function ($scope, $rootScope, $http, $location, $window,$routeParams ) {
    $scope.entityFields = [];
//    $scope.data_types = ["string", "integer", "number", "array", "object", "datetime", "reference", "relation", "function", "file", "geo", "custom"];
    $scope.data_types = ["string", "integer", "number", "select", "date", "textarea", "file" ,"radio"];
    $scope.pushFields = function (entity) {
        $scope.entityFields.push(entity);
        $scope.data = {
            FieldName:'',
            fieldtype:''
        };
    };
    $scope.data.options = [];
    $scope.pushOptions = function(option){

    };
    $scope.deleteFields = function (field) {
        var index = $scope.entityFields.indexOf(field);
        if (index > -1) {
            $scope.entityFields.splice(index, 1);
        }
    };
    $scope.getEntity = function (){
        $http.get('/entity/get').success(function (data) {
            if (data) {
                $scope.EntityFields = data;
            }
        });
    };
    $scope.submit = function () {

        if ($scope.data.FieldName) {
            var field = {
                FieldName: $scope.data.FieldName,
                fieldtype: $scope.data.fieldtype
            };
            $scope.entityFields.push(field);
        }
        var  entity ={
            name:$scope.data.entityName ,
            fields :$scope.entityFields
        };
         $http.post('/entity/_add', {data: entity}).success(function (data) {
         if (data) {
         $scope.getEntity();
         $scope.showEntityForm = false;
         $scope.data ={};
         }
         });
    };
    $scope.getEntity();
    $scope.addEntity = function(){
        $scope.showEntityForm = true;
        $scope.data ={};
    };
    $scope.editEntity = function(entity){
        $scope.showEntityForm = true;
        $scope.data.entityName = entity.name;
        $scope.entityFields =entity.fields;
       /* $http.get('/entity/get/'+entityname._id).success(function (data) {
            console.log(data);
            if (data) {
                $scope.categories = data;
            }
        });*/
    };
    $scope.deleteEntity = function(entity){
        $http.delete('/del/entity/'+entity).success(function(res){
            if(res){
                $scope.getEntity();
            }
        });
    }
}]);