var express = require('express');
var app = express();
var port = 8000;
var dateUtils = require('date-utils');
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

var time = new Date();

app.get('/get', function (req, res) {
    var r = req.query;

    r.email = "xjubep@gmail.com";
    r.stuno = "20141496";
    r.time = time.toFormat("YYYY-MM-DD HH:MI:SS");
    r.ip = req.ip.replace(/^.*:/, '');
    console.log(r);
    res.send(JSON.stringify(r));
});

app.post('/', function (req, res) {
    var r = req.body;

    r.email = "xjubep@gmail.com";
    r.stuno = "20141496";
    r.time = time.toFormat("YYYY-MM-DD HH:MI:SS");
    r.ip = req.ip.replace(/^.*:/, '');
    console.log(req.body);
    res.send(JSON.stringify(r));
});

var server = app.listen(port, function() {
    console.log('Success');
})