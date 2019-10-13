var express = require("express");
var bodyParser = require("body-parser");
var app = express();
var cookieParser = require("cookie-parser");
var session = require("express-session");
var morgan = require("morgan");
var db = require("./database");

app.use(morgan("dev"));
app.use("/", express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(bodyParser.text());
app.use(cookieParser());
app.use(
  session({
    key: "user_sid",
    secret: "somerandonstuffs",
    resave: false,
    saveUninitialized: false,
    cookie: {
      expires: 600000
    }
  })
);
var sessionUser;
var tasks = [];
app.use((req, res, next) => {
  console.log("session:", req.session.user);
  console.log("cookies:", req.cookies.user_sid);
  if (req.cookies.user_sid && !req.session.user) {
    res.clearCookie("user_sid");
  }
  next();
});

var sessionChecker = (req, res, next) => {
  if (req.session.user && req.cookies.user_sid) {
    res.redirect("/dashboard.html");
  } else {
    next();
  }
};

app.post("/register", function(req, res) {
  try {
    db.registerUser(req.body.email, req.body.password);
    res.redirect("/login");
  } catch (e) {
    res.sendStatus(404);
  }
});

app.get("/login", sessionChecker, (req, res) => {
  res.sendFile(__dirname + "/public/login.html");
  // res.redirect("/login");
});

app.post("/login", (req, res) => {
  db.Login(req.body.email, req.body.password, function(users) {
    if (!users) {
      res.redirect("/login");
    } else if (users.password != req.body.password) {
      res.redirect("/login");
    } else {
      req.session.user = users;
      console.log("session:", req.session.user);
      console.log("cookies:", req.cookies.user_sid);
      sessionUser = req.session.user;
      console.log(sessionUser);

      res.redirect("/dashBoard");
    }
  });
});

app.get("/dashBoard", (req, res) => {
  if (sessionUser && req.cookies.user_sid) {
    db.getTask(sessionUser._id, function(result) {
      tasks = result;
      console.log(tasks);
    });
    res.sendFile(__dirname + "/public/dashBoard.html");
  } else {
    res.redirect("/login");
  }
});
app.post("/add", function(req, res) {
  try {
    db.insertDocs(req.body.todo, sessionUser._id, function(insertedIds) {
      tasks.push({ _id: insertedIds, a: req.body.todo });

      res.send({ _id: insertedIds, a: req.body.todo });
      console.log(insertedIds);
    });
  } catch (e) {
    console.log(e);
    res.sendStatus(200);
  }
});

app.get("/data", function(req, res) {
  db.getTask(sessionUser._id, function(result) {
    tasks = result;
    res.send(tasks);
    console.log(tasks);
  });
});

app.post("/del", function(req, res) {
  try {
    let index = req.body.id;
    let p_id = req.body.p_id;
    tasks.splice(index, 1);

    // console.log(tasks);
    db.deleteDocs(p_id, function(result) {
      console.log(result.result);

      res.send(tasks);
      console.log(tasks);
    });
  } catch (e) {
    console.log(e);
  }
});
app.post("/update", function(req, res) {
  try {
    let updval = req.body.value;
    let index = req.body.index;
    let p_id = req.body.id;

    console.log(p_id);

    // console.log(updval);
    db.update(p_id, updval, function(insertedId) {
      tasks[index] = { _id: p_id, a: updval };
      res.send(tasks);

      console.log(tasks);
    });
  } catch (e) {
    e.sendStatus(500);
    console.log("enable to update");
  }
});
app.get("/logout", (req, res) => {
  if (req.session.user && req.cookies.user_sid) {
    res.clearCookie("user_sid");
    req.session.destroy();
    tasks = [];
    res.redirect("/");
  } else {
    res.redirect("/login");
  }
});

app.listen(5500, function() {
  console.log("server running on port 5500");
  db.connect();
});
