

"use strict"

describe("Player Character Tests", function(){
	let game = null;
	
	beforeEach(function(){
		game = new FakeGame();
	});
	
	
	afterEach(function(){
		game = null;
	});
	
	
	function makePC(){
		return new PlayerCharacter( "pc", new Point(0,0), new Point(0,0), new NoCharacterDrawer() );
	}
	
	
	it("create", function(){
		let pc = makePC();
		
		assert.equal( GAMEOBJECT_SPECIALINDEX_PC, pc.specialIndex() );
	});
	
	
	
	
	
});