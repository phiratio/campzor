var express    = require("express"),
app            = express(),
bodyParser     = require("body-parser"),
flash          = require("connect-flash"), 
moment         = require("moment"),
mongoose       = require("mongoose"),
passport       = require("passport"),
LocalStrategy  = require("passport-local"),
methodOverride = require("method-override"),
Campground     = require("./models/campground.js"),
Comment        = require("./models/comment.js"),
User           = require("./models/user.js"),
seedDB         = require("./seeds.ejs");


var commentRoutes = require("./routes/comments"),
    campgroundRoutes = require("./routes/campgrounds"),
    authRoutes = require("./routes/index");


//for local dev purposes
//console.log(process.env.DATABASEURL);
//mongoose.connect(process.env.DATABASEURL || "mongodb://localhost/yelp_camp" );
mongoose.connect("mongodb://admin:admin@ds127300.mlab.com:27300/bojodb");
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.set('port', (process.env.PORT || 5000));
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());
//seedDB(); // seed the database
//PASSPORT CONFIGURATION
app.use(require("express-session")({
    secret: "very secret",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(authRoutes);
app.use(campgroundRoutes);
app.use(commentRoutes);

app.listen(app.get('port'), function () {
    console.log("Server started!");
});

// app.listen(process.env.PORT, process.env.IP, function(){
//     console.log(moment().add(2, 'h').format('HH:mm:ss') + " > server has started");
// });