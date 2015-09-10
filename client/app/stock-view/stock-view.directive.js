'use strict';

angular.module('easyStockApp')
  .directive('stockView', function () {
    return {
      templateUrl: 'app/stock-view/stock-view.html',
      scope: {
        title: '=',
        data: '='
      },
      restrict: 'EA'
    };
  });
