
var should = require('should'); 
var assert = require('assert');
var request = require('supertest'); 

describe('User Authentication', function() {
	it('Register testing', function(done) {

		var params = {
			name: "mohan",
			email: "mohan@gmail.com",
			password: "mohan@123",
			confirm_password: "mohan@123"
		};
		
		var url = "http://127.0.0.1:8081";
		request(url)
			.post('/register')
			.send(params)
			.end(function(err, res) {
				if (err) {
					throw err;
				}
				var result = JSON.parse(res.text);
				assert.equal(result.success, false, 'validate');
				done();
			});
	});
});

describe('Product API\'s', function() {
	it('Fetch Products', function(done) {

		var url = "http://127.0.0.1:8081";
		request(url)
			.get('/products')
			.end(function(err, res) {
				if (err) {
					throw err;
				}
				var result = JSON.parse(res.text);
				
				for (var i =0; i < result.length; i++) {
					result[i].should.have.property('name');
					result[i].name.should.be.type('string');
					result[i].should.have.property('category');
					result[i].category.should.be.type('string');
					result[i].should.have.property('price');
					result[i].price.should.be.type('number');
				}

				done();
			});
	});
});


describe('Search Products', function() {
	it('search product', function(done) {
		var params = {
			name: "Apple"
		}

		var url = "http://127.0.0.1:8081";
		request(url)
			.get('/searchProduct')
			.send(params)
			.end(function(err, res) {
				if (err) {
					throw err;
				}
				var result = JSON.parse(res.text);
				
				for (var i =0; i < result.length; i++) {
					result[i].should.have.property('name', 'Apple');
					result[i].should.have.property('category');
					result[i].should.have.property('price');
					
					result[i].name.should.be.type('string');
					result[i].category.should.be.type('string');
					result[i].price.should.be.type('number');
				}
				
				done();
			});
	});


	it('search category', function(done) {
		var params = {
			category: "Fruits"
		}

		var url = "http://127.0.0.1:8081";
		request(url)
			.get('/searchProduct')
			.send(params)
			.end(function(err, res) {
				if (err) {
					throw err;
				}
				var result = JSON.parse(res.text);
				
				console.log(result);
				
				for (var i =0; i < result.length; i++) {
					result[i].should.have.property('name');
					result[i].should.have.property('category', 'Fruits');
					result[i].should.have.property('price');
					
					result[i].name.should.be.type('string');
					result[i].category.should.be.type('string');
					result[i].price.should.be.type('number');
				}
				
				done();
			});
	});

	it('search product in category', function(done) {
		var params = {
			name: "Apple",
			category: "Mobile"
		}

		var url = "http://127.0.0.1:8081";
		request(url)
			.get('/searchProduct')
			.send(params)
			.end(function(err, res) {
				if (err) {
					throw err;
				}
				var result = JSON.parse(res.text);
				
				for (var i =0; i < result.length; i++) {
					result[i].should.have.property('name', 'Apple');
					result[i].should.have.property('category', 'Mobile');
					result[i].should.have.property('price');
					
					result[i].name.should.be.type('string');
					result[i].category.should.be.type('string');
					result[i].price.should.be.type('number');
				}
				
				done();
			});
	});
});