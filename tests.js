var pageviews = require('./index.js');

pageviews.getPageviewsDimensions().then(function(result) {
  console.log(JSON.stringify(result, null, 2));
}).catch(function(error) {
  console.log(error)
});

pageviews.getPerArticlePageviews({
  article: 'Berlin',
  project: 'en.wikipedia',
  start: '20151201',
  end: '20151202'
}).then(function(result) {
  console.log(JSON.stringify(result, null, 2));
}).catch(function(error) {
  console.log(error)
});

pageviews.getAggregatedPageviews({
  project: 'en.wikipedia',
  start: '2015120101',
  end: '2015120212'
}).then(function(result) {
  console.log(JSON.stringify(result, null, 2));
}).catch(function(error) {
  console.log(error)
});

pageviews.getTopPageviews({
  project: 'en.wikipedia',
  year: '2015',
  month: '12',
  day: '01',
  limit: 5
}).then(function(result) {
  console.log(JSON.stringify(result, null, 2));
}).catch(function(error) {
  console.log(error)
});
