'use strict';

angular.module('easyStockApp')
  .controller('SearchCtrl', function (Stocks) {
    var vm = this;
    vm.maxDate = new Date();
    vm.quotes = [];
    vm.quote = {};

    vm.getQuote = function (symbol, date) {
      delete vm.quotes;
      delete vm.quote;
      Stocks.getSnapshot({id: symbol},
        function (quote) {
          vm.quote = quote;
        });
      Stocks.getChart({
          symbol: symbol,
          from: date.startDate,
          to: date.endDate
        },
        function (quotes) {
          vm.quotes = quotes;
        })
    }
  });
