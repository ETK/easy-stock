'use strict';

angular.module('easyStockApp')
  .directive('stockView', function () {
    return {
      templateUrl: 'app/stock-view/stock-view.html',
      restrict: 'EA',
      link: function (scope, element, attrs) {
      }
    };
  });
