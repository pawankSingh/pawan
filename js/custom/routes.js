/**
 * Created by pawankumarsingh on 15/3/15.
 */

app.config(['$routeProvider' ,'$locationProvider',function ($routeProvider,$locationProvider) {
    $routeProvider.
        when('/user', {
            templateUrl: 'template/users.html'
        }). when('/entity', {
            templateUrl: 'template/addEntities.html' ,
            controller :'addEditEntitiesCtrl'
        }). when('/entity/:entityname' , {
            templateUrl: 'template/entityFrom.html' ,
            controller :'addEditrecordCtrl'
        }).
        otherwise({
            redirectTo: '/'
        });

  /*  $locationProvider.html5Mode(
        enabled: true,
        requireBase: false
    });*/
}]);

