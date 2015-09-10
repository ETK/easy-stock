'use strict';

describe('Directive: stockView', function () {

  // load the directive's module and view
  beforeEach(module('easyStockApp'));
  beforeEach(module('app/stock-view/stock-view.html'));

  var scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function () {

  }));
});
