function dbmeter(){
	
	var isRun=0;
	var db=8;
	var nb=13;
	
	var seuil = 50;
	var dbmax = 150;
	var range = dbmax - seuil;
	var dbParAnn = range / 64;//nbAnneau
	
	this.start = function (args, gauge,dataDb) {
		console.log("Going dbmeter mode.");
		seuil = dataDb.seuil;
		dbmax = dataDb.dbmax;
		range = dbmax - seuil;
		dbParAnn = range / gauge.nbAnneau;
		isRun=1;
		this.processTick(args, gauge);
	};
	
	this.stop = function (){
	  isRun=0;	
	}
	
	this.setdB = function(decibel){
		//console.log(decibel);
		var cal = decibel - seuil;
		nb = Math.round(cal/dbParAnn)+2;
		//console.log(nb);
	}
	
	this.setDataDb = function(gauge,dataDb){
	   seuil = dataDb.seuil;
	   dbmax = dataDb.dbmax;
	   range = dbmax - seuil;
	   dbParAnn = range / gauge.nbAnneau;	
	}
	
	//calcul nb par dB
	
	
	this.processTick = function (args, gauge) {
	  var _this = this;
	  
	  
	  for(let i=0;i<gauge.nbLedParAnneau*nb;i++){
		  gauge.colorArray[i] = gauge.color;
		}
		
      var leddep = nb * gauge.nbLedParAnneau;
	  
	  for(let i=leddep;i<gauge.nbLedParAnneau*gauge.nbAnneau;i++){
		  gauge.colorArray[i] = 0x000000;
	  }
	  
	  gauge.strip.render();	
		
	  setTimeout(function () {
		  if(isRun)_this.processTick(args, gauge);
		  //console.log("thick");
	  }, 200);	
		
    }
	
	
}

module.exports = new dbmeter();