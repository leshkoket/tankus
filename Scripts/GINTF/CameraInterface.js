
"use strict"



class CameraInterface {
	constructor(){
	}
	
	screenWidth(){ notImplementedFunction("Camera.screenWidth"); }
	screenHeight(){ notImplementedFunction("Camera.screenHeight"); }
	
	worldX( displayX ){ notImplementedFunction("Camera.worldX"); }
	worldY( displayY ){ notImplementedFunction("Camera.worldY"); }
	displayX( worldX ){ notImplementedFunction("Camera.displayX"); }
	displayY( worldY ){ notImplementedFunction("Camera.displayY"); }
	
	moveToWorldXY( worldX, worldY )
		{ notImplementedFunction("Camera.moveToWorldXY"); }
	
}