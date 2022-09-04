


//====== Geom =====
	function Geom(){
		cantCreateInstance("Geom");
	}
	
	
	Geom.rem = function( a, b ) {
		return a % b;
	}
	
	
	Geom.distanceOf=function( firstX, firstY, secondX, secondY ){
		var x = Number( firstX-secondX );
		var y = Number( firstY-secondY );
		return Math.sqrt( x*x + y*y );
	}
	
	
	Geom.distanceOfPoints= function( first, second ){
		return Geom.distanceOf( first.x(),first.y(), second.x(), second.y() );
	}
	
	
	//( angualar )
	Geom.angleRadOf=function( sourceX, sourceY, targetX,targetY ){
		var x = Number( targetX-sourceX );
		var y = Number( targetY-sourceY );
		return Math.atan2( y,x );
	}
	
	
	Geom.angleRadOfPoints=function( source, target ){
		return Geom.angleRadOf( source.x(), source.y(),  target.x(), target.y() );
	}
	
	
	Geom.correctAngleRad=function( rads ){
		rad = Geom.rem( rads, Math.PI*2 );
		//if( rad == 0 && rads != 0 ) return Math.PI*2;
		if( rad < 0 ) rad = Math.PI*2 + rad;
		return rad;
	}
	
	
	Geom.optimalRotatingDirectionRad=function( sourceRad, targetRad ) {
		targetRad = Geom.correctAngleRad( targetRad );
		sourceRad = Geom.correctAngleRad( sourceRad );
		if( sourceRad == targetRad ) return 0;
		
		var minRad, maxRad;
		if( sourceRad < targetRad ){
			minRad=sourceRad;
			maxRad=targetRad;
		}
		else {
			minRad=targetRad;
			maxRad=sourceRad;
		}
		
		if( ((Math.PI*2 - maxRad) + minRad) < (maxRad - minRad) ){
			return Math.sign(sourceRad - targetRad);
		}
		
		return Math.sign(targetRad - sourceRad);
	}
//===== End Geom ====
