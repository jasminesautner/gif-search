// app1.js
var express = require('express');
var app = express();
var exphbs = require('express-handlebars')
// REQUIRE HTTP MODULE
var http = require('http');
// INITIALIZE THE GIPHY-API LIBRARY 
var giphy = require('giphy-api')();


app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');
app.use(express.static('public'));

app.get('/', function (req, res) {
    console.log(req.query.term)
    var queryString = req.query.term;
    // ENCODE THE QUERY STRING TO REMOVE WHITE SPACES AND RESTRICTED CHARACTERS
    var term = encodeURIComponent(queryString);
    // PUT THE SEARCH TERM INTO THE GIPHY API SEARCH URL
    var url = 'http://api.giphy.com/v1/gifs/search?q=' + term + '&api_key=dc6zaTOxFJmzC';

    http.get(url, function(response) {
        // SET ENCODING REPSONSE TO UTF8
        response.setEncoding('utf8');

        var body = '';

        response.on('data', function(d) {
            // CONTINUOUSLY UPDATAE STREAM W/ DATA FROM GIPHY 
            body += d;
        });

        response.on('end', function() {
            // WHEN DATA IS FULLY RECIEVED PARSE INTO JSON
            var parsed = JSON.parse(body);
            //RENDER THE HOME TEMPLATE AND PASS THE GIPHY DATA
            res.render('home', {gifs: parsed.data})
        });
    });
});

app.get('/hello-gif', function (req, res) {
    // Look up user from database
    // render template to display user's info
    var gifUrl = 'http://media2.giphy.com/media/gYBVM1igrlzH2/giphy.gif'
    res.render('hello-gif', {gifUrl: gifUrl});
})

app.listen(3000, function () {
    console.log('Gif Search listening on port localhost:3000!');
});


