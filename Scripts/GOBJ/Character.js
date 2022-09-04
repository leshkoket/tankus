

//=========== Character ===========
	const CHARACTER_COLORINDEX_RED = 0;
	const CHARACTER_COLORINDEX_BLUE = 1;
	const CHARACTER_COLORINDEX_GREEN = 2;
	const CHARACTER_COLORINDEX_YELLOW = 3;
	const CHARACTER_COLORS_COUNT = 4;
	const CHARACTER_COLOR_STRINGS = [
		"rgb(100%,0%,0%)",
		"rgb(0%,0%,100%)",
		"rgb(0%,80%,0%)",
		"rgb(80%,80%,0%)"
	];
	
class Character extends GameObject {
	constructor( kind, position, size,  drawer, behaviors ) {
		super( kind, position, size );
		if( behaviors == null ) behaviors = [];
		
		this._colorIndex = -1;
		
		this._drawer = drawer;
		this.appendComponent( drawer );
		for( var i = 0; i < behaviors.length; i++ ){
			this.appendComponent( behaviors[i] );
		}
	}
	
	
	drawer(){ return this._drawer; }
	
	
	enumBehaviors(){
		var all = this.enumComponents();
		var result = [];
		for( let i = 0; i < all.length; i++ ){
			if( all[i] != this.drawer() ){
				result.push( all[i] );
			}
		}
		return result;
	}
	
	
	colorIndex(){ return this._colorIndex; }
	
	setColorIndex(c){ this._colorIndex = c; }
	
	colorString(){
		if( !(this._colorIndex>= 0 && this._colorIndex < CHARACTER_COLORS_COUNT) ){
			return "rgb(25%,25%,25%)";
		}
		return CHARACTER_COLOR_STRINGS[ this._colorIndex ];
	}
	
	
	
//#protected: 
	onUpdate(){
	}
	
	
	onReadMetadata(data){
		if(data.colorIndex){
			this.setColorIndex( data.colorIndex );
		}
	}
}
//====== End Character ======


//===== No Character Drawer =====
class NoCharacterDrawer extends GameObjectComponent {
	constructor(){
		super( "" );
	}
	onUpdate(){ }
}
//==== End No Character Drawer ====
	

//===== Character Tank Drawer =====
class TankCharacterDrawer extends GameObjectComponent {
	constructor(){
		super( "drawer" );
		this._barsPos = 0.0;
	}
	
	
	onUpdate( ) {
		var char = this.linkedObject();
		var game = char.game(); 
		var gfx = game.graphics();
		
		if( char.goToState() == GAMEOBJECT_GOTOSTATE_GOING ) {
			this._barsPos += game.time().getShiftByNow(char.size().x()*0.25);
		}
		
		gfx.setTransform();
		let drawP = char.displayPoint();
		var drawX = drawP.x();//*game.config().cellWidth;
		var drawY = drawP.y();//*game.config().cellHeight;
		var drawW = char.size().x();
		var drawH = char.size().y();
		
		gfx.translate( drawX+drawW*0.0, drawY+drawH*0.0 );
		gfx.rotate( char.rotationRad() );
		gfx.translate( -drawW*0.5, -drawH*0.5 );
		
		var styleLegs = TankCharacterDrawer._getStyles().leg;
		const legScale = 0.25;
		styleLegs[3].barsPos = this._barsPos;
		this._rect( styleLegs, 0, drawH*(0.0), drawW, drawH*legScale );
		this._rect( styleLegs, 0, drawH*(1-legScale*1), drawW, drawH*legScale );
		styleLegs[3].barsPos = 0;
		
		var color = char.colorString();
		var bodyStyle = TankCharacterDrawer._getStyles().body;
		const bodyDecY = legScale*0.5;
		const bodyDecX  = 1/16.0;
		const upBodyDecY = bodyDecY+2/32;
		const upBodyDecX = bodyDecX + 1/8;
		this._body( color,bodyStyle, bodyDecX, bodyDecY, 0, 0, drawW, drawH );
		this._body( color,bodyStyle, upBodyDecX,upBodyDecY, 0,0, drawW, drawH );
		
		var headStyle = TankCharacterDrawer._getStyles().head;
		this._circle( headStyle, drawW*0.5, drawH*0.5,
			Math.min(drawW, drawH)*0.5*0.4 );
		
		var gunH = drawH*(3/16);
		var gunW = drawW*0.5*2;
		var tubeStyle = headStyle;
		gfx.scale( 0.5,1 );
		this._tube( tubeStyle, drawW*0.5*2, 0.5*(drawH-gunH), gunW, (gunH) );
		gfx.setTransform();
		
	}
	
	
//#private:
	static _styles_ = null;
	
