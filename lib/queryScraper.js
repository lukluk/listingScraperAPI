var request = require('request');
var cheerio = require('cheerio');


var http = require('http'),
    fs = require('fs'),
    Url = require('url');

exports.start = function(port) {
    if (!port) {
        port = 4000;
    }
    http.createServer(function(req, res) {
        var fileName = Url.parse(req.url, true).query.site;

        if (!fileName) {
            var content = "No Input";
            res.writeHead(200, {
                'Content-Length': content.length
            });
            res.write(content);

            res.end();
        } else {
            var scr = require('./' + fileName + '.js').scraper;

            scr.setup();
            console.log("scraping from page # "+scr.page+" count "+(scr.limit-scr.page));
            var json = [];
            request(scr.url, function(initialerror, firstresponse, firsthtml) {
                if (initialerror) {
                    var content = initialerror;
                    res.writeHead(200, {
                        'Content-Length': content.length
                    });
                    res.write(content);

                    res.end();

                }
                scr.$ = cheerio.load(firsthtml);
                var pageurl = scr.getPagingUrl();
                while (url = scr.nextPage(pageurl)) {
                    //List        
                    request(url, function(errorOnList, responseOnList, html) {
                        if (errorOnList) {
                            var content = errorOnList;
                            res.writeHead(200, {
                                'Content-Length': content.length
                            });
                            res.write(content);

                            res.end();

                        }

                        var list = scr.list(cheerio.load(html));
                        var tot = list.length;
                        for (var i in list) {
                            //Detail

                            request(list[i], function(error, response, dom) {
                                if (!error) {
                                    var $ = cheerio.load(dom);
                                    var output = {};
                                    for (var key in scr.fields) {
                                        if (typeof scr.fields[key] == 'function')
                                            output[key] = scr.fields[key]($);
                                    }
                                    json.push(output);
                                    if (json.length >= tot) {
                                        scr.finish();
                                        var content = JSON.stringify(json);
                                        res.writeHead(200, {
                                            'Content-Length': content.length
                                        });
                                        res.write(content);

                                        res.end();
                                    }
                                } else {
                                    if (error) {
                                        var content = error;
                                        res.writeHead(200, {
                                            'Content-Length': content.length
                                        });
                                        res.write(content);

                                        res.end();

                                    }

                                }
                            })
                        }
                    })
                }

            });
        }
    }).listen(port);
    console.log("
    console.log("Running API port " + port);
}
