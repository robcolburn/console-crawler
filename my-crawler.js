var Crawler = require("crawler").Crawler;

// 1. Parse the URL from the Arguments
var site = '';
var maxConnections = 10;
process.argv.forEach(function (val, index, array) {
	if (index === 2) {
		site = val;
	}
});
if (site) {
	traverseSite(site);
}
else {
	console.log('What URL shall I traverse?');
}

function traverseSite () {
	// 2. Set-up the Crawler
	var c = new Crawler({
		maxConnections: maxConnections,
		callback: onResponse
	});
	var uris = {site: true};
	var isSite = new RegExp(site);
	var stripAnchors = new RegExp("#.+");
	var totalCounter = 1;
	var completed = 1;

	// 3. Queue up the URL as the first one to crawl
	c.queue(site);

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
		totalCounter--;
		completed++;
		if (error) {
			if (error.length && error[0].message) {
				console.log(completed + ". " + "Error", error[0].message);
			}
			else {
				console.log(completed + ". " + "Error", error);
			}
		}
		else if (!result) {
			console.log(completed + ". " + "Error: No result");
		}
		else if (!$) {
			console.log(completed + ". " + result.statusCode + ": " + result.uri);
			console.log("Error: Failed to load jQuery object");
			// console.log(result);
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
		console.log(completed + ". " + result.statusCode + ": " + result.uri);

		var counter = 0;
		// 6. Gather up the links on this page, and queue them for crawling
		$("a").each(function(index,a) {
			var uri = a.href.replace(stripAnchors, '');
			if (!uris[uri] && uri.match(isSite)) {
				c.queue(uri);
				uris[uri] = true;
				counter++;
				totalCounter++;
			}
		});
		console.log("Added", counter, "to the queue of", totalCounter, "links");
	}
}


