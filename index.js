// load the things we need
var express = require('express');
var app = express();

// set the view engine to ejs
app.set('view engine', 'ejs');

// use res.render to load up an ejs view file

var blink = require("./animations/blink.js");
var wave = require("./animations/wave.js");
var dbmeter = require("./animations/dbmeter.js");

const nbLedParAnneau = 1;
const nbAnneau = 64;
const nbLeds = nbLedParAnneau * nbAnneau;
const color = 0xffcc22;

var instance=wave;
var dbLevel=100;

const ws281x = require('rpi-ws281x-native');

const options = {
  dma: 10,
  freq: 800000,
  gpio: 18,
  invert: false,
  brightness: 255,
  stripType: ws281x.stripType.WS2812
};


const channel = ws281x(nbLeds, options);
const colorArray = channel.array;

const gauge = {
	nbLedParAnneau : nbLedParAnneau ,
	nbAnneau : nbAnneau,
	nbLeds : nbLedParAnneau * nbAnneau,
	color : color,
	strip : ws281x,
	channel : channel,
	colorArray : colorArray
}



function clearAll(){
  for (let i = 0; i < channel.count; i++) {
	colorArray[i] = 0x000000;
	}
  ws281x.render();
}

function lightAll(){
  for (let i = 0; i < channel.count; i++) {
	colorArray[i] = color;
	}
  ws281x.render();
}

clearAll();

// index page
app.get('/', function(req, res) {
	res.render('index');
});

// index page
app.get('/screen', function(req, res) {
	res.render('screen',{db:dbLevel});
});

// index page
app.get('/screen', function(req, res) {
	res.render('screen');
});

app.get('/setdb/:db', function(req, res) {
    console.log(":db");
	res.render('index');
});


// index page
app.get('/blink', function(req, res) {
    instance.stop();
	instance = blink;
	instance.start("",gauge);
	res.render('index');
});

// index page
app.get('/wave', function(req, res) {
	instance.stop();
	instance = wave;
	instance.start("",gauge);
	res.render('index');
});

// index page
app.get('/on', function(req, res) {
	instance.stop();
	lightAll();
	res.render('index');
});

// index page
app.get('/off', function(req, res) {
	instance.stop();
	clearAll();
	res.render('index');
});

// index page
app.get('/dbmeter', function(req, res) {
	clearAll();
	instance.stop();
	instance = dbmeter;
	instance.start("",gauge);
	res.render('index');
});

app.listen(80,function(){ 
	instance = wave;
	instance.start("",gauge);
	
});
console.log('8080 is the magic port');


