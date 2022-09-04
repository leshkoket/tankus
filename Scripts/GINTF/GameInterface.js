
"use strict"


//==== Game Object Creation Params ====
	function GameObjectCreationParams( kind, x, y, metaData ){
		this.kind = kind;
		this.x = x;
		this.y = y;
		this.metaData = (metaData);
	}
//==== End Game Object Creation Params ====



//==== Game Config =====
	function GameConfig() {
		this.cellWidth = 1.0;
		this.cellHeight = 1.0;
		this.tankWidth = 1.0;
		this.tankHeight = 1.0;
	}
//==== End Game Config =====


//=====
	function notImplementedFunction(name){
		throw( "Function "+name+" is not implemented!" );
	}
	
	function cantCreateInstance(typeName){
		throw( "Can'create instance of class"+typeName+"!" );
	}
//=====


//==== Game Interface =====
class GameInterface {
	constructor( debugMode_ ){
		this._debugMode = (debugMode_)?true:false;
	}
	
	
	debugMode(){
		return this._debugMode;
	}
	
	clearSaid() {
		var log = document.getElementById("gameLog");
		if( log )  log.value = "";
	}
	
	say( what ) {
		var log = document.getElementById("gameLog");
		if( log ){
			log.value += what + "\n";
			log.scrollTop = log.scrollTopMax;
		}
		console.log( what + "\n" );
	}
	
	
	sayStatus( divId, message ) {
		var div = document.getElementById("gameStatusBar_"+divId);
		div.innerText = message;
	}
	
	
	graphics(){ notImplementedFunction("graphics"); }
		
	graphicsNode(){ notImplementedFunction("graphicsNode"); }
	
	time(){ notImplementedFunction("time"); }
	
	config(){ notImplementedFunction("config"); }

	resources(){ notImplementedFunction("resources"); }
		
	level(){ notImplementedFunction("level"); }	
		
	camera(){ notImplementedFunction("camera"); }
	
	
	addEvent(event){ notImplementedFunction("addEvent"); }
		
	events(){ notImplementedFunction(); return null; }
	
	
	loadGame(){ notImplementedFunction("loadGame"); }
}
//==== End Game Interface ====

