

"use strict"


class FakeGameResources extends GameResourcesInterface {
	constructor( ){
		super( );
		this.fakeLog = "";
		this.fakeNextResource = null;
	}
	
	
	loadResource( type, id ){
		this.fakeLog += `loadResource(${type} ${id})`;
		return this.fakeNextResource;
	}
}



//=== Fake Game Level ====
class FakeGameLevel extends GameLevelInterface {
	constructor(){
		super();
		this.fakeLog = "";
		this.fakeLastCreationParams = null;
		this.fakeNextObject = null;
	}
	
	
	bearNewObject( params ){
		this.fakeLog += `bearNewObject(${params.kind})`;
		this.fakeLastCreationParams = params;
		return this.fakeNextObject;
	}
	
	
	bearObject( obj ){
		this.fakeLog += `bearObject(${obj==null?"<NULL>":obj.kind()})`;
		this.fakeLastCreationParams = null;
	}
	
	
	specialObject( index ){
		return this.fakeSpecialObjects[ index ];
	}
	
	
	
	load(){
		this.fakeLog += `load()`;
	}
}
//=== End Fake Game Level ===


//==== Fake Camera ====
class FakeCamera extends CameraInterface {
	constructor(){
		super();
		this.fakeLog = "";
	}
	
	screenWidth(){ return 9; }
	screenHeight(){ return 16; }
	worldX(x){ return x; }
	worldY(y){ return y; }
	displayX( x ){ return x; }
	displayY( y ){ return y; }
	
	moveToWorldXY( x,y ){
		this.fakeLog += `moveToWorldXY(${x} ${y})`;
	}
	
}
//==== End Fake Camera ====



//==== Fake Game ====
class FakeGame extends GameInterface {
	
	
	constructor( debugMode ){
		super( debugMode );
		this.fakeResources = new FakeGameResources();
		this.fakeLevel = new FakeGameLevel();
		this.fakeCamera = new FakeCamera();
		this.fakeConfig = new GameConfig();
		this.fakeSystemTime = new FakeSystemTime();
		this._time = new GameTime( this.fakeSystemTime );
	}
	
	
	graphics(){
		return this.graphicsNode().getContext("2d");
	}
	
	graphicsNode(){
		return document.getElementById( "testGraphics" );
	}
	
	
	config(){
		return this.fakeConfig;
	}
	
	resources(){
		return this.fakeResources;
	}
	
	level(){
		return this.fakeLevel;
	}
	
	camera(){
		return this.fakeCamera;
	}
	
	time(){
		return this._time;
	}
}
//==== End Fake Game ===