

"use strict"


//=== Empty Game Object ===
class EmptyGameObject extends GameObject {
	constructor(kind){
		super( ""+kind, new Point(0,0), new Point(0,0) );
		this.fakeSpecialIndex = GAMEOBJECT_SPECIALINDEX_NONE;
	}
	
	
	specialIndex(){  return this.fakeSpecialIndex;  }
	
	
	onUpdate(){ }
}
//=== End Empty Game Object ====



//=== Auto Die Game Object ===
class AutodieTestGameObject extends EmptyGameObject {
	constructor(kind){
		super(kind+"");
	}
	
	onUpdate(){
		this.die();
	}
}
//=== End Auto Die Game Object ===


//=== Autogenerating Game Object ===
class FakeGameObjectAutogenerator extends EmptyGameObject {
	constructor(kind){
		super(kind+"");
	}
	
	onUpdate(){
		let obj = new FakeGameObject(this.kind(), new Point(0,0), new Point(0,0));
		this.game().level().bearObject( obj );
	}
}
//=====


//==== Fake Game Object =====
class FakeGameObject extends GameObject {
	constructor( kind, pos,size ){
		super( kind, pos,size );
		this.fakeLog = "";
		this.fakeLastMetaData = null;
		this.fakeLastGoToProperties = null;
	}
	
	
	onGoTo( properties ){
		this.fakeLog += "onGoTo()";
		this.fakeLastGoToProperties = properties;
	}
	
	
	onGoingTo(){
		this.fakeLog += "onGoingTo()";
	}
	
	
	onStopGoTo( cancel ){
		this.fakeLog += `onStopGoTo(${cancel})`;
	}
	
	
	onUpdate() { 
		this.fakeLog += "onUpdate()";
	}
	
	
	onBear(){
		this.fakeLog += "onBear()";
	}
	
	
	onDie(){
		this.fakeLog += "onDie()";
	}
	
	
	onReadMetaData(data) {
		this.fakeLastMetaData = data;
		this.fakeLog += "onReadMetaData()";
	}
}
//===== End Fake Game Object ======