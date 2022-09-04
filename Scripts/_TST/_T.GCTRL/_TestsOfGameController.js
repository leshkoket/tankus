
"use strict"

describe( "Game Controller Tests", function(){
	it( "create", function(){
		let controller = new GameController();
		
		let res = (controller.resources());
		let level = (controller.level());
		let camera = controller.camera();
		
		let gfx = controller.graphics();
		let gfxNode = controller.graphicsNode();
		
		assert.isTrue( res instanceof GameResourcesLoader, `${typeof(res)}` );
		assert.isTrue( level instanceof GameLevel, `${typeof(level)}` );
		assert.isNotNull( gfx, "gfx" );
		assert.isNotNull( gfxNode, "gfx-node" );
		assert.isTrue( camera instanceof Camera );
		assert.equal( gfxNode.width, camera.screenWidth(), 
			"cw "+gfxNode.width );
		assert.equal( gfxNode.height, camera.screenHeight(),
			"ch "+gfxNode.height );
	} );
} );