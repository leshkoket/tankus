
"use strict"


describe( "Fake Game Tests", function(){
	
	it("g.o. special indexes", function(){
		assert.isTrue( GAMEOBJECT_SPECIALINDEX_NONE < 0 );
		
		let all = [
			GAMEOBJECT_SPECIALINDEX_MAZE,
			GAMEOBJECT_SPECIALINDEX_PC,
			GAMEOBJECT_SPECIALINDEX_MAZEPATHFINDER,
			GAMEOBJECT_SPECIALINDEX_LAND
		];
		
		assert.equal( all.length, GAMEOBJECT_SPECIALS_COUNT,  "count" );
		
		let allUnique = new Set(all);
		assert.sameMembers( [...allUnique].sort(), all.sort() );
	});
	
	
	it( "create", function(){
		let game = new FakeGame();
		
		assert.isNotNull( game.fakeResources );
		assert.equal( game.fakeResources, game.resources() );
		
		assert.isNotNull( game.fakeLevel );
		assert.equal( game.fakeLevel, game.level() );
		
		assert.isTrue( game.fakeCamera instanceof CameraInterface );
		assert.equal( game.fakeCamera, game.camera() );
		
		assert.instanceOf( game.config(), GameConfig );
		assert.equal( game.fakeConfig, game.config() );
		
		assert.instanceOf( game.time(), GameTime );
		assert.instanceOf( game.time().systemTime(), FakeSystemTime );
		assert.equal( game.fakeSystemTime, game.time().systemTime() );
		
		assert.isNotNull( game.graphics() );
		assert.isNotNull( game.graphicsNode() );
	} );
	
	
	it( "create : release", function(){
		let game = new FakeGame( false );
		let game_2 = new FakeGame();
		
		assert.isFalse( game.debugMode() );
		assert.isFalse( game_2.debugMode() );
	} );
	
	
	it( "create : debug", function(){
		let game = new FakeGame( true );
		
		assert.isTrue( game.debugMode() );
	} );
	
	
	it( "fake resources : load resource", function(){
		let game = new FakeGame();
		
		game.fakeResources.fakeNextResource = "<RES>";
		let loaded = game.resources().loadResource( "My", "a" );
		
		assert.equal( "loadResource(My a)", game.fakeResources.fakeLog );
		assert.equal( "<RES>", loaded );
		
		game.fakeResources.fakeNextResource = "<TWO>";
		let loaded_2 = game.resources().loadResource( "Your", "b" );
		
		assert.equal( "loadResource(My a)loadResource(Your b)", 
			game.fakeResources.fakeLog );
		assert.equal( "<TWO>", loaded_2 );
	} );
	
	
	
	describe("Fake GameLevel", function(){
		
		it("special object", function(){
			let level = new FakeGameLevel();
			level.fakeSpecialObjects = [ 
				new FakeGameObject("A",new Point(0,0), new Point(0,0)), 
				new FakeGameObject("B", new Point(0,0), new Point(0,0)) ];
			
			let A = level.specialObject( 0 );
			let B = level.specialObject( 1 );
			
			assert.equal( level.fakeSpecialObjects[0], A );
			assert.equal( level.fakeSpecialObjects[1], B );
		});
		
		
		it( "bear new object", function(){
			let game = new FakeGame();
			game.fakeLevel.fakeNextObject = "<OBJECT>";;
			let objParams  = new GameObjectCreationParams( "Q", 5, 4 );
			
			game.level().bearNewObject( objParams );
			let obj = game.level().bearNewObject( objParams );
			
			assert.equal( "bearNewObject(Q)bearNewObject(Q)",
				game.fakeLevel.fakeLog );
			assert.equal( "<OBJECT>", obj );
			assert.equal( objParams, game.fakeLevel.fakeLastCreationParams );
		} );
		
		
		it( "bear object", function(){
			let game = new FakeGame();
			let obj = new EmptyGameObject("A");
			let oldParams = new GameObjectCreationParams("",0,0);
			
			game.fakeLevel.fakeNextObject = obj;
			game.fakeLevel.fakeLastCreationParams = oldParams;
			
			game.level().bearObject(obj);
			game.level().bearObject( null );
			game.level().bearObject(obj);
			
			assert.equal( "bearObject(A)bearObject(<NULL>)bearObject(A)",
				 game.fakeLevel.fakeLog );
			assert.equal( null, game.fakeLevel.fakeLastCreationParams );
			assert.equal( obj, game.fakeLevel.fakeNextObject );
		} );
		
		
		it("load", function(){
			let game = new FakeGame();
			
			game.level().load();
			
			assert.equal( "load()", game.fakeLevel.fakeLog );
		});
	
	
	});
	
	
	
	it( "fake camera", function(){
		let game = new FakeGame();
		let camera = game.camera();
		
		camera.moveToWorldXY( 9,12 );
		camera.moveToWorldXY(4,5);
		assert.equal( "moveToWorldXY(9 12)moveToWorldXY(4 5)", camera.fakeLog );
		
		assert.equal( 6, game.camera().worldX(6) );
		assert.equal( 8, game.camera().worldY(8) );
		assert.equal( 36, game.camera().displayX(36) );
		assert.equal( 48, game.camera().displayY(48) );
		assert.isTrue( 0 < game.camera().screenWidth() );
		assert.isTrue( 0 < game.camera().screenHeight() );
	});


} );