
const express = require("express");
const app = express.Router();
var db = require("../models");
var axios = require("axios");
var cheerio = require("cheerio");



// A GET route for scraping the echoJS website
app.get("/scrape", function (req, res) {
  // First, we grab the body of the html with axios
  axios.get("http://www.npr.com/").then(function (response) {
   
  //  if (!error && response.statusCode === 200) {
  // Then, we load that into cheerio and save it to $ for a shorthand selector
    var $ = cheerio.load(response.data);
  
    let count = 0;
    // Now, we grab every h2 within an article tag, and do the following:
    $("article h2").each(function (i, element) {
      let count = i;
      // Save an empty result object
      var result = {};

      // Add the text and href of every link, and save them as properties of the result object
      result.title = $(this)
        .children("a")
        .text();
      result.link = $(this)
        .children("a")
        .attr("href");

      result.summary = $(this)
        .children("a")
        .attr("href");

      // Create a new Article using the `result` object built from scraping
      if (result.title && result.link) {

        db.Article.create(result)
          .then(function (dbArticle) {
            // View the added result in the console
            console.log(dbArticle);
            count++;
          })
          .catch(function (err) {
            // If an error occurred, log it
            console.log(err);
          });
      };
    });

    // Send a message to the client
    //res.send("Scrape Complete");
    res.redirect('/')
  //}
  // else if (error || response.statusCode != 200) {
  //   res.send("Error: Unable to obtain new articles")
  // }
});
});

app.get("/", (req, res) => {
  db.Article.find({})
    .then(function (dbArticle) {
      // If we were able to successfully find Articles, send them back to the client
      const retrievedArticles = dbArticle;
      let hbsObject;
      hbsObject = {
        articles: dbArticle
      };
      res.render("index", hbsObject);
    })
    .catch(function (err) {
      // If an error occurred, send it to the client
      res.json(err);
    });
});
app.get("/saved", (req, res) => {
  db.Article.find({isSaved: true})
      .then(function (retrievedArticles) {
          // If we were able to successfully find Articles, send them back to the client
          let hbsObject;
          hbsObject = {
              articles: retrievedArticles
          };
          res.render("saved", hbsObject);
      })
      .catch(function (err) {
          // If an error occurred, send it to the client
          res.json(err);
      });
});

// Route for getting all Articles from the db
app.get("/articles", function (req, res) {
  // Grab every document in the Articles collection
  db.Article.find({})
      .then(function (dbArticle) {
          // If we were able to successfully find Articles, send them back to the client
          res.json(dbArticle);
      })
      .catch(function (err) {
          // If an error occurred, send it to the client
          res.json(err);
      });
});

app.put("/save/:id", function (req, res) {
  db.Article.findOneAndUpdate({ _id: req.params.id }, { isSaved: true })
    .then(function (data) {
      // If we were able to successfully find Articles, send them back to the client
      res.json(data);
    })
    .catch(function (err) {
      // If an error occurred, send it to the client
      res.json(err);
    });;
});

app.put("/remove/:id", function (req, res) {
  db.Article.findOneAndUpdate({ _id: req.params.id }, { isSaved: false })
    .then(function (data) {
      // If we were able to successfully find Articles, send them back to the client
      res.json(data)
    })
    .catch(function (err) {
      // If an error occurred, send it to the client
      res.json(err);
    });
});


// Route for grabbing a specific Article by id, populate it with it's note
app.get("/articles/:id", function (req, res) {
  // Using the id passed in the id parameter, prepare a query that finds the matching one in our db...
  db.Article.findOne({ _id: req.params.id })
    // ..and populate all of the notes associated with it
    .populate("note")
    .then(function (dbArticle) {
      // If we were able to successfully find an Article with the given id, send it back to the client
      res.json(dbArticle);
    })
    .catch(function (err) {
      // If an error occurred, send it to the client
      res.json(err);
    });
});

// Route for saving/updating an Article's associated Note
app.post("/articles/:id", function (req, res) {
  // Create a new note and pass the req.body to the entry
  db.Note.create(req.body)
    .then(function (dbNote) {
      // If a Note was created successfully, find one Article with an `_id` equal to `req.params.id`. Update the Article to be associated with the new Note
      // { new: true } tells the query that we want it to return the updated User -- it returns the original by default
      // Since our mongoose query returns a promise, we can chain another `.then` which receives the result of the query
      return db.Article.findOneAndUpdate({ _id: req.params.id }, { note: dbNote._id }, { new: true });
    })
    .then(function (dbArticle) {
      // If we were able to successfully update an Article, send it back to the client
      res.json(dbArticle);
    })
    .catch(function (err) {
      // If an error occurred, send it to the client
      res.json(err);
    });
});

app.delete("/articles/:id", function (req, res) {
  // find all notes attached to articles
  db.Note.findByIdAndRemove({ _id: req.params.id })
    .then(function (dbNote) {

      return db.Article.findOneAndUpdate({ note: req.params.id }, { $pullAll: [{ note: req.params.id }] });
    })
    .then(function (dbArticle) {
      // If we were able to successfully update an Article, send it back to the client
      res.json(dbArticle);
    })
    .catch(function (err) {
      // If an error occurred, send it to the client
      res.json(err);
    });
});

module.exports = app;