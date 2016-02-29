var pageviews = typeof window === 'undefined' ?
    require('../pageviews.js') : pageviews;

pageviews.getPageviewsDimensions().then(function(result) {
  console.log(JSON.stringify(result, null, 2));
}).catch(function(error) {
  console.log(error);
});

pageviews.getPerArticlePageviews({
  article: 'Berlin',
  project: 'en.wikipedia',
  start: '20151201',
  end: '20151202'
}).then(function(result) {
  console.log(JSON.stringify(result, null, 2));
}).catch(function(error) {
  console.log(error);
});

pageviews.getPerArticlePageviews({
  articles: ['Berlin', 'Hamburg'],
  project: 'en.wikipedia',
  start: '20151201',
  end: '20151202'
}).then(function(result) {
  console.log(JSON.stringify(result, null, 2));
}).catch(function(error) {
  console.log(error);
});

pageviews.getAggregatedPageviews({
  project: 'en.wikipedia',
  start: '2015120101',
  end: '2015120102'
}).then(function(result) {
  console.log(JSON.stringify(result, null, 2));
}).catch(function(error) {
  console.log(error);
});

pageviews.getAggregatedPageviews({
  projects: ['en.wikipedia', 'de.wikipedia'],
  start: '2015120101',
  end: '2015120101'
}).then(function(result) {
  console.log(JSON.stringify(result, null, 2));
}).catch(function(error) {
  console.log(error);
});

pageviews.getTopPageviews({
  project: 'en.wikipedia',
  year: '2015',
  month: '12',
  day: '01',
  limit: 2
}).then(function(result) {
  console.log(JSON.stringify(result, null, 2));
}).catch(function(error) {
  console.log(error);
});

pageviews.getTopPageviews({
  projects: ['en.wikipedia', 'de.wikipedia'],
  year: '2015',
  month: '12',
  day: '01',
  limit: 2
}).then(function(result) {
  console.log(JSON.stringify(result, null, 2));
}).catch(function(error) {
  console.log(error);
});

pageviews.getTopPageviews({
  project: 'en.wikipedia',
  year: 2015,
  month: 12,
  day: 1,
  limit: 2
}).then(function(result) {
  console.log(JSON.stringify(result, null, 2));
}).catch(function(error) {
  console.log(error);
});

pageviews.getTopPageviews({
  project: 'en.wikipedia',
  year: 2015,
  month: 9,
  day: 30,
  limit: 2
}).then(function(result) {
  console.log(JSON.stringify(result, null, 2));
}).catch(function(error) {
  console.log(error);
});
