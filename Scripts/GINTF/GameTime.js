

"use strict"


//====== System Time ======
	class SystemTime {
		constructor(){
		}
		
		nowMsec(){
			return Date.now();
		}
		
		
		waitMsec( msecToWait ){
			let promise = new Promise(function(ok,bad){
				var startMsec  = Date.now();
				while( Date.now()-startMsec < msecToWait ) {}
			});
		}
	}
//=========================


//====== Fake System Time =====
	class FakeSystemTime extends SystemTime {
		constructor(){
			super();
			this.fakeNowMsec = 0;
		}
		
		
		nowMsec(){ return this.fakeNowMsec; }
		
		
		waitMsec( msecToWait ){
			this.fakeNowMsec += msecToWait;
		}
	}
//=============================


//======= Game Time =====
class GameTime {
	constructor( systemTime ) {
		if( !systemTime ) systemTime = new SystemTime();
		
		this._systemTime = systemTime;
		this._elapsedIndex = 0;
		this._startMsec = this._systemTime.nowMsec();
		this._nowMsec = this._startMsec;
		this._prevElapsedMsec = 0;
	}
	
	
	reset() {
		this._startMsec = this._systemTime.nowMsec();
		this._nowMsec = this._startMsec;
		this._prevElapsedMsec = 0;
		this._elapsedIndex = 0;
	}
	
	systemTime(){ return this._systemTime; }
	
	elapsedIndex(){ return this._elapsedIndex; }
	
	
	elapsedMsec() { 
		return Math.max(0, this._systemTime.nowMsec() - this._startMsec);
	}
	
	nowElapsedMsec(){ 
		return Math.max(0, this._systemTime.nowMsec() - this._nowMsec);
	}
	
	prevElapsedMsec(){
		return this._prevElapsedMsec;
	}
	
	
	toString() {
		return `#${this.elapsedIndex()} ${this.nowElapsedMsec()} ms ${this.elapsedMsec()} ms`;
	}
	
	
	waitMsec( msec ) {
		this._systemTime.waitMsec( msec );
	}
	
	
	
	passIteration() {
		this._elapsedIndex ++;
		this._prevElapsedMsec = this.nowElapsedMsec();
		this._nowMsec = this._systemTime.nowMsec();
	}
	
	
	getShiftByNow( shiftBySec ) {
		var nowSec = 0.001 * this.prevElapsedMsec();
		return Math.max(0.001, nowSec) * shiftBySec;
	}
}
//=======================