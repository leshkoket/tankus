
"use strict"


//===== GameObject Land =====
class Land extends GameObject {
	constructor( position, particlesCount, backgroundStyle, fillStyles, strokeStyles ) {
		super( "land", position, new Point(0,0) );
		
		this._particlesCount = Point.fromPoint(particlesCount);
		
		/*this.appendComponent( 
			new GrassLandDrawer( "grass", particlesCount, 
				backgroundStyle, fillStyles, strokeStyles ) );*/
	}
	
	
	specialIndex(){ return GAMEOBJECT_SPECIALINDEX_LAND; }
	
	
	particlesCount(){ return this._particlesCount; }
	
	
	particleSize(gfxNode){
		return new Point( 
			gfxNode.width/this._particlesCount.x(), 
			gfxNode.height/this._particlesCount.y() );
	}
	
	
	onUpdate(){
		var gfxNode = this.game().graphicsNode();
		this.setSize( new Point(gfxNode.width, gfxNode.height) );
		
		let image = this.game().resources().loadResource("Image", "Images/GrassUp.png");
		let gfx = this.game().graphics();
		
		if( image.loaded ){
			const CELL_EXTEND_SIZE = 14;
			let cellWidth = image.width - CELL_EXTEND_SIZE*2;
			let cellHeight = image.height - CELL_EXTEND_SIZE*2;
			let camera = this.game().camera();
			
			let startX = -(camera.worldX(0) % cellWidth) -CELL_EXTEND_SIZE;
			let startY = -(camera.worldY(0) % cellHeight) -CELL_EXTEND_SIZE;
			
			const EXTEND = 1;
			let countX = gfx.canvas.width / cellWidth + EXTEND*2;
			let countY = gfx.canvas.height / cellHeight + EXTEND*2;
			
			gfx.setTransform();
			gfx.fillStyle = "rgb(0%, 60%, 0%)";
			gfx.fillRect( 0,0, gfx.canvas.width, gfx.canvas.height );
			for( let iy = -EXTEND; iy < countY; iy ++ ){
			for( let ix = -EXTEND; ix < countX; ix ++ ){
				let x = ix * cellWidth + startX;
				let y = iy * cellHeight + startY;
				
				gfx.drawImage( image, x, y );//, cellWidth, cellHeight );
			}
			}
		}
	}
}
//======== End Land =======



//========= Grass Land Drawer ==========
class GrassLandDrawer extends GameObjectComponent {
	constructor (id, particlesCount, backStyle, fillStyles, strokeStyles){
		super( id );
		
		this._backgroundStyle = backStyle;
		this._fillStyles = fillStyles;
		this._strokeStyles = strokeStyles;
		
		this._windShift = 0.0;
		this._windShiftInc = 0.01;
	}
	
	
	
	onUpdate(){
		var obj = this.linkedObject();
		var gfx = obj.game().graphics();
		var gfxNode = obj.game().graphicsNode();
		var particlesCount = obj.particlesCount();
		var particleSize = obj.particleSize( gfxNode );
		var scaledX = obj.displayPoint().x()/particleSize.x();
		var scaledY = obj.displayPoint().y()/particleSize.y();
		
		scaledX %= particlesCount.x()+1;
		if( scaledX < 0 ) scaledX = particlesCount.x()+1+scaledX;
		scaledY %= particlesCount.y()+2;
		if( scaledY < 0 ) scaledY = particlesCount.y()+2+scaledY;
		
		/*let move = this.game().time().getShiftByNow( 10 );
		obj.setPosition( new Point(
			obj.position().x()+move, obj.position().y()+move) );*/
		
		gfx.fillStyle = this._backgroundStyle;
		gfx.fillRect( 0,0, gfxNode.width, gfxNode.height );
		gfx.setTransform();
		gfx.scale( particleSize.x(), particleSize.y() );
		
		for( var y = 0; y <= obj.particlesCount().y()+1; y++ ) {
			var yy = y + scaledY;
			if( yy > particlesCount.y()+2 ) yy %= particlesCount.y()+2;
			yy -= 2;
			
			for( var x = 0; x <= obj.particlesCount().x(); x++ ) {
				var i = (x+(y%2));
				var xx= x - ((y % 2)*0.5) + scaledX; 
				if(xx > particlesCount.x()+1) xx %= particlesCount.x()+1;
				xx -= 1;
								
				gfx.fillStyle = this._fillStyles[ i%this._fillStyles.length ];
				gfx.lineWidth = 0.06;
				var dw = (0.1+(i % 3)*0.1);
				var dh = (0.1+(i % 3)*0.1);
				gfx.beginPath();
				gfx.moveTo( xx+1.0+dw, yy+1.0+dh );
				gfx.lineTo( xx-dw, yy+1.0+dh );
				gfx.lineTo( xx+0.5+this._windShift*0.25, yy-dh+this._windShift );
				gfx.closePath();
				gfx.fill();
				
				if( this._strokes && this._strokeStyles.length != 0 ){
					gfx.strokeStyle = this._strokeStyles[ x%this._strokeStyles.length ];
					gfx.stroke();
				}
				
			}
		}
		
		gfx.setTransform();
		this._windShift = Math.sin( this._windShiftInc*2*Math.PI )*0.125;
		this._windShiftInc += 0.001;
	}
}
//======= End Grass Land Drawer =======
