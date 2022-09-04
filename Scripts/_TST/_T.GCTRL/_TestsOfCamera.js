
"use strict"


describe("Camera Tests", function(){
	let game = null;
	let camera = null;
	const PRECISION = 0.0001;
	
	
	beforeEach( function(){
		game = new FakeGame();
		game.fakeCamera = new Camera();
		camera = game.camera();
	});
	
	
	afterEach( function(){
		game = null;
		camera = null;
	});
	
	
	it("type", function(){
		assert.isTrue(camera instanceof Camera);
	});
	
	
	it("coords : after move", function(){
		camera.setScreenSizes( 200,800 );
		
		camera.moveToWorldXY( 50,60 );
		
		assert.closeTo( 50, camera.worldX(200/2), PRECISION );
		assert.closeTo( 60, camera.worldY(800/2), PRECISION );
		assert.closeTo( 200/2, camera.displayX(50), PRECISION );
		assert.closeTo( 800/2, camera.displayY(60), PRECISION );
	});
	

});