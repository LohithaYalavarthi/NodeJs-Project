const express = require("express");
const router = express.Router();
const Article = require("../models/article");
const fs = require("fs");
const methodOverride = require("method-override");
const article = require("../models/article");
const { db } = require("../models/article");
router.get("/new", (req, res) => {
  res.render("articles/new", { article: new Article({}) });
});
router.get("/edit/:_id", (req, res) => {
  const id = req.params._id;
  let articles = JSON.parse(fs.readFileSync("articles.json"));
  articles = articles.map((element) => {
    return JSON.parse(element);
  });
  const article = articles.filter((article) => article._id === id);
  // const article = Article.findById(id) in databse
  res.render("articles/edit", { article: article[0] });
});
const resultsPerPage = 30;

// db.query(sql, (err, result) => {
//   if (err) throw err;
//   const numofResults = results.length;
//   const numberofPages = Math.ceil(numofResults / resultsPerPage);
//   const page = req.query.page;
//   console.log("page", page);
//   res.render("pagination", { data: result });
// });

router.get("/:slug", (req, res) => {
  const slug = req.params.slug;
  let articles = JSON.parse(fs.readFileSync("articles.json"));
  articles = articles.map((element) => {
    return JSON.parse(element);
  });
  // const article = Article.findById(id); - this is from database
  let article = articles.find((article) => article.slug === slug);
  res.render("articles/show", { articles: [article] });
});

router.post(
  "/",
  async (req, res, next) => {
    req.article = new Article();
    next();
  },
  saveArticleAndRedirect("")
);
router.delete("/:_id", async (req, res) => {
  // await Article.findByIdAndDelete(req.params.id); for mongo db
  const id = req.params._id;
  let articles = JSON.parse(fs.readFileSync("articles.json"));
  articles = articles.filter((elem) => {
    article_parse = JSON.parse(elem);
    return article_parse._id != id;
  });
  fs.writeFileSync("articles.json", JSON.stringify(articles));
  res.redirect("/");
});

router.put(
  "/:id",
  async (req, res, next) => {
    let id = req.params.id;
    // req.article = await Article.findById(req.params.id)
    let articles = JSON.parse(fs.readFileSync("articles.json"));
    articles = articles.filter((elem) => {
      article_parse = JSON.parse(elem);
      return article_parse._id === id;
    });

    if (articles) {
      req.article = JSON.parse(articles[0]);
    }
    next();
  },
  saveArticleAndRedirect("edit")
);

function saveArticleAndRedirect(path) {
  return async (req, res) => {
    let article = req.article;
    article.title = req.body.title;
    article.description = req.body.description;
    article.markdown = req.body.markdown;
    const id = req.params.id;

    try {
      article = await article.save();
      const dataJSON = JSON.stringify(article);
      fs.writeFileSync("articles.json", dataJSON);
      res.redirect(`/articles/${article.slug}`);
    } catch (e) {
      let file_value = fs.readFileSync("articles.json").length;
      let fileData = file_value
        ? JSON.parse(fs.readFileSync("articles.json"))
        : [];
      if (path === "edit") {
        articles = fileData.filter((elem) => {
          article_parse = JSON.parse(elem);
          return article_parse._id != id;
        });

        fileData = articles;
      }

      fileData.push(JSON.stringify(article));
      fs.writeFileSync("articles.json", JSON.stringify(fileData));
      res.redirect(`/articles/${article.slug}`);

      // res.render("articles/new", { article: article });
    }
  };
}

module.exports = router;
