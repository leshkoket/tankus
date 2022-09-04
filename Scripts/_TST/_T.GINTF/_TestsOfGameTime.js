
"use strict"



describe( "Game Time Tests", function(){
	const PRECISION = 20;
	
	function assertDefault( time ){
		assert.equal( 0, time.elapsedIndex(),   "#i" );
		assert.closeTo( 0, time.nowElapsedMsec(), PRECISION,   "nowmsec" );
		assert.closeTo( 0, time.elapsedMsec(), PRECISION,  "msec" );
		assert.equal( 0, time.prevElapsedMsec(),  "prevmsec" );
	}
	
	
	it("create", function(){
		let time = new GameTime();
		
		assertDefault(time);
	});
	
	
	it( "wait ms", function(){
		let time = new GameTime();
		let timeMSStart = Date.now();
		time.waitMsec( 100 );
		let timeMSNow = Date.now();
		
		assert.closeTo( 100, timeMSNow-timeMSStart, PRECISION );
		assert.closeTo( 100, time.elapsedMsec(), PRECISION );
		assert.closeTo( 100, time.nowElapsedMsec(), PRECISION );
		assert.equal( 0, time.elapsedIndex() );
	} );
	
	
	it( "pass iteration", function(){
		let time = new GameTime();
		
		time.waitMsec(100);
		assert.closeTo( 100, time.nowElapsedMsec(), PRECISION );
		assert.closeTo( 100, time.elapsedMsec(), PRECISION );
		assert.equal( 0, time.elapsedIndex() );
		assert.equal( 0, time.prevElapsedMsec() );
		
		time.passIteration();
		assert.equal( 1, time.elapsedIndex() );
		assert.closeTo( 0, time.nowElapsedMsec(), PRECISION );
		assert.closeTo( 100, time.elapsedMsec(), PRECISION );
		assert.closeTo( 100, time.prevElapsedMsec(), PRECISION );
		
		time.waitMsec(50);
		time.passIteration();
		assert.equal( 2, time.elapsedIndex() );
		assert.closeTo( 0, time.nowElapsedMsec(), PRECISION );
		assert.closeTo( 150, time.elapsedMsec(), PRECISION );
		assert.closeTo( 50, time.prevElapsedMsec(), PRECISION );
	} );
	
	
	
	it("reset", function(){
		let time = new GameTime();
		time.waitMsec(100);
		time.passIteration();
		
		time.reset();
		
		assertDefault( time );
	});
	
	
	it( "get shift / now", function(){
		let time = new GameTime();
		let shiftFirst = time.getShiftByNow( 2500 );
		assert.closeTo( 2.5, shiftFirst, 0.1 );
		
		time.waitMsec(100);
		time.passIteration();
		let shiftSecond = time.getShiftByNow( 3400 );
		assert.closeTo( 340, shiftSecond, 10 );
	});
	
	
	
	describe("Real Sys.Time", function(){
		it("now msec", function(){
			let systemTime = new SystemTime();
			
			let msec = systemTime.nowMsec();
			let msecExp = Date.now();
			
			assert.closeTo( (msecExp), (msec), PRECISION );
		});
		
		
		it("wait msec", function(){
			let systemTime =  new SystemTime();
			
			let msec_0 = systemTime.nowMsec();
			systemTime.waitMsec( 100 );
			let msec = systemTime.nowMsec();
			
			assert.closeTo( (100), (msec - msec_0), PRECISION );
		});
	});
	
	
	describe("Fake Sys. Time", function(){
		it("now msec", function(){
			let systemTime = new FakeSystemTime();
			
			assert.equal( 0, systemTime.fakeNowMsec );
			assert.equal( 0, systemTime.nowMsec() );
			
			systemTime.fakeNowMsec = 125;
			
			assert.equal( 125, systemTime.nowMsec() );
		});
		
		
		it("wait msec", function(){
			let systemTime = new FakeSystemTime();
			
			let realNowMsec_0 = Date.now();
			systemTime.fakeNowMsec = 45;
			systemTime.waitMsec(200);
			let realNowMsec = Date.now();
			
			assert.closeTo( 0, (realNowMsec - realNowMsec_0), PRECISION );
			assert.equal( 245, systemTime.nowMsec() );
			assert.equal( 245, systemTime.fakeNowMsec );
		});
	});
	
	
	describe("Game Time inc. System Time", function(){
		it("create with sys. time -> sys.time prop.", function(){
			let systemTime = new SystemTime();
			let gameTime = new GameTime( systemTime );
			
			assert.equal( systemTime, gameTime.systemTime() );
			
			let fakeSystemTime = new FakeSystemTime();
			gameTime = new GameTime( fakeSystemTime );
			
			assert.equal( fakeSystemTime, gameTime.systemTime() );
			
			gameTime = new GameTime();
			
			assert.isTrue( (gameTime.systemTime() instanceof SystemTime) );
			assert.isFalse( (gameTime.systemTime() instanceof FakeSystemTime) );
		});
		
		
		it("fake sys.: create -> props", function(){
			let fs = new FakeSystemTime();
			let g = new GameTime( fs );
			
			assertDefault( g );
		});
		
		
		it("fake sys: wait msec", function(){
			let fs = new FakeSystemTime();
			let g = new GameTime( fs );
			
			let realMsec_0 = Date.now();
			g.waitMsec( 200 );
			g.waitMsec( 50 );
			let realMsec = Date.now();
			
			assert.closeTo( 0, (realMsec - realMsec_0), PRECISION );
			assert.equal( 250, fs.nowMsec() );
			assert.equal( 250, g.nowElapsedMsec() );
			assert.equal( 250, g.elapsedMsec() );
		});
		
		
		it("fake sys.: pass iteration", function(){
			let fs = new FakeSystemTime();
			let g = new GameTime( fs );
			
			g.waitMsec( 60 );
			g.passIteration();
			
			assert.equal( 60, g.elapsedMsec() );
			assert.equal( 0, g.nowElapsedMsec() );
			assert.equal( 1, g.elapsedIndex() );
			assert.equal( 60, g.prevElapsedMsec() );
			
			g.waitMsec( 40 );
			g.passIteration();
			
			assert.equal( 100, g.elapsedMsec() );
			assert.equal( 0, g.nowElapsedMsec() );
			assert.equal( 2, g.elapsedIndex() );
			assert.equal( 40, g.prevElapsedMsec() );
		});
		
		
		it("fake sys.: get shift / now", function(){
			let fs = new FakeSystemTime();
			let g = new GameTime( fs );
			
			let shift_0 = g.getShiftByNow( 1234 );
			assert.closeTo( 1.234, shift_0,  0.001 );
			
			g.waitMsec(100);
			g.passIteration();
			let shift_1 = g.getShiftByNow(4567);
			assert.closeTo( 456.7, shift_1,  0.1 );
		});
		
		
		it("fake sys.: reset", function(){
			let fs = new FakeSystemTime();
			let g = new GameTime( fs );
			
			g.waitMsec(78);
			g.passIteration();
			g.waitMsec(57);
			g.reset();
			
			assertDefault( g );
			
			g.waitMsec(235);
			
			assert.equal( 235, g.elapsedMsec() );
			assert.equal( 235, g.nowElapsedMsec() );
		});
	});
	
	

} );