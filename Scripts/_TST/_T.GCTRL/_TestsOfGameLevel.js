
"use strict"




describe("Game Level Tests", function(){
	let game = null;
	
	
	// just level is real
	beforeEach( function(){
		game = new FakeGame();
		game.fakeLevel = new GameLevel( game );
	});
	
	
	afterEach( function(){
		game = null;
	});
	
	
	
	it( "bear new obj.: ex params -> res-obj. by params", function(){
		let params = new GameObjectCreationParams( "anyOne", 5.4,7.6 );
		params.metaData = new Map();
		let expectedObj = new FakeGameObject("myOne",new Point(0,0), new Point(0,0));
		
		game.fakeResources.fakeNextResource = expectedObj;
		let actualObj = game.level().bearNewObject( params );
		 
		assert.equal( expectedObj, actualObj );
		assert.equal( GAMEOBJECT_STATE_LIVING, actualObj.state() );
		assert.equal( game, actualObj.game() );
		
		assert.isTrue( actualObj.position().matches( new Point(5.4,7.6), 0.001 ) );
		assert.equal( "onBear()onReadMetaData()", actualObj.fakeLog );
		assert.equal( params.metaData, actualObj.fakeLastMetaData );
		assert.equal( "loadResource(Object anyOne)", game.fakeResources.fakeLog );
	} );
	
	
	it("bear new obj. : unex params -> throws error", function(){
		assert.throws(function(){ game.level().bearNewObject( null ); });
		
		assert.equal( "", game.fakeResources.fakeLog );
	});
	
	
	it("bear new obj : not found res. & ok params ->  throws err.", function(){
		let params = new GameObjectCreationParams(
			"X", new Point(0,0), new Point(0,0) );
		
		game.fakeResources.fakeNextObject = null;
		assert.throws( function(){ game.level().bearNewObject(params); });
		
		game.fakeResources.fakeNextObject = "*";
		assert.throws( function(){ game.level().bearNewObject(params); });
	});
	
	
	it("bear obj. : ex. & not-born -> born&added", function(){
		let first = new EmptyGameObject();
		let second = new EmptyGameObject();
		
		game.level().bearObject( first );
		game.level().bearObject( second );
		
		let enumedActual = game.level().enumObjects();
		
		assert.deepEqual( [first, second], enumedActual );
		assert.equal( GAMEOBJECT_STATE_LIVING, first.state() );
		assert.equal( GAMEOBJECT_STATE_LIVING, second.state() );
	});
	
	
	it("bear obj. : ex. & born : nothing", function(){
		let first = new EmptyGameObject();
		
		game.level().bearObject( first );
		game.level().bearObject( first );
		
		assert.deepEqual([first], game.level().enumObjects());
		assert.equal( GAMEOBJECT_STATE_LIVING, first.state() );
	});
	
	
	it("bear obj. : unex -> throws error", function(){
		assert.throws( function(){ game.level().bearObject(null); } );
		assert.throws( function(){ game.level().bearObject("%"); } );
	});
	
	
	it( "enum obj.-s : born -> gets all", function(){
		let firstObj = new EmptyGameObject();
		let secondObj = new EmptyGameObject();
		
		game.fakeResources.fakeNextResource = firstObj;
		let firstObjActual = game.level().bearNewObject( 
			new GameObjectCreationParams("",0,0) );
		
		game.level().bearObject( secondObj );
		
		assert.equal( firstObj, firstObjActual );
				
		let enumedActual = game.level().enumObjects();
		assert.deepEqual( [firstObj, secondObj], enumedActual );
	} );
	
	
	it("enum obj.-s : born & dead -> gets alive only", function(){
		let first = new EmptyGameObject();
		let second = new EmptyGameObject();
		let third = new EmptyGameObject();
		let level = game.level();
		
		level.bearObject( first );
		level.bearObject( second );
		level.bearObject( third );
		second.die();
		
		let enumed = level.enumObjects();
		
		assert.deepEqual( [first, third], level.enumObjects() );
	});
	
	
	it( "update : have obj.-s -> each updated", function(){
		let first = new FakeGameObject("a", new Point(0,0), new Point(0,0));
		let second = new FakeGameObject("b", new Point(0,0), new Point(0,0));
		let mid = new AutodieTestGameObject();
		
		game.level().bearObject( first );
		game.level().bearObject( mid );
		game.level().bearObject( second );
		first.fakeLog = "";
		second.fakeLog = "";
		game.level().updateObjects();
		game.level().updateObjects();
		
		let enumed = game.level().enumObjects();
		assert.equal( "onUpdate()onUpdate()", first.fakeLog );
		assert.equal( first.fakeLog, second.fakeLog );
		assert.deepEqual( [first, second], enumed );
	} );
	
	
	it( "update : have obj.-s & autogen obj.-s -> each with new updated", function(){
		let first = new EmptyGameObject();
		let second = new EmptyGameObject();
		let mid = new FakeGameObjectAutogenerator("Q");
		let level = game.level();
		
		level.bearObject( first );
		level.bearObject( mid );
		level.bearObject( second );
		level.updateObjects();
		level.updateObjects();
		
		let enumed = level.enumObjects();
		assert.equal( 5, enumed.length );
		assert.equal( first, enumed[0] );
		assert.equal( mid, enumed[1] );
		assert.equal( second, enumed[2] );
		
		assert.equal( "onBear()onUpdate()onUpdate()", enumed[3].fakeLog );
		assert.equal( "onBear()onUpdate()", enumed[4].fakeLog );
	});
	
	
	
	it("spec. obj. : spec.obj.ex. -> spec.obj.", function(){
		let maze = new EmptyGameObject();
		maze.fakeSpecialIndex = GAMEOBJECT_SPECIALINDEX_MAZE;
		
		let pc = new EmptyGameObject();
		pc.fakeSpecialIndex = GAMEOBJECT_SPECIALINDEX_PC;
		
		let mazePathFinder = new EmptyGameObject();
		mazePathFinder.fakeSpecialIndex = GAMEOBJECT_SPECIALINDEX_MAZEPATHFINDER;
		
		let level = game.level();
		level.bearObject( new EmptyGameObject() );
		
		level.bearObject( maze );
		assert.equal( maze, level.specialObject( GAMEOBJECT_SPECIALINDEX_MAZE ),  "MAZE" );
		
		level.bearObject( pc );
		assert.equal( pc, level.specialObject( GAMEOBJECT_SPECIALINDEX_PC ),  "PC" );
		
		level.bearObject( mazePathFinder );
		assert.equal( mazePathFinder, level.specialObject( GAMEOBJECT_SPECIALINDEX_MAZEPATHFINDER ), "MAZE-PF" );
		
		assert.equal( null, level.specialObject( -1 ) );
		assert.equal( null, level.specialObject( GAMEOBJECT_SPECIALS_COUNT ) );
	});
	
	
	it("spec.obj. : no spec.obj. -> null", function(){
		let level = game.level();
		
		assert.equal( null, level.specialObject( GAMEOBJECT_SPECIALINDEX_MAZE ) );
		assert.equal( null, level.specialObject( GAMEOBJECT_SPECIALINDEX_PC ) );
	});
	
	
	it("spec.obj. : after killed & upd.obj-s -> null", function(){		
		let maze = new EmptyGameObject();
		maze.fakeSpecialIndex = GAMEOBJECT_SPECIALINDEX_MAZE;
		
		let pc = new EmptyGameObject();
		pc.fakeSpecialIndex = GAMEOBJECT_SPECIALINDEX_PC;
		
		let level = game.level();
		level.bearObject( pc );
		level.bearObject( maze );
		
		maze.die();
		level.updateObjects();
		assert.equal( null, level.specialObject( GAMEOBJECT_SPECIALINDEX_MAZE ) );
		assert.equal( pc, level.specialObject( GAMEOBJECT_SPECIALINDEX_PC ) );
		
		pc.die();
		level.updateObjects();
		assert.equal( null, level.specialObject( GAMEOBJECT_SPECIALINDEX_MAZE ) );
		assert.equal( null, level.specialObject( GAMEOBJECT_SPECIALINDEX_PC ) );
	});
	
	
	describe( "Load", function(){
		let loadedGame = null;
		
		
		
		beforeEach( function(){
			loadedGame = new FakeGame();
			loadedGame.fakeLevel = new GameLevel( loadedGame );
			loadedGame.fakeResources = new GameResourcesLoader( loadedGame );
		} );
		
		
		afterEach( function(){
			loadedGame = null;
		} );
		
		
		it("load -> has expected objects", function(){
			loadedGame.level().load();
			
			let maze = loadedGame.level().specialObject( GAMEOBJECT_SPECIALINDEX_MAZE );
			assert.instanceOf( maze, Maze );
			
			let pc = loadedGame.level().specialObject( GAMEOBJECT_SPECIALINDEX_PC );
			assert.instanceOf( pc, PlayerCharacter );
			
			let mazePathFinder = loadedGame.level().specialObject( GAMEOBJECT_SPECIALINDEX_MAZEPATHFINDER );
			assert.instanceOf( mazePathFinder, MazePathFinder );
			
			let land = loadedGame.level().specialObject( GAMEOBJECT_SPECIALINDEX_LAND );
			assert.instanceOf( land, Land );
		} );
	
	} );
	

} );