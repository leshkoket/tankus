

"use strict"


//==== MAZE GENERATION DATA ===
class MazeGenerationData{
	constructor( cellsX, cellsY ){
		this.roadLengthStart = 1;
		this.roadLengthEnd = 1;
		
		this.roadsLevelsCountStart = 1;
		this.roadsLevelsCountEnd = 1;
		
		this.roadsCountPerLevelStart = 1;
		this.roadsCountPerLevelEnd = 1;
		
		this.firstPointsCountStart = 1;
		this.firstPointsCountEnd = 1;
		
		this.roadLengthDivision = 2;
		this.cellsCountX = ! cellsX ? 1 : cellsX;
		this.cellsCountY = ! cellsY ? 1 : cellsY;
		this.charactersCount = 1;
		this.charactersMinDistance = 1;
	}
}
//=== END MAZE GENERATION DATA ===



//====== MAZE GENERATOR =====
class MazeGenerator {
	constructor( data, maze ) {
		if( !(maze) ) maze = new Maze( data.cellsCountX, data.cellsCountY );
		
		this._data = data;
		this._maze = maze;
		
		this._roadVectorsAllowed = [ 
			new Point(1,0), new Point(-1,0),
			new Point(0,1), new Point(0,-1) ];
		this._lastRoadVector = new Point(0,0);
		this._lastRoadEndPos = new Point(0,0);
		this._lastRoadsEndPoses = [];
		
		this._firstPoints = [];
	}
	
//#public:
	data(){ return this._data; }
	maze(){ return this._maze; }
	
	
	generate(){
		this.start();
		this.addAllRoads();
		this.end();
		return this._maze;
	}
	
	
	
//#test public:
	setMaze( maze ){ this._maze = maze; }
	
	roadVectorsAllowed(){ return this._roadVectorsAllowed; }
	
	setRoadVectorsAllowed( value ){ this._roadVectorsAllowed = value; }
	
	firstPoints(){ return this._firstPoints; }
	
	setFirstPoints( value ){ this._firstPoints = value; }
	
	
	randomInt( start,end ){
		this.onRandom( start, end );
		let min = Math.min( start, end );
		let max = Math.max( start, end );
		let result = Math.round( Math.random()*(max-min) + min );
		if( result < min ) result = min;
		else if( result > max ) result = max;
		return result;
	}
	
	
	start(){
		for( let y = 0; y < this._maze.cellsCountY(); y ++ ){
			for( let x = 0; x < this._maze.cellsCountX(); x++ ){
				this._maze.setCell(x,y, 1);
			}
		}
		
		this._firstPoints = new Array( this.randomInt(
			this._data.firstPointsCountStart,
			this._data.firstPointsCountEnd) );
		let x = this.randomInt(0, this._maze.cellsCountX()-1);
		let y = this.randomInt(0,this._maze.cellsCountY()-1);
		for( let i = 0; i < this._firstPoints.length; ++i ){
			this._firstPoints[i] = new Point(
				x,
				y );
		}
		
		this.onStart();
	}
	
	
	end(){
		this._addPointsOfObjects();
		this.onEnd();
	}
	
	
	addRoad( startPos, vector, level ){
		vector = new Point( Math.sign(vector.x()), Math.sign(vector.y()) );
		if( (vector.x() != 0) == (vector.y() != 0) ) return false;
		level = Math.max( Number(!level?0:level), 1 );
		
		let length = this.randomInt( this._data.roadLengthStart, this._data.roadLengthEnd );
		if( length <= 0 ) return false;
		length /= Math.pow( this._data.roadLengthDivision, level-1 );
		
		let endX = startPos.x() + vector.x()*(length-1);
		let endY = startPos.y() + vector.y()*(length-1);
		
		for( let i = 0; i < length; i++ ){
			this._maze.setCell( startPos.x()+vector.x()*i, startPos.y()+vector.y()*i, 0 );
		}
		
		this._lastRoadVector = vector;
		this._lastRoadEndPos = new Point( endX, endY );
		this._lastRoadsEndPoses.push( new Point(endX, endY) );
		this.onAddRoad( startPos, vector, level );
		return true;
	}
	
	
	
