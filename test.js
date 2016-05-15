
var should = require('should'); 
var assert = require('assert');
var request = require('supertest'); 


describe('Testing Fetch All Product API\'s', function() {
	it('get products', function(done) {

		var url = "http://127.0.0.1:3000";
		var headers = {
			'email': 'ashok@gmail.com',
			'Content-Type': 'application/json',
			'access_token': 'ucNPKb3n8bUwFVLwOkWHYS2U0mtUw31B'
		};

		request(url)
			.get('/product/products')
			.set(headers)
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


describe('Testing Search API', function() {
	it('search product', function(done) {

		var url = "http://127.0.0.1:3000";
		var headers = {
			'email': 'ashok@gmail.com',
			'Content-Type': 'application/json',
			'access_token': 'ucNPKb3n8bUwFVLwOkWHYS2U0mtUw31B'
		};

		request(url)
			.get('/product/search?name=Apple')
			.set(headers)
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

		var url = "http://127.0.0.1:3000";
		var headers = {
			'email': 'ashok@gmail.com',
			'Content-Type': 'application/json',
			'access_token': 'ucNPKb3n8bUwFVLwOkWHYS2U0mtUw31B'
		};

		request(url)
			.get('/product/search?category=Fruits')
			.set(headers)
			.end(function(err, res) {
				if (err) {
					throw err;
				}
				var result = JSON.parse(res.text);
				
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

		var url = "http://127.0.0.1:3000";
		var headers = {
			'email': 'ashok@gmail.com',
			'Content-Type': 'application/json',
			'access_token': 'ucNPKb3n8bUwFVLwOkWHYS2U0mtUw31B'
		};

		request(url)
			.get('/product/search')
			.set(headers)
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