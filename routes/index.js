var express = require('express');
var router = express.Router();
var app = express();
var mongo = require('mongodb').MongoClient;



//////
app.get('/hello', function (req, res) {
    res.send('Hello, World!')
})
////////////////

app.get('/thinglist', function(req, res) {
    var db = req.db;
    db.collection('thinglist').find().toArray(function (err, items) {
        res.json(items);
    });
});

app.get('/home', function(req, res) {
    db.collection('thinglist').find().toArray(function (err, items) {
        res.render('index', {
            title: 'Кисоньки',
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
    var db = req.db;

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
            res.location("/home");
            // And forward to success page
            res.redirect("/home");
        }
    });
});

/*
 * POST to deletething.
 */


app.post('/thing/:id/delete', function (req, res) {
    var db = req.db;
    var thingToDelete = req.body._id;
    db.collection('thinglist').removeById(thingToDelete, function(err, result) {
        //res.send((result === 1) ? { msg: '' } : { msg:'error: ' + err });
        res.redirect("/home");
    });
});

//update thing
app.get("/thing/:id/edit", function (req, res) {
    var db = req.db;
    var thingId = req.params._id;
    var thingName = req.body.name;
    var thingPrice = req.body.price;
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

    var db = req.db;
    var thingId = req.body._id;
    var thingName = req.body.name;
    var thingPrice = req.body.price;

    db.collection('thinglist').updateById(thingId, {
        "name": thingName,
        "price": thingPrice
    }, function (error, docs) {
        res.redirect('/home')
    });
});

module.exports = app;
