var express = require('express');
var bodyParser = require('body-parser');
var mongo = require('mongodb').MongoClient;

var url = "mongodb://localhost:27017/app";
var port = 3000;


var app = express();
var db;

app.set('views', './views');
app.set('view engine', 'pug');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(function(req,res,next){
    req.db = db;
    next();
});

app.use(express.static(__dirname + '/public'));


app.get('', function (req, res) {
  db.collection('thinglist').find().toArray(function (err, items) {
      res.render('index', {
          title: 'Список',
          thinglist: items
      });
  });
});

app.get('/', function (req, res) {
  res.render('index', { title: 'Hey', message: 'App started!'});
});

app.get('/thinglist', function(req, res) {
    db.collection('thinglist').find().toArray(function (err, items) {
        res.render('index', {
            title: 'Список',
            thinglist: items
        });
    });
});

/* GET New Thing page. */
app.get('/newthing', function(req, res) {
    res.render('newthing', { title: 'Добавить фотографию' });
});


/* POST to Add Thing  */
app.post('/addthing1', function(req, res) {

    // Set our internal DB variable

    // Get our form values. These rely on the "name" attributes
    var thingName = req.body.name;
    var thingPrice = req.body.price;

    // Set our collection
    db.collection('thinglist').insert({
        "name" : thingName,
        "price" : thingPrice
    }, function (err, doc) {
        if (err) {
            // If it failed, return error
            res.send("There was a problem adding the information to the database.");
        }
        else {
            // If it worked, set the header so the address bar doesn't still say /adduser
            res.location("/thinglist");
            // And forward to success page
            res.redirect("/thinglist");
        }
    });
});

/*
 * POST to deletething.
 */


app.post('/thing/:id/delete', function (req, res) {
    var thingToDelete = req.body._id;
    db.collection('thinglist').removeById(thingToDelete, function(err, result) {
        //res.send((result === 1) ? { msg: '' } : { msg:'error: ' + err });
        res.redirect("/home");
      });
});

//update thing
app.get("/thing/:id/edit", function (req, res) {
    db.collection('thinglist').findById(req.param('_id'), function (err, thing) {
        res.render('editthing',
            {
                title: 'Редактировать информацию',
                name: thing.name,
                thing: thing
            });
      });
});

/*
 * POST to updatething.
 */

app.post('/thing/:id/edit', function (req, res)  {
    var thingId = req.body._id;
    var thingName = req.body.name;
    var thingPrice = req.body.price;

    db.collection('thinglist').updateById(thingId, {
        "name": thingName,
        "price": thingPrice
    }, function (error, docs) {
        res.redirect('/home');
    });
});


app.get('/things/thinglist', function(req, res) {
    db.collection('thinglist').find().toArray(function (err, items) {
        res.json(items);
    });
});

app.get('/things/', function(req, res) {
    db.collection('thinglist').find().toArray(function (err, items) {
        res.render('index', {
            title: 'Список',
            thinglist: items
        });
    });
});

/*
 * POST to addthing.
 */
app.post('/things/addthing', function(req, res) {
    db.collection('thinglist').insert(req.body, function(err, result){
        res.send(
            (err === null) ? { msg: '' } : { msg: err }
        );
    });
});

//update thing
app.get("/things/thing/:id/edit", function (req, res) {
    var thingId = req.body._id;
    var thingName = req.body.name;
    var thingPrice = req.body.price;
    db.collection('thinglist').findById(thingId, function (err, item) {
        res.render('editthing',
            {
                name: thingName,
                price: thingPrice
            });
    });
});

mongo.connect(url, function (err, client) {
  if (err) {
    return console.log(err);
  }
  db = client.db("test");
  app.listen(port, function () {
    // console.log("API started");
    console.log("mongodb connected");
    console.log("App listening on http://localhost:" + port + "/");
  });
});
