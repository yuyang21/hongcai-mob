'use strict';

describe('Controller: FundsProjectDetailCtrl', function () {

  // load the controller's module
  beforeEach(module('p2pSiteMobApp'));

  var FundsProjectDetailCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    FundsProjectDetailCtrl = $controller('FundsProjectDetailCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
