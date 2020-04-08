var express = require('express'); // 웹서버 사용
var app = express();
var port = 8000;
var ejs = require('ejs');

var moment = require('moment');
require('moment-timezone');
moment.tz.setDefault("Asia/Seoul");

var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.get('/', function (req, res) {
    var r = req.query;
    var date = moment();

    r.email = "xjubep@gmail.com";
    r.stuno = "20141496";
    r.time = date.format('YYYY-MM-DD HH:mm:ss');
    r.ip = req.ip.replace(/^.*:/, '');
    console.log(r);
    res.send(JSON.stringify(r));
});

app.get('/iot', function (req, res) {
    var r = req.query;

    console.log(r);
    res.send(JSON.stringify(r));
});

app.post('/', function (req, res) {
    var r = req.body;
    var date = moment();

    r.email = "xjubep@gmail.com";
    r.stuno = "20141496";
    r.time = date.format('YYYY-MM-DD HH:mm:ss');
    r.ip = req.ip.replace(/^.*:/, '');
    res.send(JSON.stringify(r));
});

app.set('views', __dirname + '/views');
app.set('view engine', 'html');
app.engine('html', ejs.renderFile);

app.get('/mask_geo', function(req, res) {
    res.render('near_mask_by_geo.html');
});

app.get('/mask_addr', function(req, res) {
    res.render('near_mask_by_addr.html');
});

var server = app.listen(port, function() {
    console.log('Success');
})