/**
  Copyright (c) 2015, 2020, Oracle and/or its affiliates.
  Licensed under The Universal Permissive License (UPL), Version 1.0
  as shown at https://oss.oracle.com/licenses/upl/

*/
'use strict';

module.exports = {
  getInjectorTagsRegExp: function _getInjectorTagsRegExp(starttag, endtag) {
    const start = _escapeForRegExp(starttag);
    const end = _escapeForRegExp(endtag);
    const startNoSpace = _escapeForRegExp(starttag.replace(/\s/g, ''));
    const endNoSpace = _escapeForRegExp(endtag.replace(/\s/g, ''));
    return new RegExp(`([\t ]*)(${start}|${startNoSpace})((\\n|\\r|.)*?)(${end}|${endNoSpace})`, 'gi');
  }
};

function _escapeForRegExp(str) {
  return str.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&');
}
