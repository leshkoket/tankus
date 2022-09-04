
"use strict"
const GAME_DELAY_MSEC = 5;
const GAME_SYNC_DELAY_MSEC = 10;


//===== Game Controller ======
class GameController extends GameInterface {
	constructor( debugMode ) {
		super( debugMode );
		
		// Services
		this._config = new GameConfig();
		this._resources = new GameResourcesLoader(this);
		this._time = new GameTime();
		this._level = new GameLevel(this);
		this._camera = new Camera();
		
		// Live Collections
		this._events = new Array();
		
		// Drivers
		this._gfx = null;
		this._gfxNode = null;
		
		//this.clearSaid();
		this._checkGraphics();
		this._camera.setScreenSizes( this._gfxNode.width, this._gfxNode.height );
	}
	
	
	graphics(){  this._checkGraphics(); return this._gfx; }
	
	graphicsNode(){ this._checkGraphics(); return this._gfxNode; }
	
	
	resources(){ return this._resources; }
	
	config(){ return this._config; }
	
	time(){ return this._time; }
	
	level(){ return this._level; }
	
	camera(){ return this._camera; }
	
	events(){ return this._events; }
	
	addEvent(e) {
		var t = e.target;
		var scaleX = t.width && t.offsetWidth ? t.offsetWidth / t.width : 1.0;
		var scaleY = t.height && t.offsetHeight ? t.offsetHeight / t.height : 1.0;
		e.absX = (e.x-e.target.offsetLeft) / scaleX;
		e.absY = (e.y-e.target.offsetTop) / scaleY;
		//e.absX = e.pageX; e.absY = e.pageY;
		//e.absX = e.clientX; e.absY = e.clientY;
		this._events.push( e );
	}
	
	
	run() {
		this._init();
		this.loadGame();
		this._runMainCycle();
	}


	loadGame(){
		this.say("loading game...");			
		this.level().load();
		this.say("game loaded!");
	}

	
//#private:
//( initing )
	_init(){
		this._checkGraphics();
		this._initConfig();
		this._initLinkEvents();
	}
	
	
	_initConfig(){
		this._config = this.resources().loadResource("Game", "config");
	}
	
	
	_initLinkEvents(){
		let game = this;
		let target = window;//game.graphicsNode();
		
		var events = [ 
			"mousedown", "mousepress", "mouseup", "click", 
			"mousemove", "mousewheel", "contextmenu",
			"keydown", "keypress", "keyup" ];
		for( var i = 0; i < events.length; i++ ){
			target.addEventListener( events[i],
				function(e){ game.addEvent( e ); e.preventDefault(); } );
		}
	}
	
	
	_runMainCycle(){
		//setInterval( function(game){ game.updateAll(); }, GAME_DELAY_MSEC, this );
		let myGame = this;
		
		document.addEventListener("visibilitychange", function(){ console.log("anim "+document.visibilityState); });
		
		function autoUpdateAll(game){
			//requestAnimationFrame( function(){ myGame.updateAll( autoUpdateAll ); } );
			game.updateAll( autoUpdateAll );
			//requestAnimationFrame( autoUpdateAll );
			//console.log(`${game.time().elapsedIndex()} `);
		}
		//requestAnimationFrame( autoUpdateAll )
		autoUpdateAll( myGame );;
	}
	
	
//( updating )
	updateAll( repeatFunc ){
		this.sayStatus( "time", this.time().toString() );
		this.time().passIteration();
		
		if( document.visibilityState ){
			this._checkGraphics();
			this._clearGraphics();
			this._updateObjects();
		}
		
		this._resetEvents();
		this._incTimer( repeatFunc );
	}
	
	
	_resetEvents() {
		if( this._events.length > 0 ) {
			var e = this._events[0];
			var eX = Math.floor( e.absX ), eY = Math.floor( e.absY );
			this.sayStatus( "events", e.type+" for "+((e.target))+
				"; x"+this._events.length+" "+
				eX+" "+
				eY+";"+
				e.shiftKey );
		}
		this._events = [];
	}
	
	
	_incTimer( repeatFunc ){
		let syncTime = Math.max(0, GAME_SYNC_DELAY_MSEC-this.time().nowElapsedMsec());
		//this.time().waitMsec( syncTime );
		
		setTimeout( repeatFunc, syncTime, this );
	}
	
	
	_checkGraphics(){
		if( this._gfx != null && this._gfxNode != null ){
			return;
		}
		var gfx = document.getElementById("graphics");
		if(!(gfx && gfx.getContext && gfx.getContext("2d"))) {
			alert( "Graphics not found!!!" );
			throw( "Graphics not found" );
		}
		this._gfxNode = gfx;
		this._gfx = gfx.getContext("2d");
	}
	
	
	_updateObjects(){
		this._level.updateObjects();
	}
	
	
	_clearGraphics(){
		this._gfx.fillStyle = "rgb(70%, 70%, 70%)";
		this._gfx.clearRect( 0,0, this._gfxNode.width, this._gfxNode.height );
	}
}
//===== End Game Controller ===
