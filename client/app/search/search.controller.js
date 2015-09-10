'use strict';

angular.module('easyStockApp')
  .controller('SearchCtrl', function (Stocks, $stateParams, $state) {
    var vm = this;
    vm.maxDate = new Date();
    vm.quotes = [];
    vm.quote = {};
    vm.buy = {};

    vm.buyQuote = function (symbol, buy) {
      if (buy.buyNumber && buy.buyPrice) {
        Stocks.save({
          symbol: symbol,
          buyNumber: buy.buyNumber,
          buyPrice: buy.buyPrice
        }, function () {
          delete vm.buy;
        });
      }
    };

    vm.getQuote = function (symbol) {
      delete vm.quote;
      Stocks.get({id: symbol}, function (quote) {
        vm.quote = quote;
      }, function (err) {
        Stocks.getSnapshot({id: symbol},
          function (quote) {
            vm.quote = quote;
          });
      });
    };

    vm.getQuotes = function (symbol, date) {
      delete vm.quotes;
      if (date) {
        symbol = {
          symbol: symbol,
          from: date.startDate,
          to: date.endDate
        }
      }else{
        symbol = {
          symbol: symbol
        };
      }
      Stocks.getChart(symbol,
        function (quotes) {
          vm.quotes = quotes;
        })
    };


    vm.loadData = function (symbol, date) {
      $state.go('.', {symbol: symbol});
      vm.getQuotes(symbol, date);
      vm.getQuote(symbol);
    };

    if ($stateParams && $stateParams.symbol) {
      vm.symbol = $stateParams.symbol;
      vm.loadData($stateParams.symbol.toString(), null);
    }
  }
)
;
