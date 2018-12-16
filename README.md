# mynews a mongo-news-scraper


My NPR news is web application that scrapes news from NPR's web site. I made the app with Mongoose and Cheerio technologies.

* Whenever a user runs the app on the local server or on the heroku app link, article headlines, the article link, and the article snippet are scraped from NPR.com's website. 
* I used cheerio to grab and scrape  NPR's DOM elemnts. Mongoose was used to save the scraped data to the database (mongodb.)
* The Notes button allows user to view notes on an article or add/delete their own notes; all notes are saved to our mongodb database. 

## See it live here: https://glacial-basin-35455.herokuapp.com/

---

### Pre-requisites

* Install Node.js. visit https://nodejs.org/en/ and download

### Technologies used

*node.js
*Express.js
*Bootstrap 
*Cheerio
*Mongoose
*MongoDB

### Getting Started
This app is built with anf made possible with the following npm packages:

* express 
* express-handlebars
* cheerio 
* mongoose 


Type `npm install` in the command line to install all the dependcies located within package.json

## Default test (included in package.json file)
In order to connect to the scraper web app on the local server, type the following in the command line:

 `node server.js`

The user will also be notified in the command line interface on which PORT its connected on.

`localhost:port/scrape` will scrape the NPR website

`localhost:port/articles` will display all the scraped articles from NPR.com



### Author
* [L. Karim](https://github.com/lylekarim)

