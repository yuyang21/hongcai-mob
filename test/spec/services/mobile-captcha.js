'use strict';

describe('Service: mobileCaptcha', function () {

  // load the service's module
  beforeEach(module('p2pSiteMobApp'));

  // instantiate service
  var mobileCaptcha;
  beforeEach(inject(function (_mobileCaptcha_) {
    mobileCaptcha = _mobileCaptcha_;
  }));

  it('should do something', function () {
    expect(!!mobileCaptcha).toBe(true);
  });

});
