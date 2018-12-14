'use strict';

describe('Controller: ProjectListCtrl', function () {

  // load the controller's module
  beforeEach(module('p2pSiteMobApp'));

  var ProjectListCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    ProjectListCtrl = $controller('ProjectListCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
