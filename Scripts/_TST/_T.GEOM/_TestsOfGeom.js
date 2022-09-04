"use strict"

describe( "Geom Tests", function(){
	const PRECISION = 0.00000001;
	
	
	function checkDistanceOf( firstX, firstY, secondX, secondY, expected ){
		let actual = Geom.distanceOf( firstX, firstY, secondX, secondY );
		
		assert.closeTo( (expected),(actual), PRECISION );
	}
	
	
	function checkAngleRadOf( sourceX,sourceY, targetX,targetY, expected ){
		let actual = Geom.angleRadOf( sourceX,sourceY, targetX,targetY );
		
		assert.closeTo( expected, actual, PRECISION );
	}
	
	
	function checkOptDirectionRad( startRad, finishRad, expectedDirection ){
		let actualDirection = Geom.optimalRotatingDirectionRad( startRad, finishRad );
		
		assert.equal( expectedDirection, actualDirection );
	}
	
	
	function checkCorrectAngleRad( radInput, radExpected ){
		var radActual = Geom.correctAngleRad( radInput );
		
		assert.closeTo( radExpected, radActual, PRECISION );
	}
	
	
	
	it( "distance of", function(){
		for( let x = 0; x < 100; x += 0.1 ){
			checkDistanceOf( x,0, 0,0, x );
			checkDistanceOf( 0,0, x,0, x );
			checkDistanceOf( -x,0, 0,0, x );
			checkDistanceOf( 0,0, -x,0, x );
		}
		for( let y = 0; y < 100; y++ ){
			checkDistanceOf( 0,0, 0,y, y );
			checkDistanceOf( 0,y, 0,0, y );
			checkDistanceOf( 0,0, 0,-y, y );
			checkDistanceOf( 0,-y, 0,0, y );
		}
		checkDistanceOf( -5,106,5,106, 10 );
		checkDistanceOf( 600, 7, 600, -7, 14 );
	} );
	
	
	it( "angle rad of", function() {
		for( let x = 0.1; x < 100; x+= 0.1 ) {
			checkAngleRadOf( 0,0, x,0, 0.0 );
			checkAngleRadOf( x,0, 0,0, Math.PI );
		}
		for( let y = 0.1; y < 100; y+=0.1 ){
			checkAngleRadOf( 0,0, 0,y, Math.PI*0.5 );
			checkAngleRadOf( 0,y, 0,0, -Math.PI*0.5 );
		}
		checkAngleRadOf( 5.2, 123.1, 5.4, 123.1, 0 );
		checkAngleRadOf( 5.20, 123.9, 5.15, 123.9, Math.PI );
		checkAngleRadOf( 896.7, 4.1, 896.7, 4.2, Math.PI*0.5 );
	} );
	
	
	it( "optimal rotating direction rad", function(){
		const MAX = Math.PI*2;
		checkOptDirectionRad( 0.01, 0.02, +1 );
		checkOptDirectionRad( 0.05, 0.03, -1 );
		checkOptDirectionRad( MAX-0.04, 0.08, +1 );
		checkOptDirectionRad( 0.07, MAX*2-0.02, -1 );
		checkOptDirectionRad( 0.01, MAX, -1 );
		checkOptDirectionRad( MAX-0.01, MAX, +1 );
		
		checkOptDirectionRad( -0.05,MAX-0.02, +1 );
		checkOptDirectionRad( -0.05, MAX-0.06, -1 );
		
		checkOptDirectionRad( 0.0, MAX, 0 );
		checkOptDirectionRad( 0.0, 0.0, 0 );
		checkOptDirectionRad( MAX, 0, 0 );
	} );
	
	
	it("correct angle rad", function(){
		const MAX = Math.PI*2;
		const MAXCORR = 0;
		checkCorrectAngleRad( 0,0 );
		checkCorrectAngleRad( MAX, MAXCORR );
		checkCorrectAngleRad( MAX*2, MAXCORR );
		checkCorrectAngleRad( -MAX, MAXCORR );
		checkCorrectAngleRad( -2*MAX, MAXCORR );
		
		checkCorrectAngleRad( 0.1, 0.1 );
		checkCorrectAngleRad( -0.3, MAX-0.3 );
		checkCorrectAngleRad( -0.2-MAX, MAX-0.2 );
	} );
	
} );