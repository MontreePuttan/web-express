var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var db = require('./db');

var urlencodedParser = bodyParser.urlencoded({extended: false});

app.set('view engine', 'ejs');
app.use('/assets', express.static('assets'))



app.get('/', function (req, res) {
    res.send('Hello');
});

app.get('/profile/:id', function (req, res) {
    //console.log(req.url);
    res.send('Hi ID : ' + req.params.id);
});

app.get('/contact', function (req, res) {
    res.sendFile(__dirname + '/contact.html');
});

app.get('/about/:name', function (req, res) {
    //console.log(req.url);
    var datas = {age: 29, job: 'ninja', hobbies: ['eating', 'fighting', 'fishing']};
    res.render('about', {person: req.params.name, data: datas});
});


app.get('/location', function (req, res) {
    //console.log(req.url);
    res.render('locations');
});

//method get
app.get('/queryStrings', function (req, res) {
    console.log(req.query);
    res.render('queryStrings', {qs: req.query});
});

//method post
app.post('/queryStrings', urlencodedParser, function (req, res) {
    console.log(req.body);
    res.render('queryStrings-success', {data: req.body});
});

app.get('/show', function (req, res) {

    db.query('SELECT * FROM users', function (err, rows, fields)
    {
        if (err)
            throw err;

        //console.log(rows[0]); 
        res.render('showData', {data: rows});
    });
});

app.get('/insert', function (req, res) {

    var post = {firstname: 'nat', lastname: 'tan', email: 'ttt@g.com'};
    var query = db.query('INSERT INTO users SET ?', post, function (err, result) {
        // Neat!
    });
    console.log(query.sql);
    res.send('Pass');
});

app.get('/formupdate', function (req, res) {

    res.render('formUpdate');
});

app.get('/forminsert', function (req, res) {

    res.render('forminsert');
});

app.post('/forminsert', urlencodedParser, function (req, res) {
    
    var firstname = req.body.firstname;
    var lastname = req.body.lastname;
    var email = req.body.email;
    
    var post = {firstname: firstname, lastname: lastname, email: email};
    var query = db.query('INSERT INTO users SET ?', post, function (err, result) {
        if (query) {
            res.redirect('/show');
        } else {
            console.log('No');
        }
    });;

    //res.send('Hi ID : ' + req.body.firstname);
    //console.log(firstname);
});

app.get('/getformupdate/:id', function (req, res) {

    var id = req.params.id;
    //console.log(id); 


    db.query('SELECT * FROM users where id = ?', id, function (err, rows, fields)
    {
        if (err)
            throw err;

        //console.log(rows); 
        res.render('formupdate', {data: rows});
    });


});

app.post('/getformupdate', urlencodedParser, function (req, res) {

    //console.log(req.body);

    var id = req.body.id;
    var firstname = req.body.firstname;
    var lastname = req.body.lastname;
    var email = req.body.email;

    var query = db.query('update users SET firstname = ? , lastname = ? , email = ? where id = ?', [firstname, lastname, email, id], function (err, result) {

        if (query) {
            res.redirect('/show');
            console.log('Yes');
            var b = new Buffer('123');
            var s = b.toString('base64');
            var m = b.toString('utf8');
            console.log(s);
            console.log(m);
        } else {
            console.log('No');
        }

    });


    //console.log(query.sql);
});


app.get('/update', function (req, res) {

    //console.log(query.sql);
    res.send('Pass');
    /*
     var text = 'nat222';
     var ids = 7;
     var query = db.query('update users SET firstname = ? where id = ?', [text,ids], function(err, result) {
     
     });
     console.log(query.sql);
     res.send('Pass');
     */
});


//404 page
app.get('*', function (req, res) {
    res.render('404');
});



app.listen(3000, function () {
    console.log("Server start port 3000");
});