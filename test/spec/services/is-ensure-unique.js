'use strict';

describe('Service: isEnsureUnique', function () {

  // load the service's module
  beforeEach(module('p2pSiteMobApp'));

  // instantiate service
  var isEnsureUnique;
  beforeEach(inject(function (_isEnsureUnique_) {
    isEnsureUnique = _isEnsureUnique_;
  }));

  it('should do something', function () {
    expect(!!isEnsureUnique).toBe(true);
  });

});
