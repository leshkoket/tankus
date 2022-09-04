

"use strict"


class Maze extends GameObject {
	
	constructor( cellsCountX, cellsCountY ){
		super( "Maze", new Point(0,0), new Point(1,1) );
		if( cellsCountX < 1 ) cellsCountX = 1;
		if( cellsCountY < 1 ) cellsCountY = 1;
		
		this._cellsCountX = cellsCountX;
		this._cellsCountY = cellsCountY;
		this._rows = new Array( this._cellsCountY );
		for( let y = 0; y < this._cellsCountY; y++ ){
			this._rows[ y ] = new Int32Array( this._cellsCountX );
		}
		this._namedCells = [];
		
		this.setSize( new Point(this._cellsCountX, this._cellsCountY) );
		
		this.appendComponent( new MazeDrawer() );
	}
	
	
	static fromText( text, pathOut ){
		let countY = text.length;
		let countX = 0;
		for( let row of text ){
			countX = Math.max( row.length, countX );
		}
		
		const cpStart = "1".codePointAt(0);
		const cpPathStart = "a".codePointAt(0);
		const cpPathEnd = "z".codePointAt(0);
		
		let maze = new Maze( countX, countY );
		let stepsOut = pathOut ? new Array( cpPathEnd-cpPathStart+1 )  : null;
		
		for( let y = 0; y < text.length; y++ ){
			let row = text[y].toLowerCase();
			for( let x = 0; x < countX; x++ ){
				if( x < row.length ){
					let cp = row.codePointAt(x);
					if( pathOut && (cp >= cpPathStart && cp <= cpPathEnd) ){
						maze.setCell( x,y, 0 );
						stepsOut[ (cp - cpPathStart) ] = new Point(x,y);
					}
					else {
						maze.setCell( x,y, (cp-cpStart+1) );
					}
				}
				else {
					maze.setCell( x,y, 0 );
				}
			}
		}
		
		if( pathOut ){
			pathOut.setSteps( stepsOut );
		}
		return maze;
	}
	
	
	toText( path ) {
		const cpStart = "1".codePointAt(0);
		const cpEnd = "9".codePointAt(0);
		const cpPathStart = "a".codePointAt(0);
		const cpPathEnd = "z".codePointAt(0);
		let text = new Array( this.cellsCountY() );
		
		for( let y = 0; y < this.cellsCountY(); ++y ){
			text[y]="";
			for( let x = 0; x < this.cellsCountX(); x++ ){
				if( this.isObstacleCell(x,y) ){
					let cp = Math.min( cpEnd, this.cell(x,y)+cpStart-1 );
					text[y] += String.fromCodePoint(cp);
				}	
				else {
					if( path ){
						let stepIndex = path.indexOfStep( new Point(x,y) );
						if( stepIndex >= 0 ){
							let cp = Math.min( cpPathEnd, stepIndex+cpPathStart );
							text[y] += String.fromCodePoint( cp );
							continue;
						}
					}
					text[y] += "0";
				}
			}
		}
		return text;
	}
	
	
	toString(){
		let text = this.toText();
		let str = "";
		for( let mystr of text ){ str += mystr + "\n"; }
		return str;
	}
	
	
	static fromPathText( pathOut, text ){
		return Maze.fromText( text, pathOut );
	}
	
	
	toPathText( path ){
		return this.toText( path );
	}
	
	
	cellsCountX(){ return this._cellsCountX; }
	cellsCountY(){ return this._cellsCountY; }
	
	
	cell( x,y ){
		x = Math.round(x);
		y = Math.round(y);
		if( !this.cellExists(x,y) ) return 0;
		if( null==this._rows[y] ){
			alert( y+":"+this._cellsCountY );
		}
		return this._rows[ y ][ x ];
	}
	
	
	setCell(x,y, value){
		x = Math.round(x);
		y = Math.round(y);
		if( !this.cellExists(x,y) ) return;
		this._rows[ y ][ x ] = Number(value);
	}
	
	
	cellExists(x,y){
		x = Math.round(x);
		y = Math.round(y);
		return (x >= 0 && x < this._cellsCountX) &&
					 (y >= 0 && y < this._cellsCountY);
	}
	
	
	isObstacleCell(x,y){
		return this.cell(x,y) > 0;
	}
	
	
	isFreeCell(x,y){
		return this.cellExists(x,y) && this.cell(x,y) <= 0;
	}
	
	
	isFilledWith( value ){
		value = Number(value);
		for( let y = 0; y < this._cellsCountY; ++y ){
			for( let x = 0; x < this._cellsCountX; x++ ){
				if( this._rows[y][x] != value ) return false;
			}
		}
		return true;
	}
	
	
	fill( value ){
		value = Number(value);
		for( let y = 0; y < this._cellsCountY; y++ ){
			for( let x = 0; x < this._cellsCountX; ++x ){
				this._rows[y][x] = value;
			}
		}
	}
	
	
	equals( other ){
		if( other._cellsCountX != this._cellsCountX ) return false;
		if( other._cellsCountY != this._cellsCountY ) return false;
		for( let y = 0; y < this._cellsCountY; y++ ){
			for( let x = 0; x < this._cellsCountX; x++ ){
				if( this._rows[y][x] != other._rows[y][x] ) return false;
			}
		}
		return true;
	}
	
	
	hasNoIsolatedFreeCells(){
		let onces = 0;
		for( let y = 0; y < this._cellsCountY; y++ ){
			for( let x = 0; x < this._cellsCountX; x++ ){
				if( this.isObstacleCell(x,y) ) continue;
				let hasByDirect = 
					!this.isObstacleCell(x-1,y) || !this.isObstacleCell(x+1,y) ||
					!this.isObstacleCell(x,y-1) || !this.isObstacleCell(x,y+1);
				let hasByDiagonal =
					!this.isObstacleCell(x-1,y-1) || !this.isObstacleCell(x+1,y-1) ||
					!this.isObstacleCell(x-1,y+1) || !this.isObstacleCell(x+1,y+1);
				if( hasByDiagonal && !hasByDirect ) return false;
				if( !hasByDirect ) onces ++;
			}
		}
		return onces < 2;
	}
	
	
	specialIndex(){  return GAMEOBJECT_SPECIALINDEX_MAZE; }
	
