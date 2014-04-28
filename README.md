listingScraperAPI (Async Scraper+jQuery)
=================

ListingScraperAPI based nodejs platform, using Cheerio Lib (jquery core)

# How it work

## Installation
```
$ npm install listingscraper
```
## How to use
```
var port=4000;
require('listingscraper').start(__dirname,port);
```

starting web server API
```
$ node app.js
Running API port 4000
```

http://localhost:4000/?site=[site config filename]

example :
example/cnet.js (download.cnet.com)
http://localhost:4000/?site=cnet
sample response/output (JSON)
```
[
{
detail: " From IObit: WinMetro is specially designed to bring the newly introduced Windows 8 Metro UI to Windows 7, Windows Vista and Windows XP. It offers an easy solution for old versions of Windows users to try and enjoy the tile based Metro UI. By displaying useful information such as weather, calendar, news, stocks, and frequently used programs, it turns your desktop into an informative and productive work station. It also offers the option to boot to Metro Start Screen directly. View larger image ",
os: "Windows XP/Vista/7",
category: "Desktop Enhancements",
type: " Free ",
screenshot: "http://i.i.cbsi.com/cnwk.1d/i/tim2/2013/05/03/Foreman_13110600_9453_1_257x150.png",
rating: "3.0 5 star:14 star:03 star:02 star:01 star:13.0 stars5 star:14 star:03 star:02 star:01 star:10 stars",
publisher: "IObit",
publisher_url: "http://download.cnet.com/windows/iobit/3260-20_4-6271865.html",
icon: "http://i.i.cbsi.com/cnwk.1d/i/tim2/2013/05/03/iconimg_87217.png",
released: " May 03, 2013",
title: "WinMetro 1.0",
url: "http://dw.cbsi.com/redir?edId=3&siteId=4&oId=3000-2072_4-75911749&ontId=2072_4&spi=7874440581bf264f63864ac5b9c633e5&lop=link&tag=tdw_dltext<ype=dl_dlnow&pid=13110600&mfgId=6271865&merId=6271865&pguid=U1md0QoOYI4AAG7ebfIAAAAN&ctype=dm;;language&cval=NONE;;en&destUrl=http%3A%2F%2Fdownload.cnet.com%2F3001-2072_4-75911749.html%3Fspi%3D7874440581bf264f63864ac5b9c633e5",
technical: " CNET Editors' review by: Ben Markton on February 27, 2014 WinMetro transforms your Windows 7 desktop into a tiled display that mimics the look of the Windows 8 interface in style and substance. If you like the look of the new Windows but don't want to have to upgrade your operating system, this app provides a convenient alternative. There is a helpful tutorial that pops up when you first install WinMetro that gives you a good overview of the features of the interface and where to find everything. The WinMetro home screen has the tiled look of Windows 8 and uses the same colors. Clicking on one of the tiles opens the respective program, and there are icons for Menu, Power, and to close the app in the upper right-hand corner of the screen. If you want to switch back to your normal desktop without closing WinMetro, you can just move your mouse to the lower left-hand corner of the screen and click the icon that pops up. Switching back and forth this way is quite convenient, and can make it more efficient for you to find certain kinds of programs. WinMetro will work with Windows 7, Windows Vista, and Windows XP, so no matter how old your operating system is, you should have no trouble giving it a facelift. The tiles that populate the home screen of the app include links to your calendar and clock, photos, Internet Explorer, Bing, maps, skydrive, Facebook, Twitter, sports, news, weather, and more. Overall, this is a fun app to try if you're ready to try out the Windows 8 experience without actually upgrading your system -- and it's free to use. ",
filesize: " 7.39MB "
}
...
]
```
# Controller Structure
```
exports.scraper = {
    page: 0,                //starting page
    limit: 10,              //limit max page per execution
    name:'SITE NAME',
    url: 'SITE URL',
    setup:function(){
      // will call before scraping starting
    },
    finish:function(){
      // will call after scraping finished
    },
    getPagingUrl: function($) {
      // should return a paging url format, you can replace page number with #pagenumber, so loop can auto goto next page
      // example http://eshop.com/page/#pagenumber/
    },
    nextPage: function(url) {
  		this.page++;	
  		if(this.page>this.limit){
  			return false;
  		}
      //you can also check if page valid then return false, if nextPage return false ,looping will stoped
      
  		return url.replace('#pagenumber',this.page);      
    },
    list: function($) {
        // expected return an array that contain product/item url on  page/category page
    },
    fields: {
      //define fileds here, each field need function that can return right value
      //example
      title:function($){
        return $('title').text();
      }
    }

}
```
#Author
luklukaha@gmail.com
