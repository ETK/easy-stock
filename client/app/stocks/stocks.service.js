'use strict';

angular.module('easyStockApp')
  .service('Stocks', function ($resource) {
    return $resource('api/stocks/:id', {}, {
      'query': {method: 'GET', isArray: true},
      'save': {method: 'POST'},
      'get': {
        method: 'GET'
      },
      'remove': {method: 'DELETE'},
      'getSnapshot': {
        method: 'GET',
        url: 'api/stocks/snapshot/:id'
      },
      'getChart': {
        method: 'POST',
        url: 'api/stocks/search/',
        transformResponse: function (data) {
          var escapeDataFields = ['symbol', 'date', 'volume'];
          data = angular.fromJson(data);
          var response = {};
          response.series = Object.keys(data[0]).filter(function (value) {
            if (escapeDataFields.indexOf(value) === -1) {
              return value;
            }
          });
          response.labels = [];
          response.data = [];
          response.volumes = [];
          var temp = [];
          angular.forEach(data, function (quote) {
            temp.push(quote.volume);
          });
          response.volumes.push(temp);
          angular.forEach(response.series, function (key) {
            var ligne = [];
            angular.forEach(data, function (quote) {
              ligne.push(quote[key]);
              var date = quote.date.toString().substr(0, 10);
              if (response.labels.indexOf(date) === -1) {
                response.labels.push(date);
              }
            });
            response.data.push(ligne);
          });
          return response;
        }
      }
    });
  });