	cellSize(){
		if( this.game() == null ) return new Point(1,1);
		return new Point( 
			this.game().config().cellWidth, 
			this.game().config().cellHeight );
	}
	
	
	cellPointByIndexes( indexes ){
		let size = this.cellSize();
		return new Point( size.x() * Math.floor(indexes.x()), size.y() * Math.floor(indexes.y()) );
	}
	
	// 
	
	cellIndexesByPoint( point, deltaIndexes ){
		let size = this.cellSize();
		let deltaX = (deltaIndexes ? deltaIndexes.x() : 0);
		let deltaY = (deltaIndexes ? deltaIndexes.y() : 0);
		return new Point( Math.floor(point.x() / size.x() + deltaX), Math.floor(point.y() / size.y() + deltaY) );
	}
	
	//
	addNamedCell( name, cell ){
		this._namedCells.push( [String(name), cell] );
	}
	
	namedCell( name ) {
		name = String(name);
		for( let pair of this._namedCells ){
			if( pair[0] == name ){
				return pair[1];
			}
		}
		return null;
	}
	
	filterNamedCells( name ){
		name = String(name);
		let all = [];
		for( let pair of this._namedCells ){
			if( pair[0] == name ) all.push( pair[1] );
		}
		return all;
	}
	
	namedCellsCount(){
		return this._namedCells.length;
	}
	
	removeNamedCellsByName( name ){
		name = String(name);
		for( let i = 0; i < this._namedCells.length; ++i ){
			if( this._namedCells[i][0] == name ){
				this._namedCells.splice( i,1 );
				i--;
			}
		}
	}
	
	removeNamedCell( cellPoint ){
		for( let i = 0; i < this._namedCells.length; ++i ){
			if( this._namedCells[i][1] == cellPoint ){
				this._namedCells.splice( i,1 );
				return;
			}
		}
	}
	
	enumNamedCellsEntries(){
		return this._namedCells.concat([]);
	}
	
	clearNamedCells(){
		this._namedCells = [];
	}
	
	





//#protected:
//
	onUpdate(){
		let cs = this.cellSize();
		this.setSize( new Point(cs.x()*this._cellsCountX, cs.y()*this._cellsCountY) );
	}
	
}

