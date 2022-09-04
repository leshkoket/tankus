

"use strict"


class MazePath {
	constructor( steps ){
		this.setSteps( steps );
	}
	
	
	static createFound( steps ){
		return new MazePath( steps );
	}
	
	
	static createNotFound(){
		return new MazePath( [] );
	}
	
	
	isFound(){ return this._steps.length > 0; }
	
	steps(){ return this._steps; }
	
	
	setSteps( steps ) {
		this._steps = new Array( 0 );
		for( let i = 0; i < steps.length; i++ ){
			if( steps[i] == null ) continue;
			this._steps.push( Point.fromPoint(steps[i]) );
		}
	}
	
	
	invertSteps(){
		let newSteps = new Array( this._steps.length );
		for( let i = 0; i < this._steps.length; ++i ){
			newSteps[i] = this._steps[ this._steps.length-1-i ];
		}
		this._steps = newSteps;
	}
	
	
	toString(){
		return ""+this._steps;
	}
	
	
	indexOfStep( step, precision ){
		precision = Number(precision?precision:0);
		for( let i = 0; i < this._steps.length; i++ ){
			if( this._steps[i].matches( step,precision ) ) return i;
		}
		return -1;
	}
	
	
	matches( other, precision ){
		if( other._steps.length != this._steps.length )  return false;
		precision = Number(precision?precision:0);
		for( let i = 0; i < this._steps.length; i++ ){
			if( !other._steps[i].matches( this._steps[i], precision ) )  return false;
		}
		return true;
	}
	
	
	enumMiddleEndSteps(){
		return this._steps.slice( 1, this._steps.length );
	}
	
	
	startStep(){
		if( this._steps.length <= 0 ) return new Point(0,0);
		return this._steps[ 0 ];
	}
	
	
	endStep(){
		if( this._steps.length <= 0 ) return new Point(0,0);
		return this._steps[ this._steps.length-1 ];
	}
}