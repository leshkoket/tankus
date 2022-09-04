

"use strict"


class MazePathFinder extends GameObject {
	
	constructor( maze ){
		super( "mazePathFinder", new Point(0,0),  new Point(0,0) );
		if( !maze ) throw new Error("Maze for Maze Path Finder doesn't exist!");
		
		this._maze = maze;
		
		this._mapMaze = null;
		this._futureWaveCenters = [];
		this._currentWaveCenters = [];
		this._endPointFound = false;
		
		this._result = null;
		this._startCI = null;
		this._endCI = null;
	}
	
	
	mapMaze(){
		if( !this._mapMaze ){ this._updateMapMaze(); }
		return this._mapMaze;
	}
	
	
	maze(){
		return this._maze;
	}
	
	
	find( startCellIndex, endCellIndex ){
		this._startCI = startCellIndex;
		this._endCI = endCellIndex;
		
		if( this._canFind() ) {
			return this._find();
		}
		return MazePath.createNotFound();
	}
	

	specialIndex(){
		return GAMEOBJECT_SPECIALINDEX_MAZEPATHFINDER;
	}
	
	
	
//#protected:
	onUpdate(){
	}
	
	
//#private:
	_updateMapMaze(){
		this._mapMaze = new Maze( this._maze.cellsCountX(), this._maze.cellsCountY() );
	}
	
	
	_canFind(){
		return (this._maze.isFreeCell(this._startCI.x(), this._startCI.y()))
			  && (this._maze.isFreeCell(this._endCI.x(), this._endCI.y()));
	}
	
	
	_areDirectNeighborCells( first, second ){
		if( first.x() == second.x() )  return Math.abs(first.y() - second.y())==1;
		if( first.y() == second.y() )  return Math.abs(first.x() - second.x())==1;
		return false;
	}
	
	
	_find(){
			if( this._startCI.matches( this._endCI, 0 ) ){
				this._result = new MazePath( [Point.fromPoint(this._startCI)] );
			}
			else if( this._areDirectNeighborCells(this._startCI, this._endCI) ){
				this._result = new MazePath( [this._startCI, this._endCI] );
			}
			else {
				this._hardFind();
			}
		return this._result;
	}
	
	
	
	_hardFind(){
		this._initHardFind();
		
		while( this._futureWaveCenters.length > 0 && !this._endPointFound ){
			this._swapWaveCentersLists();
			for( let i = 0; i < this._currentWaveCenters.length; i++ ){
				if( !this._makeWave( this._currentWaveCenters[i].x(), this._currentWaveCenters[i].y() ) ) break;
			}
			this._currentWaveCenters.splice( 0, this._currentWaveCenters.length );
		}
		//console.log( "MM=\n"+ this._mapMaze.toString() );
		//console.log( "EP="+this._endPointFound+" "+this._mapMaze.cell(this._endCI.x(), this._endCI.y()) );
		this._restorePath();
		//console.log( "RES="+this._result.steps() );
	}
	
	
	_initHardFind(){
		this._result = new MazePath([]);
		
		this._currentWaveCenters = [];
		this._futureWaveCenters = [];
		this._endPointFound = false;
		
		this.mapMaze();
		this._mapMaze.fill(0);
		
		this._mapMaze.setCell( this._startCI.x(), this._startCI.y(), 1 );
		this._makeWave( this._startCI.x(), this._startCI.y() );
	}
	
	
	_swapWaveCentersLists(){
		let oldFutureWaveCenters = this._futureWaveCenters;
		this._futureWaveCenters = this._currentWaveCenters;
		this._currentWaveCenters = oldFutureWaveCenters;
	}
	
	
	_makeWave( x, y ){
		let value = this._mapMaze.cell( x,y );
		let nextValue = value+1;
		
		return (
		this._makeWavePoint( x-1, y, nextValue ) &&
		this._makeWavePoint( x+1, y, nextValue ) &&
		this._makeWavePoint( x, y-1, nextValue ) &&
		this._makeWavePoint( x, y+1, nextValue ) );
	}
	
	
	_makeWavePoint( x,y, value ){
		if( this._maze.isFreeCell(x,y) && this._mapCellIsFree(x,y) ){
			this._mapMaze.setCell(x,y, value);
			if( x == this._endCI.x() && y == this._endCI.y() ) {
				this._endPointFound = true;
			}
			else {
				this._futureWaveCenters.push( new Point(x,y) );
			}
		}
		return !this._endPointFound;
	}
	
	
	_mapCellIsFree( x,y ){
		return this._mapMaze.cell(x,y) <= 0;
	}
	
	
	_restorePath(){
		if( !this._endPointFound ) return;
		
		let pointsCount = Math.abs( this._mapMaze.cell(this._endCI.x(), this._endCI.y()) );
		let currentPoint = Point.fromPoint( this._endCI );
		
		for( let i = 0; i < pointsCount; ++i ){
			this._addNextPathPoint( currentPoint );
		}
		this._result.invertSteps();
	}
	
	
	_addNextPathPoint( point ){
		let value = this._mapMaze.cell( point.x(), point.y() );
		let nextValue = value-1;
		
		this._result.steps().push( Point.fromPoint(point) );
		
		if( this._setPathPoint( point, -1, 0, nextValue ) ) return true;
		if( this._setPathPoint( point, +1, 0, nextValue ) ) return true;
		if( this._setPathPoint( point, 0, -1, nextValue ) ) return true;
		if( this._setPathPoint( point, 0, +1, nextValue ) ) return true;
		return false;
	}
	
	
	_setPathPoint( point, dX, dY, value ){
		if( this._mapMaze.cell(point.x()+dX, point.y()+dY) == value ){
			point.setX( point.x()+dX );
			point.setY( point.y()+dY );
			return true;
		}
		return false;
	}
	
}