	static _getStyles(){
		if( !TankCharacterDrawer._styles_ ){
			var styles = {
				leg : [ "rgb(30%,30%,30%)", "rgb(60%,60%,60%)", "rgb(40%,40%,40%)", 
					{ bars : true } ],
				body : [ "rgba(0%,0%,0%,0%)", "rgba(0%,0%,0%,30%)", 
					"rgba(100%,100%,100%,10%)" ],
				head : [ "rgb(30%,30%,30%)", "rgb(70%,70%,70%)", "rgb(60%,60%,60%)" ]
			};
			TankCharacterDrawer._styles_ = styles;
		}
		return TankCharacterDrawer._styles_;
	}
	
	
	_rect( s, drawX, drawY, drawW, drawH ) {
		var gfx = this.game().graphics();
		gfx.lineWidth = 4;
		gfx.strokeStyle = s[0];
		gfx.strokeRect( drawX, drawY, drawW, drawH );
		
		gfx.strokeStyle = s[1];
		gfx.lineWidth = 2;
		gfx.strokeRect( drawX, drawY, drawW, drawH );
		
		gfx.fillStyle = s[2];
		gfx.fillRect( drawX, drawY, drawW, drawH );
		
		if( s.length >= 4 ){
			var data = s[3];
			if( data.bars ){
				this._bars( s, drawX, drawY, drawW, drawH );
			}
		}
	}
		
	
	_tube( s, drawX,drawY, drawW,drawH ){
		var gfx = this.game().graphics();
		
		var r = drawH*0.5;
		this._rect( s,drawX,drawY, drawW,drawH );
		
		this._circle( ["rgba(0,0,0,0)","rgba(0,0,0,0)",s[2]], 
			drawX, drawY+drawH*0.5, r+2 );
			
		this._circle( [s[0],s[1],s[0]], drawX+drawW, drawY+drawH*0.5, r );
	}
	

	_bars( s, drawX, drawY, drawW, drawH ) {
		//if( s.length < 4 ) return;
		var gfx = this.game().graphics();
		
		var pos = s[3].barsPos;
		var count = 16;
		var t = drawW/count;
		
		gfx.lineWidth = 2;
		var x = 0;
		for( var i = 0.0; i < count; i+=2.0 ){
			x = ((pos+i)*t);
			if( x > drawW ) x %= drawW;
			gfx.strokeStyle = s[1];
			gfx.beginPath();
			gfx.moveTo( drawX +  x, drawY );
			gfx.lineTo( drawX + x, drawY+drawH );
			gfx.stroke();
		}
	}
	
	
	_circle( s, drawX, drawY, drawR ){
		var gfx = this.game().graphics();
		
		gfx.beginPath();
		gfx.arc( drawX, drawY, drawR,  0, Math.PI*2, false );
		
		gfx.lineWidth = 4;
		gfx.strokeStyle = s[0];
		gfx.stroke();
		
		gfx.lineWidth = 2;
		gfx.strokeStyle = s[1];
		gfx.stroke();
		
		gfx.fillStyle = s[2];
		gfx.fill();
	}
	
	
	_body( color, bodyStyle,  bodyDecX, bodyDecY,  bodyX, bodyY, bodyW, bodyH ){
		var gfx = this.game().graphics();
		
		bodyX += bodyDecX*bodyW;
		bodyY += (bodyDecY)*bodyH;
		bodyW -= (bodyDecX*2)*bodyW;
		bodyH -= (bodyDecY*2)*bodyH;
		
		gfx.fillStyle = color;
		gfx.fillRect( -1+bodyX, -1+bodyY, bodyW+2, bodyH+2 );
		this._rect( bodyStyle, bodyX,bodyY, bodyW,bodyH );
	}
}
//========= End Character Tank Drawer ==========
