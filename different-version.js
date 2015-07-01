var casper = require('casper').create();
var tdsUrl = 'http://www.topdrawersoccer.com/college-soccer/teams/men';
var infoUrl = 'https://www.petersons.com/college-search/SearchResults.aspx?q=&page=1&resultsperpage=20';
var links = [];
var colleges = [];
var overallRecords = [];
var jsonData = [];
var xpath = require('casper').selectXPath;
var finalJSON;

casper.start(tdsUrl);

casper.then(function(){
	getLinks();
});

casper.then(function(){
//	for(var i = 0; i < links.length; i++){
	for(var i = 0; i < 5; i++){
		var url = links[i]
		getSchoolNameAndRecord(url, i);
	}
});

casper.then(function(){
	finalJSON = generateJSON();

	casper.echo('-----START JSON-----');
	casper.echo(finalJSON);
	casper.echo('-----END JSON-----');
});

casper.run();

function getLinks()
{
	links = casper.getElementsAttribute(xpath('//*[contains(@href, "/college-soccer/college-soccer-details/men") and not(contains(@href, "tab"))]'), 'href');

	for(var i = 0;  i < links.length; i++){
		var link = 'http://www.topdrawersoccer.com' + links[i];
		casper.echo(link);
		links[i] = link;
	}

	casper.echo(links.length + ' links found');
}

function getSchoolNameAndRecord(url, i)
{
	casper.thenOpen(url);

	casper.waitUntilVisible('#leftTopLi', function(){
		schoolName = casper.getElementInfo(xpath('//*[@id="leftTopLi"]/h1')).text;
		overallRecord = casper.getElementInfo(xpath('//*[@id="leftTopLi"]/*[@class="statistics"]/span[1]')).text;
		colleges[i] = schoolName;
		overallRecords[i] = overallRecord;
	});
}

function generateJSON()
{
	for(var i = 0; i < colleges.length; i++)
	{
		jsonData.push({'college.schoolName':colleges[i], 'college.overallRecord':overallRecords[i]});
	}

	return JSON.stringify(jsonData);
}
