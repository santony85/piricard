function dbmeter(){
	
	var isRun=0;
	
	this.start = function (args, gauge) {
		console.log("Going dbmeter mode.");
		isRun=1;
		this.processTick(args, gauge);
	};
	
	this.stop = function (){
	  isRun=0;	
	}
	
	this.processTick = function (args, gauge) {
	  var _this = this;
	  
	  setTimeout(function () {
		  if(isRun)_this.processTick(args, gauge);
		  //console.log("thick");
		}, 10);	
		
    }
	
	
}

module.exports = new dbmeter();