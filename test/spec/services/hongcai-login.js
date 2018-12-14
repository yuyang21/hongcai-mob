'use strict';

describe('Service: hongcaiLogin', function () {

  // load the service's module
  beforeEach(module('p2pSiteMobApp'));

  // instantiate service
  var hongcaiLogin;
  beforeEach(inject(function (_hongcaiLogin_) {
    hongcaiLogin = _hongcaiLogin_;
  }));

  it('should do something', function () {
    expect(!!hongcaiLogin).toBe(true);
  });

});
