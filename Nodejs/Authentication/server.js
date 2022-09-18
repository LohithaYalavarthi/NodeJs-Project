if (process.env.NODE_ENV !== "production") {
  require("dotenv").config()
}
const express = require("express")
const app = express()
const bcrypt = require("bcrypt")

const passport = require("passport")
const flash = require("express-flash")
const session = require("express-session")
const methodOverrride = require("method-override")

const initializePassport = require("./passport-config")
initializePassport(
  passport,
  (email) => users.find((user) => user.email === email),
  (id) => users.find((user) => user.id === id)
)

app.set("view engine", "ejs")
const users = []
app.use(express.urlencoded({ extended: false }))
app.use(flash())
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false, // resave if nothing changed
    saveUninitialized: false, // telling save empty value
  })
)
app.use(methodOverrride("_method"))

app.use(passport.initialize())
app.use(passport.session()) // store the data in entire session
app.get("/", checkAuthenticated, (req, res) => {
  res.render("index", { name: req.user.name })
})

app.get("/login", checkNotAuthenticated, (req, res) => {
  res.render("login")
})

app.get("/register", checkNotAuthenticated, (req, res) => {
  res.render("register")
})

app.post("/register", checkNotAuthenticated, async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10)
    users.push({
      id: Date.now().toString(),
      name: req.body.name,
      password: hashedPassword,
      email: req.body.email,
    })
    res.redirect("/login")
  } catch {
    res.redirect("/register")
  }
})
app.delete("/logout", (req, res) => {
  req.logout()
  req.redirect("/login")
})
app.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/login",
    failureFlash: true,
  })
)
function checkAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next()
  }
  res.redirect("/login")
}
function checkNotAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return res.redirect("/")
  }
  next()
}
app.listen(3000)