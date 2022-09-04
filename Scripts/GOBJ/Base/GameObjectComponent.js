

"use strict"




//===== Game Object Component ======
	class GameObjectComponent {
		constructor(id){
			this._linkedObject = null;
			this._id = ""+(id);
		}
	
		id(){ return this._id; }	
	
		onUpdate(){ notImplementedFunction("GameObjectComponent.onUpdate"); }
		
		onBear(){ }
		
		onDie(){ }
		
		
		linkTo( obj ) {
			if( !(obj instanceof GameObject) ){
				throw( `Attempt to link component ${this.id()} to not object` );
			}
			if( this._linkedObject == null ){
				this._linkedObject = obj;
			}
			else if( this._linkedObject != obj ) {
				throw( `Can't re-link component ${this.id()} to other object`  );
			}
		}
	
		
		unlink() {
			if( this._linkedObject != null ){
				this._linkedObject = null;
			}
		}
		
		
		linkedObject(){ return this._linkedObject; }
		
		game(){ return this._linkedObject.game(); }
	}
//===== End GameObject Component ======