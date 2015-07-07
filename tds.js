var casper = require('casper').create();
casper.options.viewportSize = {width: 700, height: 600};
var tdsUrl = 'http://www.topdrawersoccer.com/college-soccer/teams/men';
var infoUrl = 'https://bigfuture.collegeboard.org/sitesearch?q=';
var links = [];
var colleges = [];
var jsonData = [];
var xpath = require('casper').selectXPath;
var finalJSON;
var fs = require('fs');


//START CASPER --------------------------------
casper.start(tdsUrl);

//Get links of all soccer schools D1
casper.then(function(){
	getLinks();
});

//Get soccer info for each link.
casper.then(function(){
//	for(var i = 0; i < links.length; i++){
	for(var i = 0; i < 3; i++){
		var url = links[i];
		getSoccerInfo(url, i);
	}
});

//Now add college information to each college object
casper.then(function(){
	for(var i = 0; i < colleges.length; i++){
		var college = colleges[i];
		getBasicInfo(college);
	}

});

casper.then(function(){
	finalJSON = generateJSON();
	casper.echo('-----START JSON-----');
	casper.echo(finalJSON);
	casper.echo('-----END JSON-----');
});

casper.run();
//END CASPER -----------------------------------

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

function getSoccerInfo(url, i)
{
	casper.thenOpen(url);
	casper.waitUntilVisible('#leftTopLi', function(){
		this.echo('Getting soccer info from ' + url);
		var college = new Object();
		college.schoolName = casper.getElementInfo(xpath('//*[@id="leftTopLi"]/h1')).text.trim();
		college.overallRecord = casper.getElementInfo(xpath('//*[@id="leftTopLi"]/*[@class="statistics"]/span[1]')).text.trim();
		college.conferenceRecord = casper.getElementInfo(xpath('//*[@id="leftTopLi"]/span[2]/span[2]')).text.trim();
		college.conference = casper.getElementInfo(xpath('//*[@id="schoolProfile"]/div/ul[1]/li[2]/a')).text.trim();
		college.state = casper.getElementInfo(xpath('//*[@id="schoolProfile"]/div/ul[1]/li[3]')).text.split(':')[1].trim();
		college.city = casper.getElementInfo(xpath('//*[@id="schoolProfile"]/div/ul[1]/li[4]')).text.split(':')[1].trim();
		college.headCoach = casper.getElementInfo(xpath('//*[@id="schoolProfile"]/div/ul[1]/li[6]')).text.split(':')[1].trim();
		college.coachPhone = casper.getElementInfo(xpath('//*[@id="schoolProfile"]/div/ul[1]/li[7]')).text.split(':')[1].trim();
		college.nickname = casper.getElementInfo(xpath('//*[@id="schoolProfile"]/div/ul[1]/li[1]')).text.split(':')[1].trim();
		college.rpiRanking = casper.getElementInfo(xpath('//*[@id="schoolProfile"]/div/div[2]/ul/li[2]')).text.trim();
		
		//var rosterDistribution = casper.findAll('.playerYear');
		//college.rosterDistribution = rosterDistribution;
		var goals = casper.getElementInfo(xpath('//*[@id="schoolProfile"]/div/ul[2]/li[1]')).text.split('G');
		college.goalsFor = goals[1].split(':')[1].trim();
		college.goalsAgainst = goals[2].split(':')[1].trim();
		colleges[i] = college;
	});
}

function getBasicInfo(college)
{	
	var query = college.schoolName;
	var searchUrl = infoUrl + query.replace(/ /g, '+') + '&searchType=bf_site&tp=bf_site'
	casper.thenOpen(searchUrl);


	casper.waitUntilVisible('#headerSearchFormContainer', function(){
		this.echo('Search collegeboard.com url: ' + searchUrl);
		casper.click(xpath('/html/body/div[6]/div[2]/dl/div[2]/dt/p/a'));
	});

	casper.waitUntilVisible('#topFrame', function() {
		this.echo('Landed on collegeboard info page for ' + query);
		this.echo('Found ' + query + ' info page');
		college.description = casper.getElementInfo('#cpProfile_ataglance_collegeDescription_html').text.trim();
		college.schoolUrl = casper.getElementInfo('#cpProfile_ataglance_collegeGeneralUrl_anchor').text.trim();
		college.schoolSize = casper.getElementInfo(xpath('//*[@id="topFrame"]/div[2]/div[2]/div/div/div[2]/div[1]/div[3]/div[2]/div/h4')).text.trim();
		college.undergradPopulation = casper.getElementInfo(xpath('//*[@id="topFrame"]/div[2]/div[2]/div/div/div[2]/div[1]/div[3]/div[2]/div/h5[1]')).text.trim();
		college.inStateTuition = casper.getElementInfo(xpath('//*[@id="topFrame"]/div[2]/div[2]/div/div/div[2]/div[1]/div[3]/div[4]/div/div/h5[2]/span[1]')).text.trim();
		college.outOfStateTuition = casper.getElementInfo(xpath('//*[@id="topFrame"]/div[2]/div[2]/div/div/div[2]/div[1]/div[3]/div[4]/div/div/h5[2]/span[2]')).text.trim();
		var address = casper.getElementInfo(xpath('//*[@id="cpProfile_ataglance_visitingAddLine1_div"]/span')).text.trim();
		address += ", " + casper.getElementInfo(xpath('//*[@id="visitingAddress"]/span[1]')).text.trim();
		address += casper.getElementInfo(xpath('//*[@id="visitingAddress"]/span[2]')).text.trim();
		address += " " + casper.getElementInfo(xpath('//*[@id="visitingAddress"]/span[3]')).text.trim();
		college.address = address;
		casper.click(xpath('//*[@id="cpProfile_tabs_majorsAndLearning_anchor"]/a'));
	});
	
	casper.waitUntilVisible(xpath('//*[@id="topFrame"]/div[2]/div[2]/div/div/div[1]/div'), function(){
		this.echo('Retrieving faculty ratio for ' + query);
		college.facultyRatio = casper.getElementInfo(xpath('//*[@id="topFrame"]/div[2]/div[2]/div/div/div[1]/div/div[1]/div[3]/h3/span')).text.trim();
	})
}

function generateJSON()
{
	for(var i = 0; i < colleges.length; i++)
	{
		jsonData.push(colleges[i]);
	}
	var output = JSON.stringify(jsonData);
	fs.write(output, output, 'w');
	return output;
}