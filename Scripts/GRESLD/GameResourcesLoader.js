
"use strict"

//===== Game Resources Loader ======
class GameResourcesLoader extends GameResourcesInterface {
	constructor( game ){
		super( game );
		this._game = game;
		this._images = new ImagesStorage();
	}
	
	
	loadResource( type, id ){
		if( type == "Object" ){
			switch( id ){
			case "land":
				return this._loadObjectLand();
				
			case "maze":
				return this._loadObjectMaze();
				
			case "playerTank":
				return this._loadObjectPlayerTank();
			default:
				return null;
			}
		}
		else if( type == "Game" ) {
			switch( id ){
			case "config":
				return this._loadConfig();
			default:
				return null;
			}
		}
		else if( type == "Image" ){
			return this._images.get( id );
		}
		else {
			return null;
		}
	}
	
	
//#private:
	_loadConfig() {
		var config = new GameConfig();
		config.cellWidth = 50;
		config.cellHeight = 40;
		config.tankWidth = 50;
		config.tankHeight = 40;
		return config;
	}
	
	
	_loadObjectLand() {
		var backgroundStyle = "rgb(10%30%10%)";
		var fillStyles = [
			"rgb(15%,40%,5%)", "rgb(5%,40%,15%)", "rgb(5%,50%,5%)",
			"rgb(15%,35%,5%)", "rgb(15%,50%,10%)", "rgb(0%,40%,0%)" ];
		var strokeStyles = [];//[ "rgb(0%,20%,6%)" ];
		var land = new Land( new Point(25,15), new Point(25,15), 
		backgroundStyle, fillStyles, strokeStyles);
		return land;
	}
	
	
	_loadObjectMaze(){
		let gd = new MazeGenerationData(100,100);
		gd.roadsLevelsCountStart = 3;
		gd.roadsLevelsCountEnd = 4;
		gd.roadLengthStart = 12;
		gd.roadLengthEnd = 16;
		gd.roadLengthDivision = 1.5;
		gd.roadsCountPerLevelStart = 8;
		gd.roadsCountPerLevelEnd = 12;
		gd.firstPointsCountStart = 4;
		gd.firstPointsCountEnd = 4;
		
		let g = new MazeGenerator( gd );
		return g.generate();
	}
	
	
	_loadObjectPlayerTank(){
		var obj = new PlayerCharacter( "playerTank", 
			new Point(0,0), 
			new Point(this._game.config().tankWidth, this._game.config().tankHeight),
			new TankCharacterDrawer() );
		obj.setColorIndex( CHARACTER_COLORINDEX_YELLOW );
		return obj;
	}

}
//==== End Game Resources Loader =====
