var express = require('express');
var app = express();
var port = 8000;

var moment = require('moment');
require('moment-timezone');
moment.tz.setDefault("Asia/Seoul");

var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.get('/get', function (req, res) {
    var r = req.query;
    var date = moment();

    r.email = "xjubep@gmail.com";
    r.stuno = "20141496";
    r.time = date.format('YYYY-MM-DD hh:mm:ss');
    r.ip = req.ip.replace(/^.*:/, '');
    console.log(r);
    res.send(JSON.stringify(r));
});

app.post('/', function (req, res) {
    var r = req.body;
    var date = moment();

    r.email = "xjubep@gmail.com";
    r.stuno = "20141496";
    r.time = date.format('YYYY-MM-DD hh:mm:ss');
    r.ip = req.ip.replace(/^.*:/, '');
    res.send(JSON.stringify(r));
});

var server = app.listen(port, function() {
    console.log('Success');
})