#!/usr/bin/env node
var Crawler = require("crawler").Crawler;
var console = require('better-console');
// 1. Parse the URL from the Arguments
var argv = require('optimist')
    .usage([
      'Traverse a site.',
      'Usage: $0 http://example.com',
      'Usage: $0 http://example.com -max=10'
    ].join('\n'))
    .demand(1)
    .default('max', 10)
    .argv;
var MAX_CONNECTIONS = argv.max;
var SITES = argv._;

SITES.forEach(traverseSite);

function traverseSite (site) {
	console.info("Crawling… ", site);
	// 2. Set-up the Crawler
	var crawler = new Crawler({
		maxConnections: MAX_CONNECTIONS,
		callback: onResponse
	});
	var uris = {site: true};
	var isSite = new RegExp(site);
	var stripAnchors = new RegExp("#.+");
	var queueLength = 1;
	var completed = 0;

	// 3. Queue up the URL as the first one to crawl
	crawler.queue(site);

	// 4. Handle any Errors that come through
	// TODO: Need to find a way to know what URL we're talking about
	/**
	 * @param {Request.Error} error
	 *   See Node Request module
	 * @param {Request} result
	 *   See Node Request module
	 * @param {jQuery} $
	 *   A jQuery instance scoped to the server-side DOM of the page
	 */
	function onResponse (error, result, $) {
		queueLength--;
		completed++;
		if (error) {
			if (error.length && error[0] && error[0].message) {
				console.error(completed + ". " + "Error", error[0].message);
			}
			else {
				console.error(completed + ". " + "Error", error);
			}
		}
		else if (!result) {
			console.error(completed + ". " + "Error: No result");
		}
		else if (!$) {
			console.error(completed + ". " + result.statusCode + ": " + result.uri);
			console.error("Error: Failed to load jQuery object");
			// console.error(result);
		}
		else {
			onSuccess(result, $);
		}
	}

	// 5. Now handle responses that look good enough to crawl
	/**
	 * @param {Request} result
	 *   See Node Request module
	 * @param {jQuery} $
	 *   A jQuery instance scoped to the server-side DOM of the page
	 */
	function onSuccess (result, $) {
		console.info(completed + ". " + result.statusCode + ": " + result.uri);

		var numLinks = 0;
		// 6. Gather up the links on this page, and queue them for crawling
		$("a").get().forEach(function(anchor) {
			var uri = anchor.href.replace(stripAnchors, '');
			if (!uris[uri] && isSite.test(uri)) {
				crawler.queue(uri);
				uris[uri] = true;
				numLinks++;
				queueLength++;
			}
		});
		if (numLinks) {
			console.info("Added", numLinks, "to the queue of", queueLength, "links");
		}
		else {
			console.info("No links to add");
		}
	}
}


