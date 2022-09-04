

"use strict"


class FakeMazePathFinder extends MazePathFinder {
	
	constructor( maze ) {
		super( maze );
		this.fakeNextFindPath = MazePath.createNotFound();
	}
	
	
	find(){
		return this.fakeNextFindPath;
	}
	
	
}