Milwaukee Fire Department Calls for Service Scraper
===========================
The Milwaukee Fire Department publishes a list of dispatched calls for service on the City of Milwaukee website in an effort to provide transparency to the community. However, this is done using a software product that offers no APIs. This CasperJS script changes that, scraping the list of calls and transforming it to a JSON file. Also, it provides more friendly call descriptions and formatting certain fields so they are not in all CAPS. This is used by the Milwaukee DataHaus for retrieving Milwaukee Fire Department Calls for Service.

Technologies Used
-----------------
 - [PhantomJS](http://phantomjs.org/ "PhantomJS")
 - [CasperJS](http://casperjs.org/ "CasperJS")  (Provides Additional Functionality to PhantomJS)

Data Sets Used
---------
 - [Milwaukee Fire Department Calls for Service](http://itmdapps.milwaukee.gov/MFDCallData/currentCADCalls/mfdCallsService.jsf "Milwaukee Fire Department Calls for Service")

License
---------
The Milwaukee DataHaus' public code is licensed using the MIT license, allowing for usage with attribution and no included warranty. See LICENSE for the full license text.

Learn More About the Milwaukee DataHaus
---------
The Milwaukee DataHaus is a non-profit community-fueled website that takes publicly-accessible civic information and makes it available for usage by developers, data scientists, entrepreneurs, and others interested in helping our community. You can visit us online at [http://mkedata.haus](http://mkedata.haus/ "http://mkedata.haus").