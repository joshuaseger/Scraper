# Scraper
Scraper for my soccer web project
My goal is to scrape topdrawersoccer.com for all basic soccer information on every DI, DII, and DIII university, and then search a college information site for those same schools and scrape basic college information such as tuition costs, average SAT's scores, degrees offered, and student population.  I am using casperjs and phantomjs with the following plan in mind.
STEPS
1. Scrape http://www.topdrawersoccer.com/college-soccer/teams/men for links to every college info page in TDS.com domain.
2. For every link, create a college object and populate with relevant fields scraped from specific college page on TDS.com.
3. Once all soccer data is returned, find basic college info on school..... NEED TO CHOOSE A DOMAIN HERE
4. Return a Json file of all schools and their information
5. Drop Json file into a MongoDB
6. Begin building Ruby webb app.
