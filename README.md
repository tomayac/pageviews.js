# pageviews.js

A lightweight JavaScript client library for the [Wikimedia Pageviews API](https://wikimedia.org/api/rest_v1/?doc#!/Pageviews_data) for Wikipedia and various of its sister projects for **Node.js** and the **browser**.

# Installation

With npm:

```bash
$ npm install pageviews
```

With bower:

```bash
$ bower install pageviews
```

# Usage in Node.js

The client library requires native or polyfilled Promises support.
Below are some samples of how to use it in practice.

```javascript
var pageviews = require('pageviews');

// Getting pageviews for a single article
pageviews.getPerArticlePageviews({
  article: 'Berlin',
  project: 'en.wikipedia',
  start: new Date(new Date() - 3 * 24 * 60 * 60 * 1000), // YYYYMMDD string or Date object
  end: new Date(new Date() - 2 * 24 * 60 * 60 * 1000) // YYYYMMDD string or Date object
}).then(function(result) {
  console.log(JSON.stringify(result, null, 2));
}).catch(function(error) {
  console.log(error);
});

// Getting pageviews for multiple articles
pageviews.getPerArticlePageviews({
  articles: ['Berlin', 'Hamburg'], // Plural
  project: 'en.wikipedia',
  start: new Date(new Date() - 3 * 24 * 60 * 60 * 1000),  // YYYYMMDD string or Date object
  end: new Date(new Date() - 2 * 24 * 60 * 60 * 1000) // YYYYMMDD string or Date object
}).then(function(result) {
  console.log(JSON.stringify(result, null, 2));
}).catch(function(error) {
  console.log(error);
});

// Getting aggregated pageviews for a single project
pageviews.getAggregatedPageviews({
  project: 'en.wikipedia',
  start: '2015120101', // YYYYMMDDHH string or Date object
  end: '2015120102' // YYYYMMDDHH string or Date object
}).then(function(result) {
  console.log(JSON.stringify(result, null, 2));
}).catch(function(error) {
  console.log(error);
});

// Getting aggregated pageviews for multiple projects
pageviews.getAggregatedPageviews({
  projects: ['en.wikipedia', 'de.wikipedia'], // Plural
  start: '2015120101', // YYYYMMDDHH string or Date object
  end: '2015120101' // YYYYMMDDHH string or Date object
}).then(function(result) {
  console.log(JSON.stringify(result, null, 2));
}).catch(function(error) {
  console.log(error);
});

// Getting top-n items ranked by pageviews for a single project
pageviews.getTopPageviews({
  project: 'en.wikipedia',
  year: '2015',
  month: '12',
  day: '01',
  limit: 2 // Limit to the first n results
}).then(function(result) {
  console.log(JSON.stringify(result, null, 2));
}).catch(function(error) {
  console.log(error);
});

// Getting top-n items ranked by pageviews for multiple projects
pageviews.getTopPageviews({
  projects: ['en.wikipedia', 'de.wikipedia'], // Plural
  year: '2015',
  month: '12', // Can also use integers like 12
  day: '01', // Can also use integers like 1
  limit: 2 // Limit to the first n results
}).then(function(result) {
  console.log(JSON.stringify(result, null, 2));
}).catch(function(error) {
  console.log(error);
});

// Getting top-n items ranked by pageviews for multiple projects
pageviews.getTopPageviews({
  projects: ['en.wikipedia', 'de.wikipedia'], // Plural
  date: new Date(new Date() - 2 * 24 * 60 * 60 * 1000), // YYYYMMDD string or Date object
  limit: 2 // Limit to the first n results
}).then(function(result) {
  console.log(JSON.stringify(result, null, 2));
}).catch(function(error) {
  console.log(error);
});
```

# Usage in the browser

You can build a minified version of ```pageviews.js``` by running the build script.

```bash
$ npm run build
```

You can then use the file in the browser as follows.

```html
<script src="pageviews.min.js"></script>
<script>
  // Getting pageviews for a single article
  pageviews.getPerArticlePageviews({
    article: 'Berlin',
    project: 'en.wikipedia',
    start: new Date(new Date() - 3 * 24 * 60 * 60 * 1000), // YYYYMMDD string or Date object
    end: new Date(new Date() - 2 * 24 * 60 * 60 * 1000) // YYYYMMDD string or Date object
  }).then(function(result) {
    console.log(JSON.stringify(result, null, 2));
  }).catch(function(error) {
    console.log(error);
  });

  /* All functions as defined in the Node.js section */
</script>
```

# API

The API is modeled along the [Wikimedia Pageviews API](https://wikimedia.org/api/rest_v1/?doc#!/Pageviews_data)
and offers the following methods:
```
/**
 * This is the root of all pageview data endpoints. The list of paths that
 * this returns includes ways to query by article, project, top articles,
 * etc. If browsing the interactive documentation, see the specifics for
 * each endpoint below.
 */
getPageviewsDimensions

/**
 * Given a Mediawiki article and a date range, returns a daily timeseries of
 * its pageview counts. You can also filter by access method and/or agent
 * type.
 */
getPerArticlePageviews

/**
 * Given a date range, returns a timeseries of pageview counts. You can
 * filter by project, access method and/or agent type. You can choose
 * between daily and hourly granularity as well.
 */
getAggregatedPageviews

/**
 * Lists the 1000 most viewed articles for a given project and timespan
 * (year, month or day). You can filter by access method.
 */
getTopPageviews
```

# License
Copyright 2016 Thomas Steiner (@tomayac)

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

[http://www.apache.org/licenses/LICENSE-2.0](http://www.apache.org/licenses/LICENSE-2.0)

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.

[![NPM](https://nodei.co/npm/pageviews.png?downloads=true)](https://nodei.co/npm/pageviews/)