	addAnyRoad( startPos, level ){
		let allowedVectors = [];
		for( let i = 0; i < this._roadVectorsAllowed.length; i++ ){
			let vectors = this._roadVectorsAllowed[ i ];
			if( this._canSelectRoadVectorAllowed( startPos, vectors ) ){
				allowedVectors.push( vectors );
			}
		}
		
		let vectorId = this.randomInt(0, allowedVectors.length-1);
		if( vectorId >= 0 && allowedVectors[ vectorId ] ) {
			let vector = allowedVectors[ vectorId ];
			return this.addRoad( startPos, vector, level );
		}
		else {
			return false;
		}
	}
	
	
	addRoadsLevel( level, startPoses ){
		if( level < 1 ) level = 1;
		
		this._lastRoadsEndPoses = new Array(0);
		
		for( let startPos of startPoses ){
			let count = this.randomInt( this._data.roadsCountPerLevelStart, this._data.roadsCountPerLevelEnd );
			this._lastRoadVector = new Point(0,0);
			this._lastRoadEndPos = null;
			
			for( let i = 0; i < count; i++ ){
				if( i == 0 ){
					if( !this.addAnyRoad( startPos, level ) ) break;
				}
				else {
					this.addAnyRoad( this._lastRoadEndPos, level );
				}
			}
			
		}
		this.afterAddRoadsLevel( level );
	}
	
	
	
	addAllRoads(){
		
		let levelsCount = this.randomInt( this._data.roadsLevelsCountStart, this._data.roadsLevelsCountEnd );
		for( let level = 1; level <= levelsCount; level ++ ) {
			if( level == 1 ){
				this.addRoadsLevel( level, this._firstPoints );
			}
			else {
				let firstPoints = [];
				for( let p of this._lastRoadsEndPoses ){ firstPoints.push(Point.fromPoint(p)); }
				//console.log( firstPoints+"$"+level );
				this.addRoadsLevel( level, firstPoints );
				//console.log( this._lastRoadsEndPoses+"$$"+level );
			}
		}
		
	}
	
	
	
//#protected:
	onRandom( start, end ){}
	
	onStart(){}
	onEnd(){}
	onAddRoad( pos, vector, level ){}
	afterAddRoadsLevel(level){}
	
	
//#private:
	_canSelectRoadVectorAllowed( startPos, vectors ){
		let antiVectors = new Point( -vectors.x(), -vectors.y() );
		if( !this._lastRoadVector.matches(new Point(0,0), 0.01) ){
			if(vectors.matches(this._lastRoadVector,0.01) ) return false;
			if(antiVectors.matches(this._lastRoadVector,0.01)) return false;
		}
		
		let target = new Point( startPos.x()+vectors.x(), startPos.y()+vectors.y() );
		if( !this._maze.isObstacleCell( target.x(), target.y() ) ) return false;
		
		return true;
	}
	
	
	_addPointsOfObjects(){
		let freeCells = [];
		for( let y = 0; y < this._maze.cellsCountY(); y++ ){
			for( let x = 0; x < this._maze.cellsCountX(); ++x ){
				if( !this._maze.isObstacleCell(x,y) ){
					freeCells.push( new Point(x,y) );
				}
			}
		}
		
		for( let i = 0; i < this._data.charactersCount; ++i ){
			let selectedFreeCells = [];
			let allExistingCellEntries = this._maze.enumNamedCellsEntries();
			
			for( let freeCell of freeCells ){
				let tooNear = false;
				for( let existingCellEntry of allExistingCellEntries ){
					if( this._namedCellEntryIsTooNear("character", existingCellEntry, freeCell)  ){
						tooNear = true;
						break;
					}
				}
				if( !tooNear ){
					selectedFreeCells.push( freeCell );
				}
			}
			
			if( selectedFreeCells.length > 0 ){
				let cellIndex = this.randomInt( 0, selectedFreeCells.length-1 );
				let cell = selectedFreeCells[cellIndex];
				this._maze.addNamedCell("character", cell );
			}
		}
	}
	
	
	_namedCellEntryIsTooNear( name, cellEntry, cell ){
		if( cellEntry[0] != name ) return false;
		if( Math.abs(cellEntry[1].x() - cell.x()) >= Math.abs(this._data.charactersMinDistance) ) return false;
		if( Math.abs(cellEntry[1].y() - cell.y()) >= Math.abs(this._data.charactersMinDistance) ) return false;
		return true;
	}
}
//=== END MAZE GENERATOR ====