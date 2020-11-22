const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./db/shoutbox.db');
const db2 = new sqlite3.Database('./db/shoutbox2.db');
const bodyParser = require('body-parser')
const port = process.env.PORT || 3000;
const app = express();

app.set('view engine', 'ejs');

app.use('/public', express.static(process.cwd() + '/public'));
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.get('/add-entry', function (req, res) {
    db.all('SELECT * FROM shouts ORDER BY message DESC;', (err, rows) => {
        res.render('pages/add-entry', { shouts: rows })
    });
});

app.get('/add-entry2', function (req, res) {
    db2.all('SELECT * FROM hardscore ORDER BY hard DESC', (err, rows) => {
        res.render('pages/add-entry2.ejs', { hardscore: rows })
    });
});



app.get('/', function (req, res) {
    res.render('pages/index');
});

app.get('/game', function (req, res) {
    res.render('pages/game');
});

app.get('/hardcore', function (req, res) {
    res.render('pages/hardcore');
});


app.post('/update-score', function (req, res) {
    db.run('INSERT INTO shouts(username, message) VALUES (?, ?);', [req.body.username, req.body.score], (err) => {
        if (err) {
            res.redirect('/add-entry');
        }
    });
});

app.post('/update-hardscore', function (req, res) {
    db2.run('INSERT INTO hardscore(hard) VALUES (?);', [req.body.hard], (err) => {
        if (err) {
            res.redirect('/add-entry2');
        }
    });
});

const server = app.listen(port, () => {
    console.log(`Server listening on port wat ${port}…`)
});

module.exports = server;