Console Crawler
==========

A Node app to crawls a given web site.

### Quick Set-Up
1. This is a Node app, so you'll need node/npm to run it.  
2. Clone down the repo
3. Install the dependencies `npm install`.
4. Fire up the crawler.

### Or, Copy-Paste
-----
```bash
git clone https://github.com/robcolburn/console-crawler;
cd console-crawler;
npm install;
./console-crawler.js http://en.wikipedia.org/;
```

Notes
-----
1. On Mac, you'll likely need X-Code Command Line tools installed.

2. If you'd like to use PhantomJS.  You'll need to [download PhatomJS](http://phantomjs.org/download.html), and install it separately since it has it's own binary.

2. If you need target a different "Host", you may just need to edit your hosts file.  For instance, say I wanted to hit 5.5.5.5, but with the host of example.com which isn't ready to go live just yet.  I might add the following to my hosts file.

```
5.5.5.5 example.com
```
