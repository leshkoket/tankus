
"use strict"






//=== Game Object ===
	const GAMEOBJECT_STATE_JUST_CREATED = 5;
	const GAMEOBJECT_STATE_LIVING = 6;
	const GAMEOBJECT_STATE_DEAD = 7;
	
	
class GameObject {
	constructor( kind, position, size ) {
		this._kind = kind+"";
		this._position = Point.fromPoint(position);
		this._size = Point.fromPoint(size);
		this._rotationRad = 0.0;
		
		this._state = GAMEOBJECT_STATE_JUST_CREATED;
		
		this._game = null;
		this._components = new Array();
		
		this._gotoMover = new GameObjectMover();
		this.appendComponent( this._gotoMover );
	}
	
	
	toString(){
		return `obj.${this.kind()}`;
	}
	
	
	game(){ return this._game; }
	
	state(){ return this._state; }
	
	kind(){ return this._kind; }
	
	
	position(){ return this._position; }
	
	setPosition( p ){ this._position.set(p); }
	
	
	size(){ return this._size; }
	
	setSize(p){ this._size.set(p); }
	
	
	rotationRad(){ return this._rotationRad; }
	
	setRotationRad(value){ this._rotationRad = value; }
	
	specialIndex(){  return GAMEOBJECT_SPECIALINDEX_NONE; }
	
	
	goToStatus(){ return this._gotoMover.status(); }
	
	goToState(){ return this.goToStatus().state; }
	
	targetPoint(){ return this._gotoMover.targetPoint(); }
	
	targetPoints(){ return this._gotoMover.targetPoints(); }
	
	goToFlags(){ return this.goToStatus().params.flags;  }
	
	
	displayPoint(){
		if( this._game == null ) return Point.fromPoint( this._position );
		let c = this._game.camera();
		return new Point( c.displayX(this._position.x()), c.displayY(this._position.y()) );
	}
	
	
	goTo( targetPoint, properties, flags ) {
		this._gotoMover.goTo( targetPoint, properties, flags );
		this.onGoTo( properties );
	}
	
	
	rotateTo( targetPoint, properties ){
		this.goTo( targetPoint, properties, GAMEOBJECT_GOTOFLAGS_ROTATEONLY );
	}
	
	
	goOverObstaclesTo( targetPoint, properties ){
		this.goTo( targetPoint, properties, GAMEOBJECT_GOTOFLAGS_OVEROBSTACLES );
	}
	
	
	readMetaData(data){
		if(data){
			this.onReadMetaData(data);
		}
	}
	
	
	enumComponents(){
		return this._components.concat([]);
	}
	
	appendComponent(c){
		if( !(c instanceof GameObjectComponent) ){
			throw( `Attempt to add ${typeof(c)} as component` );
		}
		if( (this._components.includes(c)) ){
			return;
		}
		c.linkTo( this );
		this._components.push( c );
	}
	
	componentsCount(){
		return this._components.length;
	}
	
	
	
	bear(game){
		if( game != null && this._state == GAMEOBJECT_STATE_JUST_CREATED ){
			this._game = game;
			this.onBear();
			for( var i = 0; i < this._components.length; i++ ){
				this._components[i].linkTo( this );
				this._components[i].onBear();
			}
			this._state = GAMEOBJECT_STATE_LIVING;
		}
	}
	
	
	update(game){
		this.bear(game);
		if( game && this._state == GAMEOBJECT_STATE_LIVING ){
			this._game = game;
			this._baseUpdate();
			this.onUpdate();
			for( var i = 0; i < this._components.length; i++ ){
				this._components[i].linkTo( this );
				this._components[i].onUpdate();
			}
			this._baseEndUpdate();
		}
	}
	
	
	die(){
		if( this._game && this._state == GAMEOBJECT_STATE_LIVING ){
			this.onDie();
			for( let i = 0; i < this._components.length; i++ ){
				this._components[i].linkTo( this );
				this._components[i].onDie();
				this._components[i].unlink();
			}
			this._components = new Array();
			this._state = GAMEOBJECT_STATE_DEAD;
		}
	}
	
	
	
//#protected:
	onBear(){ /* NOTHING DO BY DEFAULT */ }
	
	onUpdate(){ notImplementedFunction("GameObject.onUpdate"); }
	
	onDie(){}
	
	
	onGoTo( properties ){ }
		
	onGoingTo(){}
		
	onStopGoTo(cancel){ }
	
	onReadMetadata(data){}
		
		
//#private:
	_baseUpdate(){
		if( this.goToState() != GAMEOBJECT_GOTOSTATE_NONE && 
				this.goToState() != GAMEOBJECT_GOTOSTATE_STOPPED ){
			this.onGoingTo();
		}
		this._checkGoTo();
	}
	
	
	_baseEndUpdate(){
		this._checkGoTo();
	}
	
	
	_checkGoTo(){
		//console.log("CCCC!" + this.goToState());
		if( this.goToState() == GAMEOBJECT_GOTOSTATE_STOPPED ) {
			this.onStopGoTo( this._gotoMover.lastGoingCancelled() );
			this._gotoMover.onUpdate();
		}
	}
	
	
}
//====== End Game Object ==========
