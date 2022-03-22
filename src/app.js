const express = require("express");
const path = require("path");
const hbs = require("hbs");
const forecast = require("./utils/forecast");
const geocode = require("./utils/geocode");

console.log("__dirname", __dirname); //dir name
console.log("__filename", __filename); //file name
console.log("path", path.join(__dirname, "../public")); //file name

const app = express(); // generate express

//Define paths for Express config
const public = path.join(__dirname, "../public");
const viewPath = path.join(__dirname, "../templates/views");

const partialsPath = path.join(__dirname, "../templates/partials");

//Setup handle bars engine and views location -customizing, default would be views folder
app.set("view engine", "hbs"); // to set handle bars (template engine) for dynamic page
app.set("views", viewPath); //customizing it

//setting up handle bars - registerPartials take the path
hbs.registerPartials(partialsPath);

//Setup static directory to serve
app.use(express.static(public)); //way to customise server

//app.com - Home Page
//app.com/help
//app.com/about
app.get("", (req, res) => {
  res.render("index", {
    title: "Weather App",
    name: "Lohitha",
  });
  //res.send("")
});

app.get("/about", (req, res) => {
  res.render("about", {
    title: "About me",
    name: "Lohitha",
  });
});

app.get("/help", (req, res) => {
  res.render("help", {
    title: "Help",
    paragraph: "This is the help page",
    name: "Lohitha",
  });
});

//we have removed this because we created help and about html pages inside public we can
///,,,, we can directly navigate to that
// app.get("/help", (req, res) => {
//   res.send({
//     name: "Andrew",
//     age: 27,
//   });
// });

// app.get("/about", (req, res) => {
//   res.send();
// });
app.get("/weather", (req, res) => {
  const address = req.query.address;
  if (!address) {
    return res.send({
      error: "No address provided",
    });
  } else {
    geocode(address, (error, { latitude, longitude, location } = {}) => {
      if (error) {
        return res.send({
          error,
        });
      } else {
        forecast(latitude, longitude, (error, forecastdata) => {
          if (error) {
            return res.send({
              error,
            });
          }
          // console.log(location);
          // console.log(forecastdata);
          res.send({
            forecast: forecastdata,
            location,
            address,
          });
        });
      }
    });
  }
});
app.get("/products", (req, res) => {
  const query = req.query;
  if (!query.search) {
    return res.send({
      error: "You must provide a search term",
    });
  }
  console.log("query", query.search);
  res.send({
    products: [],
  });
});
//Matching any routes after help/ eg : help/test
app.get("/help/*", (req, res) => {
  res.render("404page", {
    title: "404",
    error: "Help article not found",
    name: "Lohitha",
  });
});

//for 404 pages - to match any routes - *
app.get("*", (req, res) => {
  res.render("404page", {
    title: "404",
    error: "Page not found",
    name: "Lohitha",
  });
});

//to start the server - 2nd argument is callback
app.listen(3000, () => {
  console.log(`Server is up on port 3000`);
});
