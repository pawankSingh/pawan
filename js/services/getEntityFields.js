/**
 * Created by pawankumarsingh on 21/3/15.
 */

app.service('getEntityFields', [ '$http', function ($http) {
    var self = this;
    self.getEntityFiled = function (entity) {
        console.log('inside function===============');
        $http.get('/entity/fields/'+entity).success(function(fields) {
            console.log('=====================',fields);
            return fields;
        }, function (error) {
            $scope.error = error;
        });
    }
}]);

