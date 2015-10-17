//Include Modules
var casper = require('casper').create();
var fs = require('fs');
//Title Case
String.prototype.toTitleCase = function() {
    return this.replace(/\w\S*/g, function(txt) {
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
};
//Friendly Nature of Call Descriptions
var getFriendlyName = function(call) {
    switch (call) {
        case '29D029':
            return 'Motor Vehicle Accident (Injuries)'
        case '29D02P':
            return 'Motor Vehicle Accident (Injuries)'
        case 'OOCFINVESTIGATIVE RESPONSEE':
            return 'Out of City Investigative Response'
        case 'EMS':
            return 'Medical Assistance'
        default:
            return call.toTitleCase();
    }
};
//Prepare Casper Tasks
casper.start('http://itmdapps.milwaukee.gov/MFDCallData/currentCADCalls/mfdCallsService.jsf', function() {
    //Output Array
    var output = {
        meta: {
            last_updated: '',
            num_calls: ''
        },
        calls: []
    };
    //Get Data We Need for Meta and Paging
    this.echo("Beginning Scrape...");
    output.meta.last_updated = this.fetchText('span[id="formId:updatedId"]');
    output.meta.num_calls = parseInt(this.fetchText('span[id="formId:textTotalCallId"]').substring(25));
    var pages = parseInt(this.fetchText('span[id="formId:tableExUpdateId:deluxe1__pagerText"]').substring(9));
    //Loop Through Pages and Scrape Data
    this.repeat(pages, function() {
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
            this.echo("Processing CFS " + tempCall['cfs']);
        }
        //Click to Go to The Next Page
        this.click('input[id="formId:tableExUpdateId:deluxe1__pagerNext"]');
    });
    //Write JSON File and End Tasks
    this.then(function() {
        fs.write("/datahaus/mfd_calls_for_service/mfd_calls_for_service.json", JSON.stringify(output, null, 4), 'w');
        this.echo("Scrape Complete!");
    });
});
//Run Casper
casper.run();