//============ End Maze ===========



//====== Maze Drawer ============
class MazeDrawer extends GameObjectComponent {
	constructor(){
		super();
	}
	
	
	onUpdate(){
		let maxX = this.linkedObject().cellsCountX();
		let maxY = this.linkedObject().cellsCountY();
		let cellSize = this.linkedObject().cellSize();
		
		let gfx = this.game().graphics();
		let gfxNode = this.game().graphicsNode();
		
		gfx.setTransform();
		for( let y = 0; y < maxY; y++ ){
			for( let x = 0;  x < maxX; x ++ ){
				if( !this._canDrawCellAtIndex(gfxNode, x,y,cellSize.x(),cellSize.y()) ) continue;
				this._drawCellAtIndex( gfx, x,y, cellSize.x(), cellSize.y() );
			}
		}
		gfx.setTransform();
	}
	
	
//#private:
	_canDrawCellAtIndex( gfxNode, x, y, drawW, drawH ){
		let drawX = this.game().camera().displayX( drawW*x );
		let drawY = this.game().camera().displayY( drawH*y );
		if( drawX+drawW < 0 || drawX > gfxNode.width ) return false;
		if( drawY+drawH < 0 || drawY > gfxNode.height ) return false;
		return true;
	}
	
	_drawCellAtIndex( gfx, x,y, drawW,drawH ){
		let drawX = this.game().camera().displayX(drawW*x);
		let drawY = this.game().camera().displayY(drawH*y);
		let cell = this.linkedObject().cell(x,y);
		
		if( cell <= 0 ){
			this._drawTheFreeCell( gfx, cell, drawX,drawY,drawW,drawH );
		}
		else {
			this._drawTheObstacleCell( gfx,cell, drawX,drawY,drawW,drawH );
		}
	}
	
	
	_drawTheFreeCell( gfx, cell, drawX,drawY, drawW,drawH ){
		const t=3;
		gfx.strokeStyle = "rgba(0%,0%,0%,20%)";
		gfx.lineWidth=t;
		gfx.strokeRect( drawX, drawY, drawW,drawH );
		/*gfx.fillStyle = "rgba(0%,0%,0%,10%)";
		for( let i = 0; i < 3; i++ ){
			let ww = i*t;
			let hh = i*t;
			gfx.fillRect( drawX+ww/2,drawY+hh/2, drawW-ww,drawH-hh );
		}*/
	}
	
	
	_drawTheObstacleCell( gfx, cell, drawX,drawY,drawW,drawH ){
		const t = 4;
		
		gfx.fillStyle="rgba(90%,80%,70%,100%)";
		gfx.fillRect( drawX,drawY,drawW,drawH );
		
		this._drawHShadow( gfx, "rgba(0%,0%,0%, 20%)", drawX,drawY,drawH, t );
		this._drawHShadow( gfx, "rgba(0%,0%,0%, 40%)", drawX+drawW,drawY,drawH, -t );
		this._drawVShadow( gfx, "rgba(0%,0%,0%, 10%)", drawX,drawY,drawW, t );
		this._drawVShadow( gfx, "rgba(0%,0%,0%, 60%)", drawX,drawY+drawH,drawW, -t );
	}
	
	
	_drawHShadow( gfx, style, drawX,drawY,drawH, drawT ){
		gfx.fillStyle=style;
		let drawTT = Math.abs(drawT);
		gfx.beginPath();
		gfx.moveTo( drawX,drawY );
		gfx.lineTo( drawX+drawT, drawY+drawTT );
		gfx.lineTo( drawX+drawT, drawY+drawH-drawTT );
		gfx.lineTo( drawX, drawY+drawH );
		gfx.closePath();
		gfx.fill();
	}
	
	
	_drawVShadow( gfx,style, drawX,drawY, drawW, drawT ){
		let drawTT = Math.abs( drawT );
		gfx.fillStyle=style;
		gfx.beginPath();
			gfx.moveTo( drawX,drawY );
			gfx.lineTo( drawX+drawW, drawY );
			gfx.lineTo( drawX+drawW-drawTT, drawY+drawT );
			gfx.lineTo( drawX+drawTT, drawY+drawT );
		gfx.closePath();
		gfx.fill();
	}
	
}
//===== End Maze Drawer =========