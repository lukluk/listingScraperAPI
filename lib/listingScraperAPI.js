var request = require('request');
var cheerio = require('cheerio');


var http = require('http'),
    fs = require('fs'),
    Url = require('url');
var dir='';
exports.setPath=function(idir){
	dir=idir;
}
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
            var scr = require(dir+'/' + fileName + '.js').scraper;
            if(scr.setup)
            scr.setup();
            
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
                var s = cheerio.load(firsthtml);
                var pageurl = scr.getPagingUrl(s);
                while (url = scr.nextPage(s,pageurl)) {
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
                                        if(scr.finish)
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
    console.log("Async ListingScraperAPI");
    console.log("Running API port " + port);
}
