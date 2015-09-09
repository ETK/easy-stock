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

StockSchema.statics.getSnapshot = function (symbol, cb) {
  this.findOne({symbol: symbol}, function (err, stock) {
    yahooFinance.snapshot({
      symbol: symbol
    }, function (err, snapshot) {
      var merge = _.assign(snapshot, stock);
      return cb(err, merge);
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
      var index = 0;
      _.forEach(stocks, function(stock){
        _.forEach(snapshots, function(snapshot){
          if(stock.symbol === snapshot.symbol){
            var merge = _.assign(snapshot, stock);
            response.push(merge);
          }
        })
      });
      return cb(err, response);
    });
  });
};


module.exports = mongoose.model('Stock', StockSchema);
