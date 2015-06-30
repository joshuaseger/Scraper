var casper = require('casper').create();
var tdsUrl = 'http://www.topdrawersoccer.com/college-soccer/teams/men';
var infoUrl = 'https://www.petersons.com/college-search/SearchResults.aspx?q=&page=1&resultsperpage=20';
var links = [];
var colleges = [];

function findColleges(){
	var collegeLinks = document.querySelectorAll('#collegeConferenceStandings a[href*="college-soccer-details"]:not([href*="tab"])');
		return Array.prototype.map.call(collegeLinks, function(e) {
    	var href = e.getAttribute('href');
        return href;
    });
	return collegeLinks;
}

function scrapeSoccer(){
	var college = [];
	college[0] = document.querySelector('#leftTopLi > h1').text;
	return college;
}

casper.start(tdsUrl, function(){
	this.echo(this.getTitle());
});

casper.then(function(){
	links = this.evaluate(findColleges);
	for(var i = 0;  i < links.length; i++){
		var link = 'http://www.topdrawersoccer.com' + links[i];
		this.echo(link);
		links[i] = link;
	}
	this.echo(links.length + ' links found:');
})

casper.then(function(){
	for(var i = 0; i < 5; i++){
		var url = links[i]
		this.thenOpen(url);
	    college = this.evaluate(scrapeSoccer);
		this.echo(college[0]);
	}
});

casper.run();



//#collegeConferenceStandings > div:nth-child(2) > table > tbody > tr:nth-child(1) > td.tal.first > a
//*[@id="collegeConferenceStandings"]/div[35]   //
//*[@id="collegeConferenceStandings"]/div[1]
//*[@id="collegeConferenceStandings"]/div[1]/table/tbody/tr[1]/td[1]/a
//*[@id="collegeConferenceStandings"]/div[1]/table/tbody
//*[@id="collegeConferenceStandings"]/div[1]/table/tbody/tr[1]/td[1]/a
//*[@id="collegeConferenceStandings"]/div[2]/table/tbody/tr[1]/td[1]/a
//*[@id="collegeConferenceStandings"]/div[35]/table/tbody/tr[1]/td[1]/a
//*[@id="collegeConferenceStandings"]/div[34]/table/tbody/tr[1]/td[1]/a
//*[@id="collegeConferenceStandings"]/div[3]
