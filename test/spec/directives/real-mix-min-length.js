'use strict';

describe('Directive: realMixMinLength', function () {

  // load the directive's module
  beforeEach(module('p2pSiteMobApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<real-mix-min-length></real-mix-min-length>');
    element = $compile(element)(scope);
    expect(element.text()).toBe('this is the realMixMinLength directive');
  }));
});
