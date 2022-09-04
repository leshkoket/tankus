
"use strict"
//

describe( "Point tests", function(){
	
	it( "create", function(){
		let point = new Point(1.2, 3.7);
		
		assert.equal( 1.2, point.x(), 0.01 );
		assert.equal( 3.7, point.y() );
	} );
	
	
	it("change coords", function(){
		let point = new Point(20.5,40.6);
		
		point.setX(8.7);
		point.setY(9.5);
		
		assert.equal( 8.7, point.x() );
		assert.equal( 9.5, point.y() );
	} );
	
	
	it("matches", function(){
		let dd = [
			[ true,  0.0, new Point(1.2, 2.4), new Point(1.2, 2.4) ],
			[ true,  0.101, new Point(1.2,3.4), new Point(1.1, 3.4) ],
			[ true,  0.101, new Point(4.5,6.7), new Point(4.5, 6.6) ],
			[ true,  -0.500001, new Point(8.2,6.4), new Point(8.7, 6.4) ],
			[ true,  -0.500001, new Point(8.2,6.4), new Point(8.2, 6.9) ],
			[ true, 0.2000001, new Point(-7.2, -8.6), new Point(-7.4, -8.6) ],
			[ true, 0.2000001, new Point(-7.2, -8.6), new Point(-7.4, -8.8) ],
			
			[ false, 0.0, new Point(1.2, 3.4), new Point(2.2, 3.4) ],
			[ false, 0.0, new Point(1.2, 3.4), new Point(1.2, 4.4) ],
			[ false, 0.1, new Point(1.2, 3.4), new Point(1.3000001, 3.4) ],
			[ false, 0.1, new Point(10.2, 30.4), new Point(10.2, 30.50001) ],
			[ false, 1, new Point(11,22), new Point(12.0000001,22) ],
			[ false, 1, new Point(11,22), new Point(11,23.0000001) ],
			[ false, -0.4000001, new Point(4.3, 6.2), new Point(4.8, 6.2) ],
			[ false, -0.4000001, new Point(4.3, 6.2), new Point(4.3, 6.7) ]
			
		];
		for(let d of dd) {
			var result = d[2].matches( d[3], d[1] );
			assert.equal( d[0], result , `${d[2]} & ${d[3]} ~${d[1]}`);
			
			var result_2 = d[3].matches( d[2], d[1] );
			assert.equal( result, result_2 );
		}
		assert.equal( false, new Point(1,1).matches(null, 0) );
	} );
	
	
	it("matches : no precise -> default", function(){
		let a = new Point(4,5);
		let b = new Point(4,5);
		let c = new Point(4.00000001, 5.0000001);
		
		assert.isTrue( a.matches(b),    "a & b" );
		assert.isFalse( a.matches(c),   "a & c" );
	});
	
	
} );



