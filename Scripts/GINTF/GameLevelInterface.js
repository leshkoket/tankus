

"use strict"



const GAMEOBJECT_SPECIALINDEX_NONE = -1;

const GAMEOBJECT_SPECIALINDEX_MAZE = 0;
const GAMEOBJECT_SPECIALINDEX_PC = 1;
const GAMEOBJECT_SPECIALINDEX_MAZEPATHFINDER = 2;
const GAMEOBJECT_SPECIALINDEX_LAND = 3;

const GAMEOBJECT_SPECIALS_COUNT = 4;


class GameLevelInterface {

	bearNewObject( params ){ notImplementedFunction("GameLevel.bearNewObject"); return null; }
	
	bearObject( obj ){ notImplementedFunction("GameLevel.bearObject"); }
	
	
	enumObjects() { notImplementedFunction("GameLevel.enumObjects"); return null; }
	
	updateObjects(){ notImplementedFunction("GameLevel.updateObjects"); }
	
	specialObject( index ){ notImplementedFunction("GameLevel.specialObject"); return null; }
	
	
	load(){ notImplementedFunction("GameLevel.load"); }
	
}