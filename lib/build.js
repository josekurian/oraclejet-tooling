/**
  Copyright (c) 2015, 2020, Oracle and/or its affiliates.
  Licensed under The Universal Permissive License (UPL), Version 1.0
  as shown at https://oss.oracle.com/licenses/upl/

*/
'use strict';

const buildWeb = require('./buildWeb');
const buildHybrid = require('./buildHybrid');
const buildComponent = require('./buildComponent');
const valid = require('./validations');
const config = require('./config');
const util = require('./util');
const path = require('path');

/**
* # API
* ## ojet.build([platform],[options])
* @public
* @param {string} [platform='web']           - Platform, defaults to 'web'
* @param {Object} [options]                  - Options object
* @param {string} [options.buildType]        - buildType 'dev' or 'release'
* @param {string} [options.theme]            - Theme, default to alta:platform
* @param {Array} [options.themes]            - Themes, default to first theme in the array
* @param {boolean} [options.sassCompile]     - Whether to compile sass
* @param {string} [options.destination='emulator'] -Cordova build flag --emulator or --device
* @param {string} [options.buildConfig]      - Path to build configuration file
* @param {boolean} [options.buildForServe]   - Whether to invoke build just for Serve
* @param {string} [options.setDefaultConfig] - String path to default json file
* @param {string} [options.staingPath]       - Path to the staging directory
* @param {object} [options.inject]           - Object for inject task configuration
* @param {object} [options.terser]           - Object for terser task configuration
* @param {object} [options.copyToRelase]     - Object for copyToRelease task configuration
* @param {object} [options.requireJs]        - Object for requireJs task configuration
* @param {object} [options.sass]             - Object for sass task configuration
* @returns {Promise}
*/
module.exports = function build(platform, options) {
  let platformOption = platform;
  if (Object.prototype.hasOwnProperty.call(options, 'component')) {
    platformOption = 'web';
  }
  config.loadOraclejetConfig(platformOption);
  if (Object.prototype.hasOwnProperty.call(options, 'component')) {
    // Force component builds
    config.set('platform', 'web');
  }
  const validPlatform = valid.platform(platformOption);
  const validOptions = valid.buildOptions(options, validPlatform);
  const validBuildType = valid.buildType(validOptions);
  if (Object.prototype.hasOwnProperty.call(options, 'component')) {
    // Check for invalid use of path separators.
    // Recommend using ojet build if the user has tried to build an individual pack component.
    const [pack, component] = path.normalize(options.component).split(path.sep);
    if (pack && component) {
      if (util.isWebComponent({ pack, component })) {
        util.log.error('Builds of individual pack components are not supported. Please use ojet build instead.');
      } else {
        util.log.error(`Invalid syntax for component - path separators (${path.sep}) are not supported.`);
      }
    }
    return buildComponent(options.component, validOptions);
  }
  config.set('platform', validPlatform);
  if (platform === 'web') {
    return buildWeb(validBuildType, validOptions);
  }
  return buildHybrid(validBuildType, validPlatform, validOptions);
};
