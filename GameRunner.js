

"use strict";

let assert;
class GameRunner{
	static _scriptsLoaded = [0,0,0];
	
	
	static run( isDebug ) {
		//console.clear();
		let allScriptsSources = [
			//"Scripts/ThirdParty/mocha.js", "Scripts/ThirdParty/chai.js", 
			
			"Scripts/GINTF/GameTime.js", 
			"Scripts/GINTF/GameResourcesInterface.js",
			"Scripts/GINTF/GameLevelInterface.js",
			"Scripts/GINTF/CameraInterface.js",
			"Scripts/GINTF/GameInterface.js",
			
			"Scripts/GEOM/Geom.js",
			"Scripts/GEOM/Shape.js",
			"Scripts/GEOM/Point.js",
			
			"Scripts/GFX/DrawingCommand.js",
			"Scripts/GFX/ImageDrawingCommand.js",
			
			"Scripts/GOBJ/Base/GameObject.js",
			"Scripts/GOBJ/Base/GameObjectComponent.js",
			"Scripts/GOBJ/Base/GameObjectGoToComponent.js",
			"Scripts/GOBJ/Land.js",
			"Scripts/GOBJ/Character.js",
			"Scripts/GOBJ/PlayerCharacter.js",
			"Scripts/GOBJ/MazePath.js",
			"Scripts/GOBJ/Maze.js",
			"Scripts/GOBJ/MazeGenerator.js",
			"Scripts/GOBJ/MazePathFinder.js",
			
			"Scripts/GCTRL/GameController.js",
			"Scripts/GCTRL/GameLevel.js",
			"Scripts/GCTRL/Camera.js",
			
			"Scripts/GRESLD/GameResourcesLoader.js",
			"Scripts/GRESLD/ImagesStorage.js"
		];
		let allDebugScriptsSources = [
			"Scripts/_TST/_FakeGame.js",
			"Scripts/_TST/_TestsOfFakeGame.js",
			"Scripts/_TST/_FakeGameObject.js",
			"Scripts/_TST/_FakeComponent.js",
			"Scripts/_TST/_FakeMazeGenerator.js",
			"Scripts/_TST/_FakeMazePathFinder.js",
			
			"Scripts/_TST/_T.GINTF/_TestsOfGameTime.js",
			
			"Scripts/_TST/_T.GEOM/_TestsOfPoint.js",
			"Scripts/_TST/_T.GEOM/_TestsOfGeom.js",
			
			"Scripts/_TST/_T.GFX/_TestsOfDrawingCommand.js",
			
			"Scripts/_TST/_T.GOBJ/_TestsOfGameObject.js",
			"Scripts/_TST/_T.GOBJ/_TestsOfGOComponent.js",
			"Scripts/_TST/_T.GOBJ/_TestsOfMaze.js",
			"Scripts/_TST/_T.GOBJ/_TestsOfMazeGenerator.js",
			"Scripts/_TST/_T.GOBJ/_TestsOfMazePath.js",
			"Scripts/_TST/_T.GOBJ/_TestsOfMazePathFinder.js",
			"Scripts/_TST/_T.GOBJ/_TestsOfPlayerCharacter.js",
			
			"Scripts/_TST/_T.GCTRL/_TestsOfFakeGame.js",
			"Scripts/_TST/_T.GCTRL/_TestsOfGameLevel.js",
			"Scripts/_TST/_T.GCTRL/_TestsOfGameController.js",
			"Scripts/_TST/_T.GCTRL/_TestsOfCamera.js"
		];
		
		new Promise( (ok,fail)=>{ 
			GameRunner._startTests(); ok();  
		} )
		.then( ()=>{ 
			return GameRunner._loadScripts( "body", 0, allScriptsSources ,0 );
	 	} )
		.then( ()=>{ 
			//while(GameRunner._scriptsLoaded[0] < allScriptsSources){}
			return GameRunner._loadScripts( "body", 1, allDebugScriptsSources,0 );
		} )
		.then( ()=>{
			//while(GameRunner._scriptsLoaded[1] < allDebugScriptsSources.length){}
			GameRunner._runTests();
			GameRunner._runGame( isDebug );
		} );
	}
	
	
	
//#private:
	static _startTests() {
		assert = chai.assert;
		mocha.setup("bdd");
	}
	
	
	static _runTests() {
		window.addEventListener( "load", function(){
			mocha.run(function(failures){
					console.log( window.document.getElementById("mocha-stats").innerText );
					console.log( "\n" );
				if( failures ){
					document.getElementById( "mocha" ).hidden = false;
					document.getElementById( "graphics" ).hidden = true;
					throw new Error(failures);
				}
			});
		} );
	}
	
	
	static _loadScripts( node, counterId, sources, i ){
		let promise = new Promise( function(ok,fail){
			GameRunner._loadScript( ok, fail, node, counterId, sources, i );
		} );
		promise.catch( function(error){ throw ""+error; } );
		return promise;
	}
	
	
	static _loadScript( ok,fail, node, counterId, sources, i ){
		let script = document.createElement("script");
		script.async=false;
		script.src = sources[i];
				
		script.onload = function(){
			console.log("loaded "+sources[i]+" "+ i+"/"+sources.length+ ":"+ 
				GameRunner._scriptsLoaded[counterId]);
			GameRunner._scriptsLoaded[counterId]++;
			if( i <= sources.length-2 ){
				GameRunner._loadScript( ok,fail, node,counterId, sources,i+1 );
			}
			else {
				ok("Script loaded");
			}
		}
		script.onerror = function(){ 
			fail("Script loading error!!!");
		}
		document[node].appendChild( script );
	}
	
	
	static _runGame( debug ){
		//document.getElementById("debugPanel").hidden = !debug;
		window.addEventListener( "load", function(){
			var game = new GameController( debug );
			game.clearSaid();
			game.run();
		} );
	}

}
