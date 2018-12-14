'use strict';

describe('Controller: SafeCtrl', function () {

  // load the controller's module
  beforeEach(module('p2pSiteMobApp'));

  var SafeCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    SafeCtrl = $controller('SafeCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
