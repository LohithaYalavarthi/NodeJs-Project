const express = require("express");
const app = express();
const articleRouter = require("./routes/articles");
// const Article = require("./models/article");
// const mongoose = require("mongoose");
const fs = require("fs");
const methodOverride = require("method-override");
const axios = require("axios");

// mongoose.connect("mongodb://localhost/blog", {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
//   useCreateIndex: true,
// });

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: false }));
app.use(methodOverride("_method")); // for put and delete
app.use(express.static("public"));
app.get("/", (req, res) => {
  let articles = [];
  if (fs.readFileSync("articles.json").length > 0) {
    articles = JSON.parse(fs.readFileSync("articles.json"));
  }
  // const articles = new Article({
  //   title: "Test Article",
  //   createdAt: new Date(),
  //   description: "Test Description",
  //   id: 1,
  // });
  article_parsed =
    articles.length >= 0
      ? articles.map((element) => {
          let parsed_element = JSON.parse(element);
          return parsed_element;
        })
      : [];
  //if database content use articles = Article.find()
  res.render("articles/index", {
    articles: article_parsed,
  });
});
app.get("/pagination", (req, res) => {
  let resultsPerPage = 3;
  // res.set({ "Content-Type": "application/xhtml+xml; charset=utf-8" });
  axios
    .get(`https://jsonplaceholder.typicode.com/posts`)

    // Print data
    .then((response) => {
      // res.render("pagination", { data: response.data });
      const data = response.data;
      const numofResults = data.length;
      const numberofPages = Math.ceil(numofResults / resultsPerPage);
      // console.log("req.query", req.query);
      const page = req.query.page ? Number(req.query.page) : 1;
      if (page > numberofPages) {
        // res.redirect("/pagination?page=" + encodeURIComponent(numberofPages));
      }
      if (page < 0) {
        // res.redirect("/pagination?page=" + encodeURIComponent("0"));
      }
      const startingLimit = page * resultsPerPage;
      let pagedisplayresults = [];
      for (let i = startingLimit; i <= startingLimit + resultsPerPage; i++) {
        // console.log(
        //   "startingLimit",
        //   startingLimit,
        //   startingLimit + resultsPerPage,
        //   data[i]
        // );

        // if (data[i].id === i) {
        pagedisplayresults.push(data[i]);
        // // }
        // console.log("here", pagedisplayresults);
      }
      // console.log("response", pagedisplayresults, numberofPages);

      let iterator = page - 5 <= -1 ? 1 : page - 5;
      let endingLink =
        iterator + 9 <= numberofPages
          ? iterator + 9
          : page + numberofPages - page;
      if (endingLink < page + 4) {
        iterator -= page + 4 - numberofPages;
      }
      if (!pagedisplayresults.includes(undefined)) {
        res.render("pagination", {
          data: pagedisplayresults,
          page,
          iterator,
          endingLink,
          numberofPages,
        });
      }
    })
    .catch((err) => {
      console.log("err", err);
    });
});

app.use("/articles", articleRouter);

app.listen(5000);
