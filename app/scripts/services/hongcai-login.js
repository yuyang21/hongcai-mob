'use strict';

/**
 * @ngdoc service
 * @name p2pSiteMobApp.hongcaiLogin
 * @description
 * # hongcaiLogin
 * Service in the p2pSiteMobApp.
 */
angular.module('p2pSiteMobApp')
  .service('HongcaiLogin', function (restmod, DEFAULT_DOMAIN) {
    // AngularJS will instantiate a singleton by calling "new" on this function
    return {
      userLogin : restmod.model(DEFAULT_DOMAIN + '/users/login'),
      mobileLogin : restmod.model(DEFAULT_DOMAIN + '/users/mobileLogin')
    };
  });
