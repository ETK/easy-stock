'use strict';

angular.module('easyStockApp')
  .controller('NavbarCtrl', function ($scope) {
    $scope.menu = [{
      'title': 'Home',
      'state': 'main'
    },{
      'title': 'Search',
      'state': 'search'
    }];

    $scope.isCollapsed = true;
  });
