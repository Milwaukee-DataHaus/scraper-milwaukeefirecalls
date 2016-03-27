//Include Modules and Files
var casper = require('casper').create();
var fs = require('fs');
var system = require('system');
var replacements = require('call_replacements.json');

//File Path
var curFilePath = fs.absolute(system.args[3]).split('/');

if (curFilePath.length > 1) {
    curFilePath.pop();
    curFilePath = curFilePath.join('/');
}

//Title Case
String.prototype.toTitleCase = function () {
    return this.replace(/\w\S*/g, function (txt) {
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
};

//Friendly Nature of Call Descriptions
var getFriendlyName = function (call) {
    if (replacements.hasOwnProperty(call)) {
        return replacements[call];
    } else {
        return call.toTitleCase();
    }
};

//Prepare Casper Tasks
casper.start('http://itmdapps.milwaukee.gov/MFDCallData/currentCADCalls/mfdCallsService.jsf', function () {
    //Output Array
    var output = {
        meta: {
            last_updated: '',
            num_calls: ''
        },
        calls: []
    };
    //Get Data We Need for Meta and Paging
    this.echo("Beginning Scrape of MFD Calls...");
    output.meta.last_updated = this.fetchText('span[id="formId:updatedId"]');
    output.meta.num_calls = parseInt(this.fetchText('span[id="formId:textTotalCallId"]').substring(25));
    var pages = parseInt(this.fetchText('span[id="formId:tableExUpdateId:deluxe1__pagerText"]').substring(9));
    //Loop Through Pages and Scrape Data
    this.repeat(pages, function () {
        var callsForService = this.getElementsInfo('table[class="dataTableEx"] tbody tr[class^="rowClass"]');
        for (var i = 0; i < callsForService.length; i++) {
            var callInfo = callsForService[i].text.split('\n');
            var tempCall = {};
            tempCall['cfs'] = parseInt(callInfo[0]);
            tempCall['date_time'] = callInfo[1];
            tempCall['address'] = callInfo[2].toTitleCase();
            tempCall['apartment'] = callInfo[3].trim();
            tempCall['city'] = callInfo[4].toTitleCase().trim();
            tempCall['state'] = "WI";
            tempCall['nature_of_call'] = getFriendlyName(callInfo[5].trim());
            tempCall['disposition'] = callInfo[6].toTitleCase().trim();
            output.calls.push(tempCall);
            this.echo("Retrieving CFS " + tempCall['cfs']);
        }
        //Click to Go to The Next Page
        this.click('input[id="formId:tableExUpdateId:deluxe1__pagerNext"]');
    });
    //Write JSON File and End Tasks
    this.then(function () {
        fs.write(curFilePath + "/mfd_calls_for_service.json", JSON.stringify(output, null, 4), 'w');
    });
});

//Run Casper, Exit on Complete
casper.run(function () {
    this.echo("MFD Scrape Complete!");
    this.exit();
});