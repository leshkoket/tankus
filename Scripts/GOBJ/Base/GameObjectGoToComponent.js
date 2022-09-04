

"use strict"


//== Game Object Go To Properties ==
class GameObjectGoToProperties {
	constructor( velocity, rotatingVelocityRad ) {
		this.velocity = velocity;
		this.rotatingVelocityRad = rotatingVelocityRad;
	}
	
	
	static byDefault(){
		return new GameObjectGoToProperties( 25, Math.PI*0.5 );
	}
}
//== End Game Object Go To Properties ==



//=== Go To Params ====
const GAMEOBJECT_GOTOFLAGS_NONE = 0;
const GAMEOBJECT_GOTOFLAGS_ROTATEONLY = 1;
const GAMEOBJECT_GOTOFLAGS_OVEROBSTACLES = 2;

class GameObjectGoToParams extends GameObjectGoToProperties {
	constructor( basic, flags ){
		if( basic ){
			super( basic.velocity, basic.rotatingVelocityRad );
		}
		else {
			super( 0,0 );
		}
		
		this.flags = Number(flags);
	}
}
//==== End Go To Params ====



//==== Go To Status ====
const GAMEOBJECT_GOTOSTATE_NONE = 0;
const GAMEOBJECT_GOTOSTATE_START = 1;
const GAMEOBJECT_GOTOSTATE_ROTATING = 2;
const GAMEOBJECT_GOTOSTATE_GOING = 3;
const GAMEOBJECT_GOTOSTATE_STOPPED = 4;


class GameObjectGoToStatus {
	constructor( param, state, points ){
		if( !points ){ points = []; }
		
		this.params = param;
		this.state = state;
		this.targetPoints = points;
		this.targetPointIndex = 0;
	}
	
	
	currentTargetPoint(){
		if( (this.targetPointIndex >= 0) && (this.targetPointIndex < this.targetPoints.length) )
			return Point.fromPoint(this.targetPoints[ this.targetPointIndex ]);
		else
			return new Point(0,0);
	}
}
//==== End Go To Status ====



//====== Mover =======
class GameObjectMover extends GameObjectComponent {
	constructor( ){
		super( "" );
		
		this._rotatingDirection = 0;
		//this._goingTimer = 0;
		this._targetRotationRad = 0.0;
		
		this._status = new GameObjectGoToStatus( 
			new GameObjectGoToParams( null, GAMEOBJECT_GOTOFLAGS_NONE ), 
			GAMEOBJECT_GOTOSTATE_NONE, new Array() );
		
		this._lastResultCancelled = false;
	}
	
	
	targetPoint(){ return this._status.currentTargetPoint(); }
	
	targetPoints(){ return this._status.targetPoints; }
	
	status(){ return this._status; }
	
	lastGoingCancelled(){ return this._lastResultCancelled; }
	
	
	goTo( targetPoint, properties, flags ) {
		if( !flags ) flags = GAMEOBJECT_GOTOFLAGS_NONE;
		if( !properties )  properties = GameObjectGoToProperties.byDefault();
		
		this._status.targetPoints = [ Point.fromPoint(targetPoint) ];
		this._status.targetPointIndex = 0;
		
		this._status.state = GAMEOBJECT_GOTOSTATE_START;
		this._status.params = new GameObjectGoToParams( properties, flags );
		this._goingTo();
	}
	
	
	rotateTo( targetPoint, properties ){
		this.goTo( targetPoint, properties, GAMEOBJECT_GOTOFLAGS_ROTATEONLY );
	}
	
	
	cancelGoTo(){
		this._stopGoTo( true );
	}
	
	
	
	onUpdate(){
		this._goingTo();
	}
	
	
//#private:
	_goingTo(){
		if( this._status.state == GAMEOBJECT_GOTOSTATE_NONE ) return;
		
		switch( this._status.state ){
		case GAMEOBJECT_GOTOSTATE_START:
			this._theStartGoingTo();
			break;
			
		case GAMEOBJECT_GOTOSTATE_ROTATING:
			this._theRotatingTo();
			break;
			
		case GAMEOBJECT_GOTOSTATE_GOING:
			this._theGoingTo();
			break;
			
		case GAMEOBJECT_GOTOSTATE_STOPPED:
			this.status().state = GAMEOBJECT_GOTOSTATE_NONE;
			break;
		}
	}
	
	
	_stopGoTo( cancel ){
		if( this._status.state == GAMEOBJECT_GOTOSTATE_NONE ) return;
		
		this._status.params.flags = GAMEOBJECT_GOTOFLAGS_NONE;
		this._status.state = GAMEOBJECT_GOTOSTATE_STOPPED;
		this._status.targetPoints = [];
		
		this._lastResultCancelled = cancel;
	}
	
	
	_stopGoToStage(){
		if( this._status.targetPointIndex >= this._status.targetPoints.length-1 ){
			this._stopGoTo( false );
		}
		else {
			this._status.targetPointIndex ++;
			//this._status.state = GAMEOBJECT_GOTOSTATE_START;
			this._theStartGoingTo();
		}
	}
	
	
	
