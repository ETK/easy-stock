'use strict';

angular.module('easyStockApp')
  .service('Stocks', function ($resource) {
    return $resource('api/stocks/:id', {}, {
      'query': {method: 'GET', isArray: true},
      'get': {method: 'GET'},
      'remove': {method: 'DELETE'},
      'search': {
        method: 'POST',
        url: 'api/stocks/search/',
        transformResponse: function (data) {
          var escapeDataFields = ['symbol', 'date', 'volume'];
          data = angular.fromJson(data);
          console.log(data[0]);
          console.log(data[1]);
          var response = {};
          response.series = Object.keys(data[0]).filter(function (value) {
            if (escapeDataFields.indexOf(value) === -1) return value;
          });
          response.labels = [];
          response.data = [];


          angular.forEach(response.series, function (key) {
            var ligne = [];
            angular.forEach(data, function (quote) {
              ligne.push(quote[key].toFixed(0));
              if(response.labels.indexOf(quote.date) === -1){
                response.labels.push(quote.date.toLocaleString())
              }
            });
            response.data.push(ligne);
          });
          return response;
        }
      }
    });
  });
