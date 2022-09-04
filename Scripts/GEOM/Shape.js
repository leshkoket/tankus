

//== Shape ==
	const SHAPETYPE_UNDEFINED = 0;
	const SHAPETYPE_POINT = 1;
	const SHAPETYPE_RECT = 2;
	const SHAPETYPE_CIRCLE = 3;
	
	
	function Shape( type, values ) {
		this._type = type;
		this._values = values;
	}
	
	
	Shape.prototype.value = function(index){
		return this._values[index];
	}
	
	Shape.prototype.setValue = function(index, newValue){
		this._values[index] = 0.0+newValue;
	}
	
	Shape.prototype.values=function(){ return this._values; }
	
	Shape.prototype.type=function(){ return this._type; }
	
	
	Shape.prototype.matches=function( other, precision ){
		if( precision === undefined ) precision = 0;
		precision = Math.abs(precision);
		if( !other || other.type() != this.type() ) return false;
		if( other.values().length != this.values().length ) return false;
		
		for( var i = 0; i < this._values.length; i++ ){
			var diff = Math.abs(this._values[i] - other._values[i]);
			if( diff > precision ) {
				return false;
			}
		}
		
		return true;
	}
//== End Shape ==