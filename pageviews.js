/**
 * @license
 * Copyright 2017 Thomas Steiner (@tomayac). All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0

 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

var request;

var USER_AGENT = 'pageviews.js';

// Dynamically adapt to the runtime environment
var environment = typeof window === 'undefined' ? 'node' : 'browser';
if (environment === 'node') {
  // Node.js
  request = require('request');
  var packageJson = require('./package.json');
  // The user agent to use
  USER_AGENT = 'pageviews.js-v' + packageJson.version + ' (' +
      packageJson.repository.url + ')';
} else {
  // Browser
  request = function(options, callback) {
    var xhr = new XMLHttpRequest();
    xhr.addEventListener('load', function() {
      return callback(null, {statusCode: this.status}, this.responseText);
    });
    xhr.addEventListener('error', function(e) {
      return callback(e);
    });
    xhr.open('GET', options.url);
    xhr.send();
  };
}

var pageviews = (function() {
  // The Pageviews base URL
  var BASE_URL = 'https://wikimedia.org/api/rest_v1';

  var _access = {
    default: 'all-access',
    allowed: ['all-access', 'desktop', 'mobile-web', 'mobile-app']
  };

  var _accessSite = {
    default: 'all-sites',
    allowed: ['all-sites', 'desktop-site', 'mobile-site']
  };

  var _agent = {
    default: 'all-agents',
    allowed: ['all-agents', 'user', 'spider', 'bot']
  };

  var _granularityAggregated = {
    default: 'hourly',
    allowed: ['daily', 'hourly', 'monthly']
  };

  var _granularityPerArticle = {
    default: 'daily',
    allowed: ['daily', 'monthly']
  };

  var _granularityUniques = {
    default: 'daily',
    allowed: ['daily', 'monthly']
  };

  /**
   * Checks the input parameters for validity.
   */
  var _checkParams = function(params, caller) {

    var pad = function(d) {
      return d < 10 ? '0' + d : d.toString();
    };

    if (!params) {
      return new Error('Required parameters missing.');
    }
    // Required: project or projects
    if ((!params.project) && (!params.projects)) {
      if (caller === 'getAggregatedPageviews' || caller === 'getTopPageviews') {
        return new Error('Required parameter "project" or "projects" missing.');
      } else {
        return new Error('Required parameter "project" missing.');
      }
    }
    if (params.project) {
      if ((params.project !== 'all-projects') &&
          (params.project !== 'wikidata') &&
          (params.project.indexOf('.') === -1)) {
        return new Error('Required parameter "project" invalid.');
      }
    }
    if ((caller === 'getAggregatedPageviews') ||
        (caller === 'getTopPageviews')) {
      if (params.projects && params.projects != 'all-projects') {
        if ((!Array.isArray(params.projects)) || (!params.projects.length) ||
            (params.projects.filter(function(project) {
              return project.indexOf('.') === -1 &&
                  project !== 'all-projects' &&
                  project !== 'wikidata';
            }).length)
        ) {
          return new Error('Required parameter "projects" invalid.');
        }
      }
    }
    // Required: article or articles
    if (caller === 'getPerArticlePageviews') {
      if ((!params.article) && (!params.articles)) {
        return new Error('Required parameter "article" or "articles" missing.');
      }
      if (params.articles) {
        if ((!Array.isArray(params.articles)) || (!params.articles.length)) {
          return new Error('Required parameter "articles" invalid.');
        }
      }
    }
    if (caller === 'getPerArticlePageviews' || caller === 'getUniqueDevices') {
      // Required: start
      if (!params.start) {
        return new Error('Required parameter "start" missing.');
      }
      params.start = typeof params.start === 'object' ?
          (params.start.getUTCFullYear() +
          (pad(params.start.getUTCMonth() + 1)) +
          (pad(params.start.getUTCDate()))) :
          params.start;
      if (!/^(?:19|20)\d\d[- /.]?(?:0[1-9]|1[012])[- /.]?(?:0[1-9]|[12][0-9]|3[01])$/.test(params.start)) {
        return new Error('Required parameter "start" invalid.');
      }
      // Required: end
      if (!params.end) {
        return new Error('Required parameter "end" missing.');
      }
      params.end = typeof params.end === 'object' ?
          (params.end.getUTCFullYear() + (pad(params.end.getUTCMonth() + 1)) +
              pad(params.end.getUTCDate())) :
          params.end;
      if (!/^(19|20)\d\d[- /.]?(0[1-9]|1[012])[- /.]?(0[1-9]|[12][0-9]|3[01])$/.test(params.end)) {
        return new Error('Required parameter "end" invalid.');
      }
    } else if (caller === 'getAggregatedPageviews') {
      // Required: start
      if (!params.start) {
        return new Error('Required parameter "start" missing.');
      }
      params.start = typeof params.start === 'object' ?
          (params.start.getUTCFullYear() +
          (pad(params.start.getUTCMonth() + 1)) +
          (pad(params.start.getUTCDate()) + pad(params.start.getUTCHours()))) :
          params.start;
      if (!/^(?:19|20)\d\d[- /.]?(?:0[1-9]|1[012])[- /.]?(?:0[1-9]|[12][0-9]|3[01])[- /.]?(?:[012][0-9])$/.test(params.start)) {
        return new Error('Required parameter "start" missing or invalid.');
      }
      // Required: end
      if (!params.end) {
        return new Error('Required parameter "end" missing.');
      }
      params.end = typeof params.end === 'object' ?
          (params.end.getUTCFullYear() + (pad(params.end.getUTCMonth() + 1)) +
              pad(params.end.getUTCDate()) + pad(params.end.getUTCHours())) :
          params.end;
      if (!/^(19|20)\d\d[- /.]?(0[1-9]|1[012])[- /.]?(0[1-9]|[12][0-9]|3[01])[- /.]?(?:[012][0-9])$/.test(params.end)) {
        return new Error('Required parameter "end" missing or invalid.');
      }
    }
    if (caller === 'getTopPageviews') {
      if (params.date) {
        params.date = typeof params.date === 'object' ?
            params.date :
            new Date(
                params.date.substr(0, 4) + '-' +
                params.date.substr(4, 2) + '-' +
                params.date.substr(6, 2));
        params.year = params.date.getUTCFullYear();
        params.month = pad(params.date.getUTCMonth() + 1);
        params.day = pad(params.date.getUTCDate());
      }
      // Required: year
      if ((!params.year) || (!/^(?:19|20)\d\d$/.test(params.year))) {
        return new Error('Required parameter "year" missing or invalid.');
      }
      // Required: month
      if ((!params.month) || (!/^(?:0?[1-9]|1[012])$/.test(params.month))) {
        return new Error('Required parameter "month" missing or invalid.');
      }
      // Required: day
      if ((!params.day) ||
          (!/^(?:0?[1-9]|[12][0-9]|3[01])$/.test(params.day))) {
        return new Error('Required parameter "day" missing or invalid.');
      }
      if ((params.limit) && !/^\d+$/.test(params.limit) &&
          (0 < params.limit) && (params.limit <= 1000)) {
        return new Error('Invalid optional parameter "limit".');
      }
    }
    // Optional: access
    if ((params.access) && (_access.allowed.indexOf(params.access) === -1)) {
      return new Error('Invalid optional parameter "access".');
    }
    // Optional: accessSite
    if ((params.accessSite) &&
        (_accessSite.allowed.indexOf(params.accessSite) === -1)) {
      return new Error('Invalid optional parameter "accessSite".');
    }
    // Optional: agent
    if ((params.agent) && (_agent.allowed.indexOf(params.agent) === -1)) {
      return new Error('Invalid optional parameter "agent".');
    }
    // Optional: granularity
    if (params.granularity) {
      if (caller === 'getAggregatedPageviews') {
        if (_granularityAggregated.allowed.indexOf(params.granularity) === -1) {
          return new Error('Invalid optional parameter "granularity".');
        }
      } else if (caller === 'getPerArticlePageviews') {
        if (_granularityPerArticle.allowed.indexOf(params.granularity) === -1) {
          return new Error('Invalid optional parameter "granularity".');
        }
      } else if (caller === 'getUniqueDevices') {
        if (_granularityUniques.allowed.indexOf(params.granularity) === -1) {
          return new Error('Invalid optional parameter "granularity".');
        }
      }
    }
    return params;
  };

  /**
   * Checks the results for validity, in case of success returns the parsed
   * data, else returns the error details.
   */
  var _checkResult = function(error, response, body) {
    var data;
    if (error || response.statusCode !== 200) {
      if (error) {
        return error;
      }
      if (response.statusCode === 404) {
        try {
          data = JSON.parse(body);
          return new Error(data.detail);
        } catch (e) {
          return new Error(e);
        }
      }
      return new Error('Status code ' + response.statusCode);
    }
    try {
      data = JSON.parse(body);
    } catch (e) {
      return new Error(e);
    }
    return data;
  };

  var _getPerArticlePageviews = function(params) {
    return new Promise(function(resolve, reject) {
      params = _checkParams(params, 'getPerArticlePageviews');
      if (params.stack) {
        return reject(params);
      }
      // Call yourself recursively in case of multiple articles
      if (params.articles) {
        var promises = [];
        params.articles.map(function(article, i) {
          var newParams = params;
          delete newParams.articles;
          newParams.article = article;
          promises[i] = _getPerArticlePageviews(newParams);
        });
        return resolve(Promise.all(promises));
      }
      // Required params
      var project = params.project;
      var article = encodeURIComponent(params.article.replace(/\s/g, '_'));
      var start = params.start;
      var end = params.end;
      // Optional params
      var access = params.access ? params.access : _access.default;
      var agent = params.agent ? params.agent : _agent.default;
      var granularity = params.granularity ?
          params.granularity : _granularityPerArticle.default;

      var options = {
        url: BASE_URL + '/metrics/pageviews/per-article' +
            '/' + project +
            '/' + access +
            '/' + agent +
            '/' + article +
            '/' + granularity +
            '/' + start +
            '/' + end,
        headers: {
          'User-Agent': USER_AGENT
        }
      };
      request(options, function(error, response, body) {
        var result = _checkResult(error, response, body);
        if (result.stack) {
          return reject(result);
        }
        return resolve(result);
      });
    });
  };

  var _getAggregatedPageviews = function(params) {
    return new Promise(function(resolve, reject) {
      params = _checkParams(params, 'getAggregatedPageviews');
      if (params.stack) {
        return reject(params);
      }
      if (params.projects === 'all-projects') {
        params.projects = null;
        params.project = 'all-projects';
      }
      // Call yourself recursively in case of multiple projects
      if (params.projects) {
        var promises = [];
        params.projects.map(function(project, i) {
          var newParams = params;
          delete newParams.projects;
          newParams.project = project;
          promises[i] = _getAggregatedPageviews(newParams);
        });
        return resolve(Promise.all(promises));
      }
      // Required params
      var project = params.project;
      var start = params.start;
      var end = params.end;
      // Optional params
      var access = params.access ? params.access : _access.default;
      var agent = params.agent ? params.agent : _agent.default;
      var granularity = params.granularity ?
          params.granularity : _granularityAggregated.default;
      var options = {
        url: BASE_URL + '/metrics/pageviews/aggregate' +
            '/' + project +
            '/' + access +
            '/' + agent +
            '/' + granularity +
            '/' + start +
            '/' + end,
        headers: {
          'User-Agent': USER_AGENT
        }
      };
      request(options, function(error, response, body) {
        var result = _checkResult(error, response, body);
        if (result.stack) {
          return reject(result);
        }
        return resolve(result);
      });
    });
  };

  var _getAggregatedLegacyPageviews = function(params) {
    return new Promise(function(resolve, reject) {
      params = _checkParams(params, 'getAggregatedLegacyPageviews');
      if (params.stack) {
        return reject(params);
      }
      if (params.projects === 'all-projects') {
        params.projects = null;
        params.project = 'all-projects';
      }
      // Call yourself recursively in case of multiple projects
      if (params.projects) {
        var promises = [];
        params.projects.map(function(project, i) {
          var newParams = params;
          delete newParams.projects;
          newParams.project = project;
          promises[i] = _getAggregatedLegacyPageviews(newParams);
        });
        return resolve(Promise.all(promises));
      }
      // Required params
      var project = params.project;
      var start = params.start;
      var end = params.end;
      // Optional params
      var access = params.access ? params.access : _access.default;
      var agent = params.agent ? params.agent : _agent.default;
      var granularity = params.granularity ?
          params.granularity : _granularityAggregated.default;
      var options = {
        url: BASE_URL + '/metrics/legacy-pageviews/per-project' +
            '/' + project +
            '/' + access +
            '/' + granularity +
            '/' + start +
            '/' + end,
        headers: {
          'User-Agent': USER_AGENT
        }
      };
      options.url = 'http://localhost:5000/legacy.json';
      request(options, function(error, response, body) {
        var result = _checkResult(error, response, body);
        if (result.stack) {
          return reject(result);
        }
        return resolve(result);
      });
    });
  };

  var _getTopPageviews = function(params) {
    return new Promise(function(resolve, reject) {
      params = _checkParams(params, 'getTopPageviews');
      if (params.stack) {
        return reject(params);
      }
      // Call yourself recursively in case of multiple projects
      if (params.projects) {
        var promises = [];
        params.projects.map(function(project, i) {
          var newParams = params;
          delete newParams.projects;
          newParams.project = project;
          promises[i] = _getTopPageviews(newParams);
        });
        return resolve(Promise.all(promises));
      }
      // Required params
      var project = params.project;
      var year = params.year;
      var month = typeof params.month === 'number' && params.month < 10 ?
          '0' + params.month : params.month;
      var day = typeof params.day === 'number' && params.day < 10 ?
          '0' + params.day : params.day;
      var limit = params.limit || false;
      // Optional params
      var access = params.access ? params.access : _access.default;
      var options = {
        url: BASE_URL + '/metrics/pageviews/top' +
            '/' + project +
            '/' + access +
            '/' + year +
            '/' + month +
            '/' + day,
        headers: {
          'User-Agent': USER_AGENT
        }
      };
      request(options, function(error, response, body) {
        var result = _checkResult(error, response, body);
        if (result.stack) {
          return reject(result);
        }
        if (limit) {
          result.items[0].articles = result.items[0].articles.slice(0, limit);
        }
        return resolve(result);
      });
    });
  };

  var _getPageviewsDimensions = function() {
    return new Promise(function(resolve, reject) {
      var options = {
        url: BASE_URL + '/metrics/pageviews/',
        headers: {
          'User-Agent': USER_AGENT
        }
      };
      request(options, function(error, response, body) {
        var result = _checkResult(error, response, body);
        if (result.stack) {
          return reject(result);
        }
        return resolve(result);
      });
    });
  };

  var _getUniqueDevices = function(params) {
    return new Promise(function(resolve, reject) {
      params = _checkParams(params, 'getUniqueDevices');
      if (params.stack) {
        return reject(params);
      }
      // Required params
      var project = params.project;
      var start = params.start;
      var end = params.end;
      // Optional params
      var accessSite = params.accessSite ?
          params.accessSite : _accessSite.default;
      var granularity = params.granularity ?
          params.granularity : _granularityUniques.default;
      var options = {
        url: BASE_URL + '/metrics/unique-devices' +
            '/' + project +
            '/' + accessSite +
            '/' + granularity +
            '/' + start +
            '/' + end,
        headers: {
          'User-Agent': USER_AGENT
        }
      };
      request(options, function(error, response, body) {
        var result = _checkResult(error, response, body);
        if (result.stack) {
          return reject(result);
        }
        return resolve(result);
      });
    });
  };

  return {
    /**
     * This is the root of all pageview data endpoints. The list of paths that
     * this returns includes ways to query by article, project, top articles,
     * etc. If browsing the interactive documentation, see the specifics for
     * each endpoint below.
     */
    getPageviewsDimensions: _getPageviewsDimensions,

    /**
     * Given a Mediawiki article and a date range, returns a daily timeseries of
     * its pageview counts. You can also filter by access method and/or agent
     * type.
     */
    getPerArticlePageviews: _getPerArticlePageviews,

    /**
     * Given a date range, returns a timeseries of pageview counts. You can
     * filter by project, access method and/or agent type. You can choose
     * between daily and hourly granularity as well.
     */
    getAggregatedPageviews: _getAggregatedPageviews,

    /**
     * TODO document
     */
    getAggregatedLegacyPageviews: _getAggregatedLegacyPageviews,

    /**
     * Lists the 1000 most viewed articles for a given project and timespan
     * (year, month or day). You can filter by access method.
     */
    getTopPageviews: _getTopPageviews,

    /**
     * Given a project and a date range, returns a timeseries of unique devices
     * counts. You can filter by access site and choose between daily and
     * monthly granularity.
     */
    getUniqueDevices: _getUniqueDevices
  };
})();

if (environment === 'node') {
  module.exports = pageviews;
}
