

"use strict"

describe("Maze Path Tests", function(){
	
	it("create found : 3+ points", function(){
		let path = MazePath.createFound( [ new Point(1,2), new Point(3,4), new Point(6,7) ] );
		
		assert.isTrue( path.isFound() );
		
		assert.isTrue( path.startStep().matches( new Point(1,2),0 ),  "start" );
		assert.isTrue( path.endStep().matches( new Point(6,7),0 ),  "end" );
		
		assert.equal( 3, path.steps().length );
		assert.isTrue( path.steps()[0].matches( new Point(1,2),0 ),  "all#0" );
		assert.isTrue( path.steps()[1].matches( new Point(3,4),0 ),  "all#1" );
		assert.isTrue( path.steps()[2].matches( new Point(6,7),0 ),  "all#2" );
		
		let middleEndSteps = path.enumMiddleEndSteps();
		assert.equal( middleEndSteps.length, 2 );
		assert.equal( path.steps()[1], middleEndSteps[0] );
		assert.equal( path.steps()[2], middleEndSteps[1] );
	});
	
	
	it("create found : 2 points", function(){
		let path = MazePath.createFound( [ new Point(7,8), new Point(9,10) ] );
		
		assert.isTrue( path.isFound() );
		
		assert.isTrue( path.startStep().matches( new Point(7,8), 0 ),  "start" );
		assert.isTrue( path.endStep().matches( new Point(9,10), 0 ),  "end" );
		
		let middleEndSteps = path.enumMiddleEndSteps();
		assert.equal( 1, middleEndSteps.length );
		assert.isTrue(  middleEndSteps[0].matches( new Point(9,10),0 ) );
	});
	
	
	it("create found : 1 point", function(){
		let path = MazePath.createFound( [ new Point(3,4) ] );
		
		assert.isTrue( path.isFound() );
		
		assert.isTrue( path.startStep().matches( new Point(3,4),0 ),  "start" );
		assert.isTrue( path.endStep().matches( path.startStep(), 0 ),   "end" );
		
		assert.equal( 0, path.enumMiddleEndSteps().length );
	});
	
	
	function assertNotFound( noPath ){
		assert.isFalse( noPath.isFound() );
		assert.equal( 0, noPath.steps().length );
		assert.equal( 0, noPath.enumMiddleEndSteps().length,   "mid-end" );
		assert.isTrue( noPath.startStep().matches( new Point(0,0), 0 ),   "start" );
		assert.isTrue( noPath.endStep().matches( new Point(0,0), 0 ),    "end" );
	}
	
	
	it( "create found : 0 points -> not found",  function(){
		let path = MazePath.createFound([]);
		
		assertNotFound( path );
	});
	
	
	it("create not found", function(){
		let path = MazePath.createNotFound();
		
		assertNotFound( path );
	});
	
	
	describe("Comparasion", function(){
		function checkMatching( stepsFirst, stepsSecond, precision, resultExp ){
			let pathFirst = MazePath.createFound( stepsFirst );
			let pathSecond = MazePath.createFound( stepsSecond );
			let result = pathFirst.matches( pathSecond, precision );
			
			assert.equal( resultExp, result,    `${stepsFirst} ~= ${stepsSecond} +-${precision}` );
		}
		
		it("matching", function(){
			checkMatching( [], [], 0, true );
			checkMatching( [], [], 0.1, true );
			
			checkMatching(
				[ new Point(3,2), new Point(4,5) ],
				[ new Point(3,2), new Point(4,5) ], 
				0, true );
				
			checkMatching(
				[ new Point(1,2), new Point(6,7) ],
				[ new Point(1.0999999999, 2.099999), new Point(6.099999, 7.0999999) ],
				0.1, true );
				
			checkMatching( 
				[ new Point(7,5), new Point(9,1) ],
				[ new Point(7.11, 5.09999), new Point(9.099999, 1.09999) ],
				0.1, false );
				
			checkMatching( 
				[ new Point(7, 4), new Point(8,6) ],
				[ new Point(7, 4), new Point(8.0999, 6.100001) ],
				0.1, false );
				
			checkMatching(
				[ new Point(1,2) ],
				[ new Point(1,2), new Point(3,4) ],
				0.1, false );
		});
		
		
		it("index of step", function(){
			let path = MazePath.createFound([
				new Point(5,6), new Point(4,7), new Point(12.09, 13.09) ]);
				
			assert.equal( 0, path.indexOfStep(new Point(5,6),0) );
			assert.equal( 1, path.indexOfStep(new Point(4,7)) );
			assert.equal( 2, path.indexOfStep(new Point(12.1, 13.1), 0.02) );
			
			assert.equal( -1, path.indexOfStep(new Point(12.2, 13.2), 0.1) );
		});
	});
	
	
	describe("Maze Path Text",   function(){
		function checkFromPathText( textIn, textOutExp, stepsOutExp ) {
			let pathOutExp = MazePath.createFound( stepsOutExp );
			let pathOut = MazePath.createNotFound();
			let maze = Maze.fromPathText( pathOut, textIn );
			
			let textOut = maze.toPathText( pathOut );
			assert.equal( pathOutExp.steps().length, pathOut.steps().length,  "##length" );
			for( let s = 0;  s < pathOutExp.steps().length; ++s ){
				assert.isTrue( pathOutExp.steps()[s].matches( pathOut.steps()[s], 0 ),  "p#"+s );
			}
			
			assert.deepEqual( textOutExp, textOut );
		}
		
		
		it("from path text", function(){
			checkFromPathText( 
				["1bcd",
				 "3a4e",
				 "000f"],
				["1bcd",
				 "3a4e",
				 "000f"],
				[ new Point(1,1), 
					new Point(1,0), new Point(2,0), new Point(3,0),
				  new Point(3,1), new Point(3,2) ] );
				  
			checkFromPathText(
				["1ABC2",
				 "3FeD4"],
				["1abc2",
				 "3fed4"], 
				[ new Point(1,0), new Point(2,0), new Point(3,0),
					new Point(3,1), new Point(2,1), new Point(1,1) ] );
		});
	});

});