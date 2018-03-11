var express = require('express');
var router = express.Router();
var app = express();


app.get('/home', function(req, res) {
    res.send(304)
});


/*
 * GET thinglist.
 */
app.get('/thinglist', function(req, res) {
    var db = req.db;
    db.collection('thinglist').find().toArray(function (err, items) {
        res.json(items);
    });
});

app.get('/', function(req, res) {
    var db = req.db;
    db.collection('thinglist').find().toArray(function (err, items) {
        res.render('index', {
            title: 'Кисоньки',
            thinglist: items
        });
    });
});

/*
 * POST to addthing.
 */
app.post('/addthing', function(req, res) {
    var db = req.db;
    db.collection('thinglist').insert(req.body, function(err, result){
        res.send(
            (err === null) ? { msg: '' } : { msg: err }
        );
    });
});

//update thing
app.get("/thing/:id/edit", function (req, res) {
    var db = req.db;
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


module.exports = app;
