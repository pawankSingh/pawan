/**
 * Created by pawankumarsingh on 14/2/15.
 */

app.directive('fileUpload', function () {

    return {
        restrict: 'E',
        replace: true,
        transclude: true,
        link: function ($scope, $elem, $attr) {
            $scope.selectedFileName = '';
            $scope.fileNameChanged = function (element) {
                $scope.file = element.files[0];
                $scope.$apply(function () {
                    $scope.uploadSuccess="";
                    $scope.uploadSuccessHtml="";
                    $scope.uploadError="";
                    $scope.uploadErrorHtml="";
                    if ($scope.file && $scope.file.name) {
                        $scope.selectedFileName = $scope.file.name;
                    } else {
                        $scope.selectedFileName = '';
                    }
                });
            };
        }
    };
});

app.directive('multiSelect', [
    '$parse',
    '$timeout',

    function ($parse,$timeout) {
        return function ($scope, element, attrs) {

            $scope.items= [];
            $scope.selectedItems = $scope.items.length > 0 ? $scope.items :'Select Items';
            $scope.selectdisselect = function(selitem){
                var index = $scope.items.indexOf(selitem);
                if(index > -1){
                    $scope.items.splice(index, 1);
                }else{
                    $scope.items.push(selitem)
                }
                $scope.selectedItems = $scope.items.length > 0 ? $scope.items :'Select Items';
            }
        }
    }
]);
app.directive('codeMirror', [function () {
    return {
        require: '?ngModel',
        link: function ($scope, elm, attr, model) {
            var minLines = 20;
            var startingValue = '';
            for (var i = 1; i < minLines; i++) {
                startingValue += '\n';
            }
            var editor = CodeMirror.fromTextArea(document.getElementById("demotext"), {
                lineNumbers: true,
                mode: "text/html",
                tabSize: 8,
                matchBrackets: true,
                gutter: true,
                lineWrapping: true

            });

            editor.setValue(startingValue);

        }
    };
}]);



app.filter('remove_underscore', function() {
    return function(input) {
        return input.replace(/ /g,"_");
    };
});

app.directive('msFormHtmleditor', ['$timeout', function ($timeout) {
    return {
        link: function (scope, elm, attr) {
            var loadEditor = function () {
                var textarea = elm.find("textarea");
                var ngModel = textarea.data('$ngModelController');
                CKEDITOR.config.forcePasteAsPlainText = true;
                var ck = CKEDITOR.replace(textarea[0],
                    {
                        toolbar: [
                            { name: 'basicstyles', groups: [ 'basicstyles', 'cleanup' ], items: [ 'Bold', 'Italic', 'Strike', '-', 'RemoveFormat' ] },
                            { name: 'styles', items: [ 'Font', 'FontSize' ] },
                            { name: 'paragraph', groups: [ 'list', 'indent', 'blocks', 'align' ], items: [ 'NumberedList', 'BulletedList', '-', 'Outdent', 'Indent', '-', 'Blockquote', 'JustifyLeft', 'JustifyCenter', 'JustifyRight', 'JustifyBlock' ] },
                            { name: 'document', groups: [ 'mode', 'document', 'doctools' ], items: [ 'Source' ] }
                        ]
                    }
                );
                if (!ngModel) return;

                ck.on('instanceReady', function () {
                    ck.setData(ngModel.$viewValue);
                });

                ck.on('pasteState', function () {
                    if (!scope.$$phase) {
                        scope.$apply(function () {
                            ngModel.$setViewValue(ck.getData());
                        });
                    }
                });
                var updateModel = function () {
                    scope.$apply(function () {
                        ngModel.$setViewValue(ck.getData());
                    });
                }

                ck.on('change', updateModel);
                ck.on('key', updateModel);
                ck.on('dataReady', updateModel);
                ck.on('afterUndoImage', updateModel);

                ngModel.$render = function (value) {
                    ck.setData(ngModel.$viewValue);
                };
            }
            loadEditor();

        }
    };
}]);