
"use strict"

describe("Maze Generator Tests", function(){
	
	
	it("create : have all params -> create by params", function(){
		let data = new MazeGenerationData();
		let maze = new Maze(2,3);
		
		let gen = new FakeMazeGenerator( data, maze );
		
		assert.equal( data, gen.data() );
		assert.equal( maze, gen.maze() );
	});
	
	
	it("create : no maze -> created new by data", function(){
		let data = new MazeGenerationData();
		data.cellsCountX = 3;
		data.cellsCountY = 6;
		
		let gen = new FakeMazeGenerator(data);
		
		assert.equal( data, gen.data() );
		assert.isNotNull( gen.maze() );
		assert.equal( 3, gen.maze().cellsCountX() );
		assert.equal( 6, gen.maze().cellsCountY() );
	});
	
	
	it("random int -> show", function(){
		let gen = new MazeGenerator( new MazeGenerationData() );
		
		let log = "";
		for( let i = 1; i <= 100; i++ ){
			log = log + 
			gen.randomInt(-4,-8)+";"+gen.randomInt(4,8)+";"+
			gen.randomInt(0,1)+";"+gen.randomInt(1,1)+";";
		}
		console.log( log );
		
		
		for( let i = 0; i < 1000; i++ ){
			let r = gen.randomInt(0,5);
			assert.isTrue( r >= 0 && r <= 5 );
		}
	});
	
	
	it("random -> log", function(){
		let gen = new FakeMazeGenerator( new MazeGenerationData() );
		
		gen.randomInt( -4, -8 );
		gen.randomInt(4,8);
		
		assert.equal( "(-4 -8)(4 8)", gen.fakeRandomLog );
	});
		
		
	describe("Start & End", function(){
		it("start -> random first points", function(){
			let maze = new Maze(8,6);
			for( let i = 0; i < 100; ++i ){
				let gen = new FakeMazeGenerator( new MazeGenerationData(), maze );
				gen.data().firstPointsCountStart = 2;
				gen.data().firstPointsCountEnd = 3;
				
				gen.start();
				
				assert.isTrue( gen.firstPoints().length >= 2 && gen.firstPoints().length <= 3,   "1pp" );
				assert.isTrue( gen.fakeRandomLog.includes("(0 7)(0 5)") );
				for( let firstPoint of gen.firstPoints() ){
					assert.isTrue( firstPoint.x() >= 0 && firstPoint.x() <= 7,  "1p x" );
					assert.isTrue( firstPoint.y() >= 0 && firstPoint.y() <= 5,  "1p y" );
				}
			}
		});
		
		
		it("end : character points",  function(){
			for( let i = 0; i < 100; i++){
				let gen = new FakeMazeGenerator( new MazeGenerationData(6,3) );
				gen.data().charactersCount = 2;
				gen.start();
				gen.maze().setCell( 2,1, 0 );
				gen.maze().setCell( 3,2, -1 );
				gen.fakeRandomLog = "";
				gen.end();
				
				let playerPoints = gen.maze().filterNamedCells("character");
				
				assert.equal( 2, playerPoints.length );
				assert.isTrue( 
					playerPoints[0].matches(new Point(2,1),0) && playerPoints[1].matches(new Point(3,2),0) ||
					playerPoints[0].matches(new Point(3,2),0) && playerPoints[1].matches(new Point(2,1),0) );
				assert.notEqual( "",  gen.fakeRandomLog );
			}
		});
		
		
		it("end : character points : on rect distance Y", function(){
			for( let i = 0; i < 100; ++i ){
				let gen = new FakeMazeGenerator( new MazeGenerationData(5,4) );
				gen.data().charactersCount = 2;
				gen.data().charactersMinDistance = 3;
				
				gen.start();
				gen.setMaze( Maze.fromText([
					"10111",
					"10111",
					"10111",
					"10111" ]) );
				gen.maze().addNamedCell("character", new Point(1,3) );
				
				gen.end();
				
				let pp = gen.maze().filterNamedCells("character");
				
				assert.equal( 2, pp.length );
				assert.isTrue(
					 pp[0].matches(new Point(1,3),0) && pp[1].matches(new Point(1,0),0) ||
					 pp[0].matches(new Point(1,0),0) && pp[1].matches(new Point(1,3),0) );
			}
		});
		
		
		it("end : character points : on rect distance X", function(){
			for( let i = 0; i < 100; ++i ){
				let gen = new FakeMazeGenerator( new MazeGenerationData(6,3) );
				gen.data().charactersCount = 2;
				gen.data().charactersMinDistance = 3;
				
				gen.start();
				gen.setMaze( Maze.fromText([
					"111111",
					"100001",
					"111111" ]) );
				gen.maze().addNamedCell("character", new Point(4,1));
				
				gen.end();
				let pp = gen.maze().filterNamedCells("character");
				
				assert.equal( 2, pp.length );
				assert.isTrue( 
					pp[0].matches(new Point(4,1),0) && pp[1].matches(new Point(1,1),0) ||
					pp[0].matches(new Point(1,1),0) && pp[1].matches(new Point(4,1),0) );
			}
		});
	});
	
	
	describe( "Add Road", function(){
		function checkAddRoad( startLength, endLength, size, startPos, vector, 
		mazeTextExp_0, mazeTextExp_1 ){
			let data = new MazeGenerationData();
			let maze = new Maze( size.x(), size.y() );
			data.roadLengthStart = startLength;
			data.roadLengthEnd = endLength;
			
			let mazeExp_0 = Maze.fromText( mazeTextExp_0 );
			let mazeExp_1 = Maze.fromText( mazeTextExp_1 );
			
			for( let i = 0; i < 100; i++ ){
				let gen = new MazeGenerator( data, maze );
				gen.start();
				let added = gen.addRoad( startPos, vector );
				
				assert.isTrue( mazeExp_0.equals(gen.maze()) || mazeExp_1.equals(gen.maze()),
					gen.maze().toText() );
				assert.isTrue( added, 
					"must be added" );
			}
		}
		
		
		function checkNoAddRoad( size, startPos, vector ){
			let gen = new FakeMazeGenerator( new MazeGenerationData(size.x(), size.y()) );
			gen.data().roadLengthStart = 2;
			gen.data().roadLengthEnd = 2;
			
			gen.start();
			let added = gen.addRoad( startPos, vector );
			
			assert.isFalse( added );
			assert.equal( "onStart()", gen.fakeLog );
		}
		
		
		it("add road : no neightbor & dir.vec. -> added fully", function(){
			checkAddRoad( 2,3, new Point(5,3), new Point(2,1), new Point(+1,0),
				[ "11111",
				  "11001",
				  "11111" ],
				  
				[ "11111",
				  "11000",
				  "11111" ]);
				  
			checkAddRoad( 2,3, new Point(5,3), new Point(3,1), new Point(-1,0),
					[ "11111",
					  "11001",
					  "11111" ],
					  
					[ "11111",
					  "10001",
					  "11111" ] );
					  
				checkAddRoad( 1,2, new Point(5,3), new Point(3,1), new Point(0,1),
					[ "11111",
					  "11101",
					  "11111" ],
					  
					[ "11111",
					  "11101",
					  "11101" ] );
				
				checkAddRoad( 1,2, new Point(5,3), new Point(3,2), new Point(0,-1),
					[ "11111",
					  "11111",
					  "11101" ],
					[ "11111",
					  "11101",
					  "11101" ] );
		});
		
		
		it("add road : dir.vec. -> log", function(){
			let gen = new FakeMazeGenerator( new MazeGenerationData(10,8) );
			
			gen.start();
			gen.addRoad( new Point(2,1), new Point(1,0), 1 );
			gen.addRoad( new Point(1,2), new Point(-1,0), 2 );
			gen.addRoad( new Point(5,6), new Point(0,1), 3 );
			gen.addRoad( new Point(6,5), new Point(0,-1), 4 );
			gen.end();
			
			assert.equal( 
				"onStart()"+
				"onAddRoad(2:1 1:0 1)onAddRoad(1:2 -1:0 2)"+
				"onAddRoad(5:6 0:1 3)onAddRoad(6:5 0:-1 4)"+
				"onEnd()",
				gen.fakeLog );
		});
		
		
		it("add road : diag.|zero vec. -> none", function(){
			checkNoAddRoad( new Point(8,7), new Point(4,3), new Point(-1,-1) );
			checkNoAddRoad( new Point(10,6), new Point(4,3), new Point(1,-1) );
			checkNoAddRoad( new Point(6,7), new Point(4,3), new Point(-1,1) );
			checkNoAddRoad( new Point(9,8), new Point(4,3), new Point(1,1) );
			
			checkNoAddRoad( new Point(4,3), new Point(2,1), new Point(0,0) );
		});
		
	});
	
	
	describe("Add Any Road", function(){
		it("add any road : no nei-s -> added to any dir.vec.", function(){
			let maze = new Maze(6,3);
			
			const logExp_L = "onStart()onAddRoad(2:1 -1:0 2)";
			const logExp_R = "onStart()onAddRoad(2:1 1:0 2)";
			const logExp_U = "onStart()onAddRoad(2:1 0:-1 2)";
			const logExp_D = "onStart()onAddRoad(2:1 0:1 2)";
			
			for( let i = 1; i <= 100; i++ ){
				let gen = new FakeMazeGenerator( new MazeGenerationData(6,3), maze );
				gen.start();
				gen.addAnyRoad( new Point(2,1), 2 );
				
				assert.isTrue( 
					gen.fakeLog == logExp_L || gen.fakeLog == logExp_R ||
					gen.fakeLog == logExp_U || gen.fakeLog == logExp_D );
			}
		});
		
		
		it("add any road : no nei-s & spec.allowed vecs -> adds to any allowed vec", function(){
			let maze = new Maze(6,3);
			let vectors = [ new Point(1,0), new Point(0,1) ];
			let logExp_0 = "onStart()onAddRoad(3:1 1:0 1)";
			let logExp_1 = "onStart()onAddRoad(3:1 0:1 1)";
			
			for( let i=1; i <= 100; i++ ){
				let gen = new FakeMazeGenerator( new MazeGenerationData(6,3), maze );
				gen.setRoadVectorsAllowed( vectors );
				gen.start();
				
				gen.fakeRandomLog = "";
				gen.addAnyRoad( new Point(3,1) );
				
				assert.isTrue( gen.fakeRandomLog.includes("(0 1)"),
					gen.fakeRandomLog );
				assert.isTrue( gen.fakeLog == logExp_0 || gen.fakeLog == logExp_1, 
					gen.fakeLog );
			}
		});
		
		
		it("add any road : nei -> adds to allowed vecs perp to nei.", 
		function(){
			for( let i = 0; i < 100; i++ ){
				let maze = Maze.fromText(
					[ "10111",
					  "11011",
					  "11111" ] );
				let gen = new MazeGenerator( new MazeGenerationData(5,3) );
				gen.data().roadLengthStart=2;
				gen.data().roadLengthEnd=2;
				//gen.setRoadVectorsAllowed( [ new Point(1,0), new Point(0,1) ] );
				
				gen.start();
				gen.setMaze( maze );
				
				gen.addAnyRoad( new Point(2,0) );
				gen.addAnyRoad( new Point(3,1) );
				gen.addAnyRoad( new Point(2,2) );
				gen.addAnyRoad( new Point(0,2) );
				
				let mazeExp = Maze.fromText(
					[ "10001",
					  "01001",
					  "00001" ] );
				assert.isTrue( gen.maze().equals(mazeExp),   gen.maze().toText()+"$"+i );
			}
		});
	});
	
	
	describe("Roads Level Add", function(){
		
		it("add roads level : first -> base roads", function(){
			for( let i = 1; i <= 100; i++ ){
				let maze = Maze.fromText(
					[ "11111",
					  "01111",
					  "11111" ] );
				let vectorsAllowed = [ new Point(1,0), new Point(0,1) ];
				let mazeExp = Maze.fromText(
					[ "00111",
					  "00011",
					  "11001" ] );
				
				let gen = new MazeGenerator( new MazeGenerationData(5,3) );
				gen.data().roadLengthStart = 2;
				gen.data().roadLengthEnd = 2;
				gen.data().roadsCountPerLevelStart = 3;
				gen.data().roadsCountPerLevelEnd = 3;
				gen.start();
				gen.setMaze( maze );
				gen.setRoadVectorsAllowed( vectorsAllowed );
				
				gen.addRoadsLevel( 1, [new Point(0,0), new Point(2,2)] );
				
				assert.isTrue( gen.maze().equals(mazeExp) ,  gen.maze().toText()+"$"+i );
			}
		});
		
		
		it("add roads level : more first -> dec. roads", function(){
			let maze = Maze.fromText(
				[ "1111",
				  "0111" ] );
			
			let gen = new MazeGenerator( new MazeGenerationData(4,2) );
			gen.data().roadLengthStart = 3;
			gen.data().roadLengthEnd = 3;
			gen.data().roadsCountPerLevelStart = 2;
			gen.data().roadsCountPerLevelEnd = 2;
			gen.data().roadLengthDivision = 1.5;
			gen.start();
			gen.setMaze( maze );
			gen.setRoadVectorsAllowed( [new Point(1,0), new Point(0,1)] );
			
			gen.addRoadsLevel( 2, [new Point(0,0)] );
			
			let mazeExp = Maze.fromText( 
				[ "0011",
				  "0011" ] );
			assert.isTrue( mazeExp.equals(maze),  maze.toText() );
		});
		
		
		it("add roads level -> log", function(){
			let gen = new FakeMazeGenerator( new MazeGenerationData(4,3) );
			gen.start();
			gen.fakeLog = "";
			gen.addRoadsLevel(1, [new Point(1,2)] );
			
			assert.isTrue( gen.fakeLog.includes("afterAddRoadsLevel(1)") );
		});
		
		
		it("full gen", function(){
		for( let i = 1; i <= 100; ++i ){
			let maze = Maze.fromText(
				[ "1111111",
				  "1111111",
				  "0111111",
				  "1111111" ] );
				  
			let gen = new MazeGenerator( new MazeGenerationData(7,4) );
			gen.data().roadLengthStart = 4;
			gen.data().roadLengthEnd = 4;
			gen.data().roadLengthDivision = 2;
			gen.data().roadsCountPerLevelStart = 3;
			gen.data().roadsCountPerLevelEnd = 3;
			gen.data().roadsLevelsCountStart = 2;
			gen.data().roadsLevelsCountEnd = 2;
			gen.start();
			gen.setMaze( maze );
			gen.setFirstPoints( [new Point(0,3)] );
			gen.setRoadVectorsAllowed( [ new Point(1,0), new Point(0,-1) ] );
			
			gen.addAllRoads();
			
			let mazeExp = Maze.fromText(
				[ "1110000",
				  "1110111",
				  "0110001",
				  "0000011" ] );
			assert.isTrue( mazeExp.equals(maze), maze.toText() );
		}
		});
		
		
		it("full gen -> log", function(){
			let gen = new FakeMazeGenerator( new MazeGenerationData(4,3) );
			gen.data().roadsLevelsCountStart = 2;
			gen.data().roadsLevelsCountEnd = 2;
			
			let resultMaze = gen.generate();
			let log = gen.fakeLog;
			
			assert.equal( gen.maze(), resultMaze );
			assert.isTrue( log.startsWith("onStart()"), log+"::start" );
			assert.isTrue( log.endsWith("onEnd()"),  log+"::end" );
			assert.isTrue( log.includes("afterAddRoadsLevel(1)"),   log+"::add%1" );
			assert.isTrue( log.includes("afterAddRoadsLevel(2)"),  log+"::add%2" );
			assert.isTrue( gen.maze().hasNoIsolatedFreeCells(), "iso.f.cc." );
		});
	});
	
	
	
});