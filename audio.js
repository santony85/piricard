var express = require('express');
var app = express();

const { SerialPort } = require('serialport');
const { ReadlineParser } = require('@serialport/parser-readline')
const port = new SerialPort({ path: '/dev/ttyUSB0', baudRate: 115200,autoOpen: true })
const parser = port.pipe(new ReadlineParser({ delimiter: '\r\n' }))
parser.on('data', function(data){
  console.log(data)	
})



app.listen(8080,function(){ 
	//instance = wave;
	//dbInstance.start("",gauge,dataDb);
	
});
console.log('8080 is the magic port');
