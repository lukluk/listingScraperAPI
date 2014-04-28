var fs = require('fs');
var start=0;
var limitperPage=1;
var currentPage=0;
exports.scraper = {
    name:'cnet',
    url: 'http://download.cnet.com/windows/',
    setup:function(){
      if(fs.existsSync('data/'+this.name)){
        start=parseInt(fs.readFileSync('data/'+this.name));     
        currentPage=start;
      }
      
    },
    finish:function(){
      if(!fs.existsSync('data/'+this.name)){
        fs.mkdirSync('data',0777);
      }
      fs.writeFileSync('data/'+this.name,(start+limitperPage));      
    },
    getPagingUrl: function($) {
        var link = $('.latestReviews a.seeAll').attr('href');
        var links = link.split('.html');
        return links[0] + '-#pagenumber.html' + links[1];
    },
    nextPage: function($,url) {
        currentPage++;

        if (currentPage > start+limitperPage) {
            return false;
        }else
        if ($('.noResultsTitle').length > 0) {
            return false;
        }else
        return 'http://download.cnet.com' + url.replace('#pagenumber', currentPage);
    },
    list: function($) {
        var links = [];
        var th = this;


        $('.result-name').each(function() {
            if ($(this).find('a').length > 0)
                links.push($(this).find('a').attr('href'));
        })

        $('.result-image').each(function() {
            th.fields.icons[$(this).find('img').attr('alt')] = $(this).find('img').attr('src');
        })
        return links;
    },
    fields: {
        icons:[],
        detail: function($) {
            $('div.publisherDescription script').remove();
            return $('div.publisherDescription').text();
        },
        os: function($) {
            return $('li.qsOs p').text();
        },
        category: function($) {
            return $('.breadcrumb li').eq(2).text();
        },
        type: function($) {
            $('li.qsPrice span').remove();
            return $('li.qsPrice').text();
        },
        screenshot: function($) {
            return $('#productScreenshots img').attr('src');
        },
        rating: function($) {
            return $('#summaryRatingsModule span').text().replace('stars', '');
        },
        publisher: function($) {
            return $('div.publisherDescription a span').text();
        },
        publisher_url: function($) {
            return 'http://download.cnet.com' + $('div.publisherDescription a').attr('href');
        },
        icon: function($) {
            return this.icons[$('h1[itemprop=name]').text()];
        },
        released: function($) {
            $('li.qsDateAdded span').remove();
            return $('li.qsDateAdded').text();
        },
        title: function($) {
            $('li.qsVersion span').remove();
            return $('h1[itemprop=name]').text() + ' ' + $('li.qsVersion').text();
        },
        url: function($) {
            return $('#downloadLinks a').attr('href');
        },
        technical: function($) {
            return $('span[itemprop=description]').text();
        },
        changelog: function($) {

        },
        filesize: function($) {
            $('.fileSize span').remove();
            return $('.fileSize').text();
        }
    }

}
