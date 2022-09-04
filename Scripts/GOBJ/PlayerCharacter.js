
"use strict"


//========= Player Character =======
class PlayerCharacter extends Character {
	constructor( kind, position, size,  drawer ) {
		super( kind, position,size, 
			drawer, [new ControlPCBehavior()] );
	}
	
	
	specialIndex(){  return GAMEOBJECT_SPECIALINDEX_PC;  }
}
//======= End Player Character =====



//===== ControlPCBehavior ======
class ControlPCBehavior extends GameObjectComponent {
	constructor(){
		super( "control" );
		this._targetPos = new Point(0,0);
		this._mouseEvent = null;
	}
	
	
	onUpdate(){
		let pc = this.linkedObject();
		this.game().camera().moveToWorldXY( pc.position().x(), pc.position().y() );
		
		for( let ee = 0; ee < this.game().events().length; ee++ ) {
			let e = this.game().events()[ ee ];
			if( e.target != this.game().graphicsNode() ) continue;
			switch( e.type ) {
			case "mouseup":
				this._moveByClick( e );
				e.preventDefault();
				break;
			case "mousedown":
				//game.say( e.button );
				break;
			case "mousemove":
				this._moveCursor(e);
				break;
			}
		}
		
		this._drawCursor();
		this._drawTargetPoints();
	}
	
	
//#private:
	_moveByClick( e ) {
		let w = this.game().config().cellWidth;
		let h = this.game().config().cellHeight;
		let targetPos = Point.fromPoint(this._targetPos);
		targetPos.setX( targetPos.x() + w/2 );
		targetPos.setY( targetPos.y() + h/2 );
		
		let where = targetPos;
		if( e.button == 0 && e.shiftKey ){
			this.linkedObject().rotateTo( where );
		}
		else if( e.button == 0 ){
			if( this._canGoTo( this._targetPos ) )  {
				this.linkedObject().goOverObstaclesTo( where );
			}
		}
	}
	
	
	_getTargetXY(e, dx,dy){
		if( !(e) ) return new Point(0,0);
		let w = this.game().config().cellWidth;
		let h = this.game().config().cellHeight;
		
		let x = this.game().camera().worldX(e.absX);
		let y = this.game().camera().worldY(e.absY);
		return new Point(
			(Math.floor((x) / Number(w))+Number(dx))*w, 
			(Math.floor((y) / Number(h))+Number(dy))*h );
	}
	
	
	_drawCursor(){
		if( this._mouseEvent == null ) return;
		
		let gfx = this.game().graphics();
		gfx.setTransform();
			let w = this.game().config().cellWidth;
			let h = this.game().config().cellHeight;
			let targetX = this.game().camera().displayX( this._targetPos.x() );
			let targetY = this.game().camera().displayY( this._targetPos.y() );
			
			gfx.lineWidth = 1;
			gfx.strokeStyle = this._getMoveCursorStyle();
			gfx.strokeRect( targetX, targetY, w,h );
			//gfx.translate( targetX+w*0.5, targetY+h*0.5 );
			gfx.translate( this._mouseEvent.absX+w*0.0, this._mouseEvent.absY+h*0.0 );
			gfx.rotate( Math.PI*2/8 );
			for( let r = 0; r < 4; r++ ){
				gfx.lineWidth = 1;
				gfx.beginPath();
				gfx.moveTo( w*1/16, h*0/16 );
				gfx.lineTo( w*3/16, h*0.0 );
				gfx.stroke();
				gfx.rotate( Math.PI*2/4 );
			}
		gfx.setTransform();
	}
	
	
	_drawTargetPoints(){
		let gfx = this.game().graphics();
		
		gfx.setTransform();
		gfx.fillStyle = this._getMoveCursorStyle( true );
		
		let points = this.linkedObject().targetPoints();
		let nextPointIndex = this.linkedObject().goToStatus().targetPointIndex;
		for( let p = nextPointIndex; p < points.length; p ++ ){
			let x = this.game().camera().displayX( points[p].x() );
			let y = this.game().camera().displayY( points[p].y() );
			let s = 4;
			gfx.fillRect( x - s/2, y - s/2,  s, s );
		}
	}
	
	
	_getMoveCursorStyle( noReaction ){
		if( this._canGoTo(this._targetPos) || noReaction ) return "rgba(100,255,100, 64)";
		return "rgba(255, 100, 100, 64)";
	}
	
	
	_canGoTo( pos ){
		let maze = this.game().level().specialObject( GAMEOBJECT_SPECIALINDEX_MAZE );
		if( !maze ) {
			//this.game().say("NO MAZE");
			return true;
		}
		
		let indexes = maze.cellIndexesByPoint(pos, new Point(0.5,0.5));
		//this.game().say( indexes );
		return !maze.isObstacleCell( indexes.x(), indexes.y() );
	}
	
	
	_moveCursor(e){
		this._targetPos = this._getTargetXY(e, -0.0, -0.0);
		this._mouseEvent = e;
	}
}
//====== End ControlPCBehavior =====