


"use strict"


class ImagesStorage {

	constructor() {
		this._all = new Map();
	}
	
	
	get( fileName ) {
		if( !this._all.get( fileName ) ){
			console.log( "load image"+ fileName );
			let image = new Image();
			image.onload = function(){ image.loaded = true; };
			image.onerror = function(){ console.log("Cant load image : "+ fileName); };
			this._all.set( fileName, image );
			image.src = fileName;
		}
		return this._all.get( fileName );
	}

}