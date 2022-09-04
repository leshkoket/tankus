

"use strict"


class GameLevel extends GameLevelInterface {
	constructor( game ){
		super();
		if( !game ) throw new Error("Expected Game Object");
		this._game = game;
		this._objects = new Array();
		this._specialObjects = new Array( GAMEOBJECT_SPECIALS_COUNT );
	}
	
	
	bearNewObject( params ){
		if( !params ) {
			throw new Error( "Can't bear new object without params!" );
		}
		
		let obj = this._game.resources().loadResource( "Object", params.kind );
		this._bearObject( obj );
		obj.setPosition( new Point(params.x, params.y) );
		obj.readMetaData( params.metaData );
		
		return obj;
	}
	
	
	bearObject( obj ){
		this._bearObject( obj, "" );
	}
	
	
	enumObjects(){
		return this._objects.filter( function(item,i, arr){
			return !(item.state() == GAMEOBJECT_STATE_DEAD);
		});
	}
	
	
	updateObjects(){
		for( let obj of this._objects ){
			if( obj.state() == GAMEOBJECT_STATE_DEAD ) continue;
			obj.update( this._game );
		}
		this._objects = this.enumObjects();
		
		for( let i = 0; i < this._specialObjects.length; i++ ){
			this._specialObjects[i] = null;
		}
		for( let obj of this._objects ){
			this._setSpecialObject( obj );
		}
	}
	
	
	specialObject( index ){
		return this._specialObjects[ index ];
	}
	
	
	load(){
		this.bearNewObject( new GameObjectCreationParams("land", -100,-500) );
		
		let maze = this.bearNewObject( new GameObjectCreationParams("maze", 0,0) );
		
		let mazePathFinder = new MazePathFinder( maze );
		this.bearObject( mazePathFinder );
		
		let playerCell = maze.namedCell("character");
		if( playerCell ){
			let playerPoint = maze.cellPointByIndexes( playerCell );
			this.bearNewObject( new GameObjectCreationParams("playerTank",
				playerPoint.x() + maze.cellSize().x()/2,
				playerPoint.y() + maze.cellSize().y()/2) );
		}
	}
	
	
//#private:
	_bearObject( obj,kind ){
		if( !(obj instanceof GameObject) ){
			throw new Error( `Can't bear object ${kind}` );
		}
		if( (obj.state() == GAMEOBJECT_STATE_JUST_CREATED) ){
			obj.bear( this._game );
			this._objects.push( obj );
			this._setSpecialObject( obj );
		}
	}
	
	
	_setSpecialObject( obj ){
		if( obj && obj.specialIndex() >= 0 && obj.specialIndex() < GAMEOBJECT_SPECIALS_COUNT ){
			this._specialObjects[ obj.specialIndex() ] = obj;
		}
	}
}