	_theStartGoingTo(){
		if( !this._theFindTargetPoints() ) return;
		
		this._theUpdateRotatingToTarget();
		//this._goingTimer = this.game().time().elapsedMsec();
		this._status.state = GAMEOBJECT_GOTOSTATE_ROTATING;
		//this._theRotatingTo();
	}
	
	
	_theFindTargetPoints() {
		if( (this._status.params.flags & GAMEOBJECT_GOTOFLAGS_OVEROBSTACLES) && 
				!(this._status.params.flags & GAMEOBJECT_GOTOFLAGS_ROTATEONLY) &&
				(this._status.targetPointIndex == 0) ){
			
			let mazePathFinder = this.game().level().specialObject( GAMEOBJECT_SPECIALINDEX_MAZEPATHFINDER );
			if( !mazePathFinder ) { this.cancelGoTo(); return false; }
			
			let maze = this.game().level().specialObject( GAMEOBJECT_SPECIALINDEX_MAZE );
			if( !maze ){ this.cancelGoTo(); return false; }
			
			let path = mazePathFinder.find( 
				maze.cellIndexesByPoint( this.linkedObject().position() ),
				maze.cellIndexesByPoint( this.targetPoint() )
			);
			
			let targetPoints = new Array();
			let startCell = maze.cellIndexesByPoint( this.linkedObject().position() );
			for( let s = 0; s < path.steps().length; s ++ ){
				let cell = path.steps()[s];
				if( cell.matches( startCell ) ) continue;
				
				cell.setX( cell.x() + 0.5 );
				cell.setY( cell.y() + 0.5 );
				let point = ( maze.cellPointByIndexes( cell ) );
				targetPoints.push( point );
			}
			
			if( (!path.isFound()) || (targetPoints.length == 0) ){ this.cancelGoTo(); return false; } 
			this._status.targetPoints = targetPoints;
		}
		
		return true;
	}
	
	
	
	_theUpdateRotatingToTarget(){
		let targetRad = Geom.correctAngleRad( 
			Geom.angleRadOfPoints( this.linkedObject().position(), this.targetPoint() ));
		let myRad = this.linkedObject().rotationRad();
		let directionRad = Geom.optimalRotatingDirectionRad( myRad, targetRad );
		
		this._rotatingDirection = directionRad;
		this._targetRotationRad =  (targetRad);
	}
	
	
	_theRotatingTo(){
		this._theUpdateRotatingToTarget();
		
		let params = this._status.params;
		let dRad = this._rotatingDirection * params.rotatingVelocityRad;
		dRad = this.game().time().getShiftByNow( dRad );
		//let dMsec = this.game().time().elapsedMsec() - this._goingTimer;
		
		this.linkedObject().setRotationRad( Geom.correctAngleRad(this.linkedObject().rotationRad() + dRad) );
		
		if( dRad == 0 || Math.abs(this.linkedObject().rotationRad() - this._targetRotationRad) <= Math.abs(dRad)*1.0 ) {
			this.linkedObject().setRotationRad( this._targetRotationRad );
			if( this._status.params.flags & GAMEOBJECT_GOTOFLAGS_ROTATEONLY ){
				this._stopGoTo( false );
			}
			else {
				this._status.state = GAMEOBJECT_GOTOSTATE_GOING;
			}
		}
	}
	
	
	_theGoingTo(){
		let params = this._status.params;
		let rad = Geom.angleRadOfPoints( this.linkedObject().position(), this.targetPoint() );
		let d = this.game().time().getShiftByNow( params.velocity );
		let dX = Math.cos( rad ) * d;
		let dY = Math.sin( rad ) * d;
		//console.log( "$$$"+d+":"+rad/Math.PI+":"+ Math.cos(rad));
		//dX = this.game().time().getShiftByNow( dX );
		//dY = this.game().time().getShiftByNow( dY );
		let arrivedX = 
			Math.abs(this.linkedObject().position().x() - this.targetPoint().x()) <= Math.abs(dX*1);
		let arrivedY =
			Math.abs(this.linkedObject().position().y() - this.targetPoint().y()) <= Math.abs(dY*1);
		if(!arrivedX)  this.linkedObject().position().setX( this.linkedObject().position().x() + dX );
		if(!arrivedY)  this.linkedObject().position().setY( this.linkedObject().position().y() + dY );
		if(arrivedX && arrivedY) {
			this.linkedObject().setPosition( this.targetPoint() );
			this._stopGoToStage();
		}
	}
	
}
//==== End Mover =====