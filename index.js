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
const nbAnneau = 144; 
const nbLeds = nbLedParAnneau * nbAnneau;
const color = 0xcdd100;

var instance=wave;
var dbInstance=dbmeter;
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


let dataDb = {
	dbmax :110,
	seuil:50,
	dbapp:120	
}

const gauge = {
	nbLedParAnneau : nbLedParAnneau ,
	nbAnneau : nbAnneau,
	nbLeds : nbLedParAnneau * nbAnneau,
	color : color,
	strip : ws281x,
	channel : channel,
	colorArray : colorArray
}

const { SerialPort } = require('serialport');
const { ReadlineParser } = require('@serialport/parser-readline');
const port = new SerialPort({ path: '/dev/ttyUSB0', baudRate: 115200,autoOpen: true });
const parser = port.pipe(new ReadlineParser({ delimiter: '\r\n' }));

parser.on('data', function(data){
  dbLevel = data;
  console.log(dbLevel);
  dbInstance.setdB(data);
})

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
	res.render('index',dataDb);
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
	dbLevel = req.params.db;
	dbInstance.setdB(dbLevel);
	res.send(200);
});

app.get('/setdbmin', function(req, res) {
	var val = req.query.setdbmin;
	console.log(val);
	dataDb.seuil = val;
	dbInstance.setDataDb(gauge,dataDb);
	res.render('index',dataDb);
});

app.get('/setdbmax', function(req, res) {
	var val = req.query.setdbmax;
	console.log(val);
	dataDb.dbmax = val;
    dbInstance.setDataDb(gauge,dataDb);
	res.render('index',dataDb);
});

app.get('/getdb', function(req, res) {
	res.send(dbLevel);
});

// index page
app.get('/blink', function(req, res) {
    instance.stop();
	dbInstance.stop();
	instance = blink;
	instance.start("",gauge);
	res.render('index',dataDb);
});
  
// index page
app.get('/wave', function(req, res) {
	instance.stop();
	dbInstance.stop();
	instance = wave;
	instance.start("",gauge);
	res.render('index',dataDb);
});

// index page
app.get('/on', function(req, res) {
	dbInstance.stop();
	instance.stop();
	lightAll();
	res.render('index',dataDb);
});

// index page
app.get('/off', function(req, res) {
	dbInstance.stop();
	instance.stop();
	clearAll();
	res.render('index',dataDb);
});

// index page
app.get('/dbmeter', function(req, res) {
	clearAll();
	instance.stop();
	dbInstance.stop();
    dbInstance.start("",gauge,dataDb);
	res.render('index',dataDb);
});

app.listen(80,function(){ 
	//instance = wave;
	dbInstance.start("",gauge,dataDb);
	
});
console.log('8080 is the magic port');


