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
        'getPageviewsDimensions',
        'getPerArticlePageviews',
        'getAggregatedPageviews',
        'getTopPageviews']);
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

  it('Returns pageviews for a single article (date string).', function() {
    return pageviews.getPerArticlePageviews({
      article: 'Berlin',
      project: 'en.wikipedia',
      start: '20151201',
      end: '20151202'
    }).then(function(result) {
      assert.isNumber(result.items[0].views);
    });
  });

  it('Returns pageviews for a single article (date object).', function() {
    return pageviews.getPerArticlePageviews({
      article: 'Berlin',
      project: 'en.wikipedia',
      start: new Date(new Date() - 3 * 24 * 60 * 60 * 1000),
      end: new Date(new Date() - 2 * 24 * 60 * 60 * 1000)
    }).then(function(result) {
      assert.isNumber(result.items[0].views);
    });
  });

  it('Returns pageviews for a single article (date object, no padding).',
      function() {
    return pageviews.getPerArticlePageviews({
      article: 'Berlin',
      project: 'en.wikipedia',
      start: new Date('2015-12-10'),
      end: new Date('2015-12-20')
    }).then(function(result) {
      assert.isNumber(result.items[0].views);
      assert.equal(result.items[0].timestamp, '2015121000');
    });
  });

  it('Returns pageviews for multiple articles (date string).', function() {
    return pageviews.getPerArticlePageviews({
      articles: ['Berlin', 'Hamburg'],
      project: 'en.wikipedia',
      start: '20151201',
      end: '20151202'
    }).then(function(result) {
      assert(result[0].items[0].views >= 0 && result[1].items[0].views >= 0);
    });
  });

  it('Returns pageviews for multiple articles (date object).', function() {
    return pageviews.getPerArticlePageviews({
      articles: ['Berlin', 'Hamburg'],
      project: 'en.wikipedia',
      start: new Date(new Date() - 3 * 24 * 60 * 60 * 1000),
      end: new Date(new Date() - 2 * 24 * 60 * 60 * 1000)
    }).then(function(result) {
      assert(result[0].items[0].views >= 0 && result[1].items[0].views >= 0);
    });
  });

  it('Returns aggregated pageviews for a single project (date string).',
      function() {
    return pageviews.getAggregatedPageviews({
      project: 'en.wikipedia',
      start: '2015120101',
      end: '2015120102'
    }).then(function(result) {
      assert(result.items[0].views >= 0 && result.items[1].views >= 0);
    });
  });

  it('Returns aggregated pageviews for a single project (date object).',
      function() {
    return pageviews.getAggregatedPageviews({
      project: 'en.wikipedia',
      start: new Date(new Date() - 3 * 24 * 60 * 60 * 1000),
      end: new Date(new Date() - 2 * 24 * 60 * 60 * 1000)
    }).then(function(result) {
      assert(result.items[0].views >= 0 && result.items[1].views >= 0);
    });
  });

  it('Returns aggregated pageviews for a single project ' +
      '(date object, no padding).', function() {
    return pageviews.getAggregatedPageviews({
      project: 'en.wikipedia',
      start: new Date('2015-12-10'),
      end: new Date('2015-12-20'),
      granularity: 'daily'
    }).then(function(result) {
      assert(result.items[0].views >= 0 && result.items[1].views >= 0);
      assert.equal(result.items[0].timestamp, '2015121000');
    });
  });

  it('Returns aggregated pageviews for multiple projects (date string).',
      function() {
    return pageviews.getAggregatedPageviews({
      projects: ['en.wikipedia', 'de.wikipedia'],
      start: '2015120101',
      end: '2015120101'
    }).then(function(result) {
      assert(result[0].items[0].views >= 0 && result[1].items[0].views >= 0);
    });
  });

  it('Returns aggregated pageviews for multiple projects (date object).',
      function() {
    return pageviews.getAggregatedPageviews({
      projects: ['en.wikipedia', 'de.wikipedia'],
      start: new Date(new Date() - 3 * 24 * 60 * 60 * 1000),
      end: new Date(new Date() - 2 * 24 * 60 * 60 * 1000)
    }).then(function(result) {
      assert(result[0].items[0].views >= 0 && result[1].items[0].views >= 0);
    });
  });

  it('Returns aggregated pageviews for all projects (plural, date object).',
      function() {
    return pageviews.getAggregatedPageviews({
      projects: 'all-projects',
      start: new Date(new Date() - 3 * 24 * 60 * 60 * 1000),
      end: new Date(new Date() - 2 * 24 * 60 * 60 * 1000)
    }).then(function(result) {
      assert(result.items[0].views >= 0);
    });
  });

  it('Returns aggregated pageviews for all projects (plural) ' +
      'and a particular project (date object).', function() {
    return pageviews.getAggregatedPageviews({
      projects: ['all-projects', 'en.wikipedia'],
      start: new Date(new Date() - 3 * 24 * 60 * 60 * 1000),
      end: new Date(new Date() - 2 * 24 * 60 * 60 * 1000)
    }).then(function(result) {
      assert(result[0].items[0].views >= 0 && result[1].items[0].views >= 0);
    });
  });

  it('Returns aggregated pageviews for all projects (singular, date object).',
      function() {
    return pageviews.getAggregatedPageviews({
      project: 'all-projects',
      start: new Date(new Date() - 3 * 24 * 60 * 60 * 1000),
      end: new Date(new Date() - 2 * 24 * 60 * 60 * 1000)
    }).then(function(result) {
      assert(result.items[0].views >= 0);
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

  it('Returns the top pageviews for a single project (with date object).',
      function() {
    pageviews.getTopPageviews({
      project: 'en.wikipedia',
      date: new Date(new Date() - 3 * 24 * 60 * 60 * 1000),
      limit: 2
    }).then(function(result) {
      assert(result.items[0].articles.length > 0);
    });
  });
});
