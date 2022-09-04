

"use strict"


describe( "Maze Tests", function(){
	let game = null;
	
	beforeEach(function(){
		game = new FakeGame();
	});
	
	
	afterEach(function(){
		game = null;
	});
	
	
	
	function checkCreate( w, h, expW, expH ){
		let maze = new Maze( w,h );
		
		assert.instanceOf( maze, GameObject );
		assert.equal( GAMEOBJECT_SPECIALINDEX_MAZE, maze.specialIndex() );
		
		assert.equal( expW, maze.cellsCountX() );
		assert.equal( expH, maze.cellsCountY() );
	}
	
	
	function checkCellAccess( m, x,y, setting, gettingExp ){
		m.setCell( x,y, setting );
		let gettingAct = m.cell(x,y);
		
		assert.equal( gettingExp, gettingAct );
	}
	
	
	function checkFromText( input, outputExp ){
		let m = Maze.fromText( input );
		
		let outputAct = m.toText();
		
		assert.deepEqual( outputExp, outputAct );
	}
	
	
	function checkHasNoIsolatedFreeCells( mazeText, resultExp ){
		let maze = Maze.fromText( mazeText );
		
		let resultAct = maze.hasNoIsolatedFreeCells();
		
		assert.equal( resultExp, resultAct,   maze.toText() );
	}
	
	
	function checkEquality( firstText, secondText, resultExp ){
		let first = Maze.fromText(firstText);
		let second = Maze.fromText(secondText);
		
		assert.equal( resultExp, first.equals(second) );
		assert.equal( resultExp, second.equals(first) );
	}
	
	
//---
	it("create : ok params", function(){
		checkCreate( 7,4, 7,4 );
	});
	
	
	it("create : bad params", function(){
		checkCreate( -1,8, 1, 8 );
		checkCreate( 0,9, 1,9 );
		
		checkCreate( 16,-1, 16,1 );
		checkCreate( 15,0, 15,1 );
		
		checkCreate( 0,0, 1,1 );
	});
	
	
	it("cell access : ok indices & inrange values", function(){
		let m = new Maze(3,2);
		checkCellAccess( m, 0,0, 100,100 );
		checkCellAccess( m, 1,0, 200,200 );
		checkCellAccess( m, 2,0, 300,300 );
		
		checkCellAccess( m, 0,1, -111,-111 );
		checkCellAccess( m, 1,1, -222,-222 );
		checkCellAccess( m, 2,1, 333,333 );
	});
	
	
	it("cell access : bad indices", function(){
		let m = new Maze(2,4);
		checkCellAccess( m, -1,0, 111,0 );
		checkCellAccess( m, 0,-1, 222,0 );
		checkCellAccess( m, -1,-1, 333,0 );
		
		checkCellAccess( m, 2,0, -111,0 );
		checkCellAccess( m, 2,-1, -222,0 );
		checkCellAccess( m, 0,4, -333,0 );
		checkCellAccess( m, -1,4, -444,0 );
		
		checkCellAccess( m, 2,4, 500,0 );
	});
	
	
	it("is filled with", function(){
		let m = new Maze(3,2);
		assert.isTrue( m.isFilledWith(0) );
		
		m.setCell(0,0, 45);
		m.setCell(1,0, 45);
		m.setCell(2,0, 45);
		
		m.setCell(0,1, 45);
		m.setCell(1,1, 45);
		m.setCell(2,1, 45);
		
		assert.isTrue( m.isFilledWith(45) );
		assert.isFalse( m.isFilledWith(44) );
		
		m.setCell(1,1, 48);
		
		assert.isFalse( m.isFilledWith(48) );
		assert.isFalse( m.isFilledWith(45) );
	});
	
	
	it("fill", function(){
		let m = new Maze( 2,3 );
		
		m.fill(77);
		
		assert.isTrue( m.isFilledWith(77) );
		
		m.fill(-55);
		
		assert.isTrue( m.isFilledWith(-55) );
	});
	
	
	it("cell is obstacle -> yes for +, no for -/0/null", function(){
		let m = new Maze(7,8);
		
		assert.isFalse( m.isObstacleCell(6,7) );
		
		m.setCell(0,0, 1);
		assert.isTrue( m.isObstacleCell(0,0) );
		m.setCell(6,7, 20000);
		assert.isTrue( m.isObstacleCell(6,7) );
		
		m.setCell(6,7, 0);
		assert.isFalse( m.isObstacleCell(6,7) );
		m.setCell(0,0, -200000);
		assert.isFalse( m.isObstacleCell(0,0) );
		
		assert.isFalse( m.isObstacleCell(-1,0) );
		assert.isFalse( m.isObstacleCell(0,-1) );
		assert.isFalse( m.isObstacleCell(7,0) );
		assert.isFalse( m.isObstacleCell(0,8) );
	});
	
	
	it("cell is free -> yes for 0/-, no for +/null", function(){
		let m  = new Maze(3,6);
		
		assert.isTrue( m.isFreeCell(2,5) );
		
		m.setCell(2,5, 50);
		assert.isFalse( m.isFreeCell(2,5) );
		
		m.setCell(2,5, -1);
		assert.isTrue( m.isFreeCell(2,5) );
		
		assert.isFalse( m.isFreeCell(0,-1) );
		assert.isFalse( m.isFreeCell(-1,0) );
		assert.isFalse( m.isFreeCell(3,1) );
		assert.isFalse( m.isFreeCell(1,6) );
	});
	
	
	it("equals", function(){
		let a = new Maze(3,2);
		a.setCell(0,0, 4);
		a.setCell(1,0, -7);
		a.setCell(2,1, 100);
		
		let b = new Maze(3,2);
		b.setCell(0,0, 4);
		b.setCell(1,0, -7);
		b.setCell(2,1, 100);
		
		assert.isTrue( a.equals(b) && b.equals(a) );
		
		b.setCell(2,1, 60);
		
		assert.isFalse( a.equals(b) || b.equals(a) );
		
		checkEquality( ["11","01"], ["11"], false );
		checkEquality( ["10"], ["10","01"], false );
	});
	
	
	it("real sizes", function(){
		let m = new Maze(10,5);
		
		assert.isTrue( m.cellSize().matches(new Point(1,1), 0),
			"cell size : on start" );
		assert.isTrue( m.size().matches( new Point(10,5), 0 ),
			"size : on start" );
		
		game.config().cellWidth = 30;
		game.config().cellHeight = 25;
		m.bear( game );
		
		assert.isTrue( m.cellSize().matches( new Point(30,25), 0 ),
			"cell size"  );
		
		m.update( game );
		
		assert.isTrue( m.size().matches( new Point(300,125), 0 ),
			"size" );
	});
	
	
	it("point & indexes", function(){
		let m = new Maze(9,8);
		m.bear( game );
		game.config().cellWidth = 100;
		game.config().cellHeight = 50;
		
		let point = m.cellPointByIndexes( new Point(3.2,2.5) );
		assert.closeTo( 320, point.x(), 1 );
		assert.closeTo( 125, point.y(), 1 );
		
		let indexes = m.cellIndexesByPoint( new Point(499,149) );
		assert.equal( 4, indexes.x() );
		assert.equal( 2, indexes.y() );
	});
	
	
	it("indexes + deltas", function(){
		let m = new Maze(9,8);
		m.bear( game );
		m.game().config().cellWidth = 50;
		m.game().config().cellHeight = 100;
		
		let indexes = m.cellIndexesByPoint( new Point(50-12.4, 200-9), new Point(0.25, 0.1) );
		
		assert.closeTo( 1, indexes.x(), 0 );
		assert.closeTo( 2, indexes.y(), 0 );
	});
	
	
	
	it("from text", function(){
		checkFromText( ["100","010"], ["100","010"] );
		checkFromText( ["101","01"], ["101","010"] );
		checkFromText( [], ["0"] );
		
		checkFromText( 
				["123", "406", "789", "050"],
				["123", "406", "789", "050"] );
	});
	
	
	it("from text : too big cell values", function(){
		let maze = new Maze(3,1);
		maze.setCell(1,0, -1);
		maze.setCell(2,0, 10);
		
		let text = maze.toText();
		
		assert.deepEqual( ["009"], text );
	});
	
	
	
	it("has no isolated free cells -> yes", function(){
		checkHasNoIsolatedFreeCells( 
			[ "111",
			  "101",
			  "101" ], true );
		checkHasNoIsolatedFreeCells(
			[ "111",
			  "101",
			  "101" ], true );
		checkHasNoIsolatedFreeCells(
			[ "111",
			  "001",
			  "111" ], true );
		checkHasNoIsolatedFreeCells(
			[ "111",
			  "100",
			  "111" ], true );
		checkHasNoIsolatedFreeCells(
		  [ "111",
		    "101",
		    "111" ], true );
		 checkHasNoIsolatedFreeCells(
		 	[ "111",
		 	  "111",
		 	  "111" ], true );
		 	  
		 checkHasNoIsolatedFreeCells(
		 	[ "011",
		 	  "001",
		 	  "111" ], true );
	});
	
	
	it("has no isolated free cells -> no", function(){
		checkHasNoIsolatedFreeCells( 
			[ "111011",
			  "101101",
			  "101111" ], false );
		checkHasNoIsolatedFreeCells(
			[ "111110",
			  "101101",
			  "101111" ], false );
		checkHasNoIsolatedFreeCells(
			[ "111111",
			  "101101",
			  "101011" ], false );
		checkHasNoIsolatedFreeCells(
			[ "111111",
			  "101101",
			  "101110" ], false );
			  
		checkHasNoIsolatedFreeCells(
			[ "11111", 
			  "10101", 
			  "11111" ], false );
	});
	
	
	
	describe("Named Cells", function(){
		let maze = null;
		
		beforeEach( function(){
			maze = new Maze(10,9);
		});
		
		afterEach( function(){
			maze = null;
		});
		
		
		it("add -> count & get/filter found", function(){
			maze.addNamedCell( "Alpha", new Point(1,8) );
			maze.addNamedCell( "Bublik", new Point(2,8) );
			maze.addNamedCell( "Alpha", new Point(3,8) );
			
			assert.equal( 3, maze.namedCellsCount() );
			
			let alpha = maze.namedCell("Alpha");
			let bublik = maze.namedCell("Bublik");
			
			assert.isTrue( alpha.matches(new Point(1,8), 0) );
			assert.isTrue( bublik.matches(new Point(2,8), 0) );
			
			let allAlphas = maze.filterNamedCells("Alpha");
			
			assert.equal( 2, allAlphas.length );
			assert.isTrue( allAlphas[0].matches(new Point(1,8), 0) );
			assert.isTrue( allAlphas[1].matches(new Point(3,8), 0) );
		});
		
		
		it("add & remove -> count & get found", function(){
			maze.addNamedCell("G", new Point(3,7) );
			maze.addNamedCell("H", new Point(4,7) );
			maze.addNamedCell("g", new Point(2,8) );
			maze.addNamedCell("G", new Point(5,7) );
			maze.addNamedCell("h", new Point(1,8) );
			
			maze.removeNamedCellsByName("G");
			
			assert.equal( 3, maze.namedCellsCount() );
			assert.isTrue( maze.namedCell("H").matches(new Point(4,7),0) );
			assert.isTrue( maze.namedCell("g").matches(new Point(2,8),0) );
			assert.isTrue( maze.namedCell("h").matches(new Point(1,8),0) );
			
			maze.addNamedCell("i", new Point(1,8));
			maze.removeNamedCell( maze.namedCell("h") );
			
			assert.equal( 3, maze.namedCellsCount() );
			assert.isTrue( maze.namedCell("H").matches(new Point(4,7),0) );
			assert.isTrue( maze.namedCell("g").matches(new Point(2,8),0) );
			assert.isTrue( maze.namedCell("i").matches(new Point(1,8),0) );
		});
		
		
		it("enum entries", function(){
			maze.addNamedCell("Q", new Point(1,7));
			maze.addNamedCell("W", new Point(2,7));
			maze.addNamedCell("E", new Point(3,7));
			maze.removeNamedCellsByName("W");
			
			let all = maze.enumNamedCellsEntries();
			maze.removeNamedCellsByName("E");
			
			assert.equal( 2, all.length );
			assert.equal("Q", all[0][0] );
			assert.isTrue( all[0][1].matches( new Point(1,7),0 ) );
			assert.equal("E", all[1][0] );
			assert.isTrue( all[1][1].matches( new Point(3,7), 0 ) );
		});
		
		
		it("clear", function(){
			maze.addNamedCell( "G", new Point(3,1) );
			maze.addNamedCell( "H", new Point(5,4) );
			
			maze.clearNamedCells();
			
			assert.equal( 0, maze.namedCellsCount() );
		});
	});
	
});