

"use strict"



class Camera extends CameraInterface {
	constructor(){
		super();
		this._x =0; this._y=0;
		this._GW =1; this._GH=1;
	}
	
	
	setScreenSizes( w, h ){
		this._GW = Number(w);
		this._GH = Number(h);
	}
	
	screenWidth(){ return this._GW; }
	screenHeight(){ return this._GH; }
	
	
	/*
		s = w;
		w = s + d - G/2;
		d = G/2 - s + w;
	*/
	moveToWorldXY( wX, wY ){
		this._x=( wX );
		this._y=( wY );
	}
	
	
	displayX( wX ){
		return this._GW/2.0 - this._x + wX;
	}
	
	displayY( wY ){
		return this._GH/2.0 - this._y + wY;
	}
	
	
	worldX( dX ){
		return this._x + dX - this._GW/2;
	}
	
	worldY( dY ){
		return this._y + dY - this._GH/2;
	}

}