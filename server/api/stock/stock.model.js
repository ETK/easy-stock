'use strict';

var mongoose = require('bluebird').promisifyAll(require('mongoose'));
var Schema = mongoose.Schema;

var StockSchema = new Schema({
    name: String,
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
  self.unitPriceSell = (self.buyNumber * self.buyPrice + (self.transactPrice*2)) / self.buyNumber;
  next();
});



module.exports = mongoose.model('Stock', StockSchema);
