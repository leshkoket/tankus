


//=== Point ===
	function Point( x, y ) {
		Shape.call( this, SHAPETYPE_POINT, [x,y] );
	}
	
	Point.prototype = Object.create(Shape.prototype);
	
	
	Point.fromPoint = function( p ) {
		return new Point( p.x(), p.y() );
	}
	
	
	Point.prototype.x=function(){ return this.value(0); }
	
	Point.prototype.y=function(){ return this.value(1);  }
	
	Point.prototype.setX=function( x ){ this.setValue(0,x); }
	
	Point.prototype.setY=function( y ){ this.setValue(1,y); }
	
	Point.prototype.set =function(p){ this.setX(p.x()); this.setY(p.y()); }
	
	
//== End Point ===