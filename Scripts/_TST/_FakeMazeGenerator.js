

"use strict"


class FakeMazeGenerator extends MazeGenerator {
	constructor( data, maze ){
		super( data, maze );
		this.fakeLog = "";
		this.fakeRandomLog = "";
	}
	
	
	onRandom( start, ends ){
		this.fakeRandomLog += `(${start+""} ${ends+""})`;
	}
	
	
	onStart(){
		this.fakeLog += "onStart()";
	}
	
	
	onEnd(){
		this.fakeLog += "onEnd()";
	}
	
	
	onAddRoad( startPos, vector, level ){
		this.fakeLog += `onAddRoad(${startPos} ${vector} ${level})`;
	}
	
	
	afterAddRoadsLevel( level ){
		this.fakeLog += `afterAddRoadsLevel(${level})`;
	}
	
}