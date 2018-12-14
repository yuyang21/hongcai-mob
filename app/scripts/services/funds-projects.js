'use strict';

/**
 * @ngdoc service
 * @name p2pSiteMobApp.fundsProjects
 * @description
 * # fundsProjects
 * Service in the p2pSiteMobApp.
 */
angular.module('p2pSiteMobApp')
  .service('fundsProjects', function (Restangular) {
    // AngularJS will instantiate a singleton by calling "new" on this function
    return Restangular.one('/fundsProjects');
  });
