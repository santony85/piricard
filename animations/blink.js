function blink(){
	var isOn = 0;
	var isRun=0;
	
	this.start = function (args, gauge) {
		console.log("Going blink mode.");
		isRun=1;
		this.processTick(args, gauge);
	};
	
	this.stop = function (){
	  isRun=0;	
	}
	
	this.processTick = function (args, gauge) {
	  var _this = this;
	  if(!isOn){
		isOn=1;
		for (let i = 0; i < gauge.channel.count; i++) {
		  gauge.colorArray[i] = gauge.color;
		}
	  }
	  else {
		isOn=0;
		for (let i = 0; i < gauge.channel.count; i++) {
		  gauge.colorArray[i] = 0x000000;
		}
	  }
	  gauge.strip.render();
	  
	  setTimeout(function () {
	    if(isRun)_this.processTick(args, gauge);
		//console.log("thick");
	  }, 500);	  
    }
}
module.exports = new blink();