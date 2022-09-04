

describe("Game Object Tests", function(){
	const PRECISION = 0.0000000001;
	const RAD_PRECISION = 0.0001;
	
	
	function MakeFakeGameObject(id){
		return new FakeGameObject(""+id, new Point(0,0), new Point(0,0) );
	}
	
	
	it( "create", function(){
		let pos = new Point(7.1,8.2);
		let size = new Point( 40.6, 30.5 );
		let obj = new FakeGameObject( "myObject", pos, size );
		
		assert.equal( "myObject", obj.kind() );
		assert.isTrue( obj.position().matches( pos, PRECISION ) );
		assert.notEqual( pos, obj.position() );
		assert.isTrue( obj.size().matches( size, PRECISION ) );
		assert.notEqual( size, obj.size() );
		
		assert.equal( GAMEOBJECT_STATE_JUST_CREATED, obj.state() );
		assert.equal( GAMEOBJECT_GOTOSTATE_NONE, obj.goToState() );
		assert.equal( -1, obj.specialIndex() );
	} );
	
	
	it( "set data", function(){
		let obj = new EmptyGameObject();
		let pos = new Point(5.5,6.6);
		let size = new Point(8.8,9.9);
		
		obj.setPosition( pos );
		obj.setSize( size );
		
		assert.notEqual( size, obj.size() );
		assert.isTrue( new Point(8.8, 9.9).matches( obj.size(), PRECISION ) );
		assert.notEqual( pos, obj.position() );
		assert.isTrue( new Point(5.5, 6.6).matches( obj.position(), PRECISION ) );
	} );
	
	
	
	describe( "Living Events", function(){
		/*
		ok:
			bear() when created 
			{ update(), } when created & than...
			{ update(), } when born & than...
			die() when born.
			die() when born & updates...
		failure:
			bear() when born.
			bear() when dead.
			update() when dead.
			die() when dead.
			die() when just created.
		*/
		let game = null;
		let obj = null;
		
		
		beforeEach( function(){
			game = new FakeGame();
			obj = MakeFakeGameObject();
		} );
		
		
		afterEach( function(){
			game = null;
		} );
		
		
		//( good )
		it( "bear : just created", function(){
			obj.bear( game );
			
			assert.equal( GAMEOBJECT_STATE_LIVING, obj.state() );
			assert.equal( obj.fakeLog, "onBear()" );
			assert.equal( game, obj.game() );
		} );
		
		
		it( "update : just created & than", function(){
			obj.update( game );
			
			assert.equal( GAMEOBJECT_STATE_LIVING, obj.state() );
			assert.equal( obj.fakeLog, "onBear()onUpdate()" );
			assert.equal( game, obj.game() );
			
			obj.update( game );
			
			assert.equal( obj.fakeLog, "onBear()onUpdate()onUpdate()" );
			assert.equal( game, obj.game() );
			assert.equal( GAMEOBJECT_STATE_LIVING, obj.state() );
		} );
		
		
		it( "update when born & than", function(){
			obj.bear( game );
			obj.update( game );
			
			assert.equal( "onBear()onUpdate()", obj.fakeLog );
			assert.equal( GAMEOBJECT_STATE_LIVING, obj.state() );
			assert.equal( game, obj.game() );
			
			obj.update( game );
			assert.equal( "onBear()onUpdate()onUpdate()", obj.fakeLog );
			assert.equal( GAMEOBJECT_STATE_LIVING, obj.state() );
			assert.equal( game, obj.game() );
		} );
		
		
		it( "die when born", function() {
			obj.bear( game );
			obj.die();
			
			assert.equal( "onBear()onDie()", obj.fakeLog );
			assert.equal( GAMEOBJECT_STATE_DEAD, obj.state() );
			assert.equal( game, obj.game() );
		} );
		
		
		it( "die when born & updated", function(){
			obj.bear( game );
			obj.update( game );
			obj.die();
			
			assert.equal( "onBear()onUpdate()onDie()", obj.fakeLog );
			assert.equal( GAMEOBJECT_STATE_DEAD, obj.state() );
			assert.equal( game, obj.game() );
		} );
		
		
		//( bad )
		it( "bear : when living -> no", function(){
			obj.bear( game );
			obj.bear( new FakeGame() );
			obj.update( game );
			obj.bear( new FakeGame() );
			
			assert.equal( "onBear()onUpdate()", obj.fakeLog );
			assert.equal( game, obj.game() );
			assert.equal( GAMEOBJECT_STATE_LIVING, obj.state() );
		} );
		
		
		it( "bear : when dead -> no", function(){
			obj.bear( game );
			obj.die();
			obj.bear( new FakeGame() );
			
			assert.equal( "onBear()onDie()", obj.fakeLog );
			assert.equal( game, obj.game() );
			assert.equal( GAMEOBJECT_STATE_DEAD, obj.state() );
		} );
		
		
		it( "update : when dead -> no", function(){
			obj.bear( game );
			obj.die();
			obj.update( new FakeGame() );
			
			assert.equal( "onBear()onDie()", obj.fakeLog );
			assert.equal( game, obj.game() );
			assert.equal( GAMEOBJECT_STATE_DEAD, obj.state() );
		} );
		
		
		it( "die : when dead -> no", function(){
			obj.bear( game );
			obj.die();
			obj.die();
			
			assert.equal( "onBear()onDie()", obj.fakeLog );
			assert.equal( game, obj.game() );
			assert.equal( GAMEOBJECT_STATE_DEAD, obj.state() );
		});
		
		
		it( "die : when just created -> no", function(){
			obj.die();
			
			assert.equal( "", obj.fakeLog );
			assert.notEqual( game, obj.game() );
			assert.equal( GAMEOBJECT_STATE_JUST_CREATED, obj.state() );
		} );
	} );
	
	
	describe("Go To", function(){
		let game = null;
		let obj = null;
		
		beforeEach(function(){
			game = new FakeGame();
			game.fakeLevel = new GameLevel( game );
			obj = new FakeGameObject("obj", new Point(0,0), new Point(0,0));
			game.level().bearObject( obj );
		});
		
		
		afterEach(function(){
			obj = null; game = null;
		});
		
		
		it("go to : ok props -> start st. than rot.st.", function(){			
			obj.goTo( new Point(4,7), GameObjectGoToProperties.byDefault() );
			
			//assert.equal( GAMEOBJECT_GOTOSTATE_START, obj.goToState() );
			assert.isTrue( obj.targetPoint().matches(new Point(4,7),0) );
			assert.equal( GAMEOBJECT_GOTOFLAGS_NONE, obj.goToFlags() );
			
			obj.update( game );
			
			assert.equal( GAMEOBJECT_GOTOSTATE_ROTATING, obj.goToState() );
		});
		
		
		it("go to : ok props & waiting upd-s to mid. of rot. -> rot.st.", function(){			
			obj.setPosition( new Point(5,6) );
			obj.setRotationRad( Math.PI*(0.5+0.25) );
			obj.goTo( new Point(5+1,6+1), new GameObjectGoToProperties(8, Math.PI)  );
			obj.update( game );
						
			game.time().waitMsec( 200 );
			game.time().passIteration();
			obj.update( game );
			game.time().waitMsec( 50 );
			game.time().passIteration();
			obj.update( game );
			
			assert.equal( GAMEOBJECT_GOTOSTATE_ROTATING, obj.goToState() );
			assert.closeTo( Math.PI*(0.5), obj.rotationRad(), 0.01 );
			assert.isTrue( obj.position().matches( new Point(5,6), 0 ) );
		});
		
		
		it("go to : ok props & waiting upd-s to end of rot. -> go.st.", function(){
			obj.setPosition( new Point(7,8) );
			obj.setRotationRad( Math.PI*(0.5+0.25) );
			obj.goTo( new Point(7+4,8+4), new GameObjectGoToProperties(8, Math.PI) );
			obj.update( game );
			
			game.time().waitMsec( 150 );
			game.time().passIteration();
			obj.update( game );
			
			game.time().waitMsec( 90 );
			game.time().passIteration();
			obj.update( game );
			
			game.time().waitMsec( 260 );
			game.time().passIteration();
			obj.update( game );
			
			assert.equal( GAMEOBJECT_GOTOSTATE_GOING, obj.goToState() );
			assert.closeTo( Math.PI*(0.25), obj.rotationRad(), PRECISION );
			assert.isTrue( obj.position().matches(new Point(7,8),0) );
		});
		
		
		it("go to : ok props & waiting upd-s to mid from target -> go.st.", function(){
			obj.setPosition( new Point(8,4) );
			obj.setRotationRad( Math.PI*(-0.25) );
			obj.goTo( new Point(8+2, 4+2), new GameObjectGoToProperties(2,Math.PI) );
			obj.update( game );
			
			game.time().waitMsec( 500 );
			game.time().passIteration();
			obj.update( game );
			
			assert.closeTo( 8, obj.position().x(), 0.0 );
			assert.closeTo( 4, obj.position().y(), 0.0 );
			
			game.time().waitMsec( 250 );
			game.time().passIteration();
			obj.update( game );
			
			const DELTA = Math.cos(Math.PI/4.0)*0.5;
			assert.equal( GAMEOBJECT_GOTOSTATE_GOING, obj.goToState() );
			assert.closeTo( 8+DELTA, obj.position().x(), RAD_PRECISION );
			assert.closeTo( 4+DELTA, obj.position().y(), RAD_PRECISION );
		});
		
		
		it("go to : ok props & waiting upd-s to close to target -> on target & none st.", function(){
			obj.setPosition( new Point(5,7) );
			obj.setRotationRad( Math.PI*0.5 );
			obj.goTo( new Point(5-1, 7+1), new GameObjectGoToProperties(2, Math.PI*0.25) );
			obj.update( game );
			
			game.time().waitMsec( 1200 );
			game.time().passIteration();
			obj.update( game );
			
			game.time().waitMsec(250/Math.cos(Math.PI/4));
			game.time().passIteration();
			obj.update( game );
			
			game.time().waitMsec(300/Math.cos(Math.PI/4));
			game.time().passIteration();
			obj.update( game );
			
			assert.isTrue( obj.position().matches( new Point(4,8), 0 ), obj.position() );
			assert.closeTo( Math.PI*(0.5+0.25), obj.rotationRad(), 0 );
			assert.equal( GAMEOBJECT_GOTOSTATE_NONE, obj.goToState(),  "st." );
		});
		
		
		
		it("rotate to : ok props & upds to end of rot. -> on target rot & none st.", function(){
			obj.setPosition( new Point(8,9) );
			obj.setRotationRad( Math.PI*0.25 );
			
			obj.rotateTo( new Point(8,10), new GameObjectGoToProperties(1, Math.PI*0.25) );
			obj.update( game );
			assert.equal( GAMEOBJECT_GOTOFLAGS_ROTATEONLY, obj.goToFlags(),  "fl. start" );
			
			game.time().waitMsec( 1100 );
			game.time().passIteration();
			obj.update( game );
			
			assert.equal( GAMEOBJECT_GOTOSTATE_NONE, obj.goToState(),   "st." );
			assert.equal( GAMEOBJECT_GOTOFLAGS_NONE, obj.goToFlags(),   "fl. ended" );
			assert.closeTo( Math.PI*0.5, obj.rotationRad(),  PRECISION, "rot." );
			assert.isTrue( obj.position().matches( new Point(8,9), 0 ),    obj.position() );
		});
		
		
		
		it("go to -> events", function(){
			obj.fakeLog = "";
			
			obj.goTo(  new Point(0,4), new GameObjectGoToProperties(8, Math.PI*0.5) );
			assert.equal( "onGoTo()", obj.fakeLog );
			assert.closeTo( 8, obj.fakeLastGoToProperties.velocity, 0 );
			assert.closeTo( Math.PI*0.5, obj.fakeLastGoToProperties.rotatingVelocityRad, 0 );
			
			obj.update( game );
			assert.equal( "onGoTo()onGoingTo()onUpdate()", obj.fakeLog );
			
			game.time().waitMsec( 1100 );
			game.time().passIteration();
			obj.fakeLog = "";
			obj.update( game );
			assert.equal( "onGoingTo()onUpdate()", obj.fakeLog );
			
			game.time().waitMsec( 200 );
			game.time().passIteration();
			obj.fakeLog = "";
			obj.update( game );
			assert.equal( "onGoingTo()onUpdate()", obj.fakeLog );
			
			game.time().waitMsec( 330 );
			game.time().passIteration();
			obj.fakeLog = "";
			obj.update( game );
			assert.include( obj.fakeLog, "onStopGoTo(false)" );
		});
	});
	
	
	describe("Go Over Obstacles To", function() {
		let game;
		let level;
		let obj;
		let pathFinder;
		let maze;
		
		
		beforeEach(function(){
			game = new FakeGame();
			
			game.fakeLevel = new GameLevel( game );
			level = game.fakeLevel;
			
			maze = new Maze( 10,9 );
			game.level().bearObject( maze );
			
			pathFinder = new FakeMazePathFinder( maze );
			game.level().bearObject( pathFinder );
			
			obj = new FakeGameObject("test", new Point(0,0), new Point(1,1) );
			game.level().bearObject( obj );
		});
		
		
		afterEach(function(){
			maze = null;
			obj = null;
			pathFinder = null;
			
			level = null;
			game = null;
		});
		
		
		it("go over obstacles :  have path -> starts go to first center point", function(){
			
			pathFinder.fakeNextFindPath = MazePath.createFound([
				new Point(5,6),
				new Point(5,7)
			]);
			game.fakeConfig.cellWidth = 80;
			game.fakeConfig.cellHeight = 70;
			
			obj.setPosition( new Point( (4)*80 + 80/2, (5)*70 + 70/2 ) );
			obj.goOverObstaclesTo( new Point( (5)*80 + 80/2, (8)*70 + 70/2 ) );
			level.updateObjects();
			
			assert.equal( GAMEOBJECT_GOTOSTATE_ROTATING, obj.goToState(),  "state" );
			assert.closeTo( (5)*80 + 80/2, obj.targetPoint().x(), PRECISION,   "tp x" );
			assert.closeTo( (6)*70 + 70/2, obj.targetPoint().y(), PRECISION,   "tp y" );
			assert.isOk( (obj.goToFlags() & GAMEOBJECT_GOTOFLAGS_OVEROBSTACLES), 
				"flags"+obj.goToFlags() );
			
			assert.equal( 2, obj.targetPoints().length );
			assert.isTrue( obj.targetPoints()[0].matches( new Point(5*80 + 80/2, 6*70 + 70/2) ), 
				"tp 0" );
			assert.isTrue( obj.targetPoints()[1].matches( new Point(5*80 + 80/2, 7*70 + 70/2) ),  
				"tp 1" );
		} );
		
		
		it("go over obstacles : have path & waited -> moves next each p.", function(){
			game.fakeConfig.cellWidth = 90;
			game.fakeConfig.cellHeight = 45;
			obj.setPosition( new Point(90 * 9 + 90/2, 45 * 2 + 45/2) );
			
			pathFinder.fakeNextFindPath = MazePath.createFound( [
				new Point(9, 3),
				new Point(7, 3)
			] );
			
			let moveProperties = new GameObjectGoToProperties( 90, Math.PI*0.5 );
			
			obj.goOverObstaclesTo( new Point(90 * 7 + 90/2, 45 * 3 + 45/2), moveProperties );
			level.updateObjects();
			
			// 9:2 -> 9:3
			game.time().waitMsec( 1005 );
			game.time().passIteration();
			level.updateObjects();
			
			assert.closeTo( Math.PI*0.5, obj.rotationRad(), RAD_PRECISION,   "#1-r rad" );
			assert.isTrue( obj.position().matches( new Point(9 * 90 + 90/2, 2 * 45 + 45/2) ),  
				"#1-r pos" );
			assert.equal( GAMEOBJECT_GOTOSTATE_GOING,  obj.goToState(),   "#1-r st" );
			
			game.time().waitMsec( 504 );
			game.time().passIteration();
			level.updateObjects();
			
			assert.closeTo( Math.PI*0.5, obj.rotationRad(), RAD_PRECISION,  "#1-go rad" );
			assert.isTrue( obj.position().matches( new Point(9 * 90 + 90/2, 3 * 45 + 45/2) ),  
				"#1-go pos" );
			assert.equal( GAMEOBJECT_GOTOSTATE_ROTATING, obj.goToState(),  "#1-go state" );
			
			// 9:3 -> 7:3
			//level.updateObjects();
			game.time().waitMsec( 1008 );
			game.time().passIteration();
			level.updateObjects();
			
			assert.closeTo( Math.PI, obj.rotationRad(), RAD_PRECISION,  "2-r rad" );
			assert.closeTo( 9 * 90 + 90/2, obj.position().x(), PRECISION, "2-r pos x" );
			assert.closeTo( 3 * 45 + 45/2, obj.position().y(), PRECISION, "2-r pos y" );
			assert.equal( GAMEOBJECT_GOTOSTATE_GOING, obj.goToState(), "2-r st" );
			
			game.time().waitMsec( 2005 );
			game.time().passIteration();
			level.updateObjects();
			
			assert.closeTo( Math.PI, obj.rotationRad(), RAD_PRECISION,  "2-go rad" );
			assert.closeTo( 7 * 90 + 90/2, obj.position().x(), PRECISION,   "2-go x" );
			assert.closeTo( 3 * 45 + 45/2, obj.position().y(), PRECISION,  "2-go y" );
			assert.equal( GAMEOBJECT_GOTOSTATE_NONE,  obj.goToState(),  "2-go st" );
		} );
		
		
		it("go over obstacles : when going & have path -> starts new go", function(){
			game.config().cellWidth = 1;
			game.config().cellHeight = 1;
			obj.setPosition( new Point(4 + 0.5, 3 + 0.5) );
			let properties = new GameObjectGoToProperties( 2, Math.PI*0.5 );
			
			pathFinder.fakeNextFindPath = MazePath.createFound([
				new Point(5, 3),
				new Point(5, 2)
			]);
			obj.goOverObstaclesTo( new Point(5 + 0.5, 2 + 0.5), properties );
			level.updateObjects();
			
			pathFinder.fakeNextFindPath = MazePath.createFound([
				new Point(2, 3),
				new Point(2, 4)
			]);
			obj.goOverObstaclesTo( new Point(2 + 0.5, 4 + 0.5), properties );
			level.updateObjects();
			
			let points = obj.targetPoints();
			assert.equal( GAMEOBJECT_GOTOSTATE_ROTATING, obj.goToState() );
			assert.equal( 2, obj.targetPoints().length );
			assert.isTrue( points[0].matches( new Point(2 + 0.5, 3 + 0.5) ),   "tp#0 "+ points[0] );
			assert.isTrue( points[1].matches( new Point(2 + 0.5, 4 + 0.5) ) );
		});
		
		
		it("go over obstacles : path not found -> cancels go", function(){
			game.config().cellWidth = 1;
			game.config().cellHeight = 1;
			pathFinder.fakeNextFindPath = MazePath.createNotFound();
			
			obj.setPosition( new Point(3,2) );
			
			obj.fakeLog = "";
			obj.goOverObstaclesTo( new Point(4,2), new GameObjectGoToProperties(2, 0.5*Math.PI) );
			level.updateObjects();
			
			assert.equal( GAMEOBJECT_GOTOSTATE_NONE, obj.goToState() );
			assert.isTrue( obj.fakeLog.includes("onStopGoTo(true)"),  obj.fakeLog );
		});
		
		
		
	} );
	
	
});


