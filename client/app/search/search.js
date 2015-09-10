'use strict';

angular.module('easyStockApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('search', {
        url: '/search?symbol',
        templateUrl: 'app/search/search.html',
        reloadOnSearch : false
      });
  });
