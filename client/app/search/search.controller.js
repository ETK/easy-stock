'use strict';

angular.module('easyStockApp')
  .controller('SearchCtrl', function (Stocks, $log) {
    var vm = this;
    vm.maxDate = new Date();
    vm.quotes = [];

    vm.getQuote = function (symbol, date) {
      delete vm.quotes;
      Stocks.search({
          symbol: symbol,
          from: date.startDate,
          to: date.endDate
        },
        function (quotes) {
          $log.debug(quotes);
          vm.quotes = quotes;
        })
    }
  });
