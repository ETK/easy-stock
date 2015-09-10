'use strict';

angular.module('easyStockApp')
  .controller('MainCtrl', function(Stocks) {
    var vm = this;
    vm.loadData = function () {
      Stocks.query({}, function (stocks) {
        vm.stocks = stocks;
      });
    };
    vm.loadData();
  });
