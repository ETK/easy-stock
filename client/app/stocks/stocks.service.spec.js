'use strict';

describe('Service: Stocks', function () {

  // load the service's module
  beforeEach(module('easyStockApp'));

  // instantiate service
  var Stocks;
  beforeEach(inject(function (_Stocks_) {
    Stocks = _Stocks_;
  }));

  it('should do something', function () {
    expect(!!Stocks).toBe(true);
  });

});
