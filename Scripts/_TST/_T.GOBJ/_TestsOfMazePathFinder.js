

"use strict"


describe("Maze Path Finder Tests", function(){
	function makeFinder(maze){
		return new MazePathFinder(maze);
	}
	
	
	function assertPathNotFound(path){
		assert.equal( 0, path.steps().length );
	}
	
	
	function assertCantFindPath( finder, start, end ){
		assertPathNotFound( finder.find(start, end) );
	}
	
	
	function assertPathFoundSteps( path, maze, stepsExp ){
		let pathExp = new MazePath(stepsExp);
				
		assert.isTrue( path.matches(pathExp),  `${path.steps()} == ${pathExp.steps()} for ${maze.toText()}` );
	}
	
	
	function assertFindsPathSteps( finder, start, end, stepsExp ){
		assertPathFoundSteps( finder.find(start,end), finder.maze(), stepsExp );
	}
	
	
	it("create", function(){
		let maze = new Maze(3,2);
		let finder = makeFinder(maze);
		
		assert.equal( maze, finder.maze() );
		assert.notEqual( maze, finder.mapMaze() );
		assert.equal( 3, finder.mapMaze().cellsCountX() );
		assert.equal( 2, finder.mapMaze().cellsCountY() );
	});
	
	
	it("create -> map maze empty", function(){
		let maze = new Maze(3,2);
		let finder = makeFinder(maze);
		
		assert.isTrue( finder.mapMaze().isFilledWith(0) );
	});
	
	
	it("create : no maze -> error", function(){
		assert.throws( function(){ makeFinder(null); } );
	});
	
	
	
	describe("Fake Finder", function(){
		it("create : ok params -> ok data", function(){
			let maze =  new Maze(1,2);
			let finder = new FakeMazePathFinder( maze );
			
			assert.instanceOf( finder, MazePathFinder );
			assert.equal( maze, finder.maze() );
		} );
		
		
		it("find : have fake next path -> returns it", function(){
			let maze = new Maze(9,8);
			let finder = new FakeMazePathFinder( maze );
			
			finder.fakeNextFindPath = MazePath.createFound( [ new Point(4,2), new Point(3,2) ] );
			let pathFound = finder.find(new Point(1,5), new Point(7,6) );
			
			assert.equal( finder.fakeNextFindPath, pathFound ); 
		} );
	} );
	
	
	
	
	describe( "Simple Find", function(){
		let maze = null;
		let finder = null;
		
		beforeEach(function(){
			maze = new Maze(6,3);
			finder = makeFinder(maze);
		});
		
		
		afterEach(function(){
			maze = null;
			finder = null;
		});
		
		
		it("find : unexist start|end -> no", function(){
			assertCantFindPath( finder, new Point(0,-1), new Point(0,0) );
			assertCantFindPath( finder, new Point(-1,0), new Point(0,0) );
			
			assertCantFindPath( finder, new Point(6,0), new Point(0,0) );
			assertCantFindPath( finder, new Point(0,3), new Point(0,0) );
			
			assertCantFindPath( finder, new Point(0,3), new Point(6,0) );
			assertCantFindPath( finder, new Point(6,0), new Point(0,3) );
		});
		
		
		it("find : have obstacle start|end -> no", function(){
			maze.setCell(2,1, 100);
			maze.setCell(3,0, 200);
			
			assertCantFindPath( finder, new Point(-1,0), new Point(2,1) );
			assertCantFindPath( finder, new Point(0,0), new Point(3,0) );
			assertCantFindPath( finder, new Point(5,2), new Point(3,0) );
			assertCantFindPath( finder, new Point(0,-1), new Point(2,1) );
			
			assertCantFindPath( finder, new Point(2,1), new Point(-1,0) );
			assertCantFindPath( finder, new Point(3,0), new Point(0,0) );
			assertCantFindPath( finder, new Point(2,1), new Point(5,2) );
			assertCantFindPath( finder, new Point(3,0), new Point(0,-1) );
			
			assertCantFindPath( finder, new Point(6,0), new Point(2,1) );
			assertCantFindPath( finder, new Point(0,3), new Point(2,1) );
			assertCantFindPath( finder, new Point(2,1), new Point(6,0) );
			assertCantFindPath( finder, new Point(2,1), new Point(0,3) );
			
			assertCantFindPath( finder, new Point(2,1), new Point(2,1) );
			assertCantFindPath( finder, new Point(3,0), new Point(2,1) );
		});
		
		
		it("find : eq free start,end -> yes 1 eq", function(){
			assertFindsPathSteps( finder, new Point(0,0), new Point(0,0), [new Point(0,0)] );
			assertFindsPathSteps( finder, new Point(5,0), new Point(5,0), [new Point(5,0)] );
			assertFindsPathSteps( finder, new Point(0,2), new Point(0,2), [new Point(0,2)] );
			assertFindsPathSteps( finder, new Point(5,2), new Point(5,2), [new Point(5,2)] );
		});
		
		
		it("find : free start & end are dir.nei.-s -> yes 2", function(){
			assertFindsPathSteps( finder, 
				 new Point(3,1), new Point(4,1),
				[new Point(3,1), new Point(4,1)] );
				
			assertFindsPathSteps( finder,
				 new Point(3,1), new Point(2,1),
				[new Point(3,1), new Point(2,1)] );
			
			assertFindsPathSteps( finder,
				 new Point(4,2), new Point(4,1),
				[new Point(4,2), new Point(4,1)] );
				
			assertFindsPathSteps( finder,
				 new Point(4,1), new Point(4,2),
				[new Point(4,1), new Point(4,2)] );
		});
	});
	
	
	function checkFind( text, startPoint, endPoint, pathTextExp ){
		let mazeIn = Maze.fromText( text );
		
		let finder = makeFinder(mazeIn);
		let path = finder.find(startPoint, endPoint);
		
		let pathExp = new MazePath([]);
		let mazeExp = Maze.fromPathText( pathExp, pathTextExp );
		
		assert.isTrue( pathExp.matches( path,0 ),
			`\n${pathExp} & \n${path}\n${mazeExp.toPathText(pathExp)}\n==\n${mazeIn.toPathText(path)}` );
	}
	
	
	describe("Hard Direct Find", function(){
		
		it("once path", function(){
			// from bottom
			checkFind([
				"12345678",
				"12000078",
				"12045078",
				"12045678"],
				new Point(2,3),
				new Point(5,2), [
				"12345678",
				"12CDEF78",
				"12B45G78",
				"12A45678" ]);
				
			//from top
			checkFind([
				"912345",
				"100056",
				"103050",
				"103000"],
				new Point(1,3), 
				new Point(5,2), [
				"912345",
				"1CDE56",
				"1B3F5J",
				"1A3GHI" ]);
				
			//from right
			checkFind([
				"120006789",
				"120406000",
				"123400080",
				"123456789"],
				new Point(8,2),
				new Point(2,1), [
				"12KJI6789",
				"12L4H6dcb",
				"1234GFe8a",
				"123456789" ]);
				
			//from left
				checkFind([
					"1234567",
					"0004067",
					"1200067"],
					new Point(0,1),
					new Point(4,1),[
					"1234567",
					"ABC4G67",
					"12DEF67"] );
		});
		
		
		it("once path line", function(){
			checkFind([
				"1234567",
				"1230007"],
				new Point(3,1),
				new Point(5,1), [
				"1234567",
				"123ABC7" ]);
				
			checkFind( [
				"123456",
				"120006" ],
				new Point(4,1),
				new Point(2,1), [
				"123456",
				"12CBA6"] );
		});
		
		
		it("once good path", function(){
			checkFind([
				"103056789",
				"100000009",
				"003450789",
				"103456789" ],
				new Point(1,3),
				new Point(5,2), [
				"103056789",
				"1CDEFG009",
				"0B345H789",
				"1A3456789" ] );
		});
		
		
		it("many good paths -> shortest good path", function(){
			checkFind([
				"120006789",
				"120406709",
				"100000009",
				"100000009"],
				new Point(1,2),
				new Point(7,1),[
				"120006789",
				"1204067H9",
				"1ABCDEFG9",
				"100000009"] );
		});
	});
	
	
	describe("Diagonal Find", function(){
		it("once path", function(){
			// to up left
			checkFind([
				"123456",
				"120056",
				"123006",
				"123406"],
				new Point(4,3),
				new Point(2,1), [
				"123456",
				"12ed56",
				"123cb6",
				"1234a6"]);
				
			// to up right
			checkFind([
				"123456",
				"120006",
				"100406",
				"103456"],
				new Point(1,3),
				new Point(4,2),[
				"123456",
				"12def6",
				"1bc4g6",
				"1a3456"] );
				
			// to down right
			checkFind([
				"81234567",
				"81204567",
				"81200567",
				"81230567"],
				new Point(3,1),
				new Point(4,3),[
				"81234567",
				"812a4567",
				"812bc567",
				"8123d567" ]);
				
			// to down left
			checkFind([
				"81234567",
				"81234507",
				"81234007",
				"81234067" ],
				new Point(6,1),
				new Point(5,3),[
				"81234567",
				"812345A7",
				"81234CB7",
				"81234D67" ] );
		});
		
	});
	
});