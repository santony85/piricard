function wave(){
	
	var dir=0;
	var posLed=0;
	var isRun=0;
	
	this.start = function (args, gauge) {
		console.log("Going wave mode.");
		isRun=1;
		this.WaveTick(args, gauge);
	};
	
	this.stop = function (){
	  isRun=0;	
	}
	
	this.colorWipeOn = function(val,gauge){
	  for(let i=0;i<gauge.nbLedParAnneau;i++){
		gauge.colorArray[i+(val*gauge.nbLedParAnneau)] = gauge.color;  
	  }
	};
	
    this.colorWipeOff = function(val,gauge){
	  for(let i=0;i<gauge.nbLedParAnneau;i++){
		gauge.colorArray[i+(val*gauge.nbLedParAnneau)] = 0x000000;  
	  }
	};
	
	this.WaveTick = function (args, gauge) {
	  var _this = this;	  
	  if(dir==0){
		this.colorWipeOn(posLed,gauge);
		if(posLed==gauge.nbAnneau){
			dir=1;
			posLed=0;
		  }
		  else posLed++; 
	  }
	  else {
		this.colorWipeOff(posLed,gauge);
		if(posLed==gauge.nbAnneau){
			dir=0;
			posLed=0;
		  }
		  else posLed++;   
	  }
	  gauge.strip.render();
	  
	  setTimeout(function () {
		if(isRun)_this.WaveTick(args, gauge);
		//console.log("thick");
	  }, 10);	  
	}
}

module.exports = new wave();