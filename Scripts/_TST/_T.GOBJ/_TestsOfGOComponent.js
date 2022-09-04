


describe( "Game Object Component Tests", function(){
	let obj = null;
	
	beforeEach(function(){
		obj = new FakeGameObject("", new Point(0,0), new Point(0,0));
	});
	
	
	afterEach(function(){
		obj = null;
	});
	
	
	describe( "obj. components collection", function(){
		
		it( "obj. add cmp. : ex & not-having -> added&linked", function(){
			let first = new FakeComponent("A");
			let second = new FakeComponent("B");
			
			obj.appendComponent( first );
			obj.appendComponent( second );
			let allFound = obj.enumComponents();
			
			assert.include( allFound, first );
			assert.include( allFound, second );
			assert.equal( obj, first.linkedObject() );
			assert.equal( obj, second.linkedObject() );
		});
		
		
		it( "obj. add cmp. : ex & having -> nope", function(){
			let first = new FakeComponent();
			let second = new FakeComponent();
			
			obj.appendComponent( first );
			obj.appendComponent( second );
			obj.appendComponent( first );
			
			assert.include( obj.enumComponents(), first );
			assert.include( obj.enumComponents(), second );
			assert.equal( obj, first.linkedObject() );
			assert.equal( obj, second.linkedObject() );
		});
		
		
		it( "obj. add cmp.: not-ex -> throws error", function(){
			assert.throws( function(){ obj.addComponent( null ); } );
			assert.throws( function(){ obj.addComponent( "x" ); } );
		});
		
		
		it("obj. enum cmps -> always new array", function(){
			let enum_0 = obj.enumComponents();
			let enum_1 = obj.enumComponents();
			
			assert.notEqual( enum_0, enum_1 );
		} );
		
		
		it("obj. cmps count", function(){
			const baseCount = obj.componentsCount();
			assert.equal( baseCount, obj.enumComponents().length );
			
			obj.appendComponent( new FakeComponent() );
			assert.equal( baseCount + 1, obj.componentsCount() );
			
			obj.appendComponent( new FakeComponent() );
			assert.equal( baseCount + 2, obj.componentsCount() );
		});
		
		
		it("link to object : ex & linked -> nope", function(){
			let first = new FakeComponent();
			first.linkTo( obj );
			
			first.linkTo( obj );
			
			assert.equal( obj, first.linkedObject() );
		} );
		
		
		it("link to object : ex & not linked -> linked now", function(){
			let first = new FakeComponent();
			first.linkTo( obj );
			
			assert.equal( obj, first.linkedObject() );
		});
		
		
		it( "link to object : other or unex -> throws error", function(){
			let first = new FakeComponent();
			first.linkTo( obj );
			let obj_2 = new EmptyGameObject();
			assert.throws( function(){ first.linkTo( obj_2 ); } );
			
			let secondar = new FakeComponent();
			assert.throws( function(){ secondar.linkTo(null); } );
			
			let third = new FakeComponent();
			assert.throws( function(){ third.linkTo("notObjectOfGame"); } );
		});
		
		
		it("unlink & unlink again & re-link", function(){
			let first = new FakeComponent();
			
			first.linkTo(obj);
			first.unlink();
			assert.equal( null, first.linkedObject() );
			
			first.unlink();
			assert.equal( null, first.linkedObject() );
			
			first.linkTo( obj );
			assert.equal( obj, first.linkedObject() );
		});
		
	});
	
	
	describe("obj. living with components", function(){
		
		it("obj living events: have cmps -> cmps called events", function(){
			let first = new FakeComponent();
			obj.appendComponent( first );
			let second = new FakeComponent();
			obj.appendComponent( second );
			
			first.fakeLog="";
			second.fakeLog="";
			
			obj.bear( new FakeGame() );
			assert.equal( "onBear()", first.fakeLog );
			assert.equal( first.fakeLog, second.fakeLog );
			
			obj.update( new FakeGame() );
			assert.equal( "onBear()onUpdate()", first.fakeLog );
			assert.equal( first.fakeLog, second.fakeLog );
			
			obj.die();
			assert.equal( "onBear()onUpdate()onDie()", first.fakeLog );
			assert.equal( first.fakeLog, second.fakeLog );
		});
		
		
		it("obj dead: having cmps -> no cmps&cmps unlinked now", function(){
			let first = new FakeComponent();
			obj.appendComponent( first );
			let second = new FakeComponent();
			obj.appendComponent( second );
			
			obj.bear( new FakeGame() );
			obj.die();
			
			assert.deepEqual( [], obj.enumComponents() );
			assert.equal( null, first.linkedObject() );
			assert.equal( null, second.linkedObject() );
		});
		
	});


} );