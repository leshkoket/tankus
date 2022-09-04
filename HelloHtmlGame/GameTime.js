





//======= Game Time =====
	function GameTime() {
		this._elapsedIndex = 0;
		this._elapsedMsec = 0.0;
	}
	
	
	GameTime.prototype.elapsedIndex = function(){ return this._elapsedIndex; }
	
	GameTime.prototype.elapsedMsec = function(){ return this._elapsedMsec; }
	
	
	GameTime.prototype.passIteration = function( msec ) {
		this._elapsedMsec += msec;
		this._elapsedIndex ++;
	}
//=======================