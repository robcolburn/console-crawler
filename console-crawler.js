#!/usr/bin/env node
var Tarantula = require('tarantula');
var console = require('better-console');
// 1. Parse the URL from the Arguments
var argv = require('yargs')
    .usage([
			'Traverse a site.',
			'Usage: $0 http://example.com',
			'Usage: $0 http://example.com --legs=10',
			'Usage: $0 http://example.com --legs=10 --proxy=myproxy.com:7070 --web --phantom'
	].join('\n'))
	.demand(1)
	.default('conn', 2)
	.default('proxy', '')
	.argv;
var SITES = argv._;
var isImage = /\.jpg|\.png|\.gif|\.pdf/i;

var tarantula = new Tarantula({
	leg: (argv.phantom ? 'PhantomJS' : ''),
	legs: argv.legs,
	stayInRange: !argv.web,
	proxy: argv.proxy,
});
tarantula.shouldVisit = function (pageUri) {
	if (isImage.test(pageUri)) {
		return false;
	}
	return true;
};
tarantula.on('request', function (task) {
	console.log('GET', task.uri);
	console.log('REFER', task.parent);
});
tarantula.on('data', function (task) {
	console.info('200', task.uri);
});

tarantula.on('uris', function (task, newCount) {
	console.log(
		'V:' + tarantula.visited,
		'T:' + tarantula.uris.length,
		'Q:' + (tarantula.uris.length - tarantula.visited),
		'A:' + tarantula.legs.active,
		'+' + newCount
	);
});
tarantula.on('error', function (task, errorCode, errorMessage) {
	if (typeof errorMessage === 'string' && errorMessage.match('Not HTML')) {
		console.warn('Not HTML');
	}
	else {
		console.error(errorCode, task.uri, 'from', task.parent);
		if (errorCode == 'ERR') {
			console.error(errorMessage);
		}
	}
});
tarantula.on('done', function () {
	console.info('done');
});

console.log('Crawling… ', SITES);
tarantula.start(SITES);
