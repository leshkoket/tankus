
"use strict"


class FakeComponent extends GameObjectComponent {

	constructor(id){
		super(""+id);
		this.fakeLog = "";
	}
	
	
	onBear(){
		this.fakeLog += "onBear()";
	}
	
	
	onDie(){
		this.fakeLog += "onDie()";
	}
	
	
	onUpdate(){
		this.fakeLog += "onUpdate()";
	}
	
	
}