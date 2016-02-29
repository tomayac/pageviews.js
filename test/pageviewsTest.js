var environment = typeof window === 'undefined' ? 'node' : 'browser';
var chai;
var pageviews;
if (environment === 'node') {
  chai = require('chai');
  pageviews = require('../pageviews.js');
} else {
  chai = window.chai;
  pageviews = window.pageviews;
}
var assert = chai.assert;

describe('pageviews.js', function() {
  it('Is inititalized.', function() {
    assert.isObject(pageviews);
  });

  it('Has the correct methods.', function() {
    assert.deepEqual(Object.keys(pageviews), [
        "getPageviewsDimensions",
        "getPerArticlePageviews",
        "getAggregatedPageviews",
        "getTopPageviews"]);
  });

  it('Supports the correct dimensions.', function() {
    return pageviews.getPageviewsDimensions().then(function(result) {
      assert.deepEqual(result, {
        items: [
          'aggregate',
          'per-article',
          'top'
        ]
      });
    });
  });

  it('Returns pageviews for a single article.', function() {
    return pageviews.getPerArticlePageviews({
      article: 'Berlin',
      project: 'en.wikipedia',
      start: '20151201',
      end: '20151202'
    }).then(function(result) {
      assert.isNumber(result.items[0].views);
    });
  });

  it('Returns pageviews for multiple articles.', function() {
    return pageviews.getPerArticlePageviews({
      articles: ['Berlin', 'Hamburg'],
      project: 'en.wikipedia',
      start: '20151201',
      end: '20151202'
    }).then(function(result) {
      assert(result[0].items[0].views >= 0 && result[1].items[0].views >= 0);
    });
  });

  it('Returns aggregated pageviews for a single project.', function() {
    return pageviews.getAggregatedPageviews({
      project: 'en.wikipedia',
      start: '2015120101',
      end: '2015120102'
    }).then(function(result) {
      assert(result.items[0].views >= 0 && result.items[1].views >= 0);
    });
  });

  it('Returns aggregated pageviews for multiple projects.', function() {
    return pageviews.getAggregatedPageviews({
      projects: ['en.wikipedia', 'de.wikipedia'],
      start: '2015120101',
      end: '2015120101'
    }).then(function(result) {
      assert(result[0].items[0].views >= 0 && result[1].items[0].views >= 0);
    });
  });

  it('Returns the top pageviews for a single project (with textual date).',
      function() {
    return pageviews.getTopPageviews({
      project: 'en.wikipedia',
      year: '2015',
      month: '12',
      day: '01',
      limit: 2
    }).then(function(result) {
      assert(result.items[0].articles.length > 0);
    });
  });

  it('Returns the top pageviews for multiple projects (with textual date).',
      function() {
    return pageviews.getTopPageviews({
      projects: ['en.wikipedia', 'de.wikipedia'],
      year: '2015',
      month: '12',
      day: '01',
      limit: 2
    }).then(function(result) {
      assert(result[0].items[0].articles.length > 0 &&
          result[1].items[0].articles.length > 0);
    });
  });

  it('Returns the top pageviews for a single project (with integer date).',
      function() {
    pageviews.getTopPageviews({
      project: 'en.wikipedia',
      year: 2015,
      month: 12,
      day: 1,
      limit: 2
    }).then(function(result) {
      assert(result.items[0].articles.length > 0);
    });
  });
});
