'use strict';

describe('Service: fundsProjects', function () {

  // load the service's module
  beforeEach(module('p2pSiteMobApp'));

  // instantiate service
  var fundsProjects;
  beforeEach(inject(function (_fundsProjects_) {
    fundsProjects = _fundsProjects_;
  }));

  it('should do something', function () {
    expect(!!fundsProjects).toBe(true);
  });

});
