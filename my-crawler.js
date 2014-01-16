var Crawler = require("crawler").Crawler;

var site = '';
process.argv.forEach(function (val, index, array) {
	if (index === 2) {
		site = val;
	}
});


function traverseSite (site) {
	var c = new Crawler({
		maxConnections: 10,
		callback: onResponse
	});
	var uris = {site: true};
	var isSite = new RegExp(site);
	var totalCounter = 1;
	var completed = 1;
	c.queue(site);

  // This will be called when successful
	function onSuccess (result, $) {
		console.log((completed++) + ".",result.uri);

		// $ is a jQuery instance scoped to the server-side DOM of the page
		var counter = 0;
		var $links = $("a").each(function(index,a) {
			if (!uris[a.href] && a.href.match(isSite)) {
				c.queue(a.href);
				uris[a.href] = true;
				counter++;
				totalCounter++;
			}
		});
		console.log("Added", counter, "to the queue of", totalCounter, "links");
	}
		// This will be called for each crawled page
	function onResponse (error, result, $) {
		totalCounter--;
		if (error) {
			if (error.length && error[0].message) {
				console.log("error", error[0].message);
			}
			else {
				console.log("error", error);
			}
		}
		else if (!result) {
			console.log("no result");
		}
		else if (!$) {
			console.log("no jQuery");
		}
		else {
			onSuccess(result, $);
		}
	}
}

if (site) {
	traverseSite(site);
}
else {
	console.log('tell me the site');
}
