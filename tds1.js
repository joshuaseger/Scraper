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
	college = {};
	college.schoolName = document.querySelector('#leftTopLi > h1');
	college.overallRecord = document.querySelector('#leftTopLi > span.statistics > span:nth-child(1)');
	return JSON.stringify(college);
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
	var colleges = [];
	for(var i = 0; i < 5; i++){
		var url = links[i]
		this.thenOpen(url);
		this.wait(3000);
     	var college = new Object();
     	college["name"] = this.fetchText('#leftTopLi > h1');
     	colleges[i] = college;
	}
	var school = colleges[0];
	this.echo(JSON.stringify(school));
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
