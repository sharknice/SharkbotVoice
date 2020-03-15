var say = require('say');
var express = require('express');
var fs = require('fs');
var cors = require('cors');
var app = express();

const voice = "";//"Microsoft David Desktop"

app.use(cors());

let rawdata = fs.readFileSync('voices.json');
let voices = JSON.parse(rawdata);

var talkingNow = false;
say.getInstalledVoices((err) => {
    if (err) {
      return console.error(err)
    }
});
console.log("sharkbot voice online");

say.speak('hello world', voice);

app.get('/', function (req, res) {
    say.speak('sharkbot voice online');
    res.end("success");
});

app.get('/speak/:message', function (req, res) {
    if (!talkingNow) {
        talkingNow = true;
        say.speak(req.params.message, voice, 1.0, function (error) {
            talkingNow = false;
        });
    }
    res.send("success");
});

app.get('/slitherspeak/:event', function (req, res) {
    if (!talkingNow) {
        talkingNow = true;
        var line = getLine(req.params.event);
        if (line) {
            say.speak(line, voice, 1.0, function (error) {
                talkingNow = false;
            });
        } else {
            talkingNow = false;
        }
    }
    res.send("success");
});

function getLine(event) {
    if (voices[event]) {
        return voices[event][Math.floor(Math.random() * voices[event].length)];
    }
    return false;
}

app.get('/slithergreet/:name', function (req, res) {
    if (!talkingNow) {
        talkingNow = true;
        var line = getGreet(req.params.name);
        if (line) {
            say.speak(line, voice, 1.0, function (error) {
                talkingNow = false;
            });
        } else {
            talkingNow = false;
        }
    }
    res.send("success");
});

function getGreet(name) {
    if (voices["greet"] && name) {
        return voices["greet"][Math.floor(Math.random() * voices["greet"].length)].replace("%name", name);
    }
    return false;
}

var server = app.listen(8081, function () {
    var host = server.address().address
    var port = server.address().port

    console.log("sharkbot voice listening at http://%s:%s", host, port)
});