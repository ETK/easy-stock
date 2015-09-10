'use strict';

var mongoose = require('bluebird').promisifyAll(require('mongoose'));
var Schema = mongoose.Schema;
var yahooFinance = require('yahoo-finance');
var _ = require('lodash');

var StockSchema = new Schema({
  symbol: String,
  buyPrice: Number,
  buyNumber: Number,
  transactPrice: Number,
  unitPrice: Number,
  unitPriceSell: Number
});

StockSchema.pre('save', function (next) {
  var self = this;
  self.transactPrice = self.buyNumber * self.buyPrice * 0.0025;
  self.unitPrice = (self.buyNumber * self.buyPrice + self.transactPrice) / self.buyNumber;
  self.unitPriceSell = (self.buyNumber * self.buyPrice + (self.transactPrice * 2)) / self.buyNumber;
  next();
});
var displayField = ['symbol','lastTradePriceOnly', 'previousClose', 'epsEstimateNextQuarter', 'buyPrice', 'buyNumber', 'transactPrice', 'unitPrice', 'unitPriceSell'];
var cleanObj = function (obj, display) {
  _.forEach(Object.keys(obj), function (key) {
    if (display.indexOf(key) === -1) {
      delete obj[key];
    }
  });
  return obj;
};
StockSchema.statics.getSnapshot = function (symbol, cb) {
  this.findOne({symbol: symbol}, function (err, stock) {
    yahooFinance.snapshot({
      symbol: symbol
    }, function (err, snapshot) {
      var merge;
      if(stock && snapshot){
        merge = _.merge(snapshot, stock._doc);
        _.forOwn(merge, function (val, key) {
          if (!val || _.isObject(val)) {
            delete snapshot[key];
          }
        });
      }else if (!stock) {
        merge = snapshot;
      }
      return cb(err, cleanObj(merge, displayField));
    });
  });
};

StockSchema.statics.getSnapshots = function (cb) {
  this.find({}, function (err, stocks) {
    yahooFinance.snapshot({
      symbols: _.map(stocks, function (stock) {
        return stock.symbol;
      })
    }, function (err, snapshots) {
      var response = [];
      _.forEach(stocks, function(stock){
        _.forEach(snapshots, function(snapshot){
          if(stock.symbol === snapshot.symbol){
            var merge = _.assign(stock._doc, snapshot);
            _.forOwn(merge, function (val, key) {
              if (!val || _.isObject(val)) {
                delete snapshot[key];
              }
            });
            response.push(cleanObj(merge,displayField));
          }
        })
      });
      return cb(err, response);
    });
  });
};


module.exports = mongoose.model('Stock', StockSchema);
